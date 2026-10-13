# Fieldproof: declared custom claims reach verification

Source [`6ec047d33cd69fb7a02154e90bc3049f1e072f16`](https://github.com/antonsoo/fieldproof/commit/6ec047d33cd69fb7a02154e90bc3049f1e072f16)
is pushed and matches remote `main`. All 14 changed files (246,534 bytes)
match their pinned public raw URLs. The
[publication receipt](evidence/fieldproof-container-claims-2026-10-13-public.json)
retains sizes and SHA-256 hashes. Tags and `gh-pages` are unchanged. No package
release or hosted deployment accompanies this source repair.

At baseline `9814cf2`, valid custom Pydantic models containing dictionary or
tuple claims produced empty verification reports. A supported vendor and an
unsupported bank-account claim both disappeared. A separate collision let a
literal model field named `a.b` overwrite, or be overwritten by, nested field
`a.b`; the controlled example lost the unsupported claim.

| Custom-model structure | Baseline | Current source |
| --- | --- | --- |
| Mapping, tuple or nested combination | No fields; all counts zero | One verified and one unsupported claim |
| Literal `a.b` plus nested `a.b` | One surviving verified claim | Two distinct paths and both verdicts |
| Keys containing `items[0].amount` | No fields | Repeated amount remains ambiguous |
| Real row-model list inside a mapping | No fields | Both claims verified with a locality note |
| Non-string mapping keys | No fields | Explicit error |

The walker now traverses string-keyed mappings and tuples alongside models and
lists. Mapping keys and non-identifier model names use JSON-quoted brackets;
ordinary model names and numeric positions keep their existing paths. Quoted
member text is masked when finding row indices, preventing a literal key from
inventing a row-location hint.

The [controlled PDF study](https://github.com/antonsoo/fieldproof/blob/6ec047d33cd69fb7a02154e90bc3049f1e072f16/studies/container-claims/README.md)
retains a labelled synthetic PDF, regeneration script, ten custom-model cases,
before/after reports and installed-package replays. It exercises the real PDF
reader and public verification API. Ordinary model/list reports remain
identical. The previous 15-case CLI/API/SDK import-boundary replay also keeps
its outcomes and valid report hashes. No model or external service is called.

The [artifact receipt](https://github.com/antonsoo/fieldproof/blob/6ec047d33cd69fb7a02154e90bc3049f1e072f16/studies/container-claims/verification.json)
records implementation `b3e0f26` from a clean 693-file archive. The full Python
suite passes 584 checks in each of locked Python 3.12 source, a fresh Python
3.11 wheel installation with lowest direct dependencies, and a fresh Python
3.14 wheel installation with current dependencies. Each skips one real-OCR
case because Tesseract is unavailable. Lint, types, web formatting, 62 web unit
checks, both builds and 86 production-browser checks pass.

The wheel, source distribution and installations match the build's 37 Python
files and 23 UI assets. Those UI assets are byte-identical to the preceding
claim-integrity build; the refreshed workspace build matches them too. The
final evidence commit changes no tested runtime files. Local artifacts retain
version 0.2.7 and differ from the previously published package.

Custom schemas remain a Python-library integration. The CLI/server selector
still offers the three built-in templates. String-keyed mappings, models,
lists and tuples are supported; unordered collections and non-string mapping
keys are not. Explicit row rules remain dotted model paths to lists of models.
This repair does not infer business meaning from mapping keys or prove that a
correctly quoted value belongs to its claimed semantic role.
