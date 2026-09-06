#!/bin/bash
# Fills the dishes that have no restaurant photo with a Wikimedia Commons
# photo OF THAT DISH, resolved live from the Wikipedia API. Nothing here is a
# hardcoded image URL: the script asks Wikipedia for each article's lead image
# and downloads whatever it returns. Anything it can't resolve is printed as
# FAIL and left for you.
#
# Safe to re-run: dishes that already have an image are skipped, so a second
# run only retries what's still missing.
#
# Two things to know before this goes in front of customers:
#
#  1. These are photos of the DISH TYPE, not the restaurant's own plate. Fine
#     for filling out the page now, wrong to leave there once you're taking
#     real orders — a customer ordering from a photo should get that plate.
#  2. Most Commons photos are CC BY-SA, which legally requires crediting the
#     photographer. This script writes img/ATTRIBUTION.md with the credit line
#     for every image it downloads. If you'd rather not carry that obligation,
#     treat these as placeholders and swap them for your own shots.
#
# Run from the repo root:
#   bash download-stock-images.sh

set -u
cd "$(dirname "$0")"

UA='eatfame-image-fetch/1.0 (contact: hello@eatfame.com)'
ATTR="img/ATTRIBUTION.md"

# Rebuild the credits table from scratch each run, then re-append rows for
# images that already exist so nothing loses its attribution on a re-run.
TMP_ATTR=$(mktemp)
[ -f "$ATTR" ] && grep '^| ' "$ATTR" | grep -v '^| Dish ' | grep -v '^|---' > "$TMP_ATTR" || true

ok=0; fail=0; skip=0

# Wikipedia rate-limits hard when hit in a tight loop, which is what broke
# the first version of this script after about seven dishes. One try, then
# two retries with growing backoff, and a pause between dishes.
api_get() {
  local url="$1" out delay=2
  for attempt in 1 2 3; do
    if out=$(curl -fsSL --max-time 20 -H "User-Agent: $UA" "$url" 2>/dev/null) && [ -n "$out" ]; then
      printf '%s' "$out"; return 0
    fi
    sleep "$delay"; delay=$((delay * 2))
  done
  return 1
}

json_field() {
  node -e '
    let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
      try {
        const j=JSON.parse(s);
        const u=(j.originalimage&&j.originalimage.source)||(j.thumbnail&&j.thumbnail.source)||"";
        process.stdout.write(u);
      } catch(e){}
    });'
}

# The dish tiles are square. "sips -Z" only caps the longest side, so tall
# photos stayed tall and got badly cropped by CSS. Resample the SHORT side to
# 800 then centre-crop to 800x800, so what we store is what gets shown.
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

# fetch <wikipedia-article-title> <output-path> <label> [lang]
# Different language editions of the same article usually carry different
# lead photos, which is how two restaurants both serving carbonara end up
# with two different pictures instead of the same one twice.
fetch() {
  local title="$1" out="$2" label="$3" lang="${4:-en}"

  if [ -f "$out" ] && [ "$(wc -c < "$out" | tr -d ' ')" -gt 5000 ]; then
    echo "  skip $label (already have it)"; skip=$((skip+1)); return
  fi

  local slug json src
  slug=$(printf '%s' "$title" | sed 's/ /_/g')
  if ! json=$(api_get "https://${lang}.wikipedia.org/api/rest_v1/page/summary/$slug"); then
    echo "  FAIL $label — couldn't reach article \"$title\""; fail=$((fail+1)); sleep 1; return
  fi

  src=$(printf '%s' "$json" | json_field)
  if [ -z "$src" ]; then
    echo "  FAIL $label — \"$title\" has no lead image"; fail=$((fail+1)); sleep 1; return
  fi

  mkdir -p "$(dirname "$out")"
  if ! curl -fsSL --max-time 60 -H "User-Agent: $UA" "$src" -o "$out"; then
    echo "  FAIL $label — download failed"; fail=$((fail+1)); sleep 1; return
  fi

  square "$out"

  # Strip both the NNNpx- thumbnail prefix AND the ?utm_source=... query
  # string; leaving the query on was why every credit came back "unknown".
  local file meta line
  file=$(basename "${src%%\?*}" | sed 's/^[0-9]*px-//')
  if meta=$(api_get "https://commons.wikimedia.org/w/api.php?action=query&titles=File:${file}&prop=imageinfo&iiprop=extmetadata&format=json&formatversion=2"); then
    line=$(printf '%s' "$meta" | LABEL="$label" FILE="$file" node -e '
      let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
        const strip=h=>String(h||"").replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim();
        let artist="unknown", lic="unknown";
        try {
          const p=JSON.parse(s).query.pages[0].imageinfo[0].extmetadata;
          artist=strip(p.Artist&&p.Artist.value)||"unknown";
          lic=strip(p.LicenseShortName&&p.LicenseShortName.value)||"unknown";
        } catch(e){}
        const f=process.env.FILE;
        process.stdout.write(`| ${process.env.LABEL} | ${artist} | ${lic} | https://commons.wikimedia.org/wiki/File:${f} |`);
      });')
    echo "$line" >> "$TMP_ATTR"
  fi

  local kb=$(( $(wc -c < "$out" | tr -d ' ') / 1024 ))
  echo "  ok   $label (${kb}KB)"
  ok=$((ok+1))
  sleep 1
}

