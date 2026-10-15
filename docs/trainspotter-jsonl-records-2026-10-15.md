# Trainspotter JSONL source positions, 2026-10-15

Trainspotter discarded rejected JSONL records before assigning fallback row
indices. Ten unreadable records between two flat loss sections became a
continuous curve and a "Diverged" diagnosis, including advice to lower the
learning rate. Later readings also moved to the wrong source positions.

Implementation `9eece1f` preserves zero-based nonblank record positions when
the accepted source has no step column. Rejected records become unknown
observations, so loss trajectories and plotted lines stop at those boundaries.
Explicit training steps never borrow ordinals from broken records. Blank lines,
sparse metric cells, text metadata and actual NaN readings retain their rules.

The [published study](https://github.com/antonsoo/trainspotter/blob/9d0c62a75f1f80a06af297eced77b2aeb28c18c6/studies/jsonl-record-gaps/README.md)
retains actual JSON/HTML CLI output for 24 controlled cases. Sixteen cases
previously produced 20 unsupported cross-gap diagnoses; all are gone. Four
valid later setbacks previously missed by the reader now remain visible.
The input-integrity gate already returned 2 for rejected records and still does.
This fixes the diagnoses and coordinates, rather than a formerly passing gate.

The retained CPU PyTorch capture is projected to counter-free JSONL with
authored faults at its 20 logged NaN positions. This is a controlled conversion,
not a native JSONL capture or a frequency estimate. All 68 pre-existing CSV/JSONL
inputs retain identical complete report hashes or reader rejections.

Fresh Python 3.10 / NumPy 1.24 and Python 3.14 / NumPy 2.5.4 core-wheel
installations reproduce all 24 complete reports; neither needs TensorBoard.
All 29 runtime files match the source archive, sdist, wheel and installations.
Actual ordinary-pipe watch processes handle both file correction and a writer
finishing its final object by appending bytes. Fresh offline Chromium/Firefox
contexts at desktop and phone widths open the reports and download exact unknown
positions. Three retained screenshots were inspected.

A clean archive passes lint, mypy, 749 tests, package builds and all 216 report
browser workflows. Loading 100,000 records with 10% rejected positions changes
from 0.814s to 0.919s in the retained shared-host median; the study discloses
the additional 10,000 unknown positions and measurement limits.

[Pinned public bytes](https://github.com/antonsoo/trainspotter/blob/9d0c62a75f1f80a06af297eced77b2aeb28c18c6/studies/jsonl-record-gaps/results/public-source.json)
verify all 33 changed implementation/evidence files. Final remote-head equality
and receipt documentation were checked separately. No PyPI release, tag or manual
hosted deployment was performed.
