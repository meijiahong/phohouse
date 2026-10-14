/* Pho House v2 — clean app logic. No popups on load. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function fmt(n) { return "$" + Number(n).toFixed(2); }
  function toast(msg) {
    var t = $("toast"); if (!t) return;
    t.textContent = msg; t.hidden = false;
    setTimeout(function () { t.hidden = true; }, 2600);
  }

  var fulfillment = load("phohouse_v2_fulfillment", "pickup");
  if (fulfillment !== "delivery") fulfillment = "pickup";
  var cart = load("phohouse_v2_cart", {});
  var member = load("phohouse_v2_member", null);
  var stamps = load("phohouse_v2_stamps", 0);
  var freeBanhMi = load("phohouse_v2_free_banhmi", 0);
  var filter = "all", activeCat = "all", query = "";
  var deferredPrompt = null;
  var installShown = false;

  function priceFor(item) {
    if (fulfillment === "delivery") return Number(item.deliveryPrice);
    return Number(item.price);
  }
  function priceLabel(item) {
    var p = priceFor(item);
    var suffix = (fulfillment === "pickup" && item.suffix) ? item.suffix : "";
    return fmt(p) + suffix;
  }

  function showView(name) {
    $$(".view").forEach(function (el) { el.hidden = (el.getAttribute("data-view-section") !== name); });
    var nav = $("mainNav"); if (nav) nav.classList.remove("open");
    var t = $("navToggle"); if (t) t.setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setFulfillment(mode) {
    fulfillment = (mode === "delivery") ? "delivery" : "pickup";
    save("phohouse_v2_fulfillment", fulfillment);
    ["fulfillPickup", "fulfillDelivery"].forEach(function (id) {
      var b = $(id); if (!b) return;
      var isActive = (b.getAttribute("data-fulfill") === fulfillment);
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    var note = $("priceNote");
    if (note) note.textContent = fulfillment === "delivery"
      ? "Showing delivery prices — delivery menu prices are higher than in-store."
      : "Showing in-store pickup prices.";
    var cl = $("cartFulfillmentLabel");
    if (cl) cl.textContent = fulfillment === "delivery" ? "Order type: Delivery" : "Order type: Pickup";
    renderMenu(); renderPopular(); renderCart();
  }

  function renderCategories() {
    var wrap = $("categoryPills"); if (!wrap || typeof MENU_CATEGORIES === "undefined") return;
    wrap.innerHTML = "";
    var all = document.createElement("button");
    all.type = "button"; all.className = "pill" + (activeCat === "all" ? " active" : "");
    all.textContent = "All dishes";
    all.addEventListener("click", function () { activeCat = "all"; renderCategories(); renderMenu(); });
    wrap.appendChild(all);
    MENU_CATEGORIES.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pill" + (activeCat === c.id ? " active" : "");
      b.textContent = c.label;
      b.addEventListener("click", function () { activeCat = c.id; renderCategories(); renderMenu(); });
      wrap.appendChild(b);
    });
  }

  function matches(item) {
    if (activeCat !== "all" && item.cat !== activeCat) return false;
    if (filter === "popular" && (item.tags || []).indexOf("popular") < 0) return false;
    if (filter === "veggie" && (item.tags || []).indexOf("veggie") < 0) return false;
    if (filter === "spicy" && (item.tags || []).indexOf("spicy") < 0) return false;
    if (query && (item.name + " " + (item.desc || "")).toLowerCase().indexOf(query) < 0) return false;
    return true;
  }

  function dishCard(item, compact) {
    var card = document.createElement("div");
    card.className = compact ? "dish-card" : "menu-row";
    var tags = (item.tags || []).filter(function (t) { return t !== "banhmi"; })
      .map(function (t) { return '<span class="tag">' + t.charAt(0).toUpperCase() + t.slice(1) + "</span>"; }).join("");
    var note = item.note ? '<div class="note">' + item.note + "</div>" : "";
    if (compact) {
      card.innerHTML = "<h3>" + item.name + "</h3><p>" + item.desc + "</p><div>" + tags + "</div>" +
        '<div class="dish-foot"><span class="price">' + priceLabel(item) + "</span></div>";
    } else {
      card.innerHTML = '<div><h3>' + item.name + "</h3><p>" + item.desc + "</p><div>" + tags + "</div>" + note + "</div>" +
        '<div style="text-align:right;flex-shrink:0"><div class="price">' + priceLabel(item) + "</div></div>";
    }
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "add-btn"; btn.textContent = "Add";
    btn.setAttribute("aria-label", "Add " + item.name + " to cart");
    btn.addEventListener("click", function () { addToCart(item.id, 1); toast(item.name + " added to cart"); });
    if (compact) card.appendChild(btn); else card.querySelector("div:last-child").appendChild(btn);
    return card;
  }

  function renderMenu() {
    var list = $("menuList"); if (!list || typeof MENU === "undefined") return;
    list.innerHTML = "";
    var items = MENU.filter(matches);
    var count = $("menuCount");
    if (count) count.textContent = items.length + " dish" + (items.length === 1 ? "" : "es") + " · " +
      (fulfillment === "delivery" ? "Delivery prices" : "Pickup prices");
    if (!items.length) { list.innerHTML = "<p>No dishes match. Try a different search or filter.</p>"; return; }
    items.forEach(function (item) { list.appendChild(dishCard(item, false)); });
  }

  function renderPopular() {
    var grid = $("popularGrid"); if (!grid || typeof MENU === "undefined") return;
    grid.innerHTML = "";
    MENU.filter(function (i) { return (i.tags || []).indexOf("popular") >= 0; }).slice(0, 6)
      .forEach(function (item) { grid.appendChild(dishCard(item, true)); });
  }

  function cartCount() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function cartSubtotal() {
    if (typeof MENU === "undefined") return 0;
    return Object.keys(cart).reduce(function (s, id) {
      var item = MENU.find(function (i) { return i.id === id; });
      return item ? s + priceFor(item) * cart[id] : s;
    }, 0);
  }
  function addToCart(id, n) { cart[id] = (cart[id] || 0) + n; save("phohouse_v2_cart", cart); renderCart(); }
  function setQty(id, n) {
    if (n <= 0) delete cart[id]; else cart[id] = n;
    save("phohouse_v2_cart", cart); renderCart();
  }

  function renderCart() {
    var count = $("cartCount"); if (count) count.textContent = cartCount();
    var itemsEl = $("cartItems"), emptyEl = $("cartEmpty"), subEl = $("cartSubtotal");
    if (!itemsEl) return;
    itemsEl.innerHTML = "";
    var ids = Object.keys(cart);
    if (emptyEl) emptyEl.hidden = ids.length > 0;
    ids.forEach(function (id) {
      var item = (typeof MENU !== "undefined") ? MENU.find(function (i) { return i.id === id; }) : null;
      if (!item) return;
      var row = document.createElement("div"); row.className = "cart-line";
      row.innerHTML = '<div><strong>' + item.name + "</strong><div class=\"muted\">" + priceLabel(item) + " each</div>" +
        '<div class="qty-controls"></div></div><div class="price">' + fmt(priceFor(item) * cart[id]) + "</div>";
      var qc = row.querySelector(".qty-controls");
      var minus = document.createElement("button"); minus.type = "button"; minus.textContent = "−";
      minus.setAttribute("aria-label", "Decrease quantity of " + item.name);
      minus.addEventListener("click", function () { setQty(id, cart[id] - 1); });
      var qty = document.createElement("span"); qty.textContent = "Qty " + cart[id];
      var plus = document.createElement("button"); plus.type = "button"; plus.textContent = "+";
      plus.setAttribute("aria-label", "Increase quantity of " + item.name);
      plus.addEventListener("click", function () { setQty(id, cart[id] + 1); });
      var rm = document.createElement("button"); rm.type = "button"; rm.className = "link-btn"; rm.textContent = "Remove";
      rm.addEventListener("click", function () { setQty(id, 0); });
      qc.appendChild(minus); qc.appendChild(qty); qc.appendChild(plus); qc.appendChild(rm);
      itemsEl.appendChild(row);
    });
    if (subEl) subEl.textContent = fmt(cartSubtotal());
  }

  function openCart() { $("cartDrawer").hidden = false; $("cartOverlay").hidden = false; renderCart(); }
  function closeCart() { $("cartDrawer").hidden = true; $("cartOverlay").hidden = true; }

  function renderMember() {
    var joinWrap = $("joinWrap"), panel = $("memberPanel");
    if (!joinWrap || !panel) return;
    if (!member) { joinWrap.hidden = false; panel.hidden = true; return; }
    joinWrap.hidden = true; panel.hidden = false;
    $("memberName").textContent = member.name;
    $("memberPoints").textContent = member.points;
    var pct = Math.min(100, Math.round(member.points / SITE.pointsForReward * 100));
    $("memberProgress").style.width = pct + "%";
    $("memberProgressLabel").textContent = member.points >= SITE.pointsForReward
      ? "You can redeem $10 off."
      : (SITE.pointsForReward - member.points) + " points to your next $10 reward.";
    var row = $("stampRow"); row.innerHTML = "";
    for (var i = 0; i < 5; i++) {
      var s = document.createElement("span"); s.className = "stamp" + (i < stamps ? " filled" : ""); s.textContent = (i + 1);
      row.appendChild(s);
    }
    $("stampNote").textContent = stamps + " of 5 stamps" + (freeBanhMi > 0 ? " · " + freeBanhMi + " free banh mi earned (to-go only — mention at pickup)." : "");
  }

  function openNowText() {
    var now = new Date(), h = now.getHours() + now.getMinutes() / 60;
    var dineOpen = h >= SITE.openHour && h < SITE.closeHour;
    var pickupOpen = h >= SITE.openHour && h < (SITE.pickupCloseHour + SITE.pickupCloseMinute / 60);
    if (dineOpen && pickupOpen) return "Open now · Dine-in until 8:00 PM · Pickup / delivery until 7:50 PM";
    if (dineOpen) return "Open now for dine-in until 8:00 PM · Pickup / delivery closed (ends 7:50 PM)";
    return "Currently closed · Opens today at 10:00 AM";
  }

  // ---- Install banner: NEVER on load. Only after scroll/time, dismissible, remembered. ----
  function hideInstallBanner(remember) {
    var b = $("installBanner"); if (b) b.hidden = true;
    if (remember) { try { localStorage.setItem("phohouse_v2_install_dismissed", "1"); } catch (e) {} }
  }
  function maybeShowInstall() {
    if (installShown) return;
    try { if (localStorage.getItem("phohouse_v2_install_dismissed") === "1") return; } catch (e) {}
    installShown = true;
    var b = $("installBanner"); if (b) b.hidden = false;
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; });
  setTimeout(maybeShowInstall, 5000);
  window.addEventListener("scroll", function () { if (window.scrollY > 400) maybeShowInstall(); }, { passive: true });

  document.addEventListener("DOMContentLoaded", function () {
    // Service worker (PWA) — guarded, relative path so GitHub Pages subpaths work.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    }
    // Nav
    $$("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = btn.getAttribute("data-view"); if (v) showView(v);
        if (btn.getAttribute("data-order") === "pickup") setFulfillment("pickup");
      });
    });
    $("navToggle").addEventListener("click", function () {
      var nav = $("mainNav"); var open = nav.classList.toggle("open");
      this.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Fulfillment
    $$("[data-fulfill]").forEach(function (btn) {
      btn.addEventListener("click", function () { setFulfillment(btn.getAttribute("data-fulfill")); });
    });

    // Search + filters
    $("searchInput").addEventListener("input", function () { query = this.value.trim().toLowerCase(); renderMenu(); });
    $$(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filter = btn.getAttribute("data-filter");
        $$(".filter-btn").forEach(function (b) { b.classList.toggle("active", b === btn); });
        renderMenu();
      });
    });

    // Cart
    $("cartBtn").addEventListener("click", openCart);
    $("cartClose").addEventListener("click", closeCart);
    $("cartOverlay").addEventListener("click", closeCart);
    $("cartClear").addEventListener("click", function () { cart = {}; save("phohouse_v2_cart", cart); renderCart(); });
    $("checkoutForm").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!cartCount()) { $("checkoutMsg").textContent = "Your cart is empty — add something first."; return; }
      var num = "PH-" + Math.floor(1000 + Math.random() * 9000);
      var subtotal = cartSubtotal();
      var banhmiQty = 0;
      Object.keys(cart).forEach(function (id) {
        var item = MENU.find(function (i) { return i.id === id; });
        if (item && (item.tags || []).indexOf("banhmi") >= 0) banhmiQty += cart[id];
      });
      if (member) {
        member.points += Math.floor(subtotal) * SITE.pointsPerDollar;
        save("phohouse_v2_member", member);
      }
      if (banhmiQty > 0) {
        stamps += banhmiQty;
        while (stamps >= 5) { stamps -= 5; freeBanhMi += 1; }
        save("phohouse_v2_stamps", stamps); save("phohouse_v2_free_banhmi", freeBanhMi);
      }
      cart = {}; save("phohouse_v2_cart", cart);
      renderCart(); renderMember();
      $("checkoutMsg").textContent = "Thank you! Order " + num + " received (" +
        (fulfillment === "delivery" ? "Delivery" : "Pickup") + ", " + fmt(subtotal) + " subtotal). " +
        "The restaurant will confirm taxes, delivery fee, and timing. A confirmation would arrive by phone in a live checkout.";
      toast("Order " + num + " placed");
      e.target.reset();
    });

    // Rewards
    $("joinForm").addEventListener("submit", function (e) {
      e.preventDefault();
      member = { name: $("joinName").value.trim(), phone: $("joinPhone").value.trim(), email: $("joinEmail").value.trim(), points: 0 };
      save("phohouse_v2_member", member);
      $("joinMsg").textContent = "Welcome, " + member.name + "! You are now a Rewards member.";
      renderMember(); toast("Joined Rewards");
      e.target.reset();
    });
    $("redeemBtn").addEventListener("click", function () {
      if (!member) return;
      if (member.points < SITE.pointsForReward) { $("redeemMsg").textContent = "You need " + (SITE.pointsForReward - member.points) + " more points to redeem."; return; }
      member.points -= SITE.pointsForReward; save("phohouse_v2_member", member);
      var code = "PHO10-" + Math.floor(1000 + Math.random() * 9000);
      $("redeemMsg").textContent = "Reward unlocked! Your $10-off code is " + code + ". Show it when you order.";
      renderMember(); toast("Reward unlocked");
    });

    // Catering
    $("cateringForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var req = {
        name: $("catName").value, email: $("catEmail").value, phone: $("catPhone").value,
        date: $("catDate").value, time: $("catTime").value, guests: $("catGuests").value,
        type: $("catType").value, location: $("catLocation").value, food: $("catFood").value,
        message: $("catMessage").value, at: new Date().toISOString()
      };
      var list = load("phohouse_v2_catering", []); list.push(req); save("phohouse_v2_catering", list);
      $("cateringMsg").textContent = "Thank you, " + req.name + "! Your catering request for " + req.date + " (" + req.guests + " guests) was saved. The restaurant will confirm availability and a custom package.";
      toast("Catering request sent");
      e.target.reset();
    });

    // Install banner buttons — all must work and dismiss
    $("installClose").addEventListener("click", function () { hideInstallBanner(true); });
    $("installDismiss").addEventListener("click", function () { hideInstallBanner(true); });
    $("installBtn").addEventListener("click", function () {
      if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; hideInstallBanner(true); }
      else {
        var ios = $("installIos"); if (ios) { ios.hidden = false; ios.scrollIntoView({ behavior: "smooth" }); }
        hideInstallBanner(true);
      }
    });
    $("footerInstall").addEventListener("click", function () {
      if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
      else { var ios = $("installIos"); if (ios) ios.hidden = false; toast("On iPhone: Share → Add to Home Screen"); }
    });

    // Esc closes cart + banner
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeCart(); hideInstallBanner(false); }
    });

    // Visit areas
    var chips = $("areasChips");
    if (chips) SITE.serviceAreas.forEach(function (a) { var s = document.createElement("span"); s.className = "chip"; s.textContent = a; chips.appendChild(s); });

    // Open-now
    var openTxt = openNowText();
    if ($("openNowHome")) $("openNowHome").textContent = openTxt;
    if ($("openNowVisit")) $("openNowVisit").textContent = openTxt;

    renderCategories(); setFulfillment(fulfillment); renderMember();
  });
})();
