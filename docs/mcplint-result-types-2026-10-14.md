# Mcplint retains incomplete discovery status, 2026-10-14

Baseline `f808ea0` ignores an explicit non-complete discovery result type.
A native SDK-backed response supplies usable tools alongside
`resultType: "input_required"`; the actual CLI reports complete, score 100 and
exit 0 at the error gate. Saved responses have the same gap and can make
metadata comparisons falsely claim a tool disappeared.

The [MCP multi round-trip rules](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr#supported-requests)
forbid input-required responses on discovery/list requests. Implementation
`bad0e5f` preserves received definitions for linting but marks explicit
non-complete, unsupported or malformed discriminators incomplete. The affected
pagination stream stops, the score stays unavailable, failure gates remain
effective even with suppressed findings, and metadata comparisons cannot claim
removals. Legacy absent markers and explicit complete responses still work.
Opaque request state and arbitrary marker values are not copied to diagnostics.

| Verified workflow | Result |
|---|---|
| 34 native SDK, saved-file and library/CLI comparison workflows | Baseline: 27 contract disagreements; corrected source: zero |
| Fresh local tarball consumers | Node 20.0.0 and 26.7.0 each pass all 34 workflows; reports/comparisons match clean source except audit timestamps |
| SDK dependency boundary | Locked source uses 1.31.0; fresh consumers resolve 1.32.1; recorded initialization requests use protocol 2025-11-25 |
| Preserved controls | Six legacy/explicit/nested-literal reports and fifteen non-paginated native inventory digests match baseline |
| Fresh Node 24.21.0 archive | Lint, typecheck, 623 tests in each default/German locale, library/site build, good/poisoned fixture gates and 32 existing browser workflows pass |
| Artifact identity | All 448 archived input files match the implementation commit; 184 build files match Node 24/26; all 123 package files match both fresh installs |
| Installed bin | Exact minimum Node 20.0.0 and current Node 26.7.0 run version, saved-file terminal and SARIF commands |
| Actual CLI HTML reports | 16 before/after and 8 installed offline Chromium/Firefox views at 1440/375px; ordinary and suppressed collection gaps retain the incomplete verdict |
| Browser evidence | Six captured HTML files byte-match HTTP responses before opening exact files offline; keyboard theme control, accessibility, overflow, script/CSP errors and external requests checked; twelve screenshots inspected |

The [study](https://github.com/antonsoo/mcplint/blob/b2b95661b0ebe3583a317b390c4392702219cf4a/studies/result-types/README.md)
retains native CLI stdout/stderr, request transcripts, snapshots' collection
evidence, definition digests, before/after captures, installed captures, real
report screenshots and artifact/check-log hashes. npm 12 on Node 26 performed
the installations; actual consumers then ran under their stated Node versions.
The first clean attempt omitted the build after disabling prepare, so CLI tests
failed on absent dist files. An explicit build resolved that setup error; no
product change was made to make the retained final checks pass.

These are deliberately contradictory synthetic discovery responses, not a
production incident or full support for the 2026 transport/multi round-trip
protocol. The saved late-page fixture was already incomplete because its cursor
remained. Corrected live discovery retains two pages instead of following an
unverified third page. Valid metadata parity is a regression check, not a
security certification.

The local 0.3.3 tarball is 133,503 bytes, SHA-256
`5db67efcab082c2fb6d6d567bf62dec421858c0bb220880af46ef7592c9b9124`.
This source snapshot is not the npm artifact already published at that version.
Source `b2b9566` matches clean remote main; all 56 changed source/study/image
files were fetched at that immutable commit and byte-matched. The
[publication receipt](evidence/mcplint-result-types-2026-10-14-public.json)
records their URLs, sizes and hashes. The gh-pages head remains
`df5f219b817eed5414081a5052da0036a93b31a1`; no registry release, tag,
manual deployment or remote CI result is claimed.

`npm run build:site` produces the three report pages in `site/`. This correction
changes discovery collection and its existing report verdict; no report UI code
was changed. Issue `officina-5fq8` is closed after source, installed and browser
verification.
