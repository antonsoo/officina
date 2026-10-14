# Tool-input serialization privacy, 2026-10-14

Veil's fresh Anthropic tool inputs could contain strings that its masking
traversal never visited. At baseline `a67a5b6`, the real SDK serialized a tuple
of synthetic contacts into an unmasked JSON array and a nested Pydantic model
into an object containing its raw email. Detected sensitive keys also crossed
transport; numeric keys were converted to strings. This was reproduced with
the actual Anthropic 1.11.0 SDK over recorded mock HTTP, without inference.

Code `b60ee9d` masks tuples as arrays, requires string object keys, rejects
detected sensitive keys without renaming them, and refuses opaque custom values
before serialization. Explicit model conversion to plain JSON remains supported.
Failed preparation rolls back vault changes, including literal-surrogate
collisions inside tuples. Unchanged retained provider history still replays
exactly; edited keys enter fresh masking.

| Verification | Retained result |
| --- | --- |
| Actual SDK transport corpus | 44 workflows; baseline 30 disagreements and 24 fresh raw-value request cases, corrected zero of each |
| Installed Python 3.14.7 / Anthropic 1.11.0 | All 44 workflows and 35 regressions pass |
| Installed Python 3.10.21 / Anthropic 0.40.0 | All 44 workflows and 35 regressions pass |
| Core-only wheel / Python 3.12.12 | Documented mask/restore example passes; optional SDKs absent |
| Fresh archived source | Lint, format, type checks, 701 Python tests with spaCy and no skips, package/web builds, 16 Chromium/Firefox scenarios including offline reuse |
| Artifact identity | All 34 runtime files match source, wheel, source archive, three installations and browser manifest |
| Supported controls | 14 ordinary JSON, explicitly dumped model and provider-history captured request bodies identical before/after |

The [study](https://github.com/antonsoo/veil/blob/245e63e/studies/tool-input-trees/README.md)
retains the replay, actual request captures, installed results, check logs,
artifact receipt and inspected terminal screenshot. The wheel is a verified
local build of version 0.4.4, **not a PyPI release**. The existing web build is
`cd veil/web && npm run build`, producing `web/dist/`; it was not deployed here.

Source and evidence commit `245e63e` was pushed to the existing `main` remote
with the owner's authorization. Ten pinned public files were fetched back and
byte-compared with the clean checkout. The
[public source receipt](evidence/veil-tool-input-trees-2026-10-14.json) records
the complete commit, URLs, sizes and hashes. Issue `officina-3ju1` is closed.

Detection is configured and incomplete. Numeric values retain their type and
are not anonymized. Provider-owned replay can contain already-produced provider
text and is excluded from the fresh-caller raw-value count. Opaque documents,
images, signed thinking blocks and calls on the unwrapped SDK retain their
documented boundaries. This does not establish live API acceptance or a
production data-protection guarantee.
