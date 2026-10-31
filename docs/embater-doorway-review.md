# From a searched word to an architectural experiment

Two Embater workshops extend the existing ancient-world catalogue. These entries
point into the same working doorway room, with separate questions and search terms.

| Entry | Question | Search examples |
| --- | --- | --- |
| A half changes the doorway | How does a supplied Latin half change the opening under the same ceiling? | `semis`, `thyromaton`, `θύρωμα`, `antepagmentum`, `supercilium` |
| Almost a double square | What remains different when one reported Erechtheion dimension is matched? | `Erechtheion`, `double square`, `4.882`, `later linings` |

The first room compares 20 and 16 Roman feet under a 28-foot ceiling, lets the
learner try upper-corner positions and preserves the text's contraction bands.
The survey desk keeps the 1927 report's 4.882 m height and 2.427 m lower width;
an exact double square leaves 14 mm of width or 28 mm of height difference.
The report's omitted later linings remain explicit. It is a comparison with a
historic survey's interpretation, not a new measurement of today's opening.

Each entry has a thumbnail derived from an actual browser screenshot, a native
lesson link and an immutable 40-character source-review revision. The survey
entry uses the semantic `#measured-doorway` anchor, which does not reset the
learner's drawing. Working the lesson or search field does not silently rewrite
the URL; the explicit copy actions produce shared links.

## Reproduce the journey

With a production catalogue preview running:

```sh
npm run test:embater-doorways -- http://127.0.0.1:4494/officina/ /tmp/officina-doorway-review
```

The driver opens Chromium and Firefox at 1440 and 375 px. For both workshops it
searches the listed words, copies and reopens the search link, follows the
pinned review by keyboard and byte-compares its unauthenticated raw copy with
that exact git revision. It then follows the lesson by keyboard, operates the
relevant model, opens the original source page and saves a real illustrated
reading. All four embedded source-image hashes must match the retained pages.
The doorway and survey entries remain distinct even when a project-level
search matches both.

The [local-catalogue receipt](review/embater-doorways/local-catalogue.json)
records eight continuous local-catalogue to public-lesson journeys. It is not a
public-catalogue publication claim. Build output and public-catalogue verification
are recorded separately when that catalogue edition is published.

## Independent build

A fresh git archive of `e4959193e7608314a98a7f90b8afc0eadd1523f3` was installed
under Node 24.22.1. Lint, typecheck, source formatting, all 45 tests and the
production build passed. All 102 generated files byte-match the working build.
The [clean-build receipt](review/embater-doorways/clean-build.json) retains the
inventory. The final catalogue pins Embater review
`db1abef0c1885407e764aa4618431f9d2d2ab29d`; the earlier local journey receipt
used its ancestor `de85d41bd727ad363e3c4dacbf3a718a33b5be3f` before the public
publication section was added. The lesson code is unchanged between those
review revisions.
