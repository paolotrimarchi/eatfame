-- Momo Tibet: only list dishes that have their own photo on momotibet.com.
--
-- Their site has a single photo covering all three steamed momo, so the beef
-- and veg rows would have been duplicates of the chicken one. Dropping both,
-- and adding Veg Mokthuk (vegetable momo in broth, €12,50 on their menu,
-- which does have its own photo) so the restaurant still has a vegetarian
-- option.
--
-- Written as a separate migration rather than editing 0005 because 0005 may
-- already have been applied -- running both in order gets the same result.

-- order_items.dish_id is a plain foreign key with no cascade, so guard the
-- delete: if either dish somehow ended up on a real order, leave it alone
-- rather than failing the whole migration.
delete from dishes
where slug in ('beef-momo', 'veg-momo')
  and restaurant_id = (select id from restaurants where slug = 'momo-tibet')
  and id not in (select dish_id from order_items);

with d (rslug, dslug, name, description, p2, p3, p4) as (
  values
    ('momo-tibet','veg-mokthuk','Veg Mokthuk','Vegetable momo in a warming broth',12.50,11.00,9.50)
)
insert into dishes (restaurant_id, slug, name, description, price_at_2, price_at_3, price_at_4, image_path)
select r.id, d.dslug, d.name, d.description, d.p2, d.p3, d.p4,
       'img/dishes/' || d.rslug || '/' || d.dslug || '.jpg'
from d
join restaurants r on r.slug = d.rslug
on conflict (restaurant_id, slug) do nothing;
