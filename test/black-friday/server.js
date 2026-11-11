// Local stand-in for the Shopify storefront, used to test the Black Friday
// theme files without network access to the store.
//
// - Renders theme/templates/index.json (or page.black-friday.json) with the
//   real section, snippets and layout, using liquidjs plus the handful of
//   Shopify filters the files use.
// - Implements /cart.js, /cart/add.js, /cart/add (form), /cart/change.js and
//   /cart/update.js with Shopify's semantics (atomic adds, stock checks for
//   "deny" variants, newest line first).
// - Applies the three automatic discounts as they are to be configured:
//   25% on every bottle, 35% from 5 bottles (best one per line), and one
//   free SiO2 Top Sealant per bottle.
//
// Product data (ids, prices, stock, policies, images) is a snapshot of the
// Admin API taken on 2026-11-11.

const path = require("path");
const fs = require("fs");
const express = require("express");
const { Liquid } = require("liquidjs");

const THEME = process.env.THEME_DIR || path.join(__dirname, "../../theme");
const PORT = Number(process.env.PORT || 4410);
const CDN = "https://cdn.shopify.com/s/files/1/0929/1828/4608/files/";

const RAW = [
  ["9h-special-edition-60ml", "9H Special Edition 60ml", 50503904559424, 9500, 5, "DENY", "SPEDITION_1.webp"],
  ["9h-special-edition-60ml-marine", "9H Special Edition 60ml Marine", 50503946633536, 9500, 10, "DENY", "SP_EDITION_MARINE_1.webp"],
  ["black-ceramic-10h-60ml", "Black Ceramic 10H 60ml", 50503909343552, 13900, 3, "DENY", "BLACK_4c0211fd-b026-4f43-bf49-cb06467eeea4.webp"],
  ["black-ceramic-10h-60ml-marine", "Black Ceramic 10H 60ml Marine", 50503947780416, 13900, 8, "DENY", "BLACK_MARINE.webp"],
  ["pure-ceramic-coating-60ml", "Pure Ceramic Coating 60ml", 50503943487808, 12500, 7, "DENY", "PURE_CERAMIC.webp"],
  ["pure-ceramic-60ml-marine", "Pure Ceramic 60ml Marine", 50577699766592, 12500, 0, "CONTINUE", "PURE_CERAMIC_MARINE.webp"],
  ["fine-touch-ceramic-60ml", "Fine Touch Ceramic 60ml", 50577707729216, 8900, 0, "CONTINUE", "FINE.webp"],
  ["fine-touch-ceramic-60ml-marine", "Fine Touch Ceramic 60ml Marine", 50577708974400, 8900, 2, "CONTINUE", "FINEMERINE_1.webp"],
  ["glass-coating-60ml", "Glass Coating 60ml", 50577710022976, 5900, 3, "CONTINUE", "GLASS_1.webp"],
  ["leather-coating-60ml", "Leather Coating 60ml", 50577714217280, 8500, 5, "CONTINUE", "LEATHER.webp"],
  ["leather-ceramic-matte-60ml", "Leather Ceramic Matte 60ml", 50577714708800, 8500, 6, "CONTINUE", "LEATHER_MATTE.webp"],
  ["ppf-vinyl-ceramic-60ml", "PPF & Vinyl Ceramic 60ml", 50577718772032, 9500, 4, "CONTINUE", "PPFEVINIYL.webp"],
  ["ppf-vinyl-matte-ceramic-60ml", "PPF & Vinyl Matte Ceramic 60ml", 50577719427392, 9500, 4, "CONTINUE", "PPF_MATTE.webp"],
  ["plastic-coating-60ml", "Plastic Coating 60ml", 50577721524544, 8500, 4, "CONTINUE", "Adobe_Express_-_file_1.png"],
  ["wheel-caliper-ceramic-60ml", "Wheel & Caliper Ceramic 60ml", 50577725849920, 8500, 5, "CONTINUE", "WHELL.webp"],
  ["sio2-top-sealant-473ml", "SIO2 Top Sealant 473ml", 50489274302784, 3900, 4, "DENY", "SiO2Sealant473_0d97c731-cdfd-4b45-8293-640711208571.webp"],
  ["sio2-top-sealant-473ml-marine", "SiO2 Top Sealant 473ml Marine", 50673082204480, 3900, 7, "CONTINUE", "S1O2SealantMarine473_86391424-b2f6-4312-aee7-fcdc58dc5654.webp"],
];

const GIFT_HANDLES = ["sio2-top-sealant-473ml", "sio2-top-sealant-473ml-marine"];

