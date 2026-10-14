# Gnomon: the first PDF works after disconnecting

Source [`12e072d4ed5772c2614c6ecff76314b208d136ac`](https://github.com/antonsoo/gnomon/commit/12e072d4ed5772c2614c6ecff76314b208d136ac)
was pushed and matched remote `main` when checked. All 18 changed files
(319,586 bytes) matched their pinned public raw URLs. The
[publication receipt](evidence/gnomon-offline-pdf-2026-10-13-public.json)
retains sizes and hashes. Tags and `gh-pages` were unchanged. This is a source
update without a package release or hosted deployment.

Previously, a loaded designer could not make its first A4 or Letter PDF after
disconnecting: both browsers failed to fetch the PDF script. The writer now
loads with the app. A user can disconnect, open or edit a design, then print it
without an earlier PDF download having prepared the browser.

[Eight actual first-PDF downloads](https://github.com/antonsoo/gnomon/blob/12e072d4ed5772c2614c6ecff76314b208d136ac/studies/offline-pdf/README.md)
cover Chromium and Firefox, both paper sizes, and desktop/phone widths. All
work offline without further network requests. Compared with the preceding
online exports, all PDF bytes match except random file IDs; an independent
PDFium reader also matches all 36 corresponding page dimensions and rendered
pages. The actual before/after downloads and two inspected export-panel
screenshots are retained. Clean types, lint, 294 unit checks, build and
68 browser workflows pass.

This moves transfer cost to initial loading: the gzip level-9 JavaScript
estimate rises from 23,966 to 155,854 bytes. These are build sizes, not measured
network timings. Drawing calculations are unchanged. The app still needs to
load before disconnecting; no offline reload or installation was added.
Physical printing and assembly remain unverified.
