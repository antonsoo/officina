# Native Inspect reducers preserve the evaluation being compared

Errorbars now reads Inspect's retained per-question epoch reductions. A native
max-score comparison that Inspect reported as 1.00 versus 0.75 previously
became 0.33 versus 0.75 in Errorbars, reversing its ranking. The correction
imports the recorded scores; a log containing several reducers requires an
explicit `--inspect-reducer` choice. Mean imports retain their individual epochs.

The reproduction uses 18 actual Inspect 0.3.268 runs with authored questions
and scripted answers, without model calls. Closed-form outcomes, independent
SciPy tests, canonical CSV round trips and actual CLI reports retain the
boundary. Reducer and attempt-count labels survive normalized exports and
source inspection. Missing reduced questions cannot become a smaller cohort.

[Retained inputs, source and limits](https://github.com/antonsoo/errorbars/tree/main/studies/inspect-reducers)
include the original wrong result, the repaired max comparison (exact McNemar
p = 0.03125), and the distinct pass-at-2 result (paired-t p = 0.3656106416).
The latter uses fractional question scores; neither case counts the three
attempts as three independent questions.

Verification includes a clean source archive, wheel/sdist, 30 identical installed
runtime files, full Python checks on 3.14.7 and the installed wheel on 3.10.21,
693 calculator checks and 94 actual application/standalone-report browser cases.
Twenty additional native report workflows in Chromium/Firefox at desktop/phone
widths exercised 40 real JSON/CSV downloads offline. The other 24 retained Inspect
logs preserve their outcomes; all 16 accepted canonical CSVs are byte-identical.

A further 18 native runs from Inspect 0.3.281 were checked by both tested SDK
readers: 22 selected views and 528 question values per reader match the authored
closed forms. A fresh public pip upgrade replaced registry 0.2.4 with source
`70c12fefa85f137ae82035beec0b350c425b932d`; all 30 runtime files match. All 62
checked public source/input files match that revision. Documentation/evidence
head `ea67247e6a6f62a9613b7b48134cf210b921b551` was also pushed and checked.

This is a source and installed-workflow improvement. No registry release, tag,
hosted calculator rebuild or Hugging Face deployment was made. Recorded reducer
names do not recover unrecorded code, parameters or closures; corpus-level
custom metrics remain outside this arithmetic-question-mean analysis.
