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
