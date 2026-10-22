# Four ancient readings

Published runtime/catalogue revision: `77f507ea5e1bcea50bcbc0fcee3c078dedc9aec3`.
All 45 canonical files and the directory entry matched the clean build. Sixteen
local-catalogue journeys and sixteen public-catalogue journeys reached the
intended lesson and pinned evidence heading. The
[publication record](evidence/ancient-readings-2026-10-21/publication.json)
separates those observations from source and Pages commits.

The catalogue now has 22 projects. Shiguzhai adds an ancient Chinese collection
with a particularly revealing modern classification problem. The three existing
Greek and Roman projects open their new lessons directly, instead of leaving
readers to discover them from the older home pages.

| Project | Entry point | What the learner changes or inspects |
| --- | --- | --- |
| Shiguzhai | Ten bronze bells, all 87 listed frequency entries, A4 at 439 Hz | Reset to 440 Hz: nearest modern key coverage changes from nine to ten while every measured point stays fixed |
| Pyknon | The three pitches over the syllable φαί in Seikilos's song | Inspect the museum photograph, read the Greek word and hear the verse |
| Gonia | Six eustyle columns across an 18 m front | Remove the wider central passage: the fixed front forces a larger diameter |
| Stoicheia | I.16's second midpoint construction | Compare the two diagrams hidden in the word “similarly”; inspect Heiberg's Latin page 45 |

These are specific evidence-led lessons. The bells' key count is a modern
classification of both A and B entries, not a claim that ancient players used
equal temperament. Seikilos playback uses modern tones and retains the final
pitch disagreement. Gonia keeps the Latin text's central allowance and height
ratio. Stoicheia distinguishes a complete construction from an impossible
supposition and supplies no invented Latin for the Greek-only I.15 corollary.

The thumbnails are real browser captures. `scripts/ancient-thumbnails.mjs`
records their public URL, viewport, framing selector and SHA-256. The Seikilos
photograph and the resulting thumbnail retain CC BY-SA 4.0 with attribution in
`public/thumbs/ATTRIBUTION.txt`; the other three screenshots contain original
diagrams and public-domain texts. Shiguzhai's chart uses the article's published
measurement data, with the source credited separately from any museum imagery.

## Following the links

`scripts/ancient-journeys.mjs BASE_URL OUTPUT_DIRECTORY` walks all four journeys
in Chromium and Firefox at 1280 and 375 pixels. It searches the catalogue,
decodes each thumbnail, uses the keyboard to follow the demo, exercises the
specific interaction above, returns to the catalogue and opens the pinned
evidence heading. GitHub's fragment scroll must happen through native
navigation; the script does not move the heading into place itself.

Older searches for “tetrachords”, “Doric” and “bisection” continue to find their
projects. The old Pyknon and Gonia journey commands delegate to the current
destinations; their previous receipts remain historical records.

Source revision, clean-install checks, local browser workflows, canonical
publication bytes and public journeys are recorded separately in
[`evidence/ancient-readings-2026-10-21/`](evidence/ancient-readings-2026-10-21/).
The Pages workflow retains earlier hashed assets and uses a normal branch push
so readers with an older entry page can still load its referenced files.
