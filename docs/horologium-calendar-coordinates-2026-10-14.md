# Horologium season coordinates and Maya G-cycle anchor, 2026-10-14

Current source `7166a0b` made two calendar claims that disagree with published
reference data. Egyptian tablets used a season's index as its month ordinal and
called the day of the month the day of the season. Maya library results were one
position ahead in the nine-day G cycle, including a dated interpreted inscription.

Code `14ce652` corrects both shared library paths. Egyptian month ordinals I-IV
restart within each season, with days counted through its 120 days. The Maya G
cycle ends at G9 on period boundaries, and the clock tablet now includes the
computed label. The earlier unsupported claim that G1 at creation was a widely
used alternative was removed.

| Reference case | Before | After |
|---|---|---|
| Egyptian Athyr 13 | Akhet I, season day 13 | III Akhet, season day 73 |
| Egyptian Pharmuthi 13 | Peret II, season day 13 | IV Peret, season day 103 |
| Maya inscription 9.12.2.0.16 | G8 | G7 |
| Maya period ending 13.0.0.0.0 | G1 | G9 |

The [study](https://github.com/antonsoo/horologium/blob/0452cdadd706262a925189f03c7d2fffa6b66d7a/studies/calendar-coordinates/README.md)
uses UCL Digital Egypt's twelve month coordinates and ten factual numeric/date
records from Mark Pitts's FAMSI book, with the original PDF pages visually
inspected. The modern Alexandrian/Coptic date column is not transferred into
the wandering Nabonassar calendar. Constructed controls are labelled separately
from published dates; no additional historical observations are invented.

| Verification | Retained result |
|---|---|
| 442 native study cases | Baseline 407 disagreements; corrected zero |
| Egyptian coverage | All 360 ordinary day positions, five epagomenal controls and five modern/pre-era controls |
| Maya coverage | Ten published dates; 62 constructed cycle/period-ending checks across two correlations |
| Preserved evidence | Egyptian dates, native labels, Sothic text and proleptic flags unchanged; Maya Long Count, Tzolk'in and Haab' controls unchanged |
| Fresh archive | Locked install, lint, strict types, 249 unit tests, library/site build, runnable usage, pack and 58 browser tests pass |
| Installed Node 24.21.0 and 26.7.0 | Each passes all 442 cases; all 38 shipped runtime/declaration files match the clean build |
| Cross-version builds | All 57 library files and 30 site files match Node 24 and Node 26 output |
| Source identity | All 102 tracked source, test and build inputs match the archive |
| Offline browsers | 48 total before/after date/explanation workflows in Chromium/Firefox at 1440/375px; no offline requests, page errors, CSP errors or page overflow |
| Served identity | All 30 build files match HTTP responses per phase; all 29 browser-loaded files match |
| Visual review | Ten actual browser screenshots inspected |

The printed book-title metadata was corrected in `07a2236`; a fresh archive
passes native checks with identical library/site output and unchanged reference
coordinates.

The tested local 0.2.3 package is 75,308 bytes, SHA-256
`8e5624036ca4db62a09548c34865fe182550772fc98945e0a59dd27ae7f28626`.
It is not an npm release. Source `0452cda` matches clean remote `main`; 27
immutable public files were fetched back and byte-compared, including the
source, study and screenshots. The
[source receipt](evidence/horologium-calendar-coordinates-source-2026-10-14.json)
records their URLs, sizes and hashes. The `gh-pages` head remains
`89a9d0f9c12cd32fbd1b675b46dab92124073552`. Build command `npm run build`
produces `dist/app/` and `dist/lib/`; no manual deployment, tag, registry release
or remote CI result is claimed.

These corrections do not revalidate Sirius observations, the Nabonassar epoch,
historical sunset boundaries, alternate correlations or deity identities.
Issue `officina-7enh` is closed after source/artifact/browser verification.
