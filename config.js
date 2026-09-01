/* ---------------------------------------------------------------
   EDIT THIS FILE. Everything you need to change before launch.
   --------------------------------------------------------------- */
window.CONFIG = {
  // Brand. Change this one line and it updates everywhere, including the wordmark.
  brand: 'Fame',
  tagline: 'Eat like you went out. All week.',
  city: 'Amsterdam',

  // Where the email goes. Leave empty and signups are stored in
  // localStorage + logged to the console so you can test the flow today.
  // Drop in a Formspark / Tally / Google Apps Script URL when ready.
  // It receives a JSON POST: {email, cart, subtotal, dishCount, tier, survey}
  emailEndpoint: 'https://script.google.com/macros/s/AKfycbxqXpD2nKGoKc3aBXH4mRqG30i5Z16FFk_AC7KLLpXiuUA6cGof2EUI4NFBTkfIuqLaQQ/exec',

  // Analytics. Leave empty to disable; the code no-ops cleanly.
  posthogKey: 'phc_qnRzPhXFL2P2XchjH3RRCwu2TTY2t6XAoEF3sJtkakWw',
  posthogHost: 'https://eu.i.posthog.com',
  metaPixelId: '868170926165465',
  googleTagId: '',

  // Minimum dishes before checkout is allowed.
  minDishes: 2,

  // Dish count at which the best price unlocks.
  bestPriceAt: 4,
};
