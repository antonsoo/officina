import "./fonts/fonts.css";
import "./style.css";
import { renderSelected } from "./selected";
import type { Project, Workshop } from "./types";
import { filterProjects, groupNames, matchingWorkshops, parseCatalogue } from "./catalogue";

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
    btn.textContent = next === "dark" ? "Light" : "Dark";
    btn.setAttribute("aria-label", `Switch to ${next === "dark" ? "light" : "dark"} theme`);
  }
}

function renderWorkshop(w: Workshop): string {
  const base = import.meta.env.BASE_URL;
  return `<li data-workshop="${esc(w.id)}" hidden>
    ${w.thumbnail ? `<img class="workshop-thumb" src="${base}${esc(w.thumbnail)}" alt="${esc(w.title)}: actual workshop view" loading="lazy" width="1440" height="1000" />` : ""}
    <div class="workshop-text"><a class="workshop-demo" href="${esc(w.url)}">${esc(w.title)}</a>
    ${w.summary ? `<p class="workshop-summary">${esc(w.summary)}</p>` : ""}
    <a class="workshop-review" href="${esc(w.reviewUrl)}" aria-label="Recorded review: ${esc(w.title)}">Recorded review</a></div>
  </li>`;
}

function renderCard(p: Project): string {
  const base = import.meta.env.BASE_URL;
  const links = [`<a data-project-source href="${esc(p.repoUrl)}">Source</a>`];
  if (p.package) {
    links.unshift(`<a href="${esc(p.package.url)}">${esc(p.package.registry)}</a>`);
  }
  if (p.spaceUrl) {
    links.unshift(`<a href="${esc(p.spaceUrl)}">Hugging Face</a>`);
  }
  if (p.demoUrl) {
    links.unshift(`<a data-project-demo href="${esc(p.demoUrl)}">Live demo</a>`);
  }
  return `
    <li class="card" data-project="${esc(p.name)}">
      <div class="card-thumb">
        <img src="${base}${esc(p.thumbnail)}" alt="${esc(p.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">

        <h3 class="card-name">${esc(p.name)}</h3>
        ${p.workshops?.length ? `<section class="card-workshops" aria-label="${esc(p.name)} matching workshops" hidden><p class="workshop-label">Matching workshops</p><ul role="list">${p.workshops.map(renderWorkshop).join("")}</ul></section>` : ""}
        <p class="card-desc">${esc(p.description)}</p>
        ${
          p.study
            ? `<p class="card-study"><a href="${esc(p.study.url)}"><span class="study-label">Recorded evidence</span> ${esc(p.study.finding)}</a></p>`
            : ""
        }
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
        <span class="group-size">${groups.get(name)!.length} projects</span>
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
  document.getElementById("selected")!.innerHTML = renderSelected(published);
  container.innerHTML = `
    <div class="index-heading"><h2>All projects</h2><p>Search the work, the sources, or a question.</p></div>
    <form class="catalogue-controls" role="search" aria-label="Find a tool">
      <div class="search-row">
        <div class="search-field">
          <label for="tool-search">Find a tool</label>
          <input id="tool-search" type="search" placeholder="Try Greek, music, traces, or logs" autocomplete="off" maxlength="512" aria-controls="groups" />
        </div>
        <button class="clear-filters" type="reset">Clear filters</button>
        <button class="clear-filters" id="copy-search-link" type="button">Copy search link</button>
      </div>
      <p id="shared-filter-note" class="filter-link-note" role="alert" hidden></p>
      <div id="shared-filter-link" class="shared-filter-link" hidden>
        <label for="filter-link-url">Search and audience link</label>
        <input id="filter-link-url" readonly type="url" />
        <p id="filter-link-status" role="status"></p>
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
    <p class="evidence-note">Recorded evidence links to the version reviewed; live demos and packages can differ.</p>
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
  const byName = new Map(published.map((p) => [p.name, p]));
  const sections = [...container.querySelectorAll<HTMLElement>(".group")];
  const count = container.querySelector<HTMLElement>(".result-count")!;
  const empty = container.querySelector<HTMLElement>(".empty-results")!;
  const copy = container.querySelector<HTMLButtonElement>("#copy-search-link")!;
  const linkBox = container.querySelector<HTMLElement>("#shared-filter-link")!;
  const linkField = container.querySelector<HTMLInputElement>("#filter-link-url")!;
  const linkStatus = container.querySelector<HTMLElement>("#filter-link-status")!;
  const note = container.querySelector<HTMLElement>("#shared-filter-note")!;
  let audience = "";
  const incoming = new URLSearchParams(location.search);
  const query = incoming.get("q") ?? "";
  const group = incoming.get("audience") ?? "";
  if (incoming.getAll("q").length > 1 || incoming.getAll("audience").length > 1) {
    note.textContent = "This link repeats its search or audience. Showing all tools.";
  } else if (query.length > 512) {
    note.textContent = "This shared search is too long. Showing all tools.";
  } else if (group && !groupNames(published).includes(group)) {
    note.textContent = "This link’s audience is not in the catalogue. Showing all tools.";
  } else {
    search.value = query;
    audience = group;
  }
  note.hidden = !note.textContent;

  const update = (): void => {
    const matching = new Set(filterProjects(published, search.value, audience).map((p) => p.name));
    // Keep the controls and cards mounted so typing never steals focus or reloads images.
    for (const card of cards) {
      card.hidden = !matching.has(card.dataset.project!);
      const workshops = card.querySelector<HTMLElement>(".card-workshops");
      if (workshops) {
        const ids = new Set(
          matchingWorkshops(byName.get(card.dataset.project!)!, search.value).map((w) => w.id),
        );
        const hasMatches = !card.hidden && ids.size > 0;
        for (const row of workshops.querySelectorAll<HTMLElement>("[data-workshop]")) {
          row.hidden = !ids.has(row.dataset.workshop!);
        }
        workshops.hidden = !hasMatches;
        card.dataset.matchesWorkshops = String(hasMatches);
        const projectDemo = card.querySelector("[data-project-demo]");
        if (projectDemo) projectDemo.textContent = hasMatches ? "Project demo" : "Live demo";
        const projectSource = card.querySelector("[data-project-source]");
        if (projectSource) projectSource.textContent = hasMatches ? "Project source" : "Source";
        for (const rootDetail of card.querySelectorAll<HTMLElement>(".card-thumb, .card-desc, .card-study"))
          rootDetail.hidden = hasMatches;
      }
    }
    for (const section of sections) section.hidden = !section.querySelector(".card:not([hidden])");
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.group === audience));
    }
    count.textContent = `Showing ${matching.size} of ${published.length} tools`;
    empty.hidden = matching.size !== 0;
    copy.disabled = !search.value.trim() && !audience;
  };
  const reset = (): void => {
    search.value = "";
    audience = "";
    note.hidden = true;
    linkBox.hidden = true;
    // Clearing an incoming link should also clear it on the next reload.
    // Ordinary typing and audience changes never write a query to the address.
    const url = new URL(location.href);
    if (url.searchParams.has("q") || url.searchParams.has("audience")) {
      url.searchParams.delete("q");
      url.searchParams.delete("audience");
      history.replaceState(null, "", url);
    }
    update();
    search.focus();
  };
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("reset", (event) => {
    event.preventDefault();
    reset();
  });
  const changed = (): void => {
    note.hidden = true;
    linkBox.hidden = true;
    update();
  };
  search.addEventListener("input", changed);
  for (const button of buttons) {
    button.addEventListener("click", () => {
      audience = button.dataset.group!;
      changed();
    });
  }
  copy.addEventListener("click", async () => {
    const url = new URL(import.meta.env.BASE_URL, location.origin);
    if (search.value.trim()) url.searchParams.set("q", search.value.trim());
    if (audience) url.searchParams.set("audience", audience);
    url.hash = "catalogue";
    linkField.value = url.href;
    linkBox.hidden = false;
    linkField.focus();
    linkField.select();
    try {
      await navigator.clipboard.writeText(url.href);
      linkStatus.textContent = "Search link copied.";
    } catch {
      linkStatus.textContent = "Copy the selected link to share this search and audience.";
    }
  });
  container.querySelector("#show-all")!.addEventListener("click", reset);
  update();
}

