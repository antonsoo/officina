# Contextscope: distinct numeric IDs must not become a cache hit

Source is pushed to
[`71f3a1a02d6975f395b38a499b9a3881a6123a1b`](https://github.com/antonsoo/contextscope/commit/71f3a1a02d6975f395b38a499b9a3881a6123a1b).
Package version 0.3.3, tags and the hosted demo are unchanged.

At baseline `f8dcdb0d2f3617b046d29aa42f396e7c4ce9721c`, the Anthropic Python SDK
serialized two tool-schema IDs distinctly: `18446744073709551614` and
`18446744073709551615`. Contextscope turned both into `18446744073709552000`,
marked the input complete, matched all three prompt segments and predicted a
2,104-token cache read on request two. These were synthetic requests captured
through the actual SDK with socket connections forbidden; no provider cache
behavior was measured.

The parser now rejects numbers whose mathematical decimal value changes during
parsing and prompt serialization. It preserves equivalent spellings and ordinary
decimals. The guard covers whole records, metadata and nested string request
bodies. Unsupported precision is an explicit limitation, not arbitrary-precision
analysis. Affected JSONL records cannot silently become skipped lines.

| Observed numeric outcome | Before | Corrected |
| --- | ---: | ---: |
| Value-preserving cases accepted | 1,065/1,065 | 1,065/1,065 |
| Value-changing cases rejected | 35/910 | 910/910 |
| Outcomes matching Python Decimal | 1,100/1,975 | 1,975/1,975 |

The [study](https://github.com/antonsoo/contextscope/blob/71f3a1a02d6975f395b38a499b9a3881a6123a1b/studies/numeric-integrity/README.md)
retains SDK request bytes, the independent Decimal comparison and before/after
library, CLI and browser receipts. Twelve library/CLI workflows cover nine
unsupported inputs and three valid controls. The corrected CLI exits 1 and
writes no new report for unsupported values.

Chromium 153 and Firefox 155 run offline at 375 and 1440 pixels. Each context
performs 13 candidate uploads, 14 report downloads and a fresh pasted import.
All ten affected uploads per context now fail while preserving the previous
report; valid inputs recover normally. Eight before/after screenshots were
inspected. The clean build reproduces the same browser results, with all ten
served assets byte-identical.

All 10,555 reconstructed request records from 240 hash-verified public
Anthropic trajectories parse to unchanged values. Complete analysis JSON for
all 11 bundled examples is byte-identical. This is a compatibility replay,
not a new measurement of provider token counts or cache prediction accuracy.

A clean archive of production commit
`16488ec1968a43c2452d1568a31bae5be1e91e62` passes locked Node 24.21.0 installation,
lint, strict typechecking, 486 unit tests, a production build and 90 existing
browser scenarios. All 158 build inputs and 180 built files match the exercised
checkout; the build files total 4,356,746 bytes.

The local npm tarball is 95,255 bytes, SHA-256
`5b3245005ca70919b42cd9822d653a8a2eceb4679474f57400aa993303760c8b`.
All 95 installed package files match the clean archive and tarball. On both
Node 20.0.0 and 24.21.0, the separate installation passes all 12 workflows and
all 1,975 Decimal cases. No registry release was made.

The [public receipt](evidence/contextscope-numeric-integrity-2026-10-12.json)
verifies clean source, exact remote main equality and all 39 changed files
fetched from pinned raw URLs: 2,023,416 bytes match. Tags and `gh-pages` are unchanged.

```text
71f3a1a docs: retain numeric integrity SDK and installed evidence [skip ci]
16488ec fix: reject numeric content changed by prompt serialization [skip ci]
```
