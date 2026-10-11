# Verified trace import corrections, 2026-10-11 UTC

Two more reproduced defects are corrected in TraceLens. Source is pushed and
the public viewer is updated. This continues the [audio/MCP batch](verified-audio-and-mcp-2026-10-11.md)
without changing its historical receipts. Work was performed without sub-agents.

| Before | After | Evidence |
| --- | --- | --- |
| An actual SDK export with all five events dropped produced no warning. Span/event attribute omission counts were discarded too. | Counts survive parsing and span downloads; browser and CLI reports expose scoped warnings. | [SDK limit capture](https://github.com/antonsoo/tracelens/blob/6d55a073678b27e483a59656610d33a9da3a1a49/studies/dropped-evidence/README.md) |
| Missing Jaeger duration became measured zero. Failed microsecond conversions sometimes became nanosecond dates, and malformed events could disappear or become empty events at epoch. | Invalid spans/logs are skipped with warnings. Known zero durations and timestamps remain valid. | [Controlled partial exports](https://github.com/antonsoo/tracelens/blob/6d55a073678b27e483a59656610d33a9da3a1a49/studies/import-integrity/README.md) |

The first reproduction uses OpenTelemetry Python SDK 1.45.1's actual limit
implementation and Protobuf encoder, with deliberately controlled content,
IDs and timestamps. All nine trace/serialization combinations agree with SDK
objects before serialization; five real CLI commands run for each case. The
second reproduction damages a synthetic Jaeger example deliberately: all
fourteen retention/timestamp controls now match expectations. Neither set is
a production failure rate or recovery of missing data.

A fresh source archive passes lint, type checking, 297 core checks and 30 CLI
checks. Its packed CLI was installed in an empty project without install
scripts. All 25 installed code files match the clean build, and both studies
pass under Node 20.0.0 and Node 26.7.0. The existing checked-in fixture replay
preserves 22 file outcomes, covering 27 traces and 127 spans.

The complete local and hosted browser runs each pass 116 workflows, with no
skips or retries. Two earlier full runs lost a Firefox target in the old
cancellation test. Review replaced ineffective probes with actual parser
replies delivered through captured callbacks after cancellation. The cause of
the earlier crashes remains unconfirmed; the [verification record](https://github.com/antonsoo/tracelens/blob/6d55a073678b27e483a59656610d33a9da3a1a49/docs/verification-trace-integrity-2026-10-11.md)
retains the failures, negative control experiment and resulting test change.
This is not presented as a Firefox engine fix.

The build from `65d885c` was produced with `npm run build` into `dist/` and
pushed to `gh-pages` as `8c72541`. All **33** served files matched the clean
build byte for byte. Six desktop/phone screenshots were opened and inspected;
local-file import, trace selection, event inspection and span/warning downloads
were exercised offline after page load in both browsers.

The [publication receipt](evidence/verified-trace-integrity-2026-10-11.json)
records source/remote equality, the separate build and test revisions, and five
pinned evidence documents fetched back and compared with local bytes. Later
documentation commits are not new builds. Actions is disabled; no remote CI
success is claimed. No registry release or tag was published, and npm remains
at **0.3.3**. Unknown exporter loss and uninstrumented spans remain outside
what an imported file can establish.
