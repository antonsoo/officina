# Whole fraction evidence and preserved review decisions

Fieldproof no longer treats a slash fraction as evidence for its numerator or
denominator. A visible native PDF printing `Quantity 1⁄2 m` previously verified
both 1 and 2 as that quantity. Six authored pages retain 36 component claims:
26 false approvals before, none after. The complete invoice's six other fields
remain verified. Fractions still need review; the correction does not invent
fraction arithmetic or a model-accuracy claim.

The [native study](https://github.com/antonsoo/fieldproof/tree/main/studies/fraction-evidence)
retains the PDFs, actual extraction/re-verification commands, original source
spans and an unchanged 1,052-receipt corpus replay. All 133,722 verdicts,
candidate counts and location classifications remain unchanged. Two already
reviewed mutated quantity claims retain wider slash context; the other 133,720
complete observations are identical. Supplied OCR annotations were used;
no new recognition or model run is claimed.

A fresh clean source archive, wheel and sdist were verified. The packaged
41 modules and 23 UI files match both installed wheels. Source/floor Python
checks passed, with the five real-Tesseract cases explicitly skipped because
the executable is absent. The actual production browser suite passed 108
workflows. Both before/corrected servers served exactly the 23 fresh UI files.

Four baseline and four corrected installed-browser contexts at desktop/phone
widths each phase exercised 20 real JSON/CSV/XLSX/archive/restored-JSON downloads.
Numeric spreadsheet cells match the export ledger. Value downloads were offline;
archives were saved and restored online. Four more corrected-browser contexts
opened an actual archive from the old verifier: edited value 0.5 and original
claim 1 survived, while automated status was recomputed from verified to needs
review. All ten retained screenshots were inspected.

Source `c600517c2f53b4ee00ef065395bfd12fd73ac8b1` was pushed; all 58 checked public
files, including the 41 modules and every changed file, match. An actual fresh
pip upgrade from registry 0.2.7 installed those exact 41 modules and replayed
the native/CLI workflow. A direct Git install has no bundled UI; the documented
checkout build and the separately tested local wheel include it.

Documentation/evidence head `f490439b4b455db997074b5166862bbd0dd65d86` was pushed and its updated
source pin, legacy archive, receipts and screenshot checked at public raw URLs.
No registry release or hosted static-demo update was made.
