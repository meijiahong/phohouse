/* Pho House — Menu Data
   ============================================================
   OWNER: This is the ONLY file you need to edit to change
   the menu. Change a name, a price, or a description here
   and the whole site updates — Menu page, cart, rewards,
   catering stamps, everything.
   - price: number, no $ sign, e.g. 15.95 — the PICKUP / IN-STORE price
   - deliveryPrice: number — the DELIVERY price (delivery-app price, higher).
     The site shows price when Pickup is selected, deliveryPrice when Delivery
     is selected. Both must be present on every item.
   - suffix: "+" means "starting at — size / variant upcharge may apply"
     (used for pho, where the in-store menu shows $15.95+ etc.)
   - tags: use any of "popular" "veggie" "spicy"
   - cat: must match one of the category ids below.
   Do not rename `cat` values unless you also update index.html pills.

   DUAL PRICING: price = in-store / pickup price (source: in-store menu /
   phohouse.net). deliveryPrice = delivery-app price (source: DoorDash /
   Allmenus listings). The customer picks Pickup or Delivery and the site
   shows that price everywhere — menu, cart, checkout. Estimated delivery
   prices (confirm with owner): Pho OxTails 31.95, Bun Cha 22.50,
   Sea Salt Vietnamese Drip Coffee 7.95.
*/

