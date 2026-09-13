-- Adds Abyssinia (Jan Pieter Heijestraat 190, Oud West) as a partner
-- restaurant, at position 6 in the running order.
--
-- Prices are Abyssinia's own menu prices, supplied by Paolo, used as the
-- 2-dish tier and stepping down ~12.5% and ~25% for the 3- and 4-dish tiers,
-- same shape as every other restaurant here.
--
-- Unlike most restaurants on the site there is no side to add: every dish
-- arrives on teff injera with lentil stew and salad, so the menu price is the
-- whole plate.
--
-- Six dishes, all photo-backed with Abyssinia's own photography: three meat
-- (Zegni, Tebsi, Doro Tebsi) and three vegan (Hamli, Temtemo, Duba). Their
-- two Sambusa starters are €7.00 each but have no photograph, so they're left
-- out until there is one.
--
-- Worth knowing for the copy elsewhere: teff injera is naturally gluten-free
-- and half this menu is vegan. Nothing else on the site covers either.
--
-- Rating 4.4 from 2,183 reviews, shown as "2,000+" to match the rounded
-- review counts used everywhere else.

-- Position 6 is a request, not a demand signal -- Abyssinia is new here and
-- has no view history. Everything from Wan Shun down moves one place.
--
-- The "not exists" guard makes this safe to run twice: without it, a second
-- run would shove everything down another slot and scramble the order.
update restaurants set sort_order = sort_order + 1
where sort_order >= 6
  and not exists (select 1 from restaurants where slug = 'abyssinia');

insert into restaurants (slug, name, blurb, rating, reviews, tags, image_path, sort_order) values
  ('abyssinia', 'Abyssinia', 'Ethiopian and Eritrean, 30 years in Oud West', 4.4, '2,000+',
   array['Ethiopian','Eritrean','Vegan'], 'img/restaurants/abyssinia.jpg', 6)
on conflict (slug) do nothing;

with d (rslug, dslug, name, description, p2, p3, p4) as (
  values
    ('abyssinia','zegni','Zegni','Slow-cooked beef in berbere, with teff injera',18.00,15.75,13.50),
    ('abyssinia','tebsi','Tebsi','Sautéed beef, peppers, onion, with teff injera',19.00,16.75,14.25),
    ('abyssinia','doro-tebsi','Doro Tebsi','Sautéed chicken, peppers, onion, with teff injera',16.50,14.50,12.50),
    ('abyssinia','hamli','Hamli','Collard greens, garlic and spices, vegan',15.50,13.50,11.75),
    ('abyssinia','temtemo','Temtemo','Spiced red lentil stew, vegan',15.50,13.50,11.75),
    ('abyssinia','duba','Duba','Pumpkin stew with herbs and spices, vegan',15.50,13.50,11.75)
)
insert into dishes (restaurant_id, slug, name, description, price_at_2, price_at_3, price_at_4, image_path)
select r.id, d.dslug, d.name, d.description, d.p2, d.p3, d.p4,
       'img/dishes/' || d.rslug || '/' || d.dslug || '.jpg'
from d
join restaurants r on r.slug = d.rslug
on conflict (restaurant_id, slug) do nothing;
