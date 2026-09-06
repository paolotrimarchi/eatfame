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

   Order below is a launch-priority ranking (rating × review volume,
   with cuisine variety weighted into the first 4 so the home page
   opens on a broad, high-trust spread before "How it works").
   Re-sort by hand if the read on what converts changes.
   --------------------------------------------------------------- */
window.RESTAURANTS = [
  {
    slug: 'pasta-pasta',
    name: 'Pasta Pasta',
    blurb: 'Fresh Italian pasta, made daily',
    rating: 4.3,
    reviews: '7,000+',
    tags: ['Italian', 'Pasta'],
    dishes: [
      { id: 'pesto',      name: 'Pasta Pesto',       desc: 'Basil pesto, parmesan, pine nuts',    price: [15.00, 13.00, 11.00] },
      { id: 'lasagna',    name: 'Lasagna',           desc: 'Layered pasta, ragù, béchamel, baked', price: [19.00, 16.50, 14.00] },
      { id: 'alfredo',    name: 'Pasta Alfredo',     desc: 'Cream, butter, parmesan',              price: [16.00, 14.00, 12.00] },
      { id: 'bolognese',  name: 'Pasta Bolognese',   desc: 'Slow-cooked beef ragù, parmesan',      price: [15.00, 13.00, 11.00] },
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
      { id: 'avocado-tempura-maki', name: 'Avocado Tempura Maki', desc: 'Tempura avocado roll, rice, nori', price: [18.00, 16.00, 14.00] },
      { id: 'sake-sashimi',         name: 'Sake Sashimi',         desc: 'Fresh salmon sashimi, thick cut',  price: [12.00, 10.00,  8.00] },
      { id: 'spicy-tekka-maki',     name: 'Spicy Tekka Maki',     desc: 'Spicy tuna roll, rice, nori',      price: [16.00, 14.00, 12.00] },
      { id: 'sake-set',             name: 'Sake Set',             desc: 'Salmon nigiri and sashimi selection', price: [19.00, 16.50, 14.00] },
    ],
  },
  {
    slug: 'the-bab',
    name: 'The Bab',
    blurb: 'Korean comfort food',
    rating: 4.7,
    reviews: '2,000+',
    tags: ['Korean', 'Asian', 'BBQ'],
    dishes: [
      { id: 'bibimbab',   name: 'Bibimbab',          desc: 'Rice bowl, seasoned vegetables, egg, gochujang', price: [16.00, 14.50, 13.00] },
      { id: 'rice-roll',  name: 'Korean Rice Roll',  desc: 'Kimbap rolls, rice, vegetables, sesame',         price: [14.00, 12.50, 11.00] },
      { id: 'jap-chae',   name: 'Jap Chae',          desc: 'Sweet potato glass noodles, vegetables, soy',    price: [17.50, 16.00, 14.50] },
      { id: 'chi-bab',    name: 'Chi-Bab',           desc: 'Korean fried chicken over rice',                 price: [14.00, 12.25, 10.50] },
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
      { id: 'tikka-masala', name: 'Chicken Tikka Masala', desc: 'Grilled chicken, spiced tomato gravy', price: [20.00, 17.50, 15.00] },
      { id: 'saag-paneer',  name: 'Saag Paneer',          desc: 'Paneer, spinach, garlic, cream',       price: [19.00, 16.50, 14.00] },
      { id: 'dal-makhni',   name: 'Dal Makhni',           desc: 'Black lentils, butter, cream',         price: [19.00, 16.50, 14.00] },
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
      { id: 'lasagna',        name: 'Lasagna',         desc: 'Layered pasta, ragù, béchamel',   price: [17.00, 15.00, 13.00] },
      { id: 'carpaccio',      name: 'Carpaccio',       desc: 'Thin-sliced beef, arugula, parmesan', price: [16.00, 14.00, 12.00] },
      { id: 'vitello-tonnato',name: 'Vitello Tonnato',  desc: 'Sliced veal, tuna sauce, capers',     price: [17.00, 15.00, 13.00] },
      { id: 'pollo-genovese', name: 'Pollo Genoverse',  desc: 'Chicken, Genovese-style, herbs',      price: [20.00, 17.50, 15.00] },
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
      { id: 'rice-rendang',        name: 'Rice Rendang',         desc: 'Rice, slow-cooked beef rendang',   price: [16.00, 13.50, 11.00] },
      { id: 'rice-beans-chicken',  name: 'Rice Beans & Chicken', desc: 'Rice, long beans, spiced chicken', price: [16.00, 13.50, 11.00] },
      { id: 'rice-rames',          name: 'Rice Rames',           desc: 'Rice, mixed sides, sambal',        price: [17.00, 14.50, 12.00] },
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
      { id: 'chicken-tacos',     name: 'Chicken Tacos',           desc: 'Grilled chicken tacos, salsa, lime', price: [14.00, 11.50,  9.00] },
      { id: 'chicken-bowl',      name: 'Chicken Bowl',            desc: 'Rice bowl, chicken, beans, salsa',   price: [14.00, 11.50,  9.00] },
      { id: 'real-tacos',        name: 'Real Tacos',              desc: 'Tacos, slow-cooked meat, salsa',     price: [12.00, 10.00,  8.00] },
      { id: 'veggie-chili-bowl', name: 'Vegetarian Chili Bowl',   desc: 'Chili sin carne, beans, rice',       price: [13.00, 11.00,  9.00] },
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
      { id: 'butter-chicken', name: 'Butter Chicken',       desc: 'Tomato cream curry, tandoori chicken', price: [19.00, 17.00, 15.00] },
      { id: 'tikka-masala',   name: 'Chicken Tikka Masala', desc: 'Grilled chicken, spiced tomato gravy', price: [19.00, 17.00, 15.00] },
      { id: 'dal-makhani',    name: 'Dal Makhani',          desc: 'Black lentils, slow-simmered, butter', price: [15.00, 13.00, 11.00] },
      { id: 'biryani',        name: 'Persian Biryani',      desc: 'Layered basmati rice, whole spices',   price: [19.00, 17.00, 15.00] },
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
      { id: 'mapo-tofu',          name: 'Mapo Tofu',                 desc: 'Silken tofu, minced pork, chilli bean sauce', price: [16.00, 14.00, 12.00] },
      { id: 'poached-pork',       name: 'Poached Sliced Pork',       desc: 'Poached pork, garlic chilli sauce',           price: [20.00, 17.50, 15.00] },
      { id: 'stir-fried-pork',    name: 'Stir Fried Pork In Batter', desc: 'Battered pork, sweet and sour glaze',         price: [20.00, 17.50, 15.00] },
      { id: 'sweet-sour-chicken', name: 'Sweet Sour Chicken Set',    desc: 'Chicken, sweet and sour sauce, rice',         price: [19.00, 16.50, 14.00] },
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
      { id: 'surf-turf-rice',  name: 'Surf & Turf Fried Rice', desc: 'Fried rice, beef, shrimp, garlic, vegetables', price: [15.00, 13.00, 11.00] },
      { id: 'b4-mix-box',      name: 'B4 Mix Box',             desc: 'Sushi and rice box, mixed selection',          price: [15.00, 13.00, 11.00] },
      { id: 'meat-fish-box',   name: 'Meat & Fish Box',        desc: 'Beef and fish combination box',                price: [15.00, 13.00, 11.00] },
      { id: 'duck-fried-rice', name: 'Duck Fried Rice',        desc: 'Fried rice, duck, egg, vegetables',            price: [15.00, 13.00, 11.00] },
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
      { id: 'spareribs-classic', name: 'Spareribs Classic', desc: 'Slow-cooked pork ribs, BBQ glaze', price: [20.00, 17.50, 15.00] },
      { id: 'honey-spareribs',   name: 'Honey Spareribs',   desc: 'Pork ribs, honey glaze',           price: [21.00, 18.50, 16.00] },
      { id: 'spareribs-hawaii',  name: 'Spareribs Hawai',   desc: 'Pork ribs, pineapple glaze',       price: [21.00, 18.50, 16.00] },
      { id: 'hotwings',          name: 'Hotwings',          desc: 'Chicken wings, hot sauce',         price: [13.00, 10.50,  8.00] },
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
      { id: 'pork-pita',    name: 'Pork Gyros Pita',     desc: 'Pita, pork gyros, tzatziki, fries',    price: [12.00, 10.50,  9.00] },
      { id: 'pork-plate',   name: 'Pork Gyros Plate',    desc: 'Pork gyros, fries, salad, tzatziki',   price: [18.00, 16.00, 14.00] },
      { id: 'chick-pita',   name: 'Chicken Gyros Pita',  desc: 'Pita, chicken gyros, tzatziki, fries', price: [13.00, 11.50, 10.00] },
      { id: 'chick-plate',  name: 'Chicken Gyros Plate', desc: 'Chicken gyros, fries, salad, tzatziki',price: [18.50, 16.50, 14.50] },
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
      { id: 'pesto',          name: 'Pesto',           desc: 'Gnocchi, basil pesto, parmesan',        price: [13.00, 11.00,  9.00] },
      { id: 'pomodoro-combo', name: 'Pomodoro Combo',  desc: 'Gnocchi, tomato sauce, drink and dessert', price: [12.00, 10.00,  8.00] },
      { id: '4-cheese',       name: '4 Cheese',        desc: 'Gnocchi, four cheese sauce',            price: [16.00, 14.00, 12.00] },
      { id: 'sorrentina',     name: 'Sorrentina',      desc: 'Gnocchi, tomato, mozzarella, basil',    price: [14.00, 12.50, 11.00] },
    ],
  },
  {
    slug: 'momo-tibet',
    name: 'Momo Tibet',
    blurb: 'Tibetan kitchen, momo folded by hand',
    rating: 4.1,
    reviews: '150+',
    tags: ['Tibetan', 'Momo', 'Noodles'],
    // Specialty dishes only, per the owner. Prices are the restaurant's own
    // menu prices (momotibet.com/menu) at the 2-dish tier, stepping down
    // ~12.5% and ~25% like every other restaurant here.
    dishes: [
      { id: 'chicken-momo',      name: 'Chicken Momo',      desc: 'Steamed dumplings, minced chicken, onion and spices', price: [13.50, 11.75, 10.00] },
      { id: 'beef-momo',         name: 'Beef Momo',         desc: 'Steamed dumplings, minced beef, onion and spices',    price: [14.50, 12.75, 11.00] },
      { id: 'veg-momo',          name: 'Veg Momo',          desc: 'Steamed dumplings, vegetables, onion and spices',     price: [12.50, 11.00,  9.50] },
      { id: 'jhol-momo',         name: 'Jhol Momo',         desc: 'Momo in a tomato, sesame, garlic and chili broth',    price: [14.00, 12.25, 10.50] },
      { id: 'spicy-fried-momo',  name: 'Spicy Fried Momo',  desc: 'Pan-fried momo, garlic-chili sauce, onion, peppers',  price: [14.00, 12.25, 10.50] },
      { id: 'thenthuk',          name: 'Thenthuk',          desc: 'Hand-pulled noodle soup with beef',                  price: [14.50, 12.75, 11.00] },
      { id: 'phing-sha',         name: 'Phing Sha',         desc: 'Glass noodle and beef stew, spices, steamed rice',    price: [16.50, 14.50, 12.50] },
      { id: 'shaptak',           name: 'Shaptak',           desc: 'Spicy stir-fried beef, served with rice or tingmo',   price: [17.00, 15.00, 12.75] },
    ],
  },
];
