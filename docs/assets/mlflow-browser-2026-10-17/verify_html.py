"""Compare saved browser HTML with native replay output, allowing only generation time."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

GENERATED = re.compile(rb"(<dt>generated</dt><dd>)\d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC(</dd>)")
NATIVE_REPORTS = {
    "native-2-example": "mlflow-2.17.2-overfitting-0",
    "native-3-upload": "mlflow-3.17.1-overfitting-0",
    "slow-training-false": "mlflow-3.17.1-slow-training-0",
    "slow-training-true": "mlflow-3.17.1-slow-training-1",
    "recorded-nan": "reader-controls-recorded-nan-0",
    "rejected-reader-controls.sqlite": "reader-controls-recorded-nan-0",
    "rejected-wal-main-only.sqlite": "reader-controls-recorded-nan-0",
    "recovery": "reader-controls-recorded-nan-0",
}


def canonical_html(data: bytes) -> bytes:
    result, count = GENERATED.subn(rb"\1GENERATION_TIME\2", data)
    if count != 1:
        raise ValueError("Expected exactly one native HTML generation timestamp")
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("downloads", type=Path)
    parser.add_argument("native", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    browser = json.loads((args.downloads / "browser.json").read_text())
    records = []
    downloads = 0
    for context in browser["contexts"]:
        prefix = f"{context['browser']}-{context['width']}-"
        for download in context["downloads"]:
            data = (args.downloads / download["file"]).read_bytes()
            if (
                len(data) != download["bytes"]
                or hashlib.sha256(data).hexdigest() != download["sha256"]
            ):
                raise ValueError(f"Saved download does not match its receipt: {download['file']}")
            downloads += 1
        for label, native in NATIVE_REPORTS.items():
            name = prefix + label + ".html"
            actual = (args.downloads / name).read_bytes()
            expected = (args.native / (native + ".html")).read_bytes()
            canonical = canonical_html(actual)
            if canonical != canonical_html(expected):
                raise ValueError(f"Browser/native HTML differs beyond generation time: {name}")
            records.append(
                {
                    "download": name,
                    "native": native + ".html",
                    "sha256": hashlib.sha256(actual).hexdigest(),
                    "canonical_sha256": hashlib.sha256(canonical).hexdigest(),
                }
            )
    result = {
        "saved_download_hashes_verified": downloads,
        "complete_html_reports_match_native": len(records),
        "normalization": "Exactly one generated UTC minute field; all remaining bytes must match",
        "reports": records,
    }
    args.output.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({key: value for key, value in result.items() if key != "reports"}))


if __name__ == "__main__":
    main()
