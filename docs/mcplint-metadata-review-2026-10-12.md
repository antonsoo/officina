# Mcplint: review the metadata that changed

Source commit [`1c523ab`](https://github.com/antonsoo/mcplint/commit/1c523ab1e6dbf72cfd565fcb02b7752ce04018ad)
adds metadata snapshots and terminal/JSON/offline HTML comparisons. A controlled
SDK server changed two parameter bounds from 100 to 200 while both lint audits
still showed 100/100, zero findings and 137 estimated tokens. The comparison now
shows both changed paths with their before/after values.

The [retained study](https://github.com/antonsoo/mcplint/blob/1c523ab1e6dbf72cfd565fcb02b7752ce04018ad/studies/metadata-diff/README.md)
also captures one official filesystem-server package under two dependency
resolutions. `@modelcontextprotocol/server-filesystem@2025.8.21` has the same
compiled entrypoint and advertised server info in both installations; only the
Zod package record differs. With Zod 3.25.76, `read_text_file` declares its path,
head and tail parameters. With Zod 4.6.7, its schema contains only `$schema`.
Thirteen of fourteen tool schemas change. An independent newline JSON-RPC probe
matches every captured definition. No tools were called; the allowed directory
was empty. Retained locks reconstruct this current-install experiment, which
does not describe the original publication environment or latest server version.

| Comparison | Exit | Meaning |
| --- | --- | --- |
| Reordered list entries | 0 | Recorded metadata unchanged |
| Changed schema bound | 1 | Complete comparison with exact changed values |
| Failed second list page | 2 | Incomplete; absent definition remains unpaired |
| Duplicate tool identity | 2 | Ambiguous; no winner selected |

Snapshots retain entire decoded list entries before lint projection, including
extension fields. Matching uses exact server IDs and protocol identities: name
for tools/prompts, URI for resources, URI template for templates. Initialization
metadata is limited to what the SDK exposes. Array order, string content and
missing/null distinctions remain significant. Existing snapshots cannot be
replaced by capture or by reports through existing file aliases.

The HTML report filters entries, pages definitions and fields, shows bounded
previews and downloads the full unfiltered JSON. Four actual offline workflows
in Chromium and Firefox at desktop/dark and 375px/light checked sixteen downloads,
complete and incomplete reports, theme switching and schema-bound evidence.
Screenshots were inspected. The inspected filtered state had no axe violations,
page overflow, page errors, external requests or CSP violations. Additional
browser checks exercise hostile strings, invisible characters and long values.

The [artifact receipt](https://github.com/antonsoo/mcplint/blob/1c523ab1e6dbf72cfd565fcb02b7752ce04018ad/studies/metadata-diff/verification.json)
records a fresh Node 24.21.0 archive install, lint/types/builds, 507 unit/CLI checks
and 32 browser checks, with all 396 implementation files unchanged. A separately
installed 124,051-byte tarball passed actual SDK captures on Node 20.0.0 and
24.21.0. All 82 compiled files match the clean build; installed complete/partial
HTML matches the retained offline-browser report hashes exactly. Both reference
dependency locks reconstructed unchanged and reproduced thirteen schema changes
under Node 24.

This compares recorded decoded metadata, not code, execution behavior, server
authenticity or safety. It does not approve baselines. Missing scopes on both
sides are outside the comparison; incomplete scopes cannot establish unchanged
inventory. JavaScript numeric decoding and SDK initialization parsing retain
their limits. The [guide](https://github.com/antonsoo/mcplint/blob/1c523ab1e6dbf72cfd565fcb02b7752ce04018ad/docs/metadata-review.md)
states those boundaries and the snapshot size/depth/node limits.

The [public-source receipt](evidence/mcplint-metadata-review-2026-10-12.json)
checks clean local/remote main equality and all 65 changed public files
(797,491 bytes) against the checkout. Package/source version remains 0.3.3.
Tags and `gh-pages` are unchanged; no registry release or hosted deployment occurred.
