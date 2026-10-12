# Fieldproof: reopen a review after restarting the server

Source commit [`55de548`](https://github.com/antonsoo/fieldproof/commit/55de5482e4cab71c01aaa0a341859d5e8af88cc7)
adds **Save archive** and **Open review archive** to the local review UI.
The ZIP contains the original PDF, validated extracted claims and every saved
human decision, including pending and rejected fields. Reopening creates a
new session, restores the decisions and recomputes grounding and verification
without a model call or API key. Failed imports preserve existing sessions.

```text
PDF + claims + all decisions -> ZIP -> server restart -> reopened review
```

This is an explicit save, not autosave. The archive is editable and unencrypted;
its checksums detect corruption, not reviewer identity or authenticity. Original
automated verdicts are not stored, and another verifier version may produce
different findings. Corrections remain separate from the claims being verified.
The [format and recovery guide](https://github.com/antonsoo/fieldproof/blob/55de5482e4cab71c01aaa0a341859d5e8af88cc7/docs/review-archives.md)
documents size limits, supported schemas and recovery after a lost response.

The [retained restart study](https://github.com/antonsoo/fieldproof/blob/55de5482e4cab71c01aaa0a341859d5e8af88cc7/studies/review-archives/README.md)
uses four synthetic repository PDFs, not real customer documents. The baseline
lost all four sessions when its process stopped. Installed wheels on Python
3.11 and 3.12 reopened all four, with equal reports, decisions and JSON/CSV/XLSX
export bytes before and after the restart. The PDF pages rendered again.

The installed-browser replay uses Chromium and Firefox at 1440 pixels in dark
mode and 375 pixels in light mode. Eight workflows produce 32 actual downloads.
Their reports, decisions, PDF renderings and each export format match across
the restart; the exact downloaded archive opens in a new server process.
All six fetched app assets per context match the installed bundle, and all
23 bundled files match the tested source build. No page/CSP errors, external
requests, axe violations or horizontal overflow were observed. Four final
screenshots were inspected. Local API requests remain necessary; this is not
an offline static-demo workflow.

Independent Info-ZIP tools read all four archives, checked their CRCs and
recovered the exact original PDF bytes. All four archives repacked by Info-ZIP
with deflate also restored and re-saved to the original stored ZIP bytes.

A clean archive matched all 619 tracked implementation files. Fresh installation,
lint, type checks, formatting, 536 Python tests, 62 web tests, both builds and
86 browser workflows passed. One optional real-Tesseract case was skipped because
the executable was unavailable. The installed wheel's 36 Python files match
the implementation on both Python versions. The source and wheel versions
remain 0.2.7; these checks do not claim a registry release.

The [public-source receipt](evidence/fieldproof-review-archives-2026-10-12.json)
verifies clean local/remote main equality and all 31 changed public files
(865,679 bytes). Tags and the hosted demo remain unchanged. No package release
or hosted deployment was performed.
