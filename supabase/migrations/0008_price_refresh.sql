-- Brings every dish onto one basis: the restaurant's live menu price at the
-- 2-dish tier, then -12.5% at 3 and -25% at 4+, rounded to the nearest 0.25.
-- The 25% at the top tier is the agreed restaurant discount.
--
-- Before this, most rows were €2-6 under what the restaurants actually charge
-- (they looked like old delivery-platform snapshots), so the site was quoting
-- prices that couldn't be honoured. Sources per restaurant: MENU-RESEARCH.md.
--
-- Not touched: Pasta Pasta (already within rounding of its live menu) and
-- Otaru's Sake Sashimi / Sake Set, whose own-site prices aren't published on
-- the page that lists the rest of the menu.

update dishes set price_at_2 = 25.50, price_at_3 = 22.25, price_at_4 = 19.25
  where slug = 'tikka-masala' and restaurant_id = (select id from restaurants where slug = 'swagat');

update dishes set price_at_2 = 23.50, price_at_3 = 20.50, price_at_4 = 17.75
  where slug = 'saag-paneer' and restaurant_id = (select id from restaurants where slug = 'swagat');

update dishes set price_at_2 = 21.00, price_at_3 = 18.50, price_at_4 = 15.75
  where slug = 'butter-chicken' and restaurant_id = (select id from restaurants where slug = 'pind-punjabi');

update dishes set price_at_2 = 20.00, price_at_3 = 17.50, price_at_4 = 15.00
  where slug = 'tikka-masala' and restaurant_id = (select id from restaurants where slug = 'pind-punjabi');

update dishes set name = 'Dal Makhni', price_at_2 = 17.50, price_at_3 = 15.25, price_at_4 = 13.25
  where slug = 'dal-makhani' and restaurant_id = (select id from restaurants where slug = 'pind-punjabi');

update dishes set price_at_2 = 15.00, price_at_3 = 13.25, price_at_4 = 11.25
  where slug = 'pesto' and restaurant_id = (select id from restaurants where slug = 'gnoccheria');

update dishes set name = 'Pomodoro', description = 'Tomato sauce and basil', price_at_2 = 12.00, price_at_3 = 10.50, price_at_4 = 9.00
  where slug = 'pomodoro-combo' and restaurant_id = (select id from restaurants where slug = 'gnoccheria');

update dishes set price_at_2 = 18.00, price_at_3 = 15.75, price_at_4 = 13.50
  where slug = '4-cheese' and restaurant_id = (select id from restaurants where slug = 'gnoccheria');

update dishes set price_at_2 = 16.00, price_at_3 = 14.00, price_at_4 = 12.00
  where slug = 'sorrentina' and restaurant_id = (select id from restaurants where slug = 'gnoccheria');

update dishes set price_at_2 = 13.50, price_at_3 = 11.75, price_at_4 = 10.25
  where slug = 'pork-pita' and restaurant_id = (select id from restaurants where slug = 'gyros-republic');

update dishes set price_at_2 = 13.50, price_at_3 = 11.75, price_at_4 = 10.25
  where slug = 'chick-pita' and restaurant_id = (select id from restaurants where slug = 'gyros-republic');

update dishes set price_at_2 = 19.00, price_at_3 = 16.75, price_at_4 = 14.25
  where slug = 'pork-plate' and restaurant_id = (select id from restaurants where slug = 'gyros-republic');

update dishes set price_at_2 = 19.00, price_at_3 = 16.75, price_at_4 = 14.25
  where slug = 'chick-plate' and restaurant_id = (select id from restaurants where slug = 'gyros-republic');

update dishes set price_at_2 = 21.00, price_at_3 = 18.50, price_at_4 = 15.75
  where slug = 'spareribs-classic' and restaurant_id = (select id from restaurants where slug = 'american-spareribs');

update dishes set description = '9 pieces, chicken wings, hot sauce', price_at_2 = 7.50, price_at_3 = 6.50, price_at_4 = 5.75
  where slug = 'hotwings' and restaurant_id = (select id from restaurants where slug = 'american-spareribs');

update dishes set price_at_2 = 14.50, price_at_3 = 12.75, price_at_4 = 11.00
  where slug = 'surf-turf-rice' and restaurant_id = (select id from restaurants where slug = 'mizu-bar');

update dishes set name = 'Mix Box', description = 'Sushi box, mixed selection', price_at_2 = 13.90, price_at_3 = 12.25, price_at_4 = 10.50
  where slug = 'b4-mix-box' and restaurant_id = (select id from restaurants where slug = 'mizu-bar');

update dishes set price_at_2 = 14.50, price_at_3 = 12.75, price_at_4 = 11.00
  where slug = 'meat-fish-box' and restaurant_id = (select id from restaurants where slug = 'mizu-bar');

update dishes set price_at_2 = 14.50, price_at_3 = 12.75, price_at_4 = 11.00
  where slug = 'duck-fried-rice' and restaurant_id = (select id from restaurants where slug = 'mizu-bar');

update dishes set price_at_2 = 18.50, price_at_3 = 16.25, price_at_4 = 14.00
  where slug = 'lasagna' and restaurant_id = (select id from restaurants where slug = 'dolce-verona');

update dishes set price_at_2 = 16.50, price_at_3 = 14.50, price_at_4 = 12.50
  where slug = 'carpaccio' and restaurant_id = (select id from restaurants where slug = 'dolce-verona');

update dishes set price_at_2 = 16.50, price_at_3 = 14.50, price_at_4 = 12.50
  where slug = 'vitello-tonnato' and restaurant_id = (select id from restaurants where slug = 'dolce-verona');