async function loadCatalogue(container: HTMLElement, restoreFocus = false): Promise<void> {
  container.setAttribute("aria-busy", "true");
  document.querySelector("main")?.setAttribute("aria-busy", "true");
  container.innerHTML = '<p class="catalogue-message" role="status">Loading tools&hellip;</p>';
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}projects.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    renderCatalogue(parseCatalogue(await res.json()), container);
    if (location.hash === "#catalogue") container.scrollIntoView();
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
    document.querySelector("main")?.setAttribute("aria-busy", "false");
  }
}

async function main(): Promise<void> {
  app.innerHTML = `
    <a class="skip-link" href="#catalogue">Skip to tools</a>
    <header class="masthead wrap">
      <a class="owner" href="https://github.com/antonsoo">Anthony Mercer</a>
      <nav aria-label="Main navigation">
        <a href="#catalogue">Project index</a>
        <a href="https://github.com/antonsoo">GitHub ↗</a>
        <a href="https://praviel.com">PRAVIEL ↗</a>
        <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to ${currentTheme() === "dark" ? "light" : "dark"} theme">${currentTheme() === "dark" ? "Light" : "Dark"}</button>
      </nav>
    </header>
    <main class="wrap">
      <div class="title-block">
        <h1>Officina<span aria-hidden="true">.</span></h1>
        <p>Open-source work<br> by <a href="https://github.com/antonsoo">Anthony Mercer</a></p>
      </div>
      <section id="selected" aria-label="Selected work"></section>
      <div id="catalogue" tabindex="-1"></div>
    </main>
    <footer class="wrap">
      <p>Officina <span lang="la">/ workshop</span></p>
      <nav aria-label="Footer"><a href="https://github.com/antonsoo/officina">Page source</a><a href="mailto:anthony@praviel.com">Get in touch</a><a href="${import.meta.env.BASE_URL}FONT-LICENSE.txt">Font licenses</a><span>MIT licensed</span></nav>
    </footer>
  `;

  document.getElementById("theme-toggle")!.addEventListener("click", toggleTheme);

  await loadCatalogue(document.getElementById("catalogue")!);
}

void main();
