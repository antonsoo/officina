# Find the pair. Keep it sounding.

The catalogue now exposes Sammû's existing practice room through a specific
workshop: **Turn the string while it sounds**. The new local source keeps the
pair sounding while the learner adjusts it. A source term such as `lā zakû` or
`nasāḫum`, or a question about amplitude beats, leads directly to that exercise.
Accent folding also finds it from `la zaku`. The thumbnail is an actual operated
view of the reviewed build.

[Desktop search](catalogue-desktop.png) · [Phone search](catalogue-phone.png) ·
[Four continuous journeys](receipt.json) · [Clean build identity](build.json).

The local journeys run Chromium and Firefox at 1440 and 375 pixels. Each types
five source/question terms, explicitly copies and reopens a search link,
activates the workshop by keyboard, starts live sound, changes 110 to 112 cents
without stopping it, reveals the 1.015608 Hz partial gap, downloads the real
112-cent attempt, and follows the source reader to its preservation notes.
The exact underlying `LL` history remains unchanged.

The review link pins Sammû source
`5397736d442315183d07ab8b5aa62e9c3d2feafe`, containing the continuous-signal,
source-page, export, offline and upgrade evidence. That document identifies
runtime source `e756a69`. Its bytes and thumbnail are checked against local Git
and source files in these journeys.

This change has **not been published**. The local reviewer redirects the public
workshop anchor to the local production build; it never treats that response
as hosted evidence. The pinned review is read from local Git, and no public
raw-document or hosted-file match is claimed. The new Sammû source and review
must be published before this catalogue change is deployed.

Both repositories were freshly installed and built under Node 24.22.1. Officina's
lint, strict TypeScript, 45 existing checks, catalogue validation and build pass.
All output files match the Node 26.7.0 build. No runtime dependency was added.

To repeat after building both repositories and installing their dependencies:

```sh
npm run test:sammu-live-local -- ../sammu /tmp/officina-sammu-live
```

This local reviewer owns ports 4414 and 4415 and expects a sibling Sammû
checkout; its path and output directory are configurable arguments. It requires
installed Playwright Chromium and Firefox. `npm run build` writes Officina's
static output to `dist/`.
