# Find full saved-module audits and native offline W&B runs

Two catalogue entries now expose full saved-module auditing and native offline
W&B analysis.

Mergeglass checks full PEFT saved modules as well as LoRA/DoRA factors and
embedding adapters. In the linked public BF16 control, restoring the original
full embedding/head tensors leaves all 210 low-rank measurements unchanged but
produces 39,791,249 saved-weight mismatches. The study separately retains native
captures, independent dense calculations, installed-package checks and actual
saved-model reloads. These are numerical observations, not model-quality claims.
[Immutable full-module study](https://github.com/antonsoo/mergeglass/tree/af4179b9fe36051b7a92219524bee0903b042213/studies/saved-modules).
The earlier DoRA row-norm study remains in
[the recorded source](https://github.com/antonsoo/mergeglass/blob/0185bce474256441f8c84fa3bcdc2ee67190e6ef/docs/dora-rows.md).

Trainspotter reads original offline `.wandb` files before an account or sync.
Four recorded NumPy optimizer runs contain 400 history packets that agree with
independent SDK/Go decoders. Explicit missing loss and text `"NaN"` stay gaps;
actual overflow stays observed divergence. The separate live browser workbench
uses the pinned engine with a pure Python protobuf runtime, preserves native
file identity and permits real chart downloads from its sandboxed preview.
[Immutable published browser study](https://huggingface.co/spaces/antonsoloviev/trainspotter/blob/d29692cfe4f3dd7a0e3fbcdc989c0f335874f256/evidence/wandb-browser/README.md).
Its 92-file publication audit and 52 native workflows / 148 actual SVG downloads
are separate from any registry release. The earlier
[native MLflow scope study](https://github.com/antonsoo/trainspotter/tree/5b8b817705d698f700bf8b4e5e61f1eb0ba4ea4f/studies/mlflow-scopes)
also remains available.

| Search | Previous public matches | Verified local matches |
| --- | ---: | --- |
| `.wandb` | 0 | 1, Trainspotter |
| `saved heads` | 0 | 1, Mergeglass |

The existing browser replay checked both searches in Chromium and Firefox at
1280 and 375 pixels. It checks the exact study URL, usable links, overflow and
page errors, then refilters offline without another catalogue request. All four
captured desktop/phone images were visually inspected. The linked studies were
independently byte-matched to their immutable verified source.

Only two descriptions and their evidence fields changed. The other 16 cards
are equal, and all registry, demo, Space and thumbnail fields remain equal.
Only `projects.json` changes in the 41-file production build; its other 40 files
match the previous build exactly. The previous canonical site was byte-checked
before editing. The card labels distinguish the source/live-workbench features
from the linked registry release.

[Retained source identities, build comparison and browser receipts](../studies/saved-head-and-wandb-search/).
The production command is `npm run build`, producing `dist/` at base `/officina/`.
Reproduce the focused checks with:

```sh
node studies/planet-and-speech-search/replay.mjs BASE_URL OUTPUT after studies/saved-head-and-wandb-search/cases.json
```

The clean `3969b4e` archive passed install, lint, formatting, all 38 existing
checks and the production build. All 660 tracked files matched Git and its
41 built files matched the locally exercised artifact. The normal Pages push
`c1ddd46` -> `11a34eb` changed only `projects.json`. On 2026-10-20 the canonical
site matched all 41 build files and both entry aliases, then passed all eight
searches in both engines/widths and offline refiltering. Its four captured images
were also visually inspected. Both queries now return the expected public card
and exact immutable evidence link. The 13 changed source files were independently
fetched from immutable public URLs and matched to Git object bytes.
