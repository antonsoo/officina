# Contextscope: preserve captures and reports during output

Source commit [`2c52d63`](https://github.com/antonsoo/contextscope/commit/2c52d639d3b92bde4c6b2655056c67df725a6123)
protects request captures from report destinations and stages reports before
replacing existing files. The old CLI read the input, then allowed either
`--json` or `--html` to overwrite it with exit status 0. Symlinks and hard links
also truncated the source because writes followed the existing file identity.

The [retained replay](https://github.com/antonsoo/contextscope/blob/2c52d639d3b92bde4c6b2655056c67df725a6123/studies/report-destinations/README.md)
uses disposable copies of an existing 394-byte gzip fixture containing three
synthetic requests serialized by OpenAI Python 2.54.0 with a mocked transport.
No provider calls or private requests are involved. JSON replaced the capture
with 12,579 bytes; HTML replaced it with 5,931 bytes.

| Workflow | Previous behavior | Corrected behavior |
| --- | --- | --- |
| Report destination aliases the input | Exit 0; source destroyed | Exit 1 before analysis; source intact |
| HTML and JSON destinations collide | JSON silently replaces HTML | Exit 1 before either write |
| Second staged write exceeds OS file limit | HTML replaced; JSON truncated | Both previous reports intact; no temporary files |
| Distinct ordinary report destinations | Both reports written | Both reports written with identical analysis |

Twelve before/after CLI calls cover direct paths, symlinks, hard links,
symlinked parents and new/existing report collisions. A separate real POSIX
experiment limits only the child to 7,000 bytes per file. HTML fits; JSON gets
`EFBIG`. The fixed CLI preserves both previous reports and reports a concise
error. This is a file-size-limit experiment, not a disk-full or power-loss test.

A fresh implementation archive passed `npm ci`, lint, type checking, 523 tests,
core/web builds, 92 existing Chromium/Firefox workflows and package creation.
All 413 tracked files remained unchanged. The CLI receipt screenshot and all
32 desktop/375px screenshots produced by the browser suite were inspected.
Tables retain their existing horizontal scroll areas on narrow screens.

The 97,466-byte package was installed separately under Node 20.0.0 and 24.21.0.
Both installations passed the destination and OS-failure replays; all 94
installed build files match the clean build. Safe JSON is byte-identical to
the original behavior; HTML differs only in its single generation timestamp.
The [artifact receipt](https://github.com/antonsoo/contextscope/blob/2c52d639d3b92bde4c6b2655056c67df725a6123/studies/report-destinations/verification.json)
retains raw and normalized hashes. Package SHA-256:
`5e049678b86c08a7de79661fd2f4c535f39cc4a1ba07c6631206a3f819f74694`.

Output symlinks and non-regular files are refused; ordinary reports are replaced
with private permissions (0600 on POSIX). Each rename is atomic, but the pair is
not a joint transaction. Shell redirection and concurrent filesystem mutation
remain outside the guard. No report rendering or analysis algorithms changed.

The [public-source receipt](evidence/contextscope-report-destinations-2026-10-12.json)
verifies clean local/remote main equality and all 14 changed public files
(276,030 bytes) against the checkout. Version remains 0.3.3. Tags and `gh-pages`
are unchanged; no npm release or hosted deployment occurred.
