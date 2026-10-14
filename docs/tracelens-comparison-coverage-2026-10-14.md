# TraceLens stops comparisons that lost span evidence, 2026-10-14

At baseline `11cf372`, deleting one end timestamp from the native Strands
operation-details capture skips its model-call span. The actual CLI still exits
0 and claims 175 to 104 input tokens (-40.6%), 26 to 12 output tokens (-53.8%),
and two to one chat calls (-50%) on their shared operation path. The parser's
warning does not prevent those misleading numeric improvements. A non-string
parent identifier also silently turns a chat span into a root, creating a
false operation move without a warning.

Implementations `5c004fb` and `d05bf0d` mark observable span inventory, timing
and ancestry failures with structured parser issues. `compareTraces` raises
`TraceComparisonError` before producing quantitative output. Parser failures
remain distinct. The browser's existing validation rejects a candidate or
trace selection before replacing the complete result. Partial traces remain
individually inspectable with their original warnings and subtotal semantics.

| Actual verification | Result |
|---|---|
| Eight unchanged SDK fixtures plus labelled damage/zero/scoping/recovery cases | Thirty-seven cases, 111 core/CLI JSON/terminal workflows: baseline 60 disagreements, corrected zero |
| Ordinary controls | All 45 complete core and CLI captures identical |
| Observable comparison issues | Skipped span IDs/timestamps, unreadable records/containers, truncated JSONL tail, reversed interval and missing/invalid parent identity reject comparison |
| Scope and recovery | Known failures in another selected-away trace do not block the current trace; related files can resolve parents; optional event warnings and explicit zero durations remain supported |
| Fresh Node 24.21.0 archive | Lint, strict types, 431 unit checks in each default/German locale, both builds, 32 CLI checks, additional browser audit and 132 production-browser checks pass |
| Local packed 0.3.3 CLI/core | Exact Node 20.0.0 and Node 26.7.0 each pass all 111 workflows with complete source-identical captures; actual installed bin and floor summary/tree/links commands also run |
| Artifact identity | All 561 baseline and 565 implementation archive files match source; all 34 web and 29 CLI files match Node 24/26; all 32 packed files match the clean build and install |
| Actual offline replacements | Chromium/Firefox at 1440/375 px: 64 workflows, baseline 32 disagreements, corrected zero; every rejection preserves the entire previous comparison and every view recovers |
| Served bytes and visual review | All 24 served/browser-loaded files match each build in eight views; server shuts down before replacements; eight screenshots inspected; no overflow, script/CSP errors, external/late requests or axe findings |

The [study](https://github.com/antonsoo/tracelens/blob/2c88eb6b61370c2f605fe8f388dc170dd3bc376d/studies/comparison-coverage/README.md)
retains native input digests, actual core/CLI before/after captures, final
installed results, browser downloads, complete build/package/check-log hashes
and real screenshots. Identical installed records reference the verified
source capture once; nine distinct browser reports represent 64 actual
downloads. Every retained reference was checked against the original full
capture. The native SDK fixtures originate from instrumentation test/replay
runs; all damaged candidates are explicitly constructed. No live model,
provider, collector or Jaeger server call occurred in this study.

The corrected screenshots show the retained original six-span comparison
after rejection. Their zero changes are not measurements of the rejected
candidate. No application styling or frontend layout changed.

Initial checks identified an exact warning-object assertion and two fuzz
assumptions that every inspectable trace could be compared. Typed comparison
refusals now have their own error class; fuzzing still rejects unexpected
exceptions. Final fresh checks passed. The first browser driver ran before its
target build existed and failed with ENOENT; the final replay uses completed
builds. These observations were not presented as repaired product failures.

Source `2c88eb6b61370c2f605fe8f388dc170dd3bc376d` matches clean remote main.
All 28 changed source/study/image files were fetched at immutable public URLs
and byte-matched. The [publication receipt](evidence/tracelens-comparison-coverage-2026-10-14-public.json)
records sizes and hashes. The gh-pages head remains
`0a09eefa2516409e9aff3367a8880cfbf114815d`. No npm release, tag, manual deployment
or remote CI result is claimed. Issue `officina-7ofu` closes after source,
installed-artifact, offline-browser and public-byte verification.

The gate detects observable import problems; it cannot detect entirely omitted
spans with no surviving references or import warnings. It does not certify
complete instrumentation, sampling, cross-service clock agreement or billing.
Individual partial-trace cost/timing inspection still requires its disclosed
warnings and subtotal interpretation. The existing self-time clipping and
operation-grouping rules remain.
