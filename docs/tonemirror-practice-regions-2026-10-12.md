# ToneMirror: practice a passage from a longer recording

Waveform regions previously looped playback while analysis and saving kept
using the full recording. Source commit
[`99894ff`](https://github.com/antonsoo/tonemirror/commit/99894ff38323064f604d3440d70978ae92c024ae)
adds **Keep region** to extract the passage for playback, comparison,
classification and saving. Time fields support keyboard entry. Either audio tab
can be trimmed, and the focused reference can now be saved directly.

Repeated trims retain offsets into the original source. **Restore full clip**
survives pitch-algorithm changes until a new clip is loaded. Failed and cancelled
edits keep the last loaded audio. Saving an excerpt stores only its selected
samples, and saving a built-in reference retains its synthetic label.

The [replay and verification record](https://github.com/antonsoo/tonemirror/blob/99894ff38323064f604d3440d70978ae92c024ae/studies/practice-regions/README.md)
compares the baseline and changed builds on two recorded PTDB-TUG sentences,
in Chromium and Firefox at desktop and phone widths. Each build runs eight
offline workflows. The selected 3-to-4-second passage produces exactly 44,100
decoded samples in analysis, native playback and IndexedDB storage, with zero
sample differences and exact full-source restoration. The recordings are
English speech, and this does not establish Mandarin classification accuracy.

A clean source archive matched all 230 Git entries. Node 24.21.0 installation,
lint, type checks, 197 unit tests and 67 browser workflows passed; three existing
microphone cases were skipped in Firefox. All 12 regression screenshots and
four speech screenshots were inspected. All 28 build files match the earlier
tested build, including the eight HTTP assets fetched in each speech scenario.
Repeating the speech replay from the fresh installation reproduces all results.

The [public-source receipt](evidence/tonemirror-practice-regions-2026-10-12.json)
checks clean local/remote main equality and all 16 changed public files
(837,240 bytes). Version 0.2.3, tags and the hosted demo remain unchanged.
No package release or hosted deployment was performed. Extraction copies decoded
samples; cuts can click at a nonzero sample and do not identify syllables
automatically.
