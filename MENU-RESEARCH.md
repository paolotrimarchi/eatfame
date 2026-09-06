# Menu research — all 13 restaurants

Researched 6 September 2026 against restaurants' own sites, their
Thuisbezorgd-generated microsites, Uber Eats and TheFork. Every price below was
read off a live page. Nothing estimated, nothing interpolated.

---

## Three findings that matter more than the dish count

### 1. The prices currently on eatfame.com are stale almost everywhere

Not by rounding — by €2 to €6 a dish, and in a few cases the dish doesn't exist.

| Restaurant | On our site | Live menu now |
|---|---|---|
| Swagat | Chicken Tikka Masala €20 | €25.50 |
| Swagat | Saag Paneer €19 | €23.50 |
| Swagat | Dal Makhni €19 | **no such dish** (closest: Dal tarka €20.50) |
| Pind Punjabi | Butter Chicken €19 | €21 |
| Pind Punjabi | Dal Makhani €15 | €17.50 |
| Pind Punjabi | Persian Biryani €19 | **no such dish** (Chicken €20 / Lamb €21 / Prawn €23 / Veg €18) |
| Gnoccheria | Pesto €13 | €15 |
| Gnoccheria | 4 Cheese €16 | €18 |
| Gnoccheria | Sorrentina €14 | €16 |
| Gnoccheria | Pomodoro Combo €12 | mislabelled — plain Pomodoro is €12, the combo is €17 |
| Gyros Republic | Pork pita €12 / Chicken pita €13 | both €13.50 (no longer priced differently) |
| Gyros Republic | Plates €18 / €18.50 | both €19 |
| American Spareribs | Spareribs Classic €20 | €21 |
| American Spareribs | Hotwings €13 | €7.50 for 9 pieces |
| Wan Shun | €16–€20 across the board | €18–€28; Mapo Tofu isn't on their own menu at all |
| Mizu Bar | everything €15 | €12.90–€21.50 depending on box |
| Warung Mini | Rice Rendang €16 | €17.85 |
| Dolce Verona | Lasagna €17, Pollo Genovese €20 | €18.50, €21.95 |

Two rows are outright fictional: **Swagat's "Dal Makhni"** and **Pind Punjabi's
"Persian Biryani"**. Neither is on the respective menu in any form.

### 2. Two of the thirteen aren't in Amsterdam

- **Dolce Verona** — Kostverlorenhof 55, **Amstelveen**. Delivers into Amsterdam.
- **American Spareribs** — Arent Krijtsstraat 9, **Diemen**. (The listing that
  matches our rating/tags exactly is "American Spareribs Lijn", Diemen.)

Both plausibly fine for a delivery business, but the site says Amsterdam.

### 3. Every price has two versions, and ours are a mix

Delivery platforms mark up 5–25% over the restaurant's own menu. Our existing
rows are mostly rounded Uber Eats snapshots. Since our model uses the 2-dish
price as the customer-facing top price, which basis we pick decides the margin
on every order. It needs to be one basis, chosen deliberately, per restaurant.

---

## Per-dish photography — the real constraint on adding dishes

| Restaurant | Dish photos available? |
|---|---|
| Otaru Sushi | **Yes** — 12 real per-dish URLs on otaru.nl |
| Wan Shun | **Yes** — ~26 dish photos on their own ordering site |
| Mizu Bar | **Partial** — boxes and poké bowl only (5) |
| Salsa Shop | **Partial** — one photo per format, plus 2 real dish photos |
| Pasta Pasta | No |
| The Bab | Site has them, but lazy-loaded and not fetchable |
| Swagat | No |
| Dolce Verona | No (7 unlabelled photos on TheFork, not mapped to dishes) |
| Warung Mini | No |
| Pind Punjabi | No |
| American Spareribs | No |
| Gyros Republic | No |
| Gnoccheria | Lifestyle shots only, none mapped to a named dish |

So the "only list dishes that have their own photo" rule, applied strictly,
allows expansion at 4 of 13 restaurants.

---

## Dishes found, by restaurant

### Otaru Sushi — otaru.nl (own site, own-site prices, all with photos)

| Dish | Description | Own price | UE price |
|---|---|---|---|
| Dragon Maki | Breaded prawns, eel, cucumber, fish roe | €18.50 | €23.00 |
| Rainbow Dragon Maki | Breaded prawns, avocado, cucumber, assorted fish | €16.50 | €19.90 |
| Otaru Maki | Scallop, crabstick, cucumber, fish roe | €17.00 | — |
| Spider Maki | Deep-fried soft-shell crab, avocado, fish roe | €16.50 | — |
| Sea King Maki | Salmon, tuna, cucumber, omelet, ikura, roe | €16.50 | — |
| Rainbow Maki | Crabstick, avocado, cucumber, roe, assorted fish | €14.50 | — |
| Golden Maki | Breaded prawns, avocado, omelet, fish roe | €14.50 | — |
| Unagi Maki Speciaal | Grilled eel, avocado, salmon skin, sauce | €15.00 | — |
| Spicy Scallop Maki | Scallop, spring onion, cucumber, spicy sauce | €14.50 | — |
| Philadelphia Maki | Salmon, cream cheese, avocado | €13.50 | — |
| Tori Katsu Maki | Breaded chicken, avocado, katsu sauce | €13.50 | — |
| Terriyaki Chicken Maki | Teriyaki chicken, cucumber, teriyaki sauce | €13.50 | — |

