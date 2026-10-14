# TraceLens cost coverage after incomplete imports

TraceLens previously treated the surviving charges after a skipped model call as
a full token estimate. Source now preserves those charges as a known subtotal,
leaves the full estimate unknown, and explains the distinction in CLI cost/summary
output, the browser header and ledger, and downloaded cost JSON.

## Reproduced behavior

The native Strands SDK census capture contains two model calls, 175 input and 26
output tokens. At explicitly illustrative user rates of $1 per million input and
$2 per million output tokens, its token estimate is $0.000227. Removing the first
call's end timestamp skips that call. The remaining 104 input and 12 output tokens
cost $0.000128 at those rates. Previously `estimatedCostUsd` was $0.000128 and the
CLI/browser headlines still called it an estimate, despite the parser warning.

The corrected report has `knownCostUsd: 0.000128`, `estimatedCostUsd: null`, and
`incompleteInput: true`. Retained counts remain one priced and zero unpriced calls.
The number, identity and charges of omitted calls remain unknown. This is a
constructed damage variant of a captured export, with illustrative accounting
rates; no live model/collector request or provider invoice is being assessed.

Observed inventory losses include structured skipped-span/container and truncated
JSONL issues, plus absent parent spans. Known trace identities retain their
selection scope; unknown identities remain conservative. Related files can resolve
missing parents. Timing errors, invalid parent values and optional event warnings
alone do not withhold otherwise valid token charges. Unobserved missing leaves
remain undetectable. Summary `totalCostUsd` remains a known subtotal; consumers
should consult `costReport.estimatedCostUsd` for full-estimate availability.

## Verification

| Workflow | Population | Before disagreements | After disagreements |
| --- | --- | ---: | ---: |
| Core cost/summary, actual CLI JSON/text | 37 cases, 185 workflows | 85 | 0 |
| Installed local tarball on Node 26.7.0 | 185 workflows | - | 0 |
| Installed local tarball on exact Node 20.0.0 | 185 workflows | - | 0 |
| Offline Chromium/Firefox at 1440/375 px | 80 workflows across two builds | 24 | 0 |

All 100 unaffected API/CLI captures are identical, including ten observations of
already-rejected malformed Jaeger controls. All retained API charges are unchanged.
Both installed replays equal the clean source capture. Browser cost JSON equals
CLI/core output; selected-call receipt downloads keep the retained charge. Every
view restores the unmodified capture's estimate after damaged imports.

The browser server was stopped and both browsers were offline before subsequent
file imports. Each of eight views served and browser-loaded 24 matching build
files, with no external/late requests, page/policy errors, accessibility violations
or document overflow. All eight real before/after screenshots were inspected.
Mobile cost ledgers retain their existing internal scrolling behavior.

Fresh Node 24.21.0 install, lint, strict types, both builds, 32 CLI tests, the existing
browser audit and 134 Playwright tests passed. Full unit runs passed all 437 tests
in each of the default and German locales with two workers. Initial default
concurrency exceeded unchanged parser/fuzz wall-clock limits; no assertion or
limit was relaxed. The compiled parser is byte-identical; a separate isolated
synthetic 20,001-span replay is retained as timing evidence, without claiming a
parser speed improvement.

All 588 implementation archive files remained unchanged after checks; all 580
baseline archive files match pinned source. All 34 web and 29 CLI build files match
between clean Node 24 and working Node 26 builds. All 32 package files match both
the clean build and independent installed consumer. The locally packed 0.3.3
artifact is 57,998 bytes, SHA-256
`b53ccc7a4b56a002ea82af6fc824b26ec157a7a9044623cb3da06f3fabee6664`.

## Public source evidence

- Baseline: `2c88eb6b61370c2f605fe8f388dc170dd3bc376d`.
- Implementation: `926be7d0b457825c7129c01c727edf10fb0fc2b6`.
- Public source: `b7773d699ec3590c81bd455f87a2d36581e53ce2`.
- [Pinned reproduction and rules](https://github.com/antonsoo/tracelens/blob/b7773d699ec3590c81bd455f87a2d36581e53ce2/studies/cost-coverage/README.md).
- [Verification and artifact digests](https://github.com/antonsoo/tracelens/blob/b7773d699ec3590c81bd455f87a2d36581e53ce2/studies/cost-coverage/results/verification.json).
- [Public byte receipt](evidence/tracelens-cost-coverage-2026-10-14-public.json).

The clean local source HEAD equals remote `main`. All 30 changed immutable public
files were fetched and byte-compared: 3,780,769 bytes, with per-file SHA-256 and
size in the receipt. The `gh-pages` branch remains
`0a09eefa2516409e9aff3367a8880cfbf114815d`.
This is a pushed source correction and verified local package/build. No npm
publication, version tag, manual deployment or remote CI success is claimed.

Tracking: `officina-xcrs`.
