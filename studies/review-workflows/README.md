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
