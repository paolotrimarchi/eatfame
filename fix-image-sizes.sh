#!/bin/bash
# Squares up every dish photo already on disk.
#
# The dish tiles are square and the CSS uses object-fit: cover, so a tall
# photo gets centre-cropped by the browser — which is how the spareribs ended
# up showing a slice of the middle of a tall picture. "sips -Z" (what the
# download scripts used before) only caps the longest side, so tall stayed
# tall. This resamples the SHORT side to 800 and then crops to 800x800, so
# what's stored is what gets shown.
#
# Restaurant card images are left alone — those tiles are 16:10, not square.
#
# Safe to re-run: anything already 800x800 is skipped.
#
# Run from the repo root:
#   bash fix-image-sizes.sh

set -u
cd "$(dirname "$0")"

if ! command -v sips >/dev/null 2>&1; then
  echo "sips not found — it ships with macOS, so this needs running on your Mac."
  exit 1
fi

changed=0; already=0

while IFS= read -r f; do
  w=$(sips -g pixelWidth  "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/{print $2}')
  [ -z "${w:-}" ] || [ -z "${h:-}" ] && { echo "  ?    $f (couldn't read dimensions)"; continue; }

  if [ "$w" = "$h" ] && [ "$w" -le 800 ]; then
    already=$((already+1)); continue
  fi

  # Never upscale: a 440px photo blown up to 800 just gets soft and heavier.
  # Target the smaller of 800 and the image's own short side.
  short=$w; [ "$h" -lt "$short" ] && short=$h
  target=800; [ "$short" -lt 800 ] && target=$short

  if [ "$w" -ge "$h" ]; then
    sips --resampleHeight "$target" "$f" >/dev/null 2>&1
  else
    sips --resampleWidth "$target" "$f" >/dev/null 2>&1
  fi
  sips -c "$target" "$target" "$f" >/dev/null 2>&1

  kb=$(( $(wc -c < "$f" | tr -d ' ') / 1024 ))
  echo "  ok   $f  ${w}x${h} -> ${target}x${target} (${kb}KB)"
  changed=$((changed+1))
done < <(find img/dishes -name '*.jpg')

# Restaurant cards: cap the long side but keep their aspect ratio.
echo
echo "Restaurant cards (aspect kept, capped at 1200px):"
for f in img/restaurants/*.jpg; do
  [ -f "$f" ] || continue
  w=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
  if [ -n "${w:-}" ] && [ "$w" -gt 1200 ]; then
    sips -Z 1200 "$f" >/dev/null 2>&1
    echo "  ok   $f (was ${w}px wide)"
  fi
done

echo
echo "$changed dish images squared, $already already square"
echo "img/ is now $(du -sh img | cut -f1)"
