# Errorbars: malformed personal-run reports are not model scores

Source is pushed to
[`3e63c255e83381f2151e1353048d5f16e1408326`](https://github.com/antonsoo/errorbars/commit/3e63c255e83381f2151e1353048d5f16e1408326).
The hosted demo, tags and package releases remain unchanged.

The SWE-bench study exporter treated a null, false, numeric or empty-object result
field as an empty resolved set. A constructed `resolved_ids: null` report therefore
became 500 zero scores. Compared with a real public run, that produced an apparent
4.4-point loss with exact McNemar p = 0.0000004768. This was analysis of invented
scores, not evidence about a personal model.

The exporter and browser now require result fields to be lists of strings. If both
`resolved_ids` and `resolved` are present, their task sets must agree. Invalid
exports produce no CSV; rejected browser pastes retain the previous comparison.
Explicit empty lists remain valid zero-resolution results.

| Workflow | Baseline | Corrected |
| --- | ---: | ---: |
| Malformed CLI cases rejected without CSV or traceback | 4/22 | 22/22 |
| Malformed browser pastes rejected, prior result preserved | 72/88 | 88/88 |
| Valid JSON CLI controls accepted | 6/6 | 6/6 |
| Valid browser pastes accepted | 24/24 | 24/24 |

All 175 retained submissions still export the same 87,500 CSV rows byte for byte.
A pinned public legacy report also retains all 500 rows and 22 resolved tasks.
The study's explicitly documented treatment of unreported tasks as failures is
preserved; a coverage-change hypothesis was checked and discarded. No claim is
made that every benchmark task was observed or that these malformed inputs occurred
in production.

A fresh archive passes Ruff, strict mypy, 655 Python tests, ESLint, TypeScript/Vite,
691 web tests and 52 Chromium/Firefox workflows. The exporter replay also matches
under Python 3.10.21 and 3.14.7. Four offline desktop/phone browser replays cover
112 imports; every rejected comparison is checked for preservation, and all four
screenshots were viewed. All 428 archived files, 65 build files and 61 served assets
agree with their compared source, clean build and actual browser-served copies.
The Python runtime package and statistical formulas are unchanged.

The [study](https://github.com/antonsoo/errorbars/blob/3e63c255e83381f2151e1353048d5f16e1408326/studies/own-run-imports/README.md)
and [verification](https://github.com/antonsoo/errorbars/blob/3e63c255e83381f2151e1353048d5f16e1408326/docs/verification-own-run-imports-2026-10-12.md)
retain commands, individual cases, receipts and limitations. The
[public-source receipt](evidence/errorbars-own-run-imports-2026-10-12.json) verifies
clean local/remote main equality and 26 changed files, 787,825 bytes, against pinned
public source. Tags and `gh-pages` match the pre-work refs.
