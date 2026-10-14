# Local integrity corrections, 2026-10-13

Two current-checkout defects were reproduced and corrected. These are local
commits awaiting publication review; this record does not assert that GitHub,
PyPI or either hosted demo contains the changes. The catalogue's published
evidence links remain unchanged.

| Repository | Reproduction | Corrected behavior | Local code / evidence commits |
| --- | --- | --- | --- |
| Errorbars | A native 20-question COPA capture scored 60%; retaining only its 12 correct records scored 100% beside an unchanged 20-sample results declaration. Explicit-name imports could also overwrite the declaration. | Matching results counts are checked per selected filter; model aliases do not bypass them. Count mismatch rejects before analysis/export, and matching sidecars remain protected. | `3305216` / `b2375ec` |
| Veil | Real SDK request captures contained raw synthetic contacts in refusal fields/parts, legacy function arguments and custom-tool inputs. Complete replies left those fields unrestored. | Application history masks those text fields before transport. Complete output restores them; unchanged returned history replays the exact provider spelling. | `db481cc` / `a67a5b6` |

In the workspace, the full records are at
`errorbars/studies/lm-eval-cohorts/README.md` and
`veil/studies/chat-text-fields/README.md`. Each study has input/source hashes,
before/after observations, installed-artifact captures and a verification
receipt. Their READMEs include reproduction commands and explicit limitations.

Errorbars' 20 actual CLI workflows pass from installed wheels on Python
3.14.7 / NumPy 2.5.3 and Python 3.10.21 / NumPy 1.24.0. A fresh archive passed
710 Python tests, lint/typecheck, package builds, 691 web unit checks,
52 browser checks and 30 installed standalone-report checks.

Veil's 54 actual SDK/mock-transport workflows pass on Python 3.14.7 / OpenAI
3.23.0 and Python 3.10.21 / OpenAI 1.66.0. The baseline sent raw synthetic
contacts in 24 request bodies; the corrected captures contain none. Each
installed environment also passed 24 field-specific regressions. A fresh
archive including spaCy passed 666 Python tests with no skips, lint/format/
type checks, package/web builds and 16 browser scenarios. The 34 runtime
files byte-match the clean source, wheel, three installations and browser
manifest. The API transport and replies are controlled; no live inference
or production-server behavior is claimed.

Errorbars' count check cannot authenticate files or detect simultaneous edits
to samples and declarations. Missing native counts stay unchecked. Veil's
change does not make its detectors exhaustive or add custom/legacy streaming
output restoration. Both retain complete response and outgoing-history scope
in their studies.

The existing build commands are `cd errorbars/web && npm run build` and
`cd veil/web && npm run build`, each producing its own `web/dist/`. These
builds were checked locally and were not deployed. Tracking issues
`officina-59dg` and `officina-9l06` are closed with the retained evidence;
the local issue export has been refreshed.
