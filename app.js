/* Pho House — app logic. All data lives in menu.js. All state in localStorage. */
(function(){
  "use strict";
  const $ = (s, el) => (el||document).querySelector(s);
  const $$ = (s, el) => Array.from((el||document).querySelectorAll(s));
  const fmt = (n) => "$" + Number(n||0).toFixed(2);
  // Fulfillment mode is the SINGLE source of truth for pricing:
  // "pickup" -> item.price (in-store), "delivery" -> item.deliveryPrice.
  // Shared by the Menu selector, the Cart selector, and the checkout
  // order-type radios; changing any one updates all of them.
  let fulfillmentMode = "pickup";
  try { const saved = JSON.parse(localStorage.getItem("phohouse_fulfillment")); if (saved === "pickup" || saved === "delivery") fulfillmentMode = saved; } catch {}
  const currentPrice = (item) => fulfillmentMode === "delivery" ? (item.deliveryPrice != null ? item.deliveryPrice : item.price) : item.price;
  // Delivery prices are flat (no "+" suffix); pickup pho keeps its "+" suffix.
  const priceLabel = (item) => fmt(currentPrice(item)) + (fulfillmentMode === "pickup" ? (item.suffix || "") : "");
  const priceBannerText = () => fulfillmentMode === "delivery"
    ? "Showing delivery prices — delivery menu prices are higher than in-store."
    : "Showing in-store pickup prices.";
  function renderFulfillmentUI(){
    // Sync every fulfillment radio group + the checkout order-type radios + banners.
    document.querySelectorAll('input[data-fulfillment]').forEach(r => { r.checked = (r.value === fulfillmentMode); });
    const orderRadio = document.querySelector('input[name="orderType"][value="' + fulfillmentMode + '"]');
    if (orderRadio) orderRadio.checked = true;
    const df = document.getElementById("deliveryFields");
    if (df) df.hidden = fulfillmentMode !== "delivery";
    document.querySelectorAll(".price-banner").forEach(el => { el.textContent = priceBannerText(); });
  }
  function setFulfillment(mode){
    if (mode !== "pickup" && mode !== "delivery") return;
    if (mode === fulfillmentMode) { renderFulfillmentUI(); return; }
    fulfillmentMode = mode;
    try { localStorage.setItem("phohouse_fulfillment", JSON.stringify(mode)); } catch {}
    renderFulfillmentUI(); renderMenu(); renderPopular(); renderCartDrawer(); renderCartPage(); renderSummary();
    toast(mode === "delivery" ? "Switched to Delivery — showing delivery prices." : "Switched to Pickup — showing in-store prices.");
  }
  const itemById = (id) => MENU.find(m => m.id===id);

  function toast(msg){ const t=$("#toast"); if(!t) return; t.textContent=msg; t.hidden=false; clearTimeout(t._h); t._h=setTimeout(()=>t.hidden=true, 2600); }

  /* ---------- Router ---------- */
  const VIEWS = ["home","menu","cart","rewards","catering","visit"];
  function route(){
    let h = (location.hash||"#home").replace("#","").split("?")[0];
    if(!VIEWS.includes(h)) h="home";
    $$(".view").forEach(v=>v.classList.toggle("active", v.id==="view-"+h));
    $$(".nav-link").forEach(a=>a.classList.toggle("active", a.dataset.nav===h));
    window.scrollTo({top:0, behavior:"instant"});
    if(h==="cart") renderCartPage();
    if(h==="rewards") renderRewards();
    // close mobile nav
    const mn=$("#mobileNav"); if(mn) mn.hidden=true;
    const mm=$("#mobileMenuBtn"); if(mm) mm.setAttribute("aria-expanded","false");
  }
  window.addEventListener("hashchange", route);
  document.addEventListener("click", (e)=>{
    const link = e.target.closest("[data-nav]");
    if(link){
      const cat = link.getAttribute("data-cat");
      if(cat){ state.category = cat; renderPills(); renderMenu(); }
    }
    const mob = e.target.closest("#mobileMenuBtn");
    if(mob){
      const mn=$("#mobileNav"); const open = mn.hidden; mn.hidden=!open; mob.setAttribute("aria-expanded", String(open));
    }
  });

  /* ---------- State ---------- */
  const state = { category:"all", filter:"all", query:"" };
  function load(key, fallback){ try{ const v=JSON.parse(localStorage.getItem(key)); return v==null?fallback:v; }catch{ return fallback; } }
  function save(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch{} }
  let cart = load("phohouse_cart", []); // [{id, qty, note}]
  let orders = load("phohouse_orders", []);
  let catering = load("phohouse_catering", []);
  let member = load("phohouse_member", null);
  let members = load("phohouse_members", {}); // phone -> profile

  /* ---------- Open-now logic ---------- */
  function openStatus(){
    const now=new Date(); const mins=now.getHours()*60+now.getMinutes();
    const dineOpen = mins>=SITE.openHour*60 && mins < SITE.closeHour*60;
    const pickupOpen = mins>=SITE.openHour*60 && mins < (SITE.pickupCloseHour*60+SITE.pickupCloseMinute);
    return { dineOpen, pickupOpen, now };
  }
  function renderHours(){
    const {dineOpen, pickupOpen} = openStatus();
    const badge=$("#openNowBadge"); if(badge){ badge.textContent = dineOpen ? "Open now — Dine-in until 8:00 PM · Pickup / Delivery until 7:50 PM" : "Closed right now — Opens 10:00 AM"; badge.classList.toggle("closed", !dineOpen); }
    const homeBadge=$("#openNowBadgeHome"); if(homeBadge){ homeBadge.textContent = pickupOpen ? "Open now · Pickup / Delivery until 7:50 PM" : "Opens 10:00 AM"; }
  }

  /* ---------- Menu rendering ---------- */
  function renderPills(){
    const wrap=$("#categoryPills"); if(!wrap) return;
    const all = [{id:"all",label:"All"}].concat(MENU_CATEGORIES);
    wrap.innerHTML = all.map(c=>`<button class="pill ${state.category===c.id?"active":""}" data-cat="${c.id}" role="tab" aria-selected="${state.category===c.id}">${c.label}</button>`).join("");
    $$(".pill", wrap).forEach(b=>b.addEventListener("click", ()=>{ state.category=b.dataset.cat; renderPills(); renderMenu(); }));
  }
  function filteredMenu(){
    const q=(state.query||"").toLowerCase().trim();
    return MENU.filter(item=>{
      if(state.category!=="all" && item.cat!==state.category) return false;
      if(state.filter==="popular" && !item.tags.includes("popular")) return false;
      if(state.filter==="veggie" && !item.tags.includes("veggie")) return false;
      if(state.filter==="spicy" && !item.tags.includes("spicy")) return false;
      if(state.filter==="under15" && currentPrice(item)>=15) return false;
      if(q && !(item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q))) return false;
      return true;
    });
  }
  function cartQty(id){ const e=cart.find(c=>c.id===id); return e?e.qty:0; }
  function tagHtml(item){ return item.tags.map(t=>`<span class="tag ${t}">${t}</span>`).join(""); }
  function cardHtml(item){
    const qty=cartQty(item.id);
    return `<article class="menu-card" data-id="${item.id}">
      <h3>${item.name} ${item.note?`<span class="muted small">· ${item.note}</span>`:""}</h3>
      <p>${item.desc}</p>
      <div class="tags">${tagHtml(item)}${item.note && !item.note.includes("Buy 5")?`<span class="tag">${item.note}</span>`:""}</div>
      <div class="card-foot"><span class="price">${priceLabel(item)}</span>
      <div class="qty" role="group" aria-label="Quantity for ${item.name}">
        <button type="button" data-dec="${item.id}" aria-label="Remove one ${item.name}">−</button>
        <strong aria-live="polite">${qty}</strong>
        <button type="button" data-add="${item.id}" aria-label="Add ${item.name} to cart">+</button>
      </div></div>
      <button type="button" class="btn btn-outline btn-sm" data-add="${item.id}">Add to Order</button>
    </article>`;
  }
  function renderMenu(){
    const grid=$("#menuGrid"); if(!grid) return;
    const list=filteredMenu();
    grid.innerHTML=list.map(cardHtml).join("");
    const empty=$("#menuEmpty"); if(empty) empty.hidden=list.length!==0;
    const helper=$("#phoHelper"); if(helper){ helper.style.display = (state.category==="all"||state.category==="pho") && !state.query && state.filter==="all" ? "block":"none"; }
  }
  function renderPopular(){
    const grid=$("#popularGrid"); if(!grid) return;
    const pops=MENU.filter(m=>m.tags.includes("popular")).slice(0,3);
    grid.innerHTML=pops.map(cardHtml).join("");
  }
  // Menu grid clicks (delegated)
  document.addEventListener("click", (e)=>{
    const add=e.target.closest("[data-add]"); const dec=e.target.closest("[data-dec]");
    if(add){ addToCart(add.dataset.add, 1); return; }
    if(dec){ addToCart(dec.dataset.dec, -1); return; }
  });
  const searchEl=$("#menuSearch");
  if(searchEl) searchEl.addEventListener("input", ()=>{ state.query=searchEl.value; renderMenu(); });
  $$(".filter-btn").forEach(b=>b.addEventListener("click", ()=>{
    $$(".filter-btn").forEach(x=>x.classList.remove("active")); b.classList.add("active");
    state.filter=b.dataset.filter; renderMenu();
  }));

  /* ---------- Cart ---------- */
  function saveCart(){ save("phohouse_cart", cart); updateCartBadge(); renderCartDrawer(); }
  function addToCart(id, delta){
    const idx=cart.findIndex(c=>c.id===id);
    if(idx>=0){ cart[idx].qty+=delta; if(cart[idx].qty<=0) cart.splice(idx,1); }
    else if(delta>0){ cart.push({id, qty:delta, note:""}); }
    saveCart(); renderMenu(); renderPopular(); renderCartPage(); renderSummary();
    if(delta>0){ const it=itemById(id); if(it) toast(`${it.name} added to cart`); }
  }
  function updateCartBadge(){ const n=cart.reduce((s,c)=>s+c.qty,0); const el=$("#cartCount"); if(el) el.textContent=n; }
  // Cart lines carry the EFFECTIVE price for the current fulfillment mode,
  // so every total re-prices when the mode switches. The original
  // in-store price is kept as basePrice for reference only.
  function cartLines(){ return cart.map(c=>{ const it=itemById(c.id); if(!it) return null; return { ...it, price: currentPrice(it), basePrice: it.price, qty:c.qty, note:c.note||"" }; }).filter(l=>l && l.name); }

  function renderCartDrawer(){
    const wrap=$("#cartItems"); const empty=$("#cartDrawerEmpty"); const sum=$("#cartDrawerSummary");
    if(!wrap) return;
    if(!cart.length){ wrap.innerHTML=""; if(empty) empty.hidden=false; if(sum) sum.innerHTML=""; return; }
    if(empty) empty.hidden=true;
    wrap.innerHTML=cartLines().map(l=>`<div class="drawer-item"><strong>${l.name}</strong><div class="muted small">${priceLabel(l)} each</div><div class="qty" style="margin-top:8px"><button data-dec="${l.id}">−</button><strong>${l.qty}</strong><button data-add="${l.id}">+</button><span style="margin-left:auto;font-weight:800">${fmt(l.price*l.qty)}</span></div><label class="small">Item note <input data-note="${l.id}" value="${(l.note||"").replace(/"/g,"&quot;")}" placeholder="No onions, extra spicy…"></label></div>`).join("");
    const sub=cartLines().reduce((s,l)=>s+l.price*l.qty,0);
    if(sum) sum.innerHTML=`<div class="summary-row"><span>Subtotal</span><strong>${fmt(sub)}</strong></div><p class="muted small">Tax, delivery & tip calculated at checkout.</p>`;
    $$("[data-note]", wrap).forEach(inp=>inp.addEventListener("change", ()=>{ const e=cart.find(c=>c.id===inp.dataset.note); if(e){ e.note=inp.value; save("phohouse_cart",cart); renderCartPage(); } }));
  }
  function renderCartPage(){
    const wrap=$("#cartPageItems"); const empty=$("#cartPageEmpty"); const form=$("#checkoutForm");
    if(!wrap) return;
    if(!cart.length){ wrap.innerHTML=""; if(empty) empty.hidden=false; if(form) form.style.display="none"; renderSummary(); return; }
    if(empty) empty.hidden=true; if(form) form.style.display="block";
    wrap.innerHTML=cartLines().map(l=>`<div class="drawer-item"><strong>${l.name}</strong> · ${priceLabel(l)}<div class="qty" style="margin-top:8px"><button data-dec="${l.id}">−</button><strong>${l.qty}</strong><button data-add="${l.id}">+</button><span style="margin-left:auto;font-weight:800">${fmt(l.price*l.qty)}</span></div><label class="small">Item note <input data-note="${l.id}" value="${(l.note||"").replace(/"/g,"&quot;")}" placeholder="No onions, extra spicy…"></label></div>`).join("");
    $$("[data-note]", wrap).forEach(inp=>inp.addEventListener("change", ()=>{ const e=cart.find(c=>c.id===inp.dataset.note); if(e){ e.note=inp.value; save("phohouse_cart",cart); renderCartDrawer(); } }));
    renderSummary();
  }
  function orderType(){ return fulfillmentMode; }
  function calcTotals(){
    const lines=cartLines();
    const sub=lines.reduce((s,l)=>s+l.price*l.qty,0);
    const isDel=orderType()==="delivery";
    let delivery=0;
    if(isDel){ delivery = sub>=SITE.freeDeliveryOver ? 0 : SITE.deliveryFee; }
    const tax=sub*SITE.taxRate;
    let tipPct=parseFloat($("#tipSelect")?.value||"0.15"); let tip=0;
    if($("#tipSelect")?.value==="custom"){ tip=parseFloat($("#customTip")?.value||"0")||0; } else { tip=sub*tipPct; }
    let rewardDisc=0, banhMiDisc=0;
    if($("#applyReward")?.checked && member && member.points>=SITE.pointsForReward) rewardDisc=SITE.rewardValue;
    if($("#applyBanhMiFree")?.checked && member && (member.banhMiStamps||0)>=SITE.banhMiStampsNeeded){
      const bms=lines.filter(l=>l.tags && l.tags.includes("banhmi"));
      if(bms.length) banhMiDisc=Math.min(...bms.map(b=>b.price));
    }
    const total=Math.max(0, sub+tax+delivery+tip-rewardDisc-banhMiDisc);
    return { sub, tax, delivery, tip, rewardDisc, banhMiDisc, total, isDel };
  }
  function renderSummary(){
    const el=$("#orderSummary"); if(!el) return;
    const t=calcTotals();
    el.innerHTML=`
      <div class="summary-row"><span>Subtotal</span><strong>${fmt(t.sub)}</strong></div>
      <div class="summary-row"><span>Tax (6%)</span><span>${fmt(t.tax)}</span></div>
      <div class="summary-row"><span>Delivery ${t.isDel? (t.delivery===0?"(free over $50)":"") : "(pickup)"}</span><span>${fmt(t.delivery)}</span></div>
      <div class="summary-row"><span>Tip</span><span>${fmt(t.tip)}</span></div>
      ${t.rewardDisc?`<div class="summary-row"><span>Rewards $10 off</span><span>−${fmt(t.rewardDisc)}</span></div>`:""}
      ${t.banhMiDisc?`<div class="summary-row"><span>Free Banh Mi (6th stamp)</span><span>−${fmt(t.banhMiDisc)}</span></div>`:""}
      <div class="summary-row total"><span>Total</span><span>${fmt(t.total)}</span></div>
      <p class="muted small">Delivery fee $3.99 · Free over $50 (before tax). Owner can change fees in menu.js.</p>`;
    // Rewards checkbox states
    const ar=$("#applyReward"), rh=$("#rewardHint");
    if(ar){ const can=!!(member && member.points>=100); ar.disabled=!can; if(rh) rh.textContent= member ? `${member.points} points — ${can?"ready to apply":"need 100"}` : "join Rewards to earn"; }
    const ab=$("#applyBanhMiFree"), bh=$("#banhMiHint");
    if(ab){ const can=!!(member && (member.banhMiStamps||0)>=5); ab.disabled=!can; if(bh) bh.textContent= member ? `${member.banhMiStamps||0} / 5 stamps — ${can?"ready to apply":"earn 5 stamps"}` : "join Rewards to earn stamps"; }
  }
  // Checkout controls
  document.addEventListener("change", (e)=>{
    if(e.target.matches && e.target.matches('input[data-fulfillment]')){ setFulfillment(e.target.value); return; }
    if(e.target.name==="orderType"){ setFulfillment(e.target.value); return; }
    if(e.target.id==="tipSelect"){ const cr=$("#customTipRow"); if(cr) cr.hidden = e.target.value!=="custom"; renderSummary(); }
    if(e.target.id==="customTip") renderSummary();
    if(e.target.id==="applyReward" || e.target.id==="applyBanhMiFree") renderSummary();
  });
  const checkoutForm=$("#checkoutForm");
  if(checkoutForm) checkoutForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(!cart.length){ toast("Your cart is empty."); return; }
    const name=$("#custName").value.trim(), phone=$("#custPhone").value.trim();
    if(!name || !phone){ toast("Please add your name and phone."); return; }
    const t=calcTotals();
    const orderNo="PH-"+String(Math.floor(1000+Math.random()*9000));
    const when=$("#pickupTime").value;
    const type=orderType();
    const order={ no:orderNo, date:new Date().toISOString(), fulfillmentMode, items:cartLines().map(l=>({name:l.name, qty:l.qty, price:l.price, note:l.note})), subtotal:t.sub, tax:t.tax, delivery:t.delivery, tip:t.tip, rewardDisc:t.rewardDisc, banhMiDisc:t.banhMiDisc, total:t.total, name, phone, notes:$("#orderNotes").value, type, when };
    orders.unshift(order); save("phohouse_orders", orders);
    // Rewards: points + stamps
    let earned=Math.floor(t.sub * SITE.pointsPerDollar);
    let stampsEarned=0;
    if(member){
      // Auto-join behavior: if member exists, add points
      if($("#applyReward")?.checked && member.points>=100){ member.points-=100; earned=Math.max(0, earned); }
      if($("#applyBanhMiFree")?.checked && (member.banhMiStamps||0)>=5){ member.banhMiStamps-=5; }
      member.points=(member.points||0)+earned;
      // Stamps: one per banh mi ordered
      stampsEarned=cartLines().filter(l=>l.tags && l.tags.includes("banhmi")).reduce((s,l)=>s+l.qty,0);
      member.banhMiStamps=(member.banhMiStamps||0)+stampsEarned;
      // Birthday check: if birthday month/day matches today, note (no auto-discount in demo)
      save("phohouse_member", member);
      if(members[member.phone]){ members[member.phone]=member; save("phohouse_members", members); }
    }
    cart=[]; saveCart(); renderMenu(); renderPopular();
    const conf=$("#orderConfirmation"); if(conf) conf.hidden=false;
    const noEl=$("#confirmOrderNo"); if(noEl) noEl.textContent=orderNo;
    const det=$("#confirmDetail"); if(det) det.textContent=`${type==="delivery"?"Delivery":"Pickup"} · ${when} · Total ${fmt(t.total)} · ${name} · ${phone}${order.notes?` · Note: ${order.notes}`:""}`;
    const pts=$("#confirmPoints"); if(pts) pts.textContent = member ? `You earned ${earned} points${stampsEarned?` and ${stampsEarned} Banh Mi stamp${stampsEarned>1?"s":""}`:""}.` : "Join Rewards next time to earn points on this order.";
    checkoutForm.style.display="none";
    const cpi=$("#cartPageItems"); if(cpi) cpi.innerHTML="";
    const cpe=$("#cartPageEmpty"); if(cpe) cpe.hidden=true;
    renderOrderHistory(); renderRewards(); renderSummary();
    toast(`Order ${orderNo} placed`);
  });
  function renderOrderHistory(){
    const el=$("#orderHistoryList"); if(!el) return;
    if(!orders.length){ el.innerHTML='<p class="muted">No orders yet on this device.</p>'; return; }
    el.innerHTML=orders.slice(0,10).map(o=>`<div class="order-row"><strong>${o.no}</strong> · ${new Date(o.date).toLocaleString()} · ${o.type} · ${o.when}<br>${o.items.map(i=>`${i.qty}× ${i.name}`).join(", ")}<br><strong>Total ${fmt(o.total)}</strong></div>`).join("");
  }

  /* ---------- Rewards ---------- */
  function tierFor(points){ if(points>=600) return "Pho VIP"; if(points>=250) return "Pho Lover"; return "Pho Fan"; }
  function memberNumberFor(phone){ const digits=(phone||"").replace(/\D/g,""); return "PH-"+(digits.slice(-4)||"0000")+"-"+String(Math.abs(hashCode(phone))%9000+1000); }
  function hashCode(s){ let h=0; for(let i=0;i<s.length;i++){ h=((h<<5)-h)+s.charCodeAt(i); h|=0; } return h; }
  function renderQR(){
    const box=$("#qrPattern"); if(!box) return;
    const seed=member?hashCode(member.phone||""):42;
    let html=""; for(let i=0;i<49;i++){ const on=((seed+i*7+i*i)%3)!==0; html+=`<i class="${on?"":"off"}"></i>`; }
    box.innerHTML=html; box.setAttribute("title","Member card — decorative pattern, not a real QR code");
  }
  function renderRewards(){
    const signedIn=!!member;
    const out=$("#memberSignedOut"), inn=$("#memberSignedIn");
    if(out) out.hidden=signedIn; if(inn) inn.hidden=!signedIn;
    if(!signedIn) return;
    $("#memberName").textContent=member.name||"Member";
    $("#memberNumber").textContent="Member № "+memberNumberFor(member.phone);
    $("#memberTier").textContent=tierFor(member.points||0);
    $("#pointsBalance").textContent=member.points||0;
    const toNext=Math.max(0, 100-((member.points||0)%100 || 0)); // progress to next 100
    // Simpler: if points >=100, next is next multiple; show remainder progress
    const prog=((member.points||0)%100);
    $("#pointsToNext").textContent = (member.points||0)>=100 ? "You have a $10 reward ready" : (100-(member.points||0));
    $("#progressBar").style.width=Math.min(100, prog)+"%";
    $("#banhMiCount").textContent=`${member.banhMiStamps||0} / 5`;
    // Birthday
    const bn=$("#birthdayNote");
    if(bn){
      if(member.birthday){
        const b=new Date(member.birthday+"T00:00:00"); const today=new Date();
        const isBday = b.getMonth()===today.getMonth() && b.getDate()===today.getDate();
        bn.textContent = isBday ? "Happy birthday — your $5 birthday treat is available. Show this card at pickup." : `Birthday treat ($5 off) on ${b.toLocaleDateString(undefined,{month:"long",day:"numeric"})}.`;
      } else bn.textContent="";
    }
    // Stamps
    const sr=$("#stampRow"); if(sr){
      const stamps=member.banhMiStamps||0; let h="";
      for(let i=0;i<5;i++){ h+=`<span class="stamp ${i<stamps?"filled":""}">${i<stamps?"✓":i+1}</span>`; }
      h+=`<span class="stamp free">6th<br>FREE</span>`;
      sr.innerHTML=h;
    }
    const st=$("#stampText"); if(st) st.textContent = (member.banhMiStamps||0)>=5 ? "You have earned a free Banh Mi — apply it at checkout." : `${5-(member.banhMiStamps||0)} more Banh Mi to a free one.`;
    renderQR();
    const tp=$("#teaserPoints"); if(tp) tp.textContent=member.points||0;
    renderSummary();
  }
  const joinForm=$("#joinForm");
  if(joinForm) joinForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name=$("#joinName").value.trim(), phone=$("#joinPhone").value.trim();
    if(!name||!phone){ toast("Please add name and phone."); return; }
    member={ name, phone, email:$("#joinEmail").value.trim(), birthday:$("#joinBirthday").value, points:0, banhMiStamps:0, joinedAt:new Date().toISOString() };
    members[phone]=member; save("phohouse_members", members); save("phohouse_member", member);
    toast(`Welcome, ${name}! You are a Pho Fan.`); renderRewards();
  });
  const signInForm=$("#signInForm");
  if(signInForm) signInForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const phone=$("#signInPhone").value.trim();
    const found=members[phone];
    const msg=$("#signInMsg");
    if(found){ member=found; save("phohouse_member", member); renderRewards(); toast(`Welcome back, ${found.name}!`); }
    else if(msg){ msg.textContent="No member found for that phone on this device. Try joining, or use the phone you joined with."; }
  });
  const signOutBtn=$("#signOutBtn");
  if(signOutBtn) signOutBtn.addEventListener("click", ()=>{ member=null; save("phohouse_member", null); renderRewards(); toast("Signed out."); });
  const redeemBtn=$("#redeemBtn");
  if(redeemBtn) redeemBtn.addEventListener("click", ()=>{
    if(!member){ toast("Join Rewards first."); return; }
    if((member.points||0)<100){ toast("You need 100 points for a $10 reward."); return; }
    member.points-=100; save("phohouse_member", member); if(members[member.phone]){ members[member.phone]=member; save("phohouse_members", members); }
    const code="PHO10-"+String(Math.floor(1000+Math.random()*9000));
    const ca=$("#couponArea"); if(ca) ca.innerHTML=`<div class="confirmation" style="margin-top:12px"><strong>Your coupon: ${code}</strong><br>Show this code at pickup for $10 off. It was deducted from your points.</div>`;
    renderRewards(); toast(`Coupon ${code} created`);
  });
  const receiptForm=$("#receiptForm");
  if(receiptForm) receiptForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const total=parseFloat($("#receiptTotal").value||"0");
    if(!member){ toast("Join or sign in first."); return; }
    if(!total||total<=0){ toast("Enter a receipt total over $0."); return; }
    const pts=Math.floor(total);
    member.points=(member.points||0)+pts; save("phohouse_member", member); if(members[member.phone]){ members[member.phone]=member; save("phohouse_members", members); }
    const rm=$("#receiptMsg"); if(rm) rm.textContent=`Added ${pts} points for a ${fmt(total)} receipt.`;
    $("#receiptTotal").value=""; renderRewards(); toast(`Added ${pts} points`);
  });

  /* ---------- Catering ---------- */
  const cateringForm=$("#cateringForm");
  if(cateringForm) cateringForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const req={ name:$("#catName").value.trim(), phone:$("#catPhone").value.trim(), email:$("#catEmail").value.trim(), date:$("#catDate").value, guests:$("#catGuests").value, pkg:$("#catPackage").value, details:$("#catDetails").value, at:new Date().toISOString() };
    if(!req.name||!req.phone||!req.date){ toast("Please add name, phone and event date."); return; }
    catering.unshift(req); save("phohouse_catering", catering);
    const cc=$("#cateringConfirm"); if(cc) cc.hidden=false;
    const ct=$("#cateringConfirmText"); if(ct) ct.textContent=`Thanks, ${req.name}. We saved your ${req.pkg} request for ${req.guests} guests on ${req.date}. We will call ${req.phone} to confirm menu and pricing.`;
    cateringForm.reset();
    // mailto fallback
    const subject=encodeURIComponent(`Catering request — ${req.pkg} — ${req.date} — ${req.guests} guests`);
    const body=encodeURIComponent(`Name: ${req.name}\nPhone: ${req.phone}\nEmail: ${req.email}\nDate: ${req.date}\nGuests: ${req.guests}\nPackage: ${req.pkg}\nDetails: ${req.details}`);
    window.location.href=`mailto:${SITE.email}?subject=${subject}&body=${body}`;
    toast("Catering request saved");
  });

  /* ---------- Service areas ---------- */
  const sa=$("#serviceAreas"); if(sa) sa.innerHTML=SITE.serviceAreas.map(a=>`<span>${a}</span>`).join("");

  /* ---------- Cart drawer ---------- */
  const drawer=$("#cartDrawer"), overlay=$("#cartOverlay");
  function openCart(){ if(drawer){ drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); } if(overlay) overlay.hidden=false; renderCartDrawer(); }
  function closeCart(){ if(drawer){ drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); } if(overlay) overlay.hidden=true; }
  $("#cartOpenBtn")?.addEventListener("click", openCart);
  $("#cartCloseBtn")?.addEventListener("click", closeCart);
  overlay?.addEventListener("click", closeCart);
  $("#cartClearBtn")?.addEventListener("click", ()=>{ cart=[]; saveCart(); renderMenu(); renderPopular(); renderCartPage(); renderSummary(); toast("Cart cleared"); });

  /* ---------- PWA install ---------- */
  let deferredPrompt=null;
  window.addEventListener("beforeinstallprompt", (e)=>{ e.preventDefault(); deferredPrompt=e; const b=$("#installBtn"); if(b) b.hidden=false; });
  $("#installBtn")?.addEventListener("click", async ()=>{
    const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
    if(isIOS){ const s=$("#iosSheet"); if(s) s.hidden=false; return; }
    if(deferredPrompt){ deferredPrompt.prompt(); const ch=await deferredPrompt.userChoice; deferredPrompt=null; if(ch.outcome==="accepted") toast("App installed — find Pho House on your home screen."); }
    else { const s=$("#iosSheet"); if(s) s.hidden=false; }
  });
  const closeSheet=()=>{ const s=$("#iosSheet"); if(s) s.hidden=true; };
  $("#iosClose")?.addEventListener("click", closeSheet);
  $("#iosDone")?.addEventListener("click", closeSheet);

  /* ---------- SW ---------- */
  if("serviceWorker" in navigator){
    window.addEventListener("load", ()=>{ navigator.serviceWorker.register("sw.js").catch(()=>{}); });
  }

  /* ---------- Init ---------- */
  renderFulfillmentUI(); renderPills(); renderMenu(); renderPopular(); updateCartBadge(); renderCartDrawer(); renderCartPage(); renderOrderHistory(); renderRewards(); renderHours(); renderSummary();
  route();
  // Re-check open status every minute
  setInterval(renderHours, 60000);
})();
