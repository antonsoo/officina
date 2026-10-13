# Errorbars: keep pairwise results when group enumeration is too large

Source commit
[`1c1600b9f47ab392ef3088a0c8b10a5f394da4d4`](https://github.com/antonsoo/errorbars/commit/1c1600b9f47ab392ef3088a0c8b10a5f394da4d4)
is pushed and verified against remote `main`. All 22 changed files, totaling
218,052 bytes, match their pinned public raw URLs. The
[publication receipt](evidence/errorbars-group-enumeration-2026-10-13-public.json)
retains sizes and hashes. Tags and `gh-pages` are unchanged. There was no
package release or hosted deployment; the package version remains 0.2.4.

## Failure and repair

At baseline `f4dd23f`, a constructed 1,177,625-byte CSV with 50 models and
1,024 binary questions raises `MemoryError` under a 512 MiB Linux address-space
limit before printing any report. Its 1,225 pairwise tests imply 33,554,432
overlapping maximal non-significance groups. The terminal command materialized
those groups even though its table uses exact pairwise rank comparisons.

The source bounds enumeration by 4,096 completed groups and 50,000 search
states. If it cannot finish, Python exposes `groups=None`; JSON exposes
`groups: null`, an explicit `group_status`, both limits and a warning. A list
always contains the complete summary. Every model estimate, paired test, Holm
correction, rank comparison and SVG export remains available. The full graph
can still be reconstructed from pairwise results. This does not approximate
significance or establish equivalence between models.

The [executable study](https://github.com/antonsoo/errorbars/blob/1c1600b9f47ab392ef3088a0c8b10a5f394da4d4/studies/group-enumeration/README.md)
retains the graph proof and exact generated inputs. Each of 25 base/corrected
score pairs differs on 16 answers. Only those 25 comparisons separate after
Holm correction; every cross-pair edge remains. Each maximal group therefore
chooses one member of each pair, giving `2**25` groups. These are authored
scores, not measured model improvements or representative traffic.

## Verification

The repaired clean CLI completes the JSON and terminal/SVG commands under the
same 512 MiB address-space limit, peaking at 75,352 and 75,232 KiB RSS. The
baseline failed at 406,300 KiB RSS. Address space includes mapped memory;
these are single resource observations, not timing or general memory claims.
The [complete JSON](https://github.com/antonsoo/errorbars/blob/1c1600b9f47ab392ef3088a0c8b10a5f394da4d4/studies/group-enumeration/results/large-report.json.gz),
[terminal output](https://github.com/antonsoo/errorbars/blob/1c1600b9f47ab392ef3088a0c8b10a5f394da4d4/studies/group-enumeration/results/large-terminal.txt)
and [SVG](https://github.com/antonsoo/errorbars/blob/1c1600b9f47ab392ef3088a0c8b10a5f394da4d4/studies/group-enumeration/results/large.svg)
are retained. The SVG was rendered and inspected with all 50 labels and the
omission warning present.

All 1,024 five-node graphs agree with independent exhaustive maximal subsets.
The actual CLI checks every raw binary-pair p-value with integer binomial tails
and every Holm-adjusted p-value with rational arithmetic. The 16-model and
24-model controls preserve all 256 and 4,096 groups, including the exact limit.

The retained public leaderboard also preserves every prior report field for
173 usable submissions and 500 questions. Both inference scopes retain 14,878
pairwise tests. All 117 question-level groups and both repository-clustered
groups remain complete. Only the new `group_status` field is excluded from
the complete report hash comparison. This is a replay of pinned public outcomes,
not a new crawl or a fresh accuracy estimate.

The [artifact receipt](https://github.com/antonsoo/errorbars/blob/1c1600b9f47ab392ef3088a0c8b10a5f394da4d4/studies/group-enumeration/results/verification.json)
records a clean archive of implementation `1e2ab7a`, locked installation,
lint, types, 680 tests, sdist and wheel. All 471 tracked entries match that
commit. The 181,716-byte wheel rebuilt from the sdist is byte-identical to the
first wheel, SHA-256
`65c8f4a1932352955471b651093bb1cd9353a9cde1c988b85e9b3f5a3496df0f`.
Fresh Python 3.10.21 / NumPy 1.24.0 and Python 3.14.7 / NumPy 2.5.4 installs
each match all 27 package files and all complete JSON/SVG exports under the
same limits. Enumeration budgets are not whole-program resource guarantees.
