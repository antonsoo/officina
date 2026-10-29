# Finding and operating the Gaius counterexample workshop

The catalogue now connects Roman-law and Latin searches to
[Traditio](https://antonsoo.github.io/traditio/), including a specific
[counterexample exercise](https://antonsoo.github.io/traditio/#argument).
The activity asks the learner to submit facts that defeat a deliberately
broad claim, distinguish a failed premise, cite the Latin, and retain the
submitted case with a written explanation.

The catalogue source is `e1d96281f9a87a95ed614c29e59337768994d433`.
Its recorded-review link pins Traditio's `a6447b6e7647d3c28c721dceb20bac559d9b906c`
revision and the actual-work instructions in `docs/review.md`. The project and
workshop previews are unaltered browser screenshots from that same revision.

## What was operated

| Catalogue origin | Browsers and sizes | Search and learner journey |
| --- | --- | --- |
| Local production build | Chromium 153.0.8010.12 and Firefox 155.0; 1440 x 1000 and 375 x 1000 | Four searches, explicit shared links, actual public pinned review and lesson, Latin scan, native argument download/reopen |
| Public canonical site | The same four browser/size combinations | The same complete journey, without route interception or URL rewriting |

Every journey searches **Roman law**, **usucapio**, **in bonis** and **quamvis**
under the Ancient world audience. Typing leaves the address unchanged. Keyboard
activation of **Copy search link** creates a URL that restores the query and
audience. Each query exposes the specific workshop row, thumbnail, lesson link
and recorded-review link.

The browser actually opens the pinned GitHub review, then follows the catalogue
link into the canonical lesson. It first submits the owner-sale case against a
claim about a knowing non-owner and observes the failed-premise response. It
then constructs peaceful Italian possession at two years, submits that case,
reads _quamvis_ in 2.51 and cites 2.51 plus 2.42. The actual displayed page-149
Blob matches Traditio's retained SHA-256 identity.

Changing the live entry to force changes its title while the submitted peaceful
case stays fixed. The browser downloads the version 2 JSON, clears the argument,
and reopens that download with the same submitted facts, citations and note.
The retained native files are in each journey's evidence directory.

All eight journeys passed without page errors or document overflow. The filtered
catalogue had zero violations under axe's WCAG 2/2.1 A/AA tags. The local and public
screenshots were inspected; seven of the eight public images are byte-identical
to the inspected local journey images, and the remaining Firefox desktop
catalogue image was opened separately. The thumbnail response bytes were checked
against the actual retained image, not just its filename.

## Build and publication evidence

A fresh archive of the catalogue commit passed `npm ci`, lint, strict types,
format checks, 45 existing tests and the production build under Node 24.22.1 /
npm 11.19.1 on Linux x64. The catalogue contains 34 entries. All **86** build
files matched the locally operated production output.

Deployment commit `83f8f29` advanced the existing `gh-pages` branch without a
force push. Its only changes are the catalogue JSON and the two Traditio images.
The canonical root, explicit index and all 86 build files matched before and
after the public browser journeys. The three changed public source artifacts
also matched their immutable GitHub source revision.

GitHub reports the site's legacy `gh-pages` configuration. Its latest-build
metadata endpoint returned HTTP 404, and the workflow query reported no runs.
No remote CI execution or successful build-metadata response is claimed; actual
public bytes and browser behavior were checked independently.

| Evidence | Retained record |
| --- | --- |
| Fresh build and full file identities | [clean-build.json](../studies/traditio/clean-build.json) |
| Local catalogue to public lesson, four journeys | [local/journeys.json](../studies/traditio/local/journeys.json) |
| Fully public catalogue to lesson, four journeys | [public/journeys.json](../studies/traditio/public/journeys.json) |
| Canonical bytes before / after journeys | [Before](../studies/traditio/public-files-before.json), [after](../studies/traditio/public-files-after.json) |
| Source artifacts, remote refs and available metadata | [source-and-publication.json](../studies/traditio/source-and-publication.json) |

The browser journey can be repeated from a checkout beside Traditio:

```sh
node scripts/traditio-journeys.mjs https://antonsoo.github.io/officina/ ../traditio studies/traditio/public
```

Traditio's [own publication review](https://github.com/antonsoo/traditio/blob/5dfe5062781441d53f4a63ec70198e2439ab899a/docs/publication.md)
separately covers the complete lesson build, self-contained casebooks, source
integrity, offline reload/export and the limits of the historical model.
