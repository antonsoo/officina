# Verified audio and MCP corrections, 2026-10-11

Three additional reproduced defects were corrected in two existing projects.
Both source checkouts are pushed and match remote `main`. ToneMirror's public
build is updated. This continues the [preceding batch](verified-updates-2026-10-11.md)
without changing its historical receipts. No sub-agents were used.

| Project | Before | After | Retained evidence |
| --- | --- | --- | --- |
| mcplint: long names | Comparing two 8,198-character tool names exhausted a 256 MiB Node heap before an audit could be written. | A narrow edit-distance band completes the audit and preserves invalid-name errors and near-name warnings. | [SDK captures, independent oracle and installed artifacts](https://github.com/antonsoo/mcplint/blob/f8170b3c91fd4ff7cbce46661e64b833ef114576/studies/name-comparisons/README.md) |
| mcplint: repeated names | Two different definitions called `read_record` on one server passed with zero findings and exit 0, including when returned on separate pages. | Repeated names produce an error and exit 1 with `--fail-on error`; every definition remains available for schema and safety checks. | [Saved lists, paginated SDK server, reports and recorded public examples](https://github.com/antonsoo/mcplint/blob/f8170b3c91fd4ff7cbce46661e64b833ef114576/studies/duplicate-names/README.md) |
| ToneMirror: first offline audio use | A fresh page could not analyze its first file after losing the connection. Stopping the real local server also exposed a microphone worklet fetch failure. | Analysis and recording code arrive with the page. First imports, recording, algorithm changes and saved-reference workflows work after disconnection. | [Stopped-server reproduction and live verification](https://github.com/antonsoo/tonemirror/blob/c9131e6e2589b9509a566c23964bc3a635f759b5/studies/offline-start/README.md) |

## Verification that addresses the failures

The mcplint name-distance implementation agrees with a full-matrix reference on
132,496 short-string pairs. All 38 cross-server shadowing findings are unchanged
in an artificial grouping of 25,799 recorded tool names. Long-name CLI captures
pass with the same 256 MiB heap limit on installed Node 20.0.0 and Node 26.7.0.
Pair enumeration and description similarity still scale quadratically with tool
count; this is not a global resource limit for arbitrary server metadata.

The repeated-name correction identifies five previously missed names across two
of the 1,304 cached registry snapshots. These are retained public responses,
not live audits of those servers. Independent occurrence counts agree and other
naming findings remain unchanged. Five controlled cases pass from a clean tree
and installed packages on both Node versions. Every CLI report format retains
the error; generated HTML was exercised offline in both browsers at desktop and
phone widths. The final clean mcplint build passes lint, type checking, 389
checks and 24 report workflows. These remain unreleased source changes.

ToneMirror's strongest check closes the actual no-store HTTP server before the
first file or microphone operation. All five cases pass. Complete analysis and
final comparison payloads match the baseline for eight browser/width/algorithm
cases on the controlled synthetic WAV. This verifies transport preservation,
not new speech accuracy. Chromium's microphone test device delivers actual PCM
through the worklet; physical microphone quality is outside that evidence.

A fresh ToneMirror archive passes lint, type checking, 133 core checks and 51
browser workflows. The public site passes the same 51 workflows, with the same
three Firefox microphone skips because those cases use Chromium's test device.
Desktop and phone screenshots in both themes and engines were inspected.

## Publication boundary

ToneMirror was built with `npm run build` into `dist` from source `7db1976` and
pushed to `gh-pages` as `95b8bdc`. All **28 production files** were fetched from
[the public site](https://antonsoo.github.io/tonemirror/) and matched the clean
build byte for byte. Its [served-file ledger](https://github.com/antonsoo/tonemirror/blob/c9131e6e2589b9509a566c23964bc3a635f759b5/studies/offline-start/served-files.json)
and [public browser results](https://github.com/antonsoo/tonemirror/blob/c9131e6e2589b9509a566c23964bc3a635f759b5/studies/offline-start/browser-workflows.json)
record the checks. Hosted offline cases use browser emulation; the local
stopped-server case provides the stronger connection-loss boundary. The page
must first load; an uncached offline reload is not promised.

The [source and publication receipt](evidence/verified-audio-and-mcp-2026-10-11.json)
records both clean source checkouts, remote revisions, the separate build-source
and Pages revisions, and six pinned evidence documents fetched and compared
with local bytes. Later documentation commits are not presented as new builds.

No registry package or tag was published. npm still reports mcplint 0.3.3.
Its public site contains pre-generated example reports and was not redeployed
for these CLI corrections. GitHub Actions is disabled in both repositories;
the evidence above is from local and hosted checks, not remote CI runs.
