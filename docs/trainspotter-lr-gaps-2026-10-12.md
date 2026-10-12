# Trainspotter: retain supported schedule changes around damaged readings

Source at [`027f856`](https://github.com/antonsoo/trainspotter/commit/027f8562fc95492481f213d5fe894a2d5fe1141c)
fixes a learning-rate diagnostic that could lose all discontinuity findings
because one unrelated reading was unusable. Finite negative readings could
instead create a spurious jump and hide the real changes by inflating the range.

A controlled CPU PyTorch capture runs 120 actual SGD updates with two intended
MultiStepLR drops. Five derived exports each change only the LR cell at step
10; optimizer state and objective values remain unchanged.

| Input | Baseline discontinuity notes | Fixed notes |
| --- | --- | --- |
| Complete capture | Steps 39-40 and 79-80 | Same |
| Step 10 unreadable, NaN or infinite | None | Steps 39-40 and 79-80 |
| Step 10 replaced with -1 | Spurious steps 9-10 | Steps 39-40 and 79-80 |
| Level change separated by an unreadable reading | None | Still no invented adjacent jump |

Peak and range calculations now use finite nonnegative observations. Adjacent
comparisons, ramp neighbors and phase detection stay inside contiguous usable
segments. The threshold still uses the whole run's usable range. Discontinuity
notes require six contiguous observations; a missing-warmup note cannot replace
an unusable beginning with a later value. Findings retain their segment scope
and remain informational. The capture's intended schedule changes are not
labelled optimizer failures.

The [study](https://github.com/antonsoo/trainspotter/blob/027f8562fc95492481f213d5fe894a2d5fe1141c/studies/lr-gaps/README.md)
checks captured weights/objectives against 70-digit Decimal arithmetic and
replays nine inputs through the CLI's JSON and standalone HTML outputs.
Unreadable input retains exit 2 and its exact coordinate. Reader metadata and
non-LR findings are unchanged. A separate historical comparison finds identical
872 finding dictionaries over 5,048,345 LR observations in 4,052 usable LR
histories. Eighty-two unavailable listed files remain explicit omissions; this
is compatibility evidence, not an accuracy estimate.

A clean source archive and isolated wheels pass all 605 tests on Python 3.10,
3.12 and 3.14. The declared dependency-minimum environment includes NumPy 1.24.0,
TensorBoard 2.12.0 and scikit-learn 1.5.0; its nine CLI reports exactly match the
modern Python 3.14 reports. The full browser suite passes 204 report workflows.
Eight additional installed-report workflows verify offline Chromium/Firefox
at desktop and 375px, with keyboard downloads and no network requests, page
errors, CSP violations, accessibility findings or overflow. Eight retained
before/after screenshots were inspected.

The [verification record](https://github.com/antonsoo/trainspotter/blob/027f8562fc95492481f213d5fe894a2d5fe1141c/docs/verification-lr-gaps-2026-10-12.md)
retains commands, logs, reports and byte comparisons for 87 source/build inputs
and all 29 installed package files. It also describes the initial pytest cache
warnings and the unchanged diagnostic limits.

The [publication receipt](evidence/trainspotter-lr-gaps-2026-10-12.json) verifies
a clean checkout, local/remote HEAD equality and freshly fetched matching bytes
for all 55 changed public files (2,060,701 bytes). Package metadata remains
0.2.6. Both commits use `[skip ci]`; `gh-pages` and all release-tag refs are
unchanged. No PyPI release, tag or hosted deployment was published.
