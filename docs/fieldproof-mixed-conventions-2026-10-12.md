# Fieldproof: defaults cannot settle contradictory evidence

Pushed source at
[`b6158f6`](https://github.com/antonsoo/fieldproof/commit/b6158f654986099945b563ca7a32bfc51558fb74)
keeps conflicting number/date conventions distinct from absent evidence.
Previously, changing caller defaults could verify either `60` or `60000` from
the same `60.000` quote, or either March 4 or April 3 from `03/04/2026`, even
when the PDF contained decisive examples of both conventions. Now those
ambiguous fields need review; defaults still apply when evidence is absent,
and unambiguous values remain usable.

The [reproducible study](https://github.com/antonsoo/fieldproof/blob/b6158f654986099945b563ca7a32bfc51558fb74/studies/mixed-conventions/README.md)
uses eight synthetic PDFs, nine fallback pairs and two paired interpretations.
All 576 field decisions retain source quotes, pages and actual PDF boxes.
No model or provider is called.

| Observation | Baseline `c006a5e` | Corrected source |
|---|---:|---:|
| Reports matching declared expectations | 102 / 144 | 144 / 144 |
| Ambiguous claims verified despite conflicting conventions | 48 | 0 |
| Unambiguous controls verified | 288 / 288 | 288 / 288 |

Actual CLI captures move the illustrative invoice from four verified fields to
two verified and two needing review. Both installed entry points (`verify` and
fixture-backed `extract`) pass all 36 fallback/interpretation combinations on
Python 3.14 and minimum-dependency Python 3.11, with equal normalized reports.
The unchanged public receipt driver also replays 133,722 paired cases across
1,052 CORD/SROIE documents: no verdict or location changes. All four cached
source files match the original manifest. This is annotation compatibility,
not new OCR/model output or evidence that pre-existing wrong locations are fixed.

The clean archive passes lint, formatting, mypy, 412 Python tests, 50 web unit
checks and 74 production-browser scenarios. The bundled wheel passes 412 tests
and the exact-input PDF replay in each of three separate environments: Python
3.14 and 3.11 with current dependencies, and Python 3.11 with explicitly
resolved minimum direct dependencies. All 143 product/build/check inputs match
the archive; all 33 installed Python files and 23 bundled static files match
their source/build counterparts.

The real installed review UI passes the new scenario in Chromium and Firefox
at 1440 and 375 pixels, including accessibility, highlights, human corrections,
actual JSON downloads and session reload. Corrections preserve the original
automated verdict. All four screenshots were opened and inspected. Each
browser's six actual application asset responses match the installed wheel
and clean build, with no external requests. This UI uses a local Python server.
The server does not expose caller fallbacks: its ambiguous fields already
needed review; the new visible behavior is the explicit conflict explanation.

Inference remains a document-wide heuristic, not a field-specific locale
model. Date-shaped identifiers can look like dates, and a unique irrelevant
signal can still mislead inference. A conflict does not establish which
interpretation is correct.

The [public-source receipt](evidence/fieldproof-mixed-conventions-2026-10-12.json)
compares clean HEAD with remote `main` and all 31 changed files fetched at the
exact commit. The final push uses `[skip ci]`; `gh-pages` remains at
`4563246758c22d13e9af8bd68ed46e3482e588e1` and release-tag refs are unchanged.
No package, tag or hosted site was published by this work.
