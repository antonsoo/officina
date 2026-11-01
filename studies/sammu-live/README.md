# Find the pair. Keep it sounding.

The catalogue now exposes Sammû's existing practice room through a specific
workshop: **Turn the string while it sounds**. The practice room keeps the
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

The current review link pins Sammû source `c26656e1f9b0b4e572c95a744c51bb956b4582bb` and
[its instrument audit](https://github.com/antonsoo/sammu/blob/c26656e1f9b0b4e572c95a744c51bb956b4582bb/docs/audit.md#hear-the-adjustment).
That review separates runtime source `3ce4352`, clean build identity, actual
continuous audio, damaged-asset refusal, offline repair, first-install recovery
and public delivery. Its thirteen canonical files match the reviewed build.

The original [local receipt](receipt.json) is retained as historical evidence:
it explicitly redirects the public workshop anchor to a local production build
and reads the earlier review from local Git. It makes no hosted claim.
The updated reviewer supports a separate public mode that follows actual
catalogue and review links, compares pinned public raw bytes, and observes the
same twelve oscillators through a keyboard adjustment and an explicit stop.
The audio-thread PCM measurements remain a local proof on the byte-identical
workshop build.

Both repositories were freshly installed and built under Node 24.22.1. Officina's
lint, strict TypeScript, 45 existing checks, catalogue validation and build pass.
All output files match the Node 26.7.0 build. No runtime dependency was added.

To repeat after building both repositories and installing their dependencies:

```sh
npm run test:sammu-live-local -- ../sammu /tmp/officina-sammu-live
npm run test:sammu-live -- ../sammu /tmp/officina-sammu-public
```

This local reviewer owns ports 4414 and 4415 and expects a sibling Sammû
checkout; its path and output directory are configurable arguments. It requires
installed Playwright Chromium and Firefox. `npm run build` writes Officina's
static output to `dist/`.
