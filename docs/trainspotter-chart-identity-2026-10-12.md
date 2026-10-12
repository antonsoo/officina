# Trainspotter: preserve chart run and metric identities

A synthetic W&B chart with `runA - train - loss` and `runA - eval - loss`
previously became two apparent runs. The default import discarded evaluation
loss and missed the overfitting pattern. Selecting the apparent evaluation run
then relabeled its values as training loss. Taking the first separator would
instead merge genuinely separate runs under another valid interpretation of
the same labels.

Source commit
[`b91e658`](https://github.com/antonsoo/trainspotter/commit/b91e658)
rejects ambiguous labels with recovery instructions. `--chart-single-run NAME`
lets the caller declare that the entire chart belongs to one exact run display
name, preserving the remaining metric keys. Both 50-point curves and the
overfitting finding then match the separate history-file control. Reports retain
the declaration and original labels; watch holds the declaration across reloads
and rejects a newly added foreign run.

This is an explicit input-layout assertion. Shared prefixes cannot prove run
ownership. Multi-run charts with separator-containing run names that relied on
the old heuristic now need a different export. W&B recommends conventional
metric naming, and these synthetic fixtures do not establish hosted exporter
support for arbitrary names. Chart sampling and smoothing remain outside this
fix.

The [study](https://github.com/antonsoo/trainspotter/blob/b91e658/studies/chart-identity/README.md)
retains the two input files, before/after CLI output, artifact hashes and four
inspected screenshots. Sixteen dedicated offline browser checks verify the
result and source labels at desktop and 375px. A fresh source archive passes
lint/type checks, 629 Python tests and 208 Chromium/Firefox report workflows,
including 320px mobile. Installed wheels on Python 3.10.21 with minimum NumPy
1.24.0 and Python 3.14.7 reproduce all four chart reports and watch outputs.
All 29 package files match the source.

The [public-source receipt](evidence/trainspotter-chart-identity-2026-10-12.json)
verifies local/remote main equality and every changed public file. Package
version 0.2.6, tags and the hosted demo are unchanged. No registry release or
deployment was performed.
