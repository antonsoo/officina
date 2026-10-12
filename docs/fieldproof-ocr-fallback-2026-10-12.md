# Fieldproof: make the documented scanned-PDF workflow work

Source [`4cb9624`](https://github.com/antonsoo/fieldproof/commit/4cb9624f6a8342003bd81d7aea11e5e7cc1ddb25)
connects `extract` and `verify` to the optional local OCR loader. Previously,
both commands stopped on image-only PDFs despite the README and server error
directing users to that fallback. With real Tesseract available, the existing
library read 92 words from a rasterized invoice while the CLI returned no result.

| Input | Before | Pushed source |
| --- | --- | --- |
| Image-only invoice, receipt, contract | Exit 1 | Extracts and verifies recognized text |
| Blank page before scanned invoice | Exit 1 | Evidence remains on page 2 |
| Entirely blank PDF | Exit 1 | Explains that OCR found no words |
| Missing OCR dependency/engine/data | Exit 1 | Actionable error; previous output preserved |
| Native-text PDF | Works | Same report bytes in the replay |

Reports now retain OCR engine/version, language, rendering resolution and page
coverage, with a warning that verification checks recognized text. Actual OCR
read the synthetic receipt's `Cold Brew 16oz` as `Cold Brew 160z`; all three
affected row fields go to review. This is useful error evidence, not a claim
that OCR always detects its own mistakes.

The [retained study](https://github.com/antonsoo/fieldproof/blob/4cb9624f6a8342003bd81d7aea11e5e7cc1ddb25/studies/ocr-fallback/README.md)
contains the five image-only/blank PDFs, actual CLI captures, direct Tesseract
TSV, word boxes, reports and inspected screenshots. It replays stored synthetic
extractions; no model or remote OCR service was called. All 425 recognized words
over six pages match direct TSV coordinates and text. A real recognition process
also terminates under the library's explicit timeout.

A clean archive and isolated wheels pass 426 Python checks on Python 3.12,
3.11 with direct dependency floors, and 3.14 with current dependencies. The floor
includes pytesseract 0.3.10 and Pillow 12.3.0; two dependency deprecation warnings
remain recorded. Each installed environment passes 22 CLI outcomes. All 16
successful reports agree byte-for-byte across those environments, and eight
native reports match baseline. A plain wheel without the OCR extra still handles
native PDFs. The existing web suite passes 50 unit checks and 74 Chromium/Firefox
workflows. Installed package files match the wheel in all three isolated installs.

The CLI defaults to English at 144 DPI, bounded page/text budgets and a 30-second
recognition timeout per page. The library exposes language, timeout and budgets.
PDFs containing any native text keep the native loader; this does not recognize
image-only pages inside a mixed document. The review server still requires a
text layer. No physical scans, handwriting, Windows/macOS runtime or OCR accuracy
benchmark is claimed.

The [public-source receipt](evidence/fieldproof-ocr-fallback-2026-10-12.json)
checks a clean worktree, matching local/remote HEAD and freshly fetched matching
bytes for all 89 changed public files (2,022,310 bytes). Both commits use
`[skip ci]`. Package metadata remains 0.2.7; Pages and release-tag refs are
unchanged. No package release, tag or hosted deployment was made.
