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

## Public discovery and publication

The catalogue and both workshops are public. Source main commit
`9cfa0fafc7d531ffa5ba96f10cff7bf720352d84` contains the reviewed entries. Pages
commit `2d5cb1ed0b54435ca0248f88e78f605ee51fdc00` is a normal fast-forward of
the previously published Pages branch, copied from the independent build.

| Boundary | Recorded result | Receipt |
| --- | --- | --- |
| Canonical catalogue before discovery | All 102 files and root match the reviewed build | [Before](review/embater-doorways/public-bytes-before.json) |
| Continuous public discovery | Eight journeys; both engines, both widths, both workshops | [Public journeys](review/embater-doorways/public-journeys.json) |
| Pinned primary/model review | Exact raw bytes at Embater revision `db1abef0c1885407e764aa4618431f9d2d2ab29d` | Same journey receipt |
| Actual learner operation | Supplied-half switch and corner match; three-rule desk selection showing 14 mm and 28 mm residuals; source reading and actual HTML download | Same journey receipt |
| Source images in actual downloads | Four images match the independently retained original-page hashes | Same journey receipt |
| Canonical catalogue after discovery | All 102 files and root still match | [After](review/embater-doorways/public-bytes-after.json) |
| Canonical Embater after discovery | All 54 files and root still match | [Embater recheck](review/embater-doorways/embater-after-discovery.json) |

The public journey opens two selected fits on the survey desk; Embater's
separate public matrix covers all six fits. Public screenshots were visually
inspected: [desktop survey discovery](review/embater-doorways/chromium-1440-erechtheion-catalogue.png)
and [phone Greek-word discovery](review/embater-doorways/firefox-375-doorways-catalogue.png).

[Publication metadata](review/embater-doorways/publication.json) keeps source,
build, hosted identity and browser behavior separate. Actions are disabled for
this repository; its latest Pages-build endpoint returned HTTP 404. Those are
unavailable CI/deployment-job boundaries, not a failed hosted-byte check. No
source-CI success, tag or registry release is claimed.
