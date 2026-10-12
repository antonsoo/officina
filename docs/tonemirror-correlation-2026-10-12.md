# ToneMirror: faster speech analysis with preserved pitch results

Source at [`69dcb38`](https://github.com/antonsoo/tonemirror/commit/69dcb38fd4ee86b2200f7dd5f08e6f2a9fce4a49)
replaces large-frame quadratic correlation loops with FFT calculations of the
same YIN differences and MPM autocorrelations. Small frames retain direct sums;
numerically delicate lags fall back to direct calculation. Reused FFT tables
are bounded at 262,112 bytes per JavaScript realm. Pitch-selection thresholds,
window lengths, interpolation and smoothing remain unchanged.

Actual offline file uploads show the improvement in the application. These
are desktop medians of three runs per input and algorithm, measured from
Playwright file upload through the visible ready state:

| Browser | Input | Algorithm | Before | After |
| --- | --- | --- | ---: | ---: |
| Chromium | 7.99-second real phrase | YIN | 466 ms | 291 ms |
| Chromium | 7.99-second real phrase | MPM | 693 ms | 301 ms |
| Chromium | 60-second repeated phrase | YIN | 2148 ms | 1385 ms |
| Chromium | 60-second repeated phrase | MPM | 2806 ms | 1623 ms |
| Firefox | 7.99-second real phrase | YIN | 546 ms | 398 ms |
| Firefox | 7.99-second real phrase | MPM | 648 ms | 449 ms |
| Firefox | 60-second repeated phrase | YIN | 3418 ms | 2108 ms |
| Firefox | 60-second repeated phrase | MPM | 5013 ms | 2750 ms |

The source is PTDB-TUG F01/sa1. The 60-second file repeats that phrase; it is not
natural long speech. Both browsers decoded to 44.1 kHz here. Worker-only times,
all individual runs, PCM/result hashes and reproduction scripts are retained in
the [study](https://github.com/antonsoo/tonemirror/blob/69dcb38fd4ee86b2200f7dd5f08e6f2a9fce4a49/studies/pitch-correlation/README.md).
Native synthetic benchmarks separately cover 8-96 kHz; low-rate direct paths
show no dependable gain. These are measurements on this WSL2 machine, not phone
or universal latency promises.

A paired native replay of 580 pinned real recordings compares 763,220 frame
results per revision across both trackers, before and after contour processing.
There are no voicing changes or pitch changes rounded to 0.001 Hz. The largest
unrounded pitch difference is 6.105e-11 Hz. This is compatibility evidence, not
an improvement in pitch or pronunciation accuracy. Independent direct sums
check the FFT quantities at every lag across noise, periodic, offset, impulse
and unusual-window inputs.

A clean Node 24.21.0 archive/install passes lint, strict type checking, 184 core
tests, the build, 59 browser scenarios and the generated accuracy table. Three
existing Firefox scenarios requiring Chromium's fake microphone are skipped.
No retries were needed. The 85 build/check inputs and 28 built files match the
tested archive and development build.

The new browser study completes 32 paired uploads in Chromium and Firefox at
1440/375 pixels, with the serving process stopped before audio intake. Decoded
PCM, quantized contours and full spectrogram bytes match. Both algorithms keep
a 100 score for the real phrase compared with itself. All eight inspected
screenshots form four byte-identical before/after pairs. There are no page
errors, CSP violations, horizontal overflow or post-load HTTP requests.

The [publication receipt](evidence/tonemirror-correlation-2026-10-12.json)
verifies clean local/remote HEAD equality and fetched bytes for all 38 changed
files. The final source push uses `[skip ci]`; `gh-pages` and release-tag refs
remain unchanged. No hosted site, tag or package release was published.
