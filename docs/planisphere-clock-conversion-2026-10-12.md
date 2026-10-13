# Planisphere: set the wheel from a civil clock

Source commit [`ba3f1d4`](https://github.com/antonsoo/planisphere/commit/ba3f1d43a1fffbaf3661b9b6ea0971196626124c)
adds an explicit civil-clock converter beside the local mean-time control.
Previously the app required users to perform the UTC-offset and longitude
calculation externally. The converter previews UTC, mean time and the rounded
wheel setting, then applies the date and time together. Changing the resulting
year also changes the printable annual scale.

| Civil input | Given offset | Longitude east | Applied mean-time setting |
| --- | --- | ---: | --- |
| 2026-07-01 00:15 | -07:00 | -122.42 | 2026-06-30 23:00 |
| 2026-01-01 00:05 | +14:00 | -157.4 | 2025-12-30 23:30 |
| 2026-12-31 23:59 | +00:00 | 0 | 2027-01-01 00:00 |

These controlled examples cover a previous mean-time date, the date line and
rounding into New Year. The user supplies the offset in effect at the intended
instant. A city preset supplies longitude; custom latitude requires an explicit
longitude. Conversion drafts leave the current wheel and downloads intact.

The [retained study](https://github.com/antonsoo/planisphere/blob/ba3f1d43a1fffbaf3661b9b6ea0971196626124c/studies/clock-conversion/README.md)
contains eighteen independent Python calendar calculations and four actual
offline browser workflows in Chromium/Firefox at desktop/night and 375px/ink.
The workflows apply all three examples above by keyboard, inspect the actual
date/hour tick alignment and download both pieces. All 24 SVG downloads retain
A4 dimensions; each star disc contains the selected date and correct annual
scale. The date-line disc and holder are retained for inspection, along with
four reviewed screenshots. The checked converter state had no axe violations,
page overflow, page errors, external requests or CSP violations.

A fresh archive installed under Node 24.21.0 passed lint, types, 502 unit/numerical
checks, build, the independent oracle and 76 browser checks. All 173 tracked
implementation files stayed unchanged. All 37 rebuilt app files match the
served browser-tested files byte for byte. The [verification receipt](https://github.com/antonsoo/planisphere/blob/ba3f1d43a1fffbaf3661b9b6ea0971196626124c/studies/clock-conversion/verification.json)
retains those checks and measured Apply interactions.

This is a paper-wheel helper. It requires an explicit offset, accepts Gregorian
years 0001–9999, approximates UT1 with UTC and rounds to existing quarter-hour
ticks. It does not determine historical/local time-zone rules or support
second-level offsets and leap seconds. The printed ring still samples the mean
Sun at 00:00 UTC; documentation now correctly states that the resulting
approximation depends on longitude as well as mean time. Digital consistency
does not establish physical assembly or observing accuracy.

The [public-source receipt](evidence/planisphere-clock-conversion-2026-10-12.json)
checks clean local/remote main equality and all 24 changed public files
(2,276,730 bytes) against the checkout. Version remains 0.3.0. Tags and
`gh-pages` are unchanged; no registry release or hosted deployment occurred.
