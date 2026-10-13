# Contextscope: faster duplicate review with unchanged findings

Source commit
[`e835a2fb626d6d5b513f7569ce0a07c9d20e4e1f`](https://github.com/antonsoo/contextscope/commit/e835a2fb626d6d5b513f7569ce0a07c9d20e4e1f)
was pushed to `main` and verified against the remote branch. All 39 changed
files, totaling 444,833 bytes, matched their pinned public raw URLs. The
[publication receipt](evidence/contextscope-duplicate-scaling-2026-10-13-public.json)
retains file sizes and SHA-256 values. Tags and `gh-pages` remained unchanged.
There was no npm release or hosted deployment; the version remains 0.3.3.

## The bottleneck and change

Duplicate review compared distinct text blocks against earlier groups even when
they could not meet the similarity threshold. At baseline `2c52d63`, a
constructed 7,697,068-byte history containing 2,000 unrelated blocks took 67.41
seconds in this step on Node 24.21.0. The source change reduces it to 2.69 seconds.

For larger histories, a temporary index of rare-first shingle-set prefixes
selects candidate clusters. The index can exclude impossible matches without
approximating scores. Candidates retain source order, and every member still
passes the original complete-link checks. Small histories keep the direct scan;
identical text still benefits from existing pooling. There are no parser,
token-accounting, cache-rule, report-schema or dependency changes.

The [executable study](https://github.com/antonsoo/contextscope/blob/e835a2fb626d6d5b513f7569ce0a07c9d20e4e1f/studies/duplicate-scaling/README.md)
retains all samples and a completeness argument for the filter. These are
synthetic stress histories, not representative traffic. Large inputs can exceed
the selected model's context window; reviewing them still needs to finish.
Three-repetition medians below measure duplicate review, including shingling and
indexing, but excluding parsing and tokenization. Version order alternated in
fresh case processes on WSL2, a Ryzen 7 7800X3D and 14 available CPUs.

| Constructed history | Before | After |
| --- | ---: | ---: |
| 500 distinct blocks | 5.153 s | 0.376 s |
| 2,000 distinct blocks | 67.409 s | 2.689 s |
| 2,000 blocks with exact repeat and edit chain | 36.446 s | 2.243 s |
| 2,000 copies of one text | 0.0036 s | 0.0028 s |
| 250 mutually similar distinct texts | 0.217 s | 0.167 s |

## Actual workflows and preservation

The clean production build imports the mixed 7.7 MB history while offline after
warming application code and bundled fonts. These are single full-import
observations, including file load, worker analysis and rendering:

| Browser | Width | Before | After |
| --- | ---: | ---: | ---: |
| Chromium 153 | 1440 | 14.85 s | 3.75 s |
| Chromium 153 | 375 | 13.83 s | 3.04 s |
| Firefox 155 | 1440 | 30.10 s | 2.84 s |
| Firefox 155 | 375 | 28.63 s | 2.86 s |

Each workflow inspects and downloads an original member, restores keyboard
focus, exports JSON and HTML matching the installed CLI, and opens the HTML
offline. Only HTML's checked generation timestamp differs. All served assets
match the build. There are no page errors, unexpected requests, horizontal
overflow or axe violations. All eight before/after screenshots were inspected;
each pair is byte-identical. Four additional small-history browser workflows
preserve the existing edit-chain behavior.

All six constructed cases preserve complete duplicate outputs. An independent
exhaustive reference agrees on 240 shuffled histories, including frequency ties,
nontransitive edits and the exact 17/20 boundary. The existing pinned public
trajectory audit preserves all 466 groups across 240 terminal snapshots, with
zero below-threshold pairs or misstated minima. These are preservation checks,
not newly corrected findings or provider/cache accuracy measurements.

The [artifact receipt](https://github.com/antonsoo/contextscope/blob/e835a2fb626d6d5b513f7569ce0a07c9d20e4e1f/studies/duplicate-scaling/results/verification.json)
records a clean archive of implementation `b8383d4`, locked installation, lint,
both type checks, 524 tests and production builds. All 444 tracked entries still
match that commit. Fresh installs on Node 20.0.0 and 24.21.0 each preserve all 94
compiled files, six complete CLI reports, 240 reference partitions and the large
mixed-history benchmark output. The 98,387-byte tarball has SHA-256
`23dcc5007e689d3cbaf5654c1e1357beea0bd11444e5baed5848a86d2f01b7d7`.
The receipt also records harness corrections for Firefox font warming, npm 12's
JSON shape and symbolic-link comparison; none changed the application artifact.

## Limits

The index uses extra memory: process peak RSS for the 2,000-distinct-block case
rose from 426,952 to 618,164 KiB. Those figures include imports, inputs, parsing
and three repetitions with normal garbage collection, not isolated live index
memory. Dense candidates still need pairwise checks; there is no general
linear-time or universal speedup claim. Similar text is still evidence to
inspect, not proof that content is removable. Hosted and registry consumers
do not receive this source change until a separate deployment or release.
