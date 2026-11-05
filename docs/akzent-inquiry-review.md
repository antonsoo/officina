# Find the next consonant, not just the project

The catalogue adds one Akzent workshop and leaves all other 37 project entries
unchanged. The new entry links directly to the published `#inquiry` controls,
uses an actual unmodified screenshot, and pins its review to the completed
[source and publication audit](https://github.com/antonsoo/akzent/blob/66610a4c480120d0fd16dd926c5e325cb6e78163/docs/inquiry-audit.md#two-questions-two-rankings).

## Follow the work

Search **next consonant**, **accent positions**, **worst case**, **which
consonant**, or **information loss**. Copy the search link and reopen it. Open
**Which consonant would you read next?** with the keyboard, allow either event
order, and withhold all three consonants.

The first consonant minimizes the largest remaining scenario branch. For
accent positions, all three tests tie at a worst case of four; none guarantees
a narrower accent answer. Try **g** and undo it. Inspect the shared complete
h/z/d output: five scenarios remain. Keep the actual reading-plan CSV, inspect
the complete printed p. 115, return to the shared search, and open the pinned
review.

This is a modern conditional exercise on Verner's deliberately fictional word.
No damaged historical copy, new accent reconstruction, probability distribution,
or globally optimal decision tree is claimed. The separate accent and scenario
goals are the point of the lesson.

## What was verified

| Boundary                                               | Evidence                                                                                                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Clean public Akzent source                             | [103 public raw artifacts](akzent-inquiry/source-evidence.json) match clean, synchronized `66610a4`: source, tests, transfer/build scripts, original pages, fonts, licenses, retained downloads and review receipts            |
| Local catalogue to the actual public lesson and review | [Four journeys](akzent-inquiry/local-journeys.json), Chromium/Firefox at 1440/375px; search aliases, explicitly shared URL, real keyboard link, native fragment, both goals, undo, actual CSV, original page and pinned review |
| Reproducible catalogue build                           | [Clean Node 24 comparison](akzent-inquiry/clean-build.json); fresh install, lint, typecheck, 45 tests, catalogue check and build; all 126 production files match the working Node 26 build                                     |
| Screenshot identity and terms                          | The actual thumbnail is decoded and its bytes compared in every journey; [original PolyForm notice and license](../public/thumbs/akzent-reading-LICENSE.txt) stays separate from Officina's MIT code                           |

The fragment assertion waits for page load and fonts. An initial Firefox
measurement at `interactive` was premature: the target was still below the
viewport; at `complete` its top was 24 pixels from the viewport edge. The driver
now observes completed native navigation without forcing a scroll or relaxing
the location check.

The new route does not replace Akzent's resistant-word or earlier inverse
entries. The source comparison and byte inventory do not substitute for the
continuous browser journey. Likewise, local checks are not remote CI success.

## Reproduce

A sibling Akzent checkout supplies the pinned Git object for independent raw
comparison. Existing Playwright Chromium and Firefox installations are required.

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4487 --strictPort
```

In another terminal:

```sh
npm run test:akzent-inquiry -- http://127.0.0.1:4487/officina/ test-results/akzent-inquiry-local
```

Build with `npm run build`; the complete static output is `dist/`, base
`/officina/`. Public delivery and its final byte/browser receipts are recorded
separately after publication.
