/* ===========================================================
   Sera — shared helpers
   Cart travels in the URL so it survives file:// where
   localStorage is unreliable; localStorage is a bonus only.
   =========================================================== */

var S = window.SERA;

/* ---------- money ---------- */
function eur(n){ return '€' + n.toFixed(2); }

/* ---------- address ---------- */
var PC_KEY   = 'sera_pc_v1';
var ADDR_KEY = 'sera_addr_v1';

var PC_RE = /^([1-9][0-9]{3})\s*([A-Za-z]{2})$/;

/* '1073ab' -> '1073 AB'; null if it isn't a Dutch postcode */
function normalisePostcode(raw){
  var m = PC_RE.exec(String(raw || '').trim());
  return m ? (m[1] + ' ' + m[2].toUpperCase()) : null;
}

function getPostcode(){
  var q = new URLSearchParams(location.search).get('pc');
  if (q && normalisePostcode(q)) return normalisePostcode(q);
  try { var v = localStorage.getItem(PC_KEY); if (v) return v; } catch(e){}
  return S.savedAddresses.length ? S.savedAddresses[0].pc : '';
}
function setPostcode(code){
  try { localStorage.setItem(PC_KEY, code); } catch(e){}
}

function getStreet(){
  try { var v = localStorage.getItem(ADDR_KEY); if (v) return v; } catch(e){}
  return S.savedAddresses.length ? S.savedAddresses[0].street : '';
}
function setStreet(street){
  try { localStorage.setItem(ADDR_KEY, street); } catch(e){}
}

/* Coverage for a postcode, matched on the 4-digit part. */
function coverageFor(code){
  var pc4 = String(code || '').slice(0,4);
  for (var i=0;i<S.coverage.length;i++){
    if (S.coverage[i].pc4 === pc4) return S.coverage[i];
  }
  return null;
}
function postcodeArea(code){
  var c = coverageFor(code);
  return c ? c.area : '';
}
function isLive(code){
  var c = coverageFor(code);
  return !!(c && c.live);
}

/* ---------- cart ----------
   Shape: { dayKey: 'tonight', items: { dishId: qty } }
   URL form: ?d=tonight&c=lasagna:2,bibimbab:1
------------------------------------------------------------ */
var CART_KEY = 'sera_cart_v1';

function emptyCart(){ return { dayKey:'tonight', items:{} }; }

function encodeCart(cart){
  var parts = [];
  Object.keys(cart.items).forEach(function(id){
    if (cart.items[id] > 0) parts.push(id + ':' + cart.items[id]);
  });
  return { d: cart.dayKey, c: parts.join(',') };
}

function decodeCart(dayKey, packed){
  var cart = { dayKey: dayKey || 'tonight', items:{} };
  if (!packed) return cart;
  packed.split(',').forEach(function(p){
    if (!p) return;
    var bits = p.split(':');
    var n = parseInt(bits[1], 10);
    if (bits[0] && n > 0) cart.items[bits[0]] = n;
  });
  return cart;
}

function loadCart(){
  var q = new URLSearchParams(location.search);
  if (q.get('c') || q.get('d')) return decodeCart(q.get('d'), q.get('c'));
  try {
    var raw = localStorage.getItem(CART_KEY);
    if (raw) {
      var o = JSON.parse(raw);
      if (o && o.items) return o;
    }
  } catch(e){}
  return emptyCart();
}

function saveCart(cart){
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch(e){}
}

function cartQuery(cart){
  var p = encodeCart(cart);
  return 'd=' + encodeURIComponent(p.d)
       + '&c=' + encodeURIComponent(p.c)
       + '&pc=' + encodeURIComponent(getPostcode());
}

/* ---------- lookups ---------- */
function dayByKey(key){
  for (var i=0;i<S.days.length;i++) if (S.days[i].key === key) return S.days[i];
  return S.days[0];
}

function dishesForDay(day){
  var out = [];
  day.kitchens.forEach(function(k){
    k.dishes.forEach(function(d){
      out.push({
        id:d.id, name:d.name, desc:d.desc, price:d.price,
        slug:k.slug, kitchen:k.name
      });
    });
  });
  return out;
}

