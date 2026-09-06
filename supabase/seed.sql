-- Seeds restaurants + dishes from the current eatfame.com data.js, so you don't
-- have to retype the menu by hand. Prices carried over exactly.
-- cooking_instructions is left NULL on purpose -- fill those in per dish,
-- they weren't part of the old fake-door site.

insert into restaurants (slug, name, blurb, rating, reviews, tags, image_path, sort_order) values
  ('pasta-pasta',          'Pasta Pasta',              'Fresh Italian pasta, made daily',            4.3, '7,000+', array['Italian','Pasta'],               'img/restaurants/pasta-pasta.jpg', 1),
  ('otaru-sushi',          'Otaru Sushi Restaurant',   'Japanese sushi, cut fresh to order',          4.7, '5,000+', array['Sushi','Japanese','Asian'],      'img/restaurants/otaru-sushi.jpg', 2),
  ('the-bab',              'The Bab',                  'Korean comfort food',                         4.7, '2,000+', array['Korean','Asian','BBQ'],          'img/restaurants/the-bab.jpg', 3),
  ('swagat',               'Swagat Restaurant',        'North Indian comfort food',                   4.6, '2,000+', array['Indian','Comfort food'],         'img/restaurants/swagat.jpg', 4),
  ('dolce-verona',         'Dolce Verona',             'Italian trattoria, pasta and pizza',           4.7, '4,000+', array['Italian','Pizza','Pasta'],       'img/restaurants/dolce-verona.jpg', 5),
  ('warung-mini',          'Warung Mini',              'Indonesian warung, rice plates',               4.6, '3,000+', array['Indonesian','Sandwich'],         'img/restaurants/warung-mini.jpg', 6),
  ('salsa-shop',           'Salsa Shop',               'Mexican tacos and bowls',                      4.3, '2,000+', array['Mexican','Tex Mex','Halal'],     'img/restaurants/salsa-shop.jpg', 7),
  ('pind-punjabi',         'Pind Punjabi',             'North Indian, Punjabi kitchen',                4.6, '900+',   array['Indian','Chicken'],              'img/restaurants/pind-punjabi.jpg', 8),
  ('wan-shun',             'Wan Shun Restaurant',      'Chinese kitchen, rice bowls and stir-fry',     4.7, '1,500+', array['Chinese','Rice bowls'],          'img/restaurants/wan-shun.jpg', 9),
  ('mizu-bar',             'Mizu Bar',                 'Asian fusion, sushi and rice boxes',           4.8, '1,000+', array['Japanese','Asian fusion','Sushi'],'img/restaurants/mizu-bar.jpg', 10),
  ('american-spareribs',   'American Spareribs',       'Slow-cooked ribs and wings',                   4.4, '1,000+', array['American','Wings'],              'img/restaurants/american-spareribs.jpg', 11),
  ('gyros-republic',       'Gyros Republic',           'Greek street food',                            4.4, '270+',   array['Greek','Mediterranean'],         'img/restaurants/gyros-republic.jpg', 12),
  ('gnoccheria',           'Gnoccheria',               'Fresh gnocchi, made daily',                    4.7, '330+',   array['Italian','Pasta','Vegetarian'],  'img/restaurants/gnoccheria.jpg', 13),
  ('momo-tibet',           'Momo Tibet',               'Tibetan kitchen, momo folded by hand',         4.1, '150+',   array['Tibetan','Momo','Noodles'],      'img/restaurants/momo-tibet.jpg', 14)
on conflict (slug) do nothing;

