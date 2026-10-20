# Find the parsed JavaScript identifier workflow

The Ghostchars source upgrade inspects decoded JavaScript identifier names,
including Unicode escapes. Its native Node controls contain distinct variables
that print `[10, 20]`: raw scanning misses their confusable names, while the new
parser reports 124 exact source spans across 31 executable controls. Parsing
keeps original source ranges and does not resolve lexical scope or rename code.

The catalogue's recorded-evidence link now opens the
[immutable native study and source-install instructions](https://github.com/antonsoo/ghostchars/blob/3c95cad49cb464b4bf5e9795f6b618415985b63f/studies/javascript-names/README.md).
Its public bytes match the corresponding Git object. The card labels this a
source upgrade; the npm link and hosted scanner identify separate artifacts.
The earlier [public prompt census](https://github.com/antonsoo/ghostchars/tree/3c95cad49cb464b4bf5e9795f6b618415985b63f/studies/prompt-census)
remains available in the same repository.

| Search | Previous matches | Updated local matches |
| --- | ---: | ---: |
| `escaped identifiers` | 0 | 1, Ghostchars |
| `JavaScript controls` | 0 | 1, Ghostchars |

The existing browser replay exercised both searches in Chromium and Firefox at
1280 and 375 pixels. It checked the exact evidence URL, usable card links,
overflow and page errors, then repeated filtering offline without another
catalogue request. Both retained screenshots were visually inspected.

Only the Ghostchars card's evidence text and URL changed. All 40 other static
files match the previous build, whose 41 files were independently compared with
the canonical public site before editing. The parser, search implementation,
other 17 cards, package link and demo link are preserved byte for byte or field
for field as applicable.

The [source identity and browser receipts](../studies/javascript-name-search/)
record these checks separately from deployment. Reproduce the catalogue build
with `npm run build`; it emits `dist/` with base `/officina/`. The focused replay
uses the existing runner:

```sh
node studies/planet-and-speech-search/replay.mjs BASE_URL OUTPUT after studies/javascript-name-search/cases.json
```
