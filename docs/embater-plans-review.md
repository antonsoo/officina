# Finding the assumptions in a temple plan

Embater's new workshop is discoverable through “amphiprostyle”, ἀμφιπρόστυλος,
δίπτερος, `xxxiv xxxviii`, and `in postico`. It opens the 8 by 17 dipteral model:
38 inner columns. Changing the long side to 15 gives 34. The lesson distinguishes
what the source prescribes from the geometry chosen to illustrate it.

The review link pins
[`2c49ccf`](https://github.com/antonsoo/embater/blob/2c49ccf3ccc80dc08e53cd38e9858bc11f6433e8/docs/plan-audit.md#try-the-actual-work),
the runtime source reviewed and published by Embater. It records the preserved
amphiprostyle cella, hypaethral rear entrance, seven printed source pages, conditional
34/38 calculation, and the actual learner exercise. The existing Count the spaces
workshop and selected architecture entry remain available.

The new thumbnail is an actual public capture of the 17-column choice, retained in
Embater's publication review as `public/dipteral-entry.png`. It shows the chosen
flank count and the 46 outer / 38 inner tally beside the plan.

`node scripts/embater-plans-journeys.mjs CATALOGUE_URL OUTPUT_DIRECTORY` follows the
whole journey in Chromium and Firefox at 1440 and 375 pixels. It searches all five
aliases, copies and reopens a Greek search link, follows the pinned review by
keyboard, compares its public raw bytes with the Git blob, opens the actual lesson,
changes 38 to 34 and back, displays and hashes printed page 66, and downloads the
illustrated HTML. Its bytes must match the artifact independently reviewed in Embater.
Search input itself does not rewrite the URL. The local catalogue replay passed all
four journeys to the public lesson.

- [Local discovery journeys](../studies/embater-plans-local/review.json)

The clean Node 24 build from `d9caafa2805fd4935c0c683fabb3c7792c813c16`
contains 90 canonical files. Every file matched the working build and the public
site before and after the four public journeys. The generated deployment is
`6ed4172b93e700ee2eaa54a928eb7be770e5c1d4`. Pages reports legacy publication
from `gh-pages`; no source Actions runs were returned. These byte and browser
receipts are separate from CI success.

The first public replay stopped in Firefox while printed page 66 was still loading
at the harness's default five-second assertion limit. The completed replay uses an
explicit thirty-second source-readiness limit and records the observed load times:
803 and 196 ms in Chromium, 352 and 820 ms in Firefox. This does not diagnose the
cause of the first delay or claim that its incomplete run passed.

All four completed journeys verified the public pinned review, the actual page 66
image, and the native HTML download against Embater's independently retained bytes.
The thumbnail was also fetched independently from Embater's pinned public Git blob
and this catalogue: both were the same 133,852-byte image. Byte-identical public
screenshots reuse the corresponding retained local captures; distinct captures
remain in the public directory.

- [Clean build](../studies/embater-plans-local/clean-build.json)
- [Public discovery journeys](../studies/embater-plans-public/review.json)
- [Canonical bytes before](../studies/embater-plans-public/bytes-before.json) and [after](../studies/embater-plans-public/bytes-after.json)
- [Thumbnail identity](../studies/embater-plans-public/thumbnail.json)
- [Screenshot identities](../studies/embater-plans-public/screenshot-identities.json)
- [Publication state](../studies/embater-plans-public/publication-state.json)
