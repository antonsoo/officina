# Trainspotter: protect training records from report destinations

Source commit [`ab7831d`](https://github.com/antonsoo/trainspotter/commit/ab7831d43f41c7bb1aa1eeb6f7f59d6b84e48737)
prevents a report destination from replacing TensorBoard event input. The
previous protection compared the destination with the input path itself. For a
directory input, an event file inside that directory passed the check.

A fresh TensorBoard 2.21.0 `EventFileWriter` recorded twenty synthetic loss
readings. The old CLI accepted its native event file as `--out`, exited 0 and
replaced 926 bytes of training records with 2,075 bytes of JSON. The
[retained study](https://github.com/antonsoo/trainspotter/blob/ab7831d43f41c7bb1aa1eeb6f7f59d6b84e48737/studies/report-inputs/README.md)
includes the original SDK bytes, capture and replay scripts, before/after
receipts and a reviewed screenshot of actual refusals. Replays overwrite only
disposable copies of the synthetic capture.

| Destination | Previous behavior | Corrected behavior |
| --- | --- | --- |
| Selected or unselected run's event file | Native observations replaced | Exit 2; original bytes retained |
| Existing event through a path alias | Destination replaced | Exit 2; alias and source retained |
| New event-like filename inside the log directory | Creates invalid input for the next read | Exit 2; no file created |
| Ordinary report inside the log directory | Atomic report replacement | Atomic report replacement |

Discovery and output protection now share filename rules. The guard checks all
discovered event files, including runs excluded by `--run`, and recognizes
resolved paths and file identities. Atomic replacement of an outside hard link
or symlink does not itself truncate the source inode; the receipts distinguish
destination changes from native-file changes. Such input aliases are also
refused. Shell redirection and concurrent filesystem mutations remain outside
this pre-replacement guard.

Twenty-one actual CLI refusals cover seven destination forms in terminal, JSON
and HTML modes. Three ordinary report replacements still succeed, and a
subsequent analysis recovers all twenty readings with complete input status.
The same replay passed from the installed wheel with Python 3.10.21/TensorBoard
2.12.0 and Python 3.12.12/TensorBoard 2.21.0. A separate bare installation verifies
single-file protection and ordinary report output without TensorBoard installed.
All 29 installed package files match the verified source. HTML comparisons
normalize only the generation-minute field; raw and normalized hashes are
retained in the [artifact receipt](https://github.com/antonsoo/trainspotter/blob/ab7831d43f41c7bb1aa1eeb6f7f59d6b84e48737/studies/report-inputs/verification.json).

A fresh implementation archive passed installation, lint, types, 646 Python
checks, package/site builds and 208 existing report workflows in Chromium and
Firefox at desktop and 320px. All 428 tracked archive files remained unchanged.
The built wheel is 117,599 bytes with SHA-256
`0d5b9e806d6dcd669d39324367f08562276739daeefd27acc146339571ce8235`.

The [public-source receipt](evidence/trainspotter-report-inputs-2026-10-12.json)
verifies clean local/remote main equality and all 15 changed public files
(295,607 bytes) against the checkout. Version remains 0.2.6. Tags and `gh-pages`
are unchanged; no package release or hosted deployment occurred.
