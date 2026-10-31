# Psephos: arrivals, rows and the condition a total misses

Two additional workshop routes extend the existing ballot and count investigations.
They lead to the published Psephos production pages and immutable source reviews;
the catalogue does not estimate historical attendance or reproduce the whole
ancient jury-allocation procedure.

| Source query | Workshop | Operated question |
| --- | --- | --- |
| παραπλησίως ἴσοι | Enough in total. One group empty. | Can ten arrivals supply two from each group? |
| κατὰ πέντε πινάκια εἷς | One cube. Five tickets. | Does moving one ticket change the chance of two being selected together? |

The attendance route also accepts `turnout`, `weighted patterns`, `finite
population` and `7776`. The row route accepts `kleroterion`, `joint chance`,
`same row` and `κύβοι`. Accents and case do not change matching. The thumbnails
are cropped actual operated production views, not imagined diagrams.

Both reviews point to Psephos commit
`93aef778494fc053c2c31226be5c5cc8f99c6701`, with separate attendance and
row-comparison fragments in `docs/attendance-review.md`. The earlier casting and
inference routes retain their reviewed source revisions. The new lesson's
[source/model account](https://github.com/antonsoo/psephos/blob/93aef778494fc053c2c31226be5c5cc8f99c6701/docs/attendance-model.md)
explains the explicit finite population, unequal subset weights and sharp bound.
Its [publication record](https://github.com/antonsoo/psephos/blob/93aef778494fc053c2c31226be5c5cc8f99c6701/docs/attendance-publication.md)
separates source, build, public bytes, browser operation and remote workflows.

## Reproduce the continuous journey

With an installed production build and browser binaries:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4399 --strictPort
```

In another terminal:

```sh
npm run test:psephos-allotment -- http://127.0.0.1:4399/officina/ test-results/psephos-local
npm run test:psephos-allotment -- https://antonsoo.github.io/officina/ test-results/psephos-public
```

The script uses the actual catalogue, public lessons and pinned GitHub review.
It does not redirect application requests. Chromium and Firefox at 1440 and
375px each perform both investigations, giving eight continuous journeys:

1. Search by every alias, without silently changing the address. Explicitly
   copy the Greek search link, reopen it and decode the actual thumbnail.
2. Follow the review using the keyboard, inspect its rendered article, and
   byte-compare its immutable raw file with the local Psephos commit.
3. Follow the workshop link using the keyboard. Wait for its verified offline
   edition, then operate the attendance exchange or move the tracked ticket.
4. In attendance, preserve the initial shortage and exchange to balanced counts
   at the same total. Read `7,776 / 184,756`. In row selection, preserve `1/2`
   and move to `1/6` joint selection, with fixed placement explicitly stated.
5. Select the relevant Greek passage and phrase; hash the actual displayed image
   against its retained primary-source identity.
6. Save editable JSON and illustrated HTML. Verify all 14 embedded source, font
   and license identities. Open the script-free HTML locally without network
   requests; its native JSON must exactly match the original saved study.
7. Reopen the JSON through the actual lesson control. Return to the loaded
   catalogue, disable networking and refilter by all aliases without a catalogue
   refetch. Lazy image requests for newly revealed rows are recorded separately;
   this does not claim that Officina supports a cold offline reload.
8. Recheck the canonical catalogue, data, both new thumbnails and public lesson
   entries after every journey.

## Evidence boundaries

[Local journey receipt](../studies/psephos-allotment/local.json),
[clean build identity](../studies/psephos-allotment/clean-build.json),
[Psephos source synchronization and raw artifacts](../studies/psephos-allotment/source-evidence.json).
The local catalogue journey still visits the real public Psephos and GitHub.
The [public journey receipt](../studies/psephos-allotment/public.json) and
[hosted-file comparison](../studies/psephos-allotment/hosted-bytes.json) are separate
publication observations, retained after deployment.

The unchanged index runtime also passed its 44 browser checks, including phone
layouts, both themes, keyboard focus, explicit sharing, load recovery and
accessibility. Clean installation passed lint, strict types, formatting,
45 semantic checks and the catalogue/build validation of all 38 project records.
These local results do not assert remote CI success. Deployment and workflow
metadata are retained in [publication.json](../studies/psephos-allotment/publication.json).
