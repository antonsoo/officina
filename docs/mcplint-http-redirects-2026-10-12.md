# mcplint: keep HTTP credentials within the configured origin

Source is pushed to
[`cf89f2386f548a3638d7a145d90b6f7f637c4f1d`](https://github.com/antonsoo/mcplint/commit/cf89f2386f548a3638d7a145d90b6f7f637c4f1d).
Package version 0.3.3, release tags and hosted files are unchanged.

At baseline `160cd9bae63649970c308af9f2d3b0c40d27b0f2`, native fetch followed
cross-origin redirects during MCP collection. It removed Authorization but
forwarded custom API keys and, after initialization, MCP session headers.
Both Streamable HTTP and legacy SSE were affected, including SSE message posts.

Each redirect is now checked before the next request. Destinations must retain
the configured scheme, host and port. Same-origin redirects preserve ordinary
method and body behavior and are bounded to 20 hops per request. A moved server
needs its intended final URL configured explicitly. Connection diagnostics omit
the destination and its query token. Blocked lists remain incomplete; config
collection keeps healthy entries available.

| Actual local capture observation | Before | Corrected |
| --- | ---: | ---: |
| Cases contacting the other origin | 53 | 0 |
| Receiver requests carrying the synthetic API key | 53 | 0 |
| Receiver requests carrying a server-issued MCP session ID | 4 | 0 |
| Allowed redirect workflows completed | 12/12 | 12/12 |

The [study](https://github.com/antonsoo/mcplint/blob/cf89f2386f548a3638d7a145d90b6f7f637c4f1d/studies/http-redirects/README.md)
retains all 71 library/CLI workflows, receiver-side request records,
reproducible scripts and an inspected terminal image. The peers and credentials
are synthetic, using different loopback ports. This is a reproduced boundary
failure, not a claim about a malicious public server. Separate native-fetch
comparisons cover the five redirect statuses with GET, HEAD, POST and DELETE.

A clean archive of production commit
`c357b749d4a78a0341b6bbd619936c8130f12842` passes locked installation, lint,
typecheck, all 492 tests, production/site builds and the documented good stdio
fixture. All 139 selected inputs and 152 built files match the exercised
checkout: 400,247 built bytes. No web UI code changed.

The 108,160-byte tarball has SHA-256
`b87b8fe75cda9045e5caffc8c30193fc98994e51b8132d27794a9c1b37b87a46`.
All 106 package files match the clean archive and separate offline installation.
All 71 installed workflows pass on Node 20.0.0 and 24.21.0. The locked archive
uses MCP SDK 1.31.0 and the separate install uses compatible SDK 1.32.1. Request
contents and outcomes agree across these runs; four allowed cases have different
GET/list interleaving on Node 20. Runtime verification was on Linux/WSL2.

The [public receipt](evidence/mcplint-http-redirects-2026-10-12.json) verifies a
clean checkout, exact remote main equality and all 17 changed files fetched
from pinned raw URLs: 915,552 bytes match. Tags and `gh-pages` are unchanged.
No registry release or hosted deployment was made.

```text
cf89f23 docs: retain HTTP redirect credential and installed artifact evidence [skip ci]
c357b74 fix: keep MCP HTTP redirects within the configured origin [skip ci]
```
