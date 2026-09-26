/* ===========================================================
   Sera — data
   Dish ids match the existing library, so image paths resolve
   against IMG_BASE without renaming anything.
     <IMG_BASE>/dishes/<restaurant-slug>/<dish-id>.jpg
   This folder is self-contained: sera/img/ holds only the 14
   images these menus use, so the folder can be deployed as a
   site root on its own. Nothing here reaches outside sera/.
   =========================================================== */

window.SERA = {

  IMG_BASE: 'img',

  user: { name: 'Paolo Trimarchi', initials: 'PT' },

  /* Where a run currently exists, by 4-digit postcode. */
  coverage: [
    { pc4: '1072', area: 'Oud-Zuid',     live: true  },
    { pc4: '1073', area: 'De Pijp',      live: true  },
    { pc4: '1074', area: 'De Pijp Zuid', live: true  },
    { pc4: '1016', area: 'Centrum West', live: false },
    { pc4: '1053', area: 'Oud-West',     live: false },
    { pc4: '1018', area: 'Oost',         live: false }
  ],

  /* Addresses this account has used before. */
  savedAddresses: [
    { street: 'Govert Flinckstraat 42', pc: '1073 AB', label: 'Home' }
  ],

  /* Order cutoff, 24h local time */
  cutoffHour: 15,

  days: [
    {
      key: 'tonight',
      label: 'Tonight',
      kitchens: [
        {
          slug: 'pasta-pasta', name: 'Pasta Pasta',
          cuisine: 'Italian', rating: '4.3', reviews: '7,000+',
          dishes: [
            { id:'lasagna',   name:'Lasagna',             desc:'Slow ragù, béchamel, baked at four', price:15.50 },
            { id:'carbonara', name:'Spaghetti Carbonara', desc:'Guanciale, egg yolk, pecorino',      price:15.00 },
            { id:'pomodoro',  name:'Pasta Pomodoro',      desc:'Tomato, garlic, basil',              price:13.00 }
          ]
        },
        {
          slug: 'the-bab', name: 'The Bab',
          cuisine: 'Korean', rating: '4.7', reviews: '2,000+',
          dishes: [
            { id:'bibimbab',              name:'Bibimbab',             desc:'Rice, seasoned vegetables, egg', price:13.50 },
            { id:'classic-fried-chicken', name:'Korean Fried Chicken', desc:'Light chilli glaze, peanuts',    price:15.50 }
          ]
        }
      ]
    },
    {
      key: 'tomorrow',
      label: 'Tomorrow',
      kitchens: [
        {
          slug: 'gyros-republic', name: 'Gyros Republic',
          cuisine: 'Greek', rating: '4.4', reviews: '270+',
          dishes: [
            { id:'pork-plate',             name:'Pork Gyros Plate',      desc:'Fries, salad, tzatziki',      price:14.50 },
            { id:'chicken-souvlaki-wrap',  name:'Chicken Souvlaki Wrap', desc:'Tomato, onion, fries',        price:13.00 }
          ]
        },
        {
          slug: 'otaru-sushi', name: 'Otaru Sushi',
          cuisine: 'Japanese', rating: '4.7', reviews: '5,000+',
          dishes: [
            { id:'rainbow-maki',     name:'Rainbow Maki',     desc:'Crab, avocado, assorted fish', price:15.00 },
            { id:'sake-set',         name:'Sake Set',         desc:'Salmon nigiri and sashimi',    price:15.50 },
            { id:'spicy-tekka-maki', name:'Spicy Tekka Maki', desc:'Tuna, spring onion, cucumber', price:13.50 }
          ]
        }
      ]
    }
  ],

  week: [
    { day:'Tonight', a:'Pasta Pasta',    b:'The Bab',       expected:false },
    { day:'Fri',     a:'Gyros Republic', b:'Otaru Sushi',   expected:false },
    { day:'Sat',     a:'Pind Punjabi',   b:'Dolce Verona',  expected:false },
    { day:'Sun',     a:'Abyssinia',      b:'Mizu Bar',      expected:true  },
    { day:'Mon',     a:'Wan Shun',       b:'Gnoccheria',    expected:true  },
    { day:'Tue',     a:'Salsa Shop',     b:'Momo Tibet',    expected:true  },
    { day:'Wed',     a:'Warung Mini',    b:'Thai Deum',     expected:true  }
  ],

  /* delta is per dish. Quiet windows are cheaper because one
     courier covers more doors in the same run. */
  slots: [
    { label:'18:00 \u2013 18:30', delta:-1.50, note:'Quiet half hour', fill:null, open:true  },
    { label:'18:30 \u2013 19:00', delta:0,     note:'Standard',        fill:null, open:true  },
    { label:'19:00 \u2013 19:30', delta:0,     note:'Busiest',         fill:0.91, open:true  },
    { label:'19:30 \u2013 20:00', delta:0,     note:'Standard',        fill:0.64, open:true  },
    { label:'20:00 \u2013 20:30', delta:-1.50, note:'Quiet half hour', fill:null, open:true  },
    { label:'20:30 \u2013 21:00', delta:-1.50, note:'Needs 6 more orders nearby', fill:0.58, open:false }
  ]
};
