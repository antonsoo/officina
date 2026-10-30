# Horos discovery and reasoning journeys

The catalogue adds Horos's Aristotle workshop with two direct investigations:

| Search | Investigation | Learner operation |
| --- | --- | --- |
| `λίθος`, `horse and stone`, `ὅροι`, `Analytica priora` | Horse and stone | Keep the premises true, move C outside A, compare the worlds, then construct a witness from the allowed regions |
| `ἔκθεσις`, `ekthesis`, `ἂν ληφθῇ`, `existential import` | Take one of the Cs | Remove the shared instance, identify the blocked C requirement, then withdraw the existence assumption |

Each route selects its question and Greek reading directly. The review link is
pinned to a source commit containing the audit and the actual exercise steps.
Each preview shows its selected investigation. The instance-taking preview was
captured from the actual public lesson with C selected and one shared object;
[the capture receipt](../studies/horos-local/inhabitant-preview.json) records its
URL, selection, viewport, and bytes.

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

## Final public review

The final catalogue build comes from `be99a41e0cca261ed8e03836f7a10fcb1b58d0c7`.
Its **88 files** reproduce from a fresh Node 24.22.1 archive with `npm ci` and
`npm run build`; the build validates all 35 entries and thumbnails and runs
TypeScript. [The clean receipt](../studies/horos-local/clean-build.json) records
all hashes. Lint, format checking and 45 tests also passed on the immediately
preceding code revision; the later change only corrects preview metadata and
adds its actual image.

The deployed catalogue then passed **eight public journeys**: both investigations
in Chromium and Firefox, at 1440px and 375px, with three alternate search handles
for each. The driver used actual canonical links and the corrected commit-pinned
audit. It verified the displayed original scan, located the excerpt's column,
and saved each learner's reasoning through a native download.

- [Public journeys](../studies/horos-public/review.json)
- [Hosted bytes before](../studies/horos-public/bytes-before.json) and
  [after](../studies/horos-public/bytes-after.json): all 88 build files match,
  including the corrected investigation preview and the catalogue JSON.
- [Screenshot identities](../studies/horos-public/screenshot-identities.json):
  identical images reuse the retained local capture; differing final public
  images are retained separately and visually inspected.

The generated Pages branch is `gh-pages` at `/`, deployment commit
`73142bd3efdf73cb07665094c15077f8b6855338`. The Pages API returned a null status
and the Actions run listing was empty during review; neither is presented as a
passing remote check. The hosted byte comparison and browser operations establish
the delivered behavior independently. No general audit of the other 34 projects
or comprehensive accessibility certification is claimed by these two journeys.
