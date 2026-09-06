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
    ('pasta-pasta','pesto','Pasta Pesto','Basil pesto, parmesan, pine nuts',15.00,13.00,11.00),
    ('pasta-pasta','lasagna','Lasagna','Layered pasta, ragù, béchamel, baked',19.00,16.50,14.00),
    ('pasta-pasta','alfredo','Pasta Alfredo','Cream, butter, parmesan',16.00,14.00,12.00),
    ('pasta-pasta','bolognese','Pasta Bolognese','Slow-cooked beef ragù, parmesan',15.00,13.00,11.00),

    ('otaru-sushi','avocado-tempura-maki','Avocado Tempura Maki','Tempura avocado roll, rice, nori',18.00,16.00,14.00),
    ('otaru-sushi','sake-sashimi','Sake Sashimi','Fresh salmon sashimi, thick cut',12.00,10.00,8.00),
    ('otaru-sushi','spicy-tekka-maki','Spicy Tekka Maki','Spicy tuna roll, rice, nori',16.00,14.00,12.00),
    ('otaru-sushi','sake-set','Sake Set','Salmon nigiri and sashimi selection',19.00,16.50,14.00),

    ('the-bab','bibimbab','Bibimbab','Rice bowl, seasoned vegetables, egg, gochujang',16.00,14.50,13.00),
    ('the-bab','rice-roll','Korean Rice Roll','Kimbap rolls, rice, vegetables, sesame',14.00,12.50,11.00),
    ('the-bab','jap-chae','Jap Chae','Sweet potato glass noodles, vegetables, soy',17.50,16.00,14.50),
    ('the-bab','chi-bab','Chi-Bab','Korean fried chicken over rice',14.00,12.25,10.50),

    ('swagat','tikka-masala','Chicken Tikka Masala','Grilled chicken, spiced tomato gravy',20.00,17.50,15.00),
    ('swagat','saag-paneer','Saag Paneer','Paneer, spinach, garlic, cream',19.00,16.50,14.00),
    ('swagat','dal-makhni','Dal Makhni','Black lentils, butter, cream',19.00,16.50,14.00),

    ('dolce-verona','lasagna','Lasagna','Layered pasta, ragù, béchamel',17.00,15.00,13.00),
    ('dolce-verona','carpaccio','Carpaccio','Thin-sliced beef, arugula, parmesan',16.00,14.00,12.00),
    ('dolce-verona','vitello-tonnato','Vitello Tonnato','Sliced veal, tuna sauce, capers',17.00,15.00,13.00),
    ('dolce-verona','pollo-genovese','Pollo Genoverse','Chicken, Genovese-style, herbs',20.00,17.50,15.00),

    ('warung-mini','rice-rendang','Rice Rendang','Rice, slow-cooked beef rendang',16.00,13.50,11.00),
    ('warung-mini','rice-beans-chicken','Rice Beans & Chicken','Rice, long beans, spiced chicken',16.00,13.50,11.00),
    ('warung-mini','rice-rames','Rice Rames','Rice, mixed sides, sambal',17.00,14.50,12.00),

    ('salsa-shop','chicken-tacos','Chicken Tacos','Grilled chicken tacos, salsa, lime',14.00,11.50,9.00),
    ('salsa-shop','chicken-bowl','Chicken Bowl','Rice bowl, chicken, beans, salsa',14.00,11.50,9.00),
    ('salsa-shop','real-tacos','Real Tacos','Tacos, slow-cooked meat, salsa',12.00,10.00,8.00),
    ('salsa-shop','veggie-chili-bowl','Vegetarian Chili Bowl','Chili sin carne, beans, rice',13.00,11.00,9.00),

    ('pind-punjabi','butter-chicken','Butter Chicken','Tomato cream curry, tandoori chicken',19.00,17.00,15.00),
    ('pind-punjabi','tikka-masala','Chicken Tikka Masala','Grilled chicken, spiced tomato gravy',19.00,17.00,15.00),
    ('pind-punjabi','dal-makhani','Dal Makhani','Black lentils, slow-simmered, butter',15.00,13.00,11.00),
    ('pind-punjabi','biryani','Persian Biryani','Layered basmati rice, whole spices',19.00,17.00,15.00),

    ('wan-shun','mapo-tofu','Mapo Tofu','Silken tofu, minced pork, chilli bean sauce',16.00,14.00,12.00),
    ('wan-shun','poached-pork','Poached Sliced Pork','Poached pork, garlic chilli sauce',20.00,17.50,15.00),
    ('wan-shun','stir-fried-pork','Stir Fried Pork In Batter','Battered pork, sweet and sour glaze',20.00,17.50,15.00),
    ('wan-shun','sweet-sour-chicken','Sweet Sour Chicken Set','Chicken, sweet and sour sauce, rice',19.00,16.50,14.00),

    ('mizu-bar','surf-turf-rice','Surf & Turf Fried Rice','Fried rice, beef, shrimp, garlic, vegetables',15.00,13.00,11.00),
    ('mizu-bar','b4-mix-box','B4 Mix Box','Sushi and rice box, mixed selection',15.00,13.00,11.00),
    ('mizu-bar','meat-fish-box','Meat & Fish Box','Beef and fish combination box',15.00,13.00,11.00),
    ('mizu-bar','duck-fried-rice','Duck Fried Rice','Fried rice, duck, egg, vegetables',15.00,13.00,11.00),

    ('american-spareribs','spareribs-classic','Spareribs Classic','Slow-cooked pork ribs, BBQ glaze',20.00,17.50,15.00),
    ('american-spareribs','honey-spareribs','Honey Spareribs','Pork ribs, honey glaze',21.00,18.50,16.00),
    ('american-spareribs','spareribs-hawaii','Spareribs Hawai','Pork ribs, pineapple glaze',21.00,18.50,16.00),
    ('american-spareribs','hotwings','Hotwings','Chicken wings, hot sauce',13.00,10.50,8.00),

    ('gyros-republic','pork-pita','Pork Gyros Pita','Pita, pork gyros, tzatziki, fries',12.00,10.50,9.00),
    ('gyros-republic','pork-plate','Pork Gyros Plate','Pork gyros, fries, salad, tzatziki',18.00,16.00,14.00),
    ('gyros-republic','chick-pita','Chicken Gyros Pita','Pita, chicken gyros, tzatziki, fries',13.00,11.50,10.00),
    ('gyros-republic','chick-plate','Chicken Gyros Plate','Chicken gyros, fries, salad, tzatziki',18.50,16.50,14.50),

    ('gnoccheria','pesto','Pesto','Gnocchi, basil pesto, parmesan',13.00,11.00,9.00),
    ('gnoccheria','pomodoro-combo','Pomodoro Combo','Gnocchi, tomato sauce, drink and dessert',12.00,10.00,8.00),
    ('gnoccheria','4-cheese','4 Cheese','Gnocchi, four cheese sauce',16.00,14.00,12.00),
    ('gnoccheria','sorrentina','Sorrentina','Gnocchi, tomato, mozzarella, basil',14.00,12.50,11.00),

    -- Specialty dishes only, per the owner. Menu prices from momotibet.com.
    ('momo-tibet','chicken-momo','Chicken Momo','Steamed dumplings, minced chicken, onion and spices',13.50,11.75,10.00),
    ('momo-tibet','jhol-momo','Jhol Momo','Momo in a tomato, sesame, garlic and chili broth',14.00,12.25,10.50),
    ('momo-tibet','veg-mokthuk','Veg Mokthuk','Vegetable momo in a warming broth',12.50,11.00,9.50),
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
