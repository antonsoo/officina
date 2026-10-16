# Transparent PDF evidence, grade conversion and tag payloads, 2026-10-15

Three reproduced defects have pushed source corrections and retained before/after
evidence. Ghostchars' existing static inspector is also deployed and verified.
No registry package was released.

| Product | Reproduced failure | Corrected behavior | Implementation |
|---|---|---|---|
| Fieldproof | A fully transparent `$900` quote verified while the PDF visibly showed `$90` | Zero-opacity evidence requires review; it cannot supply conventions, row anchors or headers | `0e7a1d9` |
| Errorbars | Inspect's perfect/wrong native accuracies of 1/0 became imported means of 0/1, reversing the leaderboard | Refuse recorded opaque grade converters before inference or replacing exports; default and independently selected dimensions remain usable | `7bef068` |
| Ghostchars | A black flag around arbitrary tag-encoded instructions produced zero findings and survived sanitization | Exempt only registered RGI flags, detect wrapped payloads and preserve visible carriers and legitimate flag prefixes during repair | `d1c9ada` |

The [Fieldproof study](https://github.com/antonsoo/fieldproof/blob/0669eefded67e09be47b53855a2ffa76dd4b6512/studies/zero-opacity/README.md)
retains 42 authored PDFs and 84 claim checks: 19 incorrectly verified hidden
claims become zero, and all 65 painted controls remain verified. Both PDFium
and Poppler agree with every fixture's authored visibility in 84 pixel
comparisons. Text/geometry on ten existing PDFs remains byte-identical.
Clean installation passes 673 Python tests, with five real-OCR cases skipped;
70 web tests and 90 production browser checks pass. Wheels on Python 3.14/current
and Python 3.11/minimum direct dependencies retain the behavior, including actual
review, correction, export and archive restoration. This detects explicit alpha
and rendering state, not general pixel visibility or OCR accuracy.

The [Errorbars study](https://github.com/antonsoo/errorbars/blob/8dbb12cfd899f19c0d1b4ac9d23f0cac38d2ba5e/studies/inspect-converters/README.md)
retains six successful native Inspect mockllm runs over synthetic questions.
Two incorrect imports are now refused; default grade codes and a named `plain`
dimension retain correct results. The callable name in native metric parameters
does not preserve its mapping or closure. Clean installation passes 799 Python
tests and web checks. Installed Python 3.14/current and 3.10/minimum dependencies
pass all 16 CLI commands, preserving previous CSV/HTML/SVG files on refusal.
Twelve fresh offline Chromium/Firefox workflows verify valid native and CSV
round-trip reports and 24 actual evidence downloads. Undeclared conversions,
custom metric implementations and arbitrary reducers remain unchecked.

The [Ghostchars study](https://github.com/antonsoo/ghostchars/blob/9dc9ffbfb94b3727454fbd3a1ec65b07d411e877/studies/flag-tag-payloads/README.md)
improves authored library/CLI expectations from 7/24 to 24/24, eliminating ten
missed positive cases. An independently fetched Unicode table establishes the
three registered flag controls; detection and exact repair of 771 unregistered
wrappers improve from 0/771 to 771/771. Packed installs on Node 20.0.0 and 26.7.0
match all 53 built files and pass the actual scan/fix cases. Clean installation
passes 334 tests and 38 browser checks. The committed CLI matches its rebuild.
Non-RGI custom flags may be intentional; a finding is not a claim of malice.

Ghostchars' normal fast-forward `gh-pages` deployment is
`6fd27089211a7e5e9369506da02e9363922835d9`. All 32 served files match the
tested build. Twelve canonical hosted-page checks in fresh Chromium/Firefox
contexts, at desktop and 375px, disconnect before their first authored input
and retain exact selected output with no page/CSP errors or external requests.
The hosted [byte](https://github.com/antonsoo/ghostchars/blob/9dc9ffbfb94b3727454fbd3a1ec65b07d411e877/studies/flag-tag-payloads/results/hosted-bytes.json)
and [browser](https://github.com/antonsoo/ghostchars/blob/9dc9ffbfb94b3727454fbd3a1ec65b07d411e877/studies/flag-tag-payloads/results/hosted-browser.json)
receipts remain separate from source and package checks.

Pinned public-source receipts cover
[Fieldproof's 87 changed files](https://github.com/antonsoo/fieldproof/blob/0669eefded67e09be47b53855a2ffa76dd4b6512/studies/zero-opacity/results/publication.json),
[Errorbars' 43](https://github.com/antonsoo/errorbars/blob/8dbb12cfd899f19c0d1b4ac9d23f0cac38d2ba5e/studies/inspect-converters/results/publication.json)
and [Ghostchars' 59](https://github.com/antonsoo/ghostchars/blob/9dc9ffbfb94b3727454fbd3a1ec65b07d411e877/studies/flag-tag-payloads/results/publication.json).
Issues `officina-bahk`, `officina-51if` and `officina-scw8` are closed.
PyPI/npm releases, model accuracy and general prompt safety are not established
by these source and hosted-demo checks.
