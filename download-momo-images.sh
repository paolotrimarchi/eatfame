#!/bin/bash
# Downloads Momo Tibet's dish photos from their own website (momotibet.com,
# which is Wix-hosted) and drops them straight into the right paths with the
# right filenames, so they show up on both eatfame.com and the ordering app.
#
# These are the restaurant's own uploads (Wix media IDs beginning "b23daa_"),
# which the owner said we could use. Wix stock imagery on their site (IDs
# beginning "11062b_") is deliberately skipped -- that's Wix's, not theirs.
#
# Run from the repo root:
#   bash download-momo-images.sh

set -u
cd "$(dirname "$0")"

WIX="https://static.wixstatic.com/media"
DISHES="img/dishes/momo-tibet"

mkdir -p "$DISHES" img/restaurants

# Requesting the bare /media/<id> path (no /v1/fill/... transform) returns the
# original upload rather than the 147px menu thumbnail.
get() {
  local id="$1" out="$2"
  if curl -fsSL "$WIX/$id" -o "$out"; then
    echo "  ok   $out"
  else
    echo "  FAIL $out  ($id)"
    return 1
  fi
}

echo "Restaurant card:"
get "b23daa_5a8daeb0e1874aad83555fd38d5ddd79~mv2.jpg" "img/restaurants/momo-tibet.jpg"

echo
echo "Dishes:"
# One photo per dish, no duplicates -- the beef and veg steamed momo aren't
# listed precisely because their site has no separate photos for them.
get "b23daa_945c3c1a6b5d4cdcb26ee01f3ee4ff58~mv2.jpg"  "$DISHES/chicken-momo.jpg"
get "b23daa_6ed919df79ae41bc9e136b3f04369c3f~mv2.jpeg" "$DISHES/veg-mokthuk.jpg"
get "b23daa_df806e5891d346539a9ac06dae19605b~mv2.jpeg" "$DISHES/jhol-momo.jpg"
get "b23daa_8876cda9a17443bb91eb80b295bc751c~mv2.jpeg" "$DISHES/spicy-fried-momo.jpg"
get "b23daa_3b8b6d584a71479e9e2af9c990a64386~mv2.jpg"  "$DISHES/thenthuk.jpg"
get "b23daa_3b2f83809abc4e9aabfdccc857e58d46~mv2.jpeg" "$DISHES/phing-sha.jpg"
get "b23daa_b7f2a5f13c384d2a89ac58f8c599d3b1~mv2.jpeg" "$DISHES/shaptak.jpg"

# Resize down to the sizes the rest of the site uses. sips ships with macOS,
# so there's nothing to install. Skipped silently if it isn't available.
if command -v sips >/dev/null 2>&1; then
  echo
  echo "Resizing:"
  sips -Z 1200 img/restaurants/momo-tibet.jpg >/dev/null 2>&1 && echo "  restaurant card -> max 1200px"
  for f in "$DISHES"/*.jpg; do
    sips -Z 800 "$f" >/dev/null 2>&1
  done
  echo "  dishes -> max 800px"
fi

echo
echo "Done. Files now on disk:"
ls -la img/restaurants/momo-tibet.jpg 2>/dev/null
ls -la "$DISHES"
echo
echo "Commit them with:"
echo "  git add img && git commit -m 'Add Momo Tibet photos' && git push"
