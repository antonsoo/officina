# Splitscope: a tied run is not a new personal best

Pushed source at
[`403d5c6`](https://github.com/antonsoo/splitscope/commit/403d5c6e87265a409758ff4cd4ad1a69128c893e)
compares simulated totals with the saved PB in integer nanoseconds. An unchanged
public Psychic Force 2 history previously received a 100% PB forecast from
resampling its one recorded completion, even though its eight segment times sum
exactly to the PB. Floating-point addition put the total just below the target.
The corrected forecast counts no improvements in that resampling pool.

| Input | Previous next-attempt PB probability | Corrected |
| --- | ---: | ---: |
| Recorded Psychic Force 2 history | 100% | 0% |
| Constructed 120.3 + 120.6 = 240.9 seconds | 100% | 0% |
| A genuine one-nanosecond improvement | 100% | 100% |
| Mixed faster/tied/slower samples, with resets | 33.4625% | 16.6% |

The last row records 8,000 seeded trials against an exact population probability
of 1/6. The [study](https://github.com/antonsoo/splitscope/blob/403d5c6e87265a409758ff4cd4ad1a69128c893e/studies/pb-ties/README.md)
retains the licensed original file, its hash, all eight source times, controlled
inputs, independent XML/integer replay, and actual browser downloads.

The clean archive matches all 1,018 comparison contracts across 76 constructed
files and 436 pinned public files. Three malformed public files remain rejected.
This count includes unavailable outcomes: 362 public comparisons yield numeric
PB estimates, 499 remain unavailable, and five estimate finish rate without a
PB. Availability is unchanged for public files; 13 public PB estimates change.
Out-of-range constructed times now receive an explicit precision limit.

A separate walk-forward replay yields the same 2,886 eligible forecasts in 51
histories and changes 13 probabilities. The 50-attempt mean shifts from 14.3174%
to 14.3136%; the observed frequency remains 30.9192%, and Brier score shifts from
0.2067654 to 0.2067742. This fixes arithmetic, not model calibration. Original
backtest artifacts and their rounded headline values remain unchanged.

Verification used a clean Node 24.21.0 install, lint/typecheck, 223 core tests,
and the production build. The full browser suite passes 73 of 74 scenarios in
one invocation; an existing Firefox accessibility scenario times out during
concurrent checks and passes unchanged in isolation. Both runs are retained.
The new study passes in Chromium and Firefox at 1440/375 pixels: 28 offline
imports across both revisions, 56 real Markdown downloads matching native
exports byte-for-byte, eight PNG exports and 16 inspected panel screenshots.
The 80 build/check inputs and 18 built files match the tested archive/build.

The model still assumes independent segments and stationary recent form.
Intervals cover simulation noise only. The precision guard limits individual
samples and PB targets to 2^20 seconds in magnitude and requires safe integer
partial sums. Files remain inspectable when a forecast is unavailable.

The [source receipt](evidence/splitscope-pb-ties-2026-10-12.json) records clean
HEAD/remote equality and fetched bytes for every changed file. The final push
uses `[skip ci]`; `gh-pages` and release-tag refs remain unchanged. No hosted
site, tag or package release was published.
