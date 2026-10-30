# Psephos: concealed choice and a revealing count

The catalogue now offers two distinct investigations in the published Psephos
workbench, with real screenshots, Greek search handles and an immutable review.
The ten-person panel and observer assumptions are explicitly modern. The
retained Greek text and complete printed pages ground the casting procedure;
the compatible-assignment deduction is a mathematical extension.

| Search | Destination | Learner's work |
| --- | --- | --- |
| `πιέζων`, `κύριος`, `authoritative urn`, `ἂν δὲ ἴσαι` | `psephos/#workbench` | Pin the concealed view, change the private choice, cast and read the tie rule |
| `εὐαρίθμητοι`, `known votes`, `252 arrangements`, `unanimity` | `psephos/#inference` | Keep the count fixed, vary assumed knowledge and compare compatible assignments |

Five/five with no individual choices known admits 252 assignments. Knowing
four pierced choices leaves six; knowing all five pierced choices leaves one.
This counts logical possibilities, not probabilities or ancient surveillance.
Both workshop entries explain the actual task instead of promising a survey
of all Athenian law.

## Journey evidence

`npm run test:psephos -- http://127.0.0.1:4385/officina/ test-results/psephos-local`
ran eight continuous journeys: both investigations in Chromium and Firefox at
1440 and 375 pixels. The [local receipt](psephos/local-journeys.json) identifies
the local catalogue separately from the real public lesson and public review.
No production requests were redirected.

Each journey:

1. Searches Greek and English aliases and finds the correct workshop.
2. Confirms typing leaves the URL unchanged, explicitly copies the search link,
   reopens it and decodes the actual thumbnail.
3. Opens the review by keyboard, follows its full 40-character source pin and
   compares its raw bytes with the corresponding Git object.
4. Returns to the saved search and opens the specific lesson by keyboard.
5. Casts and counts, operates the concealed-view comparison or 252-to-one
   deduction, reads and cites `ἂν δὲ ἴσαι`, and hashes the bytes displayed as
   printed page LXVIII against the Psephos source manifest.
6. Writes an explanation and downloads the native version 2 court record,
   checking its facts, citation and observer assumptions. It also checks phone
   overflow and JavaScript errors.

All sixteen local catalogue/lesson screenshots were visually inspected. Source
build identity, canonical hosted bytes and a second complete set of journeys
from the public catalogue will be recorded separately after publication.


The [clean-build receipt](psephos/clean-build.json) records a fresh archive and
Node 24.22.2: install, lint, formatting, strict types, 45 existing checks and the
production build pass. The complete output is byte-identical to the reviewed
working build; its inventory digest can be compared with the public-file
verification receipt after deployment.


## Public edition

The [public file receipt](psephos/public-files.json) verifies **all 93 files**
against that clean build inventory. All 35 previous catalogue entries are
unchanged. Only `projects.json` and two new screenshot thumbnails changed in
the served branch; its existing history was preserved.

The [public journey receipt](psephos/public-journeys.json) repeats all eight
continuous journeys from `https://antonsoo.github.io/officina/` into the public
Psephos lessons and immutable review. It uses no request redirection. Every
journey rechecks the canonical catalogue entry, catalogue data, both new
thumbnails and the Psephos entry against the reviewed bytes. Native downloads
preserve the expected explanation, citation and observer assumptions. All
sixteen public screenshots were visually inspected; retained examples show
[desktop](psephos/catalogue-1440.png) and [375px](psephos/catalogue-375.png).

The [publication boundary](psephos/publication.json) records branch-based Pages
configuration separately. The latest-build API returned HTTP 404 and the Actions
query supplied no runs. No remote source-CI or deployment-workflow success is
claimed from those unavailable results. Canonical hosted bytes and the actual
public browser journeys are independently verified.


## Shared-storage follow-up

A subsequent two-tab audit found that a source failure discovered by a direct
cached read notified only its own page. Psephos now broadcasts both discovered
damage and fully verified recovery, without repeated notification loops. The
[follow-up discovery receipt](psephos/followup-journeys.json) repeats all eight
public catalogue journeys against that updated edition. The complete
[cross-edition audit](offline-readiness-review.md) links immutable reviews and
separates public transport tests from source CI.
