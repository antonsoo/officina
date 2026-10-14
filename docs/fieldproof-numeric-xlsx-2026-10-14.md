# Fieldproof preserves numeric evidence in spreadsheet exports, 2026-10-14

Baseline `91736cf` writes every finite number as an XLSX numeric cell. Actual
offline LibreOffice Calc reads integer `9007199254740993` as
`9007199254740992`. Three other constructed integer spellings also change.
A direct Python writer call with `10**400 + 1` raises `OverflowError` while
checking finiteness through float conversion. The existing review API rejects
that last correction with 422; no API 500 was reproduced.

Implementation `d23be20` keeps numbers outside a conservative spreadsheet
precision range as literal inline text in both writers. Numeric cells require
absolute value below `10**15`, at most 15 significant digits in the current
float spelling, and zero or a normal binary64 magnitude. Large Python integers
are checked without float conversion. Ordinary numeric, boolean and blank
types remain; original extracted values and correction provenance are retained.

| Actual verification | Result |
|---|---|
| Constructed writer and real upload/extract/review/export API | 58 workflows: baseline 34 policy disagreements; corrected zero; 24 ordinary controls byte-identical |
| Direct browser writer | 17 cases: seven baseline disagreements; corrected zero; ten ordinary controls byte-identical |
| Native Calc 7.4.7.2 in a network-disabled container | Twenty workbooks and 93 rows: 26 baseline policy disagreements, corrected zero; all four changed integers now survive exactly |
| Actual source demo/live browser downloads | Chromium/Firefox at 1440/375 px: 128 workflows, baseline 48 disagreements, corrected zero; sixteen ordinary-control workbooks byte-identical |
| Final wheel built from bundled-UI sdist | Fresh Python 3.12 and minimum 3.11 installs pass 58 workflows each with complete source-identical captures |
| Actual installed bundled UI | Thirty-two browser workflows per installation pass without source import or static-asset overrides |
| Fresh Python checks | Ruff/mypy pass; Python 3.12, 3.14 and lowest direct dependencies on 3.11 each pass 660 tests; five optional native Tesseract tests skip because the system binary is unavailable; minimum dependencies emit two deprecation warnings |
| Fresh Node 24 checks | Lint, strict types, formatting, 70 web tests, both builds and 86 existing production-browser workflows pass |
| Artifact identity | All 846 baseline and 850 implementation archive files match source; all 34 files in each Node 24/26 build match; all 37 Python and 23 bundled-UI files match the final wheel and both installs |
| Loaded bytes and visual review | Twenty-four source/installed views: 26 loaded files in demo mode, 23 in live mode; every loaded asset byte-matches its tested build; no script/CSP errors, external/late requests, axe findings or overflow; three screenshots inspected |

The [study](https://github.com/antonsoo/fieldproof/blob/9f14325fb674471131297dd0e1718a45369a5cba/studies/numeric-xlsx/README.md)
retains portable drivers, raw native spreadsheet reads, both API scopes,
installed-package results, independent scalar comparisons, source/build/package/
check-log hashes and 34 distinct actual workbooks. Identical downloads share a
retained file. These are constructed transport cases and a synthetic invoice,
not real account data or an extraction-accuracy benchmark. The deliberately
extreme browser correction remains visibly separate from original automated
verification. The native reader has 46 baseline and 47 corrected observations
because the baseline could not write the 401-digit case.

An initial burst of download clicks timed out; the final driver paces separate
exports. An unopened log stream also caused a server-driver startup error;
piping child output corrected it. Both complete final phases were rerun. No
application change was made for either observation. The final package includes
the UI via `scripts/bundle_ui.py`; preliminary unbundled packages are not the
published verification target.

Source `9f14325fb674471131297dd0e1718a45369a5cba` matches clean remote main.
All 64 changed files were fetched at immutable public URLs and byte-matched;
the [receipt](evidence/fieldproof-numeric-xlsx-2026-10-14-public.json) records
sizes and hashes. The gh-pages head remains
`4563246758c22d13e9af8bd68ed46e3482e588e1`. The final local wheel still identifies
as `0.2.7`; no PyPI release, tag, manual deployment or remote CI result is claimed.
Issue `officina-brhr` closes after all source, installed, native-reader, browser
and public-byte verification.

Text fallback preserves the current scalar spelling, not precision already
lost in a caller's float or JSON conversion. Such cells need explicit conversion
for spreadsheet arithmetic. Existing review bounds, JSON/CSV serialization,
automated verification and application styling remain unchanged. Excel was
not available for interactive verification; its documented precision/range
motivates the conservative policy, while Calc provides the actual native read.
