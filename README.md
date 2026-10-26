# officina

**An index of open-source tools by Anton Soloviev.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live demo](https://img.shields.io/badge/demo-antonsoo.github.io%2Fofficina-8B1E1E)](https://antonsoo.github.io/officina/)

A single static page that lists every published tool in one place - built
so there is one link to share on Upwork or with a client instead of a
dozen. Officina is Latin for workshop.

Search by name, task, package registry or source term, and narrow the list by audience.
Search stays in the page: it makes no requests and is not saved in the URL
or browser storage. Clear filters returns to the full catalogue. Greek source
terms such as `ἰσότονον` also work without accents (`ισοτονον`). Lesson names
and source terms can stay indexed when a project features a different workshop.

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

Optional `searchTerms` index source words and lesson names without filling the
card description with keywords. Terms use the same case and accent folding as
the visible text and combine with the audience filter.

The build checks the catalogue's fields, links, duplicate names, and thumbnail
files. The browser validates the fetched data too; a failed load offers a
retry and a link to the GitHub profile.

Each card also links to recorded evidence: a study or artifact verification
at an immutable source revision. Findings name the measured population or
conditions and a material limit. They describe that record, not necessarily
the linked demo or registry release. They are searchable alongside the
description. See the [2026-10-10 evidence audit](docs/evidence-audit-2026-10-10.md).
The [source update history](docs/source-history.md) collects later fixes,
workflow additions and their retained verification. Each record distinguishes
source changes from package releases and hosted deployments.

The [Archimedes circle workshop](docs/circle-2026-10-26.md) connects source-word
search to an exact failed-proof experiment. Earlier Book X and construction
queries remain indexed.

The [common-measure and water-screw lessons](docs/measure-and-water-2026-10-25.md)
connect new Book X and Vitruvian workshops with source-word search, native
operations, original pages and complete portable readings. Older workshop
terms remain indexed, including the restored `column flute` query.

The [Haidao survey](docs/haidao-2026-10-25.md) adds Liu Hui’s two-sighting
problem with Classical Chinese. Try a divisor that passes one observation and
fails the other, then inspect the correction in a complete printed witness.

The [operated lessons](docs/operated-lessons-2026-10-24.md) add Grāma and feature
Euclid's construction desk, Aristoxenus's rhythmic divisions and Vitruvius's
hoist. Each opens a learner's choice, a source reading and a complete portable
record; earlier lessons remain discoverable. The catalogue contains 30 projects.

The [viewpoint experiment](docs/viewpoint-2026-10-24.md) opens Gonia’s fixed
1:12 inclination and a movable observer, with a source reading and a pinned
geometric review. Earlier hoist, column and sounding-vessel terms remain.

The [calibration, balance and Chinese craft lessons](docs/balance-and-calibration-2026-10-24.md)
add Archimedes' Zygon workshop and feature Hero's distance calibration and
Shiguzhai's second bell room. Native search finds their source words while
retaining older water, tunnel and bell-observation topics.

The [string and mesolabe examinations](docs/ancient-examinations-2026-10-24.md)
open Ptolemy’s instrument check and Eratosthenes’ sliding plates, with source-word
search, audible or geometric counterexamples, and complete portable readings.

The [tunnel, theatre and interior-route lessons](docs/ancient-constructions-2026-10-23.md)
introduce Hero's outside survey, Vitruvius's different theatre plans and Euclid's
shorter route with its larger angle. Their source readings, movable diagrams
and illustrated study files are public, with pinned reviews and direct lesson links.

The [geometry readings](docs/geometry-readings-2026-10-21.md) open Seked's
conflicting Rhind calculations and Gonia's measured entasis directly. The
[earlier ancient readings](docs/ancient-readings-2026-10-21.md) connect bronze-bell
measurements, Seikilos's syllables and Euclid's constructions to their sources.

Thumbnails use a 1200:750 aspect ratio. They are real demo screenshots or
cropped CLI output, stored as WebP or PNG. [`scripts/make_thumb.py`](scripts/make_thumb.py)
can compress a screenshot to WebP. For explanatory diagrams, take the screenshot
at the intended aspect ratio so a cover crop does not hide the relevant detail.

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

The [earlier stone-transport review](docs/gonia-transport-2026-10-22.md) opens Gonia
at the reported-dimensions example, with 2.5 source feet of minimum clearance.
Its pinned source explains why that geometric fit cannot account for the reported
veering; the other four architecture rooms remain discoverable.

The [marked-cord ground lesson](docs/rajju-ground-2026-10-22.md) opens Rajju
at the eastern operation: hold fifteen, stake twelve. The card links the
source table and the counterexample in which four perpendiculars still give
the wrong ground.

The [water-organ workshop](docs/pnigeus-shapes-2026-10-22.md) opens a worked Pnigeus
experiment and follows it to the Latin reading and public evidence.

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

## Verify a static publication

A pushed deployment and an HTTP 200 response do not establish that the canonical
site serves the build you tested. The standalone Node 24 verifier checks the
real entry URL, explicit `index.html`, and every file in a materialized build:

```bash
node scripts/verify-pages.mjs https://antonsoo.github.io/officina/ dist --wait 180 --out /tmp/officina-publication.json
```

It uses canonical URLs, streams response hashes, and exits successfully only
when all bytes match. Mismatched bytes and unavailable responses remain distinct
in the JSON receipt; a failed import of HTTP evidence cannot become a verified
file. Write receipts outside the build directory. The Pages workflow publishes
from a temporary Git checkout, preserving the tested artifact for this check.

The verifier also works with another showcase's build directory. The
[observed publication gap and replay](docs/canonical-publication.md) retain a
real 37-of-38-file mismatch, corrected deployments and controlled propagation
checks. Browser behavior, source publication and registry releases need their
own evidence.

The [earlier Euclid inequality reading](docs/euclid-inequalities-2026-10-22.md) opens
I.20’s third construction and follows the lost premise in I.19.

The [Euclid discovery review](docs/gonia-segments-2026-10-22.md) connects the
architecture lesson, music experiment and full reading course. The
[original carving review](docs/gonia-fluting-2026-10-22.md) retains the earlier
four-workshop publication evidence.

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
