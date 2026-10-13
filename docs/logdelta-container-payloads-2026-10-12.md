# Logdelta: retain exact observations after decoding container payloads

Source [`9f20fb0`](https://github.com/antonsoo/logdelta/commit/9f20fb07b06fdf26766cc3089a5c0723fd65f08d)
prevents styled or prefixed Docker payloads from disappearing from exact field
watches. A `200` to `503` status change previously exited 0 with a complete watch
when the changed JSON was colorized inside the envelope. The reader classified
that record as non-JSON; an ordinary companion record let the comparison pass.

The correction normalizes terminal styling and trailing CR/LF after decoding the
`log` string, before recognizing existing CRI, journald or timestamp prefixes.
It also prevents compact JSON strings from masquerading as outer CRI headers.
Escaped terminal codes inside actual scalar values remain exact data, and the
original envelope and line number remain in the report. Native template mining
and exact watches share this handling with the browser's WebAssembly engine.

| Controlled actual CLI replay | Before | After |
| --- | --- | --- |
| 19 pooled/grouped new-value cases | 13 false clean exits, 2 incorrectly incomplete, 4 working controls | All 19 identify the intended new value |
| 3 error-rate comparisons | 50 of 100 records counted, unchanged 4% observed rate, exit 0 | All 100 counted, 2% to 27%, exit 1 |
| 2 styled damaged fields | Payload skipped; watch called complete | Explicit incomplete watch, source problem retained, exit 2 |
| Literal escaped scalar and ordinary unchanged logs | Styled scalar unobserved; ordinary control passes | Exact scalar preserved; ordinary report byte-identical |

The [26-case study](https://github.com/antonsoo/logdelta/blob/9f20fb07b06fdf26766cc3089a5c0723fd65f08d/studies/container-payloads/README.md)
retains complete watched-field captures, input/report hashes, four representative
input files and a repeatable command replay. These are **synthetic** serialized
records, without a Docker daemon, remote service or production incident. Grouped
cases keep maintenance's known `503` separate from checkout's first `503`.

All 264 existing Kubernetes comparisons and 16 Loghub template reports remain
byte-identical on 536 cached public inputs totaling 429,474,908 bytes. This is a
regression comparison of the existing studies, not new or held-out container data.
All 26 full native reports also match the actual compiled WASM engine, with exact
integer counts and source strings and floating scores compared at 12 significant
digits. Four offline desktop/phone Chromium/Firefox images were inspected.

A clean implementation archive passed formatting, Clippy, 217 native checks,
146 library-only checks, 218 Rust 1.85 checks including a doctest, three wrapper
checks, web lint/types, 83 web tests, 20 WASM build-configuration checks, release
and package builds, and 128 production-browser scenarios. All 300 tracked archive
files stayed unchanged. Separate installations of the unpacked crate using
Rust 1.91.0 and 1.85.0 both reproduce the complete 26-case after capture. All 21
runtime source/data files match the archive; all 39 served production files match
the build. The clean WASM bytes match the inspected browser engine.

The [artifact receipt](https://github.com/antonsoo/logdelta/blob/9f20fb07b06fdf26766cc3089a5c0723fd65f08d/studies/container-payloads/results/verification.json)
identifies the 220,233-byte crate with SHA-256
`07db7f4027ce00a8d63226473ec5d5062822814a736931e2871eb083debf7718`.
The [public-source receipt](evidence/logdelta-container-payloads-2026-10-12.json)
checks clean local/remote main equality and all 23 changed files (1,239,852 bytes)
against pinned public source. Version remains 0.3.4. Tags and `gh-pages` are
unchanged; no registry release or hosted deployment occurred.

This handles the existing single-envelope and single-line prefix forms. It does
not reconstruct CRI partial records, join multiline JSON, recursively decode
arbitrary wrappers, or prove the supplied logs contain every relevant event.
