# Pho House Website — Owner Guide (Plain English)

You own this website completely. No monthly platform fee, no commission on orders you take through it, and you control the menu, prices, hours and rewards. This guide shows how.

## Your current site vs. this rebuild

Your current site at phohouse.net is powered by **Owner.com (Owner platform)**. It already has a basic menu, a basic rewards / app QR, and a catering form — and that platform charges ongoing fees and controls how the site looks and works.

This rebuild is a **replacement / upgrade you fully own**:

| | Owner.com site (today) | This rebuild |
|---|---|---|
| Who owns it | Owner platform | You — plain files, no lock-in |
| Monthly platform fee | Yes (Owner platform) | $0 — hosting can be free (see Deploy) |
| Menu / price changes | Through Owner dashboard | Edit one file (`menu.js`) in 2 minutes |
| Loyalty | Basic Owner rewards | Points + Banh Mi stamps + tiers + birthday treat, built in |
| Ordering | Owner checkout | Demo checkout now → connect Square / Toast / DoorDash when ready |
| App | Owner app QR | Installable PWA — visitors add it to their home screen, no app-store fee |
| Catering | Basic form | Full request form + email backup + price guidance |

You keep your domain (phohouse.net) — you just point it at this site when you are ready.

> **Price source of truth:** `price` = in-store menu / phohouse.net menu. `deliveryPrice` = DoorDash / Allmenus delivery listings. The customer picks Pickup or Delivery and the site shows that price everywhere — see Section 1A. Three delivery prices are estimated (OxTails, Bun Cha, Sea Salt Coffee) — confirm them with the owner.

---

## 1. How to change any price, name or description

Open **`menu.js`** in any text editor (Notepad, TextEdit, VS Code).

Find the dish, for example:

```js
{ id: "pho-1", name: "#1 Dac Biet", cat: "pho", price: 15.95, suffix: "+", desc: "...", tags: ["popular"] },
```

- Change `price: 15.95` to the new pickup price (number only, no `$`). Change `deliveryPrice: 18.95` to the new delivery price. See Section 1A for dual pricing.
- Change `name:` or `desc:` to rename / rewrite it.
- `suffix: "+"` means "starting at" — keep it for pho. Remove it for fixed-price dishes.
- `tags:` — add `"popular"`, `"veggie"` or `"spicy"` to make it show up in filters.

Save the file, re-upload it (see Deploy). The Menu page, cart, search and rewards all update automatically.

To **add a dish**, copy a whole line, paste it, and give it a new `id:` (for example `"app-new-roll"`). To **remove a dish**, delete its whole line.

**Pho numbering note:** there is NO #10 on the real menu — it goes #9 → #11. Do not add a #10.

## 1A. Dual pricing — Pickup vs. Delivery

Every dish in `menu.js` has **two** prices:

```js
{ id: "pho-1", name: "#1 Dac Biet", price: 15.95, deliveryPrice: 18.95, suffix: "+", ... },
```

- `price` = **Pickup / in-store** price (source: in-store menu / phohouse.net).
- `deliveryPrice` = **Delivery** price (source: DoorDash / Allmenus delivery listings, which add a markup).

The customer picks **Pickup — In-store prices** or **Delivery — Delivery prices** at the top of the Menu page or the Order page. That one choice is the single source of truth: it re-prices **everything** — menu cards, cart lines, checkout subtotal/tax/tip/total, and rewards points (points are earned on the actual charged total). The checkout Pickup/Delivery radios are wired to the same state, so they can never disagree.

- Pho pickup prices keep `suffix: "+"` ("starting at"). Delivery prices are flat — no "+" is shown on Delivery.
- To change a price, edit `price` and/or `deliveryPrice` for that dish. To make delivery the same as pickup, set them equal.
- **Estimated delivery prices — confirm with the owner before launch:** Pho OxTails `deliveryPrice: 31.95`, Bun Cha `22.50`, Sea Salt Vietnamese Drip Coffee `7.95`. These three were not on the delivery listings, so they use an estimated markup from the in-store price.

## 2. How to change hours, phone, fees, delivery

Also in **`menu.js`**, at the bottom, in the `SITE` block:

```js
phoneDisplay: "(301) 916-5730",
email: "phohousegermantown@gmail.com",
openHour: 10,          // dine-in opens 10 AM
closeHour: 20,          // dine-in closes 8 PM
pickupCloseHour: 19,   // pickup closes 7 PM hour
pickupCloseMinute: 50, // pickup closes 7:50 PM
taxRate: 0.06,         // Montgomery County 6%
deliveryFee: 3.99,
freeDeliveryOver: 50,  // free delivery over $50
```

- **Hours:** Dine-in 10:00 AM – 8:00 PM daily. Pickup / Delivery 10:00 AM – 7:50 PM daily. Change the numbers above, and also update the hours table text in `index.html` (search for "7:50 PM") so the two match.
- **Delivery fee / free threshold:** change `deliveryFee` / `freeDeliveryOver`.
- **Tax:** change `taxRate` if the county rate changes.

## 3. How to deploy free (pick one)

**Option A — Netlify Drop (easiest, 2 minutes):**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. You get a live link (e.g. `pho-house-xyz.netlify.app`). Connect your domain `phohouse.net` in Netlify → Domain settings.

**Option B — GitHub Pages (free, keeps version history):**
1. Create a new public repo, upload this folder.
2. Repo → Settings → Pages → Source: Deploy from a branch → Branch `main`, folder `/ (root)` → Save.
3. Your site is live at `https://<username>.github.io/<repo>/` within minutes. Point `phohouse.net` to it with a CNAME.

