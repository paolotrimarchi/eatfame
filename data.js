/* ---------------------------------------------------------------
   Restaurants and dishes.

   price: [at 2 dishes, at 3 dishes, at 4+ dishes]
   The 4+ figure is the low end of your range, the 2-dish figure is
   the high end, 3 dishes sits in the middle. Ordering more makes
   every dish in the basket cheaper.

   Images: drop files at the paths below and they appear automatically.
   Missing images fall back to a neutral tile, nothing looks broken.
     img/restaurants/<slug>.jpg   1200x800, ~120KB WebP or JPG
     img/dishes/<slug>/<dish>.jpg  800x800 square

   Order below is sorted on observed demand: restaurant_viewed events in
   PostHog over the 30 days to 6 Sept 2026, each restaurant read against
   the slot it held at the time. Position bias is steep, so a card at
   slot 12 earning 5 views outranks one at slot 2 earning 9.

   Counts behind this order: Pasta Pasta 31, The Bab 19, Otaru Sushi 9,
   Pind Punjabi 7, Wan Shun 7, Dolce Verona 6, Swagat 6, Gyros Republic 5,
   Salsa Shop 5, Mizu Bar 3, Warung Mini 3, American Spareribs 3.

   Two entries are placed against the raw counts on purpose:
     - The Bab leads despite Pasta Pasta's higher count. 4.7 vs 4.3, and
       it drew 19 from third position while Pasta Pasta had the top slot
       working for it. Deliberate call, not a sorting error.
     - Mizu Bar sits at 7 on a 4.8 rating, the highest on the site. It has
       only ever been shown at slot 10, so its 3 views are untested rather
       than weak.

   Total sample was 115 events pre-launch, so everything below the top
   three sits inside noise. Re-sort once real traffic lands.
   --------------------------------------------------------------- */
