# mcplint: preserve saved metadata before comparing it

Source commit
[`842910b8f4e387613040943cc7ad11f8e16d2892`](https://github.com/antonsoo/mcplint/commit/842910b8f4e387613040943cc7ad11f8e16d2892)
was pushed to `main` and verified against the remote branch. All 22 changed
files, totaling 449,240 bytes, matched their pinned public raw URLs. The
[publication receipt](evidence/mcplint-json-integrity-2026-10-13-public.json)
records file sizes and SHA-256 values. Tags and `gh-pages` remained unchanged.
There was no npm release or hosted deployment; the source version remains 0.3.3.

## Reproduced failure and repair

Two saved tools with different account-ID limits produced identical snapshots:
the native JSON parser rounded `9007199254740993` to `9007199254740992`. Both
captures succeeded, then `mcplint diff` returned exit 0 with two unchanged
records. Repeated object fields also disappeared before auditing, including
escaped duplicates such as `name` and `\u006eame`.

```text
Saved maximum 9007199254740992 -> snapshot 9007199254740992 --+
                                                          +-> falsely unchanged
Saved maximum 9007199254740993 -> snapshot 9007199254740992 --+

Corrected second capture -> explicit refusal (exit 2)
                        -> no snapshot; existing report preserved
```

Saved inventories and imported snapshots now undergo an iterative scan that
rejects duplicate object fields, excessive nesting, nonfinite numbers, underflow
and numbers whose decimal value changes when serialized. Native parsing still
validates syntax. Equivalent decimal spellings remain accepted. Duplicate tool
identities in arrays remain separate records with their existing warnings.

The [executable study](https://github.com/antonsoo/mcplint/blob/842910b8f4e387613040943cc7ad11f8e16d2892/studies/json-integrity/README.md)
retains 33 synthetic cases through the actual CLI, including six HTML exports:
39 invocations per version. Each refusal must preserve the original input and
an existing report; failed captures must not create a snapshot.

| Workflows | Baseline | Corrected source |
| --- | --- | --- |
| Nine captures with rounded values, underflow or duplicate fields | Succeeded with lost information | Exit 2; no snapshot; earlier report intact |
| Six comparisons with rounded values, underflow or duplicate fields | Exit 0; falsely unchanged | Exit 2; earlier report intact |
| Overflow and two excessive-depth cases | Already refused | Still refused; actionable diagnostic |
| Invalid syntax | Already refused | Still refused |
| Eight valid captures and six valid comparisons | Intended outcomes | Identical outcomes and reports |
| All operational outcomes | 18/33 intended | 33/33 intended |

This is **15 newly corrected workflows**, not 18: three previously rejected
inputs also receive improved diagnostic wording. All 14 accepted controls keep
their reports and snapshots, omitting only generated capture/audit timestamps.
The six fixed-timestamp comparison HTML exports remain byte-identical.

## Independent and installed verification

All 144 syntactically valid tracked JSON files from the baseline decode
identically through the guard. These include configuration and package files;
they are not all server captures. Twenty existing CLI workflows also retain
their reports and exits: 11 inventories, eight snapshot self-comparisons and
the retained official-server Zod 3 versus Zod 4 comparison. No live server
collection was performed for this repair.

An independent Python `Decimal` oracle agrees on all 2,413 deterministic numeric
literals: 938 accepted and 1,475 refused. JavaScript supplies native number
serialization; the oracle uses exact decimal equality rather than the guard's
digit/exponent normalization. This checks decimal preservation, not exact binary
arithmetic. Ordinary `0.1`, subnormal `5e-324` and stable large integers remain
accepted.

The [clean-artifact receipt](https://github.com/antonsoo/mcplint/blob/842910b8f4e387613040943cc7ad11f8e16d2892/studies/json-integrity/results/verification.json)
records a fresh archive of implementation `63f55df`, locked installation, lint,
type checking, 565 checks, build and packing. All 419 archived files remained
unchanged. Two fresh local installations then ran the packed CLI:

| Runtime | CLI invocations | Replay disagreements | Oracle disagreements | Matching packaged files |
| --- | ---: | ---: | ---: | ---: |
| Node 20.0.0 | 39 | 0 | 0/2,413 | 86 |
| Node 24.21.0 | 39 | 0 | 0/2,413 | 86 |

Reports, snapshots, exits and HTML match the corrected source. Node 20's native
JSON syntax diagnostic omits the newer V8 line/column suffix; the receipt
retains this difference. Package installation itself used Node 24. The
128,074-byte package has SHA-256
`9dc355bcabed28b3121d1af02e89e79c3df441d4b3a57429ed5cf6fd29223138`.

A constructed 5,000-definition inventory of 515,574 bytes took median 4.07 ms
for native parsing and 39.76 ms with the guard on Node 24.21.0, over six
alternating samples after two warmups. The host was WSL2 with 14 available CPU
affinities on a Ryzen 7 7800X3D. This measures parser overhead, not full audit
latency. No report renderer or UI changed; valid HTML exports were compared
byte for byte, without a new browser or screenshot claim.

## Boundaries

The guard applies to raw saved inventories and imported snapshot text. It
cannot recover information already lost in an old snapshot, a caller's decoded
JavaScript object or live transport metadata decoded by the MCP SDK. Client
and lint configuration parsers are separate. Use a string for a large value
only when the producer's schema permits one; substituting a string for a
numeric constraint would change its meaning.
