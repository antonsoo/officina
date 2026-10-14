# ToneMirror rejects damaged decoded audio before clip commit, 2026-10-14

Baseline `a952c734` accepts a native-decoded float WAV containing non-finite
samples. Chromium and Firefox both retain 11,025 such samples in the constructed
one-second, 44,100 Hz fixture. The app commits the damaged attempt and shows
score 100 from the remaining 69 of 97 voiced frames. A NaN in the last sample
can be entirely outside the detector's windows: all 97 frames still appear
voiced. Export later rejects that same clip's invalid PCM.

Implementation `b835699` checks the complete PCM buffer in the existing slot
worker before pitch/spectrogram analysis and clip commit. Failed file imports
or saved-record loads keep the previous valid samples, label, comparison and
actions. Stored damaged recordings retain their bytes. Genuine silence remains
valid; the standalone pitch routines' handling of partial caller-supplied
signals and the pitch-shape heuristic remain unchanged.

| Verified workflow | Result |
|---|---|
| 128 native file, saved-record and valid-control workflows per phase | Baseline: 80 disagreements; corrected: zero |
| 64 damaged file imports | Native decoder retains non-finite PCM; corrected worker rejects before commit in both slots and algorithms |
| 16 damaged legacy saved-record loads | Native v1 IndexedDB upgrade/read path; corrected rejection keeps previous clip and stored bytes |
| 48 finite voiced/gapped/silent controls | Submitted PCM, contour, spectrogram and score match baseline exactly |
| All 128 submitted PCM digests | Match between baseline and corrected captures |
| Preserved clip after failed replacement | Sixteen native normal/half-speed playback buffers are finite; normal-speed buffers match original PCM |
| Export and saving | Eight WAV exports and eight native saved-reference writes match preserved PCM; FFmpeg independently verifies exported samples |
| Independent fixture check | Five constructed float WAV files decode with FFmpeg to exact source PCM bytes and exact non-finite counts |
| Fresh Node 24.21.0 archive | Lint, strict types, 211 tests in each default/German locale, seven voice-source integrity checks and production build pass |
| Full browser suite | 90 pass; four Firefox microphone cases excluded because the deterministic test microphone is Chromium-only |
| Artifact identity | All 274 archived input files match the implementation commit; all 30 production files match Node 24/26 builds |
| Actual offline production build | Chromium/Firefox at 1440/375 px; all 26 served and browser-loaded files match each tested build; server shuts down before audio workflows |
| Visual/accessibility review | Eight study and twelve existing browser screenshots inspected; no overflow, accessibility findings, script/CSP errors or external/late requests in the replay |

The [study](https://github.com/antonsoo/tonemirror/blob/574dc6c3768ded7f10b4692e8622b47c6467bee0/studies/audio-integrity/README.md)
retains runnable independent WAVE fixtures, actual native decode counts, worker
responses, source/build/check-log hashes, before/after and saved-byte evidence,
real screenshots and a captured preserved-clip export. Every waveform in this
study is a constructed sine wave, not recorded speech or a production incident.
The corrected screenshot's 100 score belongs to the retained valid clip; its
label and comparison source note identify it. The damaged import is not graded.

Initial observation errors were fixed in the evidence driver: the accessible tab
name is Your attempt; export failures appear in download-note; a saved-record
read must submit a new worker job before sampling that job's terminal response.
The valid gap's actual YIN score is 87, so before/after identity replaces the
initially assumed 100. Both final phases were rerun. None of these harness fixes
changed the application correction or reclassified an unresolved product failure.

Source `574dc6c` matches clean remote main. All 23 changed source/study/image/audio
files were fetched at that immutable commit and byte-matched. The
[publication receipt](evidence/tonemirror-audio-integrity-2026-10-14-public.json)
records URLs, sizes and hashes. The gh-pages head remains
`95b8bdc0863e88e13049487f114637aa76640ce4`. The package is marked private
for npm; no registry release, tag, manual deployment or remote CI result is claimed.

Build command `npm run build` produces `dist/`. No application UI or dependency
was changed. Native decoder allocation/cancellation limits still apply, and
finite PCM does not certify an encoded file's integrity or human speech.
Physical microphone/speaker validation is not claimed. Issue `officina-835c`
is closed after source, production-build, native browser and publication checks.
