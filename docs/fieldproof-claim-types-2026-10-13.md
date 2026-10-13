# Fieldproof: a quote cannot verify an unchecked value type

Source [`d2ed381946c956d153d5150b5fd61c95317953bf`](https://github.com/antonsoo/fieldproof/commit/d2ed381946c956d153d5150b5fd61c95317953bf)
is pushed and matches remote `main`. All 16 changed files (250,727 bytes)
match their pinned public raw URLs. The
[publication receipt](evidence/fieldproof-claim-types-2026-10-13-public.json)
retains sizes and SHA-256 hashes. Tags and `gh-pages` are unchanged. No PyPI
release or hosted deployment accompanies this source update.

At baseline `27ae6c7`, valid custom Pydantic models could wrap an object, null,
array, Python date, Decimal, bytes or other unhandled type in `Evidenced`.
A real but unrelated quote then made the claim verified: the value dispatcher
returned success for types without any checking rule. This was not limited
to one field. A wrapped object quoting `Alpha` also became a row-location hint,
letting a repeated `10.00` amount on that line verify. The report showed two
verified fields despite never checking what the object claimed.

| Controlled case | Baseline | Current source |
| --- | --- | --- |
| Object or null with an unrelated exact quote | Verified | Field-specific input error |
| Unsupported type with absent or ambiguous quote | Quote verdict conceals the type problem | Type error before grounding |
| Object used to locate a sibling amount | Both fields verified | Error before either is grounded |
| Explicit date/text wrapper mutated to an integer | Verified using numeric checks | String-kind error |
| Supported scalar and built-in fixtures | Existing reports | Unchanged reports |

The verifier now validates every present wrapper's actual value before
building its grounding index. Values must be strings, integers, floats or
booleans; explicit date/text kinds must remain strings. Unsupported types
raise `ValueError` naming their full field path. The successful dispatcher
fallback is removed. No model value is converted and no partial report is
returned. Containers belong outside the wrapper, with evidence for each leaf;
optional absence is `Evidenced[str] | None`, not a present wrapper holding null.
This is a documented compatibility change for custom Python schemas that
previously relied on unchecked value types.

The [controlled PDF study](https://github.com/antonsoo/fieldproof/blob/d2ed381946c956d153d5150b5fd61c95317953bf/studies/claim-types/README.md)
retains 26 actual fixture-extractor runs and two direct-Python mutation cases.
Eighteen cases now fail explicitly, including fifteen that previously returned
verified. Ten control reports remain identical. Model values remain unchanged,
and input/schema hashes match before and after within each tested environment.
The baseline object reports use Pydantic serialization solely for retention;
that does not imply the old report was standard-JSON serializable.

The [artifact receipt](https://github.com/antonsoo/fieldproof/blob/d2ed381946c956d153d5150b5fd61c95317953bf/studies/claim-types/verification.json)
records implementation `30496c6` from an unchanged 717-file archive. The source,
wheel, source distribution and fresh installations match all 37 Python files
and 23 bundled UI assets. Each complete Python suite passes 641 checks on
locked Python 3.12 source, a Python 3.11 installation with minimum direct
dependencies, and a Python 3.14 installation with current dependencies.
One real-OCR case is skipped in each because Tesseract is unavailable.
Lint, types, formatting, 62 web unit checks, both builds and 86 production
Chromium/Firefox browser checks pass.

All 28 replay outcomes, errors and reports agree across the three environments.
The current Pydantic version emits one different Decimal schema by omitting a
string pattern; both schemas are retained. This is an observed dependency
difference, not a schema change introduced by the repair. All three built-in
CLI reports are byte-identical before/after and across the three environments.
The previous 23-case string-kind source replay remains unchanged.

The UI assets are byte-identical to the preceding verified build. Custom types
remain a Python-library integration, without a new CLI or server selector.
The final evidence commit changes no tested runtime files. The locally built
artifacts carry version 0.2.7 and differ from the published package. Synthetic
controls do not estimate real-world extraction accuracy, and no live model or
provider acceptance check was performed.