let products = {};
let byVariant = {};
function loadProducts(overrides = {}) {
  products = {};
  byVariant = {};
  for (const [handle, title, id, price, qty0, policy, img] of RAW) {
    const qty = handle in overrides ? overrides[handle] : qty0;
    const variant = {
      id,
      title: "Default Title",
      price,
      inventory_management: "shopify",
      inventory_quantity: qty,
      inventory_policy: policy.toLowerCase(),
      available: policy === "CONTINUE" || qty > 0,
    };
    const product = {
      handle,
      title,
      price,
      url: "/products/" + handle,
      available: variant.available,
      featured_image: { src: CDN + img, alt: title },
      variants: [variant],
      selected_or_first_available_variant: variant.available ? variant : null,
      first_available_variant: variant.available ? variant : null,
      description: "",
    };
    products[handle] = product;
    byVariant[id] = { product, variant };
  }
}
loadProducts();

const isGiftId = (id) => GIFT_HANDLES.includes(byVariant[id] && byVariant[id].product.handle);
const isBottleId = (id) => {
  const p = byVariant[id] && byVariant[id].product;
  return Boolean(p && p.title.includes("60ml"));
};

/* --- cart ---------------------------------------------------------------- */

let lines = []; // [{variant_id, quantity}] newest first
let discountsActive = true;

function cartJson() {
  const bottleQty = lines.filter((l) => isBottleId(l.variant_id)).reduce((s, l) => s + l.quantity, 0);
  const pct = !discountsActive || bottleQty === 0 ? 0 : bottleQty >= 5 ? 35 : 25;
  // Buy 1 bottle, get 1 sealant at 100%, no limit of uses per order: as many
  // free sealant units as bottles, allocated to the oldest sealant lines.
  let giftLeft = discountsActive ? bottleQty : 0;
  const giftOrder = lines.map((l, i) => i).reverse();
  const giftDiscount = {};
  for (const i of giftOrder) {
    if (giftLeft > 0 && isGiftId(lines[i].variant_id)) {
      const units = Math.min(giftLeft, lines[i].quantity);
      giftDiscount[i] = byVariant[lines[i].variant_id].variant.price * units;
      giftLeft -= units;
    }
  }

  let total = 0;
  let original = 0;
  const items = lines.map((l, i) => {
    const { product, variant } = byVariant[l.variant_id];
    const orig = variant.price * l.quantity;
    let disc = 0;
    const allocations = [];
    if (isBottleId(l.variant_id) && pct) {
      disc = Math.round((orig * pct) / 100);
      allocations.push({ title: pct === 35 ? "Black Friday 35% (5+)" : "Black Friday 25%", amount: disc });
    }
    if (giftDiscount[i]) {
      disc = giftDiscount[i];
      allocations.push({ title: "Black Friday free SiO2 Top Sealant", amount: disc });
    }
    total += orig - disc;
    original += orig;
    return {
      key: l.variant_id + ":" + i,
      id: l.variant_id,
      variant_id: l.variant_id,
      product_title: product.title,
      handle: product.handle,
      variant_title: null,
      quantity: l.quantity,
      price: variant.price,
      original_price: variant.price,
      original_line_price: orig,
      line_price: orig,
      final_price: Math.round((orig - disc) / l.quantity),
      final_line_price: orig - disc,
      total_discount: disc,
      line_level_discount_allocations: allocations,
      image: product.featured_image.src,
    };
  });

  return {
    item_count: lines.reduce((s, l) => s + l.quantity, 0),
    items,
    original_total_price: original,
    items_subtotal_price: total,
    total_price: total,
    total_discount: original - total,
    currency: "USD",
  };
}

function qtyInCart(id) {
  return lines.filter((l) => l.variant_id === id).reduce((s, l) => s + l.quantity, 0);
}

function stockError(id, wanted) {
  const rec = byVariant[id];
  if (!rec) return "Cannot find variant";
  const v = rec.variant;
  if (!v.available) return `${rec.product.title} is sold out.`;
  if (v.inventory_policy === "deny" && wanted > v.inventory_quantity) {
    return `You can only add ${v.inventory_quantity} ${rec.product.title} to the cart.`;
  }
  return null;
}

