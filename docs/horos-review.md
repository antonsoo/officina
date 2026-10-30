# Horos discovery and reasoning journeys

The catalogue adds Horos's Aristotle workshop with two direct investigations:

| Search | Investigation | Learner operation |
| --- | --- | --- |
| `λίθος`, `horse and stone`, `ὅροι`, `Analytica priora` | Horse and stone | Keep the premises true, move C outside A, compare the worlds, then construct a witness from the allowed regions |
| `ἔκθεσις`, `ekthesis`, `ἂν ληφθῇ`, `existential import` | Take one of the Cs | Remove the shared instance, identify the blocked C requirement, then withdraw the existence assumption |

Each route selects its question and Greek reading directly. The review link is
pinned to a source commit containing the audit and the actual exercise steps.
The screenshot is an actual rendered Horos workshop.

Run the continuous discovery check with a catalogue URL and output directory:

```sh
npm run test:horos -- https://antonsoo.github.io/officina/ studies/horos-public
```

The driver operates Chromium and Firefox at 1440px and 375px. It checks alternate
source terms, types the Greek query without silently changing the URL, explicitly
copies the search link, reopens it, follows the review with the keyboard, and
compares the public raw review to its pinned Git blob. It then follows the actual
lesson link, changes the world, reads the corresponding scan, compares displayed
source bytes, and downloads a notebook containing the learner's explanation.
There is no request redirection or substitute response.

The local-catalogue pass is retained in [horos-local](../studies/horos-local/review.json).
That initial pass used the public Horos lesson and its earlier GitHub review;
the final entry pins the subsequent scan-level correction. It is not evidence
that the catalogue change itself was public. Public evidence is recorded after
the reviewed catalogue build is deployed.