### Wan Shun — own pick-up ordering site (photos), prices are pick-up basis

| Dish | Description | Price |
|---|---|---|
| Kung Pao Chicken | Leek, peanuts, sweet-sour, lightly spicy | €23.00 |
| Yuxiang Shredded Pork | Coriander, carrot, black fungus, sweet-sour | €23.00 |
| Muxu Pork | Sliced pork, egg, black fungus | €23.00 |
| Sweet and Sour Pork with Pineapple | Crisp pork, pineapple, sweet-sour sauce | €23.00 |
| Crispy Sweet and Sour Pork Slices | Battered pork, sugar and vinegar sauce | €25.00 |
| Fried Beef Tenderloin with Cumin | Beef strips, toasted cumin, high-heat wok | €28.00 |
| Poached Sliced Beef in Hot Chili Oil | Sliced beef, Sichuan hot chili oil | €28.00 |
| Stir-fried Lamb with Leek | Lamb strips, fresh leek, wok-seared | €29.00 |
| Stir Fried Shrimp in Chili Sauce | Shrimp, kung pao chili sauce | €28.00 |
| Spicy Squid | Squid rings, chili, aromatic spice | €28.00 |
| Three Delicacies | Sautéed potato, green pepper, eggplant | €18.00 |
| Tofu Skin with Paprika | Yuba, paprika, light and textured | €18.00 |

(~14 more verified with photos if wanted. Note the menu carries numeric codes
like "401" which should be stripped for customers.)

### Mizu Bar — mizubar.nl (own site). Photos for boxes + poké bowl only

| Dish | Description | Price | Photo |
|---|---|---|---|
| Deluxe box, 18 pcs | California, ebi crunch, unagi, rainbow | €21.50 | yes |
| Vega en vis box, 13 pcs | Cheese salmon, rock shrimp, mango salmon | €17.50 | yes |
| Vis box, 12 pcs | California, spicy tuna, ebi crunch | €12.90 | yes |
| Vega box, 12 pcs | Kappa, avocado, avocado nigiri, crispy | €12.90 | yes |
| Poké bowl | Build your own | €15.90 | yes |
| Chicken / Beef / Duck noodle soup | Mixed vegetables and egg | €15.50 ea | no |
| Surf and turf noodle soup | Beef and shrimps, vegetables, egg | €16.50 | no |
| Seafood noodle soup | Salmon and shrimps, vegetables, egg | €16.50 | no |
| Rice or noodles with chicken / salmon / beef | Wok-fried, mixed vegetables | €13.50 ea | no |
| Rice or noodles with seafood | Salmon and shrimps, vegetables | €14.50 | no |
| Surf and turf bowl / All meat bowl / Seafood bowl | Seaweed, avocado, edamame, corn | €16.90 ea | no |

### Salsa Shop — Uber Eats prices (matches our existing basis)

| Dish | Description | Price | Photo |
|---|---|---|---|
| Chicken Burrito | Grilled chicken, rice, black beans, corn, salsa | €14.45 | yes |
| Chicken Salad | Romaine, grilled chicken, beans, corn, pico | €14.45 | yes |
| Summer Salad | Grilled chicken, lettuce, pico, rajas con piña | €12.95 | yes |
| Shredded Beef Burrito | Spicy shredded beef, rice, beans, corn, salsa | €14.95 | no |
| Pulled Pork Burrito | Pulled pork, rice, black beans, corn, salsa | €14.95 | no |
| Vegetarian Chili Burrito | Chili sin carne, rice, beans, corn, salsa | €13.95 | no |
| Veggie Burrito | Grilled veggies, rice, beans, corn, salsa | €13.45 | no |
| Shredded Beef Bowl / Pulled Pork Bowl | Rice or bulgur, black beans | €14.95 ea | no |
| Shredded Beef Tacos / Pulled Pork Tacos | Three tortillas, salsa | €14.95 ea | no |
| The Dripper | Chicken burrito, peach habanero, sour cream | €14.45 | no |
| The Tumble | Chicken, bulgur, cucumber yoghurt salsa | €14.45 | no |

Photo also available for our existing **Real Tacos** and **Chicken Bowl**.

### Pasta Pasta — Uber Eats (Ferdinand Bolstraat, De Pijp). No photos

Spaghetti Carbonara €18.50 · Ravioli ai Funghi con Crema di Tartufo €18.50 ·
Tagliatelle Salmone €19.00 · Penne alla Vodka €17.95 · Spaghetti ai Frutti di
Mare €18.50 · Tagliatelle al Sugo di Salsiccia €18.50 · Spaghetti alla
Puttanesca €18.50 · Ravioli di Carne al Sugo €18.50 · Spinach Ravioli with
Ricotta €18.95 · Pasta Pomodoro €13.95

