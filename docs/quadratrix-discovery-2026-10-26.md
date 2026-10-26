# Pappus through the source's missing crossing

The public catalogue now finds **The point the motion cannot draw** through
`quadratrix`, Pappus, Sporus, and Greek words including **οὐκέτι** (also entered
without accents as `ουκετι`). The link opens a positive crossing immediately
before the finish, beside the source objection. The separately selected H
remains a limiting point when **Finish exactly** removes the unique crossing.

| Boundary | Evidence |
| --- | --- |
| Catalogue source | `e65cca1`, a dedicated workshop entry with a full 40-character source-review pin |
| Deployment | `9e1b6ec`, normal fast-forward update retaining prior assets |
| Canonical files | All 67 current build files match public lengths and SHA-256 identities, with the canonical entry checked again after browser journeys |
| Discovery journey | Chromium 153.0.8010.12 and Firefox 155.0 at 1280 and 375 pixels: type `ουκετι`, keyboard-open the matching workshop, operate its final-instant comparison, verify the visible source image, return and keyboard-open the pinned review heading |
| Search behavior | No extra catalogue requests while typing or focusing the result; no horizontal page overflow or recorded application errors in these four journeys |

[Four public journeys](quadratrix-discovery-2026-10-26/journeys.json) ·
[Final canonical identities](quadratrix-discovery-2026-10-26/hosted-files.json) ·
[Lesson publication evidence](https://github.com/antonsoo/stoicheia/blob/33a73e3/docs/quadratrix-publication.md).

The lesson's downloads, current-edition offline behavior, source identities and
fresh source-clone build have a separate review in Stoicheia. The catalogue
journeys do not establish a successful CI run or a registry release.

```sh
node scripts/workshop-journeys.mjs https://antonsoo.github.io/officina/ /tmp/pappus-discovery quadratrix
node scripts/verify-pages.mjs https://antonsoo.github.io/officina/ dist --out /tmp/officina-hosted.json
```
