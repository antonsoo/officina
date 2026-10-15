# Whole-value privacy repairs, 2026-10-15

Three fresh Veil reproductions showed sensitive values surviving partial or
heuristic masking. The fixes preserve whole identities and credentials as one
vault value, with exact restoration. These are controlled synthetic populations,
not production recall or leak-rate estimates.

| Reproduction | Baseline | Corrected | Implementation |
| --- | --- | --- | --- |
| IDNA mailbox spellings and controls | 4/101 correct; Unicode separators could expose domain suffixes | 101/101 correct | `96f9158` |
| Temporary AWS `ASIA` key-shaped IDs | 841/1,000 completely recognized through generic heuristics | 1,000/1,000 explicitly recognized; 1,000 `AKIA` controls unchanged | `3d94646` |
| Native compact JWTs containing identity claims | 0/12 whole tokens masked; encoded claims visible in every case | 12/12 whole tokens masked; no encoded claims visible | `d739ddc` |

For each repair, all 12 actual SDK transport workflows changed from incomplete
masking to wholly masked examples: OpenAI Chat Completions, Responses and
Anthropic, sync/async and buffered/streaming. These use real SDK serializers
against local echo HTTP, without live model or identity-service calls. JWT
fixtures were generated and independently verified with PyJWT across HMAC,
RSA, EC and Ed25519, plus an explicitly unsecured control.

The final clean source passes Ruff, formatting, mypy, 1,100 tests without skips,
wheel/sdist builds, the production web build and 16 existing browser scenarios.
Three fresh wheel installations cover Python 3.10.21 with SDK floors, Python
3.14.7 with current SDKs, and dependency-free core on Python 3.12.12. All 36
runtime files match the clean archive, wheel, sdist and installed packages; the
browser bundles the same 35 Python files. All 10,372 resolved detections across
the retained 1,483-file log/code corpus are unchanged.

## Published source and live demo

The [public evidence receipt](evidence/veil-whole-value-masking-2026-10-15.json)
records the final source revision, a clean tree, matching remote `main` and
byte comparisons of every changed public source/evidence file. Its pinned URLs
lead to the full studies and their native requests, downloads, logs and limits.

The tested build (`cd veil/web && npm ci && npm run build`, output `web/dist/`)
is now on the [existing live demo](https://antonsoo.github.io/veil/), deployed
by fast-forward `gh-pages` commit `3ec5b259550638b703c28a8092e7b9c5600dbe06`.
All 27 served files match the tested build. Actual hosted workflows cover eight
JWT cases, 11 IDNA cases and six STS/control cases in Chromium and Firefox at
375/1280 pixels. Fresh contexts initialize Python on a neutral prompt before
disconnecting; fixture masking and exact masked/vault downloads/restoration
then make no new requests. All 12 hosted screenshots were inspected.

The registry package remains unchanged; verified local wheels still carry
version 0.4.4 and are not a PyPI release. Detection remains incomplete. JWT
recognition protects supported compact forms without authenticating them;
JWE, unreadable/oversized headers and detached payloads remain outside its
scope. `ASIA` fixtures are synthetic identifiers, not issued credentials, and
an access key ID alone cannot authenticate to AWS. No production protection or
worst-case latency guarantee follows from these measurements.