⚠️ Two "Pasta Pasta" in Amsterdam. Our prices match the Ferdinand Bolstraat
listing, not the Warmoesstraat one. Worth confirming which is the partner.

### The Bab — Uber Eats (Oud West). No fetchable photos

Korean Classic Fried Chicken €18.50 · Korean Sweet Fried Chicken €18.50 ·
Kimchi Bokkeumbab €17.50 · Spicy Japchae €17.50 · Tteokbokki €12.90

(Three Amsterdam locations with slightly different menus; ours matches Oud West.)

### Swagat — swagat-amsterdam.nl. No photos

Butter Chicken €25.50 · Chicken Korma €25.50 · Chicken Madras €25.50 · Chicken
Biryani €25.50 · Lamb Rogan Josh €26.50 · Lamb Madras €26.50 · Paneer Tikka
Masala €24.50 · Shahi Paneer €23.50 · Dal Tarka €20.50 · Chana Masala €20.50 ·
King Prawn Masala €24.75 · Tandoori Chicken €25.50

### Pind Punjabi — own menu PDF (May 2026). No photos

Rogan Josh €22 · Lamb Tikka Masala €21 · Chicken Korma €20 · Chicken Kadai €20 ·
Chicken Saag €20 · Tandoori Chicken Tikka €19.50 · Tandoori Lamb Tikka €21 ·
Chicken Biryani €20 · Lamb Biryani €21 · Saag Paneer €17.50 · Paneer Tikka
Masala €17.50 · Chana Masala €17.50

(~35 more verified in the PDF if wanted.)

### Dolce Verona — TheFork, cross-checked against own PDF. No photos

Spaghetti alla Carbonara €18.50 · Spaghetti alla Bolognese €18.50 · Tagliatelle
Tartufo €20.50 · Panzerotti Tartufo €21.50 · Spaghetti alle Vongole €21.95 ·
Risotto Tartufo Portobello €22.75 · Linguine Frutti di Mare €22.95 · Ossobuco
alla Milanese €28.50 · Pizza Diavola Piccante €17.00 · Pizza Margherita €13.50

### Warung Mini — own microsite (Van Woustraat 19). No photos

Rijst met kip en groenten €13.65 · Rijst met kipfilet €15.82 · Rijst met rund
€16.27 · Rijst met lamsvlees €16.27 · Rijst met moksie metie €16.27 · Rijst met
pom €16.27 · Rijst met garnalen €17.85 · Javaanse Moksie €19.42 · Gado Gado
€14.70 · Nasi of Bami Saté €15.75

(Delivery-inflated prices, hence the odd cents. Two Warung Minis in Amsterdam;
ours is Van Woustraat, confirmed by the 4.6 / 3,000+ rating match.)

### American Spareribs — Uber Eats (Diemen). No photos

Spareribs Barbecue €21 · Spareribs Hot & Sweet Chili €21 · Spareribs Piri Piri
€21 · Spareribs Mexican €21

### Gyros Republic — own microsite. No photos

Chicken Souvlaki Pita Wrap €13.50 · Pork Souvlaki Pita Wrap €13.50 · Chicken &
Bacon Souvlaki Pita Wrap €13.90 · Kebab Pita Wrap €13.50 · Pork Gyros Skepasti
€19.50 · Chicken Gyros Skepasti €19.50 · Chicken Gyros Kapsalon €13.50 · Pork
Gyros Kapsalon €13.50

(Plus 13 more verified: souvlaki schotels €19, vegan gyros range, etc.)

### Gnoccheria — Uber Eats. No per-dish photos

Bolognese €20 · Red Pesto €15 · Burrata and Datterini Tomatoes €18 · Truffle and
Mushrooms €20 · Norma €19

Their real in-store price list is published only as two images
(`gnoccheria.nl/wp-content/uploads/2025/11/a5-menu-09.png` and `a5-combo-09.png`)
which couldn't be read automatically — worth a two-minute human look if you want
in-store rather than Uber pricing.

---

## Sources that actually worked

Ranked, for next time:

1. **Thuisbezorgd-generated restaurant microsites** (`<name>-amsterdam.nl`) —
   full static menus, every section. Best single source.
2. **Restaurants' own ordering platforms** (hd.digital, Sitedish, Wix menus) —
   full menus *and* real photos when they exist.
3. **Uber Eats store pages** — full menus with descriptions, but marked-up
   prices and no fetchable dish images.
4. **TheFork** — clean static menus, good for restaurants without delivery.
5. `thuisbezorgd.nl/menu/<slug>` — renders only the first section, unreliable alone.

Dead ends: restaurantguru.com (empty bodies), most own-site galleries
(JS-rendered with empty `src`), Uber Eats dish thumbnails (lazy-loaded).
