# Find the boundary; keep the bell measurements

The existing Shiguzhai project now has a specific matching workshop. Search
**269 Hz**, **439.523**, **reference boundary**, **classification** or **石鼓寨**.
Its preview and summary lead to the operated two-reference comparison in the
original room. The Piao-shi craft bench remains the project's general demo link.

This records the initial local candidate. Its review URL pinned Shiguzhai commit
`125083a4e292e8e97a4814756d05be7d4d708968`, before publication. The subsequent
[public discovery review](shiguzhai-reference-publication.md) records the updated
immutable audit pin, actual public journey and hosted-byte checks.

## Observed local journey

Chromium and Firefox, each at 1440 and 375 px:

1. Type every source term and find the specific matching workshop. Typing
   leaves the address unchanged.
2. Select **Ancient world**, explicitly copy the search link, and reopen it.
   The query, audience and matching workshop return.
3. Follow the recorded-review link with the keyboard. Its bytes come from the
   actual immutable local commit.
4. Follow the workshop link with the keyboard. It retains the two A4 references,
   original source frequencies, group, observation policy and `#reference`.
   The section is visible on entry.
5. Hold A4 = 439.524 Hz and change only the current reference to 439.523 Hz.
   The full-list count changes from ten modern keys to nine. Inspect the
   original full source table; its actual image matches the retained JPEG.
6. Download a reading through the interface. It preserves the newly operated
   comparison and contains no script. No page error or document overflow occurs.

[Machine receipt](shiguzhai-reference-local.json) ·
[Desktop workshop result](assets/shiguzhai-reference-desktop.png) ·
[Phone workshop result](assets/shiguzhai-reference-phone.png).
The catalogue thumbnail is a resized real screenshot of the new lesson.

The journey server serves the local production builds. Public lesson URLs are
fulfilled from the local lesson build; the pinned GitHub review URL is fulfilled
with `git show` bytes from the local commit. The receipt states this substitution
explicitly. This checks the catalogue's actual destinations and the operated
local workflow. It does **not** check public delivery, source synchronization,
hosted byte equality, remote CI or deployment.

Service workers are blocked during this substituted-origin journey. The
lesson's own production review separately tests both rooms and new downloads
after disconnecting, with workers active. Its source and build review is in
`shiguzhai/docs/reference-review.md`.

## Reproduce

With the sibling Shiguzhai checkout at the reviewed revision, installed
Playwright browsers and Node 24 or later:

```sh
npm --prefix ../shiguzhai ci
npm --prefix ../shiguzhai run build
npm ci
npm run build
npm run test:shiguzhai-reference-local -- /tmp/officina-bell-reference
```

The general catalogue checks also pass: lint, type checking, source formatting,
catalogue validation, 45 unit checks, production build, and the 44 general browser
checks. A fresh archive installed and built under Node 24.22.1 produces the
same **103 files** as the journey's catalogue build:
[clean-build receipt](shiguzhai-reference-clean-build.json).
Both output directories are `dist/`; their bases remain `/officina/` and
`/shiguzhai/` respectively.
The initial local results above are distinct from the later public delivery observations.