update dishes set name = 'Pollo Genovese', price_at_2 = 21.95, price_at_3 = 19.25, price_at_4 = 16.50
  where slug = 'pollo-genovese' and restaurant_id = (select id from restaurants where slug = 'dolce-verona');

update dishes set price_at_2 = 17.85, price_at_3 = 15.50, price_at_4 = 13.50
  where slug = 'rice-rendang' and restaurant_id = (select id from restaurants where slug = 'warung-mini');

update dishes set price_at_2 = 16.27, price_at_3 = 14.25, price_at_4 = 12.25
  where slug = 'rice-beans-chicken' and restaurant_id = (select id from restaurants where slug = 'warung-mini');

update dishes set price_at_2 = 17.32, price_at_3 = 15.25, price_at_4 = 13.00
  where slug = 'rice-rames' and restaurant_id = (select id from restaurants where slug = 'warung-mini');

update dishes set price_at_2 = 14.45, price_at_3 = 12.75, price_at_4 = 10.75
  where slug = 'chicken-tacos' and restaurant_id = (select id from restaurants where slug = 'salsa-shop');

update dishes set price_at_2 = 14.45, price_at_3 = 12.75, price_at_4 = 10.75
  where slug = 'chicken-bowl' and restaurant_id = (select id from restaurants where slug = 'salsa-shop');

update dishes set price_at_2 = 12.95, price_at_3 = 11.25, price_at_4 = 9.75
  where slug = 'real-tacos' and restaurant_id = (select id from restaurants where slug = 'salsa-shop');

update dishes set price_at_2 = 13.95, price_at_3 = 12.25, price_at_4 = 10.50
  where slug = 'veggie-chili-bowl' and restaurant_id = (select id from restaurants where slug = 'salsa-shop');

update dishes set price_at_2 = 16.50, price_at_3 = 14.50, price_at_4 = 12.50
  where slug = 'bibimbab' and restaurant_id = (select id from restaurants where slug = 'the-bab');

update dishes set price_at_2 = 13.90, price_at_3 = 12.25, price_at_4 = 10.50
  where slug = 'chi-bab' and restaurant_id = (select id from restaurants where slug = 'the-bab');

-- Rows for dishes that don't exist on the restaurants' menus at all. Guarded
-- so anything already attached to a real order is left alone.

-- not on Swagat's menu; their lentil dish is Dal tarka
delete from dishes
where slug = 'dal-makhni'
  and restaurant_id = (select id from restaurants where slug = 'swagat')
  and id not in (select dish_id from order_items);

-- no "Persian Biryani" exists; theirs are chicken/lamb/prawn/veg
delete from dishes
where slug = 'biryani'
  and restaurant_id = (select id from restaurants where slug = 'pind-punjabi')
  and id not in (select dish_id from order_items);

-- only a beef version exists, now listed as Poached Sliced Beef
delete from dishes
where slug = 'poached-pork'
  and restaurant_id = (select id from restaurants where slug = 'wan-shun')
  and id not in (select dish_id from order_items);

-- not on their own menu, delivery-platform-only item
delete from dishes
where slug = 'sweet-sour-chicken'
  and restaurant_id = (select id from restaurants where slug = 'wan-shun')
  and id not in (select dish_id from order_items);

-- Finally, normalise the discount curve on the older hand-set rows, where
-- the top tier had drifted to 27-33% off instead of the agreed 25%. Only the
-- 3- and 4-dish tiers move here; the 2-dish price is untouched.

update dishes set price_at_2 = 14.00, price_at_3 = 12.25, price_at_4 = 10.50
  where slug = 'rice-roll' and restaurant_id = (select id from restaurants where slug = 'the-bab');

update dishes set price_at_2 = 17.50, price_at_3 = 15.25, price_at_4 = 13.25
  where slug = 'jap-chae' and restaurant_id = (select id from restaurants where slug = 'the-bab');

update dishes set price_at_2 = 15.00, price_at_3 = 13.25, price_at_4 = 11.25
  where slug = 'pesto' and restaurant_id = (select id from restaurants where slug = 'pasta-pasta');

update dishes set price_at_2 = 19.00, price_at_3 = 16.75, price_at_4 = 14.25
  where slug = 'lasagna' and restaurant_id = (select id from restaurants where slug = 'pasta-pasta');

update dishes set price_at_2 = 15.00, price_at_3 = 13.25, price_at_4 = 11.25
  where slug = 'bolognese' and restaurant_id = (select id from restaurants where slug = 'pasta-pasta');

update dishes set price_at_2 = 12.00, price_at_3 = 10.50, price_at_4 = 9.00
  where slug = 'sake-sashimi' and restaurant_id = (select id from restaurants where slug = 'otaru-sushi');

update dishes set price_at_2 = 19.00, price_at_3 = 16.75, price_at_4 = 14.25
  where slug = 'sake-set' and restaurant_id = (select id from restaurants where slug = 'otaru-sushi');

update dishes set price_at_2 = 21.00, price_at_3 = 18.50, price_at_4 = 15.75
  where slug = 'honey-spareribs' and restaurant_id = (select id from restaurants where slug = 'american-spareribs');

update dishes set price_at_2 = 21.00, price_at_3 = 18.50, price_at_4 = 15.75
  where slug = 'spareribs-hawaii' and restaurant_id = (select id from restaurants where slug = 'american-spareribs');

update dishes set price_at_2 = 13.50, price_at_3 = 11.75, price_at_4 = 10.25
  where slug = 'chicken-momo' and restaurant_id = (select id from restaurants where slug = 'momo-tibet');
