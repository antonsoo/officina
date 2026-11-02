import type { Project } from "./types";

interface Selection {
  id: string;
  project: string;
  subject: string;
  question: string;
  title: string;
  description: string;
  action: string;
  url: string;
  thumbnail: string;
  workshop?: string;
}

/** Each choice opens one concrete, already-published experiment. */
const selections: Selection[] = [
  {
    id: "roof",
    project: "embater",
    subject: "Architecture",
    question: "An eighth as tall, or an eighth taller?",
    title: "Measure the words above the roof.",
    description:
      "Vitruvius makes the middle ornament an eighth taller. Move a measuring envelope, read the Latin and keep the drawing with its complete printed sources.",
    action: "Measure the ornament",
    url: "https://antonsoo.github.io/embater/#order=doric&columns=6&view=roof&trial=0.5",
    thumbnail: "thumbs/embater-roof.png",
    workshop: "roof",
  },
  {
    id: "counterexample",
    project: "horos",
    subject: "Logic",
    question: "A true conclusion. A valid argument?",
    title: "Keep the premises. Break the conclusion.",
    description:
      "Aristotle changes a horse into a stone. Build both worlds: keep the premise forms true while moving the object that changes the conclusion.",
    action: "Build a counterexample",
    url: "https://antonsoo.github.io/horos/?investigation=two-worlds#workshop",
    thumbnail: "thumbs/horos.png",
    workshop: "two-worlds",
  },
  {
    id: "dorian",
    project: "harmoniai",
    subject: "Music",
    question: "Which Dorian are you hearing?",
    title: "One name. Two Dorians.",
    description:
      "Start on the same pitch. Hear the two degrees that differ between Greek and modern Dorian, then check Cleonides’ printed page.",
    action: "Hear the two Dorians",
    url: "https://antonsoo.github.io/harmoniai/compare.html?name=dorian#listen",
    thumbnail: "thumbs/harmoniai-names.png",
    workshop: "names",
  },
  {
    id: "circle",
    project: "stoicheia",
    subject: "Geometry",
    question: "Can a circle bound lose its proof?",
    title: "Change one estimate. Does the bound survive?",
    description:
      "Double a polygon’s sides in Archimedes’ circle argument. Alter a root estimate and inspect the point where the chain of inequalities stops supporting the claim.",
    action: "Try the circle argument",
    url: "https://antonsoo.github.io/stoicheia/circle.html",
    thumbnail: "thumbs/stoicheia-circle.png",
    workshop: "circle",
  },
  {
    id: "cord",
    project: "rajju",
    subject: "Measurement",
    question: "Do four cords miss the same way?",
    title: "Same error. Different miss.",
    description:
      "Give four source procedures the same chosen length errors. Compare their pegs, inspect the Sanskrit and printed pages, and keep the stated modern assumptions with your work.",
    action: "Compare the four cords",
    url: "https://antonsoo.github.io/rajju/field.html?corner=en&nearerr=10&farerr=0#cord-errors",
    thumbnail: "thumbs/rajju-errors.png",
    workshop: "cord-errors",
  },
  {
    id: "trace",
    project: "tracelens",
    subject: "Software",
    question: "What did the trace actually record?",
    title: "A trace is a record. Read what it contains.",
    description:
      "Open an OTLP or Jaeger trace, follow the spans, and inspect recorded token costs. The reader keeps your files in your browser.",
    action: "Open the trace reader",
    url: "https://antonsoo.github.io/tracelens/",
    thumbnail: "thumbs/tracelens.webp",
  },
];
const esc = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export function mountSelected(projects: Project[], container: HTMLElement): void {
  const available = selections.filter((s) =>
    projects.some((p) => p.name === s.project && p.status === "published"),
  );
  if (!available.length) {
    container.replaceChildren();
    return;
  }
  container.innerHTML = `<div class="selection-heading"><h2>Choose a question</h2><a href="#catalogue">Browse all projects</a></div><div class="question-desk"><div class="question-controls"><div class="question-tabs" role="tablist" aria-label="Questions to investigate" aria-orientation="vertical">${available.map((s, i) => `<button type="button" role="tab" id="question-${s.id}" aria-controls="question-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-question="${s.id}"><span class="question-subject">${esc(s.subject)}</span><strong>${esc(s.question)}</strong></button>`).join("")}</div><label class="question-mobile" for="question-choice">Choose an experiment<select id="question-choice">${available.map((s) => `<option value="${s.id}">${esc(s.subject)}: ${esc(s.action)}</option>`).join("")}</select></label><p class="question-keyboard">Arrow keys choose a question.<br />Tab enters its preview.</p></div><section id="question-panel" class="question-panel" role="tabpanel" tabindex="0"></section></div>`;
  const panel = container.querySelector<HTMLElement>("#question-panel")!;
  const buttons = [...container.querySelectorAll<HTMLButtonElement>("[data-question]")];
  const mobile = container.querySelector<HTMLSelectElement>("#question-choice")!;
  let selected = 0;
  function show(index: number, focus = false): void {
    selected = index;
    const s = available[index]!;
    const p = projects.find((p) => p.name === s.project)!;
    const review = p.workshops?.find((w) => w.id === s.workshop)?.reviewUrl ?? p.study?.url;
    for (const [i, b] of buttons.entries()) {
      b.setAttribute("aria-selected", String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    }
    mobile.value = s.id;
    panel.setAttribute("aria-labelledby", `question-${s.id}`);
    panel.innerHTML = `<div class="question-preview"><img src="${import.meta.env.BASE_URL}${esc(s.thumbnail)}" width="1200" height="900" alt="${esc(s.project)}: actual workshop view" decoding="async" /><p class="question-preview-status" role="status">Loading the workshop view…</p></div><div class="question-copy"><p class="question-project">${esc(s.project)}</p><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><div class="question-links"><a class="question-open" href="${esc(s.url)}">${esc(s.action)}</a>${review ? `<a class="question-review" href="${esc(review)}">Recorded review</a>` : ""}<a href="${esc(p.repoUrl)}">Project source</a></div></div>`;
    const image = panel.querySelector<HTMLImageElement>("img")!;
    const status = panel.querySelector<HTMLElement>(".question-preview-status")!;
    const loaded = (): void => {
      status.hidden = true;
    };
    const failed = (): void => {
      image.hidden = true;
      status.hidden = false;
      status.textContent = "Preview unavailable. The experiment and recorded review are linked below.";
    };
    image.addEventListener("load", loaded, { once: true });
    image.addEventListener("error", failed, { once: true });
    if (image.complete) {
      if (image.naturalWidth) loaded();
      else failed();
    }
    if (focus) buttons[index]?.focus();
  }
  for (const [i, b] of buttons.entries()) b.addEventListener("click", () => show(i));
  container.querySelector(".question-tabs")!.addEventListener("keydown", (event) => {
    const key = (event as KeyboardEvent).key;
    const next =
      key === "ArrowDown" || key === "ArrowRight"
        ? (selected + 1) % available.length
        : key === "ArrowUp" || key === "ArrowLeft"
          ? (selected + available.length - 1) % available.length
          : key === "Home"
            ? 0
            : key === "End"
              ? available.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    show(next, true);
  });
  mobile.addEventListener("change", () => {
    const i = available.findIndex((s) => s.id === mobile.value);
    if (i >= 0) show(i);
  });
  show(0);
}
