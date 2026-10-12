# Stutterscope: missing rows no longer establish continuity

Pushed source at
[`b30d55b`](https://github.com/antonsoo/stutterscope/commit/b30d55b40dd2592c74b5f37ae13d742c0bbc5526)
repairs a reproduced downstream-analysis error: discarded frame rows made
unrelated observations appear consecutive. The repair preserves gap boundaries
through all seven readers, per-process selection, interval analysis, worker
recomputation, charts and exports.

| Synthetic input | Before | After |
| --- | --- | --- |
| `60, missing, 120` ms | MASD 60 ms; one continuous 180 ms slow-frame episode | Pacing unavailable; two separate observed hitches |
| `10, 10, 10, missing, 80` ms | MASD 23.333 ms; relative stutter inferred using earlier frames | MASD 0 over two observed pairs; independent local context after the gap |
| Invalid overlay row between two game frames | Game frames adjacent | Unchanged: gaps are tracked per process/swap chain |

The [reproducible study](https://github.com/antonsoo/stutterscope/blob/b30d55b40dd2592c74b5f37ae13d742c0bbc5526/studies/frame-gaps/README.md)
retains 35 synthetic CLI cases with independent Python arithmetic, complete
before/after reports, ten inspected PNGs, and archive/package/build hashes.
All 35 installed-package cases agree on Node 22.6 and Node 24.21. The existing
34 pinned public captures were verified from cache: the same 27 parse, seven
remain refused, and every existing metric on accepted captures is unchanged.
This is compatibility evidence, not newly collected gaming data or detector
accuracy evidence.

Offline Chromium and Firefox flows at 1440 and 375 px exercise import, threshold
recomputation, interval selection/restoration, replacement and stream switching.
All 28 complete exported reports match the installed CLI. The fresh Node 24
archive passed lint, typecheck, 271 unit checks in each of two locales, a
production build and 72 browser checks. A subsequent PNG point-color correction
passed the build/lint and six affected browser checks; the study identifies both
commits and exact validation scope. All 69 build inputs, 30 served files and 22
installed runtime modules were byte-checked.

An unidentifiable bad row conservatively interrupts every previously observed
stream. Missing frame counts and durations remain unknown; source omissions
that leave no evidence in the file cannot be detected. A low stutter count in a
very short segment does not establish the absence of a relative anomaly.

The [public-source receipt](evidence/stutterscope-frame-gaps-2026-10-11.json)
checks remote `main` against clean local HEAD and byte-compares pinned public
files. The observed `gh-pages` ref remains
`4dabfd35b268b5d241749b077153969d8df0aca7`. No registry release, tag or manual hosted
deployment was performed. Browser observations refer to local production builds.
