import type { Project, Workshop } from "./types.ts";
import { GROUP_ORDER } from "./types.ts";

function record(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} must be a nonempty string`);
  }
  return value;
}

function link(value: unknown, field: string): string {
  const result = text(value, field);
  const url = new URL(result);
  if (url.protocol !== "https:" || url.username || url.password || result !== result.trim()) {
    throw new Error(`${field} must be an HTTPS URL without credentials`);
  }
  return result;
}

function terms(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.length > 24) {
    throw new Error(`${field} must be an array of at most 24 terms`);
  }
  const seen = new Set<string>();
  return value.map((value: unknown) => {
    const term = text(value, field);
    if (term !== term.trim() || term.length > 80 || seen.has(searchable(term))) {
      throw new Error(`${field} must contain unique trimmed terms of at most 80 characters`);
    }
    seen.add(searchable(term));
    return term;
  });
}

function workshops(value: unknown, field: string): Workshop[] {
  if (!Array.isArray(value) || value.length > 12) {
    throw new Error(`${field} must be an array of at most 12 workshops`);
  }
  const ids = new Set<string>();
  return value.map((item: unknown) => {
    const entry = record(item, field);
    const id = text(entry.id, `${field}.id`);
    if (!/^[a-z][a-z0-9-]{0,39}$/.test(id) || ids.has(id)) {
      throw new Error(`${field}.id must be a unique lowercase identifier of at most 40 characters`);
    }
    ids.add(id);
    const title = text(entry.title, `${field}.title`);
    if (title !== title.trim() || title.length > 90) {
      throw new Error(`${field}.title must be trimmed and at most 90 characters`);
    }
    const searchTerms = terms(entry.searchTerms, `${field}.searchTerms`);
    if (!searchTerms.length) throw new Error(`${field}.searchTerms must identify the workshop`);
    return {
      id,
      title,
      url: link(entry.url, `${field}.url`),
      reviewUrl: link(entry.reviewUrl, `${field}.reviewUrl`),
      searchTerms,
    };
  });
}

/** Validate both at build time and at the fetch boundary; TypeScript cannot check JSON. */
export function parseCatalogue(value: unknown): Project[] {
  if (!Array.isArray(value)) throw new Error("The catalogue must be an array");
  const names = new Set<string>();
  return value.map((item: unknown, index) => {
    const entry = record(item, `Project ${index + 1}`);
    const name = text(entry.name, "name");
    const key = name.trim().toLowerCase();
    if (names.has(key)) throw new Error(`Duplicate project name: ${name}`);
    names.add(key);
    const thumbnail = text(entry.thumbnail, `${name}.thumbnail`);
    // Restrict image paths to files in thumbs, with no traversal or URL schemes.
    if (!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(thumbnail)) {
      throw new Error(`${name}.thumbnail must be an image path under thumbs/`);
    }
    if (entry.status !== "published" && entry.status !== "soon") {
      throw new Error(`${name}.status must be published or soon`);
    }
    const project: Project = {
      name,
      description: text(entry.description, `${name}.description`),
      group: text(entry.group, `${name}.group`),
      repoUrl: link(entry.repoUrl, `${name}.repoUrl`),
      demoUrl: entry.demoUrl === null ? null : link(entry.demoUrl, `${name}.demoUrl`),
      thumbnail,
      status: entry.status,
    };
    if (entry.spaceUrl !== undefined) {
      project.spaceUrl = link(entry.spaceUrl, `${name}.spaceUrl`);
    }
    if (entry.package !== undefined) {
      const pkg = record(entry.package, `${name}.package`);
      if (pkg.registry !== "PyPI" && pkg.registry !== "npm" && pkg.registry !== "crates.io") {
        throw new Error(`${name}.package.registry must be PyPI, npm, or crates.io`);
      }
      project.package = { registry: pkg.registry, url: link(pkg.url, `${name}.package.url`) };
    }
    if (entry.study !== undefined) {
      const study = record(entry.study, `${name}.study`);
      const finding = text(study.finding, `${name}.study.finding`);
      // One sentence on a card, not a paragraph.
      if (finding.length > 160) throw new Error(`${name}.study.finding must be at most 160 characters`);
      project.study = { finding, url: link(study.url, `${name}.study.url`) };
    }
    if (entry.searchTerms !== undefined) {
      project.searchTerms = terms(entry.searchTerms, `${name}.searchTerms`);
    }
    if (entry.workshops !== undefined) {
      project.workshops = workshops(entry.workshops, `${name}.workshops`);
    }
    return project;
  });
}

export function groupNames(projects: readonly Project[]): string[] {
  return [...new Set(projects.filter((p) => p.status === "published").map((p) => p.group))].sort((a, b) => {
    const ia = GROUP_ORDER.indexOf(a as (typeof GROUP_ORDER)[number]);
    const ib = GROUP_ORDER.indexOf(b as (typeof GROUP_ORDER)[number]);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

function searchable(value: string): string {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
}

/** Every search word must match; the audience filter narrows those results further. */
export function filterProjects(projects: readonly Project[], query = "", group = ""): Project[] {
  const words = searchable(query).trim().split(/\s+/).filter(Boolean);
  return projects.filter((project) => {
    if (project.status !== "published" || (group && project.group !== group)) return false;
    const haystack = searchable(
      [
        project.name,
        project.description,
        project.group,
        project.package?.registry ?? "",
        project.study?.finding ?? "",
        ...(project.searchTerms ?? []),
        ...(project.workshops?.flatMap((w) => [w.title, ...w.searchTerms]) ?? []),
      ].join(" "),
    );
    return words.every((word) => haystack.includes(word));
  });
}

/** Match one actual reader, without letting aliases from another room stand in for it. */
export function matchingWorkshops(project: Project, query: string): Workshop[] {
  const words = searchable(query).trim().split(/\s+/).filter(Boolean);
  if (!words.length || project.status !== "published") return [];
  const context = searchable(`${project.name} ${project.group}`);
  return (project.workshops ?? []).filter((workshop) => {
    const haystack = searchable([workshop.title, ...workshop.searchTerms].join(" "));
    return (
      words.some((word) => haystack.includes(word)) &&
      words.every((word) => context.includes(word) || haystack.includes(word))
    );
  });
}
