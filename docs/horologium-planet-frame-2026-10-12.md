# Horologium: planetary pointers use the selected date's equinox

Source is pushed to
[`a2ce92063118165d009612512ecbb6109fdd4b63`](https://github.com/antonsoo/horologium/commit/a2ce92063118165d009612512ecbb6109fdd4b63).
Package version 0.2.3, release tags and hosted files are unchanged.

At baseline `26e8bbdf28e668cf034dd2277eab9b03d93f6e5d`, the planetary
calculation returned J2000 ecliptic longitude and placed it directly on the
clock's tropical zodiac of date. The resulting drift was attributed to the
approximate orbital model. A fresh independent ephemeris comparison separates
the two: the old calculation is much closer when measured in J2000, revealing
the missing coordinate rotation.

The correction precesses the complete three-dimensional geocentric vector
to the selected date's mean ecliptic and equinox before calculating longitude.
Orbital elements, Sun/Moon calculations and calendars are unchanged. No runtime
dependency is added.

| Independent geometric comparison | Before | Corrected |
| --- | ---: | ---: |
| Maximum longitude error across 13,775 positions | 2.276355 degrees | 0.230135 degrees |
| Positions in a different 30-degree zodiac sector | 405 | 12 |
| Mercury on 2 January 2026; reference 270.189459 degrees | 269.825898 degrees | 270.189151 degrees |

The [study](https://github.com/antonsoo/horologium/blob/a2ce92063118165d009612512ecbb6109fdd4b63/studies/planet-frame/README.md)
retains the independent reference, generators, per-planet geometric and apparent
comparisons, before/after browser receipts and four inspected screenshots.
It covers 2,755 dates from 1850 through 2050, including every day of 2026.
Skyfield 1.54 reads the pinned JPL DE440s kernel; ERFA 2.0.1.5 supplies the frame
matrices. A fresh JPL download matches the reference kernel byte-for-byte.
Another 588 fixed-vector probes from 1800 through 2050 differ from ERFA by at
most `3.32e-12` in a unit-vector component.

The remaining 12 sector disagreements are explicit limits. Two-body propagation,
the Earth-Moon-barycenter approximation, omitted apparent-place effects and
direct use of the supplied Julian day remain. The ephemeris comparisons use the
same nominal TT argument; they do not validate UTC-to-TT conversion. Ancient
and far-future positions remain illustrative, with no physical observation or
accuracy claim outside the sampled dates.

Offline Chromium and Firefox at 1440 and 375 pixels exercise 72 date changes
across baseline and corrected builds. The check waits for animation completion
and measures all 360 needle directions through SVG screen matrices. All agree
with their respective built calculations within CSS serialization tolerance.
The 36 paired views preserve calendar text, Sun/Moon target directions, date
readouts and limitation labels. No offline requests, page/console errors,
accessibility violations or horizontal overflow occur in these checks.

A clean archive of production commit
`56c4384004582f4d8f4feba3bb5d491f5ec7a9d2` passes lint, TypeScript checks,
229 tests in each of two locales, the production build and 58 browser workflows.
All 103 selected source/test/replay inputs and 84 build files match the tested
checkout; all 29 served assets match the clean build. A separate offline npm
installation reproduces the entire numerical replay under Node 20.0.0 and
24.21.0 with identical records apart from the Node version. The documented
library examples reproduce their stated results.

The tarball is 73,248 bytes, SHA-256
`05f9385def112be69f26716560b8d529b2621c0452300aacf8d5b231b118082e`.
All 40 package files match the clean build and installed artifact. Runtime
verification was on Linux/WSL2.

The [public receipt](evidence/horologium-planet-frame-2026-10-12.json) verifies
a clean checkout, exact remote main equality and all 24 changed files fetched
from pinned raw URLs: 2,061,218 bytes match. Tags and `gh-pages` are unchanged.
No package release or hosted deployment was made. Tracking: `officina-3335`.
