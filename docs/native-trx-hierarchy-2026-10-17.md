# A passed parent can contain a recorded failed row

Flakemap's [native hierarchy study](https://github.com/antonsoo/flakemap/tree/cbfe07055ef396c8554abc6b0a3bbb4c29ea260c/studies/trx-hierarchy)
retains a well-formed TRX file with a `Passed` parent, a `Failed` inner row,
a failed run summary and matching primary counters. The previous source kept
one passing parent, dropped the child's name/message, and returned 0 with
`--fail-on-incomplete`. Counting all records correctly did not establish a
consistent aggregate outcome.

The source now retains child paths, names, reported outcomes, durations and
messages as parent evidence. A known failed child under a reported passed or
skipped parent makes that observation unknown and the completeness gate exits 2.
Children do not become independent statistical trials or extra retries.

| Native declaration | Previous parent | Current parent | Gate before / after |
| --- | --- | --- | --- |
| Passed parent with failed child | Pass | Unknown | 0 / 2 |
| Skipped parent with failed child | Skip | Unknown | 0 / 2 |
| Five consistent controls | Unchanged | Unchanged | 0 / 0 |

These are actual .NET SDK 8.0.425 / VSTest 17.11.1 logger captures of controlled
public `TestResult` events. They are not application test runs, adapter evidence,
production incidence estimates or a claim of a VSTest defect. An attempted
grandchild event family also records a useful writer boundary: the SDK emitted
those events as top-level results without their parent links. Flakemap preserves
the recorded structure instead of inventing a deeper hierarchy.

An independent XML oracle checks all seven native counter profiles and retained
child paths. The five consistent analyses stay byte-identical; all 21 previous
TRX counter replays, including twelve actual MSTest reports, retain their results.
The study also records the cost of preserving 10,000 authored child records:
about 5.6 KB of JSON becomes 3.5 MB, with the parent still counted only once.
That is an input/output retention experiment, not 10,000 executed tests.

Visual review found a second, small defect: cancellation left a tiny positive
Wilson lower endpoint for a zero-failure rate, excluding its own point estimate.
The analytic endpoints are now exactly zero for 0/n and one for n/n. A separate
74-case SciPy comparison records ten containment violations before and none
after, with maximum reference error about 1.1e-16. Interior precision is retained.

The [publication receipts](https://github.com/antonsoo/flakemap/tree/cbfe07055ef396c8554abc6b0a3bbb4c29ea260c/studies/trx-hierarchy/results)
separate the verified stages:

| Stage | Verified result |
| --- | --- |
| Clean source | 402 checks pass on Python 3.14.7 and minimum Python 3.10.21 / Rich 13.7.0 |
| Built wheel and sdist | All 30 package files match; both fresh installed CLIs reproduce all seven analyses |
| Public Git upgrade | Actual pip upgrade from PyPI 0.3.7 to the documented pinned source; all 30 files and seven analyses match |
| Standalone reports | 112 existing offline browser scenarios plus 56 installed native views; captures inspected |
| Existing hosted gallery | All nine canonical files match; 20 actual hosted views retain offline disclosures/downloads and inspected captures |
| Registry | Version 0.3.7 unchanged; no new release or tag |

The [live gallery](https://antonsoo.github.io/flakemap/) shows the exact zero
endpoint and removes duplicate exclusion warnings. It contains precomputed
examples, including the existing real Kubernetes history; it does not execute
the native TRX processor. The catalogue's Flakemap card keeps its independent
91-day Kubernetes study. This additional source-history record changes no
catalogue data or built website assets and requires no Officina redeployment.
