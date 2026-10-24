export interface Project {
  name: string;
  description: string;
  group: string;
  repoUrl: string;
  demoUrl: string | null;
  spaceUrl?: string;
  /** Where the tool installs from, once it is on a registry: shown as a link named after the registry. */
  package?: { registry: "PyPI" | "npm" | "crates.io"; url: string };
  thumbnail: string;
  status: "published" | "soon";
  /** What the tool found when it was run on real, public data: one sentence, and where the study is. */
  study?: { finding: string; url: string };
  /** Source words and lesson names that need not all fit in the card description. */
  searchTerms?: string[];
}

/** Display order for groups - anything not listed sorts after, alphabetically. */
export const GROUP_ORDER = ["Ancient world", "AI engineering", "Developer tools", "Games"] as const;
