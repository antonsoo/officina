# Ghostchars: write Action reports without erasing inputs

Source [`fd7b137`](https://github.com/antonsoo/ghostchars/commit/fd7b1374a60aef0c1d05be06704b767345c9849c)
replaces the Action's pre-scan shell redirection with the CLI's new `--output`
writer. Previously, an output path naming a source file truncated it before the
scanner started. The Action then returned exit 0 and overwrote the source with
a clean report. Hard-link and symbolic-link aliases behaved the same way.

The writer checks input/configuration identities before scanning or repairing,
stages and flushes the completed report, rechecks identities, then replaces the
destination. It protects selected and skipped inputs and refuses symbolic or
non-regular output files. Reports inside a selected directory must be ignored
or moved outside the scan; the SARIF workflow now uses the runner's temporary
directory. Source `--fix` metadata rules are unchanged.

| Actual local Action-body replay | Before | After |
| --- | --- | --- |
| Source/configuration changed by output | 12 cases | 0 cases |
| Exit 0 after overwriting a source | 9 cases | 0 cases |
| Invalid configuration with an earlier report | Report becomes empty | All previous bytes retained |
| Kernel 2 KiB write limit, existing report | 12,800 bytes become 2,048 | All 12,800 bytes retained; exit 2 |
| Same limit, new report | Partial 2,048-byte file | No report or staging file left; exit 2 |
| Ten ordinary report-delivery controls | Pass | Pass; normalized report matches direct stdout |

The [26-case study](https://github.com/antonsoo/ghostchars/blob/fd7b1374a60aef0c1d05be06704b767345c9849c/studies/action-reports/README.md)
retains hashes, reports, errors, independent source-byte checks and a replay of
the actual composite Bash body. Inputs are synthetic Linux files. The write
limit is a real child-process `RLIMIT_FSIZE`, not a mock or power-loss test.
All 26 corrected cases pass. This is local execution, not a hosted GitHub
Actions result.

A fresh implementation archive passed installation, lint, type checking,
284 tests in 22 files, library/CLI builds, benchmark smoke and packaging.
All 327 tracked files retained their exact bytes. The 170,374-byte local npm
tarball was installed separately with scripts disabled; all 53 installed runtime
files match the clean build. On Node 20.0.0 and 24.21.0, all 26 Action replays
have matching integrity/exit verdicts and protected-file hashes, with every
ordinary delivery checked against that installed CLI's stdout report.
The earlier 34 literal-directory replays still pass on the installed Node 20
CLI. Installed version/reveal and library scan/sanitize examples also pass.

The actual Action self-test job's shell assertions passed locally against the
clean archive on Node 20: the source scan exits 0, a complete SARIF report with
findings exits 1, and the input/output collision exits 2 with an unchanged input.
The terminal screenshot was inspected. Browser runtime code is unchanged.

The [artifact receipt](https://github.com/antonsoo/ghostchars/blob/fd7b1374a60aef0c1d05be06704b767345c9849c/studies/action-reports/results/verification.json)
records package SHA-256
`9006d29a3e1181f4c0989515933501366a2779b51a6253d1b522ee21ace40f3e`.
The [public-source receipt](evidence/ghostchars-action-reports-2026-10-12.json)
checks clean local/remote main equality and all 18 changed files (704,707 bytes)
against pinned public source. Package version remains 0.1.5; tags and `gh-pages`
are unchanged. No package release or hosted deployment occurred.

Report replacement uses private POSIX permissions and does not copy old report
metadata. A report-write failure does not undo completed `--fix` repairs. Rechecks
are not a filesystem sandbox; abrupt termination can leave temporary files.
External shell `>` redirection remains outside the CLI's control.
