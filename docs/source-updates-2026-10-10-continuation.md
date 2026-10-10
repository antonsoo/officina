# Further source updates, 2026-10-10

Five additional defect repairs authored in this session are now pushed across
Errorbars, Contextscope, Stutterscope and Mcplint. Two existing local Flakemap
counter-reconciliation fixes were separately reviewed, rebuilt and reverified
before their source was pushed. No sub-agents were used.

| Repository | Concrete behavior now | Retained evidence |
| --- | --- | --- |
| errorbars | Withhold comparisons/rankings across known different grading rules. Preserve raw scores and unknown provenance. | [Real Inspect captures and installed-wheel checks](https://github.com/antonsoo/errorbars/blob/c6826fe55edf60916bb3954ef6f6756280589ccb/docs/verification-scoring-2026-10-10.md): identical scripted answers had appeared to improve 33.3 percentage points when the grader changed. |
| contextscope | Tool-choice and image-presence changes invalidate message-cache eligibility while compatible setup entries remain reusable. | [Settings counterexamples, CLI and browser reports](https://github.com/antonsoo/contextscope/blob/227d6d81b81d7919ea49deae900d0f9f6dd60725/docs/verification-cache-settings-2026-10-10.md); the reconstructed 10,555-request compatibility replay is unchanged. This is not a new measured cache-accuracy claim. |
| stutterscope | Missing timestamp observations break adjacency, with explicit skipped-row evidence. | [Controlled capture and adjacent-row oracle](https://github.com/antonsoo/stutterscope/blob/b1c33fd913938dc6c53d6b3ae9310da9e3e23855/studies/timestamp-gaps/README.md): three deliberately blanked cells formerly fabricated a 66.6 ms hitch; the two real hitches remain. All 34 prior corpus inputs are unchanged. |
| mcplint | Stop rejecting valid composed input schemas; stop reporting complete audits when resource identities are missing. | [Schema validators and CLI gates](https://github.com/antonsoo/mcplint/blob/ff233d8973fd5522b8f910c6f754f813be01c3f5/studies/required-properties/README.md); [actual SDK connections and offline reports](https://github.com/antonsoo/mcplint/blob/ff233d8973fd5522b8f910c6f754f813be01c3f5/studies/resource-identity/README.md). Valid controls remain usable, closed-schema contradictions fail, incomplete audits stay unscored. |
| flakemap | Expose JUnit/TRX summary counters that contradict retained result records, without inventing outcomes or changing statistical denominators. | [Fresh verification of existing fixes](https://github.com/antonsoo/flakemap/blob/a423cadc5fc134de9c64fd341fac931e1c88ff47/docs/verification-summary-counters-2026-10-10.md): 34 installed CLI scenarios, new pytest/VSTest captures, and a 10,774-file corpus replay preserving all 3,486,669 normalized records. |

## What was checked

The [source receipt](evidence/source-updates-2026-10-10-continuation.json) records
all five source revisions, remote `main` equality, clean local trees, and hashes
of six public evidence documents. Each document was fetched from its pinned
GitHub source URL and compared byte for byte with the local checkout.

Verification used separately installed wheels/tarballs, relevant minimum
runtimes, actual command-line invocations, retained captures and browser exports.
Mcplint's corrected schema rule changes none of 25,799 retained tool definitions;
its identity check changes none of 1,603 retained resources. These compatibility
checks do not estimate the frequency of the constructed defects in the wild.

The repositories retain before/after observations, reproduction commands,
artifact hashes and material limits. The Flakemap counter work was already
present locally when this continuation began; its new work here is independent
verification, fresh captures and source publication.

## Publication boundary

These are **source updates**. No registry package or tag was published, and no
manual hosted deployment was performed in this continuation. Linked demos and
registry packages may serve older code. Local browser verification does not
establish the deployed version or remote CI status.

The [earlier source index](source-updates-2026-10-10.md) and its receipt remain
historical snapshots at their recorded check times. This continuation supplies
newer source revisions for four of those repositories and adds Contextscope.
