# Veil: keep access-bearing URLs out of outgoing prompts

Source is pushed to
[`33992a7b59f23cb158c17215f76de06604ef95d4`](https://github.com/antonsoo/veil/commit/33992a7b59f23cb158c17215f76de06604ef95d4).
Package version 0.4.4, release tags and the hosted demo are unchanged.

At baseline `030c69ba8b9a54785ec8a0ccefc609124bdfb788`, a Google Cloud Storage
V4 signed URL passed through the default masker unchanged. Other signed links
could have only a key identifier or signature fragment masked. OAuth fragment
tokens and encoded token parameter names also escaped recognition.

The correction recognizes AWS/GCS signing fields, Azure Storage SAS and
CloudFront signer/signature pairs, plus sensitive names in query strings and
fragments after one decoding pass. It stores the entire original URL in one
vault mapping, preserving exact restoration. Generic `sig` or `Signature`
parameters require recognized companion fields. No core dependency is added.

| Observed result | Before | Corrected |
| --- | ---: | ---: |
| Whole credential URL masked | 6/24 | 24/24 |
| SDK-generated signed URL masked whole | 0/9 | 9/9 |
| Ordinary-link controls unchanged | 15/15 | 15/15 |
| Expected CLI result and complete mapping | 21/39 | 39/39 |
| Expected actual SDK request body | 63/117 | 117/117 |
| Expected browser result | 84/156 | 156/156 |

The [study](https://github.com/antonsoo/veil/blob/33992a7b59f23cb158c17215f76de06604ef95d4/studies/credential-urls/README.md)
retains real cloud SDK fixture generation with synthetic keys, blocked network
access and discarded in-memory RSA keys. Nine signed-link fixtures cover
GCS/S3 V4 and V2, Azure blob/account/stored-policy SAS, and CloudFront canned
and custom policies. Thirty handwritten controls cover fragments, encoding,
empty values and ordinary URLs. No cloud account or issued credential is used.

Library, CLI and streaming restoration preserve the original source. Actual
OpenAI Chat Completions, Responses and Anthropic Messages SDK requests use
local echo transports; no provider is contacted. Passing restoration alone
would not prove masking, so the evidence checks exact outgoing text too.

A clean archive of production commit `7168237815648a5935efbf16e7c4e5ccccaeefe0`
passes locked installation, lint, formatting, mypy, 537 tests on each of
Python 3.10.21 and 3.14.7, and sdist/wheel builds. One optional spaCy check is
skipped per interpreter. The wheel installs independently with no dependencies
on Python 3.10 and with the SDKs on Python 3.14; replay rows match the source.
All 39 wheel files other than the installer-rewritten RECORD match both
installations, and all 35 source package files match the clean archive.

The wheel is 87,234 bytes with SHA-256
`e5508172be4d18c1d46019f0c7acddcfc33e76ecddd9117d75ec9e2fd024a7e4`.
It is a locally built artifact, not a registry release.

Real Chromium and Firefox workflows at 375 and 1280 pixels check 312 actual
downloads per replay, offline after Pyodide initialization. All ten served
assets match the build, and its 34 Python files match source. The 16 existing
browser scenarios also pass. All eight before/after screenshots were inspected.
The static build remains local; nothing was deployed.

The public-text compatibility replay leaves all 10,339 resolved detections
unchanged across 1,483 hash-checked files (32,925,796 bytes). This does not
measure recall or precision on issued signed links. Parsing adds measurable
cost: the local synthetic URL-detector benchmark takes about 29 ms for a
918 KB plain query and 117 ms for a 1.05 MB encoded-name query, with roughly
linear observed growth. Unknown credential schemes can still be missed;
recognized fields do not establish that a signature is valid.

The [public receipt](evidence/veil-credential-urls-2026-10-12.json) verifies
clean local source, exact remote main equality and all 30 changed files fetched
from pinned raw URLs: 2,433,504 bytes match. Tags and `gh-pages` remain unchanged.

```text
33992a7 docs: retain installed and browser credential URL evidence [skip ci]
7168237 fix: mask signed access URLs and encoded fragment credentials [skip ci]
```

Tracking: `officina-yc4f`.
