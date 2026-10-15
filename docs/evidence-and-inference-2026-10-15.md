# PDF visibility, binary inference and log identity, 2026-10-15

Three reproduced source defects now have published corrections and inspectable
before/after evidence. These records cover source and locally built artifacts;
registry releases and hosted deployments remain separate.

| Product | Reproduced behavior | Result | Implementation |
|---|---|---|---|
| Fieldproof | Invisible or clipping-only PDF text could verify a total that was not painted on the page | Explicit nonpainting text requires review and cannot establish row anchors, headers or document conventions | `e465ace` |
| Errorbars | Exact binary comparisons repeatedly manipulated observation-sized integer coefficients; the smallest representable two-sided tail could round to zero | Evaluate the same finite binomial distribution with normalized probabilities; retain `5e-324` and remove redundant validation scans | `4e1a399` |
| Logdelta | Application records with `log` and `time` could be unwrapped as Docker, discarding outer status fields and passing a false-clean exact watch | Share constrained wrapper recognition; preserve application objects and reject ambiguous wrapper metadata | `95ff304` |

The [Fieldproof study](https://github.com/antonsoo/fieldproof/blob/17a931ccad5a66743fa3aab977ca9271f50c8e8b/studies/unpainted-text/README.md)
retains 23 authored PDFs and 46 claims. Incorrectly verified claims fall from
18 to zero, with all 24 painted controls preserved. Twenty PDFium/Poppler pixel
comparisons match references with the alternate total omitted. All ten existing
PDFs retain their native text and geometry. Installed review workflows preserve
the automated review reason, a manual correction and an exported/restored
archive in Chromium and Firefox at desktop and phone widths. This checks
explicit text-rendering modes, not arbitrary pixel visibility; invisible OCR
layers also require review. Five real-Tesseract checks skip because a working
engine was unavailable.

The [Errorbars study](https://github.com/antonsoo/errorbars/blob/58797b48296b6bed6b0d560f072050d2c14535c7/studies/mcnemar-throughput/README.md)
uses an explicitly synthetic 1.6-million-row CSV and retains complete CLI
outputs. A 200,000-disagreement comparison kernel changes from 2.306 to 0.01264
seconds; variable full-CLI wall times do not establish a universal speedup.
Two repeated serial pairs retain CPU as well as wall time, including the
earlier contrary wall result. The finite probabilities agree with 4,368
independent rational/SciPy controls through one million disagreements. A retained
173-model SWE-bench snapshot preserves all 14,878 pair decisions under the
study's task-independence diagnostic; this does not establish task independence.
Bare installed wheels replay the CSV, and offline standalone reports preserve
the tiny positive probability through JSON and CSV downloads in both engines.

The [Logdelta study](https://github.com/antonsoo/logdelta/blob/f4530200b26853887641a4b4cab6ab6cd27a9263/studies/envelope-identity/README.md)
captures actual Python JSON Logger output with renamed fields and fixed,
constructed HTTP outcomes. All 19 CLI cases pass after correction, including
seven formerly false-clean novelty checks and a rate check that previously
counted only half the records. Rust 1.91 and 1.85 installations independently
replay those cases and all 26 prior container controls. All 280 retained
public-log reports remain byte-identical. Full WebAssembly reports match native
evidence, and offline desktop/phone browser downloads retain the recovered
outer status. The new detector adds ambiguity validation; a retained
100,000-record control measures 0.294 seconds before and 0.328 seconds after
on the shared host. Identically shaped application and transport objects remain
indistinguishable by content alone.

Pinned public-byte receipts cover all 141 changed implementation/evidence files:
[Fieldproof, 61 files](https://github.com/antonsoo/fieldproof/blob/17a931ccad5a66743fa3aab977ca9271f50c8e8b/studies/unpainted-text/results/publication.json),
[Errorbars, 42 files](https://github.com/antonsoo/errorbars/blob/58797b48296b6bed6b0d560f072050d2c14535c7/studies/mcnemar-throughput/results/publication.json),
and [Logdelta, 38 files](https://github.com/antonsoo/logdelta/blob/f4530200b26853887641a4b4cab6ab6cd27a9263/studies/envelope-identity/results/publication.json).
Each repository's remote branch head and final receipt bytes were also checked.
Issues `officina-i56c`, `officina-b7b5` and `officina-x6o8` are closed. No package
release, tag or manual hosted deployment is claimed here.
