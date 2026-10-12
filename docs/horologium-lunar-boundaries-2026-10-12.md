# Horologium: consistent lunar and reconstructed year boundaries

Pushed source at
[`26e8bbd`](https://github.com/antonsoo/horologium/commit/26e8bbdf28e668cf034dd2277eab9b03d93f6e5d)
corrects skipped nearby new moons and inconsistent year labels in the Greek
and Babylonian reconstructions. It also keeps bundled fonts available during
offline calendar navigation.

| Reproduced input | Baseline | Corrected |
| --- | --- | --- |
| Five minutes before a modeled new moon | Next search skips a lunation | Returns the imminent crossing |
| Five minutes after the January 2026 modeled crossing | Moon age 29.7641 days | Moon age five minutes |
| Babylonian year-start civil day, before conjunction | Previous year, day 30 or 31 | New year, day 1 |
| Between summer solstice and Hekatombaion | Olympiad advances before Attic year | Both use the same year |
| Earliest clock years with equinox after May 1 Julian | Previous equinox mislabels the year | Later search anchor selects the current event |

The [retained study](https://github.com/antonsoo/horologium/blob/26e8bbdf28e668cf034dd2277eab9b03d93f6e5d/studies/lunar-boundaries/README.md)
uses an independent daily-grid crossing finder and civil-interval calculation
with the unchanged longitude formulas. Of 5,964 nearby lunar searches/ages,
3,976 disagree in the baseline and none after correction. Calendar boundary
checks remove 276 disagreements among 5,035 Babylonian cases and 158 among
5,015 Greek cases. Eighty selected years span -5000 through 5000.

An additional sweep checks every year -5000 through 5000: Babylonian year
labels at September 1 Julian have 165 baseline disagreements and none after
correction. Ten thousand and one returned lunar crossings can be reused as
inclusive next-search boundaries, strict previous-search boundaries and
zero-age instants. Eight hundred complete descriptions from the other ten
calendar tablets stay identical. These checks establish internal consistency,
not ephemeris accuracy or historically attested calendar dates.

Clean library archive `efc38d3` passes lint, typechecking, 223 unit checks in
each of two locales, build and the runnable README example. Its packed npm
artifact is installed separately; Node 20.0.0 and 24.21.0 produce identical
full study receipts and pass the README's package imports and example values.
The later font archive `e9752bb` has identical bytes for all 17 library source
files and all 34 installed JavaScript/declaration files. It passes lint,
typechecking, build and all 58 Chromium/Firefox workflows.

Each before/after replay uses Chromium and Firefox at 1440 and 375 pixels,
with four dates per context. A no-store HTTP server stops before the first
counterexample navigation. The baseline tries six late font requests and logs
six failed-load errors across the four contexts. The correction loads all
26 faces at startup and records no later HTTP requests or errors. Duplicate
variable-font declarations are consolidated from 49 to 26 faces without
changing font-file bytes. Loading all faces costs 632,660 font bytes up front.

The browser checks actual labels, keyboard disclosures, retained focus,
reconstruction notices, accessibility, CSP and overflow. All 24 screenshots
were opened and inspected. Artifact receipts compare 98 build/check inputs
per archive, installed files, and all served assets against their builds
(nine baseline assets and 29 corrected assets).

Both calendars remain explicit reconstructions with mean-midnight day
boundaries and simplified intercalation. Visible crescents, historical sunset
boundaries, actual Athenian decisions and Babylonian Ululu II remain outside
the model. The longitude formulas and the separate Chinese conjunction
model are unchanged; farther astronomical extrapolation remains unverified.

The [public-source receipt](evidence/horologium-lunar-boundaries-2026-10-12.json)
checks remote main against clean HEAD and byte-compares all 45 changed pinned
public files. Push workflows are skipped, and gh-pages remains
`89a9d0f9c12cd32fbd1b675b46dab92124073552`. No npm release, tag or hosted
deployment was performed. Browser evidence applies to the retained local builds.
