# Nautikon: three public workshops and an audited edition upgrade

2026-10-31. Nautikon is published in the catalogue with an actual demo URL,
source terms, real thumbnails and an immutable review. The current lesson
edition is **`582e41255fddd59639dd`**; all review links identify source commit
**`c355b44066979dd0744c770c64ce5fcd124cb076`**. The pinned raw review was fetched
without credentials and compared byte for byte with that committed file.

| Search | Workshop | Operated consequence |
| --- | --- | --- |
| ἐκπλεύσωσιν | Which event changes the rate? | Keep a 3,675 account, move departure to +1 and obtain 3,900; reach the Greek verb and checked p. 107 |
| ὑποθήκη | Who bears the shortfall? | Operate the day-21 sale with assumed proceeds of 2,000 and observe the 1,675 claim under §12 |
| οὐδὲ πεντακόσια | Does “not even 500” force 450? | Test 499, add an attributed report of 450, keep the earlier check's original premises and follow Hippias across pp. 110–111 |

## Actual canonical journeys

Chromium 153 and Firefox 155 each completed the real search → workshop →
operated control → immutable review journey at 1440 and 375 px. No catalogue
fixture, intercepted route or local lesson/review response supplied the public
journeys. Source scans were keyboard-panned; the document retained its width.
Lazy thumbnails were scrolled into view and loaded before screenshot capture.
All eight screenshots were inspected.

Every journey saved and reopened native JSON, and saved a scriptless reading.
The reading's actual JPEG, WOFF2 and TEI base64 bytes were checked against the
retained originals. Its embedded JSON download restored the captured work.
Opening the saved file made no HTTP requests.

After matching worker takeover and complete inventory, both lesson pages
reloaded with browser networking disabled. Removing a source invalidated
readiness in two tabs. Online retry repaired the complete edition and displayed
the checked source again. The four journeys had zero page errors.

Canonical byte comparisons before and after those journeys matched **98/98
Officina files**; the final Nautikon pass matched **25/25 current production
files**. Both checks rechecked the canonical root after their file pass and used
no cache-busting URL. Older hashed modules outside the current build are not
counted as current offline resources.

- `receipts.json`: four actual public browser journeys, current edition and review pin.
- `review-source.json`: immutable public raw review identity.
- `officina-before.json`, `officina-after.json`: the catalogue's canonical build identity.
- `nautikon-after.json`: the lesson's canonical build identity after the journeys.
- Native downloads: ignored `test-results/nautikon-public/`; curated portable examples are in Nautikon.

## A real public upgrade

Nautikon separately held two edited public tabs in each browser across the
actual deployment: a voyage notebook and a testimony notebook. Both notes and
kept inputs survived. Their native JSON files reopened after offline reload in
the updated edition, and both restored illustrated readings downloaded. The
previous hashed module URLs remained byte-identical and reachable.
[Public upgrade receipt](https://github.com/antonsoo/nautikon/blob/c355b44066979dd0744c770c64ce5fcd124cb076/docs/verification/public-upgrade.json).

A separate local fixture changes a retained notice to verify refusal of mixed
source bytes. It also injects thrown and malformed worker replies to verify
settled recovery labels without unhandled errors. These are local failure
experiments, distinct from the real public deployment above.

## Reproduction and boundaries

```sh
npm ci
npm run build
npm run test:nautikon
```

The command requires the current canonical site to match this checkout's build.
It does not publish or mutate remote state. `test:nautikon-local` instead uses
the real published catalogue metadata and local lesson/review bytes, with
workers blocked, writing smoke receipts to `test-results/nautikon-local/`.
The earlier [local-only study](../nautikon-local/) remains a historical record
of the unpublished stage and is not current public evidence.

Officina passed lint, strict TypeScript, 45 existing cases, validation of all 38
catalogue entries and production build. Those local results, canonical files,
actual public browsers, remote source and GitHub execution are separate claims.
Source workflow jobs with empty step lists are not counted as successful CI.
Nautikon's [publication record](https://github.com/antonsoo/nautikon/blob/c355b44066979dd0744c770c64ce5fcd124cb076/docs/publication.md)
retains the clean-build and exact execution boundaries.
