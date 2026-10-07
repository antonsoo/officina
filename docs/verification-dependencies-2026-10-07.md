# Showcase dependency verification - 2026-10-07

Fourteen lockfiles in thirteen repositories resolved `source-map-js` 1.2.1. They
now resolve 1.2.2, the fix for
[GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).
Only that package's version, tarball URL and integrity changed. Gnomon's entry
previously omitted the URL and integrity; these are now explicit there too.
All commits below are local. No repository was pushed or site deployed.

This is a build/development dependency update, not a claim that every deployed
application exposed the vulnerable source-map operation to users.

## Direct reproduction

An indexed source map with a section line offset of `1e12` and two bytes of source
was processed in an isolated Node child with a one-second timeout. Version 1.2.1
did not finish and was killed. Version 1.2.2 rejected the offset in approximately
0.064 ms inside the process, with `Section offset line must not exceed 10000000.`
A valid zero-offset control preserved its source text. The measurements are one
local observation, not a benchmark or service-level guarantee.

## Build comparison

Every package was installed with `npm ci` and its production build executed both
before and after the patch, under Node 26.7.0. Of 731 generated files, 728 were
byte-identical. The remaining three were mcplint's HTML reports, which include the
time of generation. A fresh detached baseline checkout was built and all three
matched after replacing only the single generation timestamp. No other content
was normalized. Fieldproof includes both ordinary and demo builds; ContextScope
and Horologium include their library and browser outputs.

| Package directory | Generated files compared | Patch commit |
| --- | ---: | --- |
| `am-i-unlucky` | 33 | `f4c3c1b8` |
| `breakwatch` | 4 | `72f88e14` |
| `contextscope` | 140 | `94796942` |
| `ghostchars` | 49 | `607fc43d` |
| `ghostchars/web` | 32 | `607fc43d` |
| `gnomon` | 35 | `ea0b525a` |
| `horologium` | 77 | `43d67215` |
| `mcplint` | 128 | `d186ae09` |
| `officina` | 38 | `fff949e4` |
| `planisphere` | 37 | `d99e4df5` |
| `splitscope` | 12 | `ea2f2967` |
| `stutterscope` | 26 | `4ea3a335` |
| `errorbars/web` | 56 | `8e01c5d6` |
| `fieldproof/web` | 64 | `83575341` |

The source-map advisory disappeared from all fourteen package audits. Thirteen
then had zero reported vulnerabilities; mcplint retained a separate SDK advisory,
addressed in the follow-up below. A transient registry TLS failure was retried;
the recorded audits are successful responses, not empty results inferred from a
failed request.

Breakwatch's repository-required lint/type/build checks, formatting and browser
workflows also passed: both Chromium and Firefox completed 19 scenarios and 12
accessibility scans each, with zero violations. The dependency patch changed no
production bytes there. Other packages were verified by clean install and exact
build-file comparison, rather than claiming new browser coverage for each one.

## MCP SDK follow-up

mcplint's old lock resolved SDK 1.30.1, flagged by
[GHSA-6qxp-vccf-f47h](https://github.com/advisories/GHSA-6qxp-vccf-f47h).
Commit `cd7b907` raises the declared minimum to `^1.31.0` and locks 1.31.0 without
changing transitive dependencies. The advisory concerns OAuth credentials sent to
the wrong issuer; mcplint's current transports do not configure an OAuth provider.
This update keeps the dependency floor on the fixed implementation.

The follow-up audit reports zero vulnerabilities. Real stdio, Streamable HTTP and
legacy SSE collection, partial-page evidence and report workflows were exercised.
The mcplint checkout contains the detailed verification at
`docs/verification-sdk-2026-10-07.md`.

[The machine-readable manifest](verification-dependencies-2026-10-07.json)
contains per-file SHA-256 hashes, the three raw/normalized HTML comparisons,
before/after audit counts and the bounded reproduction. Its mcplint build snapshot
is the source-map commit above; the SDK follow-up is recorded separately.
