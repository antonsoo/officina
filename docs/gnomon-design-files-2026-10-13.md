# Gnomon: carry an editable sundial design between sessions

Source [`c65635585a50ccf16bb261861a4b46e28a6efccf`](https://github.com/antonsoo/gnomon/commit/c65635585a50ccf16bb261861a4b46e28a6efccf)
was pushed and matched remote `main` when checked. All 34 changed files
(1,629,335 bytes) matched their pinned public raw URLs. The
[publication receipt](evidence/gnomon-design-files-2026-10-13-public.json)
retains hashes and sizes. Tags and `gh-pages` were unchanged; this source update
does not include a package release or hosted deployment.

A Rome wall design previously returned to the default San Francisco horizontal
dial after reloading. Exported SVGs and PDFs preserved the drawing, but there was
no file that could restore the editable settings.

Gnomon now saves a small `.gnomon.json` file with construction settings,
appearance and a fixed simulation minute. Reopening restores the winter/summer
clock adjustment and the selected occurrence of a repeated local time. Invalid
files, canceled reads, timeouts and stale reads preserve current work.

The [workflow and retained downloads](https://github.com/antonsoo/gnomon/blob/c65635585a50ccf16bb261861a4b46e28a6efccf/docs/design-file-verification.md)
include actual Chromium/Firefox reload-and-open runs at desktop and phone
widths, with differing device zones. The downloaded design JSON and both SVGs
remain byte-identical after reopening within each browser. All five PDF pages
render identically. Every served response matches the clean build. The clean
archive passed types, lint, 294 unit checks and 66 browser workflows.

[Four editable examples](https://github.com/antonsoo/gnomon/tree/c65635585a50ccf16bb261861a4b46e28a6efccf/examples/designs)
cover a declining Rome wall, southern-hemisphere horizontal dial, repeated
clock minute and half-hour adjustment. They are constructed settings for public
locations. Physical assembly remains unverified; preserve a finished SVG/PDF
when an exact historical drawing matters.
