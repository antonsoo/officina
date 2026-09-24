import "./style.css";
import type { Project } from "./types";
import { GROUP_ORDER } from "./types";

const app = document.getElementById("app")!;

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function currentTheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function toggleTheme(): void {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("officina-theme", next);
  } catch {
    /* private browsing - the toggle still works for this page view */
  }
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = next === "dark" ? "☀️ Light" : "☽ Dark";
}

function groupSort(a: string, b: string): number {
  const ia = GROUP_ORDER.indexOf(a as (typeof GROUP_ORDER)[number]);
  const ib = GROUP_ORDER.indexOf(b as (typeof GROUP_ORDER)[number]);
  if (ia === -1 && ib === -1) return a.localeCompare(b);
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
}

function renderCard(p: Project): string {
  const base = import.meta.env.BASE_URL;
  const links = [`<a href="${esc(p.repoUrl)}">Source</a>`];
  if (p.demoUrl) {
    links.unshift(`<a href="${esc(p.demoUrl)}">Live demo</a>`);
  }
  return `
    <li class="card">
      <div class="card-thumb">
        <img src="${base}${p.thumbnail}" alt="${esc(p.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">
        <span class="tag">${esc(p.group)}</span>
        <h3 class="card-name">${esc(p.name)}</h3>
        <p class="card-desc">${esc(p.description)}</p>
        <div class="card-links">${links.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `;
}

function renderGroups(projects: Project[]): string {
  const visible = projects.filter((p) => p.status === "published");
  const groups = new Map<string, Project[]>();
  for (const p of visible) {
    const list = groups.get(p.group) ?? [];
    list.push(p);
    groups.set(p.group, list);
  }
  const groupNames = [...groups.keys()].sort(groupSort);

  return groupNames
    .map(
      (name) => `
    <section class="group">
      <div class="group-header">
        <span class="group-title">${esc(name)}</span>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid">
        ${groups
          .get(name)!
          .map(renderCard)
          .join("")}
      </ul>
    </section>
  `,
    )
    .join("");
}

async function main(): Promise<void> {
  const base = import.meta.env.BASE_URL;

  app.innerHTML = `
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle dark mode">
      ${currentTheme() === "dark" ? "☀️ Light" : "☽ Dark"}
    </button>
    <header class="masthead">
      <div class="wrap">
        <h1 class="wordmark">Officina<span class="dot">&middot;</span></h1>
        <p class="tagline">open-source tools by Anton Soloviev</p>
        <div class="rule"><span class="lozenge"></span></div>
        <p class="intro">
          AI/ML engineer in San Francisco. Small, focused tools, built and documented in the open.
        </p>
        <p class="contact-line">
          <a href="mailto:anton@praviel.com">anton@praviel.com</a>
          <span>&middot;</span>
          <a href="https://github.com/antonsoo">github.com/antonsoo</a>
          <span>&middot;</span>
          <a href="https://praviel.com">praviel.com</a>
        </p>
      </div>
    </header>
    <main class="wrap" id="groups">
      <p class="intro" style="text-align:center">Loading&hellip;</p>
    </main>
    <footer>
      <div class="wrap">MIT-licensed. Source for this page: <a href="https://github.com/antonsoo/officina">github.com/antonsoo/officina</a></div>
    </footer>
  `;

  document.getElementById("theme-toggle")!.addEventListener("click", toggleTheme);

  const groupsEl = document.getElementById("groups")!;
  try {
    const res = await fetch(`${base}projects.json`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const projects = (await res.json()) as Project[];
    groupsEl.innerHTML = renderGroups(projects);
  } catch (err) {
    groupsEl.innerHTML = `<p class="intro" style="text-align:center">Couldn't load the project list (${esc(
      String(err instanceof Error ? err.message : err),
    )}). Try <a href="https://github.com/antonsoo">github.com/antonsoo</a> directly.</p>`;
  }
}

void main();
