# Fieldproof: preserve source PDFs and previous reports

Source [`d477aab`](https://github.com/antonsoo/fieldproof/commit/d477aab676e24ff37b490b419f3ce417c9a69abd)
prevents CLI report destinations from destroying their inputs. Previously,
`extract invoice.pdf --fixture fixture.json --out invoice.pdf` exited 0 after
replacing the 2,388-byte source PDF with 59,982 bytes of JSON. The consumed fixture
and `verify`'s source PDF were vulnerable through equivalent paths and links too.

The correction checks destinations before PDF/provider work and again before
writing. It writes a private temporary sibling, flushes it, and replaces the
destination only after the full write succeeds. Normal in-place verification
remains supported. Output errors become concise messages with exit 2.

| Actual CLI workflow | Before | After |
| --- | --- | --- |
| PDF/fixture destination, 15 alias cases | Exit 0, input replaced | Exit 2, inputs unchanged |
| Existing/dangling output symlink, 2 cases | Target overwritten/created | Link and target preserved |
| Extract/verify write exceeds child file-size limit, 2 cases | Prior report truncated to 4,096 bytes | Full 59,982-byte report preserved |
| Ordinary extract, verify in place, verify to another file | Successful JSON report | Identical report bytes, mode 0600 |

The [study and captured CLI results](https://github.com/antonsoo/fieldproof/blob/d477aab676e24ff37b490b419f3ce417c9a69abd/studies/report-files/README.md)
use disposable copies of the bundled **synthetic** invoice. Alias cases cover
direct, normalized, parent-symlink, output-symlink and hard-link destinations.
Short writes use a real POSIX child-process file-size limit and ignore `SIGXFSZ`,
producing `EFBIG` without changing limits on the host. Failed writes leave no
temporary report. No remote extraction provider is called.

A clean final implementation archive passed locked installation, lint, types,
550 Python tests, web checks, 62 web tests, production builds, 86 existing
Chromium/Firefox scenarios and wheel/sdist builds. One real-OCR integration check
skipped because Tesseract was unavailable. All 637 tracked archive files stayed
unchanged; the actual terminal capture was inspected.

Fresh installations of the wheel on Python 3.11 with explicitly resolved minimum
dependencies and Python 3.12 with current dependencies pass the 19 adverse cases
and three ordinary controls. Both captures exactly match the clean build and
recorded after capture. Real installed console commands also produce unchanged
reports at this filesystem's 255-byte filename limit, for ASCII and UTF-8 names.
All 37 Python library files and 23 bundled UI files match the clean build; each
installed server serves all 23 assets unchanged. Dependency consistency checks
pass in both environments.

The [artifact receipt](https://github.com/antonsoo/fieldproof/blob/d477aab676e24ff37b490b419f3ce417c9a69abd/studies/report-files/verification.json)
identifies the 592,741-byte wheel with SHA-256
`14c08ce6e25b14d80b44666896f77616cf432f6c1eb7d7329f4791e3d580be4f`.
The [public-source receipt](evidence/fieldproof-report-files-2026-10-12.json)
checks clean local/remote main equality and all 12 changed files (329,546 bytes)
against pinned public source. Version remains 0.2.7; tags and `gh-pages` are
unchanged. No PyPI release or hosted deployment occurred.

Atomic replacement protects the named destination. Other hard links to an old
report retain the old inode. This adds no concurrent-writer locking, hostile
directory-race protection or whole-machine power-loss guarantee. The filesystem
failure and permissions captures were taken on Linux/WSL2.
