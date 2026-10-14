# Logdelta stdin and Gnomon hour curves, 2026-10-14

Two further source corrections came from reproduced current behavior. Their
source and evidence are public; registry releases, hosted updates and physical
validation remain separate.

| Product | Reproduced defect | Corrected behavior | Source |
|---|---|---|---|
| Logdelta | `novel --baseline -` consumed stdin as its baseline and exited 0 against an exhausted default target; `diff - -` invented a gone finding | Repeated explicit stdin markers reject with exit 2 before opening input sources; valid single-stdin reports remain unchanged | `9e34dd6` |
| Gnomon | A 16-hour cutoff omitted Italian afternoon curves 17–23 and usable Babylonian curves on long days | Visit all usable interior equal-hour boundaries through 23, retaining sunrise/sunset and projection constraints | `3d9a8cf` |

The [Logdelta study](https://github.com/antonsoo/logdelta/blob/9e34dd6287cecf6f985f563a65422a5a178c1824/studies/stdin-inputs/README.md)
retains 16 actual native pipe workflows: nine baseline disagreements and zero
after the fix in both independently installed Rust 1.91.0 and 1.85.0 binaries.
Seven supported controls keep their complete exit/stdout/stderr streams. The
guard also rejects while an unwritten pipe remains open and before nonexistent
files can be opened. Ordinary repeated file paths remain independently readable.

Its fresh archive passes 222 native checks, a further MSRV documentation example,
20 WASM build-conformance cases, 83 web checks and 128 Chromium/Firefox workflows.
All 21 runtime source files match the source archive and packaged crate. The
first full suite inside the extracted crate failed three development tests
because large fixtures are deliberately excluded; that failure remains retained.
The complete source archive and five focused packaged-crate checks then passed.
Both installed binaries passed the full CLI replay. The locally built 0.3.4
crate is not a crates.io release. Fifteen pinned public files match the clean
checkout in the [source receipt](evidence/logdelta-stdin-inputs-source-2026-10-14.json).

The [Gnomon study](https://github.com/antonsoo/gnomon/blob/3d9a8cf74cfa320c2417a764611f9b13b3e6e0ea/studies/historical-hours/README.md)
uses the published hour definitions and an independent horizontal ray projection.
Of 27 controlled model cases, 13 previously omitted curves; all agree after the
fix. All 9,597 sampled coordinates agree with the independent implementation.
This uses the same documented declination approximation and is not an ephemeris
or physical-accuracy claim.

Its fresh Node 26.7.0 and 24.21.0 archives pass clean installs, lint/types,
303 unit checks and builds. The Node 26 browser suite passes all 68 workflows.
All 65 runtime/build inputs match source and both archives, and all 33 produced
files match across Node versions. The separate offline study checks actual SVG
and construction-PDF downloads in both engines at 1440/375px: all 24 corrected
exports match complete-model path counts, versus zero before. All 48 downloaded
SVGs match native laser-format bytes. An independent PDF reader checks all
96 pages, all 96 calibration bars and every historical curve vertex against its
SVG within 0.002 mm. All eight study screenshots were inspected.

The initial Gnomon browser reference used colored previews instead of the actual
laser-format download. A later rapid one-tab replay missed its eleventh download
event; isolated workflows pass. The original logs remain retained, and neither
failure is presented as a browser-engine or renderer repair. Seventeen pinned
public files match the clean checkout in the
[source receipt](evidence/gnomon-historical-hours-source-2026-10-14.json).
`npm run build` produces `dist/`; that local build was not deployed here.

Issues `officina-odn0` and `officina-4rsn` are closed after source verification.
Logdelta's guard covers its documented `-` marker, not arbitrary OS aliases or
application-owned shared iterators. Gnomon retains its fixed-day approximation,
unlabelled historical curves and clipping to the plate. Digital geometry does
not establish printing, mounting, paper assembly or outdoor timekeeping.
