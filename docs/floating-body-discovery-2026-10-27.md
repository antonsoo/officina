# Discover Archimedes' floating-body room

The catalogue now routes both English model terms and the Greek dry-base phrase
to [Zygon's floating-body workshop](https://antonsoo.github.io/zygon/float.html?a=1.5&density=16&tilt=10&reading=1#fl-bench).
The selected passage opens with the experiment. A separate link opens
[the immutable direct review](https://github.com/antonsoo/zygon/blob/576e538885cdc89128c508fa8997ddf5057262a6/docs/float-review.md#try-the-actual-work).

The result asks the learner to distinguish equal forces from stable orientation,
change density, find an oblique equilibrium, and inspect the Greek condition
that the broad base must not touch the liquid. The thumbnail is an actual
workshop capture. The primary Zygon demo still opens the original balance.

| Discovery words | Destination |
| --- | --- |
| On Floating Bodies; floating solids; paraboloid; buoyancy; Archimedes hydrostatics | The floating solid's shape/density/tilt comparison |
| critical density; oblique equilibrium; unstable upright; force lines | Upright, critical and nonzero balanced positions |
| dry base; μὴ ἅπτεσθαι; non tangat humidum | The experiment and its dry-base Greek reading |
| κωνοειδοῦς; emiolium | The same workshop, with its Greek/Latin shape condition and source frames |

[The local query receipt](../studies/floating-body-discovery/local-search.json)
covers eighteen queries in Chromium and Firefox at 1280px and 375px: 72 online
queries and 72 offline refilterings after initial load. It checks the actual
workshop link and immutable review link, accent/case/space variants, the
Ancient world audience, unchanged address while typing, and no additional
catalogue fetch. This is warm-page offline filtering, not an offline reload claim.

[The local continuous journeys](../studies/floating-body-discovery/local-journeys.json)
perform the actual search, keyboard-open the public workshop, stand the solid
upright, nudge it, find its nonzero balanced tilt, set critical density, locate
and decode the verified manuscript image, then return to the catalogue and
keyboard-open the immutable review at its native heading. All four contexts
reach the intended heading with no application errors or horizontal overflow.

[Source/public delivery and final hosted evidence](../studies/floating-body-discovery/README.md)
are recorded separately. The underlying workshop has its own numerical,
source, artifact, offline-edition and public-delivery evidence; the catalogue
review is not a new physical or historical measurement.

The same journey passed on the actual public origin in all four configurations.
[Public searches](../studies/floating-body-discovery/hosted-search.json) record
72 online queries and 72 warm-page offline refilterings;
[public continuous journeys](../studies/floating-body-discovery/hosted-journeys.json)
reach the working source reader and the pinned review heading. All four public
captures were inspected separately; their file identities are retained in the
publication receipt.

[The clean archive build](../studies/floating-body-discovery/build.json) passed
the repository's required checks. All
[71 current build files](../studies/floating-body-discovery/hosted-files.json)
match their canonical hosted responses, and all
[28 preceding asset URLs](../studies/floating-body-discovery/preserved-assets.json)
retain their original bytes. The
[publication receipt](../studies/floating-body-discovery/publication.json)
records source and static branch identities. These observations do not establish
a remote CI result.

## Reproduce

Build the catalogue and run its production preview, then:

```sh
node studies/floating-body-discovery/search.mjs http://127.0.0.1:4173/officina/ /tmp/officina-floating
npm run test:workshops -- http://127.0.0.1:4173/officina/ /tmp/officina-floating floating
```

The same commands accept `https://antonsoo.github.io/officina/` for the actual
public origin. Navigation contexts block service workers to separate these
journeys from the workshop's dedicated offline-edition review.

[Desktop discovery capture](assets/floating-body-discovery/chromium-1280-floating-search.png) ·
[Phone discovery capture](assets/floating-body-discovery/chromium-375-floating-search.png).

[Public desktop discovery](assets/floating-body-discovery/hosted-chromium-1280-floating-search.png) ·
[Public phone discovery](assets/floating-body-discovery/hosted-chromium-375-floating-search.png) ·
[Public desktop source operation](assets/floating-body-discovery/hosted-chromium-1280-floating-operation.png) ·
[Public phone source operation](assets/floating-body-discovery/hosted-chromium-375-floating-operation.png).
