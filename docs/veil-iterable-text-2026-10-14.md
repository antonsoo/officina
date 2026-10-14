# Inline text arrays before SDK serialization, 2026-10-14

Veil `245e63e` masked OpenAI content parts when they were lists, while the real
SDK serialized tuples and generators as arrays containing unmasked text.
The same bypass affected Responses tuple inputs, message/tool-output parts
and reasoning summaries. These were actual SDK 3.23.0 request bodies captured
over mocked HTTP, with synthetic contacts and replies and no live inference.

Code `1906438` visits iterable array fields during preparation, retaining opaque
image references and encrypted reasoning content. It also safely materializes
top-level Responses generators, which the baseline SDK rejected; those are
newly supported inputs, not previous transport leaks. Vault changes roll back
on failed iteration or literal-surrogate collisions before any HTTP call.
One-shot iterator consumption cannot be undone. Retained returned provider
items replay exactly inside tuple and generator histories.

| Verification | Retained result |
| --- | --- |
| Actual SDK transport corpus | 126 workflows; baseline 84 contract disagreements and 68 raw-contact request cases, corrected zero of each |
| Installed Python 3.14.7 / OpenAI 3.23.0 | 126 workflows and 136 additional regressions pass |
| Installed Python 3.10.21 / OpenAI 1.66.0 | 126 workflows and 136 additional regressions pass |
| Fresh archived source | Lint, format, type checks, 837 Python tests with spaCy and no skips, package/web builds, 16 Chromium/Firefox scenarios including offline reuse |
| Artifact identity | All 34 runtime files match source, wheel, source archive, three installations and browser manifest |
| Ordinary list controls | All 36 captured request bodies identical before/after |

The [study](https://github.com/antonsoo/veil/blob/d3f43e0/studies/iterable-text/README.md)
retains the replay, captures, installed results, clean-check logs, artifact
hashes and inspected terminal screenshot. A core-only Python 3.12.12 wheel
installation also passes the documented mask/restore example with optional
SDKs absent. The tested wheel remains a **local build**, not a registry release.
The existing browser build is `cd veil/web && npm run build` to `web/dist/`;
it was not deployed here.

Evidence commit `d3f43e0` was pushed to the existing `main` remote with the
owner's authorization. Eleven pinned public files were fetched back and
byte-compared with the clean checkout. The
[public source receipt](evidence/veil-iterable-text-2026-10-14.json) records the
full commit, URLs, sizes and SHA-256 hashes. Issue `officina-tctq` is closed.

Recognized inline text is the scope of this traversal. Opaque binary data,
references, encrypted content, unknown item fields and the underlying unwrapped
SDK retain their documented limits. Detection remains configured and incomplete.
The controlled SDK captures do not establish live API acceptance, token usage
or a production data-protection guarantee.
