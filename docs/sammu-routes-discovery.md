# Find the same name at different pitches

Reviewed 3 November 2026. This entry extends the existing Sammû workshop rather
than creating a catalogue category or another project. A learner forks the
actual pitches after seven earlier bench moves, loosens twice on one branch,
and tightens five times on the other. Both reach embūbum. Their frequencies
differ uniformly in the workshop's explicit fourths-and-fifths realization.
Transposing only the heard B makes all nine strings agree; the raw branch
records remain available for comparison.

The number 2187/2048 is the modern model's exact calculation, not a pitch ratio
measured on an ancient instrument or prescribed by a tablet. The destination
name, the reconstructed procedure and the added numerical realization are
distinguished in the lesson and its [immutable review](https://github.com/antonsoo/sammu/blob/edc9a242021d0cc8c1df05f0849da73fbe61387c/docs/routes-review.md#the-learning-gap).
That review also links the subsequent navigation/transfer audit.

## Operate the discovery path

With the Sammû checkout beside Officina, build both sites, then run:

```sh
npm run test:sammu-routes-local -- ../sammu /tmp/claude-1000/officina-sammu-routes-local
npm run test:sammu-routes -- ../sammu /tmp/claude-1000/officina-sammu-routes-public
```

The first command serves both production builds locally. It explicitly redirects
the public workshop destination to the local build; it does not prove public
delivery. The second command uses the actual public catalogue and lesson and
requires the pinned review's public raw bytes to match its immutable Git object.
It follows the GitHub review by keyboard as well as checking its HTTP bytes.

Both modes run Chromium and Firefox at 1440px and 375px. They search `two roads`,
`transposition`, `same tuning`, `pitch identity` and `2187/2048`, copy and reopen
the search link, decode the actual thumbnail and follow the lesson by keyboard.
They operate transposition and all-nine playback, download the actual JSON and
illustrated HTML, then open the HTML from disk while offline. The reading must
make no HTTP requests; its native JSON download must equal the experiment's
record. Returning to source evidence must preserve the prior seven moves.

The source thumbnail is copied without modification. It retains its
[PolyForm Noncommercial notice](../public/thumbs/sammu-routes-LICENSE.txt), as
recorded in [ASSET_LICENSES.md](../ASSET_LICENSES.md). The catalogue footer says
"Code: MIT" so its code license is not applied to separately licensed screenshots.

## Evidence boundaries

Local discovery, actual public discovery, canonical hosted build bytes, immutable
source bytes and remote source synchronization are recorded separately. A
successful local redirect is not a hosted workshop receipt. An offline reading
opened from disk is distinct from service-worker navigation under real origin
failure, which is exercised in Sammû's own retained audit.

The public lesson may receive compatible updates while this review link stays
pinned. The journey verifies the exact local production edition shown in its
receipt and checks that the hosted lesson identifies that edition. It does not
establish speaker output, an ancient pitch standard or a historical instrumental
timbre. Audio is finite modern synthesis.

## Public delivery

The [actual search](https://antonsoo.github.io/officina/?q=two+roads#catalogue)
reaches the experiment. The [four final public journeys](../studies/sammu-routes/public.json)
operate edition `f18c535e5bafc0ed1b95c306c1c868a89475b94177a237b4ce1715bdac577e69`
in Chromium and Firefox at both widths. They retain exact records, check public
raw review bytes, and recheck both canonical entries after each journey. The
[initial public pass](../studies/sammu-routes/public-initial.json) records the
earlier edition before bench/practice reading licenses were made self-contained.

All [118 canonical files](../studies/sammu-routes/publication-bytes.json) match
the [clean build](../studies/sammu-routes/clean-build.json), including the new
thumbnail and notice. Five [immutable source artifacts](../studies/sammu-routes/source.json)
also match their Git objects. Build/source revision is
`89869b79d3236e91960bff0dbf70a2f322b9b598`; publication branch revision is
`18a890e65317606f4d134dc5b454e6fb741d4b7e`. Later changes to this review and
verification driver do not change that build.

The [full comparison after browser operation](../studies/sammu-routes/publication-after-browser.json)
again matches all 118 canonical files, as well as the bare entry URL before and
after its inventory pass.

The Node 24.22.1 clean installation passed lint, strict types, formatting, all
45 repository tests, and the production build; the 56 catalogue browser checks
also passed. These are local checks, separate from remote CI. The real public
search and operated-room screenshots were opened and inspected at both widths:
[desktop](assets/sammu-routes-search-desktop.png) and
[mobile](assets/sammu-routes-search-mobile.png). The source screenshot license
remains separate from the catalogue code license.
