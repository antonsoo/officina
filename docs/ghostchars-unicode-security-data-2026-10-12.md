# Ghostchars: recover confusable identifiers from Unicode 17 data

The previous security table missed both an all-Cyrillic `apple` lookalike and
`window` beginning with Cyrillic sha. A controlled runnable JavaScript fixture
declares and uses these distinct bindings, but the baseline scan returned no
findings. Source commit
[`2513948`](https://github.com/antonsoo/ghostchars/commit/2513948d5bb3e2cb83391d200e7eff838cd7485c)
updates the pinned security and emoji sources to their actual Unicode 17
locations, correcting the earlier claim that this data was unavailable.

Unicode 17 adds 210 confusable mappings and revises 39. The generated table's
6,565 entries match an independent parse of the hash-pinned upstream file.
The emoji tag allowlist and other generated tables remain identical. The
fixture now produces eight collision errors and two warnings; JSON, SARIF,
GitHub and summary CLI formats all change from exit 0 to exit 1. Identifier
repair leaves the source bytes intact for manual review.

The [study and replay](https://github.com/antonsoo/ghostchars/blob/2513948d5bb3e2cb83391d200e7eff838cd7485c/studies/unicode-security-data/README.md)
retain before/after output, mapping deltas and Chromium/Firefox desktop/phone
screenshots. Eight offline scans per build exercise the real worker, keyboard
location selection and unchanged sanitized text. Packaged glyph font subsets
are loaded before disconnection; cold offline availability of unused subsets
is not established. Replaying 83,494 hash-checked public documents changes only
two: a corrected comparison spelling and one additional mixed-script warning.
This is not evidence of a newly discovered attack or a general false-positive
estimate.

A clean archive matched all 309 Git entries. Node 24 installation, lint, type
checks, 252 unit tests, library/CLI/web builds and 36 browser workflows passed.
All six regression screenshots were inspected. All 85 built files match the
earlier tested build, including the browser-served assets. A separately installed
local tarball contains 53 matching compiled files and passes the eight cases,
four CLI formats, package import, installed binary and unchanged-source repair
checks on Node 20.0.0 and 24.21.0.

The [public-source receipt](evidence/ghostchars-unicode-security-data-2026-10-12.json)
checks clean local/remote main equality and all 25 changed public files
(1,053,666 bytes). Version 0.1.5, tags and the hosted demo remain unchanged.
No npm release or hosted deployment was performed. This aligns the data with
the already-pinned Unicode 17 core; it does not establish full UTS #39 conformance
or older runtimes' recognition of every new Unicode 17 character.
