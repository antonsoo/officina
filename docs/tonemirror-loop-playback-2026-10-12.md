# ToneMirror: keep the waveform cursor with the playing audio

Source is pushed to
[`c78a110ece338794bd78ca72d93280f911803fde`](https://github.com/antonsoo/tonemirror/commit/c78a110ece338794bd78ca72d93280f911803fde).
Package version 0.2.3, tags and the hosted demo are unchanged.

At baseline `69dcb38fd4ee86b2200f7dd5f08e6f2a9fce4a49`, pausing a clip past
five seconds, selecting a two-to-four-second loop and resuming placed the
cursor about a second ahead of the audio. Native playback enters the loop at
its beginning; the app incorrectly applied a remainder to the paused offset.
Enabling or shortening a loop behind the playing position had the same defect.

The correction distinguishes entering a loop from advancing within one.
Entry uses the loop start; normal elapsed playback retains modulo wrapping.
Paused selection, playback before a loop, speed changes and clearing a loop
retain their existing behavior.

| Observed result | Before | Corrected |
| --- | ---: | ---: |
| Native offline renders matching reported positions | 72/96 | 96/96 |
| Live loop edits within 64 ms of native output | 8/16 | 16/16 |
| Actual app workflows within 64 ms of native output | 0/4 | 4/4 |

The [study](https://github.com/antonsoo/tonemirror/blob/c78a110ece338794bd78ca72d93280f911803fde/studies/loop-playback/README.md)
retains synthetic time-encoded PCM, source hashes, reproduction drivers and
complete observations. Actual native rendering covers three sample rates,
eight entry positions, both speeds and both browser engines. Every corrected
output sample matches a separate native node rendered from the reported cursor.
This comparison accounts for Firefox's half-speed resampling transient.

Real production-app file uploads, pause/select/resume and half-speed changes
run offline at 375 and 1440 pixels in Chromium and Firefox. The largest measured
painted-cursor/audio gap drops from 1.22-1.28 seconds to 1.4 ms in Chromium and
14.6 ms in Firefox. All 26 fetched assets match the tested build. There are no
page errors, CSP violations, post-shutdown HTTP requests or horizontal overflow.
All eight screenshots were inspected. These are digital output measurements,
not speaker, microphone or physical latency validation.

A fresh archive of production commit `d88315e13fbfcfeebbbcb1e8a33a12e7e8e8af6f`
passes locked installation on Node 24.21.0, lint, strict typechecking, 190 unit
tests, the production build and 59 existing browser scenarios. Three Firefox
scenarios are skipped because their simulated microphone comes from Chromium.
All 28 clean build files, totaling 865,763 bytes, match the tested app.

The [public receipt](evidence/tonemirror-loop-playback-2026-10-12.json) verifies
clean source, exact remote main equality and all 21 changed files fetched from
pinned raw URLs: 558,594 bytes match. Tags and `gh-pages` remain unchanged.

```text
c78a110 docs: retain native audio and app loop playback evidence [skip ci]
d88315e fix: align loop entry cursor with native audio playback [skip ci]
```

Tracking: `officina-72df`.
