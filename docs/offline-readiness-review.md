# Offline readiness across the study editions

The audit reproduced stale availability claims in real public pages, then
verified discovered damage and complete-inventory recovery in two open tabs.
The casting/deduction lesson, the logic workshop and both Roman-law pages now
keep that shared storage boundary visible. No historical rule was changed by
this repair.

| Edition | Worker identity | Hosted files | Final public journeys | Pinned review |
| --- | --- | ---: | ---: | --- |
| psephos | `22212bb56b0620317536` | 21 | 4 | [Audit](https://github.com/antonsoo/psephos/blob/3c79c5078228b5e05512659341decbe0877b117d/docs/audit.md#published-multi-page-follow-up) |
| horos | `b650d6cb3018691f56a8` | 17 | 4 | [Audit](https://github.com/antonsoo/horos/blob/8c0494954bb66be4d5030bc660f22017a362dc36/docs/readiness-audit.md#public-edition) |
| traditio | `b4ed162cc324456b713a` | 26 | 8 | [Audit](https://github.com/antonsoo/traditio/blob/15a19f6fd039865ee248f17408b712a0866c7e17/docs/readiness-audit.md#public-edition) |

`npm run test:readiness-public -- PROJECT OUTPUT_DIRECTORY` runs the actual
public check from this Officina checkout, with the named study checkout beside
it and its reviewed `dist/` built. The source is
[scripts/readiness-public.mjs](../scripts/readiness-public.mjs). It compares all
canonical bytes before, after and between journeys; does not redirect requests;
and passes the real site's TLS bytes through unchanged. Closing those tunnels
and refusing new ones makes the origin unavailable. A fresh worker-free context
fails while the installed edition reloads and reopens its actual downloaded JSON.

Each app's illustrated HTML then matches its connected export. A native image
request discovering damaged retention warns both pages. Full verified repair
restores both. The recovered native JSON is identical, and actual displayed
source bytes plus embedded source/font bytes match retained identities. All
sixteen public footer screenshots were visually inspected. The per-project
reviews retain the full browser, clean-build, hosted-file and source receipts.

The follow-up [Psephos discovery receipt](psephos/followup-journeys.json) adds
eight public catalogue journeys: both workshops in Chromium and Firefox at
1440 and 375 pixels. Each reopens a copied Greek search link, follows the
specific lesson, reads and cites the tie clause, saves the native record and
visits the immutable review. Every journey checks the canonical catalogue data,
entry, both thumbnails and the updated Psephos entry. All sixteen discovery
screenshots were visually inspected.

There are **24 final public journeys** in total: sixteen two-tab transport and
recovery journeys plus eight catalogue journeys. The **64 study build files**
and **93 catalogue files** were independently byte-verified; no source CI
success is inferred from that result. Source workflows for the three apps
returned failure with empty step lists, while their Pages deployments from
`gh-pages` succeeded. These are separate evidence boundaries.
