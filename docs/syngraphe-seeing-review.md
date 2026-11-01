# Finding the opening-face experiment

Syngraphe's existing measurement workshop now has a companion room about the
storehouse programme's opening chests and purpose of seeing while passing.
The catalogue entry lets source words lead to the actual face/position controls,
Greek notes, whole printed page and portable reading.

| Search | What the learner reaches |
| --- | --- |
| ἀμφοτέρους / αμφοτερους / amphoterous | The two-side requirement, not merely one open side |
| διεξιοῦσιν / διεξιουσιν / diexiousin | Seeing while passing, with a movable modern viewer |
| τὸμ πρόσθιον | The front-face clause for wall chests |
| public passage / chest faces / 134 chests | The same specific sightline experiment |

The image is a real operated view from Syngraphe. The project evidence and new
workshop review point to an immutable local source revision. The earlier
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
belong to Syngraphe's [source review](https://github.com/antonsoo/syngraphe/blob/238b744dc0f5033ef2470a63d4d34905c3d07fd6/docs/visibility-review.md#try-the-actual-work).
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

## Publication order

This catalogue change is staged locally. The public lesson route returned 404
in the read-only boundary check. No source push or Pages deployment is claimed.
Publish Syngraphe's source and complete lesson first, then deploy this catalogue.
Afterwards verify public canonical bytes and repeat the real, unredirected
search -> review -> lesson -> source page -> portable-reading journey. The local
redirect fixture is deliberately not evidence of public availability.

`npm run build` produces Officina's complete `dist/` directory for `/officina/`.
No opening-menu redesign or new repository was needed for this addition.

Fresh dependency installation, lint, typecheck, formatting, all 45 catalogue
checks and the complete build passed. The general browser review passed 56
scenarios in Chromium and Firefox, including light/dark phone layouts, sharing,
keyboard navigation and loading recovery. The [build receipt](review/syngraphe-seeing-build.json)
records the complete local file inventory; it is not a hosted-byte comparison.
