# Logdelta preserves repeated JSON member evidence, 2026-10-14

Baseline `9e34dd6` normalizes a target containing an earlier
`message: database corruption detected` and a later
`message: health check passed` to the same template as a health-only baseline.
The actual CLI exits 0 and reports zero findings. A constructed Docker-style
envelope with repeated `log` fields has the same failure: ordinary JSON map
deserialization overwrites the earlier value before template mining.

Implementation `00aaff6` declines JSON interpretation if decoded object member
names repeat at any depth. The existing masked raw-text path retains their
occurrences. It does not choose a winning value or reject a mixed-format log.
The example now exits 1 with one New and one Gone template. Unambiguous JSON,
usual masking and scoped exact-field ambiguity rules remain supported.

| Actual verification | Result |
|---|---|
| Eighteen constructed public API and file/gzip/stdin/novelty cases | 109 workflows: baseline 72 disagreements; correction zero |
| Ordinary unique-record controls | All 36 complete captures identical; the additional exact-field duplicate gate stays exit 2 |
| Fresh Rust 1.91 archive | Formatting, strict Clippy, 226 tests, 147 library-only tests, one doctest, release and package checks pass |
| Minimum Rust 1.85 archive | Locked build and 226 tests plus one doctest pass |
| Locally packed and installed 0.3.4 crate | All 22 runtime files and lockfile match source; three focused packed tests pass; each Rust 1.91/1.85 installed artifact passes all 109 workflows with source-identical captures |
| Fresh Node 24 web archive | Rust/WASM checks, three wrapper tests, lint, strict types, 83 web tests, build, 128 existing browser tests and 20 compiler-configuration checks pass |
| Artifact identity | All 316 baseline and 322 implementation archive inputs match pinned source; all 39 Node 24/26 production files match |
| Real compiled WASM | All 18 full reports match native; integers/text/source exact, floating-point scores compared at 12 significant digits |
| Actual offline production browser app | Chromium/Firefox at 1440/375 px, real file uploads and downloaded reports: 144 workflows, baseline 48 disagreements, corrected zero |
| Served bytes and visual checks | All 23 served/browser-loaded files match each tested build in eight views; eight screenshots inspected; no overflow, axe findings, script/CSP errors or external/late requests |
| Existing cached public Kubernetes/Loghub inputs | All 536 files (429,474,908 bytes) hash-verified; all 280 complete current before/after outputs, stderr and exit statuses identical |

The [reproducible study](https://github.com/antonsoo/logdelta/blob/fad282595b202c1be1153015ec0a52fb9061f09a/studies/json-members/README.md)
retains actual CLI/public-API captures, complete browser reports, input/build/
package/check-log hashes, portable replay drivers and unedited screenshots.
The ambiguous records are constructed counterexamples, not a production
incident or captures from a Docker daemon. The public-log comparison is an
output-stability control, not an accuracy or performance benchmark.

Two evidence-driver issues were corrected before final capture: an inherited
`CARGO_TARGET_DIR` redirected the standalone consumer executable, and Playwright
`fill` omitted literal ANSI ESC bytes. The consumer now sets its target
directory; native file imports verify complete textarea contents. Both final
browser phases were rerun. Neither required a product change.

Source `fad282595b202c1be1153015ec0a52fb9061f09a` matches clean remote main.
The [publication receipt](evidence/logdelta-json-members-2026-10-14-public.json)
records all 29 changed public files, byte-matched at immutable URLs with sizes
and hashes. The gh-pages head remains
`f8c1e783c0d9b7e024f8d6c9f4ca554e389d4bdb`. The local package still identifies
as `0.3.4`; no crates.io release, tag, manual deployment or remote CI result is
claimed. No dependency or application styling changed.

Template mining still uses masking and Drain's heuristic grouping; retaining
raw occurrences is not complete semantic interpretation. Exact-field watches
remain the appropriate scalar-value workflow. RFC 8259 recommends unique
member names but does not forbid every repeated-name input. Issue
`officina-4n26` closes after source, installed-artifact, browser and public-byte
verification.