const MENU_CATEGORIES = [
  { id: "appetizers", label: "Appetizers" },
  { id: "pho", label: "Pho" },
  { id: "sides", label: "Pho Sides" },
  { id: "soups", label: "Special Soups" },
  { id: "specials", label: "Specials" },
  { id: "rice", label: "Rice Plates & Noodle Bowls" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "banhmi", label: "Banh Mi" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

const MENU = [
  // ---------- APPETIZERS ----------
  { id: "app-beef-grape", name: "Beef in Grape Leaves", cat: "appetizers", price: 8.95, deliveryPrice: 10.50, desc: "Grilled seasoned beef wrapped in grape leaves, served with a light dipping sauce.", tags: ["popular"] },
  { id: "app-cha-gio", name: "Cha Gio / Crispy Rolls", cat: "appetizers", price: 6.95, deliveryPrice: 7.95, desc: "Two golden fried rolls with a crisp shell and savory filling, served with fish sauce.", tags: ["popular"], note: "2 pc" },
  { id: "app-goi-cuon", name: "Goi Cuon / Garden Rolls", cat: "appetizers", price: 6.95, deliveryPrice: 7.95, desc: "Two fresh rice-paper rolls with herbs, vermicelli and a peanut dipping sauce.", tags: ["popular"], note: "2 pc" },
  { id: "app-bo-bia", name: "Bo Bia / Happy Rolls", cat: "appetizers", price: 6.95, deliveryPrice: 7.95, desc: "Two soft rolls with a sweet-savory filling and a gentle crunch in every bite.", tags: [], note: "2 pc" },
  { id: "app-nem-nuong", name: "Nem Nuong Cuon / Pattie Rolls", cat: "appetizers", price: 6.95, deliveryPrice: 7.95, desc: "Two rolls built around grilled pork patties, herbs and a creamy dip.", tags: [], note: "2 pc" },
  { id: "app-dumplings", name: "Fried Dumplings", cat: "appetizers", price: 9.95, deliveryPrice: 11.95, desc: "Pan-crisped dumplings with a savory center and dipping sauce.", tags: ["popular"], note: "8 pc" },
  { id: "app-wings", name: "Crispy Chicken Wings", cat: "appetizers", price: 9.95, deliveryPrice: 11.95, desc: "Wings fried crisp and seasoned to share — or not.", tags: ["popular"], note: "6 pc" },
  { id: "app-goi-thit", name: "Goi Cuon Thit Heo", cat: "appetizers", price: 6.95, deliveryPrice: 7.95, desc: "Two fresh rolls with grilled pork, herbs and vermicelli.", tags: [], note: "2 pc" },
  { id: "app-goi-ga", name: "Goi Cuon Ga Nuong", cat: "appetizers", price: 6.95, deliveryPrice: 7.95, desc: "Two fresh rolls with grilled chicken, herbs and vermicelli.", tags: [], note: "2 pc" },

  // ---------- PHO ----------
  // All pho served in beef broth with rice noodles unless noted.
  // NOTE: There is NO #10 on the real in-store menu — it is intentionally skipped.
  // "+" = starting price; size / variant upcharge may apply, as shown in-store.
  { id: "pho-1", name: "#1 Dac Biet", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "The house combination — steak, brisket, flank, tendon and tripe in rich beef broth.", tags: ["popular"] },
  { id: "pho-2", name: "#2 Brisket", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Slow-simmered brisket in aromatic beef broth over rice noodles.", tags: [] },
  { id: "pho-3", name: "#3 Brisket + Flank", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Brisket and flank together — tender and hearty in every spoonful.", tags: [] },
  { id: "pho-4", name: "#4 Flank + Fat Skirt Flank", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Flank with rich fat skirt flank for a deeper, beefier bowl.", tags: [] },
  { id: "pho-5", name: "#5 Brisket, Flank + Fat Skirt", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Three cuts in one bowl — brisket, flank and fat skirt flank.", tags: [] },
  { id: "pho-6", name: "#6 Steak, Brisket, Flank + Tendon", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Steak, brisket and flank with silky tendon for extra texture.", tags: [] },
  { id: "pho-7", name: "#7 Steak, Brisket, Flank + Tripe", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Steak, brisket and flank with tripe for classic pho texture.", tags: [] },
  { id: "pho-8", name: "#8 Steak, Flank + Tendon", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Steak and flank with tendon, finished with fresh herbs.", tags: [] },
  { id: "pho-9", name: "#9 Steak, Flank + Tripe", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Steak and flank with tripe in slow-simmered broth.", tags: [] },
  // No #10 — the real menu skips from #9 to #11.
  { id: "pho-11", name: "#11 Steak + Flank", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "A clean two-cut bowl — steak and flank, nothing to distract.", tags: [] },
  { id: "pho-12", name: "#12 Steak + Brisket", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Steak and brisket — the simple classic, done well.", tags: [] },
  { id: "pho-13", name: "#13 Steak + Tendon", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Steak with soft tendon and bright herbs on top.", tags: [] },
  { id: "pho-14", name: "#14 Steak + Tripe", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Steak with tripe for diners who like the full traditional bowl.", tags: [] },
  { id: "pho-15", name: "#15 Eye Round Steak", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Thin-sliced eye-round steak, gently cooked by the hot broth.", tags: ["popular"] },
  { id: "pho-16", name: "#16 Beef Meatball", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Springy beef meatballs in classic pho broth with herbs.", tags: [] },
  { id: "pho-17", name: "#17 Chicken Pho", cat: "pho", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Chicken pho in clear, fragrant broth with rice noodles.", tags: [] },
  { id: "pho-plain", name: "Pho Plain (No Meat)", cat: "pho", price: 12.50, deliveryPrice: 14.95, suffix: "+", desc: "Beef broth and rice noodles with herbs — keep it simple, add what you like.", tags: [] },
  { id: "pho-shrimp", name: "Pho Tom (Shrimp)", cat: "pho", price: 16.50, deliveryPrice: 18.95, suffix: "+", desc: "Plump shrimp in pho broth with noodles and fresh herbs.", tags: [] },
  { id: "pho-chay", name: "Pho Chay (Veggie)", cat: "pho", price: 16.95, deliveryPrice: 18.95, suffix: "+", desc: "Vegetable broth pho with tofu and seasonal vegetables.", tags: ["veggie"] },

  // ---------- SIDES ----------
  { id: "side-noodles", name: "Extra Noodles", cat: "sides", price: 3.95, deliveryPrice: 3.95, desc: "An extra portion of rice noodles for your bowl.", tags: [] },
  { id: "side-meatballs", name: "Extra Meatballs", cat: "sides", price: 5.95, deliveryPrice: 7.14, desc: "An extra serving of beef meatballs.", tags: [] },
  { id: "side-vinegar", name: "Onion Vinegar", cat: "sides", price: 1.95, deliveryPrice: 2.34, desc: "Sharp onion vinegar to brighten any bowl.", tags: [] },
  { id: "side-rice", name: "Rice", cat: "sides", price: 2.95, deliveryPrice: 3.54, desc: "Steamed jasmine rice, simple and fluffy.", tags: [] },
  { id: "side-egg", name: "Fried Egg", cat: "sides", price: 1.95, deliveryPrice: 2.34, desc: "One fried egg, crisp at the edges.", tags: [] },

  // ---------- SPECIAL SOUPS ----------
  { id: "soup-bun-bo-hue", name: "S1 Bun Bo Hue", cat: "soups", price: 19.50, deliveryPrice: 22.95, desc: "Hue-style spicy beef noodle soup with lemongrass heat and deep broth.", tags: ["spicy", "popular"] },
  { id: "soup-hu-tieu", name: "S2 Hu Tieu Tom Thit", cat: "soups", price: 18.50, deliveryPrice: 21.95, desc: "Clear pork and shrimp noodle soup with a light, clean broth.", tags: [] },
  { id: "soup-bun-rieu", name: "S3 Bun Rieu", cat: "soups", price: 18.50, deliveryPrice: 21.95, desc: "Tomato and crab-based soup with vermicelli and fresh herbs.", tags: ["popular"] },
  { id: "soup-bo-kho", name: "S4 Bo Kho", cat: "soups", price: 18.50, deliveryPrice: 21.95, desc: "Vietnamese beef stew with warm spices, served with bread or noodles.", tags: ["popular"] },

  // ---------- SPECIALS ----------
  { id: "special-oxtail", name: "Pho OxTails", cat: "specials", price: 26.95, deliveryPrice: 31.95, desc: "Rich pho built around slow-braised oxtails — deep, hearty and limited.", tags: ["popular"] },
  { id: "special-bun-cha", name: "Bun Cha", cat: "specials", price: 18.95, deliveryPrice: 22.50, desc: "Grilled pork patties and slices in a light broth with vermicelli and herbs.", tags: [] },

  // ---------- RICE PLATES & NOODLE BOWLS ----------
  { id: "rice-g1", name: "G1 Grilled Lemongrass Chicken or Pork", cat: "rice", price: 16.95, deliveryPrice: 19.95, desc: "Lemongrass-grilled chicken or pork over jasmine rice or vermicelli with fresh toppings.", tags: ["popular"] },
  { id: "rice-g2", name: "G2 Suon Nuong (Grilled Pork Chop)", cat: "rice", price: 18.95, deliveryPrice: 22.50, desc: "A thick grilled pork chop over rice or vermicelli with pickled vegetables and fish sauce.", tags: ["popular"] },
  { id: "rice-g3", name: "G3 Suon Bi Cha (Pork Chop + Shredded Pork + Egg Cake)", cat: "rice", price: 18.95, deliveryPrice: 22.50, desc: "Grilled pork chop plus shredded pork and steamed egg cake over rice or vermicelli.", tags: [] },
  { id: "rice-g4", name: "Bo Nuong (Grilled Beef Skewers)", cat: "rice", price: 20.95, deliveryPrice: 24.95, desc: "Char-grilled beef skewers over rice or vermicelli with peanuts and herbs.", tags: [] },
  { id: "rice-g5", name: "Tom Nuong (Grilled Shrimp Skewers)", cat: "rice", price: 19.95, deliveryPrice: 23.94, desc: "Grilled shrimp skewers over rice or vermicelli with fresh, crisp toppings.", tags: [] },
  { id: "rice-g6", name: "Pho House Grilled Special", cat: "rice", price: 19.95, deliveryPrice: 23.94, desc: "The house grilled combo — a little of everything, over rice or vermicelli.", tags: ["popular"] },
  { id: "rice-g7", name: "G7 Com Ga Ro-ti (Crispy Cornish Hen)", cat: "rice", price: 20.95, deliveryPrice: 23.94, desc: "Crispy Cornish hen with savory roti-style seasoning over jasmine rice.", tags: [] },
  { id: "rice-g8", name: "G8 Bun Nem Nuong", cat: "rice", price: 17.95, deliveryPrice: 20.95, desc: "Grilled pork patties over vermicelli with herbs, peanuts and fish sauce.", tags: [] },

  // ---------- VEGETARIAN ----------
  { id: "veg-garden", name: "Veggies Garden Rolls", cat: "vegetarian", price: 6.95, deliveryPrice: 7.95, desc: "Fresh rice-paper rolls with vegetables, herbs and peanut sauce.", tags: ["veggie"] },
  { id: "veg-rolls", name: "Crispy Veggies Rolls", cat: "vegetarian", price: 6.95, deliveryPrice: 7.95, desc: "Crisp fried rolls with a seasoned vegetable filling and dipping sauce.", tags: ["veggie"] },
  { id: "veg-pho", name: "Veggies Pho", cat: "vegetarian", price: 15.95, deliveryPrice: 18.95, suffix: "+", desc: "Vegetable broth pho with tofu, vegetables and fresh herbs.", tags: ["veggie", "popular"] },

  // ---------- BANH MI — all $10.95 ----------
  { id: "banhmi-dac-biet", name: "Banh Mi Dac Biet", cat: "banhmi", price: 10.95, deliveryPrice: 12.95, desc: "The house special — layered meats on a toasted baguette with pickled vegetables and house mayo.", tags: ["popular", "banhmi"], note: "Buy 5 Get 1 Free · to-go only" },
  { id: "banhmi-thit", name: "Banh Mi Thit Nuong (Grilled Pork)", cat: "banhmi", price: 10.95, deliveryPrice: 12.95, desc: "Grilled pork on a toasted baguette with pickled carrots, cucumber and herbs.", tags: ["banhmi"], note: "Buy 5 Get 1 Free · to-go only" },
  { id: "banhmi-ga", name: "Banh Mi Ga Nuong (Grilled Chicken)", cat: "banhmi", price: 10.95, deliveryPrice: 12.95, desc: "Grilled chicken on a toasted baguette with pickled vegetables and house mayo.", tags: ["banhmi"], note: "Buy 5 Get 1 Free · to-go only" },
  { id: "banhmi-op-la", name: "Banh Mi Op La (Fried Eggs)", cat: "banhmi", price: 10.95, deliveryPrice: 12.95, desc: "Fried eggs on a toasted baguette with pickled vegetables and herbs.", tags: ["banhmi"], note: "Buy 5 Get 1 Free · to-go only" },
  { id: "banhmi-xa-xiu", name: "Banh Mi Xa Xiu (Roasted Pork)", cat: "banhmi", price: 10.95, deliveryPrice: 12.95, desc: "Roasted pork on a toasted baguette with pickled vegetables and house mayo.", tags: ["banhmi"], note: "Buy 5 Get 1 Free · to-go only" },
  { id: "banhmi-cha-lua", name: "Banh Mi Cha Lua (Pork Bologna)", cat: "banhmi", price: 10.95, deliveryPrice: 12.95, desc: "Pork bologna on a toasted baguette with pickled vegetables and herbs.", tags: ["banhmi"], note: "Buy 5 Get 1 Free · to-go only" },
  { id: "banhmi-ham", name: "Banh Mi Ham", cat: "banhmi", price: 10.95, deliveryPrice: 12.95, desc: "Ham on a toasted baguette with pickled vegetables and house mayo.", tags: ["banhmi"], note: "Buy 5 Get 1 Free · to-go only" },
  { id: "banhmi-tofu", name: "Banh Mi Tofu", cat: "banhmi", price: 10.95, deliveryPrice: 12.95, desc: "Tofu on a toasted baguette with pickled vegetables, herbs and house mayo.", tags: ["veggie", "banhmi"], note: "Buy 5 Get 1 Free · to-go only" },

  // ---------- DRINKS ----------
  { id: "drink-bubble", name: "Bubble Drinks", cat: "drinks", price: 6.50, deliveryPrice: 7.50, desc: "Blended bubble drinks — strawberry, mango, jackfruit, avocado, coconut or watermelon.", tags: ["popular"] },
  { id: "drink-sea-salt", name: "Sea Salt Vietnamese Drip Coffee", cat: "drinks", price: 6.95, deliveryPrice: 7.95, desc: "Slow-drip Vietnamese coffee topped with a light sea-salt cream.", tags: ["popular"] },
  { id: "drink-thai-tea", name: "Thai Tea", cat: "drinks", price: 4.95, deliveryPrice: 5.95, desc: "Sweet, creamy Thai tea served iced.", tags: ["popular"] },
  { id: "drink-cafe-sua", name: "Vietnamese Coffee (Cafe Sua)", cat: "drinks", price: 4.95, deliveryPrice: 5.95, desc: "Strong Vietnamese coffee with condensed milk, served iced.", tags: ["popular"] },
  { id: "drink-coconut", name: "Coconut Juice", cat: "drinks", price: 4.95, deliveryPrice: 5.94, desc: "Chilled coconut juice, naturally sweet.", tags: [] },
  { id: "drink-limeade", name: "Limeade", cat: "drinks", price: 4.95, deliveryPrice: 5.94, desc: "Fresh limeade — tart, sweet and cold.", tags: [] },
  { id: "drink-soda", name: "Soda", cat: "drinks", price: 1.95, deliveryPrice: 2.95, desc: "Canned soda, served cold.", tags: [] },
  { id: "drink-jasmine", name: "Jasmine Tea", cat: "drinks", price: 3.50, deliveryPrice: 3.54, desc: "Fragrant jasmine tea, hot or iced.", tags: [] },

  // ---------- DESSERTS ----------
  { id: "dessert-che-chuoi", name: "Che Chuoi", cat: "desserts", price: 4.95, deliveryPrice: 5.95, desc: "Warm banana dessert with coconut milk and tapioca.", tags: [] },
  { id: "dessert-che-dau", name: "Che Dau", cat: "desserts", price: 4.95, deliveryPrice: 5.95, desc: "Sweet bean dessert with coconut milk, served chilled.", tags: [] },
  { id: "dessert-flan", name: "Flan", cat: "desserts", price: 5.95, deliveryPrice: 6.95, desc: "Silky caramel flan, chilled and smooth.", tags: ["popular"] },
];

/* Site settings — OWNER: edit these to change hours, fees, contact info. */
const SITE = {
  name: "Pho House",
  address: "13073 Wisteria Dr, Germantown, MD 20874",
  phoneDisplay: "(301) 916-5730",
  phoneTel: "+13019165730",
  email: "phohousegermantown@gmail.com",
  hoursLabel: "Dine-in every day · 10:00 AM – 8:00 PM",
  hoursDineIn: "10:00 AM – 8:00 PM daily",
  hoursPickup: "10:00 AM – 7:50 PM daily",
  openHour: 10, // 10 AM — dine-in opens
  closeHour: 20, // 8 PM — dine-in closes
  pickupCloseHour: 19, // 7 PM hour
  pickupCloseMinute: 50, // 7:50 PM — last pickup / delivery order
  taxRate: 0.06, // Montgomery County 6%
  deliveryFee: 3.99,
  freeDeliveryOver: 50,
  pointsPerDollar: 1,
  pointsForReward: 100,
  rewardValue: 10,
  birthdayReward: 5,
  banhMiStampsNeeded: 5, // Buy 5 Get 1 Free = 5 stamps, 6th free
  serviceAreas: ["Germantown", "Gaithersburg", "Clarksburg", "Montgomery Village", "Boyds", "Clopper", "Middlebrook"],
  mapsEmbed: "https://www.google.com/maps?q=13073+Wisteria+Dr,+Germantown,+MD+20874&output=embed",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=13073+Wisteria+Dr+Germantown+MD+20874",
};
