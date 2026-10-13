# mcplint: check live JSON before numeric and field evidence is lost

Source [`f808ea05d86be3b4b827d105b6969339a5281f55`](https://github.com/antonsoo/mcplint/commit/f808ea05d86be3b4b827d105b6969339a5281f55)
is pushed and matches remote `main`. All 29 changed files (1,388,798 bytes)
match their pinned public raw URLs. The
[publication receipt](evidence/mcplint-live-json-2026-10-13-public.json) retains
sizes and hashes. Tags and `gh-pages` are unchanged. No npm release or hosted
deployment accompanied this repair; the package version remains 0.3.3.

At baseline `842910b`, actual local servers with integer constraints
`9007199254740992` and `9007199254740993` produced identical snapshots after
SDK decoding. The real CLI diff incorrectly exited 0 with complete, unchanged
metadata. This reproduced on stdio, HTTP JSON, Streamable HTTP SSE and legacy SSE.

Collectors now check original response text before passing bytes to the SDK.
Rounded numbers, duplicate fields, overflow, underflow, malformed JSON and invalid
UTF-8 cannot silently become complete metadata. A failed list page retains prior
valid pages with incomplete coverage. Initialization failures instead fail the
connection. Diagnostics omit server-controlled fields and literals; stdio cleanup
waits for the directly launched process to close, including forced termination.

| Actual workflow | Before | After |
| --- | --- | --- |
| Rounded tool constraint | Complete, falsely equal capture | Incomplete, damaged page excluded |
| Escaped duplicate field on second page | Last value silently wins | First page retained; incomplete |
| CLI audit with `--fail-on error` | Exit 0 | Exit 1, score `null` |
| CLI JSON and HTML comparison | Exit 0, unchanged | Exit 2, incomplete; no invented removals |
| Valid four-transport control | Complete capture | Byte-identical capture |

The [executable study](https://github.com/antonsoo/mcplint/blob/f808ea05d86be3b4b827d105b6969339a5281f55/studies/live-json/README.md)
retains raw synthetic replies, snapshots, CLI stdout/stderr, exit codes and the
installed standalone HTML report. The
[artifact receipt](https://github.com/antonsoo/mcplint/blob/f808ea05d86be3b4b827d105b6969339a5281f55/studies/live-json/results/verification.json)
records the clean 433-file archive of implementation `58fa1ed`, locked installation,
lint, types, 603 passing tests, build and pack. Fresh Node 20.0.0 and 24.21.0 installs
match all 121 shipped files and pass the full API/CLI replay. They resolve SDK
1.32.1 rather than the source lock's 1.31.0, with identical API captures and
comparisons. Valid CLI snapshots and audit JSON differ from baseline only in
their respective capture timestamps. The final source adds evidence and clarifies
one README reference; all tested runtime bytes remain identical.

The 132,445-byte tarball has SHA-256
`33d7eadfbe73ca98e5d90b15dd8b672347c1b8480785153a165d820aa6bf9e4c`.
Its report was inspected offline in Chromium 153.0.8010.12 and Firefox 155.0 at
1440 px and 375 px. All four views expose the incomplete status and expanded
rounding reason, download JSON identical to the CLI comparison, and have no
observed page errors, external requests, overflow or axe violations.

This checks decimal serialization, not exact binary arithmetic. Previously decoded
objects and old snapshots cannot recover lost values. HTTP buffering has no new
overall memory ceiling; existing collection bounds remain. Previously collected
pages survive, but valid messages sharing a damaged HTTP stream chunk may be
discarded together. Cleanup covers the direct child, not detached descendants.
Corrected fixture/browser harness assumptions and the install-script policy are
recorded separately in the receipt.
