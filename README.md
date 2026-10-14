# Pho House — Rebuild (Germantown, MD)

A modern, mobile-first, installable website for Pho House, 13073 Wisteria Dr, Germantown, MD 20874.

## What is in this folder

- `index.html` — all pages in one file (Home, Menu, Order/Cart, Rewards, Catering, Visit)
- `styles.css` — all styling
- `app.js` — cart, ordering, rewards, catering, routing, install prompt
- `menu.js` — **the only file the owner edits for menu / prices / hours / fees**
- `manifest.webmanifest` + `sw.js` — makes the site installable as an app + works offline for the shell
- `icon-192.svg`, `icon-512.svg`, `favicon.svg` — app icons (SVG placeholders — replace with a real logo when ready)
- `OWNER-GUIDE.md` — plain-English owner instructions + 1-page sales pitch

## Preview

```bash
cd pho-house-rebuild
python3 -m http.server 8000
# open http://localhost:8000/
```

Or just double-click `index.html` (service worker + install prompt need http, so the local server is the real test).

## Prices — source of truth

**In-store menu / phohouse.net menu.** NOT DoorDash / Allmenus — those listings add a delivery markup.

Current in-store prices in this build:
- Appetizers $6.95–$9.95 · Pho $12.50+–$16.95+ (no #10 — menu skips 9 → 11) · Sides $1.95–$5.95
- Special Soups $18.50–$19.50 · Specials: Pho OxTails $26.95, Bun Cha $18.95
- Rice Plates $16.95–$20.95 · Vegetarian $6.95–$15.95+ · Banh Mi all $10.95 (Buy 5 Get 1 Free, to-go)
- Drinks $1.95–$6.95 · Desserts $4.95–$5.95

Hours: Dine-in 10:00 AM – 8:00 PM daily · Pickup / Delivery 10:00 AM – 7:50 PM daily.

## Demo vs. real

- **Demo checkout:** no real payment is taken. Orders, rewards, catering requests save in the visitor's browser (localStorage).
- **To go live:** connect Square Online / Toast / a DoorDash link for real ordering + payments. See OWNER-GUIDE.md.
- **Demo loyalty:** points + stamps live in the browser. For real cross-device loyalty, upgrade to Square Loyalty, Stamp Me or Loopy Loyalty. See OWNER-GUIDE.md.

## Still needed from the owner

- Real food photos (the site currently uses stock Unsplash photos with graceful fallback)
- Real logo file (to replace the SVG placeholder icons)
- Real ordering / payment link (Square / Toast / DoorDash)
- Confirmation of delivery radius + delivery fee
- Real guest testimonials to replace the labeled sample quotes
