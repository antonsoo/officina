# PDF paint and credential masking, 2026-10-16

Four reproduced defects now have source corrections and retained evidence.
Source changes, installed artifacts, hosted demos and registry releases are
separate states. These studies use authored inputs; they do not measure how
common the defects are in production.

| Product | Reproduced behavior | Observed result |
|---|---|---|
| Fieldproof, clipping bounds | Text outside a path or Form bounding box falsely verified an amount | 31 incorrect verified claims become reviewable across 46 PDFs; 107 visible controls retain their verdicts |
| Fieldproof, native paint | A printed image says 90 over native text saying 900; white-on-white and patterned covers also falsely verified | 20 hidden amounts become reviewable across 34 PDFs and 102 claims; 82 visible controls retain their verdicts |
| Veil, labelled credentials | Short passwords and tokens bypassed entropy detection, including structured SDK tool arguments | 25/25 raw examples fully masked; 24/24 actual SDK text/tool request paths mask the values and restore originals |
| Veil, opaque private keys | A high-confidence email/card/credential inside a private-key comment defeated whole-block masking | All 18 native GnuPG cases mask completely; usable signing keys recovered from masked outputs fall from 6/18 to 0/18 |

The [clipping study](https://github.com/antonsoo/fieldproof/blob/2fb1cdb5b381f0b6c95b94c131431a60be3b6156/studies/clipped-text/README.md)
retains independent PDFium/Poppler controls, installed artifacts and actual
browser correction/archive restoration. Conservative outer bounds cannot
establish arbitrary pixel visibility; partly readable text can require review.

The [native-paint study](https://github.com/antonsoo/fieldproof/blob/621e738283bc962a287cdcecdcfe49cae18ddbfd/studies/flat-raster/README.md)
compares an original page with an independent reference whose native text paint
is suppressed, while retaining clipping, paths and images. All 68 independent
PDFium/Poppler checks agree with declared pixel states. Native words retain
source text and geometry; missing contributions and unavailable observations
cannot establish document conventions, row anchors or column headings. Regional
contribution does not prove readability, character identity or ownership of
overlapping native ink. A 50-page authored ledger costs 8.4 seconds versus 3.3
before on the shared host; these are not controlled universal timings.

The installed package passes 693 checks with current dependencies and exact
oldest direct dependencies, including PDFium 4.30. Five real-Tesseract checks
skip because a working engine is unavailable. All 96 production browser
scenarios pass, preserving original 900, corrected 90 and the automated review
reason through export and archive restoration. The 64-page, 29,056-word worker
control loads in 6.9 seconds within unchanged worker limits.

The [hosted PDF receipt](https://github.com/antonsoo/fieldproof/blob/621e738283bc962a287cdcecdcfe49cae18ddbfd/studies/flat-raster/results/hosted-browser.json)
checks the actual public Hidden text sample in four browser/width contexts,
including offline JSON download and persisted correction. All 36 hosted files
match the tested build. A fresh registry-to-pinned-Git installation reproduces
the change with all 40 runtime files matching; the direct source install is
CLI/library only and requires a separate UI build. The [source-byte receipt](evidence/fieldproof-native-paint-2026-10-16.json)
covers all final changed source/evidence files, including the earlier 95-file
publication receipt. Registry releases remain unchanged.

The [labelled-credential study](https://github.com/antonsoo/veil/blob/0e3052c995ef0efe127ed7b50949c420ce918b78/studies/credential-fields/README.md)
retains explicit raw assignment and immediate structured-key context. The
1,483-file technical corpus adds 27 detections, including seven source-variable
false positives that remain documented. No prior detection changes. Current
and older SDK installations capture actual outgoing requests without contacting
providers; offline Chromium/Firefox downloads preserve original text exactly.

The [private-key study](https://github.com/antonsoo/veil/blob/f62bf202c9d53c0746f70da67e6eb098f7628471/studies/private-key-blocks/README.md)
uses one unused synthetic Ed25519 key in 18 input shapes. Recovery imports the
masked payload into a separate keyring, signs a challenge, and verifies the
expected fingerprint. The six recoverable outputs are six variants of that one
key. Partial-body cases were not recoverable by this procedure before or after;
this does not prove all partial key material harmless. No private key bytes are
committed in the evidence. Opaque whole-block masking now takes priority over
nested entities, including armor metadata in incomplete blocks.

Veil's [tested pinned install command](https://github.com/antonsoo/veil/blob/e8009f97f83c51d3b3366adf21250667548ef0ef/README.md#quickstart)
upgrades an actual PyPI 0.4.4 installation to the corrected source, despite both
artifacts declaring 0.4.4. The receipt verifies all 38 runtime files, native
masking and recovery outcomes. The registry package has not been republished.

Veil's [hosted verification](https://github.com/antonsoo/veil/blob/b00ff73662ef9e2285c303afb7c71654e6715ddf/studies/private-key-blocks/README.md#hosted-verification-2026-10-16)
now covers the deployed build: all 27 served files match the tested source,
and both studies repeat exact offline downloads in Chromium and Firefox at
desktop and phone widths. The 17 browser fixtures include syntax/public-key
controls; browser armor bodies are not usable keys. Native recovery remains
separate. The [new receipt](evidence/veil-hosted-credentials-2026-10-16.json) records
29 changed files that also match pinned public source bytes. No registry release is inferred from this deployment.

The Fieldproof catalogue thumbnail is a fresh 1200x750 capture of the actual
public `#hidden-text` demo, compressed through the existing thumbnail script
to 41 KiB and visually inspected. The catalogue keeps its independent CORD
receipt study link; its thumbnail now shows the deployed review workflow.
Veil's description says detected values, matching the detector's documented
coverage limits. Catalogue checks, all 32 unit checks, and all 32 production
Chromium/Firefox scenarios pass.
