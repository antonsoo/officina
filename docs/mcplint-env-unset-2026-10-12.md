# mcplint: remove environment variables explicitly set to null

Source was pushed to
[`a3012df766f87b5ee753fca93249cba0458bc47d`](https://github.com/antonsoo/mcplint/commit/a3012df766f87b5ee753fca93249cba0458bc47d).
This repairs an actual configured-process mismatch. Package version 0.3.3,
release tags and the hosted demo are unchanged.

On baseline `f9900d198a9dc5e86f5e4ffe9c0c19a041839874`, a config entry such as
`"env": {"TOKEN": null}` was discarded. The server consequently inherited
the parent's token, or retained one from `envFile`. mcplint could then report
a complete audit for the wrong server configuration.

The retained fixture is synthetic and local. It always advertises a read tool
and adds a write tool when a fake token is present. No external account,
production credential or real-world disclosure is involved.

| Configured behavior | Before | Corrected |
| --- | --- | --- |
| Remove parent token | Parent token; 2 tools | Absent; 1 tool |
| Remove file token | File token; 2 tools | Absent; 1 tool |
| Remove inherited TERM | TERM retained | TERM absent |
| Empty token | Empty string; 1 tool | Empty string; 1 tool |
| Inherit without override | Parent token; 2 tools | Parent token; 2 tools |

The fix preserves null through config parsing and file/environment merging.
It passes an explicit undefined value through the SDK's inheritance layer to
Node's process launcher. Deleting a property earlier would let SDK defaults
restore it. Removals affect only the intended child. Empty strings, numeric
zero, boolean false and the string `"null"` retain their distinct meanings.

The [study](https://github.com/antonsoo/mcplint/blob/a3012df766f87b5ee753fca93249cba0458bc47d/studies/config-env-unset/README.md)
contains the dependency-free local server, executable replay, raw observations,
terminal capture and pinned VS Code implementation reference. Twelve launch
cases run against each of `servers`, `mcp.servers` and `mcpServers`. The baseline
matched 21/36 expectations while every audit reported complete; the corrected
CLI matches all 36. A separate integration regression starts three servers
sequentially and verifies that removals do not mutate the parent or later
server's environment.

## Verification

A clean archive of production commit `8a708d820287bbc195e37ce51cca1b86e05ed2ac`
passed installation, lint, typecheck, 465 tests in 40 files, CLI/site builds and
28 Chromium/Firefox report workflows, including offline desktop and phone
checks. The terminal screenshot was opened and inspected.

The tarball was installed offline outside the checkout. All 102 installed
package files match the archive; all 96 source, test and selected configuration
inputs match the clean archive. The package is 105,458 bytes, SHA-256
`e5b6e256ada655718f52baeeadd4011bd55b3efdd3b53de6297ec8de238ec343`.
All 36 installed launch cases pass on Node 20.0.0 and 24.21.0, with identical
case records. The locked source uses MCP SDK 1.31.0; the offline installed
package resolves compatible SDK 1.32.1. Good/poisoned fixture exit behavior
and Node 20 SARIF output also passed.

Actual process executions are Linux/WSL2 checks. Windows case-insensitive
override handling is implemented, but no Windows or macOS execution is claimed.
This correction does not establish full equivalence with every MCP client.

## Public source evidence

The [receipt](evidence/mcplint-env-unset-2026-10-12.json) records a clean local
tree, exact remote main equality, and freshly fetched pinned raw bytes for all
15 changed files, totaling 425,954 bytes. Release tags and `gh-pages` were
compared before and after and remain unchanged. No registry release, tag or
hosted deployment was performed.

```text
a3012df docs: retain installed environment-removal verification [skip ci]
8a708d8 fix: honor configured environment removals for stdio servers [skip ci]
```

Tracking: `officina-o8vt`.
