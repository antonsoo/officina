# ToneMirror: download recordings and kept excerpts

Source commit [`96f6b5f`](https://github.com/antonsoo/tonemirror/commit/96f6b5f118f8270129556853ef6a20103090109a)
adds **Download WAV** for the focused attempt or reference. Microphone recordings
and saved clips can now leave browser storage. **Keep region** exports just that
passage; **Restore full clip** restores the full-source export. Looping and
half-speed playback do not change the downloaded audio.

Downloads preserve the exact decoded mono Float32 samples at normal speed.
Synthetic references have a filename and standard WAV metadata marker, retained
when reloaded even after renaming. The marker is editable, not authenticated
provenance. Import may already have resampled or downmixed the source; this does
not recover an original codec or stereo channels. Exports contain the current
audio, not pitch results, comparison scores or undo history.

The [study and reproduction commands](https://github.com/antonsoo/tonemirror/blob/96f6b5f118f8270129556853ef6a20103090109a/studies/wav-export/README.md)
use two unchanged PTDB-TUG speech recordings in Chromium and Firefox, at desktop
and phone widths. Eight offline workflows produce 48 actual downloads. FFmpeg
8.0 decodes all 48 to sample bytes identical to the real analysis-worker inputs.
One-second excerpts contain exactly 44,100 samples and reopen identically through
the browser decoder. Full/looped/restored exports are byte-identical, as are
kept/saved excerpts. Seven additional sample rates and the maximum 60-second,
96-kHz clip also pass independent decoding, including signed zero, subnormal
floats and unclipped sample headroom in the small fixtures.

The static server is stopped before the speech workflows. All eight fetched
assets match the tested build, and the checks report no page/CSP errors,
external/late requests, axe violations or horizontal overflow. Heading fonts
are loaded before disconnection. A native AudioWorklet regression also downloads
Chromium's test microphone capture; no physical microphone validation is claimed.

A clean source archive matched all 244 Git entries. Node 24 installation, lint,
type checks, 200 unit tests, build and 70 browser workflows passed; four cases
requiring Chromium's test microphone are skipped in Firefox. All 12 regression
screenshots were inspected. The 28 build files match the dedicated replay build,
and rebuilding the baseline with the same fresh dependency lock matches every
baseline-served asset.

The [public-source receipt](evidence/tonemirror-wav-export-2026-10-12.json) verifies
clean local/remote main equality and all 19 changed public files (878,867 bytes).
Version 0.2.3, tags and the hosted demo remain unchanged. No package release or
hosted deployment was performed.
