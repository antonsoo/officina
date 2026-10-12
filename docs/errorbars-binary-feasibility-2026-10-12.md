# Errorbars: reject impossible binary evaluation plans

Source at [`211611f`](https://github.com/antonsoo/errorbars/commit/211611faf3bb66ec24688a43b66a27ea3e1a9a8d)
prevents precise sample budgets from being returned for paired binary outcomes
that cannot exist. The earlier planner disclosed this modeling gap in a caveat
but still displayed and exported the numbers as plans.

| Planning assumptions | Before | Repaired behavior |
| --- | --- | --- |
| Baseline .8, improvement .05, correlation 1 | 2 questions | Reject: perfect positive correlation permits no positive binary improvement |
| Baseline .9, improvement .05, correlation .9 | 57 questions | Reject: a joint outcome probability would be negative |
| Baseline .8, 100 questions, correlation 1 | Detectable gap 0 | Reject |
| Baseline .2, 1,000 questions, correlation -.5 | Detectable gap 6.138 points | 30-point minimum, explained as a correlation-imposed bound |
| Baseline .9, 135 questions, correlation .5 | Plausible numeric result plus impossible sensitivity | Keep the valid primary plan; mark correlation-zero sensitivity unavailable |

Forward planning now checks the four-cell Bernoulli interval. Inverse planning
intersects that interval with the detectable effects under the existing normal
approximation. Negative correlation can set a minimum possible gap independent
of budget. Invalid primary plans hide the result and disable export; unavailable
comparison budgets leave gaps in the curve and explicit table entries. Version
2 browser downloads retain the interval, endpoint flags and the reason for an
unavailable sensitivity result.

The [study](https://github.com/antonsoo/errorbars/blob/211611faf3bb66ec24688a43b66a27ea3e1a9a8d/studies/binary-feasibility/README.md)
checks joint cells with 70-digit Decimal arithmetic and enumerates all 6,776
positive-improvement 2x2 tables with totals 5, 10, 20 and 40 and interior
marginals. All forward/inverse table cases pass. A separate 1,781-case grid has
no material classification disagreement; five floating-point boundary differences
are recorded explicitly. There are 15,238 agreeing native Python/TypeScript
calls in each of the source and installed checks. Ninety-five tiny-effect grid
inputs exceed the representable question range and are excluded from numeric
budget parity, with their feasibility checked separately.

A fresh source archive passes Ruff, mypy, 602 Python tests, ESLint, TypeScript,
691 web tests and the production build. Chromium and Firefox pass 48 production
site workflows and 28 standalone report workflows without retries. Isolated
wheel installs on Python 3.10.21 / NumPy 1.24.0 and Python 3.14.7 / NumPy 2.5.4
each pass the 13-case CLI study and replay eight actual browser downloads with
matching counts, effects and feasibility metadata. The 160 tracked inputs,
65 built web files, 11 served assets and 26 installed package files are
byte-checked against the tested source/build.

Before/after browser captures cover both engines at 1440px and 375px. The local
server is physically stopped after loading, before edits and downloads. All
eight screenshots were inspected; the final clean-build screenshots equal the
inspected development captures. There are no post-load HTTP requests, external
requests, page errors, CSP violations, accessibility findings or horizontal
overflow. The [verification record](https://github.com/antonsoo/errorbars/blob/211611faf3bb66ec24688a43b66a27ea3e1a9a8d/docs/verification-binary-feasibility-2026-10-12.md)
links the complete commands, results, downloads and screenshots.

This checks whether paired binary assumptions can exist. It does not establish
that the retained common-variance normal approximation achieves the requested
power, and it does not check continuous or repeated-average joint distributions.
The default valid budget remains unchanged. Package metadata stays at 0.2.4.

The [publication receipt](evidence/errorbars-binary-feasibility-2026-10-12.json)
verifies a clean checkout, local/remote HEAD equality, and fetched bytes for all
80 changed public files (3,130,311 bytes). Source commits use `[skip ci]`;
`gh-pages` and release-tag refs remain unchanged. No package release, tag or
hosted deployment was published.
