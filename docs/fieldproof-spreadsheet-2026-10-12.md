# Fieldproof: keep document identifiers literal in spreadsheets

Fieldproof now offers XLSX downloads in the review UI and local API. Opening the
previous CSV in Calc changed text `00034` into `34`, `1E10` into a number, and a
20-digit identifier into a rounded numeric value. Enabling formula import also
turned `=1+1` into a calculation. The new workbook stores these as text cells,
while preserving numeric and boolean values, review scopes, original values,
correction provenance and verification status.

Source is pushed as
[`f11b663`](https://github.com/antonsoo/fieldproof/commit/f11b663).
CSV and JSON remain byte-identical for the reproduction fixture. Oversized or
unsupported text produces a cell-specific JSON fallback instead of a partial
workbook. Compact format labels preserve the phone review area and retain the
full accessible button names.

The [study](https://github.com/antonsoo/fieldproof/blob/f11b663/studies/spreadsheet-export/README.md)
includes reproducible API/browser cases, downloadable workbooks, eight inspected
screenshots and artifact hashes. Fifteen actual workbooks were opened in
LibreOffice 7.4.7.2 and validated with Microsoft's Open XML SDK 3.3.0. Their
299 rows and 1,649 text cells retained the expected values, apart from Calc's
recorded CRLF-to-LF normalization in eight cells. No text cell became a formula.
Excel's interactive import was not tested; spreadsheet numeric precision and
newline behavior remain explicit limitations.

A fresh archive passes lint/type checks, 505 Python checks (one real-Tesseract
check skipped), 62 web unit checks and 82 browser workflows. Fresh wheel installs
on Python 3.11.13 and 3.14.7 exercise the fixture CLI and API. All 23 packaged UI
files match the tested build and HTTP-served bytes. The
[public-source receipt](evidence/fieldproof-spreadsheet-2026-10-12.json) verifies
local/remote main equality and every changed public file. Package version 0.2.7,
tags and the hosted demo remain unchanged; no registry release or deployment
was performed.
