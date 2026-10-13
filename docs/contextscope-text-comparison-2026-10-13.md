# Contextscope: inspect the edits inside similar prompt blocks

Source commit
[`8171750bc36135a284eea97bdeeb128bcee33b0f`](https://github.com/antonsoo/contextscope/commit/8171750bc36135a284eea97bdeeb128bcee33b0f)
is pushed and verified against remote `main`. All 42 changed files, totaling
1,117,142 bytes, match their pinned public raw URLs. The
[publication receipt](evidence/contextscope-text-comparison-2026-10-13-public.json)
retains sizes and SHA-256 values. Tags and `gh-pages` are unchanged. This is a
source browser feature; there was no hosted deployment or npm release.

## What changed

At baseline `e835a2f`, text blocks from the same message had identical
inspection button labels, and comparing them meant opening one at a time.
The source browser now displays full source paths and lets each displayed
later member be compared with the first. The existing synthetic edited-file
example is available from the example picker.

The comparison exposes literal changed lines with source line numbers, folded
unchanged context and complete text/original-JSON downloads. Whitespace, CRLF/LF
and missing final newlines remain significant. An escaped view reveals controls;
unpaired Unicode surrogates use a JSON-string download to preserve their values.
Source markup never becomes HTML. Similarity still does not prove removability.

The first 20 members remain the browser's display limit. Oversized inputs or
excessive comparison/display work get an explicit refusal and complete downloads,
not a partial diff or equality verdict. The comparison is bounded by 500,000
combined string code units, 10,000 combined lines, 512 edits, a 40ms algorithm
timeout, 32,000 displayed code units and 600 rows. The timeout does not bound
the whole UI event. Exact strings are checked before these limits.

The [study and screenshots](https://github.com/antonsoo/contextscope/blob/8171750bc36135a284eea97bdeeb128bcee33b0f/studies/text-comparison/README.md)
retain the workflow, reproducible scripts and limits. The browser bundles pinned
jsdiff 9.0.0 with its verbatim BSD-3-Clause notice. The CLI/library does not use
this development dependency.

## Evidence

A clean archive of implementation `9728b73` passes locked installation, lint,
both type checks, 538 unit tests, production builds and 74 workspace browser
checks. All 141 compiled CLI/library files remain byte-identical to baseline.
Separately installed packages on Node 20.0.0 and 24.21.0 preserve all 94 shipped
compiled files and all seven complete CLI JSON/HTML reports, apart from HTML's
single checked generation timestamp. jsdiff is absent from their production
dependencies. The 98,574-byte tarball has SHA-256
`e502f1b0c5f6b9ccf76e3044717d83cb891a745a8986f5c7aec579aed320be51`.

The independent preview oracle reconstructs both complete source strings from
displayed changes and omitted intervals. All 400 seeded cases complete. Across
240 pinned public terminal snapshots, 466 groups yield 599 first-to-member
pairs: 433 identical texts and 166 faithful differences, with no limited
previews in this run. That is not a guarantee that every machine completes
the same previews, nor evidence of removable prompt content.

Seven constructed cases cover consequential edits, exact text, whitespace,
literal HTML, size limits, surrogates and selection of another request. The
clean production build completes all 28 offline workflows in Chromium 153 and
Firefox 155 at 1440px and 375px. Both themes pass axe checks for every case.
Complete downloads and exports match expected content; focus returns correctly;
there are no page errors, unexpected requests or horizontal overflow. All 33
served assets match the clean build. Twelve retained screenshots were inspected.
The example and fonts are loaded before disconnecting; this does not claim
offline page reload support.

The [verification receipt](https://github.com/antonsoo/contextscope/blob/8171750bc36135a284eea97bdeeb128bcee33b0f/studies/text-comparison/results/verification.json)
links the clean archive, package, browser and oracle evidence. Package version
0.3.3 and the hosted demo do not gain this source browser feature from this push.
