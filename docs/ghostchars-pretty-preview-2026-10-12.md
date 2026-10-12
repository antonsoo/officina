# Ghostchars: keep terminal diagnostics proportional to the findings

Source is pushed to
[`cf5a71b65df0bdd3e3f970b29b49db56e6538224`](https://github.com/antonsoo/ghostchars/commit/cf5a71b65df0bdd3e3f970b29b49db56e6538224).
Package version 0.1.5, tags and the hosted demo are unchanged.

At baseline `426a453a7679edd1e70e08318073dff9f37ff397`, the default formatter
rescanned and reprinted an entire source line for each finding. A 6 KB file
with 1,500 zero-width spaces produced 43 MB of output. A hash-verified 97 KB
public document produced 91 MB. Carets were also placed using original source
columns even after invisible characters expanded into visible labels.

The formatter now walks only the context it displays. It prints every finding
with its original start and exclusive end position, brackets the source span,
and declares omitted context or diagnostic text. Full counts, scanner results,
decoded payloads, exit status and repair behavior are preserved. JSON remains
the complete diagnostic export; summary output still groups repeated findings.

| Complete CLI observation | Before | Corrected |
| --- | ---: | ---: |
| 6 KB synthetic input: output bytes | 43,196,622 | 558,508 |
| Same input: elapsed seconds | 6.384 | 0.114 |
| 97 KB public input: output bytes | 91,457,823 | 3,888,072 |
| Same input: elapsed seconds | 27.007 | 0.365 |

These are single complete-command observations, including process startup and
stdout writes, on 14-logical-CPU WSL2 Linux and Node 26.7.0. They are not isolated
microbenchmarks. The [study](https://github.com/antonsoo/ghostchars/blob/cf5a71b65df0bdd3e3f970b29b49db56e6538224/studies/pretty-preview/README.md)
retains measurements, pinned public-input hashes, reproducible scripts and two
inspected terminal screenshots with unedited captured output.

Seventeen actual CLI inputs preserve all 20,938 findings in order. A Python
oracle checks their locations directly against original UTF-16 source units
and line breaks. Sixty-eight comparisons preserve JSON (excluding scan time),
SARIF, GitHub annotations and summary output. Seven actual repair workflows
produce identical reports, statuses and file bytes. The inputs include a finding
at column 1,000,001, large diagnostic text, a decoded payload, wide characters,
CRLF, clean text and damaged UTF-8.

A clean archive of production commit
`a896001f28098af962753da5703188007d5f7898` passes locked Node 24.21.0 installation,
lint, strict typechecking, all 250 tests, the production build and the documented
clean source scan. The committed CLI matches the rebuilt CLI. All 70 build
inputs and 53 build files match the exercised checkout: 588,585 built bytes.
All 52 compiled library files remain byte-identical to baseline. The web app
has no source changes.

The local tarball is 165,816 bytes, SHA-256
`18ede70cb312f1bdc02e41ef6f0fe77b6a6d7b5dc2ccb2cc31b736eb40d638dc`.
All 57 installed package files match the clean archive and tarball. Separate
offline installation passes the complete 17-input replay and seven repairs on
both Node 20.0.0 and 24.21.0. No npm release was made.

The [public receipt](evidence/ghostchars-pretty-preview-2026-10-12.json) verifies
clean source, exact remote main equality and all 24 changed files fetched from
pinned raw URLs: 967,344 bytes match. Tags and `gh-pages` are unchanged.

```text
cf5a71b docs: retain bounded CLI output and installed replay evidence [skip ci]
a896001 fix: bound CLI source excerpts without rescanning findings [skip ci]
```
