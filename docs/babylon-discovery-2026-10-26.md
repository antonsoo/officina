# Find Babylon through an Akkadian measuring word

The public catalogue now finds **A tower between two sources** through
`nindanu`, Babylon, Etemenanki, Esagil, AO 6555, the missing sixth storey and
Akkadian measurement words including **mēlû**, **šiddu** and **pūtu**. Accent
folding also accepts their unaccented forms. The result opens the sixth row
unknown; the conventional completion remains an explicit learner action.

| Boundary | Observed evidence |
| --- | --- |
| Catalogue source | `b4e15a1`, including the dedicated workshop and full immutable Gonia review pin |
| Static branch | `e333be3`, normal fast-forward publication preserving older assets |
| Canonical public bytes | All 67 current build files and both entry aliases match before and after browser journeys |
| Full public journey | Chromium 153.0.8010.12 and Firefox 155.0, each at 1280 and 375 pixels: restored `nindanu` query, keyboard-open lesson, unknown total, explicit 90 m completion, second-storey 18 m versus 9.52 m comparison, keyboard-jump to its numerical reading and visible verified source, then return and open the pinned review heading |
| Filtering behavior | No extra catalogue requests during typing/focus, no horizontal page overflow, no recorded application errors or failed requests |
| Local source checks | Catalogue validation, lint, typecheck, 44 existing tests and build pass. The final pin changes only catalogue data; the four local journeys are repeated for that pin. |

[Local journeys](babylon-discovery-2026-10-26/local-journeys.json) ·
[Public journeys](babylon-discovery-2026-10-26/journeys.json) ·
[Canonical files before](babylon-discovery-2026-10-26/hosted-before.json) ·
[Canonical files after](babylon-discovery-2026-10-26/hosted-after.json).

The lesson's real scan, native files, independent arithmetic, complete offline
edition and interrupted upgrades have their own
[Gonia publication record](https://github.com/antonsoo/gonia/blob/39778411184c531547ab418968b581a2cbb9bd46/docs/babylon-publication.md).
The catalogue journey does not establish a successful source CI run, hardware
GPU performance or the actual height of the ancient building.

```sh
node scripts/workshop-journeys.mjs https://antonsoo.github.io/officina/ /tmp/babylon-discovery babylon
node scripts/verify-pages.mjs https://antonsoo.github.io/officina/ dist --out /tmp/officina-hosted.json
```
