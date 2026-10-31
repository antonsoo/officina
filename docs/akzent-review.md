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
local branch equal to remote main and **46** immutable public source/evidence
files fetched without credentials. These include all 19 pinned source/font/
license/provenance assets, the audit and publication documents, actual sample
HTML/PDF/JSON/CSV/SVG files, and browser/build receipts.

Akzent's own [publication audit](https://github.com/antonsoo/akzent/blob/86b8b6ad5914c90b1d79168c65f685f044b9f245/docs/publication.md)
separates its 24 verified hosted files, public forward/inverse/recovery browser
runs, actual local-origin outages, and the source CI jobs that failed with empty
step lists. The successful static Pages build is a different result.

The catalogue's clean build, hosted files and repeated public discovery journeys
are recorded after publication in this directory. A local catalogue pass does
not establish public discoverability.

Reproduce the continuous journey with:

```sh
npm run test:akzent -- http://127.0.0.1:4396/officina/ test-results/akzent-local
```

Serve the reviewed build with `npm run preview -- --host 127.0.0.1 --port 4396
--strictPort`. The primary argument is nineteenth-century scholarship about
ancient languages. The invented word and inverse constraint exercise are
explicitly fictional/model-based; neither is an actual reconstructed lexeme.
