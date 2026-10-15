# MCP process cleanup and privacy-audit cost, 2026-10-15

Two reproduced defects now have public source corrections, installed-artifact
replays and pinned byte receipts. These checks establish source publication and
local package behavior; registry releases and hosted deployments are separate.

| Product | Reproduced behavior | Corrected result | Implementation |
| --- | --- | --- | --- |
| mcplint | Signalling only an npm launcher left its actual MCP server or a background helper working after collection, timeout or interruption | Owned POSIX process groups receive bounded EOF/TERM/KILL cleanup; cancellation waits for cleanup and stops configs before the next server | `67b4320` |
| Veil | Leak checks copied and hashed a candidate for every stored original length, making 178 KB of benign text take 24.5 seconds with a varied-length URL vault | A bounded prefix index precedes exact full-value checks; the same cold check takes 15 ms and retains every finding | `be9f8d2` |

The [mcplint study](https://github.com/antonsoo/mcplint/blob/f98df218e938c4c2ffb4ba7a86f92003c2cf5f6d/studies/stdio-processes/README.md)
uses native MCP SDK stdio servers, actual npm launchers, advancing heartbeats
and unrelated process controls. Eight of ten baseline cases retained a working
server/helper; none do after correction. EOF-friendly controls still exit
gracefully, incomplete inventories stay incomplete, and separate terminal-group
SIGINT/config controls stop the active server without starting the next one.
Public library imports add no process signal handlers. An explicit AbortSignal
preserves its caller-owned reason after cleanup, including legacy SSE startup.

Clean source archives on Node 24 and 26 pass lint, typecheck, 653 tests, CLI and
static-report builds, then produce identical tarballs. Fresh Node 20/24 tarball
consumers replay the actual CLI, public imports, process lifecycle, interruption
and library cancellation. All 94 shipped JavaScript/declaration files match the
clean builds. Linux/WSL2 is verified; macOS is untested, Windows retains direct
child cleanup, and a descendant deliberately leaving the process group is
outside this guarantee.

The [Veil study](https://github.com/antonsoo/veil/blob/2157288edbcb7734f5edad80558c5546e02cc79a/studies/leak-audit/README.md)
uses explicitly synthetic credential URLs, repeated prose and an independent
per-value search oracle. The full installed CLI changes from 25.247 to 0.181
seconds for the clean case, retaining exit 0. Two leaked originals still give
exactly two findings and exit 1. Shared-prefix, equal-length, nested and Unicode
controls retain ordered finding hashes. The ordinary email and equal-length URL
controls remain on the same millisecond scale; this is not a universal speedup
or a provider-latency benchmark.

A clean Veil archive passes lint/format, strict mypy and 1,169 tests; the optional
spaCy module skips because its extra is absent. Fresh core-wheel consumers on
Python 3.10, 3.12 and 3.14 replay the library and CLI, and all 36 installed Python
source files match the archived implementation. Full-value comparisons remain
exact; prefixes alone never establish a leak, and heavily colliding prefixes
can still require additional work.

Pinned public-byte receipts verify every changed implementation/evidence file:
[mcplint, 34 files](https://github.com/antonsoo/mcplint/blob/f98df218e938c4c2ffb4ba7a86f92003c2cf5f6d/studies/stdio-processes/results/publication.json)
and [Veil, 16 files](https://github.com/antonsoo/veil/blob/2157288edbcb7734f5edad80558c5546e02cc79a/studies/leak-audit/results/publication.json).
Each final receipt commit's remote HEAD and the changed documentation bytes were
also checked. The existing package versions were retained for local installation
checks; no new registry version, tag or manual deployment was made.
