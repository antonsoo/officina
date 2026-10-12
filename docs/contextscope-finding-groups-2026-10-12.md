# Contextscope: keep warnings and distinct diagnoses visible

Contextscope's raw analysis contained a warning for an unsupported processing
speed, but the terminal and web page merged it into an informational fast-mode
message covering both requests. Standard-speed fallback messages could be
mislabelled in the same way. Grouping depended on which request appeared first.

Source commit
[`24fd8b3`](https://github.com/antonsoo/contextscope/commit/24fd8b3)
keeps different severities and message variants separate. Repeated equivalent
findings still form one group, and occurrence buttons select their exact
requests. The corrected two-request page displays `1 warn` and scopes each
message to its own request. Terminal and offline HTML use the same grouping.

The [study](https://github.com/antonsoo/contextscope/blob/24fd8b3/studies/finding-groups/README.md)
retains synthetic JSONL fixtures, before/after CLI and browser output, five
inspected screenshots and artifact hashes. Across eight sequences, including
every ordering of three message variants, the 23 expected message groups retain
their title, severity and exact request membership. All eight complete JSON
analyses remain byte-identical; pricing, token counts and CLI gates are
unchanged. No provider calls were made, and the study does not establish actual
billed costs or the defect's production prevalence.

Grouping remains unchanged on 240 reconstructed public trajectories containing
10,555 requests, plus all 11 bundled examples. A clean source archive passes
lint/type checks, 504 unit tests and 92 Chromium/Firefox browser workflows.
All 32 regression screenshots were also inspected. The separately installed
package reproduces all eight CLI cases and public exports on Node 20.0.0 and
24.21.0. Its 92 compiled files match the build; ten HTTP-served app assets match
the tested files. Offline JSON downloads match the CLI exactly, and HTML matches
apart from its generation timestamp.

The [public-source receipt](evidence/contextscope-finding-groups-2026-10-12.json)
verifies local/remote main equality and changed public bytes. Package version
0.3.3, tags and the hosted demo remain unchanged. No registry release or hosted
deployment was performed.
