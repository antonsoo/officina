# Find the reader that contains the source word

The live catalogue reproduced a discovery gap: searching `μηδέποτε` found
Stoicheia, but its featured link opened Archimedes's circle workshop. That
reader did not contain the searched word. The [before receipt](evidence/workshop-discovery-2026-10-26/before-route.json)
records the actual search, link, landing address and missing source word.

Matching searches now expose a direct workshop link and a separate recorded
review. The unaccented `μηδεποτε` opens Book X's Greek and Latin reading;
`ἤχθω` opens the tiny ray in Euclid III.16. The learner can operate the model
and inspect the source rather than find the project and search its rooms again.

## Eight curated destinations

| Search used in the operated journey | Reader | Actual operation |
| --- | --- | --- |
| `μηδεποτε` | A common measure, Euclid X.2–3 | Fit one copy of 408 into 577; inspect the Greek source image |
| `ηχθω` | A line that will not fit, Euclid III.16 | Compare the tiny positive ray's exact interior deficit with the tangent; restore the tiny ray and load its source image |
| `sphaerae` | Keep the safe side, Archimedes | Try an unsafe root estimate; distinguish the still-justified current bound from the unsupported next bisection |
| `restricted compass` | Make I.2 yourself, construction desk | Join A to B using the actual drawing controls; read the resulting action from the share address |
| `ῥαβδωσεως` | The cut inside a column, fluting | Choose the Ionic recipe, inspect its depth and edge angle, and open the Greek witness |
| `Penrose` | The curve inside the taper, entasis | Move a measured station by keyboard and change the enlargement |
| `επογδοος` | Six tones and an octave, Sectio canonis | Change the tone count; schedule and stop the audible comparison; load the original page |
| `aequitona` | Equal lengths. Unequal notes, Ptolemy | Compare equal halves with unequal quarters and inspect both frequencies |

These entries cover selected rooms in three projects. Other indexed subjects
still find their project; they have no direct workshop shortcut until a curated
entry exists. The full catalogue contains the same thirty projects. Removing
only the new `workshops` field from the data reproduces every previous project
record exactly, including featured demo links, descriptions, evidence and all
older aliases. The circle lesson remains Stoicheia's featured project link.

Each workshop's review points to an immutable source revision and the relevant
heading. These revisions were checked against the public repositories:

| Project | Pinned source revision |
| --- | --- |
| Stoicheia | `115c3f3e55f22da1d1b1eb39c7900da864c71243` |
| Gonia | `7fab06429b9834fd1b2bc8409067e3460112fb61` |
| Pyknon | `b49326e354d74c9c06583c8343357b2e88729192` |

This change indexes and operates those existing public readers. Their own
reviews carry their historical, mathematical and acoustic boundaries. Stoicheia's
[horn publication review](https://github.com/antonsoo/stoicheia/blob/115c3f3e55f22da1d1b1eb39c7900da864c71243/docs/horn-publication.md)
separately records the new circle-tangent reader, its complete Greek and Latin
study, six original pages, fifteen-page PDF and nine-room offline edition.

## Matching and presentation

Workshop metadata is optional and validated at the build and fetch boundaries.
Each entry has a stable unique ID, title, direct HTTPS URL, review URL and
nonempty source terms. Its title and terms also participate in project search.
Existing catalogue records without workshops retain their original behavior.

Matching folds case and accents, as the existing project search does. Every
query word must occur in that workshop's title or terms, or in its project name
or audience group. At least one word must identify the workshop itself. Thus
`stoicheia μηδέποτε` identifies Book X, while `μηδέποτε 591.15` can find the
project but cannot fabricate a room containing both unrelated source terms.

The links appear above the project's featured description during a matching
search. Empty search and Clear filters restore the original overview. Cards
and link nodes stay mounted, preserving input focus and thumbnail identity.
Filtering uses the downloaded data; it neither fetches another catalogue nor
changes the URL or saves the query in storage. Loading a previously unseen
thumbnail remains an ordinary static-asset request.

The new links use the established parchment, crimson, Cinzel and EB Garamond
design. The actual Book X [desktop](evidence/workshop-discovery-2026-10-26/search-1280.png)
and [phone](evidence/workshop-discovery-2026-10-26/search-375.png) search captures,
phone [horn](evidence/workshop-discovery-2026-10-26/horn-375.png),
[fluting](evidence/workshop-discovery-2026-10-26/fluting-375.png) and
[music](evidence/workshop-discovery-2026-10-26/canon-375.png) captures, and a
[dark multi-match](evidence/workshop-discovery-2026-10-26/search-dark-375.png)
capture were inspected for wrapping, focus and link hierarchy. Greek source
words and longer titles fit the 375-pixel layout without horizontal overflow.
The screenshots are native browser captures of the MIT project, with its
locally served OFL fonts; they are not generated illustrations.

## Verification and limits

Clean Node 24 installation, lint, formatting, typecheck, all 44 tests and the
production build passed. All 36 production-browser checks passed in Chromium
and Firefox, including keyboard reachability of the new Book X link, stable
link identity through filter changes and reset, and the mixed-room query.

The [local journeys](evidence/workshop-discovery-2026-10-26/local-journeys.json)
exercise all eight destinations in Chromium and Firefox at 1280 and 375 pixels:
32 complete catalogue-to-operation-to-review journeys. Each opens the actual
workshop by keyboard, performs the operation above, returns to the catalogue,
then follows the pinned review by keyboard. The review heading must appear
inside the viewport through its native fragment, without manually scrolling it.
Source images are checked only where the operation claims one, after scrolling
lazy images into view. No application page errors or horizontal overflow were
reported. Service workers are blocked in these navigation contexts; these
receipts establish navigation, not offline availability. The music check
observes audio scheduling and displayed frequencies, not physical speaker output.

The [local search receipt](evidence/workshop-discovery-2026-10-26/local-search.json)
retains 194 actual search inputs per configuration, 776 in total. It covers
every indexed term and workshop title of five selected ancient-learning
projects, explicit older-topic and unaccented queries, music discovery and
audience narrowing. Search retained input focus and its address and made no
additional catalogue requests. The [dark review](evidence/workshop-discovery-2026-10-26/dark.json)
checks the multi-match `Euclid` layout at both widths; automated WCAG A/AA
checks report no violations there or in the operated Book X search. This is
not a claim of a complete manual screen-reader audit.

The [external build inventory](evidence/workshop-discovery-2026-10-26/build-files.json)
identifies all 67 reviewed production files by length and SHA-256. Source
publication, canonical hosted bytes and public browser operation are separate
checks recorded below after publication. No GitHub Actions execution is
inferred from a local pass or a pushed static branch.

To reproduce after building and serving the catalogue:

```sh
npm ci
npm run typecheck
npm run lint
npm run format:check
npm test
npm run test:browser
node scripts/workshop-journeys.mjs https://antonsoo.github.io/officina/ /tmp/workshop-journeys
node scripts/operated-search.mjs https://antonsoo.github.io/officina/ /tmp/workshop-search
```

The journey script accepts an optional third argument containing comma-separated
workshop IDs for a focused replay. A complete receipt requires all eight IDs,
both engines and both widths. The public lessons and GitHub require the network.
