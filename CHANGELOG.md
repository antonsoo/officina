# Changelog

- Added Embater’s source-backed plan investigation, Greek/Latin discovery terms,
  actual public preview and pinned 34/38-column exercise.

All notable changes to this project are documented in this file.

## Unreleased

### Changed

- Replace the repeated card grid with selected experiments and a ruled project index.
  Introduce Anthony Mercer by name, with GitHub and PRAVIEL links.
- Feature the temple-count comparison, Greek octave names, Archimedes' circle argument
  and the trace reader. Publish Embater and Harmoniai in the index.
- Retain native search, explicit shared links, pinned evidence and keyboard focus.
  Move the long historical README into a linked guide.


### Added

- Discover Which Dorian through Greek interval words, compare the two meanings
  from one pitch, and save the sound with its Greek reading and printed sources.
  The selected music entry opens this experiment directly.

- Find Horos through Aristotle's horse-and-stone example or Greek instance-taking
  terms; follow a direct investigation, inspect its witnesses and original scan,
  and save a notebook with a commit-pinned audit.

- Read a matching workshop’s own activity summary and actual preview in a wider
  result. Clear restores the project overview, and project links are labeled
  separately from the matched workshop.
- Discover Syngraphe through its Greek building clauses and operate the inclusive
  width and exceptional first-segment experiments with a pinned source review.

- Find Euclid V.5 by its Greek or Latin words, compare 4,761 agreeing trials with
  an exact counterexample, and open the pinned source-and-operation review.

- Find Pappus's quadratrix through its source words and open the positive-time
  crossing beside the final-instant objection, with a pinned implementation review.
- Index source words and lesson names separately from card descriptions; Greek
  terms can be found without accents and combined with audience filters.
- Open Ptolemy’s string examination and Eratosthenes’ mesolabe directly, with
  real workshop thumbnails and pinned source reviews.

- Add Dioptra: Hero's unseen-tunnel survey with Greek readings, outside aiming
  pegs, a signed distance ledger and downloadable illustrated field books.

- Search by project, description, audience, or package registry, combined
  with audience filters and a live result count. Search stays in the page.
- Clear filters, an empty-results action, and a skip link for keyboard users.
- Catalogue validation at build and load time, with a retry for failed loads.
- Unit and Chromium/Firefox regression tests, including mobile layouts,
  keyboard focus, content escaping, local filtering, and accessibility.
- A card links to its package once the tool is on a registry (PyPI, crates.io
  or npm), next to the demo and source links: an optional `package` entry in
  `public/projects.json`.
- A card states what its tool found on real, public data, in one sentence that
  links to the study: an optional `study` entry (`finding`, at most 160
  characters, and `url`). Fifteen tools have one, each from a study in the
  tool's own repository. Findings are searchable.

### Changed

- Open Gonia at its Greek/Roman theatre experiment and Stoicheia at Euclid I.21,
  with the I.22 workshop reachable next. Refresh actual lesson screenshots and
  link immutable reviews; retain older subject keywords for discovery.

- Find Gnomon's opposite-face construction and polar azimuth evidence, and
  ToneMirror's per-voice pitch floor tradeoffs, through the catalogue's search.
  Link pinned studies and keep the physical/learner validation limits visible.
- Update Vite to 7.3.7 with the patched development editor launcher.

- Make DoRA norm inspection and saved AcroForm appearances searchable, with
  immutable links to native measurements and the required Fieldproof source upgrade.

- Make the published MLflow, native NUnit and PresentMon 2.6 workflows searchable.
  Link their current native producer studies, preserve source/registry boundaries,
  and identify the new Stutterscope producer replay separately from its older gold CSV.

- Feature concrete Contextscope prompt/media and Stutterscope native-clock
  counterexamples, retaining source and registry release boundaries. The native
  demo link opens an attributed filtered capture, with a current real screenshot.

- All 17 cards link to recorded evidence at public, immutable source revisions.
  Correct stale Logdelta and ToneMirror measurements, identify the statistic
  behind Planisphere and Stutterscope figures, and remove unsupported
  equivalence claims. Calendar and sundial cards now state their verification
  boundaries. The page distinguishes study revisions from demos and packages.
- The page's fonts are served by the page itself. They came from Google Fonts,
  the one request the page made to another origin; the same font files (every
  subset, as Google serves them to a current browser) are now in
  `src/fonts/`, with their SIL Open Font License texts. Nothing looks
  different: screenshots before and after match. The page now loads with
  every other host blocked.

### Security

- The built page carries a Content-Security-Policy. Scripts, styles, fonts and
  workers load from the page's own origin only, and `connect-src 'self'` has
  the browser refuse to send what you give the page to any other host, even
  for a script injected through a bug in how the page renders a file. Inline
  event handlers and `eval` are not allowed. Every control was exercised
  in Chromium and Firefox with a listener for policy violations: none.

### Accessibility

- Checked with axe-core (WCAG 2.1 A and AA, and its best-practice rules) in light and dark,
  at desktop and phone widths: no findings now. The faint text (2.97:1) and,
  in the dark theme, the
  crimson of links and group names (3.4:1) are now above 4.5:1, and the group
  names are `h2` headings between the page's `h1` and the cards' `h3`.

## [0.1.0] - 2026-09-24

Initial release.

### Added

- A single static page indexing the published (and upcoming) open-source
  tools, grouped by audience: Ancient world, AI engineering, Developer
  tools, Games.
- `public/projects.json` as the single source of truth for entries - name,
  description, group, repo URL, live-demo URL, thumbnail, and status
  (`published` or `soon`). Adding a project is one JSON entry and one image.
- Light and dark themes (system preference, with a manual toggle persisted
  in `localStorage`).
- `scripts/make_thumb.py`: cover-fit crop and WebP compression for card
  thumbnails, used for both fresh screenshots and cropped hero images from
  sibling repos.
