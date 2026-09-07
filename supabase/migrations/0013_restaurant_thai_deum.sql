-- Adds Thai Deum (Ceintuurbaan 210, 1072 GD Amsterdam) as a partner
-- restaurant, at position 5 in the running order.
--
-- Dishes: two starters plus chicken and beef mains, per Paolo. Prices are
-- Thai Deum's own menu prices from thaideum.com/menu, used as the 2-dish
-- tier, stepping down ~12.5% and ~25% for the 3- and 4-dish tiers -- same
-- shape as every other restaurant in the seed.
--
-- Their menu charges €2.50 extra for rice. We include rice and absorb that
-- cost, so the descriptions say "with rice" and the price is unchanged.
--
-- Photo-backed only, using photos from their own gallery (thaideum.com/foto).
-- That gallery is heavily chicken and vegetarian, so beef stops at two:
-- the oyster-sauce stir-fry and the beef salad. Garlic beef, basil beef and
-- sweet-and-sour beef are all on their menu but have no photograph, and Thai
-- stir-fries look similar enough across proteins that reusing one would show
-- customers a dish they aren't buying.
--
-- Rating 4.4 from 211 reviews, per their own site footer, shown as "200+" to
-- match the rounded review counts used everywhere else here.

-- Position 5 is a request, not a demand signal -- Thai Deum is new and has no
-- view history. Everything from Wan Shun down moves one place.
--
-- The "not exists" guard makes this safe to run twice: without it, a second
-- run would shove everything down another slot and quietly scramble the order.
update restaurants set sort_order = sort_order + 1
where sort_order >= 5
  and not exists (select 1 from restaurants where slug = 'thai-deum');

insert into restaurants (slug, name, blurb, rating, reviews, tags, image_path, sort_order) values
  ('thai-deum', 'Thai Deum', 'Thai specialities, Ceintuurbaan', 4.4, '200+',
   array['Thai','Curry','Asian'], 'img/restaurants/thai-deum.jpg', 5)
on conflict (slug) do nothing;

with d (rslug, dslug, name, description, p2, p3, p4) as (
  values
    ('thai-deum','veg-spring-rolls','Vegetable Spring Rolls','Five rolls, sweet chilli sauce',7.00,6.25,5.25),
    ('thai-deum','tofu-satay','Tofu Satay','Five skewers, peanut sauce, cucumber relish',6.50,5.75,5.00),
    ('thai-deum','cashew-nut-chicken','Cashew Nut Chicken','Cashews, spring onion, leek and carrot, with rice',17.25,15.00,13.00),
    ('thai-deum','red-curry-chicken','Chicken Red Curry','Coconut milk, bamboo, Thai basil, spicy, with rice',18.95,16.50,14.25),
    ('thai-deum','green-curry-chicken','Chicken Green Curry','Coconut milk, long beans, basil, spicy, with rice',18.95,16.50,14.25),
    ('thai-deum','beef-oyster-sauce','Beef in Oyster Sauce','Peppers, spring onion, mushroom, with rice',19.95,17.50,15.00),
    ('thai-deum','spicy-beef-salad','Spicy Beef Salad','Sliced beef, red onion, coriander, chilli',20.50,18.00,15.50)
)
insert into dishes (restaurant_id, slug, name, description, price_at_2, price_at_3, price_at_4, image_path)
select r.id, d.dslug, d.name, d.description, d.p2, d.p3, d.p4,
       'img/dishes/' || d.rslug || '/' || d.dslug || '.jpg'
from d
join restaurants r on r.slug = d.rslug
on conflict (restaurant_id, slug) do nothing;
