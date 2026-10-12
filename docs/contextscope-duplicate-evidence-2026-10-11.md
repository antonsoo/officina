# Contextscope: duplicate findings need evidence across every pair

Pushed source at
[`f8dcdb0`](https://github.com/antonsoo/contextscope/commit/f8dcdb0d2f3617b046d29aa42f396e7c4ce9721c)
repairs three reproduced duplicate-reporting errors. Successive edits could
form one group even when its first and last members failed the similarity
threshold. A short-hash collision could invent a match or hide another
conversation. The findings display could merge different duplicate evidence
at reused segment paths.

| Retained case | Baseline | Corrected source |
| --- | --- | --- |
| Three edited configuration snapshots | All three called the same; 2,418 tokens called wasted | Two similar snapshots; 1,209 estimated tokens to review |
| Distinct strings with the same short hash | Reported as 100% similar | No match |
| Two conversations containing different exact repeats | Second conversation suppressed | Both groups preserved |
| Exact and edited content at reused source paths | One displayed finding | Two separate findings |

The edit chain has pairwise similarities of 86.67%, 86.67%, and 75%. The
new grouping requires every pair to reach 85%, compares actual shingle
strings, and reports the true minimum. Equal text is pooled before comparison.
The deterministic greedy partition is conservative and source-order dependent;
it does not enumerate every possible qualifying pair. Even a perfect shingle
score can hide different ordering or repetition.

The browser now exposes original-segment inspection and complete raw downloads
from each group's member controls, including the correct request number.
Identical analyzed text and similar text remain distinct in the library, JSON,
CLI, browser, and offline HTML. The source JSON/API replaces
`estimatedWastedTokens` with `estimatedReviewTokens` and adds `matchKind`.
Consumers must update the field access. These estimates establish neither
safe removals nor cost savings.

The [retained study](https://github.com/antonsoo/contextscope/blob/f8dcdb0d2f3617b046d29aa42f396e7c4ce9721c/studies/duplicate-evidence/README.md)
replays six synthetic cases and audits 240 terminal snapshots from pinned
public SWE-bench trajectories. It rechecks every original and reconstructed
body hash. Of 466 baseline groups, five include below-threshold pairs; the
installed repair corrects those five and preserves the other 461 memberships,
minimums, text classifications and review sizes. No corrected group violates
the threshold or misstates its minimum. This is a terminal-snapshot grouping
audit, not a replay of all 10,555 requests or a new cache-accuracy estimate.

The non-duplicate portions of all six full synthetic reports are byte-identical
before and after, including token, cache, usage and prefix results. An
independently installed local tarball produces the same complete analyses on
Node 20.0.0 and 24.21.0. A clean archive passes lint, type checking, 462 unit
checks, a production build, and 90 browser workflows.

Four retained Chromium/Firefox workflows at 1440 and 375 px stop the actual
HTTP server before inspecting originals and downloading JSON/HTML. Raw objects
match their inputs, complete JSON matches the core report, keyboard focus
returns, and no subsequent HTTP requests, page errors, CSP violations or
horizontal overflow occur. Four further offline openings render the installed
CLI's actual HTML. CLI and browser HTML agree on every byte except the explicit
wall-clock generation timestamp. Four baseline and eight final panel captures
were opened and inspected. The artifact receipt compares 107 build inputs,
92 installed compiled files and 10 locally served files with the clean build.

A separate component benchmark on 1,000 identical settings blocks reduces the
median duplicate-detection time from 2,311 ms to 0.86 ms by pooling equal text.
All three observations are retained. This favorable repeated-text workload
excludes parsing/tokenization and makes no end-to-end latency or memory claim.

The [public-source receipt](evidence/contextscope-duplicate-evidence-2026-10-11.json)
checks clean local HEAD against remote `main` and byte-compares pinned public
files. The observed `gh-pages` ref remains
`3496b0635263f82117196596cd18a068e601b9c3`. No registry release, tag or manual
hosted deployment was performed; the npm version is still 0.3.3. Browser
observations apply to local production builds.
