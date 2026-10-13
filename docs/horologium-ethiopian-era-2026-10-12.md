# Horologium: name the Ethiopian era correctly

Source [`7166a0b`](https://github.com/antonsoo/horologium/commit/7166a0b8611e6e33bfdc1ebc07077ded98c926ad)
corrects the Ethiopian tablet's era and epoch explanation. On Gregorian
12 October 2026, the calculation already returned 2 Tikimt 2019, but the
summary called that Anno Mundi. The explanation also placed the Ethiopian
epoch 7-8 years after the Coptic epoch.

| Convention | Year on that date |
| --- | ---: |
| Ethiopian Era of Incarnation (Amete Mihret), calculated by Horologium | 2019 |
| Ethiopian Era of the World (Amete Alem, Anno Mundi) | 7519 |
| Coptic Era of the Martyrs | 1743 |

The corrected explanation places the Incarnation epoch 276 Julian years
before the Coptic epoch. The [study and primary references](https://github.com/antonsoo/horologium/blob/7166a0b8611e6e33bfdc1ebc07077ded98c926ad/studies/ethiopian-era/README.md)
retain the old text, corrected text and independent ICU comparisons. All 26
date results already agreed before this change and remain numerically
unchanged. Dates before the era retain their explicit proleptic note.

A clean implementation archive passed installation, lint, type checks,
235 existing tests, build and 58 browser tests. Four dedicated offline
Chromium/Firefox sessions entered 16 dates at desktop/phone widths; all
four screenshots were inspected. All 233 archive files remained unchanged,
and all 30 served production files matched the build exactly.

The 74,827-byte package was installed in empty projects on Node 20.0.0 and
24.21.0. ICU 72.1 and 78.3 both match the 26 dates; each installed library's
38 files match the clean build. Both public-package import checks pass.
The [artifact receipt](https://github.com/antonsoo/horologium/blob/7166a0b8611e6e33bfdc1ebc07077ded98c926ad/studies/ethiopian-era/verification.json)
records package SHA-256
`8ce9aeaf907536e42cc19a96ba8f9979af488f3f29655cef042a9bf45519093b`.

The [public-source receipt](evidence/horologium-ethiopian-era-2026-10-12.json)
checks clean local/remote main equality and all 13 changed files (149,787
bytes) against the pinned public source. Version remains 0.2.3. Tags and
`gh-pages` are unchanged; no npm release or hosted deployment occurred.
