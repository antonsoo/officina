# Verified source fixes and public demos, 2026-10-11

Seven reproduced defects were corrected across six repositories. Their source
is pushed. Six public demos were independently rebuilt and verified, including
existing mathematical and reliability repairs that had not reached the live
sites. No sub-agents were used.

## Source corrections

| Repository | Before and after | Evidence |
| --- | --- | --- |
| Trainspotter | An unread TensorBoard file in a sibling run could mark the selected intact run incomplete. Failures now follow their possible owning runs; genuinely ambiguous ownership stays incomplete. Oversized record lengths also produce an unread-tail result instead of an exception. | [Real event-file captures, CLI exits and installed wheel](https://github.com/antonsoo/trainspotter/blob/a7148057cb3b4c3a920dd24d379438c952c88edd/studies/tensorboard-scope/README.md) |
| Flakemap | Filename order could become a fabricated failure streak or change point. Temporal conclusions now require complete, unique recorded chronology; unordered inputs retain aggregate evidence and report incomplete temporal coverage. | [Actual pytest XML, installed CLI and Kubernetes compatibility replay](https://github.com/antonsoo/flakemap/blob/3d2dcd02e0dc7842c59ff042f854fe37950e9763/studies/ordering-evidence/README.md) |
| Contextscope | Changing Claude processing speed reused the entire estimated prompt cache and standard prices. Compatible marked tool entries remain reusable; system/messages change scope, and supported fast input rates are applied. | [Controlled requests and installed CLI/browser exports](https://github.com/antonsoo/contextscope/blob/c1adf86f375d606145840cc20d530c9a9e5fd34f/studies/fast-mode/README.md) |
| Veil | Unicode-escaped personal data inside JSON tool arguments could leave the SDK transport unmasked. Decoded string values are now masked while preserving unrelated JSON tokens. Separately, complete-response restoration no longer rounds precise numbers or drops duplicate members. | [Outgoing SDK captures](https://github.com/antonsoo/veil/blob/7bec64d6bd76a19cf37a9bb3b56e6e77c1bd533b/studies/json-tool-arguments/README.md); [restoration captures and numeric oracle](https://github.com/antonsoo/veil/blob/7bec64d6bd76a19cf37a9bb3b56e6e77c1bd533b/studies/json-tool-restoration/README.md) |
| Fieldproof | A claim such as `not 2026-03-04` could verify against that date and enter a date-order check. Extracted date claims now require an exact valid ISO date; invalid or ambiguous claims remain reviewable with their original quote and page location. | [PDF and CLI captures, installed review/export and receipt compatibility](https://github.com/antonsoo/fieldproof/blob/7a0b35eea2af477fd3886a30daaeca72ff223c47/studies/date-claims/README.md) |
| Stutterscope | The first local import failed after disconnecting because its worker still needed a script download. The parser now travels with the initial page; independent workers, replacement, comparison and recovery work offline. Existing missing-telemetry and timestamp-gap repairs are also public. | [Actual hosted failure and complete offline workflows](https://github.com/antonsoo/stutterscope/blob/fc44ae257011a33aaee50207efa20bd4b5619934/studies/offline-import/README.md); [prior telemetry publication](https://github.com/antonsoo/stutterscope/blob/fc44ae257011a33aaee50207efa20bd4b5619934/studies/publication/README.md) |

These are retained counterexamples, not estimates of how often the defects
occur. Contextscope's costs are simulations, not provider charges. Veil's
captures use actual SDK serialization with a local mock transport, not live
model requests. Fieldproof's verification checks quoted evidence and configured
rules, not the truth of a document.

Each correction was checked from a fresh source archive. Library and CLI fixes
were also checked as separately installed artifacts, including supported minimum
runtimes where recorded; browser changes were checked as production assets. The
studies retain before/after observations, reproduction commands, artifact hashes,
relevant corpus comparisons, browser or SDK behavior, and material limits.

## Public demos

| Demo | Published behavior | Served files matching the verified build |
| --- | --- | ---: |
| [Trainspotter](https://antonsoo.github.io/trainspotter/) | Current reports generated from the selected-run scope correction | 18 |
| [Flakemap](https://antonsoo.github.io/flakemap/) | Chronology-aware and incomplete-evidence reports | 9 |
| [Contextscope](https://antonsoo.github.io/contextscope/) | Processing-speed cache scopes, costs, findings and offline exports | 41 |
| [Am I unlucky?](https://antonsoo.github.io/am-i-unlucky/) | Existing pity-tail correction: the retained example's mean is 10,000 pulls, replacing 902.3; unsupported tail probabilities and verdicts are withheld | 35 |
| [Splitscope](https://antonsoo.github.io/splitscope/) | Existing large-history recovery and corrected forecast wording; the 140,000-attempt control loads and exports every original record offline | 18 |
| [Stutterscope](https://antonsoo.github.io/stutterscope/) | Missing observations stay unknown; missing timestamps no longer create a fake hitch; first local imports and comparison work after disconnecting | 30 |

All **151 files** were fetched from the actual public URLs and compared with the
verified local output using SHA-256. The first three demos' [file ledger](evidence/verified-updates-2026-10-11/first-three-served-files.json),
[Trainspotter/Flakemap browser checks](evidence/verified-updates-2026-10-11/trainspotter-flakemap-hosted.json)
and [Contextscope browser checks](evidence/verified-updates-2026-10-11/contextscope-hosted.json)
are retained here. The [calculator publication study](https://github.com/antonsoo/am-i-unlucky/blob/a9398382c94d17f324dcdf5746eb17982a42db35/studies/publication/README.md)
and [Splitscope publication study](https://github.com/antonsoo/splitscope/blob/3fda8d483fdb07d138fbaf0d38c96bd56fbe7248/docs/publication-2026-10-11.md) retain their own
before/after captures, file ledgers, browser results and inspected screenshots.

Stutterscope's [current offline study](https://github.com/antonsoo/stutterscope/blob/fc44ae257011a33aaee50207efa20bd4b5619934/studies/offline-import/README.md) records
30 matching served files and 70 hosted workflows. Its eight controlled reports
retain every field from the preceding telemetry deployment except generation
timestamps. The first import works in a fresh context after disconnecting;
unloaded examples still need the network, and lazy fonts can use system fallbacks.

The calculator passed 20 hosted workflows. Splitscope passed 36 hosted workflows
plus complete offline import/export replays in both Chromium and Firefox; each
86,469,137-byte export contains all 140,000 attempt and segment records with zero
mismatches. The two browsers produced identical export bytes. These checks
establish the tested input and workflows, not unlimited file size or bounded
memory. Splitscope's initial local run had one combined accessibility timeout;
the unchanged check passed in isolation. Its study records that retry explicitly.

## Publication boundary

The [source and deployment receipt](evidence/verified-updates-2026-10-11.json)
records eight clean checkouts matching remote `main`, the separate build-source
and Pages revisions, and ten pinned public evidence documents fetched and
compared with local bytes. Source documentation commits after a build are not
presented as a new build.

No registry package or tag was published. Veil and Fieldproof have source and
locally installed artifact verification; their static demos were not redeployed
for these API/backend corrections. GitHub Actions is disabled in the eight
repositories checked here, so the checks reported above are local or hosted
browser checks, not successful remote CI runs.

These are dated snapshots. The [earlier source index](source-updates-2026-10-10.md)
and [continuation index](source-updates-2026-10-10-continuation.md) remain unchanged
historical records; this document adds newer source and deployment evidence.
