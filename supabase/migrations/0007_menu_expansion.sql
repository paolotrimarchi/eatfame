-- Menu expansion: 59 additional dishes across all 13 original restaurants.
--
-- Every price is read from a live page, sourced per restaurant in
-- MENU-RESEARCH.md at the repo root. Tiers follow the existing convention:
-- the restaurant's own menu price at 2 dishes, then -12.5% and -25%, rounded
-- to the nearest 0.25.
--
-- Where a restaurant publishes its own prices AND sells through a delivery
-- platform, the own-site price is used -- platform listings carry a 5-25%
-- markup that isn't ours to inherit. The basis used is noted per restaurant
-- in MENU-RESEARCH.md.
--
-- Photo coverage is uneven: Otaru, Wan Shun, Mizu Bar and Salsa Shop have
-- real per-dish photography we can point at. The other nine have none that
-- can be fetched, so their dishes are limited to three each pending photos.

with d (rslug, dslug, name, description, p2, p3, p4) as (
  values
    ('otaru-sushi','rainbow-maki','Rainbow Maki','Crabstick, avocado, cucumber, roe, assorted fish',14.50,12.75,11.00),
    ('otaru-sushi','dragon-maki','Dragon Maki','Breaded prawns, eel, cucumber, fish roe',18.50,16.25,14.00),
    ('otaru-sushi','golden-maki','Golden Maki','Breaded prawns, avocado, omelet, fish roe',14.50,12.75,11.00),
    ('otaru-sushi','otaru-maki','Otaru Maki','Scallop, crabstick, cucumber, fish roe',17.00,15.00,12.75),
    ('otaru-sushi','spider-maki','Spider Maki','Deep-fried soft-shell crab, avocado, fish roe',16.50,14.50,12.50),
    ('otaru-sushi','unagi-maki-speciaal','Unagi Maki Speciaal','Grilled eel, avocado, salmon skin, sauce',15.00,13.25,11.25),
    ('otaru-sushi','tori-katsu-maki','Tori Katsu Maki','Breaded chicken, avocado, katsu sauce',13.50,11.75,10.25),
    ('otaru-sushi','terriyaki-chicken-maki','Terriyaki Chicken Maki','Teriyaki chicken, cucumber, teriyaki sauce',13.50,11.75,10.25),
    ('otaru-sushi','rainbow-dragon-maki','Rainbow Dragon Maki','Breaded prawns, avocado, cucumber, assorted fish',16.50,14.50,12.50),
    ('otaru-sushi','spicy-scallop-maki','Spicy Scallop Maki','Scallop, spring onion, cucumber, spicy sauce',14.50,12.75,11.00),
    ('otaru-sushi','philadelphia-maki','Philadelphia Maki','Salmon, cream cheese, avocado',13.50,11.75,10.25),
    ('otaru-sushi','sea-king-maki','Sea King Maki','Salmon, tuna, cucumber, omelet, ikura, roe',16.50,14.50,12.50),
    ('otaru-sushi','avocado-tempura-maki','Avocado Tempura Maki','Deep-fried prawns, avocado, cucumber, fish roe',15.00,13.25,11.25),
    ('otaru-sushi','spicy-tekka-maki','Spicy Tekka Maki','Tuna, spring onion, cucumber, spicy sauce',13.50,11.75,10.25),
    ('wan-shun','kung-pao-chicken','Kung Pao Chicken','Leek, peanuts, sweet-sour, lightly spicy',23.00,20.25,17.25),
    ('wan-shun','yuxiang-shredded-pork','Yuxiang Shredded Pork','Coriander, carrot, black fungus, sweet-sour',23.00,20.25,17.25),
    ('wan-shun','muxu-pork','Muxu Pork','Sliced pork, egg, black fungus',23.00,20.25,17.25),
    ('wan-shun','sweet-sour-pork-pineapple','Sweet and Sour Pork with Pineapple','Crisp pork, pineapple, sweet-sour sauce',23.00,20.25,17.25),
    ('wan-shun','crispy-sweet-sour-pork','Crispy Sweet and Sour Pork','Battered pork, sugar and vinegar sauce',25.00,22.00,18.75),
    ('wan-shun','beef-cumin','Beef Tenderloin with Cumin','Beef strips, toasted cumin, high-heat wok',28.00,24.50,21.00),
    ('wan-shun','poached-beef-chili-oil','Poached Sliced Beef in Chili Oil','Sliced beef, Sichuan hot chili oil',28.00,24.50,21.00),
    ('wan-shun','lamb-with-leek','Stir-fried Lamb with Leek','Lamb strips, fresh leek, wok-seared',29.00,25.50,21.75),
    ('wan-shun','shrimp-chili-sauce','Stir-fried Shrimp in Chili Sauce','Shrimp, kung pao chili sauce',28.00,24.50,21.00),
    ('wan-shun','spicy-squid','Spicy Squid','Squid rings, chili, aromatic spice',28.00,24.50,21.00),
    ('wan-shun','three-delicacies','Three Delicacies','Sauteed potato, green pepper, eggplant',18.00,15.75,13.50),
    ('wan-shun','tofu-skin-paprika','Tofu Skin with Paprika','Yuba, paprika, light and textured',18.00,15.75,13.50),
    ('wan-shun','mapo-tofu','Mapo Tofu','Silken tofu, minced pork, chilli bean sauce',20.00,17.50,15.00),
    ('wan-shun','stir-fried-pork','Stir-fried Pork Slices in Batter','Battered pork slices, wok-tossed',23.00,20.25,17.25),
    ('mizu-bar','deluxe-box','Deluxe Box','18 pieces: california, ebi crunch, unagi, rainbow',21.50,18.75,16.25),
    ('mizu-bar','vega-vis-box','Vega & Fish Box','13 pieces: cheese salmon, rock shrimp, mango salmon',17.50,15.25,13.25),
    ('mizu-bar','vis-box','Fish Box','12 pieces: california, spicy tuna, ebi crunch',12.90,11.25,9.75),
    ('mizu-bar','vega-box','Vega Box','12 pieces: kappa, avocado, avocado nigiri, crispy',12.90,11.25,9.75),
    ('mizu-bar','poke-bowl','Poke Bowl','Rice bowl, build your own',15.90,14.00,12.00),
    ('salsa-shop','chicken-burrito','Chicken Burrito','Grilled chicken, rice, black beans, corn, salsa',14.45,12.75,10.75),
    ('salsa-shop','chicken-salad','Chicken Salad','Romaine, grilled chicken, beans, corn, pico',14.45,12.75,10.75),
    ('salsa-shop','summer-salad','Summer Salad','Grilled chicken, lettuce, pico, rajas con pina',12.95,11.25,9.75),
    ('pasta-pasta','carbonara','Spaghetti Carbonara','Bacon, egg, parmesan',18.50,16.25,14.00),
    ('pasta-pasta','tagliatelle-salmone','Tagliatelle Salmone','Smoked salmon, white wine cream, cherry tomato',19.00,16.75,14.25),
    ('pasta-pasta','pomodoro','Pasta Pomodoro','Tomato sauce, garlic, olive oil',13.95,12.25,10.50),
    ('the-bab','classic-fried-chicken','Korean Fried Chicken','Slightly spicy sauce, topped with peanuts',18.50,16.25,14.00),
    ('the-bab','kimchi-bokkeumbab','Kimchi Bokkeumbab','Kimchi fried rice, fried egg, sesame',17.50,15.25,13.25),
    ('the-bab','tteokbokki','Tteokbokki','Rice cake, fish cake, gochujang, spring onion',12.90,11.25,9.75),
    ('swagat','butter-chicken','Butter Chicken','Tandoori chicken, creamy tomato curry',25.50,22.25,19.25),
    ('swagat','lamb-rogan-josh','Lamb Rogan Josh','Kashmiri lamb, browned onion, yoghurt, ginger',26.50,23.25,20.00),
    ('swagat','chana-masala','Chana Masala','Chickpeas, medium-spiced curry sauce',20.50,18.00,15.50),
    ('dolce-verona','carbonara','Spaghetti alla Carbonara','Bacon, egg yolk, cream, parmesan',18.50,16.25,14.00),
    ('dolce-verona','tagliatelle-tartufo','Tagliatelle Tartufo','Mushrooms, truffle sauce',20.50,18.00,15.50),
    ('dolce-verona','pizza-margherita','Pizza Margherita','Tomato sauce, mozzarella',13.50,11.75,10.25),
    ('warung-mini','gado-gado','Gado Gado','Rice, cabbage, beansprouts, tofu, peanut sauce',14.70,12.75,11.00),
    ('warung-mini','javaanse-moksie','Javaanse Moksie','Rice, bami, tempeh, beef in coconut, chicken, egg',19.42,17.00,14.50),
    ('warung-mini','nasi-sate','Nasi Sate','Nasi with chicken satay',15.75,13.75,11.75),
    ('pind-punjabi','rogan-josh','Rogan Josh','Lamb, rich spice mix, tomato, onion',22.00,19.25,16.50),
    ('pind-punjabi','chicken-korma','Chicken Korma','Mild creamy sauce, aromatic spices, cashew',20.00,17.50,15.00),
    ('pind-punjabi','saag-paneer','Saag Paneer','Indian cheese, creamy spinach, herbs',17.50,15.25,13.25),
    ('american-spareribs','spareribs-barbecue','Spareribs Barbecue','Pork ribs, barbecue glaze',21.00,18.50,15.75),
    ('american-spareribs','spareribs-sweet-chili','Spareribs Sweet Chili','Pork ribs, sweet chilli glaze, mild heat',21.00,18.50,15.75),
    ('american-spareribs','spareribs-piri-piri','Spareribs Piri Piri','Pork ribs, American pepper marinade',21.00,18.50,15.75),
    ('gyros-republic','chicken-souvlaki-wrap','Chicken Souvlaki Wrap','Pita, chicken skewer, tomato, onion, fries',13.50,11.75,10.25),
    ('gyros-republic','pork-gyros-skepasti','Pork Gyros Skepasti','Double pita, graviera, salad, fries',19.50,17.00,14.75),
    ('gyros-republic','chicken-gyros-kapsalon','Chicken Gyros Kapsalon','Fries, graviera, garlic sauce, sriracha',13.50,11.75,10.25),
    ('gnoccheria','bolognese','Bolognese','Tomato, beef and pork mince, basil, parmigiano',20.00,17.50,15.00),
    ('gnoccheria','burrata-datterini','Burrata and Datterini','Cherry tomatoes, parmesan, basil, burrata',18.00,15.75,13.50),
    ('gnoccheria','norma','Norma','Aubergine, tomato, basil, ricotta salata',19.00,16.75,14.25)
)
insert into dishes (restaurant_id, slug, name, description, price_at_2, price_at_3, price_at_4, image_path)
select r.id, d.dslug, d.name, d.description, d.p2, d.p3, d.p4,
       'img/dishes/' || d.rslug || '/' || d.dslug || '.jpg'
