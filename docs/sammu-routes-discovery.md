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
