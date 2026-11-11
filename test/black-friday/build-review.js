// Builds a single self-contained HTML of the Black Friday page for review by
// people without access to the store's preview theme.
//
// - Renders the page through the local harness (server.js must be running).
// - Inlines lp-blackfriday.css and lp-blackfriday.js.
// - Adds a review bar to switch between the page states, and a simulated cart
//   (window.fetch shim for /cart.js, /cart/add.js, /cart/change.js,
//   /cart/update.js) applying the three discounts as configured, so Add to
//   cart works when the file is opened from disk.
//
// Product photos and fonts still load from Shopify's CDN and Google Fonts.
//
// Usage: node build-review.js <output.html>

const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:4410";
const THEME = path.join(__dirname, "../../theme");
const out = process.argv[2] || path.join(__dirname, "black-friday-review.html");

// Same snapshot as server.js: [handle, title, variantId, cents, stock, policy]
const PRODUCTS = require("./server-products.json");

const SHIM = `
(function () {
  "use strict";
  // --- review state -------------------------------------------------------
  var params = new URLSearchParams(location.search);
  var state = params.get("state") || "soon";
  var cfgEl = document.querySelector("[data-lp-config]");
  var cfg = JSON.parse(cfgEl.textContent);
  var now = Date.now();
  var DAY = 86400000;
  if (state === "live") {
    cfg.start = now - DAY;
    if (!cfg.end || cfg.end <= now) cfg.end = now + DAY;
  } else if (state === "ended") {
    cfg.start = now - 2 * DAY;
    cfg.end = now - DAY;
    cfg.afterEnd = "ended";
  } else if (cfg.start <= now) {
    cfg.start = now + 16 * DAY;
    cfg.end = cfg.start + DAY;
  }
  cfgEl.textContent = JSON.stringify(cfg);
  window.__lpReviewState = state;

  // --- simulated cart -----------------------------------------------------
  var P = ${JSON.stringify(PRODUCTS)};
  var byId = {};
  P.forEach(function (p) {
    byId[p[2]] = { title: p[1], price: p[3], stock: p[4], deny: p[5] === "DENY", image: p[6] };
  });
  var GIFTS = [${PRODUCTS.filter((p) => p[0].startsWith("sio2-")).map((p) => p[2]).join(",")}];
  var lines = [];
  try { lines = JSON.parse(sessionStorage.getItem("lp-review-cart") || "[]"); } catch (e) {}
  function persist() { try { sessionStorage.setItem("lp-review-cart", JSON.stringify(lines)); } catch (e) {} }
  function isGift(id) { return GIFTS.indexOf(Number(id)) !== -1; }
  function isBottle(id) { return byId[id] && byId[id].title.indexOf("60ml") !== -1; }
  function qtyOf(id) { return lines.filter(function (l) { return l.id === id; }).reduce(function (s, l) { return s + l.q; }, 0); }
  function stockError(id, wanted) {
    var p = byId[id];
    if (!p) return "Cannot find variant";
    if (p.deny && wanted > p.stock) return "You can only add " + p.stock + " " + p.title + " to the cart.";
    return null;
  }
  function cart() {
    var live = state === "live";
    var bottles = lines.filter(function (l) { return isBottle(l.id); }).reduce(function (s, l) { return s + l.q; }, 0);
    var pct = !live || !bottles ? 0 : bottles >= 5 ? 35 : 25;
    // One free sealant per bottle, oldest sealant lines first.
    var giftLeft = live ? bottles : 0;
    var freeUnits = {};
    for (var i = lines.length - 1; i >= 0; i--) {
      if (giftLeft > 0 && isGift(lines[i].id)) {
        freeUnits[i] = Math.min(giftLeft, lines[i].q);
        giftLeft -= freeUnits[i];
      }
    }
    var total = 0, orig = 0, count = 0;
    var items = lines.map(function (l, i) {
      var p = byId[l.id];
      var o = p.price * l.q, d = 0;
      if (isBottle(l.id) && pct) d = Math.round(o * pct / 100);
      if (freeUnits[i]) d = p.price * freeUnits[i];
      total += o - d; orig += o; count += l.q;
      return { variant_id: l.id, product_title: p.title, quantity: l.q, original_line_price: o,
        final_line_price: o - d, line_price: o, image: p.image, line_level_discount_allocations: [] };
    });
    return { item_count: count, items: items, total_price: total, original_total_price: orig, total_discount: orig - total };
  }
  function reply(status, body) {
    return Promise.resolve(new Response(JSON.stringify(body), { status: status, headers: { "Content-Type": "application/json" } }));
  }
  var realFetch = window.fetch.bind(window);
  window.fetch = function (url, opts) {
    var u = String(url);
    if (!/^\\/cart/.test(u)) return realFetch(url, opts);
    var body = opts && opts.body ? JSON.parse(opts.body) : {};
    if (u === "/cart.js") return reply(200, cart());
    if (u === "/cart/add.js") {
      var pending = {};
      for (var i = 0; i < body.items.length; i++) {
        var it = body.items[i], id = Number(it.id);
        pending[id] = (pending[id] || 0) + Number(it.quantity || 1);
        var err = stockError(id, qtyOf(id) + pending[id]);
        if (err) return reply(422, { status: 422, description: err });
      }
      body.items.slice().reverse().forEach(function (it) {
        var id = Number(it.id), q = Number(it.quantity || 1);
        var ex = lines.filter(function (l) { return l.id === id; })[0];
        if (ex) { ex.q += q; lines = [ex].concat(lines.filter(function (l) { return l !== ex; })); }
        else lines.unshift({ id: id, q: q });
      });
      persist();
      return reply(200, { items: [] });
    }
    if (u === "/cart/change.js") {
      var idx = Number(body.line) - 1, q = Number(body.quantity);
      if (!lines[idx]) return reply(400, { description: "No line" });
      if (q > 0) {
        var e2 = stockError(lines[idx].id, q);
        if (e2) return reply(422, { status: 422, description: e2 });
        lines[idx].q = q;
      } else lines.splice(idx, 1);
      persist();
      return reply(200, cart());
    }
    if (u === "/cart/update.js") {
      var ups = body.updates || {};
      for (var k in ups) if (Number(ups[k]) > 0) { var e3 = stockError(Number(k), Number(ups[k])); if (e3) return reply(422, { status: 422, description: e3 }); }
      Object.keys(ups).forEach(function (k) {
        var id = Number(k), q = Number(ups[k]);
        var ex = lines.filter(function (l) { return l.id === id; })[0];
        if (q <= 0) lines = lines.filter(function (l) { return l.id !== id; });
        else if (ex) ex.q = q;
        else lines.unshift({ id: id, q: q });
      });
      persist();
      return reply(200, cart());
    }
    return realFetch(url, opts);
  };

  // Checkout and the no-JS form go nowhere in a review file.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="/checkout"]');
    if (a) { e.preventDefault(); alert("Review copy: checkout is disabled. On the store this goes to Shopify checkout with the discounts applied."); }
  }, true);
})();
`;

