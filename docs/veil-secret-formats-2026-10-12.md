# Veil: mask complete project-key tokens

Pushed source at
[`030c69b`](https://github.com/antonsoo/veil/commit/030c69ba8b9a54785ec8a0ccefc609124bdfb788)
keeps long project-key-shaped strings from passing through unchanged or having
only a fragment masked. The detector now recognizes complete `sk-proj-` and
`sk-svcacct-` bodies of at least 20 ASCII letters, digits, underscores or dashes,
without a fixed upper length cap. Enclosing tokens take priority over supported
key prefixes nested in their bodies.

The [reproducible study](https://github.com/antonsoo/veil/blob/030c69ba8b9a54785ec8a0ccefc609124bdfb788/studies/secret-formats/README.md)
uses 68 deterministic synthetic shapes, never issued or authenticated keys.
Actual OpenAI and Anthropic SDKs run over mock HTTP transports; no provider or
model is called. Official OpenAI examples confirm the `sk-proj-` placeholder,
but the cited references do not specify a complete key grammar. The service-account
shape is an explicit compatibility heuristic. Recognition is not validation,
and other formats can still be missed.

| Complete masking observed | Baseline `5521b57` | Corrected source |
|---|---:|---:|
| Library cases | 12 / 68 | 68 / 68 |
| SDK request bodies | 36 / 204 | 204 / 204 |
| Actual CLI cases | 12 / 68 | 68 / 68 |
| Offline browser cases | 48 / 272 | 272 / 272 |

Restoration succeeds even on the baseline: unchanged leaked text can round-trip.
The checks therefore require a complete-token vault mapping and the exact
expected outgoing masked sentence, independently of restoration.

Chromium and Firefox at 375 and 1280 pixels each exercise all 68 cases after
disconnecting, checking 544 masked-text and vault downloads per revision.
All ten served application assets, including the Python source manifest, match
the local build. There are no later requests, page errors, CSP violations or
page overflow. All eight before/after screenshots were opened and inspected.
The original browser suite also passes its 16 accessibility, theme and recovery
scenarios. These browser claims apply to the retained local build.

Clean archive `b5f819a` passes lint, formatting, mypy, 498 checks and the
sdist/wheel build. Python 3.10 and 3.14 also pass 498 checks; minimum direct
dependencies pass 492. Skips cover the optional spaCy backend and provider
model features absent in the old SDKs. The final installed wheel repeats all
204 SDK requests on Python 3.10 and 3.14 and with minimum SDK versions. The
complete normalized case results agree. All 34 installed Python files match
the checkout; a dependency-free Python 3.12 installation passes all 136 CLI
invocations. The receipt distinguishes the earlier full-suite runs from the
final comment-only clarification and subsequent rebuilt-wheel checks.

All 1,483 cached public technical-text files are source-hash checked, and their
10,339 resolved detections remain identical across 2,616,034 words. This is
compatibility evidence for those files, not a general false-positive estimate.
Million-character synthetic detector probes also remain whole-token matches;
their timings and scope are retained without a latency guarantee.

The [public-source receipt](evidence/veil-secret-formats-2026-10-12.json)
checks clean HEAD against remote `main` and byte-compares all 28 changed files
fetched at the exact commit. All 119 build/check inputs match the verified
archive. The final push carries `[skip ci]`; `gh-pages` remains at
`8a15aaf198636907a1254f247f2159c6a53984d9`, and release-tag refs are unchanged.
No package, tag or hosted site was published by this work.
