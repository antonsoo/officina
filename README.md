# officina

**An index of open-source tools by Anton Soloviev.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live demo](https://img.shields.io/badge/demo-antonsoo.github.io%2Fofficina-8B1E1E)](https://antonsoo.github.io/officina/)

A single static page that lists every published tool in one place - built
so there is one link to share on Upwork or with a client instead of a
dozen. Officina is Latin for workshop.

Search by name, task, or package registry, and narrow the list by audience.
Search stays in the page: it makes no requests and is not saved in the URL
or browser storage. Clear filters returns to the full catalogue.

![The officina index page, showing the header and the Ancient world section](docs/assets/hero.png)

## Live demo

**[antonsoo.github.io/officina](https://antonsoo.github.io/officina/)**

## How it works

Every entry lives in [`public/projects.json`](public/projects.json): name,
one-line description, audience group, repo URL, live-demo URL (or `null`
for a CLI-only tool), a thumbnail path, and a `status` of `published` or
`soon`. `soon` entries are fetched with everything else but not rendered,
so a project can be added to the data ahead of its public launch and
switched on later by flipping one field. Adding a project is one JSON
entry and one image - no other file changes.

The build checks the catalogue's fields, links, duplicate names, and thumbnail
files. The browser validates the fetched data too; a failed load offers a
retry and a link to the GitHub profile.

Each card also links to recorded evidence: a study or artifact verification
at an immutable source revision. Findings name the measured population or
conditions and a material limit. They describe that record, not necessarily
the linked demo or registry release. They are searchable alongside the
description. See the [2026-10-10 evidence audit](docs/evidence-audit-2026-10-10.md).
The [source update index](docs/source-updates-2026-10-10.md) links to the
corresponding fixes, reproductions and artifact checks across the repositories.
The [later source batch](docs/source-updates-2026-10-10-continuation.md) adds
grading provenance, cache-setting boundaries, timestamp gaps, MCP metadata
integrity, and freshly verified test-counter reconciliation.
The [verified updates and deployments](docs/verified-updates-2026-10-11.md) record
seven further fixes and six public builds, with before/after captures, installed
artifacts and 151 served-file hash comparisons.
The [document review and CI repairs](docs/verified-review-and-ci-2026-10-11.md)
cover invoice verification budgets, Unicode source locations, partial leaderboards
and failures recovered on retry, with installed checks and pinned public evidence.
The [Logdelta source repairs](docs/logdelta-integrity-and-offline-2026-10-11.md)
cover exact watches on damaged encoded logs and offline worker recreation, with
retained input bytes, native/browser parity and clean-build verification.
The [audio and MCP continuation](docs/verified-audio-and-mcp-2026-10-11.md) adds
first offline audio use, bounded name comparisons and duplicate-name detection,
with installed CLI captures and 28 matching ToneMirror production files.
The [frame-continuity repair](docs/stutterscope-frame-gaps-2026-10-11.md) preserves
Stutterscope's missing-row boundaries through analysis and export. The
[saved-audio library repair](docs/tonemirror-library-loading-2026-10-11.md) avoids
loading every recording just to browse ToneMirror's library, with migration and
byte-preservation evidence from desktop and phone browsers.
The [duplicate-evidence repair](docs/contextscope-duplicate-evidence-2026-10-11.md)
keeps Contextscope from treating chains of edits as interchangeable content,
with inspectable originals and a hash-checked public-history audit.
The [tied-outcome repair](docs/am-i-unlucky-tied-outcomes-2026-10-12.md)
keeps common first-attempt wins and guarantee ties from becoming false unlucky
results in Am I Unlucky, including its downloaded cards and offline fonts.

The [Trainspotter unreadable-value repair](docs/trainspotter-unreadable-values-2026-10-12.md)
keeps known unreadable positions as trajectory boundaries, removes cross-gap
claims and recovers a valid later setback. Installed CLI/browser evidence and
an exact replay of 4,259 cached public reports retain the source and deployment
boundaries.
The [registered-variant repair](docs/ghostchars-standardized-variants-2026-10-12.md)
keeps Ghostchars from deleting legitimate Unicode glyph selectors while
preserving payload detection, with installed file-repair evidence and an exact
scan/sanitizer/reveal replay of the cached public-text corpus.
The [lunar-boundary repair](docs/horologium-lunar-boundaries-2026-10-12.md)
keeps Horologium from skipping nearby new moons or mixing reconstructed year
labels, with independent interval checks, installed-package verification and
offline calendar evidence.
The [TraceLens message-event repair](docs/tracelens-event-messages-2026-10-12.md)
keeps damaged tool payloads inspectable and restores suppressed output events,
with installed CLI replays, offline browser evidence and verified source bytes.
The [Veil project-key repair](docs/veil-secret-formats-2026-10-12.md)
masks complete long token bodies that previously passed through or were only
partly masked, with synthetic SDK captures, actual downloads and source evidence.
The [Fieldproof convention repair](docs/fieldproof-mixed-conventions-2026-10-12.md)
keeps caller defaults from verifying contradictory interpretations of the same
PDF quote, with receipt compatibility and installed review/export evidence.
The [Splitscope exact-tie repair](docs/splitscope-pb-ties-2026-10-12.md)
keeps equal recorded times from inflating PB forecasts, with an unchanged public
history, integer-arithmetic replay and actual offline exports.
The [ToneMirror correlation study](docs/tonemirror-correlation-2026-10-12.md)
records faster real-speech uploads, an unchanged 580-recording pitch replay,
and verified source bytes, with separate native and browser timing limits.
The [Errorbars feasibility repair](docs/errorbars-binary-feasibility-2026-10-12.md)
rejects impossible binary evaluation plans and explains correlation-imposed
minimum gaps, with independent joint tables and replayed offline downloads.
The [Ghostchars repair-write fix](docs/ghostchars-atomic-repair-2026-10-12.md)
preserves source bytes under real kernel write failures and interrupted writes,
with installed-package replays and explicit metadata and I/O-cost limits.
The [Trainspotter LR gap repair](docs/trainspotter-lr-gaps-2026-10-12.md)
keeps supported schedule changes visible around damaged readings, with a
controlled optimizer capture and unchanged findings on the available public logs.
The [Fieldproof OCR fallback repair](docs/fieldproof-ocr-fallback-2026-10-12.md)
makes the documented scanned-PDF CLI workflow work, with actual Tesseract
captures, explicit OCR provenance and installed-package coordinate checks.
The [Stutterscope stream-identity repair](docs/stutterscope-stream-identity-2026-10-12.md)
keeps applications separate after process IDs are removed, with corrected FPS
and stutter results, installed CLI replays and unchanged public-capture controls.
The [mcplint environment-removal repair](docs/mcplint-env-unset-2026-10-12.md)
honors variables explicitly removed from a server configuration, with actual
child-process observations and installed checks on Node 20 and 24.
The [mcplint environment-file syntax repair](docs/mcplint-envfile-syntax-2026-10-12.md)
keeps inline comments out of credentials and preserves quoted values, verified
against VS Code's parser and actual local authentication fixtures.
The [Veil credential-URL repair](docs/veil-credential-urls-2026-10-12.md)
masks complete signed cloud links and OAuth fragment tokens, with offline
SDK-generated examples, exact restoration and actual browser downloads.
The [ToneMirror loop playback repair](docs/tonemirror-loop-playback-2026-10-12.md)
keeps the waveform cursor aligned with native audio after loop entry and edits,
with measured before/after playback in Chromium and Firefox.
The [TraceLens text-integrity repair](docs/tracelens-text-integrity-2026-10-12.md)
rejects damaged encodings before they can merge different operation names,
with installed CLI checks and offline comparison-preservation evidence.
The [Contextscope numeric-integrity repair](docs/contextscope-numeric-integrity-2026-10-12.md)
rejects precision loss that made distinct record IDs look like identical cached
prompts, with SDK captures, Decimal comparisons and installed/browser evidence.
The [Ghostchars terminal-output repair](docs/ghostchars-pretty-preview-2026-10-12.md)
keeps every finding inspectable without repeatedly printing entire long lines,
with measured public-input output and unchanged machine reports and repairs.
The [mcplint HTTP redirect repair](docs/mcplint-http-redirects-2026-10-12.md)
keeps API keys and MCP session headers within the configured origin, with
receiver-side captures and installed CLI checks for both HTTP transports.
The [Logdelta Markdown repair](docs/logdelta-markdown-literals-2026-10-12.md)
keeps logged backticks, images and links literal in review reports, with
reference-renderer captures and an installed minimum-Rust replay.
The [Horologium planetary-frame correction](docs/horologium-planet-frame-2026-10-12.md)
aligns planet pointers with the selected date's equinox, with independent JPL/ERFA
comparisons, settled browser-needle measurements and explicit remaining errors.
The [Horologium lunar-series correction](docs/horologium-lunar-series-2026-10-12.md)
fixes malformed lunar terms that shifted conjunctions and reconstructed dates,
with independent ephemeris evidence and bounded reuse for repeated calculations.
The [Flakemap Markdown repair](docs/flakemap-markdown-literals-2026-10-12.md)
keeps test names and run evidence literal in PR reports, with actual pytest XML,
reference-rendered output and installed-package/browser verification.
The [Fieldproof column-evidence check](docs/fieldproof-column-evidence-2026-10-12.md)
flags quantity/price swaps that preserve multiplication, with retained header
locations, installed review flows and explicit negative external coverage.
The [Veil IPv6 literal repair](docs/veil-ip-literals-2026-10-12.md)
closes mixed-address and scope-ID leaks, with complete CLI/SDK redactions,
exact restoration and unchanged public-text detections.
The [Contextscope literal-token repair](docs/contextscope-token-literals-2026-10-12.md)
lets tokenizer code and delimiter strings survive import, with native ordinary-text
counts, installed CLI/browser replays and unchanged historical reports.
The [Errorbars table-import repair](docs/errorbars-table-imports-2026-10-12.md)
refuses duplicate DataFrame columns and damaged quoted CSV, with preserved output
files and unchanged valid comparisons in clean installed-package replays.
The [Errorbars personal-run import check](docs/errorbars-own-run-imports-2026-10-12.md)
prevents malformed SWE-bench reports from becoming zero scores, while retaining
valid exports and the previous browser comparison.
The [Am I Unlucky input repair](docs/am-i-unlucky-simple-inputs-2026-10-12.md)
prevents fractional and empty counts from silently becoming different observations,
and removes stale cards immediately while preserving valid sharing.
The [Horologium Qadimi correction](docs/horologium-qadimi-2026-10-12.md)
identifies the calendar variant and replaces a false seasonal-alignment claim
with a community-calendar reference; the date arithmetic remains unchanged.
The [Fieldproof spreadsheet export](docs/fieldproof-spreadsheet-2026-10-12.md)
keeps identifiers and formula-like text literal in XLSX, with actual spreadsheet
imports, offline browser downloads and installed-package evidence.
The [Trainspotter chart-identity repair](docs/trainspotter-chart-identity-2026-10-12.md)
preserves complete metric names under an explicit single-run declaration and
rejects ambiguous labels that previously discarded or relabeled evaluation loss.
The [Contextscope grouping repair](docs/contextscope-finding-groups-2026-10-12.md)
keeps warnings and distinct message variants visible while preserving repeated
equivalent findings, request navigation and numerical output.
The [ToneMirror practice-region workflow](docs/tonemirror-practice-regions-2026-10-12.md)
extracts reusable passages from recordings for comparison and saving, with
keyboard selection, reversible trims and recorded-speech sample checks.
The [Ghostchars Unicode security-data correction](docs/ghostchars-unicode-security-data-2026-10-12.md)
recovers missed identifier lookalikes with upstream mapping checks, runnable
JavaScript evidence and installed CLI/browser verification.
The [ToneMirror audio download](docs/tonemirror-wav-export-2026-10-12.md)
takes recordings and kept excerpts out of browser storage, with exact-sample
WAVs, retained synthetic labels and independently decoded speech downloads.
The [Fieldproof review archive](docs/fieldproof-review-archives-2026-10-12.md)
reopens PDFs, claims and all saved decisions after a server restart, with fresh
verification and unchanged exports checked through installed browsers.
The [TraceLens combined import](docs/tracelens-multifile-2026-10-12.md) joins
related service exports before resolving parents and links, with a captured
HTTP-and-queue workflow verified in offline browsers and installed CLIs.
The [mcplint metadata review](docs/mcplint-metadata-review-2026-10-12.md) captures
and compares actual server definitions across updates, exposing contract changes
that leave audit scores unchanged and preserving incomplete collection states.
The [Errorbars named-score workflow](docs/errorbars-inspect-values-2026-10-12.md)
selects a value from native Inspect scores and preserves its meaning through
exports and reports, preventing unlike dimensions from being compared silently.
The [Planisphere clock converter](docs/planisphere-clock-conversion-2026-10-12.md)
turns an explicit civil clock and longitude into a previewed wheel setting,
carrying date-line and New Year rollover into the downloaded annual scale.

Thumbnails are 1200x750 WebP, produced by [`scripts/make_thumb.py`](scripts/make_thumb.py):
either a fresh screenshot of the live demo (`shot.mjs ... --width 1200
--height 750 --scale 1`) or a cover-fit crop of a CLI-only project's own
README hero image, compressed to stay under about 200 KB each.

The page itself is a single TypeScript module (`src/main.ts`) that fetches
the JSON, groups by audience, and renders the cards. Catalogue validation
and filtering live in `src/catalogue.ts` - no framework, no router,
no build-time templating.

## Quickstart

```bash
git clone https://github.com/antonsoo/officina && cd officina
npm install
npm run dev
```

## Development

Use Node.js 24 or later.

```bash
npm ci
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build      # -> dist/, base '/officina/'
npx playwright install chromium firefox   # once per machine
npm run test:browser
```

The browser tests exercise the production build in Chromium and Firefox,
including search, keyboard focus, load recovery, light/dark mobile layouts,
accessibility checks, and Content-Security-Policy violations.

## Design

Imperial Roman: a parchment ground, a crimson accent, gold hairlines,
[Cinzel](https://fonts.google.com/specimen/Cinzel) for the wordmark and
project names, [EB Garamond](https://fonts.google.com/specimen/EB+Garamond)
for everything read at length. Light and dark themes follow the system
preference, with a manual toggle persisted in `localStorage`. No
tracking, no analytics, and no request to any other host: the fonts are
served from the site itself (`src/fonts/`, under the SIL Open Font License).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) (c) 2026 Anton Soloviev
