# Pho House — Owner Guide (v2)

This site replaces the current Owner.com site with a site you fully own. No platform fees, full control of menu and prices.

## Change a price or dish
Open `menu.js`. Find the dish. Change `price` (pickup / in-store) or `deliveryPrice` (delivery). Save. The menu, cart, and checkout update everywhere.

- Pickup prices = your in-store menu.
- Delivery prices = delivery-app prices (higher).
- `suffix: "+"` on pho means "starting at" — keep it on pickup pho prices.
- Three delivery prices are estimates — please confirm: Pho OxTails ($31.95), Bun Cha ($22.50), Sea Salt Coffee ($7.95).

## Change hours, phone, or email
Open `menu.js`, edit the `SITE` block at the bottom (hours, phone, email, address, service areas).

## Rewards
The site has a simple demo rewards system: 1 point per $1, 100 points = $10 off, plus a Banh Mi stamp card (Buy 5 Get 1 Free, to-go only — your real offer). Rates are labeled "demo default" in the site. Change them in `SITE` in `menu.js` (pointsPerDollar, pointsForReward, rewardValue). Demo storage is in the visitor's browser only — for real multi-device loyalty, connect Square Loyalty, Stamp Me, or Loopy Loyalty later.

## Put it on GitHub Pages (free)
1. GitHub → new repo, e.g. `pho-house` → **Public** (private repos do not serve Pages on the free plan).
2. Upload all files in this folder.
3. Settings → Pages → Source: Deploy from a branch → Branch `main`, Folder `/ (root)` → Save.
4. Your site appears at `https://<username>.github.io/pho-house/`. Point your own domain at it later if you want.

## Connect real ordering
Checkout is currently a demo: it collects name, phone, time, and notes and shows an order number, but does not charge or send the order. To go live, link the Order buttons to Square Online, Toast, or your delivery partner, or add a phone-order flow. Taxes and delivery fee are intentionally not hardcoded — the restaurant confirms them.

## What to supply to finish it
Real food photos, real logo file, real ordering/payment link, confirmation of delivery fee + radius, and any real guest testimonials.
