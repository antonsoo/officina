# Find local scanned-receipt review and elapsed reset time

The published catalogue returned no matches for `scanned receipt` or
`elapsed reset time`. The existing tools now support those concrete workflows,
so their descriptions and recorded-evidence links need to expose them.

Only Fieldproof and Splitscope catalogue records change. Fieldproof links to
its pinned local OCR review study and says the hosted sample is precomputed.
Splitscope links to its pinned attempt-clock accounting study: ten Desert
resets total 3:56 while four Monestary resets total 48:18 in the recorded
Re-Loaded cohort. These are observations, not practice recommendations.
Registry and demo links retain their existing destinations.

`results/before.json` records eight actual hosted searches: two queries in
Chromium/Firefox at 1280/375, each with zero matches. `results/local.json`
repeats them against the new build, each with exactly the intended tool.
Search stays within the page and does not request another catalogue. Every
visible evidence and action link passes a hit test, and the captured local
screenshots were opened for visual inspection.

Reproduce after `npm ci && npm run build` and starting the Vite preview:

```bash
node scripts/replay-native-workflow-search.mjs \
  http://127.0.0.1:4173/officina/ /tmp/review-search after \
  studies/review-workflows/queries.json
```

The optional fourth argument makes the existing replay accept a query list;
its original three-query default remains supported. Application search code,
project status, groups and other records do not change. Catalogue discovery is
separate from the linked projects' measurements, installed packages and hosted
application behavior.

## Published catalogue

Source `1cbf3834874960a8ee80ab288457f21f29e68294` and Pages
`5687c701761dc8dcbd3b90511b457bc8552ffc0f` publish the two revised entries.
`results/public-bytes.json` verifies all 41 canonical build files, with stable
root/index responses. It makes no claim about extra historical hosted files.
`results/public.json` repeats all eight searches on the real hosted page: each
returns exactly the intended card, every action/evidence link passes a hit test,
there are no page errors, and filtering requests no replacement catalogue.
The public receipt checks the final Fieldproof evidence pin at `0504f8e`;
the earlier local replay used the preceding evidence pin at `24ad5c3`.
The public screenshots were also opened for visual inspection. Project packages,
application runtimes and registry releases are outside this catalogue change.
