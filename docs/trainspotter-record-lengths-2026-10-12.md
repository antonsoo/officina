# Trainspotter: retain readings when a record length exceeds its file

Source [`1965b98`](https://github.com/antonsoo/trainspotter/commit/1965b988931eed10f5b8da9171a3b612424d4578)
prevents a short, damaged TensorBoard record from triggering an enormous
allocation before its truncation is detected. A controlled 938-byte SDK
capture contains 20 valid scalar readings followed by a checksum-valid
header advertising `2^60` payload bytes. Previously this raised `MemoryError`
and produced no report, including when selecting a healthy sibling run.

The reader now checks each length against the bytes available at the start
of the pass, before asking the SDK to decode it. TensorBoard still validates
both checksums. The valid prefix survives and the unread tail remains explicit.

| Workflow | Previous result | Corrected result |
| --- | --- | --- |
| Analyze the damaged file | Exit 1, no report | 20 readings, 12 unread bytes, exit 2 |
| HTML and one-shot watch | Exit 1, no report | Partial report retained, exit 2 |
| Select the healthy sibling | Exit 1, no report | Complete selected input, exit 0 |
| Select the damaged sibling | Exit 1, no report | Incomplete selected input, exit 2 |

The [retained study](https://github.com/antonsoo/trainspotter/blob/1965b988931eed10f5b8da9171a3b612424d4578/studies/record-lengths/README.md)
includes the SDK prefix, repeatable before/after commands, input hashes and
the actual report screenshot. Child processes used a 512 MiB address-space
limit. TensorBoard's independent unsampled `EventAccumulator` supplies the
expected prefix; no production incident is claimed. Nine other scenarios
retain their previous results, including bad checksums, short headers and
reloading a completed tail. A separate append-during-read check preserves
the current pass's bound and recovers the new record on the next load.

A clean implementation archive passed locked installation, lint, type checks,
652 tests, build, 208 existing browser workflows and four dedicated offline
Chromium/Firefox workflows at desktop/phone widths. All four screenshots
were inspected, and all 439 archive files remained unchanged. A controlled
80,000-reading workload retained identical observations; median load time
changed from 0.563 to 0.653 seconds over three local measured trials.

The wheel was installed into three fresh environments: Python 3.12 without
TensorBoard, Python 3.10 with TensorBoard 2.12.0/NumPy 1.24.0, and Python 3.12
with TensorBoard 2.21.0/NumPy 2.5.4. All 29 library files match the clean source
in each environment. Both TensorBoard installations passed all ten record
cases, watch/HTML output and both sibling selections. Their HTML reports
match the browser-checked report after normalizing only its generation minute.
The [artifact receipt](https://github.com/antonsoo/trainspotter/blob/1965b988931eed10f5b8da9171a3b612424d4578/studies/record-lengths/verification.json)
records the 117,952-byte wheel's SHA-256:
`095ab4ba22a7b9c406309f00718a854b45a1668b6de426b974e573511e0fcef9`.

The check does not cap memory for large records that are fully present or
guarantee consistent reads during in-place file replacement. Installed
TensorFlow runtimes were not exercised; the checks used standalone TensorBoard.

The [public-source receipt](evidence/trainspotter-record-lengths-2026-10-12.json)
checks clean local/remote main equality and all 19 changed files (234,144
bytes) against pinned public source. Version remains 0.2.6. Tags and
`gh-pages` are unchanged; no PyPI release or hosted deployment occurred.
