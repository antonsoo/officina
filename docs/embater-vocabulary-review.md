# Find a column's eye through the catalogue

The existing Embater entry gains one workshop, not another repository. Search
`centrum oculi`, `oculus`, `oculi`, `ὀφθαλμός`, `volute eye` or `Latin genitive`.
The workshop opens an actual selected Ionic eye in Latin study mode. Its thumbnail
is the application’s selected-detail screenshot, not an illustrative mockup.

Operate Local detail and zoom, read the inflected form *oculi*, open checked
printed page 71 of Krohn's 1912 Vitruvius, and keep an illustrated study with the
page and a native vocabulary CSV. Geometry remains the existing modern drawing;
the linked Embater review explains its limits, retained evidence and resource cost.

The review is pinned to Embater commit
`7678dd16f844a2915a893c63cc045ce3d9ce0896`, including the completed hosted publication audit, source/model boundary,
51 cited rules, 26 retained complete pages, corrected source spans and the actual
local browser/file audits. The source feature code is at `5dac1e0`. This is not a
claim of fresh philological review for every inherited world-vocabulary entry.

[Local catalogue to public lesson receipts](embater-vocabulary-review/local.json)
record Chromium and Firefox, each at 1440 and 375 px. Each uses all six search
terms, checks that typing leaves the URL unchanged, copies and reopens the Greek
search link, follows the pinned review and live lesson by keyboard, operates
detail zoom, checks the actual displayed page's SHA-256, and saves a real HTML
study. Its embedded page matches the retained original; it contains no scripts.
The immutable raw review matches the local git blob. Each reviewed view fits the
viewport and reports no page errors. This is a local catalogue calling the public
Embater site; it is distinct from the hosted catalogue review below.

Reproduce after building and serving Officina:

```sh
node scripts/embater-vocabulary-journeys.mjs http://127.0.0.1:4496/officina/ /tmp/officina-eye
```

The catalogue schema, existing unit checks, lint, type checks and source formatting
checks pass. Hosted publication and browser receipts are recorded separately.

The hosted catalogue was also operated in both engines and at both widths. The
first public replay passed Chromium but lost a Firefox pointer activation during
font loading. The driver now waits for the lesson fonts and explicitly checks the
Local detail pressed state before zooming. The subsequent four-case replay passes.
This is a harness observation, not proof that a font-layout shift was the cause;
no application interaction code was changed to make that replay pass.

The final review link includes the completed Embater publication receipts: all
89 hosted files match through both gzip and identity responses, and the complete
hosted grading/source/offline journeys pass. Source CI ran zero steps and is not
reported as successful validation.

## Published catalogue

Source `efb06ac5119eefe62c4d0f93261788fafcc21996` is on `main`. The final
reviewed Pages branch is `13f27d8307bb05654b4a56e37c0546bbdfbc00a5`.
The [107-file clean build](embater-vocabulary-review/build.json) and
[all 107 canonical hosted files](embater-vocabulary-review/public-bytes.json)
match byte for byte. The [.nojekyll marker](https://antonsoo.github.io/officina/.nojekyll)
was restored after a second sync accidentally removed it; this final deployment
retains the marker. No application asset differed from the reviewed build.

The [final hosted journey](embater-vocabulary-review/public.json) passes Chromium
and Firefox at both widths, including the final immutable review URL. Its raw
review matches the git blob; the actual downloaded study retains the checked
printed page and native CSV. The hosted lesson is selected at the eye on arrival.
The final canonical catalogue entry was rechecked after browser operation.

Officina's Actions API reported `total_count: 0`, so no source CI run is claimed.
The Pages deployment status reports success separately. Publication did not change
Pages settings, authentication or billing configuration.
