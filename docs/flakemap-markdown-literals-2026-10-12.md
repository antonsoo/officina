# Flakemap: keep report evidence literal in Markdown

Source is pushed to
[`ae3158e7a1fb7f6609e614c771500c02400a8058`](https://github.com/antonsoo/flakemap/commit/ae3158e7a1fb7f6609e614c771500c02400a8058).
Package version 0.3.7, release tags and hosted files are unchanged.

At baseline `b1b2084a89f61a02f70fd9b91069b68fb51fa1b9`, the CLI's Markdown
report wrapped names in HTML code tags. GitHub Flavored Markdown still parsed
images, links, emphasis and strikethrough inside them. A pytest parameter ID
containing image syntax became an image instead of the complete test name;
change-point run IDs, group evidence and warning text could change too.

The correction uses native Markdown code spans with delimiters longer than
any imported backtick run. It preserves boundary spaces and backticks and
handles GFM's different pipe rules inside and outside tables. Entity escaping
alone is insufficient: the reference renderer still autolinked an email address.
Flakemap gains no runtime dependency.

| Six actual CLI workflows | Before | Corrected |
| --- | ---: | ---: |
| Inspected fields retaining complete literal text | 36 of 80 | 80 of 80 |
| Image elements created from imported values | 11 | 0 |
| Links created from imported values | 24 | 0 |

These checks include repeated fields in different report locations, not 80
independent inputs. The project-attribution link remains. All 18 JSON, terminal
and standalone HTML reports are byte-identical before and after, including
statistics, retry records, source evidence and incomplete-input warnings.

The [study](https://github.com/antonsoo/flakemap/blob/ae3158e7a1fb7f6609e614c771500c02400a8058/studies/markdown-literals/README.md)
retains sixteen actual pytest 9.1.1 XML reports with 192 testcase records,
their producer and hashes, all generated Markdown and reference-rendered HTML,
and four inspected screenshots. The test history is deliberately controlled:
eight passing executions followed by eight failures, not a production project's
reliability record. Run IDs come from explicit sidecars. Other workflows include
a synthetic truncated-file warning, a nested-name control and the existing
captured Surefire, shared-service and GoogleTest histories.

The independent renderer is compiled cmark-gfm `0.29.0.gfm.13` at pinned source
`27d942c8b0a62d192f616e5bf3578f4b6a89e180`, with table, autolink, strikethrough
and tagfilter extensions. Another 52 paragraph/table boundary cases preserve
exact code text for spaces, backtick runs, backslashes before pipes, literal
entities, HTML and Unicode.

Chromium and Firefox open all six before/after reports at 1440 and 375 pixels:
48 offline loads. Their DOM text and element counts agree with the independent
parser. Baseline images attempt 16 requests, blocked by offline routing; the
corrected reports attempt none and have no page errors or viewport overflow.
The local study wrapper allows table scrolling at phone width. This verifies
GFM output, not a hosted GitHub page, its sanitization or image proxying.

A clean archive of production commit
`647d2a89e0ed410fc696f6eb614b9ecadffef15f` passes lint, formatting, type
checks and all 366 tests under Python 3.12.12. The existing standalone-report
suite passes 112 offline browser scenarios. All 617 selected production, test,
example and build inputs match the tested checkout; 29 of the 30 Python modules
remain byte-identical to baseline.

The wheel is built from the clean archive's sdist. Fresh offline installations
pass all 366 tests under Python 3.10.21 / minimum Rich 13.7.0 and Python 3.14.7 /
Rich 15.0.0. Both pass the six CLI workflows and 52 boundary cases, and all 30
output files per replay match the inspected report bytes. Installed console
commands also process the documented 222-run demo history. Verification ran on
Linux/WSL2.

The wheel is 91,315 bytes, SHA-256
`efb380335b48c4b15679b5abcb3ba71f06467616edfda52871620bd95b5eb63f`.
All source modules match the sdist, wheel and both installations. All 35 wheel
files match the installations except the installer-generated `RECORD` manifest.

The [public receipt](evidence/flakemap-markdown-literals-2026-10-12.json) verifies
a clean checkout, exact remote main equality and all 78 changed files fetched
from pinned raw URLs: 1,257,935 bytes match. Tags and `gh-pages` are unchanged.
No registry release or hosted deployment was made. Tracking: `officina-n80d`.
