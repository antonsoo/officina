# Physical geometry, recorded channels and native compressed inputs

Four existing tools now expose concrete corrections or input workflows.
Their cards link immutable studies and state material limits. Source, local
installed artifacts, canonical sites and registry releases keep separate evidence.

| Tool | Consequential result | Scope and limit |
| --- | --- | --- |
| Planisphere | Southern chart, compass, date/hour scales and wheel rotation now agree with an independent outward-looking sky projection. Of 2,668 checked printable positions, 1,164 exceeded tolerance before and none after | Nine latitudes and four alignments; northern controls unchanged. Physical printing and observing remain unverified |
| Horologium | Time-varying solar declination and bracketed crossings remove 90 false events. Single rise/set days remain usable, with marginal events explicitly withheld | 74 sites across 2026; 37,148 accepted event timestamps and 99 real reference crossings explicitly withheld as grazing. Terrain, weather and ancient-date accuracy remain outside this study |
| ToneMirror | Valid opposite-polarity stereo no longer replaces recorded speech with silence. Either chosen channel retains all 227 voiced frames and exact native PCM; independently routed clips can be imported separately | Constructed FFmpeg controls from attributed recorded Mandarin. Channel selection does not separate speakers or validate pronunciation |
| TraceLens | Open native Zstandard Collector JSON/protobuf without an external decompression step. All original 5,001 SDK spans remain inspectable, searchable and downloadable after disconnecting | Controlled local digest workload, no LLM calls or external telemetry. Corrupt input refuses atomically; codec resource limits and omitted trailing frames retain explicit limits |

Each project retains its producer/oracle records and its own verification:

- [Southern wheel geometry](https://github.com/antonsoo/planisphere/tree/1fef7f63e01f89297563746a983b0545e045ab5f/studies/sky-handedness)
- [Solar crossings and withheld boundaries](https://github.com/antonsoo/horologium/tree/122639f874a8f218dfe96894314ca9855a78b04d/studies/solar-events)
- [Recorded file channels](https://github.com/antonsoo/tonemirror/tree/129cd2f541bed48f8f5c0d0d7716c6ec03163df2/studies/file-channels)
- [Native compressed Collector exports](https://github.com/antonsoo/tracelens/tree/1e67140e7f08f08b87ede5facc145809d0539c53/studies/zstd-collector)

All four canonical demos match clean production builds, with actual public
Chromium/Firefox workflows at desktop and phone widths. Horologium and
TraceLens additionally have fresh packed consumers; the first also has a
verified pinned Git consumer, and the second runs its installed CLI on Node
20.0.0. No registry or tag release was made. The cards preserve the existing
historical-planet and unvoiced-gap discovery terms in their descriptions;
older studies remain in each source history.

TraceLens now [opens the original compressed capture directly](https://antonsoo.github.io/tracelens/?example=collector-zstd).
Its canonical file hash matches the retained Collector bytes. A visitor can
search and download the final tool span after disconnecting. This is an actual
controlled SDK workload, rather than a production incident or model response.

The [source receipt](../studies/geometry-audio-carriers/sources.json) compares
all four complete immutable study READMEs with their Git objects. The focused
catalogue replay searches for `polar sunrise`, `southern sky`, `stereo channels`
and `Zstandard Collector` in Chromium/Firefox at 1280/375px. It mocks no
application responses and repeats the searches offline.

[Before](../studies/geometry-audio-carriers/before/receipt.json), all sixteen
searches find zero cards. The [candidate replay](../studies/geometry-audio-carriers/local/receipt.json)
finds the intended card on every search, with clickable evidence/demo/source
links, no catalogue refetch, page error or document overflow. Existing `DE441`
and `unvoiced gaps` searches also retain their intended cards. Screenshots of
all four candidate cards were opened and visually reviewed. Layout and
thumbnails keep the existing visual system.

Source `7d5ed00` passes a fresh Node 24.21.0 / npm 11.19.0 install, lint,
strict types, formatting, all 38 unit checks and all 32 production browser
workflows. The [clean-build receipt](../studies/geometry-audio-carriers/clean-build.json)
finds all forty static files byte-identical to the working Node 26 build.
This validates the catalogue publication separately from each tool's studies.
