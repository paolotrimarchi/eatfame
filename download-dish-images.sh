#!/bin/bash
# Downloads dish photos for the restaurants that publish their own, and drops
# them into img/dishes/<restaurant>/<dish>.jpg so they appear automatically on
# eatfame.com and in the ordering app.
#
# Sources are each restaurant's own website or own ordering platform, not a
# delivery marketplace: otaru.nl, Wan Shun's pick-up site, mizubar.nl and
# salsashop.com. Per-restaurant detail is in MENU-RESEARCH.md.
#
# The other nine restaurants publish no fetchable per-dish photography, so
# their dishes show the neutral fallback tile until photos exist.
#
# Run from the repo root:
#   bash download-dish-images.sh

set -u
cd "$(dirname "$0")"

for d in otaru-sushi wan-shun mizu-bar salsa-shop; do
  mkdir -p "img/dishes/$d"
done

ok=0; fail=0; skip=0

# Dish tiles are square; resample the short side to 800 then centre-crop,
# so tall photos aren't left for CSS to butcher.
square() {
  command -v sips >/dev/null 2>&1 || return 0
  local f="$1" w h
  w=$(sips -g pixelWidth  "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/{print $2}')
  [ -z "${w:-}" ] || [ -z "${h:-}" ] && return 0
  if [ "$w" -ge "$h" ]; then sips --resampleHeight 800 "$f" >/dev/null 2>&1
  else sips --resampleWidth 800 "$f" >/dev/null 2>&1; fi
  sips -c 800 800 "$f" >/dev/null 2>&1
}
# Safe to re-run: anything already downloaded is left alone, and each URL gets
# three attempts, since a few of these failed transiently the first time.
get() {
  if [ -f "$2" ] && [ "$(wc -c < "$2" | tr -d ' ')" -gt 5000 ]; then
    echo "  skip $2 (already have it)"; skip=$((skip+1)); return
  fi
  local delay=2
  for attempt in 1 2 3; do
    if curl -fsSL --max-time 45 "$1" -o "$2"; then
      square "$2"
      echo "  ok   $2"; ok=$((ok+1)); return
    fi
    sleep "$delay"; delay=$((delay * 2))
  done
  echo "  FAIL $2"; fail=$((fail+1))
}

# Mizu Bar's box images 404 on the sitedish CDN even though the menu page
# links them there. Their logo is served from the site's own domain using the
# same doubled path, so try that as a second host before giving up.
get_alt() {
  local a="$1" b="$2" out="$3"
  if [ -f "$out" ] && [ "$(wc -c < "$out" | tr -d ' ')" -gt 5000 ]; then
    echo "  skip $out (already have it)"; skip=$((skip+1)); return
  fi
  for url in "$a" "$b"; do
    if curl -fsSL --max-time 45 "$url" -o "$out" 2>/dev/null; then
      square "$out"
      echo "  ok   $out"; ok=$((ok+1)); return
    fi
  done
  echo "  FAIL $out (tried both hosts)"; fail=$((fail+1))
}

get "https://www.otaru.nl/media/21c.png" "img/dishes/otaru-sushi/rainbow-maki.jpg"
get "https://www.otaru.nl/media/23c-dragon-maki.png" "img/dishes/otaru-sushi/dragon-maki.jpg"
get "https://www.otaru.nl/media/24c-golden-maki.png" "img/dishes/otaru-sushi/golden-maki.jpg"
get "https://www.otaru.nl/media/26c_Otaru_Maki.png" "img/dishes/otaru-sushi/otaru-maki.jpg"
get "https://www.otaru.nl/media/27c-spider-maki.png" "img/dishes/otaru-sushi/spider-maki.jpg"
get "https://www.otaru.nl/media/28c-unagi-maki-speciaal.png" "img/dishes/otaru-sushi/unagi-maki-speciaal.jpg"
get "https://www.otaru.nl/media/image_19.png" "img/dishes/otaru-sushi/tori-katsu-maki.jpg"
get "https://www.otaru.nl/media/30c-Terriyaki-Chicken-Maki.png" "img/dishes/otaru-sushi/terriyaki-chicken-maki.jpg"
get "https://www.otaru.nl/media/31c-rainbow-dragon-maki.png" "img/dishes/otaru-sushi/rainbow-dragon-maki.jpg"
get "https://www.otaru.nl/media/image_191.png" "img/dishes/otaru-sushi/spicy-scallop-maki.jpg"
get "https://www.otaru.nl/media/33c-philadelphia-maki1.png" "img/dishes/otaru-sushi/philadelphia-maki.jpg"
get "https://www.otaru.nl/media/34c-sea-king-maki.png" "img/dishes/otaru-sushi/sea-king-maki.jpg"
get "https://www.otaru.nl/media/22c-avocado-tempura-maku.png" "img/dishes/otaru-sushi/avocado-tempura-maki.jpg"
get "https://www.otaru.nl/media/25c-spicy-tekka-maki.png" "img/dishes/otaru-sushi/spicy-tekka-maki.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/1b3/9d7/thumb_57_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/kung-pao-chicken.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/18f/54c/thumb_42_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/yuxiang-shredded-pork.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/18d/ee6/thumb_38_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/muxu-pork.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/18e/255/thumb_39_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/sweet-sour-pork-pineapple.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/190/91c/thumb_45_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/crispy-sweet-sour-pork.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/184/bf8/thumb_24_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/beef-cumin.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/17c/31c/thumb_11_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/poached-beef-chili-oil.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/184/721/thumb_23_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/lamb-with-leek.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/194/c08/thumb_51_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/shrimp-chili-sauce.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/1b1/b86/thumb_53_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/spicy-squid.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/1b6/818/thumb_66_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/three-delicacies.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/1b7/405/thumb_68_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/tofu-skin-paprika.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/189/b19/thumb_32_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/mapo-tofu.jpg"
get "https://cdn.order.app.hd.digital/media/attachments/14738/public/63c/190/3a4/thumb_44_285_max_fit_max_1d62c22d.jpg" "img/dishes/wan-shun/stir-fried-pork.jpg"
get_alt "https://cdn.sitedish.nl/www.mizubar.nl/img/gerechten/b7jpg.png" "https://www.mizubar.nl/www.mizubar.nl/img/gerechten/b7jpg.png" "img/dishes/mizu-bar/deluxe-box.jpg"
get_alt "https://cdn.sitedish.nl/www.mizubar.nl/img/gerechten/b6jpg.png" "https://www.mizubar.nl/www.mizubar.nl/img/gerechten/b6jpg.png" "img/dishes/mizu-bar/vega-vis-box.jpg"
get_alt "https://cdn.sitedish.nl/www.mizubar.nl/img/gerechten/b3jpg.png" "https://www.mizubar.nl/www.mizubar.nl/img/gerechten/b3jpg.png" "img/dishes/mizu-bar/vis-box.jpg"
get_alt "https://cdn.sitedish.nl/www.mizubar.nl/img/gerechten/b1jpg.png" "https://www.mizubar.nl/www.mizubar.nl/img/gerechten/b1jpg.png" "img/dishes/mizu-bar/vega-box.jpg"
get "https://cdn.sitedish.nl/www.mizubar.nl/img/gerechten/65c13b413a4b0_Mizu_Bar-5.png" "img/dishes/mizu-bar/poke-bowl.jpg"
get "https://www.salsashop.com/media/images/169/1.-Burrito---Chicken---LR.jpg" "img/dishes/salsa-shop/chicken-burrito.jpg"
get "https://www.salsashop.com/media/images/37/dish-salad-chicken.jpg" "img/dishes/salsa-shop/chicken-salad.jpg"
get "https://www.salsashop.com/media/images/152/Summer-Salad.jpg" "img/dishes/salsa-shop/summer-salad.jpg"
get "https://www.salsashop.com/media/images/153/Real-Tacos.jpg" "img/dishes/salsa-shop/real-tacos.jpg"
get "https://www.salsashop.com/media/images/35/dish-bowl-chicken.jpg" "img/dishes/salsa-shop/chicken-bowl.jpg"

# Normalise to the 800px squares the rest of the catalogue uses. sips ships
# with macOS. Some sources are PNG; the .jpg extension is what the data
# expects and browsers go by content type, so this is harmless either way.
if command -v sips >/dev/null 2>&1; then
  echo
  echo "Resizing to 800px max..."
  for f in img/dishes/otaru-sushi/*.jpg img/dishes/wan-shun/*.jpg \
           img/dishes/mizu-bar/*.jpg img/dishes/salsa-shop/*.jpg; do
    [ -f "$f" ] && sips -Z 800 "$f" >/dev/null 2>&1
  done
  echo "  done"
fi

echo
echo "$ok downloaded, $skip already had one, $fail failed"
echo
echo "Commit with:"
echo "  git add img && git commit -m 'Add dish photos' && git push"
