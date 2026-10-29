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

## Public edition: 29 October 2026

[Open Officina](https://antonsoo.github.io/officina/). The published source is
`e23e5d4a1b1196d4675430d56e1bd0e4ca71ea16`; the reviewed `gh-pages` commit is
`3172284827c39c0176449c9b4723b3a999c72713`. The clean Node 24.22.1 build and all
84 canonical public files agree, including the project data, illustration, fonts
and license notices. [Clean-build receipt](review/clean-build.json) and
[hosted file hashes](review/hosted.json).

[Eight public browser contexts](review/public-browser.json) cover Chromium and
Firefox, 1440 and 375 pixels, light and dark themes. Each follows all four selected
activities: changing the temple count; choosing and playing a Greek octave;
breaking a polygon-bound calculation; and inspecting a recorded trace's token cost.
Each also searches `intercolumnia` and `unequal lowerings`, checks the immutable
review text, downloads the temple reading and changes Pyknon's tuning preparation.
No accessibility violations or uncaught page errors occurred in the reviewed states.

Repository Actions are disabled, and the workflow list is empty. The legacy Pages
configuration points to the reviewed branch, but its latest-build endpoint returns
404. The successful canonical-file comparison and public browser replay establish
the serving result; no CI or deployment-workflow success is claimed for Officina.
[Publication details](review/publication.json).