window.RESTAURANTS = [
  {
    slug: 'the-bab',
    name: 'The Bab',
    blurb: 'Korean comfort food',
    rating: 4.7,
    reviews: '2,000+',
    tags: ['Korean', 'Asian', 'BBQ'],
    dishes: [
      { id: 'bibimbab',                name: 'Bibimbab',                          desc: 'Rice bowl, seasoned vegetables, egg, gochujang',      price: [16.50, 14.50, 12.50] },
      { id: 'rice-roll',  name: 'Korean Rice Roll',  desc: 'Kimbap rolls, rice, vegetables, sesame',         price: [14.00, 12.25, 10.50] },
      { id: 'jap-chae',   name: 'Jap Chae',          desc: 'Sweet potato glass noodles, vegetables, soy',    price: [17.50, 15.25, 13.25] },
      { id: 'chi-bab',                 name: 'Chi-Bab',                           desc: 'Korean fried chicken over rice',                      price: [13.90, 12.25, 10.50] },
      /* added from Uber Eats (Oud West) */
      { id: 'classic-fried-chicken',   name: 'Korean Fried Chicken',              desc: 'Slightly spicy sauce, topped with peanuts',           price: [18.50, 16.25, 14.00] },
      { id: 'kimchi-bokkeumbab',       name: 'Kimchi Bokkeumbab',                 desc: 'Kimchi fried rice, fried egg, sesame',                price: [17.50, 15.25, 13.25] },
    ],
  },
  {
    slug: 'pasta-pasta',
    name: 'Pasta Pasta',
    blurb: 'Fresh Italian pasta, made daily',
    rating: 4.3,
    reviews: '7,000+',
    tags: ['Italian', 'Pasta'],
    dishes: [
      { id: 'pesto',      name: 'Pasta Pesto',       desc: 'Basil pesto, parmesan, pine nuts',    price: [15.00, 13.25, 11.25] },
      { id: 'lasagna',    name: 'Lasagna',           desc: 'Layered pasta, ragù, béchamel, baked', price: [19.00, 16.75, 14.25] },
      { id: 'alfredo',    name: 'Pasta Alfredo',     desc: 'Cream, butter, parmesan',              price: [16.00, 14.00, 12.00] },
      { id: 'bolognese',  name: 'Pasta Bolognese',   desc: 'Slow-cooked beef ragù, parmesan',      price: [15.00, 13.25, 11.25] },
      /* added from Uber Eats (Ferdinand Bolstraat) */
      { id: 'carbonara',               name: 'Spaghetti Carbonara',               desc: 'Bacon, egg, parmesan',                                price: [18.50, 16.25, 14.00] },
      { id: 'tagliatelle-salmone',     name: 'Tagliatelle Salmone',               desc: 'Smoked salmon, white wine cream, cherry tomato',      price: [19.00, 16.75, 14.25] },
      { id: 'pomodoro',                name: 'Pasta Pomodoro',                    desc: 'Tomato sauce, garlic, olive oil',                     price: [13.95, 12.25, 10.50] },
    ],
  },
  {
    slug: 'pind-punjabi',
    name: 'Pind Punjabi',
    blurb: 'North Indian, Punjabi kitchen',
    rating: 4.6,
    reviews: '900+',
    tags: ['Indian', 'Chicken'],
    dishes: [
      { id: 'butter-chicken',          name: 'Butter Chicken',                    desc: 'Tomato cream curry, tandoori chicken',                price: [21.00, 18.50, 15.75] },
      { id: 'tikka-masala',            name: 'Chicken Tikka Masala',              desc: 'Grilled chicken, spiced tomato gravy',                price: [20.00, 17.50, 15.00] },
      { id: 'dal-makhani',             name: 'Dal Makhni',                        desc: 'Black lentils, slow-simmered, butter',                price: [17.50, 15.25, 13.25] },
      /* added from own menu PDF (May 2026) */
      { id: 'rogan-josh',              name: 'Rogan Josh',                        desc: 'Lamb, rich spice mix, tomato, onion',                 price: [22.00, 19.25, 16.50] },
      { id: 'chicken-korma',           name: 'Chicken Korma',                     desc: 'Mild creamy sauce, aromatic spices, cashew',          price: [20.00, 17.50, 15.00] },
      { id: 'saag-paneer',             name: 'Saag Paneer',                       desc: 'Indian cheese, creamy spinach, herbs',                price: [17.50, 15.25, 13.25] },
    ],
  },
  {
    slug: 'otaru-sushi',
    name: 'Otaru Sushi Restaurant',
    blurb: 'Japanese sushi, cut fresh to order',
    rating: 4.7,
    reviews: '5,000+',
    tags: ['Sushi', 'Japanese', 'Asian'],
    dishes: [
      { id: 'avocado-tempura-maki',    name: 'Avocado Tempura Maki',              desc: 'Deep-fried prawns, avocado, cucumber, fish roe',      price: [15.00, 13.25, 11.25] },
      { id: 'sake-sashimi',         name: 'Sake Sashimi',         desc: 'Fresh salmon sashimi, thick cut',  price: [12.00, 10.50, 9.00] },
      { id: 'spicy-tekka-maki',        name: 'Spicy Tekka Maki',                  desc: 'Tuna, spring onion, cucumber, spicy sauce',           price: [13.50, 11.75, 10.25] },
      { id: 'sake-set',             name: 'Sake Set',             desc: 'Salmon nigiri and sashimi selection', price: [19.00, 16.75, 14.25] },
      /* added from otaru.nl (own site) */
      { id: 'rainbow-maki',            name: 'Rainbow Maki',                      desc: 'Crabstick, avocado, cucumber, roe, assorted fish',    price: [14.50, 12.75, 11.00] },
      { id: 'dragon-maki',             name: 'Dragon Maki',                       desc: 'Breaded prawns, eel, cucumber, fish roe',             price: [18.50, 16.25, 14.00] },
      { id: 'golden-maki',             name: 'Golden Maki',                       desc: 'Breaded prawns, avocado, omelet, fish roe',           price: [14.50, 12.75, 11.00] },
      { id: 'otaru-maki',              name: 'Otaru Maki',                        desc: 'Scallop, crabstick, cucumber, fish roe',              price: [17.00, 15.00, 12.75] },
      { id: 'spider-maki',             name: 'Spider Maki',                       desc: 'Deep-fried soft-shell crab, avocado, fish roe',       price: [16.50, 14.50, 12.50] },
      { id: 'unagi-maki-speciaal',     name: 'Unagi Maki Speciaal',               desc: 'Grilled eel, avocado, salmon skin, sauce',            price: [15.00, 13.25, 11.25] },
      { id: 'terriyaki-chicken-maki',  name: 'Terriyaki Chicken Maki',            desc: 'Teriyaki chicken, cucumber, teriyaki sauce',          price: [13.50, 11.75, 10.25] },
      { id: 'rainbow-dragon-maki',     name: 'Rainbow Dragon Maki',               desc: 'Breaded prawns, avocado, cucumber, assorted fish',    price: [16.50, 14.50, 12.50] },
      { id: 'spicy-scallop-maki',      name: 'Spicy Scallop Maki',                desc: 'Scallop, spring onion, cucumber, spicy sauce',        price: [14.50, 12.75, 11.00] },
      { id: 'philadelphia-maki',       name: 'Philadelphia Maki',                 desc: 'Salmon, cream cheese, avocado',                       price: [13.50, 11.75, 10.25] },
      { id: 'sea-king-maki',           name: 'Sea King Maki',                     desc: 'Salmon, tuna, cucumber, omelet, ikura, roe',          price: [16.50, 14.50, 12.50] },
    ],
  },
  {
    slug: 'wan-shun',
    name: 'Wan Shun Restaurant',
    blurb: 'Chinese kitchen, rice bowls and stir-fry',
    rating: 4.7,
    reviews: '1,500+',
    tags: ['Chinese', 'Rice bowls'],
    dishes: [
      { id: 'mapo-tofu',               name: 'Mapo Tofu',                         desc: 'Silken tofu, minced pork, chilli bean sauce',         price: [20.00, 17.50, 15.00] },
      { id: 'stir-fried-pork',         name: 'Stir-fried Pork Slices in Batter',  desc: 'Battered pork slices, wok-tossed',                    price: [23.00, 20.25, 17.25] },
      /* added from own pick-up ordering site */
      { id: 'kung-pao-chicken',        name: 'Kung Pao Chicken',                  desc: 'Leek, peanuts, sweet-sour, lightly spicy',            price: [23.00, 20.25, 17.25] },
      { id: 'yuxiang-shredded-pork',   name: 'Yuxiang Shredded Pork',             desc: 'Coriander, carrot, black fungus, sweet-sour',         price: [23.00, 20.25, 17.25] },
      { id: 'muxu-pork',               name: 'Muxu Pork',                         desc: 'Sliced pork, egg, black fungus',                      price: [23.00, 20.25, 17.25] },
      { id: 'sweet-sour-pork-pineapple', name: 'Sweet and Sour Pork with Pineapple', desc: 'Crisp pork, pineapple, sweet-sour sauce',             price: [23.00, 20.25, 17.25] },
      { id: 'crispy-sweet-sour-pork',  name: 'Crispy Sweet and Sour Pork',        desc: 'Battered pork, sugar and vinegar sauce',              price: [25.00, 22.00, 18.75] },
      { id: 'beef-cumin',              name: 'Beef Tenderloin with Cumin',        desc: 'Beef strips, toasted cumin, high-heat wok',           price: [28.00, 24.50, 21.00] },
      { id: 'poached-beef-chili-oil',  name: 'Poached Sliced Beef in Chili Oil',  desc: 'Sliced beef, Sichuan hot chili oil',                  price: [28.00, 24.50, 21.00] },
      { id: 'lamb-with-leek',          name: 'Stir-fried Lamb with Leek',         desc: 'Lamb strips, fresh leek, wok-seared',                 price: [29.00, 25.50, 21.75] },
      { id: 'shrimp-chili-sauce',      name: 'Stir-fried Shrimp in Chili Sauce',  desc: 'Shrimp, kung pao chili sauce',                        price: [28.00, 24.50, 21.00] },
      { id: 'spicy-squid',             name: 'Spicy Squid',                       desc: 'Squid rings, chili, aromatic spice',                  price: [28.00, 24.50, 21.00] },
      { id: 'three-delicacies',        name: 'Three Delicacies',                  desc: 'Sauteed potato, green pepper, eggplant',              price: [18.00, 15.75, 13.50] },
      { id: 'tofu-skin-paprika',       name: 'Tofu Skin with Paprika',            desc: 'Yuba, paprika, light and textured',                   price: [18.00, 15.75, 13.50] },
    ],
  },
  {
    slug: 'gyros-republic',
    name: 'Gyros Republic',
    blurb: 'Greek street food',
    rating: 4.4,
    reviews: '270+',
    tags: ['Greek', 'Mediterranean'],
    dishes: [
      { id: 'pork-pita',               name: 'Pork Gyros Pita',                   desc: 'Pita, pork gyros, tzatziki, fries',                   price: [13.50, 11.75, 10.25] },
      { id: 'pork-plate',              name: 'Pork Gyros Plate',                  desc: 'Pork gyros, fries, salad, tzatziki',                  price: [19.00, 16.75, 14.25] },
      { id: 'chick-pita',              name: 'Chicken Gyros Pita',                desc: 'Pita, chicken gyros, tzatziki, fries',                price: [13.50, 11.75, 10.25] },
      { id: 'chick-plate',             name: 'Chicken Gyros Plate',               desc: 'Chicken gyros, fries, salad, tzatziki',               price: [19.00, 16.75, 14.25] },
      /* added from own microsite */
      { id: 'chicken-souvlaki-wrap',   name: 'Chicken Souvlaki Wrap',             desc: 'Pita, chicken skewer, tomato, onion, fries',          price: [13.50, 11.75, 10.25] },
      { id: 'pork-gyros-skepasti',     name: 'Pork Gyros Skepasti',               desc: 'Double pita, graviera, salad, fries',                 price: [19.50, 17.00, 14.75] },
      { id: 'chicken-gyros-kapsalon',  name: 'Chicken Gyros Kapsalon',            desc: 'Fries, graviera, garlic sauce, sriracha',             price: [13.50, 11.75, 10.25] },
    ],
  },
  {
    slug: 'mizu-bar',
    name: 'Mizu Bar',
    blurb: 'Asian fusion, sushi and rice boxes',
    rating: 4.8,
    reviews: '1,000+',
    tags: ['Japanese', 'Asian fusion', 'Sushi'],
    dishes: [
      { id: 'surf-turf-rice',          name: 'Surf & Turf Fried Rice',            desc: 'Fried rice, beef, shrimp, garlic, vegetables',        price: [14.50, 12.75, 11.00] },
      { id: 'b4-mix-box',              name: 'Mix Box',                           desc: 'Sushi box, mixed selection',                          price: [13.90, 12.25, 10.50] },
      { id: 'meat-fish-box',           name: 'Meat & Fish Box',                   desc: 'Beef and fish combination box',                       price: [14.50, 12.75, 11.00] },
      { id: 'duck-fried-rice',         name: 'Duck Fried Rice',                   desc: 'Fried rice, duck, egg, vegetables',                   price: [14.50, 12.75, 11.00] },
      /* added from mizubar.nl (own site) */
      { id: 'deluxe-box',              name: 'Deluxe Box',                        desc: '18 pieces: california, ebi crunch, unagi, rainbow',   price: [21.50, 18.75, 16.25] },
      { id: 'vega-vis-box',            name: 'Vega & Fish Box',                   desc: '13 pieces: cheese salmon, rock shrimp, mango salmon', price: [17.50, 15.25, 13.25] },
      { id: 'vis-box',                 name: 'Fish Box',                          desc: '12 pieces: california, spicy tuna, ebi crunch',       price: [12.90, 11.25, 9.75] },
      { id: 'vega-box',                name: 'Vega Box',                          desc: '12 pieces: kappa, avocado, avocado nigiri, crispy',   price: [12.90, 11.25, 9.75] },
      { id: 'poke-bowl',               name: 'Poke Bowl',                         desc: 'Rice bowl, build your own',                           price: [15.90, 14.00, 12.00] },
    ],
  },
  {
    slug: 'dolce-verona',
    name: 'Dolce Verona',
    blurb: 'Italian trattoria, pasta and pizza',
    rating: 4.7,
    reviews: '4,000+',
    tags: ['Italian', 'Pizza', 'Pasta'],
    dishes: [
      { id: 'lasagna',                 name: 'Lasagna',                           desc: 'Layered pasta, ragù, béchamel',                       price: [18.50, 16.25, 14.00] },
      { id: 'carpaccio',               name: 'Carpaccio',                         desc: 'Thin-sliced beef, arugula, parmesan',                 price: [16.50, 14.50, 12.50] },
      { id: 'vitello-tonnato',         name: 'Vitello Tonnato',                   desc: 'Sliced veal, tuna sauce, capers',                     price: [16.50, 14.50, 12.50] },
      { id: 'pollo-genovese',          name: 'Pollo Genovese',                    desc: 'Chicken, Genovese-style, herbs',                      price: [21.95, 19.25, 16.50] },
      /* added from TheFork, cross-checked against own PDF */
      { id: 'carbonara',               name: 'Spaghetti alla Carbonara',          desc: 'Bacon, egg yolk, cream, parmesan',                    price: [18.50, 16.25, 14.00] },
      { id: 'tagliatelle-tartufo',     name: 'Tagliatelle Tartufo',               desc: 'Mushrooms, truffle sauce',                            price: [20.50, 18.00, 15.50] },
      { id: 'pizza-margherita',        name: 'Pizza Margherita',                  desc: 'Tomato sauce, mozzarella',                            price: [13.50, 11.75, 10.25] },
    ],
  },
  {
    slug: 'swagat',
    name: 'Swagat Restaurant',
    blurb: 'North Indian comfort food',
    rating: 4.6,
    reviews: '2,000+',
    tags: ['Indian', 'Comfort food'],
    dishes: [
      { id: 'tikka-masala',            name: 'Chicken Tikka Masala',              desc: 'Grilled chicken, spiced tomato gravy',                price: [25.50, 22.25, 19.25] },
      { id: 'saag-paneer',             name: 'Saag Paneer',                       desc: 'Paneer, spinach, garlic, cream',                      price: [23.50, 20.50, 17.75] },
      /* added from swagat-amsterdam.nl (own microsite) */
      { id: 'butter-chicken',          name: 'Butter Chicken',                    desc: 'Tandoori chicken, creamy tomato curry',               price: [25.50, 22.25, 19.25] },
      { id: 'lamb-rogan-josh',         name: 'Lamb Rogan Josh',                   desc: 'Kashmiri lamb, browned onion, yoghurt, ginger',       price: [26.50, 23.25, 20.00] },
      { id: 'chana-masala',            name: 'Chana Masala',                      desc: 'Chickpeas, medium-spiced curry sauce',                price: [20.50, 18.00, 15.50] },
    ],
  },
  {
    slug: 'salsa-shop',
    name: 'Salsa Shop',
    blurb: 'Mexican tacos and bowls',
    rating: 4.3,
    reviews: '2,000+',
    tags: ['Mexican', 'Tex Mex', 'Halal'],
    dishes: [
      { id: 'chicken-tacos',           name: 'Chicken Tacos',                     desc: 'Grilled chicken tacos, salsa, lime',                  price: [14.45, 12.75, 10.75] },
      { id: 'chicken-bowl',            name: 'Chicken Bowl',                      desc: 'Rice bowl, chicken, beans, salsa',                    price: [14.45, 12.75, 10.75] },
      { id: 'real-tacos',              name: 'Real Tacos',                        desc: 'Tacos, slow-cooked meat, salsa',                      price: [12.95, 11.25, 9.75] },
      { id: 'veggie-chili-bowl',       name: 'Vegetarian Chili Bowl',             desc: 'Chili sin carne, beans, rice',                        price: [13.95, 12.25, 10.50] },
      /* added from Uber Eats (matches existing rows) */
      { id: 'chicken-burrito',         name: 'Chicken Burrito',                   desc: 'Grilled chicken, rice, black beans, corn, salsa',     price: [14.45, 12.75, 10.75] },
      { id: 'chicken-salad',           name: 'Chicken Salad',                     desc: 'Romaine, grilled chicken, beans, corn, pico',         price: [14.45, 12.75, 10.75] },
      { id: 'summer-salad',            name: 'Summer Salad',                      desc: 'Grilled chicken, lettuce, pico, rajas con pina',      price: [12.95, 11.25, 9.75] },
    ],
  },
  {
    slug: 'warung-mini',
    name: 'Warung Mini',
    blurb: 'Indonesian warung, rice plates',
    rating: 4.6,
    reviews: '3,000+',
    tags: ['Indonesian', 'Sandwich'],
    dishes: [
      { id: 'rice-rendang',            name: 'Rice Rendang',                      desc: 'Rice, slow-cooked beef rendang',                      price: [17.85, 15.50, 13.50] },
      { id: 'rice-beans-chicken',      name: 'Rice Beans & Chicken',              desc: 'Rice, long beans, spiced chicken',                    price: [16.27, 14.25, 12.25] },
      { id: 'rice-rames',              name: 'Rice Rames',                        desc: 'Rice, mixed sides, sambal',                           price: [17.32, 15.25, 13.00] },
      /* added from own microsite (Van Woustraat) */
      { id: 'gado-gado',               name: 'Gado Gado',                         desc: 'Rice, cabbage, beansprouts, tofu, peanut sauce',      price: [14.70, 12.75, 11.00] },
      { id: 'javaanse-moksie',         name: 'Javaanse Moksie',                   desc: 'Rice, bami, tempeh, beef in coconut, chicken, egg',   price: [19.42, 17.00, 14.50] },
      { id: 'nasi-sate',               name: 'Nasi Sate',                         desc: 'Nasi with chicken satay',                             price: [15.75, 13.75, 11.75] },
    ],
  },
  {
    slug: 'american-spareribs',
    name: 'American Spareribs',
    blurb: 'Slow-cooked ribs and wings',
    rating: 4.4,
    reviews: '1,000+',
    tags: ['American', 'Wings'],
    dishes: [
      { id: 'spareribs-classic',       name: 'Spareribs Classic',                 desc: 'Slow-cooked pork ribs, BBQ glaze',                    price: [21.00, 18.50, 15.75] },
      { id: 'honey-spareribs',   name: 'Honey Spareribs',   desc: 'Pork ribs, honey glaze',           price: [21.00, 18.50, 15.75] },
      { id: 'spareribs-hawaii',  name: 'Spareribs Hawai',   desc: 'Pork ribs, pineapple glaze',       price: [21.00, 18.50, 15.75] },
      { id: 'hotwings',                name: 'Hotwings',                          desc: '9 pieces, chicken wings, hot sauce',                  price: [7.50, 6.50, 5.75] },
      /* added from Uber Eats */
      { id: 'spareribs-barbecue',      name: 'Spareribs Barbecue',                desc: 'Pork ribs, barbecue glaze',                           price: [21.00, 18.50, 15.75] },
      { id: 'spareribs-sweet-chili',   name: 'Spareribs Sweet Chili',             desc: 'Pork ribs, sweet chilli glaze, mild heat',            price: [21.00, 18.50, 15.75] },
      { id: 'spareribs-piri-piri',     name: 'Spareribs Piri Piri',               desc: 'Pork ribs, American pepper marinade',                 price: [21.00, 18.50, 15.75] },
    ],
  },
  {
    slug: 'gnoccheria',
    name: 'Gnoccheria',
    blurb: 'Fresh gnocchi, made daily',
    rating: 4.7,
    reviews: '330+',
    tags: ['Italian', 'Pasta', 'Vegetarian'],
    dishes: [
      { id: 'pesto',                   name: 'Pesto',                             desc: 'Gnocchi, basil pesto, parmesan',                      price: [15.00, 13.25, 11.25] },
      { id: 'pomodoro-combo',          name: 'Pomodoro',                          desc: 'Tomato sauce and basil',                              price: [12.00, 10.50, 9.00] },
      { id: '4-cheese',                name: '4 Cheese',                          desc: 'Gnocchi, four cheese sauce',                          price: [18.00, 15.75, 13.50] },
      { id: 'sorrentina',              name: 'Sorrentina',                        desc: 'Gnocchi, tomato, mozzarella, basil',                  price: [16.00, 14.00, 12.00] },
      /* added from Uber Eats */
      { id: 'bolognese',               name: 'Bolognese',                         desc: 'Tomato, beef and pork mince, basil, parmigiano',      price: [20.00, 17.50, 15.00] },
      { id: 'burrata-datterini',       name: 'Burrata and Datterini',             desc: 'Cherry tomatoes, parmesan, basil, burrata',           price: [18.00, 15.75, 13.50] },
      { id: 'norma',                   name: 'Norma',                             desc: 'Aubergine, tomato, basil, ricotta salata',            price: [19.00, 16.75, 14.25] },
    ],
  },
  {
    slug: 'momo-tibet',
    name: 'Momo Tibet',
    blurb: 'Tibetan kitchen, momo folded by hand',
    rating: 4.1,
    reviews: '150+',
    tags: ['Tibetan', 'Noodles'],
    // Specialty dishes only, per the owner. Prices are the restaurant's own
    // menu prices (momotibet.com/menu) at the 2-dish tier, stepping down
    // ~12.5% and ~25% like every other restaurant here.
    // Only dishes that have their own photo on momotibet.com are listed --
    // the beef and veg steamed momo were dropped because their site has one
    // shared momo photo, and Veg Mokthuk covers the vegetarian slot instead.
    dishes: [
      { id: 'chicken-momo',      name: 'Chicken Momo',      desc: 'Steamed dumplings, minced chicken, onion and spices', price: [13.50, 11.75, 10.25] },
      { id: 'jhol-momo',         name: 'Jhol Momo',         desc: 'Momo in a tomato, sesame, garlic and chili broth',    price: [14.00, 12.25, 10.50] },
      { id: 'veg-mokthuk',       name: 'Veg Mokthuk',       desc: 'Vegetable momo in a warming broth',                  price: [12.50, 11.00,  9.50] },
      { id: 'spicy-fried-momo',  name: 'Spicy Fried Momo',  desc: 'Pan-fried momo, garlic-chili sauce, onion, peppers',  price: [14.00, 12.25, 10.50] },
      { id: 'thenthuk',          name: 'Thenthuk',          desc: 'Hand-pulled noodle soup with beef',                  price: [14.50, 12.75, 11.00] },
      { id: 'phing-sha',         name: 'Phing Sha',         desc: 'Glass noodle and beef stew, spices, steamed rice',    price: [16.50, 14.50, 12.50] },
      { id: 'shaptak',           name: 'Shaptak',           desc: 'Spicy stir-fried beef, served with rice or tingmo',   price: [17.00, 15.00, 12.75] },
    ],
  },
];
