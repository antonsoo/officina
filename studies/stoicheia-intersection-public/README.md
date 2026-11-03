# Public discovery: both read 1.00

[Open the source-word search](https://antonsoo.github.io/officina/?q=inter+se+secant#tools).

Catalogue source `e2af600` and Pages `09186dd` add the I.1 investigation to the
existing Stoicheia workshop index. The recorded review is pinned to source
revision `9d28d614d686f6d760be2478d23235b9de7fa001`, and its actual raw bytes
match the local git object.

All **114 canonical hosted files**, **8,891,582 bytes**, match the fresh Node
24.22.1 build. The index application uses its existing compiled assets; the new
public data and actual-view thumbnail are recorded in the file ledger.

The public browser journey passed in Chromium and Firefox at 1440 and 375 px:

1. Search accented/unaccented Greek, `temnousin`, Latin and a coordinate fraction;
   share the search and reload that address.
2. Use the keyboard to open the immutable review and read its actual heading,
   then return and use the keyboard to open the live bilingual I.1 lesson.
3. Compare rounded lengths and the exact residual, select 56/97 and inspect the
   actual source-page Blob against the retained Greek p.12 SHA-256.
4. Save the ten-scan illustrated reading, open it from disk without network
   requests, and reload it offline.
5. Reload the actual hosted reader offline under its current worker, retain the
   fraction and save another native illustrated reading.

All four configurations report no page errors. The retained screenshots were
opened and visually inspected: a readable stacked question on phones and a
side-by-side plate and description on desktop. The source distinction remains
visible in the description.

The [journey](journey.json), [hosted bytes](hosted-files.json) and
[clean build](clean-build.json) are separate receipts. The earlier local review
retains its own scope. The reader's exhaustive cache-damage, cold-transfer and
recovery checks are in Stoicheia's
[saved-reader audit](https://github.com/antonsoo/stoicheia/blob/9d28d614d686f6d760be2478d23235b9de7fa001/docs/saved-reader-audit.md).

To repeat the journey, keep the Officina and Stoicheia checkouts side by side:

```sh
node scripts/stoicheia-intersection-journeys.mjs https://antonsoo.github.io/officina/ /tmp/stoicheia-discovery
```

`npm run build` produces `dist/`. Fresh local lint, all 45 tests and the build
passed. These local checks and direct public observations do not assert that a
source workflow executed its checks.
