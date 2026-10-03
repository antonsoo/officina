import "./fonts/fonts.css";
import "./style.css";
import type { Project } from "./types";
import { filterProjects, groupNames, parseCatalogue } from "./catalogue";

const app = document.getElementById("app")!;

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  if (btn) {
    btn.textContent = next === "dark" ? "☀ Light" : "☽ Dark";
    btn.setAttribute("aria-label", `Switch to ${next === "dark" ? "light" : "dark"} theme`);
  }
}

function renderCard(p: Project): string {
  const base = import.meta.env.BASE_URL;
  const links = [`<a href="${esc(p.repoUrl)}">Source</a>`];
  if (p.package) {
    links.unshift(`<a href="${esc(p.package.url)}">${esc(p.package.registry)}</a>`);
  }
  if (p.spaceUrl) {
    links.unshift(`<a href="${esc(p.spaceUrl)}">Hugging Face</a>`);
  }
  if (p.demoUrl) {
    links.unshift(`<a href="${esc(p.demoUrl)}">Live demo</a>`);
  }
  return `
    <li class="card" data-project="${esc(p.name)}">
      <div class="card-thumb">
        <img src="${base}${esc(p.thumbnail)}" alt="${esc(p.name)} screenshot" loading="lazy" width="1200" height="750" />
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
  return groupNames(visible)
    .map(
      (name) => `
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${esc(name)}</h2>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid" role="list">
        ${groups.get(name)!.map(renderCard).join("")}
      </ul>
    </section>
  `,
    )
    .join("");
}

function renderCatalogue(projects: Project[], container: HTMLElement): void {
  const published = filterProjects(projects);
  if (!published.length) {
    container.innerHTML = '<p class="catalogue-message" role="status">No tools are listed yet.</p>';
    return;
  }
  container.innerHTML = `
    <form class="catalogue-controls" role="search" aria-label="Find a tool">
      <div class="search-row">
        <div class="search-field">
          <label for="tool-search">Find a tool</label>
          <input id="tool-search" type="search" placeholder="Try traces, calendars, or logs" autocomplete="off" aria-controls="groups" />
        </div>
        <button class="clear-filters" type="reset">Clear filters</button>
      </div>
      <div class="audiences" role="group" aria-label="Filter by audience">
        <button type="button" data-group="" aria-pressed="true">All tools <span>${published.length}</span></button>
        ${groupNames(published)
          .map(
            (group) =>
              `<button type="button" data-group="${esc(group)}" aria-pressed="false">${esc(group)} <span>${published.filter((p) => p.group === group).length}</span></button>`,
          )
          .join("")}
      </div>
    </form>
    <p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="groups">${renderGroups(published)}</div>
    <div class="empty-results" hidden>
      <h2>No matching tools</h2>
      <p>Try a different search or audience.</p>
      <button type="button" class="clear-filters" id="show-all">Show all tools</button>
    </div>
  `;
  const search = container.querySelector<HTMLInputElement>("#tool-search")!;
  const form = container.querySelector("form")!;
  const buttons = [...container.querySelectorAll<HTMLButtonElement>("[data-group]")];
  const cards = [...container.querySelectorAll<HTMLElement>("[data-project]")];
  const sections = [...container.querySelectorAll<HTMLElement>(".group")];
  const count = container.querySelector<HTMLElement>(".result-count")!;
  const empty = container.querySelector<HTMLElement>(".empty-results")!;
  let audience = "";

  const update = (): void => {
    const matching = new Set(filterProjects(published, search.value, audience).map((p) => p.name));
    // Keep the controls and cards mounted so typing never steals focus or reloads images.
    for (const card of cards) card.hidden = !matching.has(card.dataset.project!);
    for (const section of sections) section.hidden = !section.querySelector(".card:not([hidden])");
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.group === audience));
    }
    count.textContent = `Showing ${matching.size} of ${published.length} tools`;
    empty.hidden = matching.size !== 0;
  };
  const reset = (): void => {
    search.value = "";
    audience = "";
    update();
    search.focus();
  };
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("reset", (event) => {
    event.preventDefault();
    reset();
  });
  search.addEventListener("input", update);
  for (const button of buttons) {
    button.addEventListener("click", () => {
      audience = button.dataset.group!;
      update();
    });
  }
  container.querySelector("#show-all")!.addEventListener("click", reset);
  update();
}

async function loadCatalogue(container: HTMLElement, restoreFocus = false): Promise<void> {
  container.setAttribute("aria-busy", "true");
  container.innerHTML = '<p class="catalogue-message" role="status">Loading tools&hellip;</p>';
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}projects.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    renderCatalogue(parseCatalogue(await res.json()), container);
    if (restoreFocus) container.querySelector<HTMLInputElement>("#tool-search")?.focus();
  } catch {
    container.innerHTML = `
      <div class="catalogue-message">
        <p role="alert">The tool list couldn't be loaded. Try again, or browse <a href="https://github.com/antonsoo">GitHub</a> directly.</p>
        <button class="clear-filters" id="retry" type="button">Try again</button>
      </div>`;
    container.querySelector("#retry")!.addEventListener("click", () => void loadCatalogue(container, true));
    if (restoreFocus) container.querySelector<HTMLButtonElement>("#retry")!.focus();
  } finally {
    container.setAttribute("aria-busy", "false");
  }
}

async function main(): Promise<void> {
  app.innerHTML = `
    <a class="skip-link" href="#catalogue">Skip to tools</a>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to ${currentTheme() === "dark" ? "light" : "dark"} theme">
      ${currentTheme() === "dark" ? "☀ Light" : "☽ Dark"}
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
    <main class="wrap" id="catalogue" tabindex="-1"></main>
    <footer>
      <div class="wrap">MIT-licensed. Source for this page: <a href="https://github.com/antonsoo/officina">github.com/antonsoo/officina</a></div>
    </footer>
  `;

  document.getElementById("theme-toggle")!.addEventListener("click", toggleTheme);

  await loadCatalogue(document.getElementById("catalogue")!);
}

void main();
