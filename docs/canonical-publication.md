# Verify the canonical site, including unchanged asset paths

The existing deployment helper returned success after any HTTP 200 response.
That response can belong to the previous site while the canonical index or an
unchanged data URL still serves older content. A successful branch push cannot
resolve that uncertainty.

This run has a concrete public example. Officina's new build changes only the
Stutterscope description to mention native CapFrameX JSON. The existing index,
JavaScript, stylesheet, fonts and thumbnails already match, and the entry URL
returns HTTP 200. Yet **37 of 38 build files match**: `projects.json` still serves
the earlier catalogue. [Actual before receipt](assets/canonical-publication/officina-before.json).
The verifier correctly refuses to call that build current.

## Reusable command and receipt

`node scripts/verify-pages.mjs BASE_URL BUILD_DIR [--out RECEIPT.json] [--wait SECONDS]`

The script uses Node 24's standard library to read canonical responses and
compare them with the captured build. The base URL
ends in `/` and contains no query or fragment; every request uses a canonical
path, with each filename segment encoded separately.

It inventories every regular build file and its SHA-256, verifies the real entry
URL before requesting assets, checks every explicit file URL, then rechecks the
entry. The root and `index.html` can have separate CDN cache entries. A receipt
records both, each file's expected and observed evidence, the build-manifest
hash, attempt count and UTC observation times.

| Outcome | Exit | Evidence |
| --- | ---: | --- |
| `verified` | 0 | Entry before/after, explicit index, and every inventoried file match |
| `mismatch` | 1 | At least one complete HTTP 200 body has wrong bytes/length, or exceeds the expected length |
| `unavailable` | 1 | No mismatch was observed, but HTTP/transport/timeout/truncation prevented complete verification |
| Configuration/input error | 2 | Invalid URL, missing index, non-artifact input or invalid option |

Mixed failures retain every observed per-file state; a mismatch takes precedence
in the aggregate state. An oversized response is cancelled early and retains a
lower bound on its length, with no invented full-body hash. Failed or truncated
responses never acquire a complete SHA-256. Local symlinks, Git metadata and
`node_modules` are refused before fetching; use the materialized static output.
Receipts must be written outside the build directory.

By default the command makes one pass. `--wait` polls for up to the supplied
retry window, at five-second intervals, with a separate ten-second request
timeout; it does not add cache-busting parameters. This allows propagation to
finish without treating an older canonical representation as current. The
command never rolls back or otherwise changes the site when verification fails.

The Pages workflow now publishes from a temporary directory so `git init` does
not add repository metadata to the tested `dist/` inventory. Its subsequent
verification step checks the actual Pages URL and records JSON. Local/public
replays below are separate evidence; execution of that remote workflow is not
claimed by these receipts.

## Verification

The actual deployed [Stutterscope build](assets/canonical-publication/stutterscope.json)
verifies all 33 files. The actual deployed
[Horologium build](assets/canonical-publication/horologium.json) verifies all 30.
Their separate studies retain real disconnected browser behavior and package/
source boundaries:

- [Native CapFrameX sessions](https://github.com/antonsoo/stutterscope/tree/21a4b157490594137a53f705d29400f639700697/studies/native-json)
  import five unchanged recordings totaling 778,780 frames, with independent
  arithmetic and original sample coordinates.
- [The corrected ancient-calendar clock](https://github.com/antonsoo/horologium/tree/73068bc4d8cbc83bd3cfe185548c9bf42f13fcb9/studies/live-clock)
  retains fresh UCL, FAMSI, Ethiopian-era and JPL/HKO reference checks, public
  before/after labels and lunar-year downloads. Neither deployment releases a
  new registry version.

A [fresh Node 24 archive](assets/canonical-publication/clean-archive.json) of
`a035fa1904237160c23fd31f14697efa29dae381` passes installation, lint, types,
formatting, 38 catalogue/HTTP checks, the production build and 32 browser
workflows. A [real publication-copy dry run](assets/canonical-publication/publish-copy.json)
commits 39 files (38 build files plus `.nojekyll`) while leaving the original
build's manifest unchanged and free of Git metadata. It performs no remote push.

The updated description also makes the native importer discoverable: searching
`capframex json` changes from zero results to one Stutterscope card. The
[public before replay](assets/canonical-publication/catalogue-before.json) and
[local after replay](assets/canonical-publication/catalogue-local.json) cover
Chromium and Firefox at 1280 and 375 px. The latter repeats filtering after
disconnecting, with no data fetches, page errors or horizontal page overflow.
Run `node scripts/replay-native-json-search.mjs BASE_URL OUTPUT_DIR before|after`
from an installed checkout to repeat this focused workflow.

| View | Public before | Clean local build |
| --- | --- | --- |
| Desktop | [No matching tools](assets/canonical-publication/before-1280.png) | [Native JSON card](assets/canonical-publication/local-1280.png) |
| 375 px | [No matching tools](assets/canonical-publication/before-375.png) | [Native JSON card](assets/canonical-publication/local-375.png) |

The controlled HTTP workflows in `tests/verify-pages.test.mjs` cover an older
HTTP-200 entry with already-available new assets, a stale explicit index, an
entry that changes during the pass, same-length wrong asset bytes, delayed
propagation, unavailable/truncated responses, oversized bodies and encoded
filenames. They use real local HTTP responses, not a mocked hash function.

A verified pass establishes the observed responses against one captured build
inventory. It does not enumerate extra hosted files, certify later CDN state,
exercise the browser, identify a public source commit or establish a registry
release. Those remain separate observations.
