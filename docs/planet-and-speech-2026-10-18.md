# Historical planets and visible speech gaps

Two catalogue cards now point to new, immutable implementation studies.
The findings are searchable alongside each tool's description. Their limits
remain in the card: historical civil-time conversion is omitted from the
planet model; corrected pitch drawings do not validate pronunciation.

| Tool | Concrete change | Retained measurement |
| --- | --- | --- |
| Horologium | Select JPL Tables 2a/2b outside the 1800–2050 CE fit, with matching Earth coefficients and required Jupiter/Saturn terms | At 256 dates outside the modern fit, maximum Saturn longitude error falls from 30.4765 to 0.3833 degrees against geometric DE441. All 13,775 retained modern controls stay identical. Two zodiac-sector disagreements remain |
| ToneMirror | Stop aligned pitch strokes where either source clip has an observed unvoiced gap | Fresh extraction from 580 recordings and two detectors removes 17,170 unsupported connections. Alignment paths, costs, scores and feedback stay identical. This does not improve the pitch detector or establish pronunciation accuracy |

The [Horologium study](https://github.com/antonsoo/horologium/tree/c8c9d2b9885dbaa7ac58f62eca09ef73e400767f/studies/long-range-planets)
retains 30 original Horizons responses, an independent ERFA/NumPy oracle,
model boundaries and discontinuities, fresh packed/Git consumers and public
browser checks. The source chooses a conservative January 1 endpoint
convention. Ancient dates use nominal model time; apparent-place effects
and historical Earth rotation remain omitted. The model is approximate,
and dates beyond 3000 BCE–3000 CE remain illustrative.

The [ToneMirror study](https://github.com/antonsoo/tonemirror/tree/d8513a3758f216a4d80ab4e1b23a82080c64e68a/studies/contour-gaps)
retains actual detector output and native canvas calls with recorded Mandarin
and PTDB-TUG speech. Sixteen public offline comparisons have zero unsupported
connections, down from 208 before. The four public screenshots match the
reviewed local screenshots byte for byte. No recorded pitch measurements
were redrawn for the evidence.

Both canonical demos match their clean production builds. Horologium's npm
0.2.3 release is unchanged and lacks the new planetary namespace; its README
provides a verified pinned Git install. No registry release was made for this
catalogue update. The earlier Chinese/HKO and recorded-practice studies
remain available in the projects' source histories.

The [source-link receipt](../studies/planet-and-speech-search/sources.json)
fetches both immutable README files and compares their complete bodies with
the published Git objects. The focused replay runs real catalogue searches
for `DE441` and `unvoiced gaps` in Chromium and Firefox at desktop and phone
widths, then repeats filtering offline. It mocks no application responses.

```sh
node studies/planet-and-speech-search/replay.mjs https://antonsoo.github.io/officina/ /tmp/planet-and-speech-search after
```

The [baseline replay](../studies/planet-and-speech-search/before/receipt.json)
finds zero cards for either query across eight public searches. The
[local candidate](../studies/planet-and-speech-search/local/receipt.json)
finds the intended card on all eight searches and after offline refiltering.
Evidence and demo/source links remain clickable, with no page errors,
additional catalogue requests or document overflow. The four actual
candidate screenshots were opened and visually reviewed. The existing
recorded-evidence browser checks pass in both engines.

Source `ba60b33` passes a fresh Node 24.21.0 / npm 11.19.0 install, lint,
types, formatting, all 38 unit checks, the two focused recorded-evidence
browser checks and the production build. The [clean-build receipt](../studies/planet-and-speech-search/clean-build.json)
finds all 550 archived files intact and all forty generated files identical
to the working build.

Pages `ae9917b` publishes exactly that build. All [forty canonical files and
both entry checks](../studies/planet-and-speech-search/hosted-bytes.json) match;
all [38 previous assets](../studies/planet-and-speech-search/preserved-assets.json)
remain byte-identical. Only `projects.json` changed in the deployed branch.
The [live replay](../studies/planet-and-speech-search/hosted/receipt.json)
passes all eight searches and eight offline refilterings, with no page
errors, catalogue refetches or overflow. All browser records match the local
replay, and all four public screenshots were visually reviewed. Three are
byte-identical; the fourth differs only in a two-pixel-high thumbnail-edge
band, as retained in the [paired comparison](../studies/planet-and-speech-search/hosted-comparison.json).
The separate [publication receipt](../studies/planet-and-speech-search/publication.json)
keeps these catalogue checks distinct from each tool's measurements. No
registry release or successful GitHub Actions run is implied.