function findDish(dayKey, id){
  var all = dishesForDay(dayByKey(dayKey));
  for (var i=0;i<all.length;i++) if (all[i].id === id) return all[i];
  return null;
}

function cartCount(cart){
  var n = 0;
  Object.keys(cart.items).forEach(function(id){ n += cart.items[id]; });
  return n;
}

function cartSubtotal(cart){
  var t = 0;
  Object.keys(cart.items).forEach(function(id){
    var d = findDish(cart.dayKey, id);
    if (d) t += d.price * cart.items[id];
  });
  return t;
}

/* ---------- thumbnails ----------
   Real photo first; a typeset name on a coloured field if the
   file is missing, never a broken frame.
------------------------------------------------------------ */
var FB_COLOURS = ['#C9622F','#9A5B2E','#8C3B2E','#A8863A','#6E7A3C','#B07A38','#7A8C6A','#8E4A4A'];

function fbColour(id){
  var h = 0;
  for (var i=0;i<id.length;i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return FB_COLOURS[h % FB_COLOURS.length];
}

function imgSrc(dish){
  return S.IMG_BASE + '/dishes/' + dish.slug + '/' + dish.id + '.jpg';
}

/* Full-bleed card photo. The image IS the card. */
function photoHTML(dish){
  var safe = dish.name.replace(/"/g,'&quot;');
  return '<div class="ph" style="background:' + fbColour(dish.id) + '">'
       +   '<img src="' + imgSrc(dish) + '" alt="' + safe + '" loading="lazy" '
       +        'onerror="thumbFallback(this,\'' + safe.replace(/'/g,'') + '\')">'
       + '</div>';
}

/* Restaurant portrait for the kitchen header. */
function restaurantHTML(kitchen){
  var src = S.IMG_BASE + '/restaurants/' + kitchen.slug + '.jpg';
  var safe = kitchen.name.replace(/"/g,'&quot;');
  var initials = kitchen.name.split(/\s+/).map(function(w){ return w[0]; }).join('').slice(0,2);
  return '<span class="shot" style="background:' + fbColour(kitchen.slug) + '">'
       +   '<img src="' + src + '" alt="' + safe + '" loading="lazy" '
       +        'onerror="thumbFallback(this,\'' + initials + '\')">'
       + '</span>';
}

/* Small square for order lines. */
function thumbHTML(dish){
  var safe = dish.name.replace(/"/g,'&quot;');
  return '<span class="ph" style="background:' + fbColour(dish.id) + '">'
       +   '<img src="' + imgSrc(dish) + '" alt="' + safe + '" loading="lazy" '
       +        'onerror="thumbFallback(this,\'' + safe.replace(/'/g,'') + '\')">'
       + '</span>';
}

function thumbFallback(img, name){
  var wrap = img.parentNode;
  img.remove();
  var d = document.createElement('span');
  d.className = 'fb';
  d.textContent = name;
  wrap.appendChild(d);
}

/* ---------- stepper ----------
   SVG rather than the − and + characters, which sit off-centre
   and differ between the two font stacks. */
var ICON_MINUS = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M5 12h14"/></svg>';
var ICON_PLUS  = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';

function stepperHTML(id, qty){
  return '<div class="qty">'
       +   '<button onclick="bump(\'' + id + '\',-1)" aria-label="One fewer">' + ICON_MINUS + '</button>'
       +   '<span class="n">' + qty + '</span>'
       +   '<button onclick="bump(\'' + id + '\',1)" aria-label="One more">' + ICON_PLUS + '</button>'
       + '</div>';
}

/* ---------- cutoff ---------- */
function minsToCutoff(){
  var now = new Date(), cut = new Date();
  cut.setHours(S.cutoffHour, 0, 0, 0);
  return Math.floor((cut - now) / 60000);
}

function cutoffText(dayKey){
  var m = minsToCutoff();
  if (dayKey === 'tomorrow'){
    return { cls:'soft', text:'Closes tomorrow at 15:00 — plenty of time' };
  }
  if (m <= 0){
    return { cls:'closed', text:'Tonight is closed — tomorrow opens at 09:00' };
  }
  var h = Math.floor(m / 60), mm = m % 60;
  var left = h > 0 ? (h + 'h ' + mm + 'm') : (mm + 'm');
  return { cls:'', text:'Orders close 15:00 — in ' + left };
}
