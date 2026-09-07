#!/bin/bash
# Takes the staged Thai Deum gallery photos and puts them where the site
# expects them, under real dish slugs. The mapping below is the result of
# looking at all 27 staged photos one by one -- their filenames carry no
# information, so this list IS the identification work.
#
# Their gallery is lower resolution than the 800x800 the rest of the site
# uses: the wide banner crops are 960x360, the rest 640x480. Cropping to a
# square therefore caps at 360 or 480. We never upscale -- a stretched 360px
# photo looks worse than a sharp one. Two of these will be softer than the
# neighbouring tiles; that's the ceiling of what they've published.
#
# Safe to re-run: it copies from staging, so the originals stay untouched.
#
# Run from the repo root:
#   bash assign-thaideum-images.sh

set -u
cd "$(dirname "$0")"

SRC="img/_staging/thai-deum"
DEST="img/dishes/thai-deum"

if [ ! -d "$SRC" ]; then
  echo "No staged images at $SRC -- run download-thaideum-images.sh first."
  exit 1
fi

mkdir -p "$DEST"

# square <src> <dest>
# Resample the SHORT side, then centre-crop, so the stored file is exactly
# what gets displayed. Caps at 800 but never enlarges past the original.
square() {
  local src="$1" out="$2" w h short target
  cp "$src" "$out" || return 1

  command -v sips >/dev/null 2>&1 || { echo "     (sips not found, left uncropped)"; return 0; }

  w=$(sips -g pixelWidth  "$out" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$out" | awk '/pixelHeight/{print $2}')
  [ -z "${w:-}" ] || [ -z "${h:-}" ] && return 0

  short=$w; [ "$h" -lt "$short" ] && short=$h
  target=800; [ "$short" -lt 800 ] && target=$short

  if [ "$w" -ge "$h" ]; then
    sips --resampleHeight "$target" "$out" >/dev/null 2>&1
  else
    sips --resampleWidth "$target" "$out" >/dev/null 2>&1
  fi
  sips -c "$target" "$target" "$out" >/dev/null 2>&1

  echo "     ${w}x${h} -> ${target}x${target}"
}

# assign <staged-file> <dish-slug> <what it is>
assign() {
  local f="$SRC/$1" out="$DEST/$2.jpg"
  if [ ! -f "$f" ]; then
    echo "  FAIL $2 -- $1 missing from staging"
    return
  fi
  echo "  ok   $2  ($3)"
  square "$f" "$out"
}

echo "Dishes:"
assign image8-2-rotated.jpeg veg-spring-rolls    "five spring rolls, sweet chilli dip, green banana-leaf plate"
assign image5-1-2.jpeg       tofu-satay          "tofu skewers, crushed peanut, cucumber relish"
assign image0-3.jpeg         cashew-nut-chicken  "cashew stir-fry, shot in their own takeaway box"
assign image10-2-rotated.jpeg green-curry-chicken "green curry, long beans and Thai basil, in the box"
assign 9.jpg                 red-curry-chicken   "red curry, bamboo shoots, pea aubergine, basil"
assign 8.jpg                 beef-oyster-sauce   "beef with peppers, spring onion and mushroom"
assign 4.jpg                 spicy-beef-salad    "sliced grilled beef, red onion, coriander, chilli"

# Restaurant card is 3:2, not square -- crop separately.
echo
echo "Restaurant card:"
CARD="img/restaurants/thai-deum.jpg"
mkdir -p img/restaurants
if cp "$SRC/image4-1-2.jpeg" "$CARD" 2>/dev/null; then
  if command -v sips >/dev/null 2>&1; then
    # 640x480 -> 640x427 keeps full width and trims top/bottom to 3:2.
    sips -c 427 640 "$CARD" >/dev/null 2>&1
    echo "  ok   $CARD (640x427)"
  else
    echo "  ok   $CARD (uncropped, sips not found)"
  fi
else
  echo "  FAIL $CARD"
fi

echo
echo "Done. Staged originals are still in $SRC if you want to redo a mapping."
