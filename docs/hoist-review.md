# Discover the unequal-tension hoist

Search [Officina for religatur](https://antonsoo.github.io/officina/?q=religatur#catalogue). The Gonia workshop opens the three-wheel route with a deliberately chosen modern 90% transfer at each turning wheel. The resulting whole-system efficiency is 81.3%, not 90%. This is an instructional loss model, not a measurement of an ancient machine.

The entry uses a screenshot of the actual workshop and links to the [immutable Gonia audit](https://github.com/antonsoo/gonia/blob/e95faa0277497f1e57c601a1518277ad6f347e61/docs/hoist-audit.md#try-the-actual-work). The [asset notice](../ASSET_LICENSES.md) preserves the screenshot's separate terms.

## Local catalogue to public lesson

[Receipt](hoist-discovery/local.json). Chromium 153 and Firefox 155, each at 1440 and 375 px, followed this complete journey:

1. Search independently for `religatur`, `trispastos`, `unequal tensions`, `pulley losses`, and `ὑπομόχλιον`; the specific workshop remains discoverable. Copy the search link and reopen it.
2. Decode the real thumbnail, keyboard-open the actual pinned GitHub review, and read its lesson entry. Independently compare the public raw review with the committed bytes.
3. Keyboard-open the public Gonia lesson. Change the efficiency slider with the keyboard, retain focus, restore 90%, and compare five wheels (813.980937 J input) with three (738.007380 J) for the same 600 N, 1 m lift and arm ratio 2.
4. Open the fastening clause, select `religatur`, and inspect its Latin gloss. Verify the displayed full printed page 227 by SHA-256 against the retained source manifest.
5. Save the native illustrated HTML. Open it as a local file, check all five embedded source pages against their hashes, require the license notice and 81.3% efficiency, reject scripts, and observe zero HTTP requests.
6. Disable browser networking, reload the public lesson, and download a byte-identical study from its saved edition. No owned-page errors occurred.

![Actual catalogue row on a 375 px screen](hoist-discovery/catalogue-phone.png)

The local receipt establishes a local catalogue leading to the actual public lesson. It does not establish that the new catalogue itself is public. The public publication follow-up is recorded separately below.

Run from this repository:

```sh
npm run test:hoist -- http://127.0.0.1:4369/officina/ /tmp/officina-hoist-local
```

The script intentionally uses the public destination, its real source-review URL, native downloads and browser networking controls. It does not mock either destination.

## Source and build checks

A clean dependency installation under Node 24.22.1, lint, all 45 existing catalogue/publication unit checks, TypeScript checking and the production build passed. These checks support the change; the operated journey above is the learner-facing evidence. Remote CI and hosted bytes remain separate boundaries.

## Public catalogue and lesson

The same four journeys now pass from the **canonical public Officina site**, not a local catalogue: [public browser receipt](hoist-discovery/public.json). Actual screenshots were visually reviewed in both engines and widths. The real GitHub audit page opened with the keyboard; all five source images in each native study matched; online and browser-offline downloads were byte-identical within each configuration.

| Boundary                            | Observed identity or result                                                                                                             |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Officina source                     | `55a831ff71403ae2e0b4919f294c4b4ca93ef115`                                                                                              |
| Officina Pages                      | `30465a5fa594b2918da7d84fb67cf446c5bc48b5`                                                                                              |
| Catalogue hosted files              | All 111 current build files match by size and SHA-256, before and after the public journeys; both directory and explicit index agree    |
| Gonia reviewed runtime source       | `e95faa0277497f1e57c601a1518277ad6f347e61`                                                                                              |
| Gonia Pages                         | `cc2b5c9ae144c354f4496a8db9cd3aacf185b9fd`                                                                                              |
| Lesson hosted files after discovery | All 142 current build files match, including directory entry checks before and after the inventory                                      |
| Public source                       | Both source trees were clean and matched their remote main revisions at the recorded check; seven selected pinned raw documents matched |

Receipts: [catalogue before](hoist-discovery/hosted-before.json), [catalogue after](hoist-discovery/hosted-after.json), [lesson after](hoist-discovery/lesson-hosted-after.json), [source snapshot](hoist-discovery/source.json). The source snapshot includes Gonia's later documentation-only `4cc1aa1`; its runtime remains the reviewed edition. This follow-up also changes documentation only.

The deployment used ordinary descendant commits on each existing Pages branch, preserving older hashed assets. No remote-CI success is inferred: Gonia's recorded check job reported failure with no steps, and the local checks, hosted file identities and public browser observations are independently recorded. These receipts concern the recorded publication, not a registry release or a guarantee against future cache eviction.

Reproduce the public journey:

```sh
npm run test:hoist -- https://antonsoo.github.io/officina/ /tmp/officina-hoist-public
```
