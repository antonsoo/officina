# Horologium: checked supplied calendar dates

The [source correction](https://github.com/antonsoo/horologium/commit/48adbe3a063a13c16474515370bbbcfc79b8b3f1)
rejects nonexistent month/day tuples instead of converting another date. For
example, Cheshvan 30 in Hebrew year 5784 previously became Kislev 1, and a sixth
epagomenal day in a common Coptic/Ethiopian year became the next year. Gregorian
2025-02-29 likewise became March 1. These now raise `RangeError` through the
actual installed public package.

| Observed requests | Baseline | Corrected |
| --- | ---: | ---: |
| Invalid date requests refused | 16/2,623 | 2,623/2,623 |
| Valid requests retained exactly | 16,884 | 16,884 |
| Independent expected Julian Days matched | 8,920/8,920 | 8,920/8,920 |
| Native ICU Ethiopian checks matched | 984/984 | 984/984 |
| Same-process recovery after invalid requests | 2,623/2,623 | 2,623/2,623 |

The [study](https://github.com/antonsoo/horologium/blob/48adbe3a063a13c16474515370bbbcfc79b8b3f1/studies/forward-dates/README.md)
retains every malformed request, independent month boundaries, module hashes,
installed Node 20.0.0/24.21.0 replays and actual terminal output. The ten month/day
entry points check integer years, valid month membership, leap/variable month
lengths and midnight precision. Valid fractional days keep the original formulas
and output digest. Callers intentionally using overflow fields for arithmetic
must add offsets to a valid JD instead. Maya positional counts and astronomical
calendar inference are outside this change.

A fresh archive passes lint, strict types, 268 tests in each configured locale,
all three examples and 58 browser workflows. Its 60 library and 30 site files
match between Node 24/26. All 40 shipped JavaScript/declaration files match the
clean build and both installed consumers; a separate strict TypeScript consumer
resolves the public types. The existing inverse replay retains zero disagreements
and its 843 valid outputs. All 24 offline clock readouts and explanations match
between builds, with served-file hashes verified at desktop and 375 px.

The [public-byte receipt](evidence/horologium-forward-dates-2026-10-15.json)
checks the clean worktree, equality with remote `main` and all 26 changed files
(2,251,215 bytes) against pinned public copies. The 77,632-byte package is a local
tested artifact. No registry release, tag, manual hosted deployment or remote-CI
completion is claimed. The checks validate the defined calendar arithmetic,
without adding historical attestation or ephemeris accuracy claims.
