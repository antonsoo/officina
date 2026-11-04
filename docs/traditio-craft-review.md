# Finding the non-owner's claim

The catalogue now routes source phrases to Traditio's painted-board recovery
experiment. The same notebook contains the craft dispute, but this entry opens
the particular question: Aulus is the reported owner, while Lucius has the
adapted recovery claim described in Gaius 2.78. Custody and reimbursement remain
separate from title, and the good-faith qualification does not become a predicted
litigation result.

The route uses an actual desktop screenshot and an immutable review at
`9c3e3072e91da7ed8f870857495afadc0d2f15c8`. It adds no repository or new
catalogue mechanism. Search terms include `utilis mihi actio`, `utique si`,
`Sabinus and Cassius`, `painting on a board`, and `ownership and recovery`.

## Operate the discovery path

With Traditio checked out beside Officina:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4490
node scripts/traditio-craft-journeys.mjs http://127.0.0.1:4490/officina/ test-results/traditio-craft-local
```

The driver tests Chromium and Firefox at 1440px and 375px. It searches six terms,
reopens an explicit search link, follows both the review and lesson by keyboard,
and checks the pinned review's raw bytes against the immutable Git object.

In the actual hosted lesson, it operates the good-faith qualification and pinned
comparison, reads the supporting Latin and phrase note, hashes both displayed
source-image Blobs, and restores the native version-2 record. It downloads the
illustrated notebook and opens it from disk with scripts disabled and the browser
offline. Embedded source pages, fonts and its own editable-JSON download are
checked independently. A further lesson reload and export use browser offline
emulation; that is distinct from Traditio's separate public audit, which refuses
the actual TLS origin. Neither successful HTTP requests nor screenshots alone
establish these results.

The journey reuses Traditio's operated-room helper rather than maintaining a
second, weaker copy of its source and download checks. Its receipt identifies
the app edition, displayed source identities and actual reading hash. Review
links remain pinned while the live app can receive later compatible fixes.

## Public delivery

The [actual catalogue search](https://antonsoo.github.io/officina/?q=utilis+mihi+actio#catalogue)
opens the new recovery question. [Four public journeys](../studies/traditio-craft/review.json)
operate Chromium and Firefox at 1440px and 375px, with zero captured runtime or
console errors. Each reaches edition `a0da79a00a09748f2210`, checks both displayed
source images and keeps the actual native and illustrated downloads. Screenshots
of the public catalogue and operated lesson were opened and inspected.

The [canonical-file receipt](../studies/traditio-craft/publication-bytes.json)
compares all **116** hosted build files, including the new thumbnail, its source
license and the actual catalogue data. Every file matches the clean production
build. The [source receipt](../studies/traditio-craft/source-and-build.json)
separately checks the immutable raw GitHub bytes for all three new/changed
publication resources. Node 24.22.1 dependencies, build, lint, formatting and all
45 repository tests passed in the clean checkout; the working and clean builds
match. These local results establish no remote CI result.

| Evidence | Revision or scope |
| --- | --- |
| Officina source | `76185b2a850a2db8ee28102610dad105edec22ea` |
| Publication branch | `7770ec0fa59bf39870b831f145608a715b4a84ed` |
| Reviewed learning source | `9c3e3072e91da7ed8f870857495afadc0d2f15c8` |
| Actual Traditio app source | `a8b419dc89a6019c5076390606bdf41c4c499ade` |
| Source images | Complete Poste–Whittuck 1904 pp. 162–163 |

The thumbnail retains its [separate source license](../public/thumbs/traditio-craft-LICENSE.txt),
as identified in [the asset register](../ASSET_LICENSES.md). Officina's code remains
MIT. The entry promises a selected reading experiment, not a complete treatment
of Roman procedure or independent specialist review.
