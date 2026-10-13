# Veil: mask inline Anthropic documents before transport

Source [`7114765`](https://github.com/antonsoo/veil/commit/7114765940556e43101de8fa44e53c5eb96404db)
closes an outgoing-text gap: an Anthropic document's body, title and context
previously bypassed the masker. Values detected in an ordinary message could
therefore reach the SDK transport unchanged when placed in a document.

The correction masks inline plain-text sources, custom-content strings and text
blocks, plus document titles and context. It also handles documents nested in
tool results and SDK-supported content iterables. Binary sources, references,
tool IDs, citation settings and cache controls retain their existing values.

| Controlled workflow | Before | After |
| --- | --- | --- |
| Plain-text source, 12 requests | All three example addresses sent | None sent |
| Custom-content string, 12 requests | All three example addresses sent | None sent |
| Custom-content blocks, 12 requests | All three example addresses sent | None sent |
| Echoed answer restoration | 36 original bodies returned | 36 original bodies returned |

The [study and captured requests](https://github.com/antonsoo/veil/blob/7114765940556e43101de8fa44e53c5eb96404db/studies/anthropic-documents/README.md)
use synthetic contacts and the real Anthropic SDK over local mock HTTP. Each
source form is checked directly and inside a tool result, on sync/async clients,
with complete replies, raw streams and stream helpers. The caller's inputs stay
unchanged; a literal-surrogate collision rolls back the vault before transport.
This is a reproduced traversal error, not evidence about a production incident,
live-model responses or provider-side acceptance of the fixtures.

Citation quotes and locations retain the provider's masked-source coordinates.
Masking may change text length, so those offsets cannot be assumed to address the
unmasked original. Complete and streamed citations are checked on the current
SDK, together with unchanged assistant replay. PDF/image bytes and URL/file
references remain outside inline-text masking; no original-coordinate map is added.

A clean implementation archive passed locked installation with all extras, lint,
formatting, type checks, 640 tests, wheel/sdist build, web install/typecheck/build
and 16 existing Chromium/Firefox scenarios. All 286 archive files stayed unchanged.
The study's actual terminal capture was inspected. Browser checks exercise the
existing Python demo; SDK transport is verified in the Python environments.

The wheel was installed into three fresh environments: Python 3.12 core only,
Python 3.10 with Anthropic 0.40.0, and Python 3.12 with Anthropic 1.11.0. All 34
Python library files match the clean source in each environment. Both SDKs pass
the 36-request document replay. The current SDK passes 33 SDK regression checks;
the minimum passes 31 and skips unsupported thinking and citation stream events.
The initial citation test assumed a newer SDK feature; its compatibility guard
is test-only and leaves runtime bytes unchanged.

The [artifact receipt](https://github.com/antonsoo/veil/blob/7114765940556e43101de8fa44e53c5eb96404db/studies/anthropic-documents/results/verification.json)
identifies the 89,139-byte wheel with SHA-256
`3ecd91335823bfe87a965522938846c34edba3a25a48fc1e2d1654766a738305`.
The [public-source receipt](evidence/veil-anthropic-documents-2026-10-12.json)
checks clean local/remote main equality and all ten changed files (360,031 bytes)
against pinned public source. Version remains 0.4.4. Tags and `gh-pages` are
unchanged; no PyPI release or hosted deployment occurred.
