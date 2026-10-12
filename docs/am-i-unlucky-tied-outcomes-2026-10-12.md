# Am I Unlucky: keep tied outcomes visible

Pushed source at
[`b9a9a62`](https://github.com/antonsoo/am-i-unlucky/commit/b9a9a62d99dc1488263e162a5cf2291d20d13e14)
repairs completed-run comparisons that counted same-attempt finishes as faster
players. The exported luck card had repeated the error.

| Retained history | Baseline result | Corrected comparison |
| --- | --- | --- |
| First attempt at a 90% rate | Unlucky; 90% supposedly finished sooner | 0% earlier, 90% tied, 10% later; common |
| Second roll, 50/50 then guaranteed | Legendary bad luck; everyone supposedly finished sooner | 50% earlier, 50% tied, 0% later; common |
| Still waiting after three attempts at 50% | 6.25% score for a hypothetical next-attempt completion | 12.5% still waiting, 87.5% finished |
| Claimed completion before enough attempts | Could receive a luck rating | Impossible under the supplied settings; no rating/card |

The page and downloaded PNG retain all three completion shares. The meter
outlines the full interval occupied by ties; rarity uses inclusive outcome
tails. An unfinished run remains censored. Small lower binomial tails are
summed directly so positive waiting probabilities do not disappear through
subtraction from a rounded one. Pity comparisons include the unplotted live
mass and refuse histories outside the calculated support. The legacy
strict-later math helpers retain their existing meaning and outputs.

The [retained study](https://github.com/antonsoo/am-i-unlucky/blob/b9a9a62d99dc1488263e162a5cf2291d20d13e14/studies/tied-outcomes/README.md)
checks 84 simple histories against exact combinatorial fractions and 2,688
pity histories against an independent rational absorbing-chain oracle. Of
these, 1,155 have supported positive-mass completions and 1,617 are unavailable.
Maximum absolute probability error is below 4e-14. The full distributions,
moments, confidence milestones and legacy strict-later outputs are identical
before and after. Six further scenarios replay both bundled presets, including
multiple copies and an advanced guaranteed counter, with identical model
outputs. This uses the existing pinned tables; it is not new game-data
collection or validation of a game's rules.

A fresh archive of implementation `e57ce01` passes lint, type checking,
formatting, 407 unit checks in each of two locales, the production build and
134 browser workflows. Eight separate Chromium/Firefox captures at 1440 and
375 px stop a no-store HTTP server before the first card is opened. Each actual
PNG has the expected three shares and 1080x1350 dimensions; page statistics
remain identical to baseline. All final captures have zero subsequent HTTP
requests, page errors, CSP violations or horizontal overflow.

That workflow also reproduced unnecessary offline font requests. Card faces
now load before the first paint, and one variable Sans face covers the four
used text weights. Closing a card during pending font loads leaves focus
usable and prevents painting the obsolete canvas. All twelve before/after
page and downloaded-card images were opened and inspected. The artifact
receipt checks 66 build inputs, 21 unchanged source files and nine served
assets against the clean build.

The [public-source receipt](evidence/am-i-unlucky-tied-outcomes-2026-10-12.json)
compares all 49 changed pinned public files with the clean checkout and checks
HEAD against remote main. The source push used the documented workflow-skip
marker; the observed gh-pages ref remains
`b8a5df1b2dd38919bb49c6dd881bbc621f173b54`. No package release, tag or hosted
deployment was performed. Browser checks apply to the retained local build.