function addItems(items) {
  // Atomic: validate everything first.
  const pending = {};
  for (const it of items) {
    const id = Number(it.id);
    const q = Number(it.quantity || 1);
    pending[id] = (pending[id] || 0) + q;
    const err = stockError(id, qtyInCart(id) + pending[id]);
    if (err) return { status: 422, body: { status: 422, message: "Cart Error", description: err } };
  }
  const added = [];
  // Shopify lists the request's items in order at the top of the cart.
  for (const it of [...items].reverse()) {
    const id = Number(it.id);
    const q = Number(it.quantity || 1);
    const existing = lines.find((l) => l.variant_id === id);
    if (existing) {
      existing.quantity += q;
      lines = [existing, ...lines.filter((l) => l !== existing)];
    } else {
      lines.unshift({ variant_id: id, quantity: q });
    }
    added.push(id);
  }
  return { status: 200, body: { items: added.map((id) => cartJson().items.find((i) => i.variant_id === id)) } };
}

/* --- liquid -------------------------------------------------------------- */

const engine = new Liquid({
  root: [path.join(THEME, "sections"), path.join(THEME, "snippets"), path.join(THEME, "layout")],
  partials: path.join(THEME, "snippets"),
  extname: ".liquid",
  dynamicPartials: true,
  jsTruthy: false,
});

engine.registerTag("schema", {
  parse(token, remain) {
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain);
    stream.on("tag:endschema", () => stream.stop()).on("template", () => {}).on("end", () => {
      throw new Error("schema not closed");
    });
    stream.start();
  },
  *render() {},
});

engine.registerTag("style", {
  parse(token, remain) {
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain);
    stream
      .on("tag:endstyle", () => stream.stop())
      .on("template", (tpl) => this.tpls.push(tpl))
      .on("end", () => {
        throw new Error("style not closed");
      });
    stream.start();
  },
  *render(ctx, emitter) {
    emitter.write("<style>");
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write("</style>");
  },
});

const money = (c) => "$" + (Number(c) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
engine.registerFilter("money", money);
engine.registerFilter("money_without_trailing_zeros", (c) => money(c).replace(/\.00$/, ""));
engine.registerFilter("asset_url", (n) => "/assets/" + n);
engine.registerFilter("stylesheet_tag", (u) => `<link rel="stylesheet" href="${u}">`);
engine.registerFilter("json", (v) => JSON.stringify(v === undefined ? null : v));
engine.registerFilter("image_url", (img, ...args) => {
  const src = typeof img === "string" ? img : img && img.src;
  if (!src) return "";
  const opts = Object.fromEntries(args.filter(Array.isArray));
  return src + (opts.width ? (src.includes("?") ? "&" : "?") + "width=" + opts.width : "");
});
engine.registerFilter("image_tag", (url, ...args) => {
  const opts = Object.fromEntries(args.filter(Array.isArray));
  const attrs = Object.entries(opts)
    .filter(([k]) => !["widths"].includes(k))
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, "&quot;")}"`)
    .join(" ");
  return `<img src="${url}" ${attrs}>`;
});

function resolveSettings(settings) {
  const out = {};
  for (const [k, v] of Object.entries(settings || {})) {
    out[k] = typeof v === "string" && products[v] ? products[v] : v;
  }
  return out;
}

let settingsOverride = {};

function sectionFor(templateFile) {
  const tpl = JSON.parse(fs.readFileSync(path.join(THEME, "templates", templateFile), "utf8"));
  const key = tpl.order[0];
  const sec = tpl.sections[key];
  const schemaSrc = fs.readFileSync(path.join(THEME, "sections", sec.type + ".liquid"), "utf8");
  const schema = JSON.parse(schemaSrc.split("{% schema %}")[1].split("{% endschema %}")[0]);
  const defaults = {};
  for (const s of schema.settings) if (s.id && "default" in s) defaults[s.id] = s.default;
  const blockDefaults = {};
  for (const b of schema.blocks || []) {
    blockDefaults[b.type] = {};
    for (const s of b.settings) if ("default" in s) blockDefaults[b.type][s.id] = s.default;
  }
  return {
    tpl,
    type: sec.type,
    section: {
      id: key,
      settings: resolveSettings({ ...defaults, ...sec.settings, ...settingsOverride }),
      blocks: (sec.block_order || []).map((id) => ({
        id,
        type: sec.blocks[id].type,
        shopify_attributes: "",
        settings: resolveSettings({ ...blockDefaults[sec.blocks[id].type], ...sec.blocks[id].settings }),
      })),
    },
  };
}

