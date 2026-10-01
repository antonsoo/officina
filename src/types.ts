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
}

/** Display order for groups - anything not listed sorts after, alphabetically. */
export const GROUP_ORDER = ["Ancient world", "AI engineering", "Developer tools", "Games"] as const;
