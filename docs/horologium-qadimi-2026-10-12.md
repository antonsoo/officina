# Horologium: identify the Qadimi calendar

The Zoroastrian tablet described Shahanshahi as seasonally corrected. It now
identifies the implemented Qadimi variant and explains that Shahanshahi also
uses a wandering 365-day year, while Fasli uses seasonal correction. Source is
pushed as
[`2ce803e`](https://github.com/antonsoo/horologium/commit/2ce803e).
The hosted clock, package version, tags and releases remain unchanged.

The correction cites Rohinton Erach Kadva's community calendar compendium.
Five published dates around the 2026 Qadimi new-year boundary already matched
the library; no arithmetic change was needed. Both conversion functions retain
identical function bodies in the locally installed package. This is a correction
to the visible identification and explanation, not a new calendar implementation
or evidence of historical accuracy across the clock's entire date range.

A fresh locked install passes lint, type checking, 235 unit checks, build and
58 browser workflows. Locally packed installs were checked under Node 20.0.0
and 24.21.0. Eight offline browser captures cover both engines at 375 and 1440
pixels; all were viewed. All 87 independently built files and 30 served web files
match. The [calendar documentation](https://github.com/antonsoo/horologium/blob/2ce803e/docs/CALENDARS.md#zoroastrian-qadimi-calendar-yazdegerdi-era-srclibzoroastriants)
links the primary reference, checked dates, screenshots and artifact receipt.
The [public-source receipt](evidence/horologium-qadimi-2026-10-12.json) verifies
clean local/remote main equality and every changed public file, with unchanged
tags and `gh-pages` refs.
