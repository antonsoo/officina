import type { Project } from "./types";

/** Deliberate entry points, each into a working experiment rather than a topic page. */
export function renderSelected(projects: Project[]): string {
  const has = (name: string) => projects.some((p) => p.name === name);
  const base = import.meta.env.BASE_URL;
  const lead = has("embater")
    ? `<article class="feature feature-lead">
        <div class="feature-copy">
          <p class="eyebrow">01 / Architecture · Embater</p>
          <h2>Six across.<br>How many<br><i>down the side?</i></h2>
          <p>Vitruvius doubles the spaces between columns. The temples tell a less orderly story. Count them, compare the plans, and read the evidence.</p>
          <a class="feature-link" href="https://antonsoo.github.io/embater/compare.html">Count the columns <span aria-hidden="true">↗</span></a>
        </div>
        <a class="feature-image" href="https://antonsoo.github.io/embater/compare.html" tabindex="-1" aria-hidden="true"><img src="${base}thumbs/embater-count.png" width="1200" height="900" alt="" fetchpriority="high"></a>
      </article>`
    : "";
  const pieces = [
    has("harmoniai")
      ? `<article class="feature feature-small">
      <p class="eyebrow">02 / Music · Harmoniai</p>
      <h2>One name.<br><i>Two Dorians.</i></h2>
      <p>Start on the same pitch. Hear the two degrees that differ between Greek and modern Dorian, then check Cleonides’ printed page.</p>
      <a class="feature-link" href="https://antonsoo.github.io/harmoniai/compare.html?name=dorian#listen">Hear the two Dorians <span aria-hidden="true">↗</span></a>
    </article>`
      : "",
    has("stoicheia")
      ? `<article class="feature feature-small">
      <p class="eyebrow">03 / Geometry · Stoicheia</p>
      <h2>A circle bound.<br><i>A proof you can break.</i></h2>
      <p>Double a polygon’s sides. Change one root estimate. Find the point where Archimedes’ argument stops working.</p>
      <a class="feature-link" href="https://antonsoo.github.io/stoicheia/circle.html">Try the argument <span aria-hidden="true">↗</span></a>
    </article>`
      : "",
    has("tracelens")
      ? `<article class="feature feature-small">
      <p class="eyebrow">04 / Software · TraceLens</p>
      <h2>A trace is a record.<br><i>Read what it contains.</i></h2>
      <p>Open an OTLP or Jaeger trace, follow the spans, and inspect recorded token costs. Your files stay in your browser.</p>
      <a class="feature-link" href="https://antonsoo.github.io/tracelens/">Open the trace reader <span aria-hidden="true">↗</span></a>
    </article>`
      : "",
  ]
    .filter(Boolean)
    .join("");
  return lead || pieces
    ? `<div class="selection-label"><span>Selected work</span><a href="#catalogue">Browse the full index ↓</a></div>${lead}<div class="selected-rest">${pieces}</div>`
    : "";
}
