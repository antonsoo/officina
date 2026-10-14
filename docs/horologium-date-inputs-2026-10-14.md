# Horologium rejects invalid dates without blocking, 2026-10-14

Source baseline `0452cda` can block a Node process on malformed date input.
The real installed package exceeds its calculation deadline on Coptic,
Ethiopian and Islamic infinities and on large finite values such as `1e20`.
Hebrew conversion also hangs on extreme finite values. An invalid JavaScript
Date becomes NaN and then an assumed month 6, day 29 in the Hebrew inverse.

Code `2aac6bc` adds finite-input checks and bounded year bracketing with safe
increments, representable midnight boundaries and valid year lengths. It
rejects unsupported molad/day-count/civil-date arithmetic and invalid Date
bridges, instead of inventing calendar fields. Valid date outputs remain
unchanged on the recorded control matrix.

| Verified workflow | Result |
|---|---|
| 90 constructed malformed library requests | Baseline: 78 contract disagreements, 18 calculation timeouts; corrected: zero disagreements/timeouts, all 90 recover in the same process |
| Process identity | A READY marker proves import completed before each timed-out calculation; terminated children have SIGTERM results |
| Valid controls | All 843 converter outputs over 45 historical/modern/wider dates match baseline exactly |
| Independent bridge | Native JavaScript Date checks UTC bridge values on 42 dates |
| Fresh Node 24.21.0 archive | Frozen install, lint, strict types, 256 tests in each of default/German locales, both examples, library/site build, pack and 58 browser workflows pass |
| Installed Node 24.21.0 and 26.7.0 | Each passes the full malformed-input/recovery matrix and reproduces all valid controls |
| Artifact identity | All 40 shipped JavaScript/declaration files match the clean build and both installs; 60 library and 30 site files match Node 24/26 builds |
| Source identity | 104 selected tracked source/test/build inputs match the clean archive |
| Actual served build | 24 offline Chromium/Firefox date/explanation workflows at 1440/375px; all 30 served and 29 browser-loaded files match the tested build |
| Visual review | Installed public-export consumer stdout rendered without edits; terminal image and six actual clock screenshots inspected |

The [study](https://github.com/antonsoo/horologium/blob/aa6810cd65010158c37e63392ce78fd82abaa35c/studies/date-inputs/README.md)
retains actual process output, module hashes, valid-output digests, source and
installed captures, artifact/check-log hashes and the runnable recovery example.
The malformed values are deliberately constructed, not production incidents or
a latency benchmark. Valid-output parity is a regression check, not independent
calendar accuracy certification.

The local 0.2.3 tarball is 76,595 bytes, SHA-256
`79dfc8311fcbb610641a148d2a2598cb16acc98d160d6d0089b2b4049e4cc529`.
It is not an npm release. Source `aa6810c` matches clean remote main; all
23 immutable public source/study/image files were fetched and byte-matched.
The [source receipt](evidence/horologium-date-inputs-source-2026-10-14.json)
records their URLs, sizes and hashes. The gh-pages head remains
`89a9d0f9c12cd32fbd1b675b46dab92124073552`; no tag, manual deployment,
registry release or remote CI result is claimed.

Build command `npm run build` produces `dist/lib/` and `dist/app/`. The clock
already restricts date inputs. This correction protects library callers and
preserves its existing displayed calendar coordinates. Forward month/day tuple
validation and ephemeris accuracy remain outside this change. Issue
`officina-vlze` is closed after source/package/browser verification.
