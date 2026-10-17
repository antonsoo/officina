# Flakemap: preserve the fixture's type arguments

NUnit's native TRX records distinguish `Pair<Int32,String>` from
`Pair<Int32,Double>`. The former reader cut each class name at the first comma,
merging both into `Pair<Int32`. In a combined run this excluded the pair as
ambiguous; across 12 selected runs it invented one 50% flaky test from a fixture
that always passed and another that always failed.

The correction removes an assembly qualifier only outside generic/array
brackets and escaped characters. Both native identities retain their six
executions. Genuine duplicate identities remain unknown; classifier formulas
and rate definitions are unchanged. Thirteen actual compiled NUnit reports
contain 16 controlled executions, including ordinary and one-argument fixtures.
They are authored fixed outcomes, not production reliability measurements.

[Native capture, before/after CLI reports and bounded grammar controls](https://github.com/antonsoo/flakemap/tree/main/studies/trx-generics)
retain the proof. Complete JSON for ten existing captured histories and their
62 test identities stays unchanged. The clean `401dc15` archive passes 412
checks, lint/format/type checking, wheel/sdist builds and all 136 browser
scenarios across eight engine/width/theme contexts. A terminated long browser
attempt is recorded separately and was not accepted as a pass. The minimum
Python 3.10.21/Rich 13.7.0 environment also passes 412 checks.

Installed wheels reproduce both native cases and the unchanged histories;
all 30 runtime modules match clean source bytes. The README's pinned source
installation was executed with pip in a fresh environment. The separately
downloaded PyPI 0.3.7 wheel still has the old first-comma parser; no release
or version bump is claimed.

Source `401dc15` and Pages `43f6522` publish the verified six-page gallery.
All 12 built files and the canonical root match public HTTP bytes. Twenty-four
public browser views exercise offline disclosures and 20 complete JSON
downloads. Four actual native-input ZIP downloads retain the 12 original TRX
files; an independently installed wheel reproduces the complete displayed JSON.
All 12 public screenshots match the reviewed local captures exactly.
[Publication receipts and separate workbench boundary](https://github.com/antonsoo/flakemap/blob/main/studies/trx-generics/publication.json).