from d
join restaurants r on r.slug = d.rslug
on conflict (restaurant_id, slug) do nothing;

-- Four existing rows re-priced onto their restaurant's own menu basis, now
-- that we have that restaurant's own prices and photos. Wan Shun's "Stir
-- Fried Pork In Batter" is also renamed to match the menu.

update dishes set
  name = 'Avocado Tempura Maki',
  description = 'Deep-fried prawns, avocado, cucumber, fish roe',
  price_at_2 = 15.00, price_at_3 = 13.25, price_at_4 = 11.25
where slug = 'avocado-tempura-maki' and restaurant_id = (select id from restaurants where slug = 'otaru-sushi');

update dishes set
  name = 'Spicy Tekka Maki',
  description = 'Tuna, spring onion, cucumber, spicy sauce',
  price_at_2 = 13.50, price_at_3 = 11.75, price_at_4 = 10.25
where slug = 'spicy-tekka-maki' and restaurant_id = (select id from restaurants where slug = 'otaru-sushi');

update dishes set
  name = 'Mapo Tofu',
  description = 'Silken tofu, minced pork, chilli bean sauce',
  price_at_2 = 20.00, price_at_3 = 17.50, price_at_4 = 15.00
where slug = 'mapo-tofu' and restaurant_id = (select id from restaurants where slug = 'wan-shun');

update dishes set
  name = 'Stir-fried Pork Slices in Batter',
  description = 'Battered pork slices, wok-tossed',
  price_at_2 = 23.00, price_at_3 = 20.25, price_at_4 = 17.25
where slug = 'stir-fried-pork' and restaurant_id = (select id from restaurants where slug = 'wan-shun');
