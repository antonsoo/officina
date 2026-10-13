# Fieldproof: claims must survive until review

Source [`9814cf203a010c886c6e66ac30da8f045a10f2aa`](https://github.com/antonsoo/fieldproof/commit/9814cf203a010c886c6e66ac30da8f045a10f2aa)
is pushed and matches remote `main`. All 58 changed files (1,461,561 bytes)
match their pinned public raw URLs. The
[publication receipt](evidence/fieldproof-claim-integrity-2026-10-13-public.json)
retains sizes and SHA-256 hashes. Tags and `gh-pages` are unchanged. No PyPI
release or hosted deployment accompanies these source changes.

At baseline `d477aab`, a controlled synthetic invoice produced four verified
fields and no warnings even after adding a conflicting duplicate total or an
unsupported bank-account claim. Ordinary JSON decoding selected the last
duplicate; Pydantic discarded unknown schema members. A replacement import
also discarded the previous human correction. An escaped lone surrogate passed
CLI validation but broke the server response.

| Input | Previous behavior | Current source |
| --- | --- | --- |
| Conflicting duplicate member, including escaped names | Last value wins | Explicit input error with JSON Pointer |
| Extra claim, row field or evidence-wrapper member | Silently dropped | Schema error with member path |
| NaN, infinity or overflow | Non-finite value admitted | Rejected before report creation |
| Escaped lone surrogate | CLI accepts; server responds 500 | Explicit Unicode error |
| Valid/default/BOM controls | Accepted | Same report bytes |

The shared decoder applies to fixture extraction, saved-result verification,
server uploads and assembled Anthropic SDK replies. Per-call Pydantic validation
forbids extra fields recursively without modifying custom model configuration,
aliases or defaults. This option requires Pydantic 2.12, now the declared floor.

The [controlled study](https://github.com/antonsoo/fieldproof/blob/9814cf203a010c886c6e66ac30da8f045a10f2aa/studies/claim-integrity/README.md)
retains the synthetic PDF, 15 input cases, 12 SDK replies and runnable drivers.
Ten malformed inputs now produce CLI extraction exit 1, verification exit 2
and HTTP 422. Existing destinations, source JSON, reports and human corrections
remain unchanged. Every case permits a later valid import. All five valid
controls keep their baseline report hashes across four environments. The real
SDK streaming parser consumes a synthetic HTTP transport; no live model is called.

The [artifact receipt](https://github.com/antonsoo/fieldproof/blob/9814cf203a010c886c6e66ac30da8f045a10f2aa/studies/claim-integrity/verification.json)
records a clean 674-file archive, lint/type/format checks, 62 web unit checks,
86 production-browser checks and both builds. Python suites each completed
574 checks on locked Python 3.12 source, installed Python 3.11 minimum/current
dependencies and installed Python 3.14 current dependencies. One real-OCR case
is skipped in each because Tesseract is absent. Lowest direct dependencies
include Pydantic 2.12.0 and Anthropic 0.77.0; current installed dependencies
include Pydantic 2.14.1 and Anthropic 1.13.0.

The wheel, source distribution and all three installations match the build's
37 Python files and 23 UI assets. These locally built artifacts still carry
version 0.2.7 and are distinct from the previously published PyPI artifact.
The final evidence commit changes no tested runtime files.

Four additional installed-server browser workflows cover Chromium and Firefox
at 1440px dark and 375px light. They use the file picker to reject initial
malformed imports, import a valid invoice, edit its total and download reviewed
JSON. Replacement extraction after review is an API operation, exercised
explicitly through HTTP. It preserves the report and correction. Served assets
match the installed wheel; no observed page/CSP errors, external requests,
accessibility violations or horizontal overflow. All eight screenshots were
inspected, and a Retry button squeezed by long mobile errors was repaired.

This is a controlled malformed-input study, not an estimate of real-model
error rates. It does not add arbitrary-precision numeric models, resolve
semantic field roles, recover data a caller already discarded or replace
physical OCR testing. The browser checks require the local API; blocking
external requests is not a claim that the server works offline.
