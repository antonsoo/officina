# Fieldproof: a candidate name is not a date

Source [`27ae6c7e2e473e8d5b503a66a42d53465820866f`](https://github.com/antonsoo/fieldproof/commit/27ae6c7e2e473e8d5b503a66a42d53465820866f)
is pushed and matches remote `main`. All 20 changed files (422,680 bytes)
match their pinned public raw URLs. The
[publication receipt](evidence/fieldproof-string-kinds-2026-10-13-public.json)
retains sizes and SHA-256 hashes. Tags and `gh-pages` are unchanged. No PyPI
release or hosted deployment accompanies this source update.

At baseline `6ec047d`, an exact quote supporting `candidate_name = "Example
Works"` failed calendar-date validation. The engine searched for `date`
anywhere in the full path, affecting `updated_by`, `validate_status` and
ordinary names inside date-related objects. The same substring also disabled
requested text tolerance and added unrelated date-conflict explanations.

| Controlled case | Baseline | Current source |
| --- | --- | --- |
| Exact candidate name or updater name | Invalid-date warning | Verified as text |
| Ordinary name under a date-related object | Invalid-date warning | Verified as text |
| `effective` with explicit date intent and invalid calendar value | Generic string check accepts it | Explicit date check requires review |
| `effective` with ISO claim and written date evidence | Generic string check rejects it | Explicit date check verifies it |
| `date_label` with explicit literal-text intent | Invalid-date warning | Text check verifies it |
| Built-in invoice, receipt and contract fixtures | Existing reports | Byte-identical reports |

New `EvidencedDate` and `EvidencedText` wrappers declare custom-schema intent
while retaining the existing claim JSON shape. Reports record `declared_kind`,
including unsupported claims. It is separate from tolerance notes so a
correctly supported text field can still supply a row-location hint. JSON
cannot override the schema's kind.

Generic `Evidenced[str]` now uses complete date/dates/birthdate(s) words in
the final named member, including snake_case/camelCase forms. Positional
indices retain collection names; ancestor names no longer impose a kind on
their descendants. Custom names such as `issuedate`, and date-valued mappings
with arbitrary keys, should declare `EvidencedDate` explicitly. This migration
is documented; naming conventions cannot establish business meaning.

The [controlled PDF study](https://github.com/antonsoo/fieldproof/blob/27ae6c7e2e473e8d5b503a66a42d53465820866f/studies/string-kinds/README.md)
retains two labelled synthetic PDFs and 23 cases through the real fixture
extractor, PDF loader, verifier and JSON roundtrips. All input hashes stay
unchanged; five control reports remain identical. All 22 previously located
fields retain their source text, page and exact rectangles. Explicit-kind
comparisons deliberately add a schema declaration: their baseline uses
generic string wrappers. They do not claim the old schema already expressed
that intent.

The [artifact receipt](https://github.com/antonsoo/fieldproof/blob/27ae6c7e2e473e8d5b503a66a42d53465820866f/studies/string-kinds/verification.json)
records implementation `bd1aa39` from a clean 707-file archive. Each full Python
suite passes 612 checks on locked Python 3.12 source, a fresh Python 3.11 wheel
installation with lowest direct dependencies, and a fresh Python 3.14 wheel
installation with current dependencies. Each skips one real-OCR case because
Tesseract is unavailable. Lint, types, web formatting, 62 web unit checks,
both builds and 86 production-browser checks pass.

The wheel, source distribution and both installations match all 37 Python
files and 23 UI assets. Those UI assets remain byte-identical to the preceding
build. All three built-in CLI reports and JSON Schemas match their baselines
under every tested environment. The prior 15-case extraction-boundary outcomes
and ten container records remain unchanged.

Actual SDK streaming tests exercise Anthropic 0.77.0, 1.11.0 and 1.13.0 with
synthetic HTTP responses. No live provider or model is called. Custom kinds
remain a Python-library integration; the CLI/server selector still exposes
the three built-in schemas. Local artifacts carry version 0.2.7 and differ
from the previously published package. The final documentation/evidence commit
changes no tested runtime files.
