# Discover the bell boundary in the public catalogue

Verified 2026-11-01 UTC. [Search for 269 Hz](https://antonsoo.github.io/officina/?q=269+Hz&audience=Ancient+world)
to find **Cross a label boundary; keep the bell pitches**. This is a specific
activity in the existing Shiguzhai project. Its general demo still leads to the
Piao-shi craft bench.

The workshop pins the [closing recovery audit](https://github.com/antonsoo/shiguzhai/blob/fa723942669e0b9b18c2b1c5e214d16d6529a434/docs/reference-audit.md#what-a-learner-can-do).
That source snapshot includes the reconnect-focus and stable-export-order
repairs and their local production evidence. Shiguzhai's separate
[public delivery review](https://github.com/antonsoo/shiguzhai/blob/82f9090/docs/reference-publication.md)
records its canonical bytes, actual native files and recovery with network
connections refused. No new repository or catalogue project was added.

## Actual public journey

Chromium and Firefox, at 1440 and 375 px, follow canonical URLs without response
interception:

1. Search **269 Hz**, **439.523**, **reference boundary**, **classification** and
   **石鼓寨**. The specific workshop appears; typing leaves the address unchanged.
2. Select **Ancient world**, explicitly copy the search link and reopen it.
   Both filters and the workshop return.
3. Follow the review with Enter. The immutable GitHub page contains the expected
   learner instructions. Its public raw file also byte-compares with the local
   commit's exact review bytes.
4. Follow the lesson with Enter. The actual public destination retains its
   `#reference`, bell I, 280/269 Hz observations and both precise A4 references.
   The comparison is visible on entry: nine held keys, ten current keys.
5. Hold 439.524 Hz and change the current reference to 439.523 Hz. The counts
   reverse while the source frequencies remain fixed. Open the complete source
   table and verify its actual image bytes.
6. Save a real HTML reading. It retains the newly operated comparison and has
   no script. No page error or checked document overflow occurs.

[Public browser receipt](shiguzhai-reference-public.json) ·
[Desktop result](assets/shiguzhai-reference-public-desktop.png) ·
[Phone result](assets/shiguzhai-reference-public-phone.png).

Service workers are blocked during catalogue discovery to obtain fresh network
delivery. The lesson's own review separately exercises active workers, both
rooms, offline recovery and new downloads. The catalogue journey does not infer
those behaviors from a working link or screenshot.

## Build and publication identity

| Evidence | Observed result |
| --- | --- |
| Catalogue source build | `7d2b7b9`, fresh archive and install under Node 24.22.1 |
| Current build output | 103 files, byte-identical to the reviewed catalogue output |
| Published Pages branch | `5c83cf4`, normal descendant of the existing branch |
| Canonical entry aliases | `/officina/` and `/officina/index.html` both match |
| Pinned lesson audit | `fa723942669e0b9b18c2b1c5e214d16d6529a434` |

[Clean-build receipt](shiguzhai-reference-closing-build.json) and complete
canonical byte inventories [before](shiguzhai-reference-bytes-before.json) and
[after](shiguzhai-reference-bytes-after.json) the public journey. Both inventories
check all 103 files and bracket their pass with the actual directory entry.
Prior hashed assets are preserved for cached entry pages.

General local checks passed lint, type checking, source formatting, catalogue
validation, 45 unit checks and the 44 general browser checks. The final specific
public journey above follows the exact closing audit pin. These are local and
browser observations; no successful remote source-CI run is claimed. No package
release or tag was created.

## Reproduce

With the sibling Shiguzhai checkout, installed Playwright browsers and Node 24:

```sh
npm ci
npm run build
node scripts/shiguzhai-reference-journeys.mjs /tmp/officina-bell-public --public
node scripts/verify-pages.mjs https://antonsoo.github.io/officina/ dist
```

Omit `--public` for the explicitly substituted local route. Its responses come
from local builds and immutable local review bytes; it cannot establish public
delivery. Both builds use `npm run build` with output directory `dist/` and their
existing `/officina/` and `/shiguzhai/` bases.
