# Fieldproof: a passing calculation can hide swapped columns

Source is pushed to
[`0e2b6825c9de53854b84e935c9cfb34a6e02c0e9`](https://github.com/antonsoo/fieldproof/commit/0e2b6825c9de53854b84e935c9cfb34a6e02c0e9).
Package version 0.2.7, tags and the hosted demo are unchanged.

A constructed PDF prints Delivery, quantity `3`, unit price `12.50`, amount
`37.50`. Its fixture swaps quantity and unit price. Baseline `4cb9624` verified
both quoted numbers on the correct item line, and multiplication still passed.

The new column observation compares numeric source locations with a complete,
explicitly labelled header row. A quote under a different declared header now
requires review. It preserves the original values, quote boxes and independent
arithmetic ledger. Custom schemas can configure exact labels through
`RowEvidenceRule.column_headers`; built-in invoices declare Description, Qty,
Unit price and Amount, with specific alternatives. Missing or ambiguous column
evidence remains unavailable and does not change the prior source verdict.

| Controlled observation | Before | Current |
| --- | ---: | ---: |
| Wrongly verified numeric assignments in recognized swapped layouts | 292 | 0 |
| Those fields sent to review | 0 | 292 |
| Original item source locations retained | 1232 | 1232 |
| Original arithmetic ledgers retained | 308 | 308 |

The 308 constructed PDF/input pairs cover 24 column orders, three alignments,
correct/swapped claims, narrow/broad quotes, label variants, missing/ambiguous
headers, page boundaries, intervening prose, header gaps and equal numbers.
They are scripted cases, not independent real-world samples or model outputs.
No field verdict changes outside the recognized swaps. All 105 existing fields
across nine example PDF/fixture pairs retain their complete previous reports
apart from the additive column ledger.

Coverage is deliberately limited. A pinned probe of invoice2data's 11 public
PDF fixtures recognizes **zero complete headers** with these defaults: extra
columns, different labels and sparse/wrapped layouts remain unresolved. That
probe does not claim verification or accuracy on those invoices. The change
cannot prove semantic correctness, completeness or OCR accuracy. The
[study](https://github.com/antonsoo/fieldproof/blob/0e2b6825c9de53854b84e935c9cfb34a6e02c0e9/studies/column-evidence/README.md)
retains this negative coverage result alongside the successful controlled cases.

A clean archive of implementation commit
`6dfb2ee51953698522a91b4166efd1b2c402f1ef` passes lint, type checks and
437 Python tests under 3.12.12; one real-Tesseract check is skipped because the
engine is unavailable. A wheel built from the clean sdist is installed separately
under Python 3.11.13 and 3.14.7. Each repeats those checks, all 308 cases, and ten
actual CLI extract/verify pairs. All 20 JSON outputs match between interpreters;
the installed study reports match the inspected source reports byte for byte.

The web build passes type checks, lint, formatting and 50 unit checks.
The installed server and built static demo pass 76 Chromium/Firefox scenarios.
Four additional paired baseline/current scenarios inspect the misplaced quote,
show the reasons, correct both fields, export the corrections and preserve the
original report. Eight desktop/phone views and four visually inspected final
screenshots are retained. All 23 served UI assets match the tested build.

The 124 selected source/test/example/build inputs match the clean archive.
All 57 `fieldproof/` package files, including 34 Python modules, match clean
source, sdist, wheel and both installations. The final browser capture adds a
visible item-field search filter; the runtime implementation remains unchanged.
The [artifact receipt](https://github.com/antonsoo/fieldproof/blob/0e2b6825c9de53854b84e935c9cfb34a6e02c0e9/studies/column-evidence/results/artifacts.json)
records this harness difference and the archive hashes.

The wheel is 578247 bytes, SHA-256
`3245059c08bf3ecce0162b55a3fafec0b2bf415fc67c84720d963c1efd9a44ed`.
Verification adds work: a constructed 300-row document's five-run median,
including serialization, rises from 180.74 ms to 359.75 ms on this 14-vCPU
WSL2/Linux machine. This local observation is not a latency guarantee.

The [public receipt](evidence/fieldproof-column-evidence-2026-10-12.json)
verifies a clean checkout, exact remote main equality and all 43 changed files
fetched from pinned raw URLs: 1371114 bytes match. Tags and `gh-pages` are
unchanged. No package release or hosted deployment was made.
Tracking: `officina-0uwr`.
