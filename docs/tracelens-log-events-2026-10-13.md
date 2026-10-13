# TraceLens: inspect conversations exported as OTLP logs

Source [`83a4bacafae0944e013149df1e3d834ca70db4af`](https://github.com/antonsoo/tracelens/commit/83a4bacafae0944e013149df1e3d834ca70db4af)
is pushed and matches remote `main`. All 42 changed files (1,391,880 bytes)
match their pinned public raw URLs. The
[publication receipt](evidence/tracelens-log-events-2026-10-13-public.json)
retains their sizes and hashes. Tags and `gh-pages` are unchanged. No npm
release or hosted deployment accompanied this change; version remains 0.3.3.

At baseline `bbfbe44`, the real OpenTelemetry Python GenAI helper's event-only
capture exported four spans and two log records. TraceLens opened the spans
but showed none of their messages from the combined JSONL file. Selecting
separate trace and log exports together failed. This was reproduced with
`opentelemetry-util-genai 1.2b0`, SDK/exporter 1.45.1 and Protobuf 7.36.2.

| Workflow | Before | After |
| --- | --- | --- |
| Combined trace/log JSONL | Log batch skipped; no transcript | 2 matched records, complete captured transcript |
| Separate trace and log files | Import rejected | Both model turns inspectable |
| Content captured to spans and logs | Span messages visible | Same transcript, without duplicate messages |
| Missing/conflicting log context | Log signal unavailable | Explicit unmatched evidence and download |
| Span measurements | 4 spans and recorded timing | Same counts, timing, errors and cost |

The [executable study](https://github.com/antonsoo/tracelens/blob/83a4bacafae0944e013149df1e3d834ca70db4af/studies/log-events/README.md)
retains both SDK capture modes, oracles from the SDK objects before encoding,
baseline observations, CLI reports and eight browser screenshots. The
conversation is synthetic; its SHA-256 tool really computes a local digest.
No model or external service was called. The viewer exposes the system
instruction, prompt, tool arguments, tool result and scripted completion.

Correlation uses both trace and span identity, across all imported files before
selecting a trace. It never guesses by names or clocks. Logs stay separate from
span events; attributes, events and logs have explicit message precedence.
The new Logs tab and `tracelens logs` report preserve source file/line/path and
the original decoded record. Unmatched records remain downloadable without
creating invented spans, durations, errors, token usage or charges.

The [artifact receipt](https://github.com/antonsoo/tracelens/blob/83a4bacafae0944e013149df1e3d834ca70db4af/studies/log-events/verification.json)
records a clean 526-file archive of implementation `3791bdf`, locked install,
lint, types, 405 core/parser checks, 32 CLI checks, browser smoke checks, all 128
browser-suite checks and both builds. Fresh installed CLIs under Node 20.0.0
and 24.21.0 matched all 31 shipped files and returned identical evidence.
The final source commit adds evidence only; tested runtime files are unchanged.

The 56,404-byte tarball has SHA-256
`19c9926bcd00f9872ce366125e0ab5327636c15ed8599895852524f1a3eacf85`.
Four actual workflows in Chromium 153.0.8010.12 and Firefox 155.0 cover
1440px dark and 375px light layouts, the built-in sample, local file selection,
offline transcript inspection, keyboard scrolling, and full matched/unmatched
downloads. Each byte-checks 24 app responses and independently fetches the
sample bytes. There were no observed page errors, external requests, horizontal
page overflow or settled-state axe violations. All screenshots were inspected.

An earlier broad run had a Firefox process crash in an existing trace-switch
test. Three isolated reruns and the final complete 128-test run passed. The
receipt retains that exception and harness corrections. This is decoded-record
evidence, not a wire archive or a complete OTLP validator. Current inference
details are normalized; other bodies remain evidence. Logs alone cannot recover
missing trace spans or content that an exporter omitted.
