# Trainspotter: deliver watch events while the process is running

Source [`7eebb62fb8017a3a79c2841130a6e0e75ff87baf`](https://github.com/antonsoo/trainspotter/commit/7eebb62fb8017a3a79c2841130a6e0e75ff87baf)
is pushed and verified against remote `main`. All 11 changed
files (174,548 bytes) match their pinned public raw URLs. The
[publication receipt](evidence/trainspotter-live-stdout-2026-10-13-public.json)
retains sizes and hashes. Tags and `gh-pages` are unchanged. No package release
or hosted deployment accompanied this source repair; the version remains 0.2.6.

At baseline `1965b98`, a five-row synthetic loss log containing NaN produced no
readable pipe bytes during a ten-second observation. Ctrl-C then released the
startup message and already-computed error together. This hid live alerts from
piped readers and redirected logs.

Watch now explicitly flushes each event. It records a completed poll's gate
status before delivering findings, and a failed read's status before delivering
its retry notice. An immediate interrupt therefore returns the corresponding
status instead of the preceding one. Detector logic and report formats are
unchanged.

The [executable study](https://github.com/antonsoo/trainspotter/blob/7eebb62fb8017a3a79c2841130a6e0e75ff87baf/studies/live-stdout/README.md) observes actual child processes through
ordinary pipes and redirected files, without unbuffering flags or pseudo-terminals.
It covers missing and malformed files, recovery, extending-finding deduplication,
rewritten history, selected-run announcements, Unicode paths and interruption. All nine
completed-command controls retain the baseline stdout, stderr and exit codes.

The [artifact receipt](https://github.com/antonsoo/trainspotter/blob/7eebb62fb8017a3a79c2841130a6e0e75ff87baf/studies/live-stdout/verification.json) records a clean archive of
implementation `d11b1a1`, locked installation, lint, types and 657 passing tests.
Fresh Python 3.10.21 / NumPy 1.24.0 and Python 3.14.7 / NumPy 2.5.4 installs each
pass the complete process replay, match all 29 package files and preserve the
nine controls. Their console entry points match the isolated module CLI.
Only `trainspotter/cli.py` differs among runtime files.

The 118,221-byte wheel rebuilt from the source distribution is byte-identical
to the first wheel, SHA-256
`5ce7bdfcac72844e6de2bd96b39e141871d1b2bf015f41b704cbe397e92f5fcb`.
Two incomplete harness attempts and their revised observation budgets are
recorded separately. Flushing removes Trainspotter's own buffering; elapsed
observations include startup and host contention, and do not promise a delivery
latency, downstream buffering behavior, file durability or Windows signal behavior.
