# Ghostchars: preserve registered Unicode glyph variants

Pushed source at
[`94580b4`](https://github.com/antonsoo/ghostchars/commit/94580b4718596f9c464883813ad2e79664af64d7)
keeps registered Unicode 17 variation sequences during scans and repairs.
Baseline reported 291 listed sequences as stray selectors and removed their
selectors during `sanitize` and `--fix`.

| Registered sequence | Intended variant | Baseline repair | Corrected repair |
| --- | --- | --- | --- |
| U+0030 U+FE00 | Slashed zero | Deletes U+FE00 | Preserves the pair |
| U+2205 U+FE00 | Empty-set glyph variant | Deletes U+FE00 | Preserves the pair |
| U+3001 U+FE01 | Centered ideographic comma | Deletes U+FE01 | Preserves the pair |
| U+1000 U+FE00 | Dotted Myanmar KA | Deletes U+FE00 | Preserves the pair |

The correction uses exact pairs from pinned
[Unicode 17 StandardizedVariants.txt](https://www.unicode.org/Public/17.0.0/ucd/StandardizedVariants.txt).
An independent parser checks all 1,353 listed pairs: the 291 erroneous removals
are corrected, and the other 1,062 retain identical complete scans. Varying
five non-emoji/non-ideograph bases across all 256 selectors also verifies 1,273
unsupported combinations, whose complete scans and repairs stay identical.
Twelve encoded payloads retain their diagnostics and repaired bytes, including
payloads beginning with a registered selector byte.

The [retained study](https://github.com/antonsoo/ghostchars/blob/94580b4718596f9c464883813ad2e79664af64d7/studies/standardized-variants/README.md)
includes 30 actual CLI scan, preview and file-repair invocations per tested
runtime. Registered text beside a payload survives while the payload is removed.
Preview keeps the input bytes intact. Default gating remains error-only: the
old stray-selector warnings already exited 0. These are constructed examples
based on normative data, not a newly observed attack or prevalence estimate.

A separately installed package repeats the oracle and CLI checks on Node 20.0.0
and 24.21.0. Oracle results agree exactly; CLI reports agree excluding measured
duration only, while preview text, exit codes and repaired bytes agree exactly.
A cached replay of 83,494 public files, 155,361,980 bytes, preserves every complete
scan, sanitizer result and revealed-text output. Both versions report 18,582
findings. No public input was downloaded or relabeled for this replay.

Clean archives pass type checking, lint, 235 unit checks in each of two locales,
source self-scan, benchmark smoke and all 36 browser checks. All 53 installed
output files match the tested build. The Unicode generator reproduces seven
tables exactly from checked inputs, and an incorrect expected hash causes exit
1 before any table changes. Existing generated tables remain unchanged.

Eight separate before/after browser contexts run sixteen scan-and-selection
workflows in Chromium and Firefox at 1440/375px. Their no-store HTTP server
stops before new text is entered. The replay also exposed late Firefox font
requests: 33 separate faces referenced ten variable font files. One face per
file/range now covers the same used weights. Font bytes remain unchanged, and
all corrected contexts record zero late HTTP requests, page errors, CSP or axe
violations, or page overflow. Exact keyboard-selected output is checked; the
operating-system clipboard is not read. All eight screenshots were opened and
reviewed. The artifact receipt checks 94 build inputs and 11 served assets;
all 41 package source files are identical across the scanner and font archives.

This preserves registered text without proving font shaping or trustworthy
content. The existing broad CJK IVS, emoji and Mongolian policies retain their
separate limits. The change does not claim complete Unicode conformance or an
upgrade to a later Unicode release.

The [public-source receipt](evidence/ghostchars-standardized-variants-2026-10-12.json)
compares all 37 changed pinned public files against the clean checkout and checks
HEAD against remote main. The source push skips push workflows; gh-pages remains
`1850946585995ad189416c171873a0be96aaf4e9`. No npm release, tag or hosted
deployment was performed. Browser evidence applies to the retained local builds.
