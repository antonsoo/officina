# Horologium: correct the lunar longitude series

Source is pushed to
[`5d249f7b115075a0e76656449daa77468db2099e`](https://github.com/antonsoo/horologium/commit/5d249f7b115075a0e76656449daa77468db2099e).
Package version 0.2.3, release tags and hosted files are unchanged.

At baseline `a2ce92063118165d009612512ecbb6109fdd4b63`, the ten-term lunar
formula reverses important signs, omits dominant terms and uses incorrect
angular arguments and a mean-anomaly coefficient. This can reset lunar age
before conjunction and assign the wrong day in the reconstructed calendars.

The correction uses all 59 nonzero longitude terms of Meeus chapter 47, full
mean-argument polynomials, eccentricity factors and three additive corrections.
The implementation is adapted from a pinned MIT-licensed astronomia source,
with attribution and no new runtime dependency. Independent numerical evidence
uses JPL DE440s through Skyfield and ERFA, without importing either implementation.

| Retained independent comparison | Before | Corrected |
| --- | ---: | ---: |
| Maximum mean-equinox longitude error, 10,801 positions at equal nominal TT | 0.965756 degrees | 0.003846 degrees |
| Maximum conjunction error, 2,487 events at equal nominal TT | 85.090447 minutes | 1.650819 minutes |
| Maximum apparent-longitude error, 365 actual UTC inputs in 2026 | 0.802998 degrees | 0.016719 degrees |
| Maximum error for 14 selected modern UTC conjunctions | 82.866273 minutes | 2.365332 minutes |

The position grid covers 1900 through 2100 every seven days, plus every day
of 2026. The equal-TT and actual-UTC results are deliberately separate: the
existing illustrative API still uses its Julian-day input directly without
UTC-to-TT conversion, and lunar longitude omits nutation. The phase fraction
also omits lunar latitude. Ancient and far-future accuracy remains unverified.

Two independent UTC conjunctions establish visible changes under the project's
own mean-midnight rule:

| Clock input | Before | Corrected |
| --- | --- | --- |
| 25 January 2020, mean noon at Babylon | 2 Shabatu, SE 2330 | 1 Shabatu, SE 2330 |
| 26 September 2022, mean noon at Athens | 1 Pyanepsion, Ol. 700.2 | 2 Pyanepsion, Ol. 700.2 |

This verifies the reconstruction's arithmetic, not historically observed
calendar dates, first crescents or sunset boundaries. Across the nominal-TT
event grid, mean-midnight day disagreements fall from 62 to one at Babylon
and from 41 to one at Athens; the residual errors are retained.

The full series is more expensive, so the Greek and Babylonian calculations
retain at most eight private year structures each. Against the original
uncached algorithms with the corrected Moon model, 1,512 comparisons agree,
including era jumps, eviction, revisits and month boundaries. Returned records
are mutated and rechecked to verify cache isolation. Another 1,680 descriptions
from ten other calendar methods remain unchanged. Local Node 24 timing of 120
adjacent second values falls from 295.13 ms with the uncached full series to
10.67 ms with reuse; the old short series takes 105.49 ms. These are calculation
timings on 14-vCPU WSL2, not browser frame-rate measurements.

The [study](https://github.com/antonsoo/horologium/blob/5d249f7b115075a0e76656449daa77468db2099e/studies/lunar-series/README.md)
retains the reference generator, fixtures, implementation provenance, timings,
interval checks, browser receipts and four inspected before/after screenshots.
Offline Chromium and Firefox at 1440 and 375 pixels exercise 48 date changes
across both builds and measure 336 rendered needle directions after animations
settle. The 24 paired views preserve the six non-lunar directions, other calendar
text, readouts and limitation labels. No offline requests, page/console errors,
accessibility violations or horizontal overflow occur in these checks.

A clean archive of production commit
`c0d07d34178bb5d6c2a2fa613fcf85e4cce8901c` passes offline installation,
lint, TypeScript checks, 235 tests in each of two locales, the production build,
the runnable example and 58 browser workflows. All 108 selected inputs and
87 build files match the tested checkout. All 29 served assets match the clean
build; 15 other compiled JavaScript modules remain byte-identical to baseline.
A separate offline npm installation reproduces the entire numerical replay
under Node 20.0.0 and 24.21.0 with identical records apart from runtime version.
The documented library examples reproduce their stated outputs.

The tarball is 74,735 bytes, SHA-256
`7f0ba627e1e33530783dc24a2d3e36683ed93a2c217470d32f4f354e63e173f2`.
All 42 package files match the clean archive and installed artifact. Runtime
verification was on Linux/WSL2.

The [public receipt](evidence/horologium-lunar-series-2026-10-12.json) verifies
a clean checkout, exact remote main equality and all 35 changed files fetched
from pinned raw URLs: 1,189,468 bytes match. Tags and `gh-pages` are unchanged.
No package release or hosted deployment was made. Tracking: `officina-3a37`.
