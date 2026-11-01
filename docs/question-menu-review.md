# Five questions, one working preview

The opening selection previously placed a large temple feature above three
prose blocks. On a phone, visitors passed almost two thousand CSS pixels before
reaching the project index. The new selection makes the starting question an
operation: choose a task, inspect its actual workshop image, then open its
activity, recorded review or project source.

Desktop uses a vertical tablist with arrows, Home and End. Phones use a native
selector for the same five questions. The preview keeps one activity visible
at a time. Changing the question neither changes the URL nor clears a search.
An unavailable image leaves a useful message and the actual activity links.

The visual direction retains Officina's existing fonts, moss colors and concise
author identity. Its scenario menu and preview window carry the change. There
are no decorative levels or invented progress scores. The
[design plan](question-menu-design.md) records the layout choices.

## A measured change in navigation

The old source at `9d6fb98` was rebuilt into a separate temporary directory.
Both versions were rendered at identical 1000px-high viewports after fonts and
the selected image decoded. The [layout receipt](question-menu-review/layout.json)
records Chromium and Firefox, light and dark, at both widths. It measures the
document position where the complete index begins, not a loading benchmark.

| Viewport width | Before, CSS px | After, CSS px | Less scrolling before the index |
| --- | ---: | ---: | ---: |
| 1440px | 1412 | 958 | 454px |
| 375px | 1996 | 1066 | 930px |

All eight browser/theme configurations fit their viewport. The new menu offers
five questions where the former selection offered four starting activities.
The phone selector avoids adding another stack of five feature cards.

Actual screenshots:

- [Desktop before](question-menu-review/before-1440.png)
- [Phone before](question-menu-review/before-375.png)
- [Current desktop](assets/hero.png)
- [Current phone](assets/question-phone.png)
- [Desktop dark](assets/question-dark.png)
- [Phone dark](assets/question-phone-dark.png)
- [The Aristotle selection on a phone](assets/question-mobile.png)

## Operated review

The full local suite passed: lint, strict types, formatting, catalogue checks,
unit tests, the production build and **54 Playwright checks** in Chromium and
Firefox. The new checks operate the menu by keyboard, enter its preview, verify
all five activity/review/source routes, preserve shared searches, use the phone
selector in both themes and recover from an unavailable preview. The menu
checks also produced zero axe violations in their reviewed states; no human
accessibility audit is claimed.

[Twenty actual handoffs](question-menu-review/journeys.json) start in the local
menu, choose a question, follow the link to its existing public lesson and
operate a meaningful control. Each immutable review was fetched as raw bytes
and matched the corresponding file at its pinned local Git revision.

| Selection | Actual operated result |
| --- | --- |
| Architecture | Doubling columns changes the displayed equation to twelve columns, retaining the source record |
| Logic | Pin the first world and choose the stone substitution; the premises survive a false proposed conclusion |
| Music | Match interval order; all eight pitches agree, playback's audio clock advances, and the source page opens |
| Geometry | Select the twelve-sided stage and submit an altered root approximation; the bound status responds |
| Software | Load the GenAI semconv sample and filter spans for `chat`; six of sixteen match, with two ancestors retained |

The public-lesson journey waits for the actual Greek source reader before
operating the class room. Merely finding its static button in the HTML is not
evidence that its event handlers are ready. Audio-clock advancement establishes
browser playback behavior, not a claim that a human listened to the output.

To repeat the local checks and the handoffs:

```sh
npm ci
npm run lint
npm run typecheck
npm run format:check
npm test
npm run test:browser
npm run preview -- --host 127.0.0.1 --port 4195 --strictPort
```

In another terminal, while preview runs:

```sh
npm run test:questions -- http://127.0.0.1:4195/officina/ test-results/question-journeys
```

`npm run build` produces **`dist/`**, with base **`/officina/`**. No dependencies
were added. Image changes fetch only the selected preview; selection itself
makes no search or language-service request.

## Original local boundary

[The clean-build receipt](question-menu-review/clean-build.json) records a fresh
archive of `644778a`, a separate `npm ci`, all 45 unit checks, lint/types/format
checks and a production build under **Node 24.22.1**. All **103 files**
(7,951,536 bytes) match the reviewed build byte for byte. That inventory
includes the existing catalogue images and fonts; it is not an initial-transfer
measurement.

At that initial review the menu was a local source/build improvement. Its existing public destinations
were operated, but that does not establish that this new menu is hosted. The
new Horos conditional room is not advertised as deployed. Neither repository
was pushed or deployed at that point: workspace house standards left publication for review.
The later [conditional discovery and publication review](conditional-discovery.md) records the subsequent catalogue and hosted checks.
No CI run or registry release is claimed.

Suggested description: “Open-source experiments by Anthony Mercer: choose a
question, operate the model and inspect its sources.”

Topics: `portfolio`, `education`, `ancient-greek`, `visualization`, `typescript`,
`open-source`.
