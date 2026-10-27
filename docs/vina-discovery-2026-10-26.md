# Find a matching argument through its Sanskrit words

The catalogue now finds Pyknon's **Same matches. Different pitches.** through
**dve vīṇe**, its unaccented `dve vine`, śruti/shruti, pramāṇa, Nāṭyaśāstra,
Bharata and Bernard Bel. It opens the second-stage Ga→Ri match with the
21.51-cent preparation, source clause and full printed page selected.
The pinned review identifies the interpretation and its independent evidence.

This is the longer two-instrument matching argument. The existing Grāma entry
continues to explain a change of starting note and lowering Pa alone; the two
activities have different assumptions and learner operations.

| Boundary | Observed evidence |
| --- | --- |
| Catalogue source | `5958ab9bf4cd44105bd26658082f007b8208e9b5` |
| Static publication | `ef2035377cdceaa19ffc9ec92d73282aeb40b51e`, normal fast-forward overlay retaining older assets |
| Canonical public bytes | All 67 current files and root/index aliases match before and after the public journeys |
| Local checks | Catalogue validation, lint, strict types, 44 existing tests and production build pass |
| Local and public journeys | Chromium 153.0.8010.12 and Firefox 155.0, each at 1280 and 375 px; four complete journeys in each environment |
| Learner operation | Restored `dve vine` search; keyboard-open lesson; Ga→Ri at 244.4444 Hz; change preparation and retain the match at 240.3184 Hz; fourth-stage three matches; corresponding Sanskrit clause and verified whole source; return and keyboard-open the immutable review heading |
| Search and layout | No extra catalogue fetch while typing/focusing, no horizontal document overflow or recorded application error |

[Local journeys](vina-discovery-2026-10-26/local-journeys.json) ·
[Public journeys](vina-discovery-2026-10-26/journeys.json) ·
[Canonical files before](vina-discovery-2026-10-26/hosted-before.json) ·
[Canonical files after](vina-discovery-2026-10-26/hosted-after.json).

The review link pins
[`624cb6a` and its actual learner heading](https://github.com/antonsoo/pyknon/blob/624cb6a79ae18c8547c6888687eb139a136fecd5/docs/vina-review.md#what-changed-for-the-learner).
Pyknon's [publication evidence](https://github.com/antonsoo/pyknon/blob/0fd921259f008d2c86896e103ae9abbf1915b148/docs/vina-publication.md)
separately records its 78 hosted files, fresh public installation, native
downloads, PCM measurements and complete offline edition. This catalogue
journey does not establish source CI success or a recovered ancient tuning.

```sh
node scripts/workshop-journeys.mjs https://antonsoo.github.io/officina/ /tmp/vina-discovery vina
node scripts/verify-pages.mjs https://antonsoo.github.io/officina/ dist --out /tmp/officina-hosted.json
```
