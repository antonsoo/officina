# Verified document review and CI fixes, 2026-10-11

Three repositories now have pushed source repairs with retained before/after
inputs, installed-artifact checks and inspectable reports. No new showcase was
added. The work addresses existing tools returning misleading results or failing
on ordinary-sized inputs.

| Repository | Failure and resulting behavior | Pinned evidence |
| --- | --- | --- |
| Fieldproof | A synthetic two-page, 100-row invoice exhausted the verification worker's CPU budget. Preparing page evidence once per verification changes the actual API result from HTTP 413 after 20.031 s to HTTP 200 in 0.332 s, with unchanged limits and a byte-identical complete report. | [PDFs, timings, API and installed review](https://github.com/antonsoo/fieldproof/blob/c006a5e7e1b93c7037b64cfb0f2229c9e9418cd9/studies/grounding-reuse/README.md) |
| Fieldproof | Unicode case expansion could disable matching on a whole page and select one of two repeated names as verified. Original offsets now survive case folding; four false verified-location cases become ambiguous, while complete unique words retain their actual PDF highlights. | [Ten PDFs, complete candidates, installed CLI/API and review/export](https://github.com/antonsoo/fieldproof/blob/c006a5e7e1b93c7037b64cfb0f2229c9e9418cd9/studies/unicode-grounding/README.md) |
| Errorbars | A model pair sharing fewer than two independent clusters aborted the whole leaderboard. Eligible comparisons now remain available, with explicit reasons for untested pairs. Indexed identity validation also reduces a 120-model replay median from 31.315 s to 5.911 s with the same complete output. | [Partial cohorts, independent calculations, benchmark and installed wheel](https://github.com/antonsoo/errorbars/blob/6adea05815b239b5dd945b104e92f3033a3167e7/studies/leaderboard-overlap/README.md) |
| Flakemap | A test that repeatedly failed and recovered on retry could appear quiet. Activity now counts affected runs with explicit failed attempts, keeping continuing and newly observed retry failures visible. Ambiguous attempts leave the activity conclusion unavailable. | [Actual Maven/Surefire captures, composed histories and installed reports](https://github.com/antonsoo/flakemap/blob/b1b2084a89f61a02f70fd9b91069b68fb51fa1b9/studies/retry-activity/README.md) |

## What was checked

Fieldproof's final source passed a fresh archive install, Ruff, mypy, 391 Python
tests, 50 web tests, web lint/typecheck/format and both production/demo builds.
The bundled wheel was installed separately on Python 3.11.13 and 3.14.7. All ten
Unicode library/API records matched byte-for-byte; installed CLI extractions
matched too. Chromium and Firefox exercised real upload, review, PDF rendering,
approval and export at desktop and 375px widths. Every one of the 23 served UI
assets matched the clean build; screenshots were inspected.

The final wheel retains the invoice repair: 100 rows take a library median of
0.088 s and an API request of 0.340 s, with the same complete report. Four hundred
rows also finish within the unchanged limits. Fresh compatibility replays before
and after each repair retain all 133,722 complete case records across 1,052
annotated CORD/SROIE receipts. This is compatibility with the retained adapter,
not a new extraction or multilingual accuracy estimate.

Errorbars and Flakemap were separately verified from clean archives and installed
wheels in the preceding work. Errorbars keeps 593 passing tests and the paired
comparison oracle; Flakemap keeps 366, with actual generated report exports and
offline Chromium/Firefox checks. Their pinned studies retain the commands,
installation receipts and source-versus-artifact boundaries.

## Limits and source availability

The invoice and Unicode counterexamples are synthetic. Fieldproof verifies
quoted source evidence and configured rules; repeated amounts and unsupported
field associations still require review. Errorbars' benchmark uses retained
SWE-bench outcomes with synthetic identity hashes to exercise validation, not to
establish upstream question provenance. Flakemap's activity histories are
explicitly composed from captured test-run outcomes, not claimed production CI
histories. Timings are observations on shared 14-vCPU, 48-GB WSL2 hardware.

The [public-source receipt](evidence/verified-review-and-ci-2026-10-11.json)
checks each clean local head against remote `main` and fetches 23 pinned public
files, all byte-identical to the local evidence. It also records the observed
`gh-pages` references; all three were unchanged from the pre-push observation.
No registry release, tag or manual hosted deployment was performed in this
batch. Hosted assets were not revalidated by this source receipt.
