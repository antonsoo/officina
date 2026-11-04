# Same columns. A different rectangle?

Reviewed 3 November 2026. Catalogue implementation: `53551b95e48b7883f32546a3084f327520dfa745`. Published build: `d13d5ad835cf1e61b7ed1b1b6b40aca37a1733c8` on `gh-pages`, by a normal fast-forward push.

The existing Embater entry now exposes the measuring bench as a concrete question. Search **longitudo operis**, **axial pitch**, **column centres**, **same column count** or **hold a reference**. The matching workshop opens Priene's column count at the measuring bench, where the learner holds an equal-pitch reference and halves the current flank pitch. Thirty physical columns remain while a two-to-one centre rectangle becomes square. The distances are explicit modern choices, not Priene's survey.

The thumbnail is an actual operated app capture. The [immutable audit](https://github.com/antonsoo/embater/blob/558f5b194758bcb2172404d3ec9d9dc230fd8024/docs/count-audit.md) retains model/source boundaries, independent geometry checks, exact native files, primary pages and transfer-recovery evidence. Its [publication review](https://github.com/antonsoo/embater/blob/558f5b194758bcb2172404d3ec9d9dc230fd8024/docs/count-publication.md) separately records the 89-file hosted Embater build.

## Operated discovery

[Local catalogue journeys](embater-measure-discovery/local-journeys.json) use Chromium and Firefox at 1440 and 375 px. They search all five terms, reopen an explicit shared search, enter the pinned review by keyboard, then open the lesson through the actual workshop link. They operate the pitch control by keyboard, save/reopen the native JSON, navigate to the Latin, inspect and hash the complete source page, save a script-free illustrated reading and compare the offline JSON download with its online original.

The source reader's 1350 × 2100 page-69 render and the saved reading's 2033 × 3161 archive image have different hashes. The first journey script incorrectly expected the same bytes; its checks now distinguish and verify both actual artifacts. No source was replaced to make an assertion pass.

The complete catalogue browser suite passes 56 cases. One earlier globally scoped test locator assumed that a workshop id was unique across projects. It now scopes its existing Euclid measurement check to Stoicheia; Embater's new measuring row retains its own project scope. This preserves the intended search/node-retention check rather than concealing the new row.

## Build and publication boundaries

A fresh Node 24.22.1 / npm 11.19.1 installation passes lint, formatting, all 45 unit/catalogue checks and the production build. All [119 clean-build files](embater-measure-discovery/clean-build.json) match the working build byte-for-byte. The canonical [hosted-byte review](embater-measure-discovery/hosted.json) verifies all 119 files, including the new catalogue bytes and actual thumbnail. Its root checks bracket the full file pass; the deployment's `.nojekyll` marker is separate.

[Four public discovery journeys](embater-measure-discovery/public-journeys.json) pass with the final immutable review pin. The [canonical recheck](embater-measure-discovery/canonical-recheck.json) confirms the entry HTML, catalogue and new thumbnail still match after all journeys. Source synchronization and hosted bytes are distinct claims. No remote CI pass or tagged release is claimed.
