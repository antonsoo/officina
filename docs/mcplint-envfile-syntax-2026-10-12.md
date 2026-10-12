# mcplint: valid environment files must launch correctly

Source is pushed to
[`160cd9bae63649970c308af9f2d3b0c40d27b0f2`](https://github.com/antonsoo/mcplint/commit/160cd9bae63649970c308af9f2d3b0c40d27b0f2).
Package version 0.3.3, release tags and the hosted demo are unchanged.

On baseline `a3012df766f87b5ee753fca93249cba0458bc47d`, an environment file
containing `TOKEN="synthetic-token" # fixture account` passed the quotes and
comment into the child token. A local authentication fixture rejected it,
leaving an incomplete audit and exit 1. The corrected launch passes the
intended value, collects the fixture's tool and exits 0.

| Check | Before | Corrected |
| --- | ---: | ---: |
| Parsed maps matching VS Code's pinned parser | 6/18 | 18/18 |
| Actual CLI launches with the expected child values | 6/18 | 18/18 |

The correction handles comments outside matching quotes, preserves quoted
hashes, recognizes single/double/backtick quoting, decodes supported newline
escapes in double quotes, and accepts colon separators and CR-only lines.
Explicit environment overrides and null removals still take priority.
Values are not shell-evaluated or interpolated.

The [study](https://github.com/antonsoo/mcplint/blob/160cd9bae63649970c308af9f2d3b0c40d27b0f2/studies/envfile-syntax/README.md)
retains exact input strings, actual child observations, authentication outcomes
and a terminal capture. Its oracle fetches, hashes and executes Microsoft's
MIT-licensed VS Code parser at a pinned commit. All literal fixture
expectations agree with that independent implementation. Every token and
server in the launch replay is synthetic; no external account is accessed.

A clean archive of production commit `e40da14e97471a0fa9ed8737c891ab93b3d49ff6`
passed installation, lint, typecheck, 483 tests in 40 files, CLI/site builds and
28 Chromium/Firefox report workflows. The screenshot was visually inspected.
The offline installed package passes all 18 cases on Node 20.0.0 and 24.21.0,
with identical case records. All 36 earlier environment-removal cases remain
correct and their complete replay record is unchanged.

All 104 installed package files match the tarball, and 100 source, test and
selected configuration/fixture inputs match the clean archive. The tarball is
106,103 bytes with SHA-256
`75ff49b06a1f209130147e0948f30ba2e4811ad111090e620bac3994418878f0`.
The locked build uses MCP SDK 1.31.0; the offline package installation resolves
compatible SDK 1.32.1. Process executions were verified on Linux/WSL2.

The grammar is line-oriented: physically multiline quoted values are not
implemented, although escaped newlines in double quotes work. This is not a
claim of compatibility with every dotenv library or client launcher.

The [public receipt](evidence/mcplint-envfile-syntax-2026-10-12.json) verifies
clean local source, exact remote main equality and all 18 changed files fetched
from pinned raw URLs: 493,645 bytes match. Tags and `gh-pages` were compared
before and after and remain unchanged. No release or deployment was performed.

```text
160cd9b docs: retain installed envFile syntax and reference evidence [skip ci]
e40da14 fix: parse envFile comments and quoted values for configured servers [skip ci]
```

Tracking: `officina-c8nw`.
