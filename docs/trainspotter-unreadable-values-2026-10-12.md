# Trainspotter: unreadable values must interrupt trajectory evidence

Pushed source at
[`44c5379`](https://github.com/antonsoo/trainspotter/commit/44c5379f404d7016eb3ae49ef4d2e99fa0748429)
keeps unreadable metric cells at their recorded steps instead of silently
joining the surrounding readings. This removes unsupported cross-gap findings
and recovers valid findings inside later intact segments.

| Retained case | Baseline | Corrected source |
| --- | --- | --- |
| Text-export fault applied to retained PyTorch capture | Setback 70-100 and isolated spikes 70-71 | Three finite segments; no cross-gap claim |
| First high value after unreadable readings | Loss spike at step 70 | No invented earlier local baseline |
| Recovery after another unreadable region | 30-step setback | No recovery interval through either gap |
| Constant levels separated by unreadable readings | Diverged across steps 0-109 | Separate finite segments |
| Genuine recovered event after a gap | Missed | 20-step setback, steps 100-120, within segment 40-159 |
| Intact finite and observed-NaN controls | Setback / non-finite alert | Complete JSON reports and gates unchanged |

The incomplete-input gate already exited 2. This fixes the diagnoses and plotted
connections, not a previously green gate. An unreadable value is not an observed
NaN: pointwise non-finite alerts still use the original numerical observations,
including at repeated steps where unreadable and observed values coexist.
Sparse blank/null cells and text-only columns keep their existing meaning.

CSV, JSONL, Hugging Face, W&B, Lightning and known TensorBoard scalar decoding
failures retain these boundaries. TensorBoard restart purging also removes
obsolete unreadable positions. Numeric counts still govern source selection.
JSON adds the affected metrics' `unreadable_steps`; HTML shows separate curve
segments, region markers and a keyboard-accessible download of every unreadable
coordinate. Entire undecodable rows and missing step values still cannot be
placed on a guessed axis.

The [retained study](https://github.com/antonsoo/trainspotter/blob/44c5379f404d7016eb3ae49ef4d2e99fa0748429/studies/unreadable-values/README.md)
documents seven actual CLI cases. The text-export fault changes exactly 20 NaN
cells in a retained controlled CPU PyTorch capture to `LOGGER_ERROR`; other
bytes remain unchanged. This is an explicitly synthetic export fault, not a new
training run or a naturally occurring logging incident. The intact original
capture remains a positive NaN control.

All 4,259 cached revision-pinned public-log report/error records are
byte-identical before and after: 4,177 reports and 82 unreadable inputs.
The aggregate input hash matches the earlier corpus evidence. This is a
compatibility replay of historical data, not a new crawl or accuracy estimate.

Clean Python 3.10, 3.12 and 3.14 environments and the declared minimum direct
dependencies each pass 578 checks. Ruff, strict mypy and package builds pass.
A separately installed wheel reproduces all seven CLI cases, with all 28
Python source files matching the clean archive. A small follow-up fixes three
pre-existing Python 3.10/NumPy typing errors using local array annotations;
the source syntax trees are otherwise unchanged. The receipts distinguish that
package revision from the earlier corpus/browser revision.

The full suite passes 204 Chromium/Firefox report workflows at desktop and
320px. Sixteen separate before/after workflows open the actual CLI HTML files
while offline at 1440/375px, verify the findings, plot segments and real JSON
downloads, and record no HTTP requests, page errors, CSP or axe violations, or
page overflow. All eight retained screenshots were opened and reviewed. The
artifact receipt also verifies 84 build/check inputs.

The [public-source receipt](evidence/trainspotter-unreadable-values-2026-10-12.json)
compares all 44 changed pinned public files against the clean checkout and checks
HEAD against remote main. The source push used the documented workflow-skip
marker; the observed gh-pages ref remains
`62d47fa508e7b47afdc6816f0a3310a1cf97a400`. No package release, tag or hosted
deployment was performed. Browser evidence applies to the retained standalone
HTML files, not the hosted demo.
