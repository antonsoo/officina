# Ghostchars: preserve the selected scan and repair directory

Source [`14a9f46`](https://github.com/antonsoo/ghostchars/commit/14a9f46ab5a57a5bf9f5848e3b5ac2916928e122)
corrects Git-backed directory enumeration. The CLI first resolved a real
directory, then passed its name to Git as a pattern. A quoted `docs*` directory
also selected `docs-old`; `--fix` modified its files. Leading-colon names could
select a sibling instead, exclude paths or report zero scanned files as clean.

Enumeration now uses literal Git pathspecs and overrides conflicting inherited
pathspec modes for that child process. Git ignore policies, tracked/untracked
selection, Unicode rules and repair staging remain in effect.

| Actual CLI result on constructed repositories | Before | After |
| --- | ---: | ---: |
| Correct scope, reports and exact repaired bytes | 10 / 34 | 34 / 34 |
| False-clean scan exits | 2 | 0 |
| Repair runs modifying an unrelated file | 10 | 0 |

The [retained study](https://github.com/antonsoo/ghostchars/blob/14a9f46ab5a57a5bf9f5848e3b5ac2916928e122/studies/literal-directories/README.md)
includes full normalized reports and hashes of selected, ignored and unrelated
files. Seventeen synthetic repositories are each scanned and repaired, including
tracked and untracked inputs, nested wildcard spellings, leading-colon modes and
inherited Git settings. This is a regression experiment on case-sensitive WSL2
Linux with Git 2.43.0, not a claim about prevalence or every filesystem.

A clean archive of implementation `f64c533` passed a fresh installation, lint,
type checking, 261 tests in 21 files, library/CLI builds and the benchmark smoke
command. All 316 tracked files remained byte-identical after the checks. The
168,688-byte local npm tarball was installed separately with scripts disabled;
all 53 installed runtime files match the clean build. The actual installed CLI
reproduced every report, file hash and exit code on Node 20.0.0 and 24.21.0.
Installed version/reveal and library scan/sanitize examples also passed.

The [artifact receipt](https://github.com/antonsoo/ghostchars/blob/14a9f46ab5a57a5bf9f5848e3b5ac2916928e122/studies/literal-directories/results/verification.json)
records tarball SHA-256
`b3cb6d298ec78758587b2ba24eb8f867f8724c31d480e7186f302f5103064089`.
An ordinary before/after scan of 48 source and workflow files produced identical
normalized reports. The terminal screenshot was inspected. Browser runtime code
is unchanged; this batch does not claim new browser validation.

The [public-source receipt](evidence/ghostchars-literal-directories-2026-10-12.json)
checks clean local/remote main equality and all 14 changed files (1,034,141 bytes)
against pinned public source. Package version remains 0.1.5. Tags and `gh-pages`
are unchanged; no registry release or hosted deployment occurred.

Shell expansion still occurs before the CLI receives its arguments; special
literal names need quoting. The Action retains its existing space-separated
shell handling. The change does not provide a filesystem sandbox against
concurrent edits or alter existing scan exclusions and repair limitations.
