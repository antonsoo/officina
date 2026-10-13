# Errorbars: select a named Inspect score and preserve its meaning

Source commit [`8d13a98`](https://github.com/antonsoo/errorbars/commit/8d13a98fbbd9c341cbd6ef46854bf0a69d43e634)
adds `--score-key` to import, summary, comparison and leaderboard commands.
Inspect scorers can return several named values per response. Previously,
Errorbars rejected these logs even when the scoring function was selected.
The new option selects one exact top-level value on every sample and carries
that choice through canonical exports, terminal/JSON output and offline reports.

The [retained experiment](https://github.com/antonsoo/errorbars/blob/8d13a98fbbd9c341cbd6ef46854bf0a69d43e634/examples/inspect-values/README.md)
contains unedited logs captured through Inspect AI's actual mock provider and
scorer machinery. A scorer records three values for each response: exact-answer
correctness, a two-word brevity check and word count. These are synthetic
arithmetic questions with controlled responses, not a model-quality evaluation.
The 96 recorded observations include a two-epoch run.

| Selected value | A mean | B mean | A minus B | Independent inference |
| --- | ---: | ---: | ---: | --- |
| `correct` | 1/3 | 2/3 | -1/3 | Exact McNemar, p = 0.0078125 |
| `concise` | 1/3 | 1 | -2/3 | Exact McNemar, p = 0.000030517578125 |
| `words` | 3 | 1 | 2 | Paired t, p = 0.0000006444485482 |

The replay independently grades each recorded response and checks inference
against SciPy. Canonical CSV preserves the selected value in `scorer_value`.
Combining A's correctness with B's brevity blocks inference on all 24 questions,
including after CSV round-trip. Repeated epochs retain 48 observations and
24 equally weighted questions. Missing keys or invalid selected grades reject
the whole import; another dimension is never guessed or substituted.

Sixteen actual offline workflows cover four reports in Chromium and Firefox
at desktop/dark and 375px/light. Keyboard inspection shows the selected value
beside each original score. All 32 JSON/CSV downloads preserve the appropriate
selection after filtering; complete JSON retains the whole comparison.
Four screenshots were inspected. The checked state had no axe violations,
page overflow, page errors, external requests or CSP violations.

The [artifact receipt](https://github.com/antonsoo/errorbars/blob/8d13a98fbbd9c341cbd6ef46854bf0a69d43e634/examples/inspect-values/evidence/verification.json)
records fresh Python/web installs, lint, types and builds, plus 666 Python,
691 calculator and 52 web browser checks. All 452 tracked implementation files
remained unchanged. A separately built wheel was installed with Python 3.10.21 /
Inspect 0.3.268 and Python 3.12.12 / Inspect 0.3.279. Both reproduced the selected
vectors, 12 CLI workflows, epoch counts and conflict refusals; all four generated
HTML files matched the offline-browser artifacts byte for byte. A bare wheel
installation passed 30 standalone report browser checks without Inspect installed.
All 26 installed package files matched the clean source.

This selection does not establish equal scoring code, external grader state or
score units. Missing matching per-value parameter metadata remains unchecked.
Keys are exact nonblank strings, not nested paths. Older Errorbars versions do
not enforce the new canonical `scorer_value` declaration.

The [public-source receipt](evidence/errorbars-inspect-values-2026-10-12.json)
checks clean local/remote main equality and all 31 changed public files
(1,847,829 bytes) against the checkout. Package version remains 0.2.4.
Tags and `gh-pages` are unchanged; no registry release or hosted deployment occurred.
