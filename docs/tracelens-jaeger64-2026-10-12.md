# TraceLens: one request across Jaeger and OTLP exports

Source commit
[`bbfbe4407fe8d9c32e0151fe979b1071b80dece9`](https://github.com/antonsoo/tracelens/commit/bbfbe4407fe8d9c32e0151fe979b1071b80dece9)
was pushed to `main` and verified against the remote branch. All 26 changed
files, totaling 1,254,839 bytes, matched their pinned public raw URLs.
The [publication receipt](evidence/tracelens-jaeger64-2026-10-12-public.json)
records each file's SHA-256 and size. Tags and `gh-pages` remained unchanged.
There was no npm release or hosted deployment; version remains 0.3.3.

## What changed

Jaeger's query/UI exporter writes a 16-hex trace ID when its high word is zero.
OTLP represents the same identity with 32 hex digits. TraceLens treated these
as different traces, so related service exports lost their shared tree, audit
links could miss their targets, and overlapping exports bypassed duplicate
detection. The importer now normalizes the complete 64-bit spelling before
those operations and accepts it in complete trace selectors.

The [retained study](https://github.com/antonsoo/tracelens/blob/bbfbe4407fe8d9c32e0151fe979b1071b80dece9/studies/jaeger64/README.md)
uses explicitly synthetic gateway, worker, model-call and audit records. An
independently written canonical OTLP gateway provides the control. Upstream
Jaeger encoder and fixture hashes establish the shorter representation; no
Jaeger server or production workload was run for this study.

| Observation | Before | After |
| --- | --- | --- |
| Traces in the three-file group | 3 | 2 |
| Request spans shown by default | 2 | 3 |
| Request elapsed time | 8 ms | 10 ms |
| Audit link to gateway | Missing span | Available |
| Equivalent gateway span exported twice | Accepted separately | Rejected |
| Identity/CLI replay checks correct | 1/17 | 17/17 |

Nonzero high words remain different identities. Span IDs and other short or
opaque labels retain their previous handling. The fix does not infer missing
spans, synchronize clocks, or deduplicate retransmissions. Reports from 64-bit
Jaeger imports now use the 32-hex canonical trace ID.

## Verification and limits

- A fresh archive of implementation `3de85f9` preserved all 496 tracked files.
  Node 24.21.0 completed install, lint, types, 385 core checks in each of two
  locales, web/CLI build, 30 CLI checks and the earlier captured SDK replay.
- Four before and four after browser workflows covered offline Chromium and
  Firefox at 1440px dark and 375px light. Each checked 24 served assets; all
  33 clean web-build files matched the browser-tested build. Screenshots were
  inspected. The fixed workflows exported span/link/comparison evidence,
  navigated the gateway link by keyboard, and preserved the previous comparison
  when rejecting duplicate input. No page/CSP errors, late/external requests,
  page overflow or settled-state axe violations were recorded.
- The broader browser suite passed 127 checks and hit one Firefox target crash
  in an existing trace-switch cancellation check. Five isolated repeats passed
  without changing assertions, timeouts or runtime code. Its cause remains
  unestablished; the failure and retry logs are retained. This was not a clean
  128-check first run.
- The local 52,873-byte npm tarball was installed with lifecycle scripts
  disabled. All 26 compiled runtime files matched the clean build. All 17
  reproduction checks passed through the installed CLI on Node 20.0.0 and
  24.21.0, with identical reports apart from the Node version.

The [artifact receipt](https://github.com/antonsoo/tracelens/blob/bbfbe4407fe8d9c32e0151fe979b1071b80dece9/studies/jaeger64/verification.json)
includes the package SHA-256
`e83e78781b372f313b51cad051d580a8620142d35b1ab5c8890ed328ba070598`
and the initial browser-suite failure. These checks establish local source and
artifact behavior, not a registry update or a change to the hosted demo.
