# Whitespace repair keeps the failing check, 2026-10-14

Ghostchars CLI `--fix` deleted unusual whitespace rather than following its
replacement suggestion. At baseline `fd7b137`, NBSP between `return` and
`false` became the identifier `returnfalse` and raised a native reference error.
Deleting U+2028 or U+2029 after a JavaScript line comment removed its terminator:
a synthetic `process.exitCode = 7` check became a comment and exited 0.

Code `26e1ab1` uses an explicit normalization policy for CLI repair. Unusual
spaces become ASCII spaces; NEL and Unicode line/paragraph separators become
LF. Other permitted findings retain their existing removal behavior. Rules,
allowlisted scalars and actual-source previews still apply through rescans.
The library's default/explicit removal and keep contracts remain available.
The browser's existing sanitizer still uses default removal; no new browser
mode or layout was authored.

| Verification | Retained result |
| --- | --- |
| Native Node/actual CLI replay | 21 CLI cases and four library controls; baseline 18 disagreements, corrected zero |
| Reproduced native behavior changes | 15 whitespace token joins and two erased comment boundaries; the eighteenth disagreement is the newly added normalization policy |
| Installed package on Node 26.7.0 and 20.20.2 | All 25 workflows pass on each runtime |
| Fresh archive | Lint, type checks, 304 unit checks, library/CLI/web builds, 36 Chromium/Firefox checks including offline and 375px accessibility/gallery workflows |
| Artifact identity | Committed CLI matches clean rebuild; 57 packed files match clean build and installation; 44 runtime sources match archive; 32 served files match tested web build |
| Visual review | Six browser-generated captures and the installed CLI terminal capture inspected |
| Synthetic scaling | Installed normalization of 100,000 flagged spaces in 1.2 MB took 251 ms with exact output; separate source run 325 ms |

The [study](https://github.com/antonsoo/ghostchars/blob/d99bc72/studies/whitespace-repair/README.md)
retains real CLI previews/reports, original and repaired native executions,
installed results, hashes, clean-check logs, timing population/machine details
and the terminal screenshot. Timings are single runs on 14-logical-CPU WSL2
Linux, not a general performance bound.

The owner authorized the source push. Commit `d99bc72` matched remote `main`
at verification, and twelve pinned public files were fetched back and
byte-compared with the clean checkout. The
[source receipt](evidence/ghostchars-whitespace-repair-2026-10-14.json) records
the full commit, URLs, sizes and SHA-256 hashes. Issue `officina-7xji` is closed.
The packed version 0.1.5 artifact is a local build, **not an npm release**.
The existing demo build is `npm run web:build` to `web/dist/`; it was not
deployed here.

This is textual normalization, not a language parser or a trust decision.
Changing string data or language-specific whitespace can change meaning, and
NEL is not an ECMAScript line terminator. Review previews before applying
repairs; preservation of these measured boundaries is not a general semantic
safety guarantee.
