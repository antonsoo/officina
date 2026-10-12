# Logdelta: keep recorded text literal in Markdown reports

Source is pushed to
[`7188302e5efd1a7cca9c4c9dd1a851c95f4a8d76`](https://github.com/antonsoo/logdelta/commit/7188302e5efd1a7cca9c4c9dd1a851c95f4a8d76).
Package version 0.3.4, release tags and hosted files are unchanged.

At baseline `3823694b53abe9d36f05ac719b5d519e51a6eaa2`, logged backticks
could close a Markdown report's code span and turn evidence into images or
links. Exact-field reports used HTML code wrappers, which still let Markdown
syntax be interpreted. GitHub's cmark-gfm reference parser confirmed both
failures using actual CLI reports. This matters when a report is pasted into
a CI summary or review: its contents should remain inspectable source text.

The renderer now chooses code-span delimiters longer than the text's backtick
runs, preserves boundary spaces and applies GFM pipe escaping only in tables.
The shared helpers cover ordinary findings, token changes, field values,
group/rate labels, incomplete evidence and source paths. Full block fences
remain supported. Analysis, JSON output and terminal rendering are unchanged.

| Observation across 20 synthetic CLI reports | Before | Corrected |
| --- | ---: | ---: |
| Reports preserving expected literal evidence and structure | 3 | 20 |
| Input-created image elements | 37 | 0 |
| Input-created links | 12 | 0 |

The [study](https://github.com/antonsoo/logdelta/blob/7188302e5efd1a7cca9c4c9dd1a851c95f4a8d76/studies/markdown-literals/README.md)
retains the reproducible capture, the pinned renderer provenance, all per-case
output hashes, a full before/after Markdown and HTML example, and two inspected
screenshots. Forty comparisons preserve every JSON and terminal output byte
and exit status. Fixtures include backtick runs, pipes after backslashes,
email autolinks, raw HTML, entities, Unicode, clipping and unusual filenames.

Offline Chromium and Firefox at 1440 and 375 pixels verify 80 corrected report
loads, with identical code text and zero request attempts. Eight baseline loads
attempt eight image requests; offline routing prevents network access. These
are reference-rendered CLI reports with a local stylesheet, not hosted GitHub
pages. No browser application source is changed.

A clean archive of production commit
`34db177524747b621408456a848bdc32ba31f86a` passes formatting, Clippy with all
targets/features and warnings denied, all 215 tests, the release build and
Cargo package verification. All 35 selected source/test/replay inputs match
the exercised checkout. A separate offline installation compiles the packaged
source with minimum-supported Rust 1.85.0; its entire 20-case replay matches
the clean Rust 1.91.0 release build and working-tree replay.

The crate is 218,952 bytes, SHA-256
`aad516a75f237047f57b8ae0c030f5db3bd9463774c56826bf172649fde3a64b`.
All 102 package files match the extracted installation source; Cargo's
normalized manifest is explicitly accounted for. Other files match the clean
archive and checkout. Runtime verification was on Linux/WSL2.

The [public receipt](evidence/logdelta-markdown-literals-2026-10-12.json) verifies
clean source, exact remote main equality and all 20 changed files fetched from
pinned raw URLs: 463,131 bytes match. Tags and `gh-pages` are unchanged.
No registry release, hosted deployment or external report posting was made.

```text
7188302 docs: retain rendered Markdown and installed crate evidence [skip ci]
34db177 fix: keep log evidence literal in Markdown reports [skip ci]
```