-- dishes: (restaurant slug, dish slug, name, description, price@2, price@3, price@4, image path)
with d (rslug, dslug, name, description, p2, p3, p4) as (
  values
    ('pasta-pasta','pesto','Pasta Pesto','Basil pesto, parmesan, pine nuts',15.00,13.25,11.25),
    ('pasta-pasta','lasagna','Lasagna','Layered pasta, ragù, béchamel, baked',19.00,16.75,14.25),
    ('pasta-pasta','alfredo','Pasta Alfredo','Cream, butter, parmesan',16.00,14.00,12.00),
    ('pasta-pasta','bolognese','Pasta Bolognese','Slow-cooked beef ragù, parmesan',15.00,13.25,11.25),

    ('otaru-sushi','sake-sashimi','Sake Sashimi','Fresh salmon sashimi, thick cut',12.00,10.50,9.00),
    ('otaru-sushi','sake-set','Sake Set','Salmon nigiri and sashimi selection',19.00,16.75,14.25),

    ('the-bab','bibimbab','Bibimbab','Rice bowl, seasoned vegetables, egg, gochujang',16.50,14.50,12.50),
    ('the-bab','rice-roll','Korean Rice Roll','Kimbap rolls, rice, vegetables, sesame',14.00,12.25,10.50),
    ('the-bab','jap-chae','Jap Chae','Sweet potato glass noodles, vegetables, soy',17.50,15.25,13.25),
    ('the-bab','chi-bab','Chi-Bab','Korean fried chicken over rice',13.90,12.25,10.50),

    ('swagat','tikka-masala','Chicken Tikka Masala','Grilled chicken, spiced tomato gravy',25.50,22.25,19.25),
    ('swagat','saag-paneer','Saag Paneer','Paneer, spinach, garlic, cream',23.50,20.50,17.75),

    ('dolce-verona','lasagna','Lasagna','Layered pasta, ragù, béchamel',18.50,16.25,14.00),
    ('dolce-verona','carpaccio','Carpaccio','Thin-sliced beef, arugula, parmesan',16.50,14.50,12.50),
    ('dolce-verona','vitello-tonnato','Vitello Tonnato','Sliced veal, tuna sauce, capers',16.50,14.50,12.50),
    ('dolce-verona','pollo-genovese','Pollo Genovese','Chicken, Genovese-style, herbs',21.95,19.25,16.50),

    ('warung-mini','rice-rendang','Rice Rendang','Rice, slow-cooked beef rendang',17.85,15.50,13.50),
    ('warung-mini','rice-beans-chicken','Rice Beans & Chicken','Rice, long beans, spiced chicken',16.27,14.25,12.25),
    ('warung-mini','rice-rames','Rice Rames','Rice, mixed sides, sambal',17.32,15.25,13.00),

    ('salsa-shop','chicken-tacos','Chicken Tacos','Grilled chicken tacos, salsa, lime',14.45,12.75,10.75),
    ('salsa-shop','chicken-bowl','Chicken Bowl','Rice bowl, chicken, beans, salsa',14.45,12.75,10.75),
    ('salsa-shop','real-tacos','Real Tacos','Tacos, slow-cooked meat, salsa',12.95,11.25,9.75),
    ('salsa-shop','veggie-chili-bowl','Vegetarian Chili Bowl','Chili sin carne, beans, rice',13.95,12.25,10.50),

    ('pind-punjabi','butter-chicken','Butter Chicken','Tomato cream curry, tandoori chicken',21.00,18.50,15.75),
    ('pind-punjabi','tikka-masala','Chicken Tikka Masala','Grilled chicken, spiced tomato gravy',20.00,17.50,15.00),
    ('pind-punjabi','dal-makhani','Dal Makhni','Black lentils, slow-simmered, butter',17.50,15.25,13.25),


    ('mizu-bar','surf-turf-rice','Surf & Turf Fried Rice','Fried rice, beef, shrimp, garlic, vegetables',14.50,12.75,11.00),
    ('mizu-bar','b4-mix-box','Mix Box','Sushi box, mixed selection',13.90,12.25,10.50),
    ('mizu-bar','meat-fish-box','Meat & Fish Box','Beef and fish combination box',14.50,12.75,11.00),
    ('mizu-bar','duck-fried-rice','Duck Fried Rice','Fried rice, duck, egg, vegetables',14.50,12.75,11.00),

    ('american-spareribs','spareribs-classic','Spareribs Classic','Slow-cooked pork ribs, BBQ glaze',21.00,18.50,15.75),
    ('american-spareribs','honey-spareribs','Honey Spareribs','Pork ribs, honey glaze',21.00,18.50,15.75),
    ('american-spareribs','spareribs-hawaii','Spareribs Hawai','Pork ribs, pineapple glaze',21.00,18.50,15.75),
    ('american-spareribs','hotwings','Hotwings','9 pieces, chicken wings, hot sauce',7.50,6.50,5.75),

    ('gyros-republic','pork-pita','Pork Gyros Pita','Pita, pork gyros, tzatziki, fries',13.50,11.75,10.25),
    ('gyros-republic','pork-plate','Pork Gyros Plate','Pork gyros, fries, salad, tzatziki',19.00,16.75,14.25),
    ('gyros-republic','chick-pita','Chicken Gyros Pita','Pita, chicken gyros, tzatziki, fries',13.50,11.75,10.25),
    ('gyros-republic','chick-plate','Chicken Gyros Plate','Chicken gyros, fries, salad, tzatziki',19.00,16.75,14.25),

    ('gnoccheria','pesto','Pesto','Gnocchi, basil pesto, parmesan',15.00,13.25,11.25),
    ('gnoccheria','pomodoro-combo','Pomodoro','Tomato sauce and basil',12.00,10.50,9.00),
    ('gnoccheria','4-cheese','4 Cheese','Gnocchi, four cheese sauce',18.00,15.75,13.50),
    ('gnoccheria','sorrentina','Sorrentina','Gnocchi, tomato, mozzarella, basil',16.00,14.00,12.00),

    -- Specialty dishes only, per the owner. Menu prices from momotibet.com.
    ('momo-tibet','chicken-momo','Chicken Momo','Steamed dumplings, minced chicken, onion and spices',13.50,11.75,10.25),
    ('momo-tibet','jhol-momo','Jhol Momo','Momo in a tomato, sesame, garlic and chili broth',14.00,12.25,10.50),
    ('momo-tibet','veg-mokthuk','Veg Mokthuk','Vegetable momo in a warming broth',12.50,11.00,9.50),
    ('momo-tibet','spicy-fried-momo','Spicy Fried Momo','Pan-fried momo, garlic-chili sauce, onion, peppers',14.00,12.25,10.50),
    ('momo-tibet','thenthuk','Thenthuk','Hand-pulled noodle soup with beef',14.50,12.75,11.00),
    ('momo-tibet','phing-sha','Phing Sha','Glass noodle and beef stew, spices, steamed rice',16.50,14.50,12.50),
    ('momo-tibet','shaptak','Shaptak','Spicy stir-fried beef, served with rice or tingmo',17.00,15.00,12.75),

    -- Menu expansion, 6 Sept 2026. See MENU-RESEARCH.md for sources per
    -- restaurant; each price is that restaurant's own listed menu price.
    ('otaru-sushi','rainbow-maki','Rainbow Maki','Crabstick, avocado, cucumber, roe, assorted fish',14.50,12.75,11.00),
    ('otaru-sushi','dragon-maki','Dragon Maki','Breaded prawns, eel, cucumber, fish roe',18.50,16.25,14.00),
    ('otaru-sushi','golden-maki','Golden Maki','Breaded prawns, avocado, omelet, fish roe',14.50,12.75,11.00),
    ('otaru-sushi','otaru-maki','Otaru Maki','Scallop, crabstick, cucumber, fish roe',17.00,15.00,12.75),
    ('otaru-sushi','spider-maki','Spider Maki','Deep-fried soft-shell crab, avocado, fish roe',16.50,14.50,12.50),
    ('otaru-sushi','unagi-maki-speciaal','Unagi Maki Speciaal','Grilled eel, avocado, salmon skin, sauce',15.00,13.25,11.25),
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
