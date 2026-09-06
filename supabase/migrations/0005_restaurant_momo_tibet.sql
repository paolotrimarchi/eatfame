-- Adds Momo Tibet (Ceintuurbaan 432H, Amsterdam) as a partner restaurant.
--
-- Specialty dishes only, per the owner's request: the momo in its four
-- styles, plus the three Tibetan mains. Deliberately left out: appetizers,
-- soups, drinks, desserts, sides, and the combo meals.
--
-- Prices are the restaurant's own menu prices from momotibet.com/menu, used
-- as the 2-dish tier, stepping down roughly 12.5% and 25% for the 3- and
-- 4-dish tiers -- same shape as every other restaurant in the seed.
--
-- Rating supplied by Paolo (4.1 from 154 ratings), shown as "150+" to match
-- the rounded review counts used for every other restaurant here.

insert into restaurants (slug, name, blurb, rating, reviews, tags, image_path, sort_order) values
  ('momo-tibet', 'Momo Tibet', 'Tibetan kitchen, momo folded by hand', 4.1, '150+',
   array['Tibetan','Momo','Noodles'], 'img/restaurants/momo-tibet.jpg', 14)
on conflict (slug) do nothing;

with d (rslug, dslug, name, description, p2, p3, p4) as (
  values
    ('momo-tibet','chicken-momo','Chicken Momo','Steamed dumplings, minced chicken, onion and spices',13.50,11.75,10.00),
    ('momo-tibet','beef-momo','Beef Momo','Steamed dumplings, minced beef, onion and spices',14.50,12.75,11.00),
    ('momo-tibet','veg-momo','Veg Momo','Steamed dumplings, vegetables, onion and spices',12.50,11.00,9.50),
    ('momo-tibet','jhol-momo','Jhol Momo','Momo in a tomato, sesame, garlic and chili broth',14.00,12.25,10.50),
    ('momo-tibet','spicy-fried-momo','Spicy Fried Momo','Pan-fried momo, garlic-chili sauce, onion, peppers',14.00,12.25,10.50),
    ('momo-tibet','thenthuk','Thenthuk','Hand-pulled noodle soup with beef',14.50,12.75,11.00),
    ('momo-tibet','phing-sha','Phing Sha','Glass noodle and beef stew, spices, steamed rice',16.50,14.50,12.50),
    ('momo-tibet','shaptak','Shaptak','Spicy stir-fried beef, served with rice or tingmo',17.00,15.00,12.75)
)
insert into dishes (restaurant_id, slug, name, description, price_at_2, price_at_3, price_at_4, image_path)
select r.id, d.dslug, d.name, d.description, d.p2, d.p3, d.p4,
       'img/dishes/' || d.rslug || '/' || d.dslug || '.jpg'
from d
join restaurants r on r.slug = d.rslug
on conflict (restaurant_id, slug) do nothing;
