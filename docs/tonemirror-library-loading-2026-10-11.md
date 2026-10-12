# ToneMirror: saved-library browsing without loading every recording

Pushed source at
[`a8142ed`](https://github.com/antonsoo/tonemirror/commit/a8142edebde3a9708ba1a59541e0243136016fc7)
repairs a reproduced library-loading problem. Listing reference names loaded
every saved audio buffer into JavaScript, and deleting one repeated that read
for the remaining library. A metadata index now serves the list; **Use** reads
one recording with cancellation and protection against obsolete selections.

| Synthetic 100-recording library | Before | After |
| --- | ---: | ---: |
| PCM returned while listing | 192,000,000 bytes | 0 bytes |
| PCM returned for one selected ten-second clip | Already loaded | 1,920,000 bytes |
| PCM returned after deleting it | 190,080,000 bytes | 0 bytes |

These are bytes returned by IndexedDB to the application, not browser RSS or
peak memory. The browser must build the metadata index once: the four retained
upgrade observations take 0.4-1.0 seconds. Later full-page library loads take
41-69 ms, versus 451-3134 ms before, on this WSL2 machine. The
[study](https://github.com/antonsoo/tonemirror/blob/a8142edebde3a9708ba1a59541e0243136016fc7/studies/library-loading/README.md)
retains every observation, including slow outliers, and separates migration
time from subsequent metadata reads.

Chromium and Firefox at 1440 and 375 px each preserve all 100 distinct synthetic
recordings byte-for-byte through the version-1 upgrade. Every metadata field,
list order and remaining record after deletion matches. Selected PCM reaching
the worker and playback buffer, complete pitch contours and spectrograms match
the baseline. The HTTP server is stopped before first selection; there are no
subsequent requests, page errors, CSP violations or horizontal overflow. Eight
real panel screenshots were opened and inspected.

Queued-read browser checks cover cancellation and rapid selection. Additional
cases cover deletion from another connection and retry after an old tab blocks
the upgrade. Fault-injection unit checks retain recordings after aborted
upgrades, and report unreadable metadata or PCM instead of hiding entries or
hanging the operation. A fresh Node 24 archive passed lint, type checking,
140 unit checks, a production build and 59 browser workflows; three Firefox
microphone cases require Chromium's simulated device and are skipped. The
study's artifact receipt hashes 61 build inputs, 28 locally served files and 27 processing/UI
files unchanged from the baseline.

The workload is synthetic storage data, not a new speech-accuracy or physical
audio-output study. Cancellation does not promise to preempt internal browser
I/O; metadata and DOM work still scale with library size. Browser eviction and
cleared site data can still remove saved recordings. Older source versions must
reload after the schema upgrade.

The [public-source receipt](evidence/tonemirror-library-loading-2026-10-11.json)
checks clean local HEAD against remote `main` and fetches pinned public files
for byte comparison. The observed `gh-pages` ref remains
`95b8bdc0863e88e13049487f114637aa76640ce4`. No registry release, tag or manual hosted
deployment was performed. Browser observations apply to local production builds.
