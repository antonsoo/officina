> Historical local-only review, retained as recorded. Publication and the
> current discovery journeys supersede this stage; see
> [the public study](../nautikon-public/README.md). The current
> `test:nautikon-local` command uses the real published catalogue entry and
> local lesson/review bytes, writing new smoke receipts to
> `test-results/nautikon-local/`. It does not overwrite these original receipts.

# Nautikon: unpublished handoff and local discovery review

2026-10-31. The new sea-loan workshop is local and unpublished. The actual
catalogue entry stays **`soon`**, with **`demoUrl: null`**. It is absent from the
ordinary project list, audience counts and search. No unhosted workshop is
presented as a live project.

The future workshop metadata is ready for review: source words including
ἐκπλεύσωσιν and ὑποθήκη identify departure-rate and default-shortfall activities.
Both link to the locally committed review at
`17c62914d4231a69df70dc0c298fbc5387bee6b5` in Nautikon. The repository was not
created or pushed. Those future GitHub and Pages URLs are not public evidence.

## Reproduce locally

Build Nautikon with `npm --prefix ../nautikon run build`. Then, from Officina:

```sh
npm ci
npm run build
npm run test:nautikon-local
```

The journey script starts its own local catalogue server. It first proves that
the actual pending entry stays hidden. It then injects a **browser-only preview
fixture** with the entry marked published. Requests for the future lesson URL
are fulfilled with the local Nautikon build; the future review URL is fulfilled
with the bytes from `git show` at the pinned local source commit. Remote state
is not queried or asserted. Service workers are blocked in this discovery
fixture; Nautikon’s separate review exercises real worker and offline behavior.

## Operated journeys

| Search | Next action | Observed consequence |
| --- | --- | --- |
| ἐκπλεύσωσιν | Open the matching departure workshop, keep a voyage, move departure to +1 | Interest changes from 675 to 900, debt from 3,675 to 3,900; the Greek verb and checked p. 107 are reached |
| ὑποθήκη | Open the shortfall workshop and choose the default investigation | An assumed 2,000 sale leaves 1,675 claimable under the selected clause |
| Arcturus | Open the recorded review | The pinned local review’s actual text is displayed |

Chromium and Firefox each completed the journeys at 1440 and 375 px.
`receipts.json` records the fixture boundary and local review commit. Four
screenshots preserve actual search results. No public browser, hosted bytes,
GitHub Actions, release or deployment success is claimed.

Officina clean install, lint, strict TypeScript, 45 existing tests and production
build passed. The catalogue contains 38 entries including the pending one.
The install also reported 10 existing moderate development-dependency audit
findings; dependencies were not upgraded as part of this metadata handoff.

Keep the entry pending until the owner/coordinator has reviewed and published
the source and has separately established hosted-byte identity and real public
browser behavior. The local fixture is not authorization to publish.
