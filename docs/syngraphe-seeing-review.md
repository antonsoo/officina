# Finding the opening-face experiment

Syngraphe's existing measurement workshop now has a companion room about the
storehouse programme's opening chests and purpose of seeing while passing.
The catalogue entry lets source words lead to the actual face/position controls,
Greek notes, whole printed page and portable reading.

| Search | What the learner reaches |
| --- | --- |
| ἀμφοτέρους / αμφοτερους / amphoterous | Which two faces can open, distinguished from a temporarily closed panel |
| διεξιοῦσιν / διεξιουσιν / diexiousin | Seeing while passing, with a movable modern viewer |
| τὸμ πρόσθιον | The front-face clause for wall chests |
| public passage / chest faces / 134 chests | The same specific sightline experiment |

The image is a real operated view from Syngraphe. The project evidence and new
workshop review point to the immutable published source review, including the public delivery
and offline-repair audit. The earlier
measurement room keeps its own previously published review.

## Local journey

`scripts/syngraphe-seeing-local.mjs` serves both production builds. The canonical
lesson and review URLs remain unchanged in the catalogue; the browser review
explicitly redirects those navigations to local fixtures. The pinned review is
read with `git show` from its exact revision and compared with the displayed
text. This does not fetch the future public source URL or prove public delivery.

Chromium and Firefox at 1440 and 375 pixels each exercise:

1. All ten source-word aliases, without typing rewriting the page address.
2. Explicitly copied search link and its restored workshop result.
3. Keyboard navigation to the pinned local review and the actual lesson.
4. Opening the stated faces, moving to the right end and observing both samples.
5. Selecting ἀμφοτέρους, reading “both of the two”, and opening the verified whole
   printed page 13.
6. A genuine illustrated-reading download, native reopening with scripts disabled
   and no document-width overflow.

The full model, four-image/font/license identity, native record and offline audit
belong to Syngraphe's [source review](https://github.com/antonsoo/syngraphe/blob/fa50de96cb72cbfce3a3bd3bb910034903a10fbd/docs/visibility-review.md#try-the-actual-work).
Officina's [local discovery receipt](review/syngraphe-seeing-discovery.json)
records the continuous catalogue journey separately.

With both repositories checked out beside one another:

```sh
npm run build
npm run test:syngraphe-seeing-local
```

The lesson needs its own prior `npm ci && npm run build`. The optional lesson-directory
argument after the output directory can select an independent Syngraphe `dist/` directory; the
retained review used that independently installed build.

## Public journey

Syngraphe's complete lesson was published and audited before this catalogue
entry. Its 26 canonical files match the clean build; both rooms operate after
TLS connections are cut; missing, wrong and evicted cache bytes can be detected
and repaired without losing settings. Source CI and public Pages delivery have
separate receipts in the pinned review.

The public mode of the same journey script performs no navigation interception.
It compares the immutable raw review with its committed bytes, follows the real
GitHub review link by keyboard, returns through the explicitly shared catalogue
search, operates the actual lesson, selects the Greek, opens the whole source
page and downloads/reopens the illustrated reading with scripts disabled.

```sh
npm run test:syngraphe-seeing -- /tmp/officina-syngraphe-public
```

The earlier HTTP-404 and local-redirect receipts are historical observations.
On 2026-11-01 UTC, all **106** canonical build files, plus the root before and
after the asset pass, matched the independently installed Node 24.22.1 build:
[hosted bytes](review/syngraphe-seeing-hosted-bytes.json).
The actual unredirected journey passed in Chromium and Firefox at 1440 and
375 pixels: [public journey](review/syngraphe-seeing-public.json).
All four actual HTML downloads retained the selected state, exact four source
images, font and full licenses; their bytes matched the clean local journey:
[artifact audit](review/syngraphe-seeing-public-artifacts.json).
Both remote source heads and nine immutable raw files matched the local
committed bytes: [source observations](review/syngraphe-seeing-public-source.json).
No repository CI run was returned by the observed Officina workflow endpoint;
no remote CI success is inferred.

`npm run build` produces Officina's complete `dist/` directory for `/officina/`.
No opening-menu redesign or new repository was needed for this addition.

Fresh dependency installation, lint, typecheck, formatting, all 45 catalogue
checks and the complete build passed. The general browser review passed 56
scenarios in Chromium and Firefox, including light/dark phone layouts, sharing,
keyboard navigation and loading recovery. The [build receipt](review/syngraphe-seeing-build.json)
records the complete local file inventory; it is not a hosted-byte comparison.