**Option C — Tiiny Host:**
1. Zip this folder, upload at https://tiiny.host/
2. You get a live link instantly. Good for showing the owner a demo.

After any edit, re-upload / re-deploy the same way. Browsers may cache the old version for a few minutes — the service worker version in `sw.js` (`pho-house-v1`) can be bumped to `v2`, `v3`, etc. to force a refresh.

## 4. How to connect real payments / ordering

This site ships with a **demo checkout** — it saves orders on the customer's device and does NOT charge a card. That is intentional: it lets you demo the full flow before you pay for anything. To take real money, pick one:

**Square Online (best if you already use Square in-store):**
- Turn on Square Online ordering, copy your Square ordering link, and replace the "Place Order" button in `index.html` to link to it — or embed the Square checkout.
- For loyalty, turn on **Square Loyalty** and link it from the Rewards page. Square Loyalty replaces the demo points/stamps with real, register-synced loyalty.

**Toast (best if you already use Toast):**
- Same idea: use your Toast online-ordering link as the checkout destination.

**DoorDash / Uber Eats (simplest, but commission):**
- Add a prominent "Order on DoorDash" button linking to your DoorDash store page. Keep in-store ordering (phone / Square) as the no-commission option, and note that delivery-app prices may be higher.

**Phone ordering always works:** the site has click-to-call `(301) 916-5730` everywhere.

## 5. How loyalty works — and its limits

**Demo loyalty (built in, free):**
- Join with name + phone + email + birthday → stored in the visitor's browser (localStorage).
- Earn **1 point per $1**. **100 points = $10 off.** Redeem creates a coupon code like `PHO10-1234`.
- **Banh Mi stamp card:** 1 stamp per Banh Mi ordered. **Buy 5 Get 1 Free** — the 6th is auto-applied at checkout.
- **Birthday:** $5 off treat on the birthday date.
- **Tiers:** Pho Fan (0–249), Pho Lover (250–599), Pho VIP (600+).
- **Receipt flow:** ate in-store without ordering online? Enter the receipt total to earn points.
- **Member card:** shows a decorative QR-like pattern + member number. It is NOT a real encoded QR — it is a visual card the owner can replace with a real loyalty QR later.

**Limit (important):** demo loyalty lives in one browser on one phone. If the customer clears browser data or switches phones, points do not follow them. That is fine for a demo and for single-device regulars — but for real, register-synced loyalty, upgrade:

- **Square Loyalty** — if you use Square, this is the cleanest upgrade. Points sync between website, register and phone.
- **Stamp Me / Loopy Loyalty** — stamp-card apps that replace the digital Banh Mi card with a scannable card.

The demo is designed so the upgrade is a swap, not a rebuild: the Rewards page layout, tiers and stamp logic stay the same.

## 6. How customers install it as an app

No app store needed.

- **Android / Chrome:** visit the site → tap **Install App** (or the browser's Install prompt) → the site adds to the home screen and opens full-screen.
- **iPhone / Safari:** visit the site → tap **Share** → **Add to Home Screen** → **Add**. The site explains this in the Install sheet.
- **Offline:** the app shell (menu, pages) loads even with spotty signal; ordering needs internet.

## 7. What to replace before launch

- [ ] Real food photos — replace the Unsplash photo URLs in `index.html` with your own dishes (pho, banh mi, rolls, coffee).
- [ ] Real logo — replace `icon-192.svg` / `icon-512.svg` / `favicon.svg` with your logo.
- [ ] Real ordering link — Square / Toast / DoorDash (Section 4).
- [ ] Real testimonials — the three quotes on Home are labeled "Sample quote" — replace with real guest quotes (with permission).
- [ ] Confirm delivery radius + fee with your delivery setup.

---

## 1-Page Sales Pitch — Show This to the Owner

**Pho House — Your Website, Fully Yours**

You already have a site on Owner.com — it works, but you pay platform fees and you don't fully control it. This rebuild gives you the same essentials plus the tools that bring customers back — and you own every file.

**What's included:**
- Modern mobile-first website + installable app (no app-store fee)
- Full menu with search, filters, vegetarian / spicy / popular tags, and a "Build your pho" guide
- Online ordering for pickup / delivery (demo checkout → connect Square / Toast / DoorDash when ready)
- **Rewards that retain customers:** 1 point per $1, $10 off at 100 points, digital Banh Mi Buy 5 Get 1 Free stamps, $5 birthday treat, 3 tiers
- Catering request form with $14–$22/person guidance + email backup
- Visit page with live "Open now" hours, map, service areas, FAQ
- In-store pricing (not delivery-app markup), hours split for dine-in vs. pickup/delivery — **plus dual pricing:** Pickup shows in-store prices, Delivery shows delivery prices, and one switch re-prices the whole site

**What it replaces:**
- Owner.com monthly fees + Owner-controlled menu / loyalty
- Paper stamp cards that get lost
- Customers forgetting you exist between visits — the app sits on their home screen

**Why it retains customers:**
- Every order earns points → reason to come back
- Banh Mi stamps → reason to finish the card
- Birthday treat → reason to return that week
- Home-screen app → one tap to reorder, no searching

**What you control:** every price, dish, hour and fee in one file (`menu.js`) — no developer needed for day-to-day changes.

**Cost to run:** $0 hosting on Netlify / GitHub Pages / Tiiny (domain renewal only) + your existing payment provider (Square / Toast) when you connect real ordering.
