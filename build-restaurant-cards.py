#!/usr/bin/env python3
"""Resizes the full-size restaurant card originals down to the 1200x800 the
site serves.

Most restaurants here supplied their own wide marketing shot (The Bab's
flat-lay is the reference: a table of many dishes at once, bright, obviously
abundant). Thai Deum and Momo Tibet hadn't -- Thai Deum's gallery is
individual plates, and Momo's site only offers their logo on white, which
reads as a missing image on a card next to real food. Both cards here are
generated table scenes standing in until the restaurants send real spread
photography, at which point drop the new file into img/_source/ under the
same name and re-run this.

Originals live in img/_source/ so this stays reproducible; only the resized
1200x800 versions are what the site and app actually load.

    python3 build-restaurant-cards.py
"""

from PIL import Image
from pathlib import Path

ROOT = Path(__file__).parent
CARD = (1200, 800)   # 3:2, matching the other restaurant cards
MAX_KB = 220         # keep cards in the same weight class as the rest of img/

SOURCES = {
    "thai-deum": "thai-deum-card-source.jpeg",
    "momo-tibet": "momo-tibet-card-source.jpeg",
}


def fit(src: Path) -> Image.Image:
    """Scale to cover 1200x800 and centre-crop. Sources that are already 3:2
    come through as a pure resize with nothing trimmed."""
    im = Image.open(src).convert("RGB")
    sw, sh = im.size
    scale = max(CARD[0] / sw, CARD[1] / sh)
    im = im.resize((max(CARD[0], round(sw * scale)), max(CARD[1], round(sh * scale))), Image.LANCZOS)
    nw, nh = im.size
    left, top = (nw - CARD[0]) // 2, (nh - CARD[1]) // 2
    return im.crop((left, top, left + CARD[0], top + CARD[1]))


def main() -> None:
    out_dir = ROOT / "img/restaurants"
    out_dir.mkdir(parents=True, exist_ok=True)

    for slug, filename in SOURCES.items():
        src = ROOT / "img/_source" / filename
        if not src.exists():
            print(f"  skip {slug} -- no source at {src.relative_to(ROOT)}")
            continue

        im = fit(src)
        out = out_dir / f"{slug}.jpg"

        # Step the quality down until the file is a reasonable weight. These
        # are photographic and busy, so they don't compress as hard as the
        # studio shots on white do.
        for quality in (85, 80, 75, 70):
            im.save(out, quality=quality, optimize=True, progressive=True)
            kb = out.stat().st_size // 1024
            if kb <= MAX_KB:
                break

        print(f"  ok   {out.relative_to(ROOT)}  {CARD[0]}x{CARD[1]}  q{quality}  {kb}KB")


if __name__ == "__main__":
    main()