echo "The Bab:"
fetch "Yangnyeom chicken"    "img/dishes/the-bab/classic-fried-chicken.jpg" "Korean Fried Chicken"
fetch "Bokkeumbap"           "img/dishes/the-bab/kimchi-bokkeumbab.jpg"     "Kimchi Bokkeumbab"

echo "Pasta Pasta:"
fetch "Carbonara"            "img/dishes/pasta-pasta/carbonara.jpg"           "Spaghetti Carbonara"
fetch "Tagliatelle"          "img/dishes/pasta-pasta/tagliatelle-salmone.jpg" "Tagliatelle Salmone"
fetch "Pasta al pomodoro"    "img/dishes/pasta-pasta/pomodoro.jpg"            "Pasta Pomodoro"

echo "Pind Punjabi:"
fetch "Rogan josh"           "img/dishes/pind-punjabi/rogan-josh.jpg"    "Rogan Josh"
fetch "Korma"                "img/dishes/pind-punjabi/chicken-korma.jpg" "Chicken Korma"
fetch "Palak paneer"         "img/dishes/pind-punjabi/saag-paneer.jpg"   "Saag Paneer"

echo "Gyros Republic:"
fetch "Souvlaki"             "img/dishes/gyros-republic/chicken-souvlaki-wrap.jpg"   "Chicken Souvlaki Wrap" el
fetch "Gyros"                "img/dishes/gyros-republic/pork-gyros-skepasti.jpg"     "Pork Gyros Skepasti" de
fetch "Kapsalon"             "img/dishes/gyros-republic/chicken-gyros-kapsalon.jpg"  "Chicken Gyros Kapsalon" nl

echo "Dolce Verona:"
fetch "Carbonara"            "img/dishes/dolce-verona/carbonara.jpg"           "Spaghetti alla Carbonara" it
fetch "Tagliatelle"          "img/dishes/dolce-verona/tagliatelle-tartufo.jpg" "Tagliatelle Tartufo" it
fetch "Pizza Margherita"     "img/dishes/dolce-verona/pizza-margherita.jpg"    "Pizza Margherita"

echo "Swagat:"
fetch "Butter chicken"       "img/dishes/swagat/butter-chicken.jpg"   "Butter Chicken"
fetch "Rogan josh"           "img/dishes/swagat/lamb-rogan-josh.jpg"  "Lamb Rogan Josh"
fetch "Chana masala"         "img/dishes/swagat/chana-masala.jpg"     "Chana Masala"

echo "Warung Mini:"
fetch "Gado-gado"            "img/dishes/warung-mini/gado-gado.jpg"       "Gado Gado"
fetch "Nasi goreng"          "img/dishes/warung-mini/javaanse-moksie.jpg" "Javaanse Moksie"
fetch "Satay"                "img/dishes/warung-mini/nasi-sate.jpg"       "Nasi Sate"

echo "American Spareribs:"
# three different articles on purpose, so the three rib dishes don't all
# end up showing the same photograph
fetch "Pork ribs"            "img/dishes/american-spareribs/spareribs-barbecue.jpg"    "Spareribs Barbecue"
fetch "Barbecue"             "img/dishes/american-spareribs/spareribs-sweet-chili.jpg" "Spareribs Sweet Chili"
fetch "Ribs (food)"          "img/dishes/american-spareribs/spareribs-piri-piri.jpg"   "Spareribs Piri Piri"

echo "Mizu Bar (their own box photos 404, so sushi stand-ins):"
fetch "Sushi"                "img/dishes/mizu-bar/deluxe-box.jpg"   "Deluxe Box"
fetch "Sushi"                "img/dishes/mizu-bar/vega-vis-box.jpg" "Vega & Fish Box" nl
fetch "California roll"      "img/dishes/mizu-bar/vis-box.jpg"      "Fish Box"
fetch "Sushi"                "img/dishes/mizu-bar/vega-box.jpg"     "Vega Box" de

echo "Gnoccheria:"
fetch "Bolognese sauce"      "img/dishes/gnoccheria/bolognese.jpg"         "Bolognese"
fetch "Gnocchi"              "img/dishes/gnoccheria/burrata-datterini.jpg" "Burrata and Datterini"
fetch "Pasta alla Norma"     "img/dishes/gnoccheria/norma.jpg"             "Norma"

# ---- credits file ----
{
  cat <<'HEADER'
# Image attribution

Dish photos sourced from Wikimedia Commons as placeholders, pending the
restaurants' own photography. Most are CC BY-SA and require the credit below.
Replace these with real dish photos and this file shrinks accordingly.

| Dish | Photographer | Licence | Source |
|---|---|---|---|
HEADER
  sort -u "$TMP_ATTR"
} > "$ATTR"
rm -f "$TMP_ATTR"

echo
echo "Duplicate check:"
dupes=$(find img/dishes -name '*.jpg' -exec md5 -q {} \; 2>/dev/null | sort | uniq -d | wc -l | tr -d ' ')
if [ "$dupes" = "0" ]; then
  echo "  no two dishes share a photo"
else
  echo "  $dupes photo(s) used by more than one dish:"
  find img/dishes -name '*.jpg' -exec md5 -q {} \; 2>/dev/null | sort | uniq -d | while read -r h; do
    find img/dishes -name '*.jpg' | while read -r f; do
      [ "$(md5 -q "$f")" = "$h" ] && echo "     $f"
    done
  done
fi

echo
echo "$ok downloaded, $skip already had one, $fail still to do by hand"
echo "Credits in $ATTR"
