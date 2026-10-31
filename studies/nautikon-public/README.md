# Nautikon: public source and three discoverable workshops

2026-10-31. The source repository and both lesson pages are public. All 25
Nautikon production files matched the clean build at canonical URLs. Fresh
Chromium and Firefox at 375 px operated both lessons, read the page-spanning
source and saved the illustrated reading while explicitly offline.

The catalogue entry is now `published`, with an actual demo URL, refreshed
voyage thumbnail and a separate testimony thumbnail. The recorded review is
pinned to an immutable source commit that includes the first hosted-byte and
public-browser evidence. The earlier local-only study remains a historical
record of the unpublished stage.

| Search | Workshop | Learner action |
| --- | --- | --- |
| ἐκπλεύσωσιν | Which event changes the rate? | Keep departure fixed while changing arrival, then cross the boundary with departure; read the Greek verb |
| ὑποθήκη | Who bears the shortfall? | Operate the day-21 sale and the 1,675 claim under §12 |
| οὐδὲ πεντακόσια | Does “not even 500” force 450? | Test 499, add a numbered deposition, keep its premises and read the continuation on pp. 110–111 |

`npm run test:nautikon` uses actual canonical URLs. It does not intercept routes,
inject catalogue fixtures or fulfill a lesson/review with local bytes. Its
four public journeys and final publication-byte receipts are recorded after
the catalogue deployment. The local smoke command remains available as
`npm run test:nautikon-local`, writing to `test-results/nautikon-local/`.

Before this catalogue publication, Officina passed lint, TypeScript, its 45
existing cases, catalogue validation of 38 entries and production build. Both
engines and widths completed the local smoke. These checks are separate from
public hosting and CI execution.
