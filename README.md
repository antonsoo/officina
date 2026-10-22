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
The [source update history](docs/source-history.md) collects later fixes,
workflow additions and their retained verification. Each record distinguishes
source changes from package releases and hosted deployments.

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

The [Euclid inequality reading](docs/euclid-inequalities-2026-10-22.md) opens
I.20’s third construction and follows the lost premise in I.19.

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