async function renderPage(templateFile, url) {
  const { tpl, type, section } = sectionFor(templateFile);
  const cart = cartJson();
  const shop = {
    name: "Malbor Coatings USA",
    money_format: "${{amount}}",
    privacy_policy: { url: "/policies/privacy-policy", title: "Privacy policy" },
    terms_of_service: { url: "/policies/terms-of-service", title: "Terms of service" },
    refund_policy: { url: "/policies/refund-policy", title: "Refund policy" },
  };
  const globals = {
    shop,
    cart: { item_count: cart.item_count, items: cart.items },
    routes: { cart_add_url: "/cart/add", cart_change_url: "/cart/change", cart_update_url: "/cart/update", cart_url: "/cart" },
    request: { locale: { iso_code: "en" }, origin: "http://localhost:" + PORT },
    canonical_url: "http://localhost:" + PORT + url,
    all_products: products,
    settings: {},
    template: { name: templateFile.split(".")[0] },
    content_for_header: "",
  };
  const sectionHtml = await engine.renderFile(type, { section }, { globals });
  return engine.renderFile(path.join(THEME, "layout", tpl.layout + ".liquid"), { content_for_layout: sectionHtml }, { globals });
}

/* --- server -------------------------------------------------------------- */

const app = express();
app.use(express.json());
app.use("/assets", express.static(path.join(THEME, "assets")));
app.use("/fonts", express.static(path.join(__dirname, "node_modules/@fontsource")));

app.get(["/", "/pages/black-friday", "/pages/black-friday-teaser"], async (req, res, next) => {
  try {
    const file = req.path === "/" ? "index.json" : "page" + req.path.replace("/pages/", ".") + ".json";
    res.type("html").send(await renderPage(file, req.originalUrl));
  } catch (e) {
    next(e);
  }
});

app.get("/cart.js", (req, res) => res.json(cartJson()));
app.get("/cart", (req, res) => res.type("html").send("<pre id=cart>" + JSON.stringify(cartJson(), null, 2) + "</pre>"));
app.get("/checkout", (req, res) => res.type("html").send("<h1>checkout</h1>"));

app.post("/cart/add.js", (req, res) => {
  const items = req.body.items || [{ id: req.body.id, quantity: req.body.quantity }];
  const r = addItems(items);
  res.status(r.status).json(r.body);
});

// The no-JS form: items[][id] / items[][quantity] pairs, in order.
app.post("/cart/add", express.raw({ type: () => true }), (req, res) => {
  const body = req.body.toString();
  let items = [];
  const ct = req.headers["content-type"] || "";
  if (ct.startsWith("multipart/form-data")) {
    const boundary = ct.split("boundary=")[1];
    for (const part of body.split("--" + boundary)) {
      const m = part.match(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/);
      if (!m) continue;
      if (m[1] === "items[][id]") items.push({ id: m[2] });
      if (m[1] === "items[][quantity]") items[items.length - 1].quantity = m[2];
    }
  } else {
    for (const pair of body.split("&")) {
      const [k, v] = pair.split("=").map(decodeURIComponent);
      if (k === "items[][id]") items.push({ id: v });
      if (k === "items[][quantity]") items[items.length - 1].quantity = v;
    }
  }
  fs.appendFileSync(path.join(__dirname, "form-posts.log"), JSON.stringify(items) + "\n");
  const r = addItems(items);
  if (r.status !== 200) return res.status(r.status).send(r.body.description);
  res.redirect(302, "/cart");
});

app.post("/cart/change.js", (req, res) => {
  const idx = Number(req.body.line) - 1;
  const q = Number(req.body.quantity);
  if (!lines[idx]) return res.status(400).json({ description: "No line" });
  if (q > 0) {
    const err = stockError(lines[idx].variant_id, q);
    if (err) return res.status(422).json({ status: 422, description: err });
    lines[idx].quantity = q;
  } else lines.splice(idx, 1);
  res.json(cartJson());
});

app.post("/cart/update.js", (req, res) => {
  const updates = req.body.updates || {};
  for (const [id, q] of Object.entries(updates)) {
    if (Number(q) > 0) {
      const err = stockError(Number(id), Number(q));
      if (err) return res.status(422).json({ status: 422, description: err });
    }
  }
  for (const [idStr, qRaw] of Object.entries(updates)) {
    const id = Number(idStr);
    const q = Number(qRaw);
    const line = lines.find((l) => l.variant_id === id);
    if (q <= 0) lines = lines.filter((l) => l.variant_id !== id);
    else if (line) line.quantity = q;
    else lines.unshift({ variant_id: id, quantity: q });
  }
  res.json(cartJson());
});

// Test controls.
app.post("/test/reset", (req, res) => {
  lines = [];
  settingsOverride = req.body.settings || {};
  loadProducts(req.body.stock || {});
  discountsActive = req.body.discounts !== false;
  res.json({ ok: true });
});

app.listen(PORT, () => console.log("harness on " + PORT));
