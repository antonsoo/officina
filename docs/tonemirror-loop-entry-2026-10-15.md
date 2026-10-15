# ToneMirror: enter the selected passage on the first playback

The [source correction](https://github.com/antonsoo/tonemirror/commit/07754ca184f3e94e5217e9e58b8f72286aa00a1c)
keeps practice-loop playback inside the chosen passage from the first sample.
Previously a 1–2 second selection played the earlier audio once before looping;
moving a loop ahead of running playback had the same problem. The native browser
loop bounds did not skip that earlier audio. Both Chromium and Firefox reproduced it.

| Actual observation | Before | After |
| --- | ---: | ---: |
| Native offline sample/cursor checks | 60/84 | 84/84 |
| Native live loop-edit checks | 12/20 | 20/20 |
| App first playback inside the selection | 0/4 | 4/4 |
| App active edit entering a later passage | 0/4 | 4/4 |
| App actual prepared half-speed entry | 0/4 | 4/4 |
| Exact original PCM in WAV downloads | 4/4 | 4/4 |

The [study](https://github.com/antonsoo/tonemirror/blob/07754ca184f3e94e5217e9e58b8f72286aa00a1c/studies/loop-entry/README.md)
retains native rendered samples, actual offline production workflows, screenshots
and the source/build hashes. Paused selections retain their cursor until Play;
positions inside the passage continue there, and clearing a loop keeps playback
running. The 14 analysis-core files remain byte-identical to the baseline.

A clean archive passes lint, type checks, 217 core tests and seven source-integrity
checks on Node 26. Its Node 24 build and browser run pass 92 workflows, with four
existing Firefox microphone scenarios explicitly skipped. All 30 build files are
identical between these runtimes. The study checks digital playback and coordinates,
without claiming an acoustic or device-latency measurement.

The [public-byte receipt](evidence/tonemirror-loop-entry-2026-10-15.json)
verifies a clean source tree, equality with remote `main`, and all 21 changed
files (849,545 bytes) against pinned public copies. No registry release, version
tag, manual hosted deployment or remote-CI completion is claimed.
