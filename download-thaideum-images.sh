#!/bin/bash
# Pulls Thai Deum's own gallery photos (thaideum.com/foto/) into a staging
# folder. They're published with meaningless filenames -- 1.jpg, image7-2.jpeg
# -- so nothing can be matched to a dish until someone looks at them. That's
# the point of staging: download first, identify second, then rename into
# img/dishes/thai-deum/ with real dish slugs.
#
# Nothing here touches the live img/ tree, so this is safe to re-run.
#
# Run from the repo root:
#   bash download-thaideum-images.sh

set -u
cd "$(dirname "$0")"

DEST="img/_staging/thai-deum"
BASE="https://thaideum.com/wp-content/uploads/2023/08"
UA='eatfame-image-fetch/1.0 (contact: hello@eatfame.com)'

mkdir -p "$DEST"

FILES=(
  1.jpg 2.jpg 3.jpg 4.jpg 5.jpg 6.jpg 7.png 8.jpg 9.jpg 10.jpg
  image0-3.jpeg image1-3.jpeg image2-3.jpeg image4-3.jpeg image5-3.jpeg
  image0-1-2.jpeg image1-1-2.jpeg image2-1-2.jpeg image4-1-2.jpeg image5-1-2.jpeg
  image3-2.jpeg image7-2.jpeg image11-2.jpeg
  image6-2-rotated.jpeg image8-2-rotated.jpeg
  image9-2-rotated.jpeg image10-2-rotated.jpeg
)

ok=0; fail=0

for f in "${FILES[@]}"; do
  out="$DEST/$f"
  if [ -f "$out" ] && [ "$(wc -c < "$out" | tr -d ' ')" -gt 5000 ]; then
    echo "  skip $f (already have it)"
    continue
  fi
  if curl -fsSL --max-time 60 -H "User-Agent: $UA" "$BASE/$f" -o "$out"; then
    kb=$(( $(wc -c < "$out" | tr -d ' ') / 1024 ))
    echo "  ok   $f (${kb}KB)"
    ok=$((ok+1))
  else
    echo "  FAIL $f"
    rm -f "$out"
    fail=$((fail+1))
  fi
  sleep 0.3
done

echo
echo "Downloaded $ok, failed $fail -> $DEST"
echo "Next: tell Claude it's done, and it'll look through them and work out which dish is which."
