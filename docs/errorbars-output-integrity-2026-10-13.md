# Errorbars: file exports preserve the evidence they analyze

Source commit
[`f4dd23faf62c06cfbe04b03a6bd565de4b15bc17`](https://github.com/antonsoo/errorbars/commit/f4dd23faf62c06cfbe04b03a6bd565de4b15bc17)
was pushed to `main` and verified against the remote branch. All 19 changed
files, totaling 328,991 bytes, matched their pinned public raw URLs.
The [publication receipt](evidence/errorbars-output-integrity-2026-10-13-public.json)
records their SHA-256 values and sizes. Tags and `gh-pages` remained unchanged.
No package or hosted build was published; the source version remains 0.2.4.

## What changed

CSV import and SVG export wrote directly to their destination. Passing an input
path as the output could therefore destroy the log or score table after reading
it, while the command still exited successfully. HTML already used atomic
replacement, but an input symlink pointing to its destination allowed the same
source loss. Inferred-model metadata could also be overwritten by an import.

All three CLI routes now protect the loaded inputs and the matching lm-eval
results sidecar used for model identity. They reject input aliases, symbolic-link
destinations and nonregular destinations. A private sibling file is fully written,
flushed and synchronized before replacement; failed writes preserve an earlier
export and remove the temporary file.

The [retained executable study](https://github.com/antonsoo/errorbars/blob/f4dd23faf62c06cfbe04b03a6bd565de4b15bc17/studies/output-integrity/README.md)
copies an existing synthetic score table and retained native lm-eval COPA log
into disposable directories. The path layouts and model sidecar are controlled
test data, not claimed production incidents.

| Reproduction | Before | After |
| --- | --- | --- |
| Plot output equals input CSV | Score table becomes SVG; exit 0 | Refused; input unchanged |
| Import output equals native log | Native log becomes canonical CSV; exit 0 | Refused; log unchanged |
| Input CSV links to HTML destination | Underlying input becomes HTML; exit 0 | Refused; file and link unchanged |
| CSV/SVG write interrupted at 1,024 bytes | Prior export replaced by partial bytes | Prior export preserved |
| Full executable replay | 14/36 intended outcomes | 36/36 intended outcomes |

The partial-write reproduction uses the operating system's file-size limit,
not a mocked writer. HTML's existing interrupted-write protection is retained
as a control. Eleven previously successful export controls remain byte-identical;
a full-length HTML filename that previously failed now succeeds. The FIFO case
now returns an error rather than waiting for a reader.

## Verification and limits

- A fresh archive of implementation `4633de1` preserved all 459 tracked files.
  Python 3.12.12 completed locked installation with optional development
  dependencies, ruff, mypy, all 676 Python checks and the sdist/wheel build.
- The wheel was installed separately on Python 3.10.21 with NumPy 1.24.0 and
  Python 3.14.7 with NumPy 2.5.4. Both minimal installations passed all 36 replay
  cases, matching the corrected source's filesystem outcomes and export hashes.
  All 27 packaged source and asset files matched the clean build in both.
- Installed entry points also completed the version and documented power-planning
  command. Native Inspect coverage was part of the full source suite, not the
  minimal wheel environments. Report templates, browser source and styles did
  not change; export-byte comparisons establish preservation of their output.

The [artifact receipt](https://github.com/antonsoo/errorbars/blob/f4dd23faf62c06cfbe04b03a6bd565de4b15bc17/studies/output-integrity/verification.json)
records the 180,869-byte wheel, built from the source distribution, with SHA-256
`fc5c7bfc97433d8aa895ff50607f71d71048536a4db6b4b95018341810fbd258`.
These checks establish local package behavior and published source, not a PyPI
release or hosted-demo change.

New and replaced outputs are private on POSIX (mode 0600). Ordinary destinations
are still replaced after successful export; unknown unrelated source files cannot
be identified automatically. Direct Python HTML writers accept explicit protected
paths because a comparison review retains only display basenames. Relative paths
use the caller's current working directory. The writer does not lock concurrent
writers or guarantee durability after whole-machine power loss.
