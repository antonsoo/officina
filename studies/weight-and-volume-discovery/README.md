# Find the weighted strings and pyramid dissection

The catalogue now opens two newly published experiments: Seked's nine-piece
square frustum and Pyknon's Nicomachus weighted-string comparison. Both cards
have real screenshots, specific findings and full immutable evidence links.
The source lessons and public editions were separately verified in their own
repositories before these catalogue destinations changed.

| Search | Card | Operable discovery |
| --- | --- | --- |
| frustum; Moscow papyrus; Touraeff | seked | Keep the recorded 4,2,6 calculation while changing a nine-piece solid |
| weighted strings; Nicomachus; ισοστροφους | pyknon | Repair the replacement weights while keeping the source claim visible |

The [before receipt](results/before.json) records 24 real hosted searches:
all six queries returned no card in Chromium/Firefox at desktop/phone widths.
The [local replay](results/local.json) returns the intended single card for
each query, with no new catalogue requests during loaded-page offline
refiltering, no page errors, no document overflow and working card links.
This loaded-page refilter does not claim an offline catalogue reload.

The [eight complete keyboard journeys](results/local-journeys.json) go from
search to the actual public lesson, operate its controls, inspect printed
source pages and download a complete native reading. They then revisit the
older Rhind and Aristoxenus/Ptolemy workflows and reach the intended pinned
GitHub heading. Existing source terms remain searchable. The primary demo
and evidence link intentionally select the new lesson.

For Seked, the user changes the top side and obtains volume 74 while the
recorded products remain 16,8,4; the retained editor note and original Rhind
readings are still reachable. For Pyknon, the user changes load 12 to 24,
hears and stops the comparison, reads Meibom's translation difference, and
retains the earlier rhythmic and string-uniformity lessons.

The [linked-source receipt](results/linked-source.json) compares both actual
remote documents with the exact local Git objects named by the cards.
The [thumbnail receipt](results/thumbnails.json) records actual public URLs,
viewport, frame anchor and SHA-256; images were visually inspected. Both are
original MIT diagrams, with source notices in `public/thumbs/ATTRIBUTION.txt`.

```sh
npm ci
npm run build
npm run preview -- --host 127.0.0.1 --port 4196 --strictPort
# In another terminal:
node scripts/replay-native-workflow-search.mjs \
  http://127.0.0.1:4196/officina/ /tmp/weight-volume-search after \
  studies/weight-and-volume-discovery/queries.json
node scripts/ancient-journeys.mjs \
  http://127.0.0.1:4196/officina/ /tmp/weight-volume-journeys seked,pyknon
```

The current source, installed build and hosted catalogue are separate
publication boundaries. Subsequent evidence is recorded below when available.

## Published and checked

Source `4b1a9a2` contains the two catalogue records, new thumbnails and updated
journey programs. The fresh Node 24.22 `npm ci` build has **66 files**, all
matching the checkout byte for byte. Forty existing tests, lint, typecheck and
format checks passed. [Build identity](results/build-identity.json).

Main, including that receipt, was pushed at `6fbe614`. The existing Pages branch
was overlaid with the reviewed build and pushed normally as
`e4347d0bc6a284729602de20ac486298faa288a2`, retaining older assets. All **66
canonical public files** returned their exact expected hashes and HTTP 200.
[Hosted file identities](results/hosted-files.json). No CI result is asserted.

The actual [public catalogue](https://antonsoo.github.io/officina/) then passed
all **24 new search cases** and **eight complete keyboard journeys** in Chromium
and Firefox at 1280 and 375 px. The destinations operated the hosted lessons,
saved their actual native packets, retained earlier lessons and reached their
pinned GitHub evidence headings without manual scroll correction.
[Public searches](results/public.json) · [Public journeys](results/public-journeys.json).
