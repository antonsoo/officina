# Stutterscope: invalid bytes must not merge application streams

Source commit
[`996b4421d2d9ab6f56731ecadd0b12d9c96d6043`](https://github.com/antonsoo/stutterscope/commit/996b4421d2d9ab6f56731ecadd0b12d9c96d6043)
was pushed to `main` and verified against the remote branch. All 56 changed
files, totaling 2,029,671 bytes, matched their pinned public raw URLs.
The [publication receipt](evidence/stutterscope-text-integrity-2026-10-12-public.json)
records the hashes and sizes. Tags and `gh-pages` remained unchanged.
No npm package or hosted build was published; the source version remains 0.2.5.

## What changed

Both whole-file CLI decoding and browser streaming replaced malformed text
with U+FFFD. In an application-only capture, different invalid byte sequences
could become the same application name, causing stream grouping to combine
independent frame durations. The importer now requires valid UTF-8 or UTF-16
with a byte-order mark and rejects malformed text before accepting a report.

The [retained study](https://github.com/antonsoo/stutterscope/blob/996b4421d2d9ab6f56731ecadd0b12d9c96d6043/studies/text-integrity/README.md)
uses an explicitly synthetic OCAT-column CSV. Two application names encoded
as Windows-1252 collapsed to one replacement-character name; their interleaved
10 ms and 50 ms frames produced 33.33 FPS and 40 ms MASD, with no warning.
The correctly encoded control retains independent 100 FPS and 20 FPS streams.
This is not evidence that OCAT emits that encoding or malformed exports.

| Observation | Before | After |
| --- | --- | --- |
| Unsupported application-name encoding | One merged stream, 33.33 FPS | Explicit encoding error; no report |
| Invalid byte specimens rejected | 0/15 | 15/15 |
| Valid encoding controls accepted | 8/8 | 8/8, identical full reports |
| Correct outcomes in the executable replay | 8/23 | 23/23 |
| Public-capture report or refusal changes | -- | 0/34 |

The browser's 64 KiB preview can end inside a valid character only when more
input remains. The full import validates all bytes, including late corruption
and truncated final sequences. Valid split UTF-8 characters and UTF-16 surrogate
pairs remain accepted. A failed replacement or comparison preserves the prior
valid browser report and export.

## Verification and limits

- The fresh archive of implementation `0b710e1` preserved all 353 tracked files.
  Node 24.21.0 completed install, lint, type checks, 343 core checks in each of
  two locales, web/CLI builds and 76 Chromium/Firefox checks.
- Four before and four after workflows imported all 23 specimens while offline
  in actual Chromium and Firefox at 1440 px and 375 px. Each hash-checked five
  startup assets. All 30 files in the clean web build matched the tested build.
  Screenshots were inspected. No page/CSP errors, external requests, horizontal
  overflow or axe violations were observed. Firefox attempted two unavailable
  local font loads per workflow and used fallback fonts; there were no late
  non-font requests. Automated accessibility checks remain limited.
- The separately installed local npm tarball contains 22 compiled runtime files,
  all byte-identical to the clean build. The full 23-case replay passes on
  Node 22.6.0 and 24.21.0 with identical reports. Actual installed summary and
  interval-comparison commands also completed on the existing samples.
- The unchanged public-capture comparison covers 34 hash-pinned cached files:
  27 accepted captures and seven existing unsupported/periodic-log refusals.
  Complete normalized CLI reports and refusal messages are unchanged. It is
  a compatibility corpus, not a representative prevalence study.

The [artifact receipt](https://github.com/antonsoo/stutterscope/blob/996b4421d2d9ab6f56731ecadd0b12d9c96d6043/studies/text-integrity/verification.json)
records the 46,207-byte tarball and SHA-256
`bcd66f853873a37c1db0b558a4f00615481542d8c44722c33904a1c831b0fcef`.
Legacy encodings are not guessed; users must re-export them as supported Unicode.
A literal, correctly encoded replacement character is allowed. If damaged text
was already re-saved as valid Unicode, this check cannot recover the original
names or detect that history. These checks establish source and local-artifact
behavior, not a registry or hosted-demo update.
