# Pho House — Website Rebuild (v2, clean)

Modern, clean, mobile-friendly rebuild of phohouse.net. No backend, no build step.

## Preview
```bash
cd pho-house-rebuild-v2
python3 -m http.server 8000
# open http://localhost:8000/
```
Service worker / install needs http — double-clicking `index.html` alone is not the real test.

## What is in here
- `index.html` — Home, Menu, Rewards, Catering, Our Story, Visit
- `styles.css` — layout + calm palette
- `app.js` — cart, checkout, rewards, catering, install banner
- `menu.js` — the ONLY file for menu edits: `price` (pickup) + `deliveryPrice` (delivery) per item
- `manifest.webmanifest`, `sw.js` — installable PWA, offline shell
- `OWNER-GUIDE.md` — plain-English owner guide

## Key behaviors
- No popup on load. The install banner appears only after scrolling or 5 seconds, and X / Not now both dismiss it for good.
- Pickup shows in-store prices; Delivery shows delivery prices. One toggle re-prices menu + cart + checkout.
- Checkout is a demo: it shows subtotal only and says taxes + delivery fee are confirmed by the restaurant.
- Rewards rates are labeled demo defaults (1 pt per $1, 100 pts = $10). Banh Mi Buy 5 Get 1 Free (to-go only) is the real offer from the restaurant.

## Source of truth
Real info only, from phohouse.net (in-store menu): address, phone, email, hours, service areas, catering form fields, Banh Mi offer, rewards concept. No invented catering prices, delivery fees, tiers, or birthday rewards.
