# Redesign and publication review

The opening now presents four specific activities, led by a comparison of Vitruvius's
column-count prescription with recorded temples. The full collection follows as a
searchable, ruled index. Anthony Mercer is named in the masthead, with GitHub and
PRAVIEL links. The job-title and location biography has been removed.

EB Garamond supplies the large questions and wordmark; Hanken Grotesk supplies the
controls and records. Both are local, licensed font files. The main illustration
is a screenshot of the actual Embater comparison, not a generated reconstruction.
Light and dark themes, keyboard focus and the 375-pixel layout remain operable.

## From discovery to evidence

The selected work opens Embater's column comparison, Harmoniai's Greek names,
Stoicheia's circle argument and TraceLens. The new searches `intercolumnia` and
`unequal lowerings` open particular activities. Their reviews are pinned to the
implementation revision. The Harmoniai review corrects the prior claim that exact
meetings necessarily imply equal srutis; the counterexample retains the seven
meetings with unequal lowerings and pure consonances.

Search and audience controls remain mounted during updates. Typing leaves the URL
alone; Copy search link is explicit. Incoming catalogue anchors are restored after
the asynchronous catalogue load, when the selected work has its final height.
The skip link focuses the index heading without outlining the whole long index.

## Verification

The existing browser suite checks keyboard search, audience filters, explicit
sharing, retry behavior, phone widths and accessibility in Chromium and Firefox.
The publication review separately follows the selected activities and new source
terms into the public tools. Receipts in `review/` distinguish clean builds, hosted
file equality and browser operation. A successful local build is not a CI result.

The earlier catalogue guide is retained as a dated archive; its old design and
publication details are historical. The main README describes the current page.

The local regression suite passed all 44 browser cases and 45 data/publication
tests. The added `scripts/selected-journeys.mjs` operates all four selected projects
and the two new source-term routes; it also checks the public pinned review text.
A first desktop pass succeeded before the catalogue was published.

The pending name/email updates were separately audited and pushed in 28 repositories
(120 files). Every changed file was the exact replacement of the prior author name
and email; remote source heads were checked after each push. The
[publication record](review/identity-publication.json) names the commits and files.
This record establishes source publication, not rebuilt packages or updated Pages
for those 28 repositories.
