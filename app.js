/* Encore fake-door landing. Vanilla JS, no build step. */
(function () {
  'use strict';

  var C = window.CONFIG;
  var R = window.RESTAURANTS;
  var STORE = 'encore_v1';

  var state = {
    cart: {},          // "restaurantSlug:dishId" -> qty
    day: 'sun',
    week: 0,           // index into the 4 selectable delivery weeks, see weekStart()
    view: 'home',
    rid: null,
    survey: {},
  };

  /* ---------- helpers ---------- */

  var byId = {};
  R.forEach(function (r) {
    r.dishes.forEach(function (d) { byId[r.slug + ':' + d.id] = { r: r, d: d }; });
  });

  function money(n) { return '€' + n.toFixed(2); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function count() {
    var n = 0;
    for (var k in state.cart) n += state.cart[k];
    return n;
  }

  // 0 = price at 2 dishes, 1 = at 3, 2 = at 4 or more.
  function tier(n) { return n >= C.bestPriceAt ? 2 : n === 3 ? 1 : 0; }

  function subtotalAt(t) {
    var s = 0;
    for (var k in state.cart) s += byId[k].d.price[t] * state.cart[k];
    return s;
  }
  function subtotal() { return subtotalAt(tier(count())); }
  function saving() { return subtotalAt(0) - subtotal(); }

  function tile(src, label, cls, eager) {
    return '<div class="ph ' + (cls || '') + '">' +
      '<img src="' + src + '" alt="" ' + (eager ? '' : 'loading="lazy" ') +
      'onerror="this.closest(\'.ph\').classList.add(\'noimg\')">' +
      '<span class="ph-label">' + esc(label) + '</span></div>';
  }
  function rImg(r) { return 'img/restaurants/' + r.slug + '.jpg'; }
  function dImg(r, d) { return 'img/dishes/' + r.slug + '/' + d.id + '.jpg'; }

  function nextDow(dow) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    var diff = (dow - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d;
  }
  function fmtDay(d) {
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  function fmtShort(d) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  // toISOString() converts to UTC, which rolls local midnight in Amsterdam back
  // to the previous day. Build the date string from the local parts instead.
  function isoLocal(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  // Launch is pinned. The first delivery week is the one starting FIRST_WEEK,
  // and four consecutive weeks are offered from there. Once a week is less than
  // LEAD_DAYS away it stops being offered and the window rolls forward, so the
  // site never shows a drop it can no longer deliver. Each week is a Sunday.
  var FIRST_WEEK = '2026-09-06';  // Sunday, Amsterdam local time
  var WEEK_COUNT = 4;
  var LEAD_DAYS  = 2;             // minimum notice before a drop

  function parseLocal(s) {
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function weekStart(i) {
    var d = parseLocal(FIRST_WEEK);
    var cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() + LEAD_DAYS);
    // Skip any week that has passed or is too soon to promise.
    while (d < cutoff) d.setDate(d.getDate() + 7);
    d.setDate(d.getDate() + i * 7);
    return d;
  }
  // "this week" / "next week" for the notice. Computed, not hardcoded: the old
  // copy said "next week" forever, which stopped being true the day it shipped.
  // Weeks here run Monday to Sunday, so a Sunday drop is the END of its week.
  function startPhrase(d) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var mon = new Date(today);
    mon.setDate(mon.getDate() - ((today.getDay() + 6) % 7));   // Monday of this week
    var weeks = Math.floor((d - mon) / (7 * 86400000));
    if (weeks <= 0) return 'this week';
    if (weeks === 1) return 'next week';
    return 'in ' + weeks + ' weeks';
  }
  // The final drop currently on offer: the Monday of the last selectable week.
  function lastDrop() {
    var d = weekStart(WEEK_COUNT - 1);
    d.setDate(d.getDate() + 1);
    return d;
  }
  function dayDates() {
    var sun = weekStart(state.week);
    var mon = new Date(sun);
    mon.setDate(mon.getDate() + 1);
    return { sun: sun, mon: mon };
  }

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ cart: state.cart, day: state.day, week: state.week })); } catch (e) {}
  }
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE) || '{}');
      if (v.cart) { for (var k in v.cart) if (byId[k]) state.cart[k] = v.cart[k]; }
      if (v.day) state.day = v.day;
      if (v.week >= 0 && v.week < WEEK_COUNT) state.week = v.week;
    } catch (e) {}
  }

  /* ---------- analytics ---------- */

  // Only these four reach Meta as standard events. restaurant_viewed is the real
  // product view (the cart is not); cart_viewed and fakedoor_shown duplicate
  // events Meta already has. Meta allows 8 event names per verified domain under
  // Aggregated Event Measurement, so anything not listed here is deliberately
  // withheld rather than spending a slot on UI noise.
  var META_STANDARD = {
    restaurant_viewed: 'ViewContent',
    dish_added:        'AddToCart',
    checkout_clicked:  'InitiateCheckout',
    email_submitted:   'Lead',
  };
  var META_CUSTOM_OK = { survey_submitted: 1 };

  function eventId() {
    return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function cookie(n) {
    var m = document.cookie.match('(^|;)\\s*' + n + '=([^;]*)');
    return m ? decodeURIComponent(m[2]) : '';
  }
  // Meta's click id. If the pixel never loaded there is no _fbc cookie, so build
  // one from the fbclid still sitting in the URL. This is what lets a later
  // server-side Conversions API call attribute the lead to the ad click.
  function fbc() {
    var c = cookie('_fbc');
    if (c) return c;
    var id = null;
    try { id = new URLSearchParams(location.search).get('fbclid'); } catch (e) {}
    return id ? 'fb.1.' + Date.now() + '.' + id : '';
  }

  function metaPayload(name, p) {
    switch (name) {
      case 'restaurant_viewed':
        return { content_type: 'product_group', content_ids: [String(p.restaurant_slug)] };
      case 'dish_added':
        // The item just added, NOT the running cart total. Sending the subtotal
        // here reports a 4-dish basket several times over.
        return {
          content_type: 'product',
          content_ids: [String(p.dish_id)],
          contents: [{ id: String(p.dish_id), quantity: 1, item_price: p.unit_price }],
          value: p.unit_price, currency: 'EUR',
        };
      case 'checkout_clicked':
        return {
          content_type: 'product',
          content_ids: p.content_ids || [],
          contents: p.contents || [],
          num_items: p.dish_count,
          value: p.subtotal, currency: 'EUR',
        };
      case 'email_submitted':
        // No `value`. Nothing is sold here, so there is no revenue to report and
        // a euro figure on Lead would populate ROAS columns with fiction.
        return { num_items: p.dish_count, predicted_basket_eur: p.subtotal };
    }
    return {};
  }

  // Meta events raised before consent are held here and replayed on accept, so
  // accepting mid-visit no longer throws away the journey up to that point.
  // Nothing is transmitted before consent.
  var metaQueue = [];
  function toMeta(name, p) {
    if (!META_STANDARD[name] && !META_CUSTOM_OK[name]) return;
    if (!window.fbq) {
      if (metaQueue.length < 50) metaQueue.push([name, p]);
      return;
    }
    if (META_STANDARD[name]) window.fbq('track', META_STANDARD[name], metaPayload(name, p), { eventID: p.event_id });
    else window.fbq('trackCustom', name, p, { eventID: p.event_id });
  }
  window.FAME_flushMeta = function () {
    var q = metaQueue; metaQueue = [];
    q.forEach(function (e) { try { toMeta(e[0], e[1]); } catch (err) {} });
  };

  function track(name, props) {
    var p = props || {};
    if (!p.event_id) p.event_id = eventId();   // shared id so a future CAPI call dedupes
    try { if (window.posthog) window.posthog.capture(name, p); } catch (e) {}
    try { toMeta(name, p); } catch (e) {}
    try { if (window.gtag) window.gtag('event', name, p); } catch (e) {}
    if (!C.posthogKey) console.log('[track]', name, p);
  }

  function uniq(a) { return a.filter(function (v, i, x) { return x.indexOf(v) === i; }); }

  function cartProps() {
    var n = count();
    var ti = Math.max(0, Math.min(2, tier(n)));
    var keys = Object.keys(state.cart).filter(function (k) { return byId[k]; });
    var slugs = uniq(keys.map(function (k) { return byId[k].r.slug; })).sort();
    return {
      dish_count: n,
      subtotal: +subtotal().toFixed(2),
      avg_per_dish: n ? +(subtotal() / n).toFixed(2) : 0,
      // Two properties, never one mixed-type property. PostHog assigns a single
      // type per key, so a property holding 2, 3 and '4+' silently drops the '4+'
      // bucket from numeric filters -- the exact bucket the pricing test is about.
      tier_label: n === 0 ? 'empty' : ['2', '3', '4+'][ti],
      tier_min:   n === 0 ? 0 : [2, 3, 4][ti],
      restaurants: uniq(keys.map(function (k) { return byId[k].r.name; })),
      restaurant_slugs: slugs,
      restaurant_count: slugs.length,   // breakdowns need a number, not an array
      content_ids: keys,
      contents: keys.map(function (k) {
        return { id: k, quantity: state.cart[k], item_price: byId[k].d.price[ti] };
      }),
    };
  }

  /* ---------- consent ----------
     Analytics is already running cookieless (see index.html). This banner only
     decides whether we may store a persistent identifier and load the Meta
     pixel. Declining leaves the funnel intact, so the experiment still reads. */

  var CONSENT_KEY = 'fame_consent_v1';

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function setConsentHeight(px) {
    document.documentElement.style.setProperty('--consent-h', px + 'px');
  }

  function hideConsent() {
    var el = document.getElementById('consent');
    if (!el) return;
    el.hidden = true;
    el.innerHTML = '';
    setConsentHeight(0);
  }

  function setConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {}
    if (v === 'granted') {
      if (window.FAME_loadMarketing) window.FAME_loadMarketing();
      if (window.FAME_upgradeAnalytics) window.FAME_upgradeAnalytics();
      if (window.FAME_flushMeta) window.FAME_flushMeta();   // replay the pre-consent journey
    } else {
      // A refusal must stop Meta even if consent was granted earlier in the visit.
      metaQueue = [];
      if (window.FAME_stopMarketing) window.FAME_stopMarketing();
    }
    track('consent_choice', { choice: v });
    hideConsent();
  }

  function renderConsent() {
    var el = document.getElementById('consent');
    if (!el) return;
    if (getConsent()) { hideConsent(); return; }
    el.hidden = false;
    el.innerHTML =
      '<div class="consent-in">' +
        '<p>We use cookies to measure our advertising. Usage measurement runs without ' +
        'cookies either way. <a href="/privacy">Privacy notice</a></p>' +
        '<div class="consent-btns">' +
          '<button class="btn btn-sm" data-consent="granted">Accept</button>' +
          '<button class="btn btn-sm btn-out" data-consent="denied">Decline</button>' +
        '</div>' +
      '</div>';
    setConsentHeight(el.offsetHeight);
  }

  /* ---------- routing ---------- */

  function parseHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    if (!h) return { view: 'home' };
    var parts = h.split('/');
    if (parts[0] === 'r' && parts[1]) return { view: 'menu', rid: parts[1] };
    if (['cart', 'reserve', 'done'].indexOf(parts[0]) > -1) return { view: parts[0] };
    return { view: 'home' };
  }

  function go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  var prev = { view: null, rid: null };
  var lastLead = null;        // kept in closure, never on window (raw email)
  var bootPageview = true;    // posthog init already sent the first $pageview
  var seen = {};              // screens seen this page load
  function firstView(k) { if (seen[k]) return false; seen[k] = 1; return true; }

  function route() {
    var r = parseHash();
    // Guard: no basket means nothing to reserve.
    if ((r.view === 'cart' || r.view === 'reserve') && count() === 0) { location.replace('#/'); return; }
    state.view = r.view;
    state.rid = r.rid || null;
    render();
    window.scrollTo(0, 0);
    // Hash routes are not page loads. Without this PostHog's Web Analytics path
    // report shows a single row for the whole site.
    if (!bootPageview) { try { if (window.posthog) window.posthog.capture('$pageview'); } catch (e) {} }
    bootPageview = false;
    if (r.view === 'menu' && (prev.view !== 'menu' || prev.rid !== state.rid)) {
      var _r = R.filter(function (x) { return x.slug === state.rid; })[0];
      track('restaurant_viewed', {
        restaurant_slug: state.rid,
        restaurant_name: _r ? _r.name : state.rid,
        restaurant: state.rid,               // kept so existing insights keep working
        first_view: firstView('m:' + state.rid),
      });
    }
    if (r.view === 'cart' && prev.view !== 'cart') track('cart_viewed', Object.assign({ first_view: firstView('cart') }, cartProps()));
    if (r.view === 'reserve' && prev.view !== 'reserve') track('fakedoor_shown', Object.assign({ first_view: firstView('reserve') }, cartProps()));
    if (r.view === 'done' && prev.view !== 'done') track('survey_shown', Object.assign({ first_view: firstView('done') }, cartProps()));
    prev = { view: state.view, rid: state.rid };
  }

  /* ---------- render ---------- */

  function show(v) {
    document.querySelectorAll('.view').forEach(function (el) {
      el.classList.toggle('active', el.id === 'view-' + v);
    });
  }

  function tierText() {
    var n = count();
    if (n >= C.bestPriceAt) return { done: true, text: '✓ Best price applied to every dish' };
    var need = C.bestPriceAt - n;
    return { done: false, text: 'Add ' + need + ' more dish' + (need > 1 ? 'es' : '') + ' for the best price' };
  }

  function rcard(r) {
    var from = Math.min.apply(null, r.dishes.map(function (d) { return d.price[2]; }));
    return '<button class="rcard" data-go="#/r/' + r.slug + '">' +
      tile(rImg(r), r.name) +
      '<div class="rcard-body">' +
        '<div class="rcard-head">' +
          '<h4>' + esc(r.name) + '</h4>' +
          '<div class="rcard-from">from <b>' + money(from) + '</b></div>' +
        '</div>' +
        '<div class="chips">' +
          '<span class="meta rate"><span class="star">★ ' + r.rating + '</span> (' + r.reviews + ')</span>' +
          r.tags.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') +
        '</div>' +
      '</div></button>';
  }

  function renderHome() {
    var el = document.getElementById('view-home');
    el.innerHTML =
      '<div class="brandmark">' +
        '<div class="wordmark">' + esc(C.brand) + '.</div>' +
      '</div>' +
      '<div class="hero-copy">' +
        '<h1>' + esc(C.tagline) + '</h1>' +
        '<p>Pick real dishes from Amsterdam restaurants you already love. One delivery, ready whenever you are.</p>' +
      '</div>' +
      '<div class="notice">Deliveries start ' + startPhrase(weekStart(0)) +
        '. First drop ' + fmtDay(weekStart(0)) + '.</div>' +
      '<div class="rlist">' + R.map(rcard).join('') + '</div>' +
      '<div class="how"><div class="eyebrow">How it works</div><ol>' +
        '<li>Pick at least ' + C.minDishes + ' dishes for the week.</li>' +
        '<li>4 dishes or more and every dish hits its best price.</li>' +
        '<li>One delivery, chilled, ready to heat.</li>' +
        '<li>Fast, tasty, and fairly priced.</li>' +
      '</ol></div>' +
      '<footer>' + esc(C.brand) + ' · ' + esc(C.city) +
        '<div class="foot-links">' +
          '<a href="/privacy">Privacy notice</a>' +
          '<span aria-hidden="true">·</span>' +
          '<button class="linklike" data-consent="reopen">Cookie choices</button>' +
        '</div>' +
      '</footer>';
  }

  // One tappable control, the whole row, back to the restaurant list.
  function backbar() {
    return '<button class="topbar" data-go="#/"><span class="back">‹</span><span class="back-label">Restaurants</span></button>';
  }

  function renderMenu() {
    var r = R.filter(function (x) { return x.slug === state.rid; })[0];
    if (!r) { location.replace('#/'); return; }
    var t = tierText();
    var el = document.getElementById('view-menu');
    el.innerHTML =
      backbar() +
      '<div class="rhead">' + tile(rImg(r), r.name, '', true) +
        '<div class="rhead-body">' +
          '<div class="rhead-title">' +
            '<h1>' + esc(r.name) + '</h1>' +
            '<div class="chips">' + r.tags.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div>' +
          '</div>' +
          '<div class="meta"><span class="star">★ ' + r.rating + '</span> (' + r.reviews + ') · ' + esc(r.blurb) + '</div>' +
      '</div></div>' +
      '<div class="tierbar' + (t.done ? ' done' : '') + '">' + t.text + '</div>' +
      '<div class="dishes">' + r.dishes.map(function (d) {
        var key = r.slug + ':' + d.id;
        var q = state.cart[key] || 0;
        var ctl = q
          ? '<div class="qty"><button data-dec="' + key + '" aria-label="Remove one">−</button>' +
            '<span class="n">' + q + '</span>' +
            '<button data-inc="' + key + '" aria-label="Add one">+</button></div>'
          : '<button class="add" data-inc="' + key + '" aria-label="Add ' + esc(d.name) + '">Add</button>';
        return '<div class="dish">' +
          '<div class="dish-info">' +
            '<h4>' + esc(d.name) + '</h4><p class="desc">' + esc(d.desc) + '</p>' +
            '<div class="dish-foot">' +
              '<div class="price">' + money(d.price[2]) +
                (tier(count()) === 2 ? '' : '<small>at ' + C.bestPriceAt + '+ dishes</small>') +
              '</div>' + ctl +
            '</div>' +
          '</div>' +
          '<div class="dish-media">' + tile(dImg(r, d), d.name) + '</div>' +
        '</div>';
      }).join('') + '</div>' +
      '<div class="pad-bar" style="height:8px"></div>';
  }

  function renderCart() {
    var n = count();
    var t = tier(n);
    var tt = tierText();
    var el = document.getElementById('view-cart');
    var rows = Object.keys(state.cart).map(function (k) {
      var it = byId[k], q = state.cart[k];
      return '<div class="citem">' + tile(dImg(it.r, it.d), it.d.name) +
        '<div><h4>' + esc(it.d.name) + '</h4><div class="from">' + esc(it.r.name) + '</div>' +
        '<div class="qty inline">' +
          '<button data-dec="' + k + '" aria-label="Remove one ' + esc(it.d.name) + '">' + (q > 1 ? '−' : '×') + '</button>' +
          '<span class="n">' + q + '</span>' +
          '<button data-inc="' + k + '" aria-label="Add one ' + esc(it.d.name) + '">+</button>' +
        '</div></div>' +
        '<div class="cprice">' + money(it.d.price[t] * q) +
          (q > 1 ? '<div class="cqty">' + money(it.d.price[t]) + ' each</div>' : '') +
        '</div></div>';
    }).join('');

    // Below the minimum the sticky bar already says "add 1 more dish", so a second
    // prompt is noise. While it is still a nudge it goes up top where it can change
    // the basket; once it is a confirmation it drops next to the order button.
    var notePos = n < C.minDishes ? 'none' : n < C.bestPriceAt ? 'top' : 'bottom';
    var note = '<div class="tierbar inline-note' + (notePos === 'top' ? ' at-top' : '') + '">' + tt.text + '</div>';

    el.innerHTML =
      backbar() +
      '<div class="wrap"><h1 class="page-h">Your week</h1></div>' +
      '<div class="wrap">' +
        (notePos === 'top' ? note : '') +
        '<div class="clist">' + rows + '</div>' +
        '<div class="totals">' +
          '<div class="row"><span>' + n + ' dish' + (n === 1 ? '' : 'es') + '</span><span>' + money(subtotalAt(0)) + '</span></div>' +
          (saving() > 0.001 ? '<div class="row save"><span>Bulk price</span><span>−' + money(saving()) + '</span></div>' : '') +
          '<div class="row"><span>Delivery</span><span>Free</span></div>' +
          '<div class="row big"><span>Total</span><span class="amt">' + money(subtotal()) + '</span></div>' +
        '</div>' +
        '<div class="sub-h">Delivery week</div>' +
        '<div class="weekbar">' + (function () {
          var out = '';
          for (var i = 0; i < WEEK_COUNT; i++) {
            out += '<button class="wk' + (state.week === i ? ' sel' : '') + '" data-week="' + i + '">' +
              '<b>w/c</b><span>' + fmtShort(weekStart(i)) + '</span></button>';
          }
          return out;
        })() + '</div>' +
        '<div class="sub-h">Delivery day</div>' +
        '<div class="days">' +
          '<button class="day' + (state.day === 'sun' ? ' sel' : '') + '" data-day="sun"><b>Sunday</b><span>' + fmtDay(dayDates().sun) + '</span></button>' +
          '<button class="day' + (state.day === 'mon' ? ' sel' : '') + '" data-day="mon"><b>Monday</b><span>' + fmtDay(dayDates().mon) + '</span></button>' +
        '</div>' +
        (notePos === 'bottom' ? note : '') +
      '</div>' +
      '<div class="pad-bar" style="height:8px"></div>';
  }

  function renderDoor() {
    var n = count(), t = tier(n);
    var el = document.getElementById('view-reserve');
    var lines = Object.keys(state.cart).map(function (k) {
      var it = byId[k], q = state.cart[k];
      return '<div class="rl"><span>' + q + '× ' + esc(it.d.name) + '</span><span>' + money(it.d.price[t] * q) + '</span></div>';
    }).join('');
    el.innerHTML =
      '<div class="door">' +
        '<div class="mark">' + esc(C.brand) + '.</div>' +
        '<h1>We’re not cooking yet.</h1>' +
        '<p class="sub">' + esc(C.brand) + ' is opening in ' + esc(C.city) + ' shortly. Your week is saved. Leave your email and you’ll be first in when we do.</p>' +
        '<div class="basket-recap">' +
          '<div class="eyebrow" style="margin-bottom:8px">Your week</div>' + lines +
          '<div class="rl tot"><span>' + n + ' dishes, ' + fmtDay(dayDates()[state.day]) + '</span><span>' + money(subtotal()) + '</span></div>' +
        '</div>' +
        '<form id="email-form" novalidate>' +
          '<input type="email" id="email" name="email" placeholder="you@email.com" ' +
            'inputmode="email" autocomplete="email" autocapitalize="off" autocorrect="off" required>' +
          '<div class="err" id="email-err">Enter a valid email address</div>' +
          '<button class="btn" type="submit">Notify me at launch</button>' +
        '</form>' +
        '<div class="fineprint">No payment, no spam. One email when we open.<br>' +
          '<a href="/privacy">How we handle your data</a></div>' +
        '<div style="margin-top:auto;padding-top:20px"><button class="btn-ghost" data-go="#/cart">‹ Back to my week</button></div>' +
      '</div>';
    document.getElementById('email-form').addEventListener('submit', onEmail);
  }

  var SURVEY = [
    { id: 'per_week', q: 'How many dishes a week would you actually order?', opts: ['2 to 3', '4 to 5', '6 to 8', '9 or more'] },
    { id: 'fair_price', q: 'What feels like a fair price per dish?', opts: ['Under €10', '€10 to €12', '€12 to €15', 'Over €15'] },
  ];

  function renderDone() {
    var el = document.getElementById('view-done');
    var answered = SURVEY.every(function (s) { return !!state.survey[s.id]; });
    el.innerHTML =
      '<div class="survey">' +
        '<h1>You’re on the list.</h1>' +
        '<p class="sub">Two quick questions and we’ll build the menu around your answer.</p>' +
        SURVEY.map(function (s) {
          return '<div class="q"><h4>' + esc(s.q) + '</h4><div class="opts">' +
            s.opts.map(function (o) {
              return '<button class="opt' + (state.survey[s.id] === o ? ' sel' : '') + '" data-sq="' + s.id + '" data-sv="' + esc(o) + '">' + esc(o) + '</button>';
            }).join('') + '</div></div>';
        }).join('') +
        // Both answers required, otherwise the completion rate counts empty sends.
        '<button class="btn" id="survey-send"' + (answered ? '' : ' disabled') + '>Send</button>' +
      '</div>';
    document.getElementById('survey-send').addEventListener('click', onSurvey);
  }

  function renderBar() {
    var bar = document.getElementById('cartbar');
    var n = count();
    var onCart = state.view === 'cart';
    var visible = n > 0 && ['home', 'menu', 'cart'].indexOf(state.view) > -1;
    bar.classList.toggle('show', visible);
    if (!visible) { bar.innerHTML = ''; return; }

    if (onCart) {
      var ok = n >= C.minDishes;
      bar.innerHTML =
        (ok ? '' : '<div class="hint">Add ' + (C.minDishes - n) + ' more dish to continue</div>') +
        '<button class="btn" id="checkout"' + (ok ? '' : ' disabled') + '>' +
          '<span>Order for w/c ' + fmtShort(weekStart(state.week)) + '</span>' +
          '<span class="cb-t">' + money(subtotal()) + '</span></button>';
      if (ok) document.getElementById('checkout').addEventListener('click', onCheckout);
    } else {
      bar.innerHTML =
        '<button class="btn" data-go="#/cart">' +
          '<span class="cb-n">' + n + '</span><span>View my week</span>' +
          '<span class="cb-t">' + money(subtotal()) + '</span></button>';
    }
  }

  function render() {
    show(state.view);
    if (state.view === 'home') renderHome();
    if (state.view === 'menu') renderMenu();
    if (state.view === 'cart') renderCart();
    if (state.view === 'reserve') renderDoor();
    if (state.view === 'done') renderDone();
    renderBar();
  }

  /* ---------- actions ---------- */

  function bump(key, delta) {
    var q = (state.cart[key] || 0) + delta;
    if (q <= 0) delete state.cart[key]; else state.cart[key] = q;
    save();
    var it = byId[key];
    track(delta > 0 ? 'dish_added' : 'dish_removed', Object.assign({
      restaurant: it.r.name, restaurant_name: it.r.name, restaurant_slug: it.r.slug,
      dish: it.d.name, dish_id: key,
      unit_price: it.d.price[Math.max(0, Math.min(2, tier(count())))],
      qty_delta: delta, new_qty: state.cart[key] || 0,
    }, cartProps()));
    // Emptying the basket from the cart view leaves nothing to show.
    if (count() === 0 && state.view === 'cart') { go('#/'); return; }
    render();
  }

  function onCheckout() {
    track('checkout_clicked', Object.assign({ delivery_day: state.day }, cartProps()));
    go('#/reserve');
  }

  function onEmail(e) {
    e.preventDefault();
    var input = document.getElementById('email');
    var err = document.getElementById('email-err');
    var val = (input.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
      err.classList.add('show');
      input.focus();
      track('email_invalid', {});
      return;
    }
    err.classList.remove('show');

    var payload = Object.assign({
      email: val,
      delivery_week: fmtShort(weekStart(state.week)),
      delivery_day: state.day,
      delivery_date: isoLocal(dayDates()[state.day]),
      cart: Object.keys(state.cart).map(function (k) {
        return { restaurant: byId[k].r.name, dish: byId[k].d.name, qty: state.cart[k], unit: byId[k].d.price[tier(count())] };
      }),
      submitted_at: new Date().toISOString(),
      source: location.search || '(direct)',
      query: location.search || '(none)',   // same key + sentinel as page_view, so funnels break down
    }, cartProps());

    // Meta advanced matching. The pixel SHA-256 hashes this in the browser, so the
    // raw address never leaves the page. Biggest single lift to Event Match Quality.
    try { if (window.fbq && C.metaPixelId) window.fbq('init', C.metaPixelId, { em: val.toLowerCase() }); } catch (e) {}

    // Carried to the sheet so a server-side Conversions API call can be bolted on
    // later with no further front-end change. event_id is what dedupes the two.
    payload.event_id = eventId();
    payload.fbc = fbc();
    payload.fbp = cookie('_fbp');
    payload.user_agent = navigator.userAgent;

    var btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;

    // The email goes to the spreadsheet, never to analytics. Sending it here would
    // attach a real address to a PostHog person profile even for visitors who
    // declined tracking, and the privacy notice does not cover that.
    var analytics = Object.assign({}, payload);
    delete analytics.email;
    delete analytics.cart;
    delete analytics.fbc;
    delete analytics.fbp;
    delete analytics.user_agent;
    track('email_submitted', analytics);

    // Fire and forget. Google Apps Script takes several seconds to answer, and making
    // the user watch a spinner at the exact moment they have committed is how you lose
    // them. This is a single page, so nothing unloads and the request completes in the
    // background. keepalive in send() covers the case where they close the tab.
    lastLead = payload;
    send(payload);
    go('#/done');
  }

  function send(payload) {
    if (!C.emailEndpoint) {
      try {
        var all = JSON.parse(localStorage.getItem('encore_leads') || '[]');
        all.push(payload);
        localStorage.setItem('encore_leads', JSON.stringify(all));
      } catch (e) {}
      console.log('[lead] no emailEndpoint configured, stored locally:', payload);
      return Promise.resolve();
    }
    // text/plain, not application/json. application/json is not a CORS-safelisted
    // content type, so it triggers an OPTIONS preflight, and a Google Apps Script web
    // app cannot answer a preflight. text/plain is safelisted, so no preflight is sent
    // and the POST goes straight through. The body is still JSON.
    return fetch(C.emailEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8', Accept: 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true, // survives the tab being closed mid-request
    }).catch(function (e) { console.warn('[lead] post failed', e); });
  }

  function onSurvey() {
    // cartProps() applied last would overwrite any answer whose key collides with
    // a cart property (tier, subtotal...), so answers are namespaced instead.
    var props = cartProps();
    Object.keys(state.survey).forEach(function (k) { props['survey_' + k] = state.survey[k]; });
    props.survey_answered_count = Object.keys(state.survey).length;
    track('survey_submitted', props);
    if (C.emailEndpoint && lastLead) {
      send(Object.assign({}, lastLead, { survey: state.survey, type: 'survey' }));
    }
    document.getElementById('view-done').innerHTML =
      '<div class="thanks"><div class="mark">' + esc(C.brand) + '.</div><h1>Thank you.</h1>' +
      '<p>We’ll email you the moment ' + esc(C.brand) + ' opens in ' + esc(C.city) + '.</p></div>';
  }

  /* ---------- events ---------- */

  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    var t = e.target.closest('[data-go],[data-inc],[data-dec],[data-day],[data-week],[data-sq],[data-consent]');
    if (!t) return;
    if (t.hasAttribute('data-consent')) {
      var v = t.getAttribute('data-consent');
      if (v === 'reopen') {
        try { localStorage.removeItem(CONSENT_KEY); } catch (err) {}
        renderConsent();
      } else {
        setConsent(v);
      }
      return;
    }
    if (t.hasAttribute('data-go')) { go(t.getAttribute('data-go')); return; }
    if (t.hasAttribute('data-inc')) { bump(t.getAttribute('data-inc'), 1); return; }
    if (t.hasAttribute('data-dec')) { bump(t.getAttribute('data-dec'), -1); return; }
    if (t.hasAttribute('data-day')) { state.day = t.getAttribute('data-day'); save(); track('day_selected', { day: state.day }); render(); return; }
    if (t.hasAttribute('data-week')) { state.week = +t.getAttribute('data-week'); save(); track('week_selected', { week: state.week, week_of: fmtShort(weekStart(state.week)) }); render(); return; }
    if (t.hasAttribute('data-sq')) {
      state.survey[t.getAttribute('data-sq')] = t.getAttribute('data-sv');
      track('survey_answered', {
        question: t.getAttribute('data-sq'), answer: t.getAttribute('data-sv'),
        answered_count: Object.keys(state.survey).length,
      });
      renderDone();
    }
  });

  window.addEventListener('hashchange', route);

  /* ---------- boot ---------- */

  load();
  // Campaign params as super properties, so every event carries them and the
  // landing -> email funnel can be broken down by campaign. Meta only appends
  // fbclid unless the ad's URL parameters field is filled in with utm_*.
  try {
    var _q = new URLSearchParams(location.search), _utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach(function (k) {
      if (_q.get(k)) _utm[k] = _q.get(k);
    });
    if (window.posthog && posthog.register && Object.keys(_utm).length) posthog.register(_utm);
  } catch (e) {}
  // Named session_start, not page_view: PostHog's own $pageview now fires too, and
  // two near-identically named events is how you end up building the wrong funnel.
  // This one is once-per-load and carries the returning-cart signal $pageview lacks.
  track('session_start', {
    path: location.pathname + location.hash,
    referrer: document.referrer || '(none)',
    query: location.search || '(none)',
    returning_cart: count(),
  });
  route();
  renderConsent();
})();
