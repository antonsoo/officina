#!/usr/bin/env python3
"""Cover-fit crop + resize an image to 1200x750 and save as compressed WebP
under ~200 KB. Used both for cropped hero images (existing docs/assets PNGs
from sibling repos) and for full-page screenshots taken directly at the
target aspect ratio (in which case this just re-encodes).

Usage: python3 make_thumb.py <in> <out.webp> [--top]

--top anchors the crop to the top of the source image (for tall hero shots
where the most representative content is near the top) instead of the
vertical center.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

TARGET_W, TARGET_H = 1200, 750
TARGET_RATIO = TARGET_W / TARGET_H


def cover_crop(img: Image.Image, anchor_top: bool) -> Image.Image:
    w, h = img.size
    src_ratio = w / h
    if src_ratio > TARGET_RATIO:
        # source is wider than target - crop left/right, keep full height
        new_w = round(h * TARGET_RATIO)
        x0 = (w - new_w) // 2
        box = (x0, 0, x0 + new_w, h)
    else:
        # source is taller than target - crop top/bottom, keep full width
        new_h = round(w / TARGET_RATIO)
        y0 = 0 if anchor_top else (h - new_h) // 2
        box = (0, y0, w, y0 + new_h)
    return img.crop(box).resize((TARGET_W, TARGET_H), Image.LANCZOS)


def save_under_limit(img: Image.Image, out_path: Path, limit_kb: int = 200) -> None:
    for quality in (82, 74, 66, 58, 50, 42):
        img.save(out_path, "WEBP", quality=quality, method=6)
        if out_path.stat().st_size <= limit_kb * 1024:
            return
    # last attempt already written at lowest quality tried


def main() -> None:
    if len(sys.argv) < 3:
        print("usage: make_thumb.py <in> <out.webp> [--top]", file=sys.stderr)
        raise SystemExit(2)
    in_path, out_path = Path(sys.argv[1]), Path(sys.argv[2])
    anchor_top = "--top" in sys.argv[3:]

    img = Image.open(in_path).convert("RGB")
    thumb = cover_crop(img, anchor_top)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    save_under_limit(thumb, out_path)
    print(f"{out_path} ({out_path.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
