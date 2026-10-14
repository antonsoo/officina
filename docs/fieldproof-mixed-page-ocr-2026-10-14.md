# Fieldproof reads scanned pages alongside native text, 2026-10-14

Fieldproof's documented fallback recognized a PDF only when every page lacked
native text. One native header therefore prevented OCR of a scanned totals page.
The controlled invoice retained three supported header claims but left its
three totals unsupported. This was a capability limit, not falsely verified
evidence.

Code `c30ab15` adds explicit `--ocr-missing-pages` to `extract` and `verify`, and
the library's `load_pdf_with_ocr`. It preserves native pages and recognizes
pages with no native words. Mixed provenance names attempted page numbers,
including blank results; combined word/text budgets and per-page recognition
timeouts apply. Failures preserve the prior result, including in-place verify.

| Workflow | Retained result |
|---|---|
| Three actual mixed layouts | Six supported fields with the option, versus three by default; original page positions retained |
| Default reports | All ten JSON outputs byte-identical to baseline, including native/all-scanned controls |
| Installed Python 3.14.7/current dependencies | 24 real CLI workflows, 44 focused regressions and native-page/direct-TSV comparison pass |
| Installed Python 3.11.13/explicit dependency floors | 24 CLI workflows, full 656-test suite and direct comparison pass; two dependency deprecation warnings |
| Reports across installed environments | All 20 successful outputs byte-identical |
| Actual Tesseract 5.3.4 | All three native pages unchanged; 18 recognized words over four attempted pages match direct TSV text/boxes; actual page-2 timeout and combined-budget rejection checked |
| Plain installation without pytesseract | Native-only option succeeds; mixed input explains missing OCR dependency and preserves output |
| Fresh archive | Configured lint, mypy over 37 source files, 656 tests without skips, bundled UI and wheel/sdist builds pass |
| Web and installed server | 62 web checks and 86 production browser workflows pass; all 23 packaged UI assets match actual served bytes; two installed API controls retain native-only server behavior |
| Artifact identity | All 37 tracked runtime files match source/archive/sdist/wheel/three installs; 23 bundled assets match; 34 live build files match tested Node 26 and bundled Node 24 output |

The [study](https://github.com/antonsoo/fieldproof/blob/91736cf85a79a2f3b15d967e1d01a767e0e1ed4e/studies/mixed-page-ocr/README.md)
retains synthetic PDF inputs, both CLI commands, before/default comparisons,
actual engine TSV, installed versions, source/artifact hashes and an inspected
terminal image. The inputs are clear typeset headers/totals, not camera scans or
a recognition benchmark. Direct TSV agreement checks transport and conversion
using the same recognizer, not independent OCR accuracy.

Five fixed Ubuntu packages were extracted into a temporary runtime without
system installation. The first replay prototype resolved a virtualenv symlink
and lost its dependencies; the corrected replay keeps the executable path.
An extra whole-tree formatter check finds five unchanged baseline files;
all changed files format cleanly and configured lint/type/test checks pass.
The failed logs remain local, and no unrelated installation/formatting fix is
claimed.

Evidence source `91736cf` matches clean remote `main`. Eighteen immutable public
files were fetched back and compared with the checkout; the
[source receipt](evidence/fieldproof-mixed-page-ocr-source-2026-10-14.json)
retains their URLs, sizes and hashes. Issue `officina-bpi1` is closed. The local
0.2.7 wheel was built from its sdist and is not a PyPI release. The build command
`python scripts/bundle_ui.py` bundles `web/dist/`; no hosted update was performed.

The mode does not replace a sparse/incorrect existing text layer, add server
OCR, deskew, recognize handwriting or prove document-wide completeness.
Fields verify against native or recognized text under the existing rules;
OCR can still read a plausible wrong number. The provenance identifies where
that limitation applies.
