# TraceLens: inspect related service exports together

Source commit [`cd15622`](https://github.com/antonsoo/tracelens/commit/cd15622160ea03d0de31ba1e82531a47a08a3b9b)
adds grouped imports to the browser and CLI. Previously, dropping several files
silently opened only the first. The importer now combines complete span identities
before selecting a trace or resolving parents and links. Span details, span/link
JSON and comparison evidence retain source filenames.

| Captured export | Spans | Opened alone | Opened together |
| --- | ---: | --- | --- |
| Gateway | 3 | Root and two client calls | Seven-span request tree with worker |
| Worker | 4 | Two missing parents | Both parents resolved |
| Audit | 2 | Two unavailable link targets | Both request targets navigable |

The [retained study](https://github.com/antonsoo/tracelens/blob/cd15622160ea03d0de31ba1e82531a47a08a3b9b/studies/multifile/README.md)
uses three OpenTelemetry SDK providers, real loopback HTTP requests, propagated
trace contexts, SHA-256 calculations on synthetic strings, and a local queue.
No model or external service is called. Identities, parents, nanosecond timings,
attributes and link targets are checked against SDK objects captured before
Protobuf encoding. The group contains nine spans across two selectable traces;
it is not a fabricated nine-span combined timeline.

Chromium and Firefox at 1440px dark and 375px light opened all three files after
the web server stopped. Each workflow byte-checked 24 served assets, switched
traces, followed a cross-file link by keyboard and downloaded the expected
span/link/comparison evidence. Invalid or duplicate candidate files left the
previous comparison intact; valid replacement and native file selection worked.
No page/CSP errors, late network requests, settled-state axe violations or
horizontal page overflow were observed. The screenshots were inspected.

The browser permits 32 files totaling 25 MB; the CLI permits 32 files per group
without a byte limit. Any repeated `(traceId, spanId)` rejects a group, including
identical retransmissions and duplicates in unselected traces. No newer record
is inferred. Structurally unreadable files reject the import; existing per-span
and truncated-final-line warnings remain file-scoped. Missing targets and absent
exported data are not recovered. Single-file parsing retains its behavior.

A clean archive preserved all 478 implementation files. Node 24.21.0 installation,
lint, types, builds, 379 unit checks in each of two locales, 30 CLI checks, 128
browser checks and the legacy browser workflow passed. All 33 clean web-build
files matched the tested checkout. The separately installed 52,644-byte tarball
worked on Node 20.0.0 and 24.21.0, with all 26 compiled files matching the build.
Both installed executables reconstructed the SDK traces and compared file groups.
The [artifact receipt](https://github.com/antonsoo/tracelens/blob/cd15622160ea03d0de31ba1e82531a47a08a3b9b/studies/multifile/verification.json)
records the archive and package checks.

The [public-source receipt](evidence/tracelens-multifile-2026-10-12.json)
verifies clean local/remote main equality and byte equality of all 42 changed
public files (1,397,237 bytes). Package/source version remains 0.3.3. Tags and
`gh-pages` are unchanged; no registry release or hosted deployment occurred.
