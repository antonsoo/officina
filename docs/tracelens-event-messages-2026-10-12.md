# TraceLens: keep damaged message events inspectable

Pushed source at
[`bea26a8`](https://github.com/antonsoo/tracelens/commit/bea26a80aeadbca3659c493a7378597582c0f410)
keeps a malformed nested tool payload from rejecting an otherwise readable
trace, and restores output events suppressed by input-message attributes.

| Reproduced input                                             | Baseline                                   | Corrected source                                        |
| ------------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------- |
| Truthy primitive `toolUse` or `toolResult` in a legacy event | Whole file fails with a TypeError          | All six spans open; original message and scoped warning |
| Null, array, incomplete or ambiguous content block           | Empty content or arbitrary member selected | Whole original message retained with warning            |
| Input attribute with output event, or the reverse            | Opposite direction disappears              | Missing direction filled independently from events      |
| First trace import after disconnecting                       | Monospace font requests fail               | Bundled faces load during startup                       |

The [reproducible study](https://github.com/antonsoo/tracelens/blob/bea26a80aeadbca3659c493a7378597582c0f410/studies/event-messages/README.md)
uses controlled mutations of two retained Strands SDK captures, originally
emitted while replaying recorded provider responses. These are not additional
production incidents. Baseline `3d3343d` matches nine of 39 intended outcomes
and rejects eight files; corrected source matches all 39 and rejects none.
Every accepted case retains six spans, raw event strings and unchanged
non-message fields, timing and cost evidence. The existing 22-file corpus
remains identical across 27 trace selections and 127 spans. This does not
rerun the full historical instrumentation census or independently validate
prices.

Each CLI replay invokes `summary`, `tree` and `cost --json` on all 39 files.
The separately installed packed artifact reproduces the complete clean-build
results on Node 20.0.0 and 24.21.0, including 117 CLI invocations per runtime.
The actual installed executable and README commands work; all 26 installed
JavaScript/declaration files match the build.

Clean source archive `194a6d2` passes lint, both TypeScript projects, build,
30 CLI checks, the browser interaction/audit driver and 120 Chromium/Firefox
workflows. The default unit run has one performance-threshold failure:
1354.87 ms for 20,001 spans against a 1000 ms ceiling. All 361 checks pass
with two workers and the same ceiling. Separate alternating measurements
give medians of 157.88 ms before and 148.17 ms after, across six timed runs
after two warmups on 14-vCPU WSL2 Linux, 48 GB RAM. This is not a general
latency guarantee or an established speedup.

Both browser revisions run 156 offline imports: Chromium and Firefox, each
at 1440 and 375 pixels, with the HTTP server stopped before the first import.
Eight file rejections in each baseline context become zero. All 39 bundled
font faces load before disconnecting in the correction, with zero later HTTP
requests, failed loads, console/page errors, external requests or CSP
violations. Baseline has eight failed font requests across four contexts.
The 21 font files are byte-identical, totaling 315,324 source font bytes now
loaded during startup. All 16 screenshots were opened and inspected; warning
text, original content and recovered tool calls remain readable at 375px.
The pictured states pass axe and have no page overflow.

The [public-source receipt](evidence/tracelens-event-messages-2026-10-12.json)
checks clean local HEAD against remote `main` and byte-compares all 34 changed
files fetched at the exact commit. All 156 build/check inputs still match the
verified clean archive. The hosted `gh-pages` branch remains at
`0a09eefa2516409e9aff3367a8880cfbf114815d`; release-tag refs are unchanged.
The final push carries `[skip ci]`. No registry package, tag or hosted site
was published by this work. Browser claims apply to the retained local build.

Legacy JSON content-block recognition remains a heuristic. Unknown shapes
stay raw text, guards do not validate the complete Bedrock API schema, and
excessive payload nesting still rejects. Attributes win within their own
message direction; conflicting representations are not reconciled.
