# Trainspotter native writer ordering and resumed-session gates

Trainspotter now retains the latest resumed session when native TensorBoard writer
counters cross a digit boundary within one clock second. The earlier lexical order
could hide the latest NaN loss or resurrect an obsolete NaN after a restart.

## Native reproduction

Twelve actual TensorBoard 2.21.0 `EventFileWriter` calls created counters 0 through
11 in one real second, each with a START at zero and one synthetic loss equal to
the counter. The unmodified frames and filenames are retained. Baseline import
reported complete input but loss 9. The unchanged SDK accumulator over the same
bytes concatenated in recorded creation order retained loss 11.

```text
creation: 0 -> 1 -> 2 -> ... -> 9 -> 10 -> 11
lexical:  0 -> 1 -> 10 -> 11 -> 2 -> ... -> 9
```

Controlled native SDK captures add 40 synthetic readings per writer and isolate
the same-second clock condition. They are logging/restart controls, not GPU
training runs or measurements of training health.

| Recorded latest session | Before error gate | Corrected error gate |
| --- | ---: | ---: |
| Latest session logs NaN at step 39 | 0, incorrectly passed | 1 |
| Older NaN session was replaced by finite readings | 1, incorrectly failed | 0 |
| Corrupt/partial input header | 2, incomplete | 2, incomplete |

The reader uses numeric order only for a unique varying counter family with the
same timestamp, hostname/PID prefix and directory, after validating all members'
first-record CRCs, version and native writer metadata. Other families keep their
positions. Changed order is retained as `counter_ordered_files` in JSON directory
evidence. Event clocks and filesystem times do not select it. The metadata probe
is bounded to 64 KiB; existing full-record availability and SDK decoding guards
remain intact.

Unknown writer headers, duplicate counters and ambiguous filenames retain the
existing order. Filenames do not authenticate provenance; digit-leading suffixes,
arbitrary renaming/merging and process reuse do not establish creation order.
TensorBoard's own directory accumulator also uses lexical order, so the oracle
uses its unchanged single-file accumulator on recorded creation-order replay.

## Verification

| Workflow | Population | Before mismatches | After mismatches |
| --- | --- | ---: | ---: |
| Library and actual CLI JSON/text/watch/HTML | 25 cases, 125 workflows | 62 | 0 |
| Installed wheel on Python 3.14.7 / TensorBoard 2.21 | 125 workflows | - | 0 |
| Installed wheel on Python 3.10.21 / NumPy 1.24 / TensorBoard 2.12 | 125 workflows | - | 0 |

All 60 captures from 12 unaffected control cases remain identical. Installed
observations match source; HTML differs only in the recorded generation minute,
with distinct actual HTML hashes retained. The real installed console entrypoint
also detects the latest-session NaN.

Sixteen offline report views passed in Chromium and Firefox at 1440 and 375 px,
covering both false-pass and false-failure corrections. Actual CLI-written HTML
retains 40 readings and the expected finding presence, with no page/external
request errors, accessibility violations or document overflow. All eight latest-
NaN before/after screenshots were inspected. Existing mobile chart/table scrolling
regions remain available; no product UI redesign was needed.

Fresh locked Python 3.12 install, ruff, strict mypy, 682 tests, wheel/sdist build,
Node 24 browser-check install, 208 existing report-browser workflows and static-site
build passed. Python 3.14 and Python 3.10 with lowest direct dependencies each
passed all 682 tests too. All 552 implementation archive files stayed unchanged
after checks; all 498 baseline archive files match pinned source.

All 34 wheel files match the clean build and installed bytes except the
installer-generated RECORD. The local 0.2.6 wheel is 120,042 bytes, SHA-256
`0cd33aad9ab8dd90b5cb307114183b2aa7ef72b1ee97f18268b12024ddf3fbbe`.
The local sdist is 166,056 bytes. Actual source/installed observations, artifact
and input digests, commands and log hashes are retained in the study. Initial
oracle-filename and HTML-confirmation harness mistakes are documented separately
from the product defect.

## Source publication

- Baseline: `07426bec2f9e5ce5ba0efed76726094aab1f24bc`.
- Implementation: `ca931aa6293f9241c317ff5bc18e286995667520`.
- Public source: `71d76a3fa0f50af0a0b5b57e5819be50f2c0b966`.
- [Pinned study and screenshots](https://github.com/antonsoo/trainspotter/blob/71d76a3fa0f50af0a0b5b57e5819be50f2c0b966/studies/writer-order/README.md).
- [Verification and package digests](https://github.com/antonsoo/trainspotter/blob/71d76a3fa0f50af0a0b5b57e5819be50f2c0b966/studies/writer-order/results/verification.json).
- [Public byte receipt](evidence/trainspotter-writer-order-2026-10-14-public.json).

Clean local HEAD equals remote main. All 61 changed immutable public files were
fetched and byte-compared: 1,836,934 bytes, with per-file SHA-256 and size in the
receipt. The hosted branch remains `62d47fa508e7b47afdc6816f0a3310a1cf97a400`.
The verified sample-site build command is `uv run python scripts/build_site.py`,
output `site/`. No PyPI publication, version tag, manual deployment or remote CI
success is claimed.

Tracking: `officina-cnhh`.
