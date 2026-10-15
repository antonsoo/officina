# Retain partial results and make long traces inspectable

Errorbars no longer discards a complete leaderboard when one run lacks enough
independent observations for an interval. TraceLens preserves ambiguous retry
evidence and partial token coverage, decodes large message histories once, and
keeps selected span details reachable on phones. Both source updates are public;
the TraceLens browser build is also deployed and verified.

| Project | Public source | Browser deployment | Registry |
|---|---|---|---|
| Errorbars | [`d76cadd`](https://github.com/antonsoo/errorbars/commit/d76caddc115c2e30a09b71553e1f786566e36510) | No change by this work | No release |
| TraceLens | [`5846310`](https://github.com/antonsoo/tracelens/commit/5846310a9052c82b7f3b521c0a349488fa6341c3) | Application `0c51954`, Pages [`2f11ff2`](https://github.com/antonsoo/tracelens/commit/2f11ff24d12425ea6218d89bfd5874844f47c69f) | No release; npm stays at 0.3.3 |

## Partial evaluation cohorts

The [Errorbars reproduction](https://github.com/antonsoo/errorbars/blob/d76caddc115c2e30a09b71553e1f786566e36510/studies/insufficient-cohorts/README.md)
adds a constructed Django-only subset to two retained SWE-bench submissions.
Its 231 tasks belong to one repository cluster; the two complete submissions
each cover 500 tasks and 12 clusters. Previously the whole command failed,
discarding the complete submissions' intervals and paired test as well.

The report now keeps the subset's observed mean and counts, explicitly withholds
its interval, and marks its pairs untested. The complete runs' estimates and
paired comparison remain unchanged. Single-question continuous scores and
repeated generations of one question also stay descriptive. A single independent
binary observation retains its existing Wilson interval. Unequal cohorts do not
establish a model ranking, and an untested pair does not establish equivalence.

The Python entry's `se`, `ci_low` and `ci_high` can now be `None`/JSON `null`;
callers must handle that state. Terminal, SVG and Matplotlib exports visibly
distinguish descriptive means without inventing interval bars or IID substitutes.

A fresh archive passes Ruff, strict mypy, 722 Python tests, wheel/sdist builds,
and the unchanged web app's lint, types, 691 tests and build. Separately installed
wheels on Python 3.10.21/NumPy 1.24.0 and Python 3.14.7/NumPy 2.5.3 reproduce all
five CLI scenarios with exact source-output and SVG equality. All 27 packaged
source/resource files match. Actual SVG exports render offline in Chromium and
Firefox; the terminal, SVG and Matplotlib captures were inspected.

## Trace inspection

The [TraceLens verification](https://github.com/antonsoo/tracelens/blob/5846310a9052c82b7f3b521c0a349488fa6341c3/docs/verification-inspection-2026-10-14.md)
links the independent captures, measurements and downloads for each repair:

| Reproduced behavior | Result and scope |
|---|---|
| Reordering unchanged, equally timed ERROR/OK tool peers changed possible retries from 0 to 1 | Evaluate equal-start batches together; the conflicting predecessor remains unknown. Native SDK outcomes use an explicitly synthetic supplied schedule. |
| Clamping an end-before-start failure implied known completion and discarded its supplied end | Withhold that completion claim and retain `originalEndTimeUnixNano` in span downloads. Valid zero-duration and overlapping-call controls retain their meaning. |
| Skipping a call changed 175/26 tokens into an apparently complete 104/12 | Full totals stay unknown; the retained 104/12 subtotal remains visible. Complete-to-partial-to-complete imports recover correctly. |
| Large message JSON was decoded repeatedly | Two controlled synthetic OTLP imports take 28-59% less core import time across Node 20/26; all retained fixture and workload outputs agree. This is not a general latency or memory claim. |
| A 6,000-span trace placed phone details about 150,206 pixels below the timeline | At 375 by 800, details are 480 pixels from its start. The timing track grows from 34 to 168.75 pixels; all rows, keyboard End navigation, zoom state and downloads remain available. |

The README leads with practical inspection workflows, with repair narratives in
a linked source-history index. A fresh archive passes lint, strict types, all
482 unit tests with the original timing limits, both builds, 32 CLI checks, the
custom waterfall audit and all 142 browser scenarios. Its 805 tracked files
remain unchanged during verification. A separately installed local tarball
matches all 33 shipped files; both the replay drivers and CLI subprocesses run
on actual Node 20.0.0 and 26.7.0 binaries. The replays retain six retry
permutations, six completion controls, 185 cost workflows, 54 fixture outcomes
and two complete large-input output hashes on each runtime.

The existing Pages branch advanced without rewriting its history. All 34
current-build files match public HTTP bytes; two previous hashed assets remain
available for cached HTML. Eight public browser contexts cover both engines,
themes and desktop/phone widths. They compare actual links/cost/timing exports
with the CLI and perform 48 further local-file imports offline, preserving
unknown states, source evidence and last-span access. Fresh-context first-offline
imports are separately covered by the clean suite and studies. All 16 public
screenshots were inspected. No page errors, external requests, CSP violations,
document overflow or HTTP requests during those local imports occurred.

The [public-source receipt](evidence/inspection-and-cohorts-2026-10-15.json)
checks clean local worktrees, equality with remote `main`, and every changed file
against revision-pinned public bytes. Its deployment record retains the complete
served-file comparison separately. Earlier evidence receipts describe their
capture-time publication state; these newer checks establish the later source
pushes and TraceLens deployment. No registry release, version tag or remote-CI
completion is claimed.
