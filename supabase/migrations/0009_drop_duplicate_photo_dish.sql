-- Otaru's own site serves the same image file for both Tori Katsu Maki and
-- Spicy Scallop Maki (media/image_19.png and media/image_191.png are
-- byte-identical), so the two dishes would have shown the same photograph.
-- Keeping Spicy Scallop Maki and dropping the other, per the one-photo-per-dish
-- rule. Add it back if Otaru ever supplies a distinct shot.

delete from dishes
where slug = 'tori-katsu-maki'
  and restaurant_id = (select id from restaurants where slug = 'otaru-sushi')
  and id not in (select dish_id from order_items);
