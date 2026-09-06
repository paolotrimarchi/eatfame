-- Tteokbokki dropped from The Bab at Paolo's call. Guarded so anything
-- already attached to a real order is left alone.

delete from dishes
where slug = 'tteokbokki'
  and restaurant_id = (select id from restaurants where slug = 'the-bab')
  and id not in (select dish_id from order_items);
