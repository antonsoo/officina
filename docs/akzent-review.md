# Akzent: keep a mismatch and question an inferred accent

The catalogue offers two concrete investigations in Akzent. One keeps the
Gothic/Sanskrit comparison that resists the proposed rule. The other asks which
older accents remain compatible with incomplete consonant evidence and an
explicit event-order assumption. Both reach complete pages of Verner's article,
a checked argument and an editable notebook.

| Search examples | Destination | Operated learner work |
| --------------- | ----------- | --------------------- |
| `katará`, `katara`, `hvaþar`, `πότερος`, `páti` | `akzent/?word=which#selected-title` | Keep a d prediction; reveal Gothic þ, inspect p. 119 and preserve the mismatch |
| `akasatam`, `lost accent`, `partial evidence`, `event order` | `akzent/#infer` | Compare unique, ambiguous and impossible accounts, then keep a checked proposal while changing the evidence |

The project and both workshop reviews pin the
[actual task instructions](https://github.com/antonsoo/akzent/blob/86b8b6ad5914c90b1d79168c65f685f044b9f245/docs/audit.md#try-the-actual-work).
The screenshots come from the application. The other 36 catalogue entries are
identical to their preceding source versions.

## Local catalogue to public lesson

The [local journey receipt](akzent/local-journeys.json) records eight continuous
journeys: both investigations in Chromium and Firefox at 1440/375px. The
catalogue is local; the lesson and pinned review are the real public pages.
No request is redirected to a local copy of the lesson.

Each journey searches multiple Greek/Latin-script aliases, confirms that typing
does not change the URL, explicitly copies the search link, and restores it.
It decodes the actual thumbnail and compares its bytes with the local PNG.
Keyboard navigation opens the immutable review and checks its raw public bytes
against the pinned Git object, then returns to the saved search and opens the
lesson. The inverse fragment lands at the actual controls.

For the resistant comparison, the learner predicts **d** and reveals **þ** in
_hvaþar_, with Greek _πότερος_ beside Sanskrit _katará-_. For the inverse, the
learner finds accent 1 under one order, all four under either order, and accent
3 for **g / z / þ**. Changing the draft keeps the earlier checked account.
Each journey hashes the source image actually displayed, writes an explanation,
and checks the actual native JSON download. Phone overflow and JavaScript
errors are also checked.

Retained and visually inspected examples: [desktop](akzent/catalogue-desktop.png)
and [375px](akzent/catalogue-mobile.png).

## Source and publication boundaries

The [Akzent source-evidence receipt](akzent/source-evidence.json) verifies a clean
local branch equal to remote main and **47** immutable public source/evidence
files fetched without credentials. These include all 19 pinned source/font/
license/provenance assets, the audit and publication documents, actual sample
HTML/PDF/JSON/CSV/SVG files, the deployment workflow, and browser/build receipts.

Akzent's own [publication audit](https://github.com/antonsoo/akzent/blob/86b8b6ad5914c90b1d79168c65f685f044b9f245/docs/publication.md)
separates its 24 verified hosted files, public forward/inverse/recovery browser
runs, actual local-origin outages, and the source CI jobs that failed with empty
step lists. The successful static Pages build is a different result.

The [clean-build receipt](akzent/clean-build.json) records a fresh Node 24.22.1
install, lint, formatting, strict types, 45 existing checks and build. All
**95 expected files** match the working build; all **36** previous entries are
unchanged. The [served-change receipt](akzent/served-changes.json) identifies
only `projects.json` and the two new screenshots as changed publication files.
The static branch preserves its existing history and older hashed assets.

The [public-file receipt](akzent/public-files.json) verifies the canonical entry,
explicit index and all 95 expected files against that clean inventory **after**
the public journeys. The [public journey receipt](akzent/public-journeys.json)
repeats all eight workflows from the actual public catalogue, without request
redirection. Both searches, copied/restored links, native keyboard navigation,
immutable reviews, operated lessons, displayed scans and actual notebook
downloads pass. Retained examples were visually inspected:
[desktop](akzent/public-desktop.png) and [375px](akzent/public-mobile.png).

The [lesson recheck](akzent/lesson-after-journeys.json) verifies all **24** Akzent
files again after catalogue navigation. The [publication metadata](akzent/publication.json)
records the branch configuration separately: the Actions query returned no
runs, so no catalogue source-CI or workflow-execution success is inferred.
Canonical hosted bytes and actual public browser behavior passed independently.

Akzent's subsequent deployment follow-up preserves history and older hashed
assets. The source-evidence receipt checks its current clean `550e260` main;
the catalogue's immutable `86b8b6a` review has identical argument bytes.

Place the Akzent checkout beside Officina (the driver reads its source manifest
and pinned Git object). Reproduce the continuous journey with:

```sh
npm run test:akzent -- http://127.0.0.1:4396/officina/ test-results/akzent-local
```

Serve the reviewed build with `npm run preview -- --host 127.0.0.1 --port 4396
--strictPort`. The primary argument is nineteenth-century scholarship about
ancient languages. The invented word and inverse constraint exercise are
explicitly fictional/model-based; neither is an actual reconstructed lexeme.
