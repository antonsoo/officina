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