const BAR = `
<div class="lp-review" role="region" aria-label="Review controls">
  <p><strong>REVIEW</strong><span class="lp-review__note"> · not the live store · prices and stock as of Nov 11 · cart is simulated</span></p>
  <nav>
    <a href="?state=soon" data-s="soon">Coming soon</a>
    <a href="?state=live" data-s="live">Live</a>
    <a href="?state=ended" data-s="ended">Ended</a>
    <button type="button" data-reset title="Empty the simulated cart">Empty cart</button>
  </nav>
</div>
<style>
  .lp-review{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);width:max-content;max-width:calc(100% - 16px);z-index:35;display:flex;align-items:center;gap:8px 14px;padding:6px 6px 6px 12px;border-radius:14px;background:#fff;color:#111;font:500 12px/1.4 Poppins,system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5)}
  .lp-review p{margin:0}
  .lp-review nav{display:flex;gap:4px}
  @media (max-width:760px){.lp-review__note{display:none}.lp-review a,.lp-review button{padding:5px 8px;font-size:11px}}
  .lp-review a,.lp-review button{padding:6px 10px;border-radius:999px;border:1px solid #ccc;background:#fff;color:#111;text-decoration:none;font:600 12px Poppins,system-ui,sans-serif;cursor:pointer}
  .lp-review a[aria-current]{background:#e8590c;border-color:#e8590c;color:#fff}
  .lp-footer{padding-bottom:120px}
</style>
<script>
  (function(){
    var s = window.__lpReviewState || "soon";
    document.querySelectorAll(".lp-review [data-s]").forEach(function(a){ if(a.dataset.s===s) a.setAttribute("aria-current","true"); });
    document.querySelector(".lp-review [data-reset]").addEventListener("click", function(){ try{sessionStorage.removeItem("lp-review-cart");}catch(e){} location.reload(); });
  })();
</script>
`;

(async () => {
  await fetch(BASE + "/test/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  let html = await (await fetch(BASE + "/")).text();

  const css = fs.readFileSync(path.join(THEME, "assets/lp-blackfriday.css"), "utf8");
  const js = fs.readFileSync(path.join(THEME, "assets/lp-blackfriday.js"), "utf8");

  html = html.replace('<link rel="stylesheet" href="/assets/lp-blackfriday.css">', () => "<style>\n" + css + "\n</style>");
  html = html.replace(/<script src="\/assets\/lp-blackfriday\.js" defer><\/script>/, () =>
    "<script>\n" + SHIM + "\n</script>\n<script>\n" + js + "\n</script>"
  );
  // Shopify's storefront analytics import has no business in a review file.
  html = html.replace(/<script type="module">[\s\S]*?<\/script>/, "");
  html = html.replace(/<link rel="canonical"[^>]*>/, "");
  html = html.replace("</body>", () => BAR + "\n</body>");
  html = html.replace("<title>", "<title>[REVIEW] ");
  // Campaign renders: served from Shopify Files, where they are uploaded under
  // the same names (the harness serves them from media/ locally).
  html = html.replace(/(["\s])\/media\//g, "$1https://cdn.shopify.com/s/files/1/0929/1828/4608/files/");

  if (!html.includes("lp-review") || html.includes("/assets/lp-blackfriday")) throw new Error("inlining failed");
  fs.writeFileSync(out, html);
  console.log("wrote", out, (html.length / 1024).toFixed(0) + " KB");
})();
