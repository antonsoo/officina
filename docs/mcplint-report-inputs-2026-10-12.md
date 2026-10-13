# mcplint: protect audit configuration from report output

Source commit [`d5d3940`](https://github.com/antonsoo/mcplint/commit/d5d3940ac60579ab02f2ba260e28400d14f45627)
extends output protection from snapshot comparisons to ordinary audits. The old
CLI exited 0 after replacing its tool definitions, explicit or discovered lint
config, MCP client config, or a referenced environment file with the report.

The [retained replay](https://github.com/antonsoo/mcplint/blob/d5d3940ac60579ab02f2ba260e28400d14f45627/studies/report-inputs/README.md)
uses disposable copies of the existing filesystem-server definitions and
controlled client/environment files. Each of five input types is exercised
through direct paths, symlinks, hard links and symlinked parents. All twenty
baseline cases replaced the input; all twenty corrected cases exit 2 and
preserve its bytes. The definitions alone shrank from 20,406 bytes to a
5,496-byte JSON report. Actual local SDK server startup markers confirm the
configuration cases now fail before a server starts.

Discovery and collection expose the actual selected lint config and resolved
env-file paths to the CLI guard. Declared missing env files are protected too;
when unrelated to output, they still produce the existing incomplete audit.
The report and snapshot paths must be distinct. Input aliases and output
symlinks are refused before collection or output creation.

| Real OS write failure | Previous behavior | Corrected behavior |
| --- | --- | --- |
| Report exceeds a 4,096-byte per-file limit | Existing report truncated to 4,096 bytes | Previous report retained |
| New snapshot exceeds that limit | Incomplete snapshot remains | Failed new snapshot removed |

Both experiments return `EFBIG`, preserve the input and leave no temporary files
after the correction. The limit applies only to the child process. This is not
a disk-exhaustion or power-loss test. Reports use atomic replacement; snapshots
use exclusive creation. A successful snapshot remains if a later report fails.
Output files are private (0600 on POSIX). Shell redirection, concurrent writers
and arbitrary files opened by launched servers remain outside the guard.

A fresh archive passed installation, lint, types, all 534 tests, build, site
build, 32 offline Chromium/Firefox workflows and package creation. All 407
tracked files remained unchanged. The CLI screenshot was inspected. Terminal,
JSON, SARIF, Markdown and HTML reports retain their original contents after
normalizing only their generation timestamp where present.

The 125,714-byte package was installed separately on Node 20.0.0 and 24.21.0,
each resolving MCP SDK 1.32.1. Both pass the twenty destination guards, five
ordinary formats, both real OS failures, and the existing SDK snapshot/diff
workflow for complete, changed, reordered, partial and duplicate metadata.
All 84 installed build files match the clean build. The [artifact receipt](https://github.com/antonsoo/mcplint/blob/d5d3940ac60579ab02f2ba260e28400d14f45627/studies/report-inputs/verification.json)
retains these observations. Package SHA-256:
`40140b169cdc76e0714bce899a55cb24f4280d7d93c37b1f3aed8d16c2ac9d7b`.

The [public-source receipt](evidence/mcplint-report-inputs-2026-10-12.json)
verifies clean local/remote main equality and all 17 changed public files
(306,250 bytes) against the checkout. Package version remains 0.3.3. Tags and
`gh-pages` are unchanged; no npm release or hosted deployment occurred.
