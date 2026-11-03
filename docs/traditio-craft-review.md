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
