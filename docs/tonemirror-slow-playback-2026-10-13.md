# ToneMirror: slower listening at the reference's pitch

Source [`a952c734e9f5d6cfb9ea234ce91c9930dc8b51f4`](https://github.com/antonsoo/tonemirror/commit/a952c734e9f5d6cfb9ea234ce91c9930dc8b51f4)
is pushed and matches remote `main`. All 35 changed files (1,577,316 bytes)
match their pinned public raw URLs. The
[publication receipt](evidence/tonemirror-slow-playback-2026-10-13-public.json)
retains their sizes and SHA-256 hashes. Tags and `gh-pages` are unchanged.
No hosted deployment or package release accompanied this change; the private
web project's version remains 0.2.3.

At baseline `96f6b5f`, half-speed playback lowered a voice one octave. This
was reproduced by rendering the actual `ClipPlayer` through Chromium and
Firefox `OfflineAudioContext`: a 440 Hz one-second source became 220 Hz for
two seconds. The new player prepares a twice-length preview with the pinned
MIT-licensed Signalsmith Stretch WASM engine, then plays it at native rate.

| Workflow | Previous behavior | Current source |
| --- | --- | --- |
| 440 Hz signal at half speed | 220 Hz, two seconds | 440.00011 Hz, two seconds |
| Slow preparation | No separate preparation | Cancellable worker, visible status, cached preview |
| Original region 3-4 seconds | Original buffer at playback rate 0.5 | Preview region 6-8 seconds; source-time playhead |
| Failure or page/clip switch | No DSP preparation lifecycle | Pending worker terminated; explicit failure and retry |
| Analysis, save and WAV export | Original decoded samples | Original decoded samples retained |

The [replay study](https://github.com/antonsoo/tonemirror/blob/a952c734e9f5d6cfb9ea234ce91c9930dc8b51f4/studies/slow-playback/README.md)
retains native before/after audio measurements, signal probes at six sample
rates, short-clip boundaries, 60-second preparation observations and all 480
PTDB-TUG speech measurements. It verified the original source hashes and
does not redistribute corpus audio.

Praat's independent autocorrelation tracker compares source frames to output
frames at twice their time, without a fitted offset. Across 20 speakers,
79,520 jointly voiced frames have a 7.37-cent median absolute difference and
a 73.02-cent 95th percentile. Of those frames, 2,568 (3.23%) differ by more
than 100 cents. Voicing disagrees on 8,646 of all 348,140 compared frames.
This compares tracker estimates, not laryngograph ground truth or human
listening quality. Time stretching can soften transients and introduce
artifacts; normal playback and analysis preserve the original audio.

The [clean-build receipt](https://github.com/antonsoo/tonemirror/blob/a952c734e9f5d6cfb9ea234ce91c9930dc8b51f4/studies/slow-playback/verification.json)
records implementation `bf893b3` from a fresh 264-file archive, Node 24.21.0,
locked install, lint, types, 211 unit checks, the accuracy report, build and
86 browser checks. Four Firefox microphone cases are intentionally skipped;
the 16 new playback cases run in both engines. The final evidence commit
does not change the tested runtime files. All 30 build outputs match.

Four real-speech workflows cover Chromium 153.0.8010.12 and Firefox 155.0
at 1440px dark and 375px light, after server shutdown and network disablement.
They verify keyboard controls, cached resume, native loop mapping, eight
served asset hashes per run, accessibility and overflow. Desktop runs also
cancel a real 60-second preparation and successfully retry it. No observed
page errors, CSP violations, external requests or requests after disconnection.
All four screenshots were inspected. This is headless browser/audio evidence,
not physical microphone or human listening validation.

The embedded 64,494-byte WASM payload matches the pinned upstream payload;
the distributed binary was not compiled locally. Original MIT notices ship
with the site. The JS bundle grows from 58.86 kB to 157.81 kB (66.37 kB gzip),
and prepared audio takes additional memory. These costs and the speech
outliers are documented alongside the improvement.
