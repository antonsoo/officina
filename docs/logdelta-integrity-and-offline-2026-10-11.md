# Logdelta: exact input evidence and offline recovery

Two reproduced failures are repaired in pushed source at
[`3823694`](https://github.com/antonsoo/logdelta/commit/3823694b53abe9d36f05ac719b5d519e51a6eaa2).
The studies retain original bytes, complete reports, real browser captures and
clean-build receipts.

| Failure | Result | Evidence |
| --- | --- | --- |
| An invalid UTF-8 byte or UTF-16 surrogate decoded to the same value as a genuine U+FFFD character. Exact field watches could claim completeness and exit 0. | Watched native inputs now require intact decoding, including gzip and stdin. Browser imports retain decoding loss through editing and refuse an exact watch while keeping the previous report visibly stale. Ordinary comparisons retain their tolerant behavior. | [Raw inputs, before/after reports, installed package and browser replay](https://github.com/antonsoo/logdelta/blob/3823694b53abe9d36f05ac719b5d519e51a6eaa2/studies/text-integrity/README.md) |
| New comparison discarded the loaded worker. A fresh offline comparison failed in Chromium; Firefox's success depended on cached worker/engine requests. | The built interface retains the worker program and successfully executed module bytes in memory. Cancel, editing and reset still terminate workers; replacements initialize offline and hash the bytes they actually instantiate. | [Worker lifecycle, native parity, network observations and screenshots](https://github.com/antonsoo/logdelta/blob/3823694b53abe9d36f05ac719b5d519e51a6eaa2/studies/offline-lifecycle/README.md) |

All 24 malformed native exact-watch cases now exit 2 without comparison JSON;
the other 20 valid watch cases and every ordinary comparison remain unchanged.
The packaged crate was installed separately and reproduced all 44 results.
The existing 32,000-line Loghub replay also retains identical output; cached
inputs were hash-checked against its pinned manifest, not downloaded anew.

Offline browser checks run in Chromium and Firefox at desktop dark and 375px
light. Each flow recreates five workers with zero additional HTTP requests;
all 20 retained comparison results match the installed native executable.
The final clean build passed formatting, Clippy, typecheck, lint, 83 web unit
tests and 124 browser workflows, including failed initial downloads, incompatible
modules, retry and cross-build cache identity. All 39 served production files
matched the clean build. Native checks for the preceding encoding repair passed
on Rust 1.91 and the minimum supported Rust 1.85; the offline transport repair
does not change the Rust engine, and its WASM bytes match that tested build.

The malformed logs and offline workload are synthetic. Decoded strings supplied
by library callers cannot attest to their original bytes. Offline recovery
starts after a completed comparison in the built page; reloading the page or
fetching examples still requires site assets. The engine cache contains code,
not log contents, and is not persisted.

The [public-source receipt](evidence/logdelta-integrity-and-offline-2026-10-11.json)
verifies clean local HEAD against remote `main` and fetches 41 pinned public
files, all byte-identical. The observed `gh-pages` ref remained
`f8c1e783c0d9b7e024f8d6c9f4ca554e389d4bdb`. No package release, tag or manual
hosted deployment was performed. These browser observations describe local
production builds, not the hosted demo.
