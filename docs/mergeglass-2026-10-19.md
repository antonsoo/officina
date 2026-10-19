# Mergeglass: inspect the actual saved merge

The catalogue adds [Mergeglass](https://github.com/antonsoo/mergeglass), a local
Python CLI that compares an original base checkpoint, a saved PEFT LoRA adapter
and the actual merged safetensors. It reads the artifacts without loading a
model or requiring PyTorch. The entry exposes LoRA, BF16, update direction and
unrelated weight changes in local catalogue search.

The initial recorded study was pinned to source
[`23ed58c50765fc3720856eb84090a7840ce320c3`](https://github.com/antonsoo/mergeglass/tree/23ed58c50765fc3720856eb84090a7840ce320c3/studies/community).
For the unchanged public SmolLM2/SmolTalk adapter and pinned original base,
5,886,980 of 13,271,040 nonzero update entries remain numerically equal to the
BF16 base after a native PEFT merge: 44.36%. The FP32 merge leaves 105 entries
unchanged. All 60 adapted matrices have some observed change; all 212 unadapted
tensors match their cast bases. A separate dense PyTorch oracle checks the
saved artifacts, including counts, norms, signed projection and coordinates.
These weight-space counts do not measure lost energy or generation quality;
the original adapter training revision and quality remain unverified.

Two further native studies make the tool's interpretation explicit:

- [Failure controls](https://github.com/antonsoo/mergeglass/tree/23ed58c50765fc3720856eb84090a7840ce320c3/studies/merge-controls):
  correct, repeated, reversed and wrong-adapter merges all change every adapted
  entry. Signed projection and cosine expose their differing magnitude and
  direction. The producer, rather than the auditor, establishes their causes.
- [Mixed target orientation](https://github.com/antonsoo/mergeglass/tree/23ed58c50765fc3720856eb84090a7840ce320c3/studies/orientation):
  native GPT-2, OpenAI GPT and ImageGPT exports can hide Conv1D targets behind
  `fan_in_fan_out=False`. Known metadata now causes an explicit refusal instead
  of a misleading Linear reference; ordinary Linear heads remain accepted.

The initial thumbnail was a crop of the tool's real terminal capture, explicitly labelled
as a synthetic PEFT rounding control. It illustrated the CLI; the public model
numbers come from the linked study, whose full input hashes and reproduction
commands are retained. No third-party model weights are in either repository.

## Publication boundaries

Mergeglass source is public on GitHub. Its three-command quickstart was run
from a fresh public clone, and the orientation refusal was exercised after
pulling the corrected revision. A clean source archive, separately installed
wheels and the native producer/oracle workflows have separate evidence.
There is no PyPI release or hosted Mergeglass application, so the catalogue
entry has neither a package-registry link nor a live-demo link.

The catalogue data and thumbnail passed the existing type, lint, format,
catalogue and build checks, 38 unit/verification cases and 32 browser cases.
The [canonical publication receipt](../studies/mergeglass/results/publication.json)
verifies all 41 build files, plus the entry URL before and after the pass.
The deployment is `6a80141` on `gh-pages`; catalogue source is `4c86557`.

The separate [public browser receipt](../studies/mergeglass/results/browser.json)
records Chromium and Firefox at 375px and 1280px. LoRA, BF16 and wrong-direction
queries each find the actual card; its exact description, finding, immutable
study link and source URL match the local catalogue. The thumbnail decodes at
1200x750 and its HTTP bytes match the source image hash. Screenshots retain the
actual public desktop/mobile card. Neither browser shows a package or demo link.

Reproduce those public checks after `npm ci`:

```sh
node studies/mergeglass/browser.mjs https://antonsoo.github.io/officina/ /tmp/officina-mergeglass-browser
```

## Precision and reference-energy update

The current catalogue record points to
[`e0eca864fd03f4dce907eec9e622940d07e5a2f8`](https://github.com/antonsoo/mergeglass/tree/e0eca864fd03f4dce907eec9e622940d07e5a2f8/studies/community).
It compares native FP32, FP16 and BF16 exports of the same unchanged public
adapter. The original FP32/BF16 output file hashes reproduce exactly. Among
13,271,040 nonzero intended update entries, FP16 leaves 7.34% unchanged and BF16
leaves 44.36% unchanged. Those positions contain 0.1044% and 15.05%, respectively,
of the complete reference update's squared norm. The card now separates the
entry count from the magnitude-weighted fraction.

The same source retains [actual forward measurements](https://github.com/antonsoo/mergeglass/tree/e0eca864fd03f4dce907eec9e622940d07e5a2f8/studies/forward):
on six authored texts with 146 observed prefix positions, merging changes zero,
one and six greedy next-token choices under the recorded FP32, FP16 and BF16
runtime conditions. These are numerical probes; they do not measure task quality.

The updated thumbnail is the tool's actual public SmolLM2 BF16 terminal capture,
with all 60 adapted matrices, 272 checked tensors and the aggregate squared-norm
measurement. The installed audit reads 540,004,492 input-file bytes at 61.24 MiB
peak process RSS on the recorded host without PyTorch. The earlier publication and screenshots above remain
historical records of the initial entry. The revised data and image have a
separate canonical-byte and browser verification record.
