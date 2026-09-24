export interface Project {
  name: string;
  description: string;
  group: string;
  repoUrl: string;
  demoUrl: string | null;
  thumbnail: string;
  status: "published" | "soon";
}

/** Display order for groups - anything not listed sorts after, alphabetically. */
export const GROUP_ORDER = ["Ancient world", "AI engineering", "Developer tools", "Games"] as const;
