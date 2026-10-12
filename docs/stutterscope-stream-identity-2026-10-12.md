# Stutterscope: preserve application identity without process IDs

Source was pushed to
[`fd04e5fc455e7034963433b7249eba6d3e130dc4`](https://github.com/antonsoo/stutterscope/commit/fd04e5fc455e7034963433b7249eba6d3e130dc4).
The work fixes a reproduced false frame-time report; it does not add another
showcase project. Package version 0.2.5, release tags and the hosted demo are
unchanged.

## Failure and correction

On baseline `b30d55b40dd2592c74b5f37ae13d742c0bbc5526`, an edited capture with
`Application` and `SwapChainAddress`, but no `ProcessID`, grouped only by
address. The first application's name was then attached to both applications'
frames. Selecting the second application failed.

A retained synthetic five-row example interleaves three 10 ms `game.exe`
frames and two 40 ms `dwm.exe` frames at address `0x1`.

| Game report | Baseline | Corrected |
| --- | ---: | ---: |
| Frames | 5 | 3 |
| Average FPS | 45.4545 | 100 |
| Pacing, mean absolute successive difference | 30 ms | 0 ms |
| Stutter events | 2 | 0 |
| Select compositor | No matching stream | 2 frames at 25 FPS |

The shared tracker now combines application and swap-chain identity when the
PID column is absent. Normal PID-based IDs remain unchanged. Blank cells in
declared identity columns are skipped with physical line numbers and reasons;
unidentified observations break continuity in all previously seen streams.
Known skipped frames affect only their own stream. Aligned telemetry and source
line references survive selection. PresentMon 1 auto-detection also accepts the
export after PID removal.

The application fallback cannot distinguish two instances of the same
executable at the same address. Address-only captures cannot distinguish
processes, and no process-lifetime reconstruction was added. Keep PID columns
when possible. The full rules, inputs and reproduction commands are in the
[study](https://github.com/antonsoo/stutterscope/blob/fd04e5fc455e7034963433b7249eba6d3e130dc4/studies/stream-identity/README.md).

## Verification

The final production code was frozen at
`f5beb334c80b73186402828b5b08dff5e47ce7b6`. A clean git archive passed installation,
typecheck, lint, 318 tests, CLI/web builds and 76 actual Chromium/Firefox
workflows. Targeted workflows import offline, switch streams, export reports,
check missing-identity gaps, reject unassigned input and recover at desktop and
375 px widths. All four retained screenshots were opened and inspected.

The packed artifact was installed offline outside the checkout. All 55 real CLI
cases matched the independent rational-arithmetic expectations under Node
22.6.0 and 24.21.0, with identical case records; ten matched on the baseline.
All 25 installed package files matched the tarball. Its SHA-256 is
`0dd5e59f4cf9522ab2db55105afa475bf2f4527898820c67b3550cb69e6e691b`
and size 45,832 bytes. All 30 local preview files matched the tested build.

All 34 pinned public-capture files were hash-checked and replayed: 27 parsed,
with 278,107 selected frames and unchanged metadata, metrics and every aligned
array hash. Seven remained refused: four periodic MangoHud logs and three
generic files without a confident mapping. The complete before/after replay
receipts are identical. This is a compatibility control, not evidence that
those captures contained the newly reproduced failure.

The 430,000-row synthetic throughput check records a cost for alternating
applications without PIDs: median parse time increased from 210.3 to 375.5 ms.
The baseline incorrectly retained all rows; the correction selects 215,000 game
frames. Complete-PID alternating rows measured 225.5 versus 240.4 ms. The study
retains all five timings for each profile and the machine details; no speedup
claim is made.

## Source publication

The [receipt](evidence/stutterscope-stream-identity-2026-10-12.json) verifies a
clean local tree, exact remote `main` equality, and freshly fetched raw bytes
for all **37 changed files**, totaling **2,689,255 bytes**. Release tags and
`gh-pages` remain unchanged; the latter is still
`4dabfd35b268b5d241749b077153969d8df0aca7`.
No registry release, tag or hosted deployment was performed.

Source commits:

```text
fd04e5f docs: retain installed stream identity and public capture evidence [skip ci]
f5beb33 fix: recognize PresentMon 1 exports after PID removal [skip ci]
21b33fe fix: keep application identity in present streams without PIDs [skip ci]
```

Tracking: `officina-n6ir`.
