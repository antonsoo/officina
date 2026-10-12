# Errorbars: refuse lossy table imports

Source is pushed to
[`fac30b143f7c99f6b75e8b80b64a41f3af317a96`](https://github.com/antonsoo/errorbars/commit/fac30b143f7c99f6b75e8b80b64a41f3af317a96).
The PyPI release, version 0.2.4, tags and hosted demo remain unchanged.

A DataFrame with duplicate `score` columns previously lost its first score column
when converted to records. The constructed 40-question example changed A - B from
+0.2 to -0.2 by keeping the last column. Neither is a justified interpretation of
ambiguous input. The API now requires explicit selection or renaming before loading.
Duplicate row indexes remain valid.

The CSV reader also repaired unfinished quoted fields at EOF and text after closing
quotes. These malformed inputs could reach analysis and overwrite an existing report.
Strict parsing now turns these errors into path-and-line diagnostics before output.

| Reproduced workflow | Before | After |
| --- | ---: | ---: |
| Duplicate column cases rejected without data loss/warnings | 0/8 | 8/8 |
| Malformed CSV cases with located parser errors | 0/12 | 12/12 |
| CLI failures preserving files, without stdout or traceback | 0/48 | 48/48 |
| Valid constructed CSV variants retaining every value | 48/48 | 48/48 |

Six malformed cases were accepted by the old library; 18 baseline CLI commands
replaced existing output files. All 48 corrected workflows preserve those files.
Valid DataFrames, 1,557 records across seven retained CSVs and 1,000 records from two
retained SWE-bench submissions are unchanged. Valid comparison JSON and HTML are
byte-identical before/after and in the two installed-wheel environments.

A clean Python 3.12 archive passes Ruff, strict mypy and 627 tests. Its sdist-built
wheel passes the full reproduction and 47 import tests on Python 3.10/pandas 1.5 and
Python 3.14/pandas 3.0.6. All 407 tracked archive files and 26 package files agree
with their compared source, archive, sdist, wheel and installed copies. Four actual
offline report workflows in Chromium/Firefox at phone/desktop sizes inspect source
lines and download complete JSON plus filtered CSV. All four screenshots were viewed;
all 28 existing report-browser workflows also pass.

The [study](https://github.com/antonsoo/errorbars/blob/fac30b143f7c99f6b75e8b80b64a41f3af317a96/studies/table-imports/README.md)
and [artifact verification](https://github.com/antonsoo/errorbars/blob/fac30b143f7c99f6b75e8b80b64a41f3af317a96/docs/verification-table-imports-2026-10-12.md)
retain scripts, results, hashes and limitations. Detecting unfinished quotes does
not prove dataset completeness: missing whole records and truncated unquoted values
can still be valid CSV. No production-incident or model-quality claim is made.

The [public-source receipt](evidence/errorbars-table-imports-2026-10-12.json) verifies
clean local/remote main equality and all 23 changed files, 1,305,072 bytes, against
pinned public GitHub source. Tags and `gh-pages` match the pre-work refs.
