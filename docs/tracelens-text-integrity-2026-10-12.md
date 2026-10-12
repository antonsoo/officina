# TraceLens: reject damaged bytes before comparing evidence

Source is pushed to
[`c14341a9cc43a99d95088ab7c16f6e3b55942558`](https://github.com/antonsoo/tracelens/commit/c14341a9cc43a99d95088ab7c16f6e3b55942558).
Package version 0.3.3, tags and the hosted demo are unchanged.

At baseline `bea26a80aeadbca3659c493a7378597582c0f410`, otherwise identical
OTLP exports with raw byte `80` versus `81` (hex) in an operation name both
became `operation U+FFFD`. The actual CLI comparison exited 0, marked them
matched and emitted no warnings. Both files were invalid UTF-8; replacement
decoding had erased the distinction before comparison.

The shared decoder now rejects malformed UTF-8 and BOM-marked UTF-16 with an
actionable encoding error. It preserves valid Unicode and literal replacement
characters. Trace imports and CLI price files share the correction. Browser
failures retain the previous comparison and allow a valid replacement.

| Observed outcome | Before | Corrected |
| --- | ---: | ---: |
| Valid CLI inputs accepted intact | 32/32 | 32/32 |
| Damaged CLI inputs rejected with an encoding error | 0/56 | 56/56 |
| Expected actual browser import/rejection outcomes | 96/264 | 264/264 |

Before the fix, 50 damaged inputs were accepted; six failed later with JSON
errors. The [study](https://github.com/antonsoo/tracelens/blob/c14341a9cc43a99d95088ab7c16f6e3b55942558/studies/text-integrity/README.md)
retains exact synthetic bytes and Python strict-decoder classifications for
OTLP, collector JSON Lines, Jaeger and price tables. This is a controlled
failure reproduction, not a damaged-export prevalence estimate.

Actual Chromium and Firefox file inputs run offline at 375 and 1440 pixels.
Each fixture is followed by a real comparison JSON download; rejected
candidates preserve the complete previous report. All contexts recover with
valid UTF-16BE Unicode. All 24 fetched assets match the build, and there are no
page errors, CSP violations, post-shutdown HTTP requests or horizontal
overflow. All eight before/after screenshots were inspected.

A clean archive of production commit `e0aa138c8b45defe4c2fdbff57bd4002fd11562c`
passes locked Node 24.21.0 installation, lint, strict typechecking, 370 unit
tests, 30 CLI tests, browser smoke scripts and 122 Playwright scenarios.
All 59 tested web/CLI build files match the clean archive: 795,678 bytes.

The local npm tarball is 51,053 bytes with SHA-256
`e79dc05379216cb3894dc69091e1677dcf9d048a04535114d699efa20f6c7f23`.
All 29 packaged files match a separate offline installation and the clean
archive. The installed CLI passes all 88 fixture cases on Node 20.0.0 and
24.21.0. Six commands across the nine unchanged repository examples produce
54 byte-identical stdout/stderr pairs before and after, including installed
replays on both runtimes. No registry release was made.

The [public receipt](evidence/tracelens-text-integrity-2026-10-12.json) verifies
clean source, exact remote main equality and all 30 changed files fetched
from pinned raw URLs: 1,389,552 bytes match. Tags and `gh-pages` are unchanged.

```text
c14341a docs: retain installed and browser text integrity evidence [skip ci]
e0aa138 fix: reject damaged text before trace and price parsing [skip ci]
```

Tracking: `officina-z26q`.
