# Am I Unlucky: reject invalid counts without changing the observation

Source is pushed to
[`b6d947e2def54aa0b3ff3f62c98c9b7ec084ff4d`](https://github.com/antonsoo/am-i-unlucky/commit/b6d947e2def54aa0b3ff3f62c98c9b7ec084ff4d).
The hosted demo, tags and package version remain unchanged.

Entering 1.5 copies previously produced an Unlucky verdict for one copy, exported
that observation and copied a URL containing `k=1`. Blank and negative counts
were also silently replaced. The fields now retain invalid drafts with associated
errors. Sharing is disabled for invalid inputs; every edit removes the previous
result and card immediately. Valid settings remain immediately shareable.

| Offline browser observations | Before | After |
| --- | ---: | ---: |
| Invalid inputs shareable | 48/48 | 0/48 |
| Invalid inputs displaying statistics | 28/48 | 0/48 |
| Invalid inputs offering a card | 20/48 | 0/48 |
| Previous card present immediately after an edit, including limit controls | 52/52 | 0/52 |

All 44 valid observations retain identical result text, charts, share queries and
card text. All 32 downloaded PNGs preserve their image-data chunk hashes; the
Firefox private `deBG` chunk differs, so only the 16 Chromium files are claimed
byte-identical. Four valid calculation-limit controls remain shareable and show
the same explicit limit message. These are constructed inputs, not player logs.

A clean archived build passes ESLint, TypeScript, 407 unit tests and 142 browser
workflows under Node 24.21.0. Actual offline Chromium/Firefox replays cover desktop
and phone sizes; all eight before/after screenshots were viewed. All 204 archived
core files, 35 build files and 35 browser-served files match their compared copies.
Probability algorithms, presets, dependencies and number-input parsing are unchanged.

The [study and replay commands](https://github.com/antonsoo/am-i-unlucky/blob/b6d947e2def54aa0b3ff3f62c98c9b7ec084ff4d/studies/simple-inputs/README.md)
retain individual cases, screenshots and artifact hashes. The
[public-source receipt](evidence/am-i-unlucky-simple-inputs-2026-10-12.json) verifies
clean local/remote main equality and all 19 changed files, 1,522,906 bytes, against
pinned public source. Tags and `gh-pages` match the pre-work refs.
