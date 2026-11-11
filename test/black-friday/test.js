// End-to-end checks of the Black Friday page against the local harness.
// Writes evidence (cart JSON and screenshots) to ./evidence.

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = "http://localhost:4410";
const OUT = path.join(__dirname, "evidence");
fs.mkdirSync(OUT, { recursive: true });

const LIVE = { start_at: "2026-11-01 00:00", end_at: "2026-12-31 23:59" };
const ENDED = { start_at: "2026-11-01 00:00", end_at: "2026-11-02 00:00", after_end: "ended" };
const OVER = { start_at: "2026-11-01 00:00", end_at: "2026-11-02 00:00", after_end: "soon" };

const V = {
  sp9: 50503904559424,
  sp9m: 50503946633536,
  black: 50503909343552,
  blackm: 50503947780416,
  glass: 50577710022976,
  leather: 50577714217280,
  plastic: 50577721524544,
  sio2: 50489274302784,
  sio2m: 50673082204480,
};

const FONT_CSS = `
@font-face{font-family:Montserrat;font-style:normal;font-weight:700;src:url(${BASE}/fonts/montserrat/files/montserrat-latin-700-normal.woff2)}
@font-face{font-family:Montserrat;font-style:normal;font-weight:800;src:url(${BASE}/fonts/montserrat/files/montserrat-latin-800-normal.woff2)}
@font-face{font-family:Montserrat;font-style:italic;font-weight:800;src:url(${BASE}/fonts/montserrat/files/montserrat-latin-800-italic.woff2)}
@font-face{font-family:Montserrat;font-style:italic;font-weight:900;src:url(${BASE}/fonts/montserrat/files/montserrat-latin-900-italic.woff2)}
@font-face{font-family:Poppins;font-style:normal;font-weight:400;src:url(${BASE}/fonts/poppins/files/poppins-latin-400-normal.woff2)}
@font-face{font-family:Poppins;font-style:normal;font-weight:500;src:url(${BASE}/fonts/poppins/files/poppins-latin-500-normal.woff2)}
@font-face{font-family:Poppins;font-style:normal;font-weight:600;src:url(${BASE}/fonts/poppins/files/poppins-latin-600-normal.woff2)}`;

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: Boolean(ok), detail });
  console.log((ok ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : ""));
}

async function reset(body) {
  await fetch(BASE + "/test/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
}

async function cart() {
  return (await fetch(BASE + "/cart.js")).json();
}

function summary(c) {
  return c.items.map((i) => ({
    title: i.product_title,
    qty: i.quantity,
    original: i.original_line_price / 100,
    final: i.final_line_price / 100,
    discounts: i.line_level_discount_allocations.map((a) => a.title),
  }));
}

function save(name, data) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2));
}

async function newPage(browser, opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 375, height: 812 },
    deviceScaleFactor: opts.scale || 1,
    javaScriptEnabled: opts.js !== false,
    ignoreHTTPSErrors: true,
  });
  await ctx.route("https://fonts.googleapis.com/**", (r) =>
    r.fulfill({ status: 200, contentType: "text/css", body: FONT_CSS })
  );
  await ctx.route("https://fonts.gstatic.com/**", (r) => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", (e) => check("no JS errors", false, e.message));
  return page;
}

async function addFromCard(page, variantId) {
  await page.keyboard.press("Escape");
  const button = page.locator(`[data-lp-add="${variantId}"]`).first();
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await page.waitForFunction(
    (id) => {
      const b = document.querySelector(`[data-lp-add="${id}"]`);
      return b && b.dataset.lpBusy !== "true";
    },
    variantId
  );
  await page.waitForTimeout(250);
}

(async () => {
  const browser = await chromium.launch({
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } : undefined,
  });

  /* 1. Coming soon -------------------------------------------------------- */
  await reset({ settings: {} });
  let page = await newPage(browser, { scale: 2 });
  await page.goto(BASE + "/?utm_source=instagram&utm_medium=social&utm_campaign=blackfriday_nov2026&utm_content=w3-st-launch");
  await page.waitForTimeout(1500);
  check("soon: state attribute", (await page.getAttribute("[data-lp-page]", "data-lp-state")) === "soon");
  const soonBtn = page.locator(`[data-lp-add="${V.sp9}"]`).first();
  check("soon: Add to cart disabled", await soonBtn.isDisabled());
  check("soon: button text", (await soonBtn.textContent()).trim() === "Starts Black Friday", await soonBtn.textContent());
  check("soon: countdown visible", await page.locator("[data-lp-countdown]").isVisible());
  check("soon: countdown label", (await page.locator(".lp-countdown__label span:visible").textContent()).trim() === "Starts in");
  check("soon: full price only", await page.locator(".lp-price--deal").first().isHidden());
  check("soon: offer line", (await page.locator(".lp-hero__offer").innerText()).includes("25% off · 35% when you buy 5 · free SiO2 Top Sealant"));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("375px: no horizontal scroll", overflow <= 0, "overflow " + overflow + "px");
  await page.screenshot({ path: path.join(OUT, "soon-375-fold.png") });
  await page.screenshot({ path: path.join(OUT, "soon-375-full.png"), fullPage: true });
  await page.close();

  page = await newPage(browser, { viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, "soon-1440-full.png"), fullPage: true });
  await page.close();

  /* 2. Live: one bottle --------------------------------------------------- */
  await reset({ settings: LIVE });
  page = await newPage(browser, { scale: 2 });
  await page.goto(BASE + "/");
  await page.waitForTimeout(800);
  check("live: state attribute", (await page.getAttribute("[data-lp-page]", "data-lp-state")) === "live");
  check("live: countdown label", (await page.locator(".lp-countdown__label span:visible").textContent()).trim() === "Ends in");
  check("live: discounted price preview", (await page.locator(".lp-price--deal").first().innerText()).includes("$71.25"));
  await page.screenshot({ path: path.join(OUT, "live-375-fold.png") });

  await addFromCard(page, V.sp9);
  let c = await cart();
  save("cart-1-bottle.json", c);
  const bottle = c.items.find((i) => i.variant_id === V.sp9);
  const giftLine = c.items.find((i) => i.variant_id === V.sio2);
  check("1 bottle: 25% on the line", bottle && bottle.final_line_price === 7125, JSON.stringify(summary(c)));
  check("1 bottle: SiO2 standard at $0", giftLine && giftLine.final_line_price === 0);
  check("1 bottle: one request added both", c.items.length === 2);
  check(
    "drawer: progress text",
    (await page.locator("[data-lp-progress]").innerText()).includes("Add 4 more for 35% off")
  );
  check("drawer: gift shows FREE", (await page.locator(".lp-line__free").innerText()).trim() === "FREE");
  check(
    "drawer: savings = Shopify total_discount",
    (await page.locator(".lp-savings__amount").innerText()).includes("$62.75"),
    await page.locator(".lp-savings__amount").innerText()
  );
  await page.screenshot({ path: path.join(OUT, "live-375-drawer-1-bottle.png") });

  /* 3. Five mixed bottles ------------------------------------------------- */
  for (const id of [V.black, V.glass, V.leather, V.plastic]) await addFromCard(page, id);
  c = await cart();
  save("cart-5-mixed.json", c);
  const bottles = c.items.filter((i) => i.variant_id !== V.sio2 && i.variant_id !== V.sio2m);
  const all35 = bottles.every((i) => i.final_line_price === Math.round(i.original_line_price * 0.65));
  const gifts = c.items.filter((i) => i.variant_id === V.sio2 || i.variant_id === V.sio2m);
  check("5 mixed: 35% on every bottle", bottles.length === 5 && all35, JSON.stringify(summary(c)));
  check("5 mixed: exactly one SiO2, at $0", gifts.length === 1 && gifts[0].quantity === 1 && gifts[0].final_line_price === 0);
  check("drawer: 35% unlocked", (await page.locator("[data-lp-progress]").innerText()).includes("35% off unlocked"));
  check("drawer: gift has no quantity controls", (await page.locator(".lp-line", { hasText: "SIO2 Top Sealant" }).locator("[data-lp-qty]").count()) === 0);
  await page.screenshot({ path: path.join(OUT, "live-375-drawer-5-bottles.png") });

  /* 4. Switch the free sealant -------------------------------------------- */
  await page.locator("[data-lp-switch]").click();
  await page.waitForTimeout(500);
  c = await cart();
  const g2 = c.items.filter((i) => i.variant_id === V.sio2 || i.variant_id === V.sio2m);
  check("switch: now the Marine sealant, still one, still $0", g2.length === 1 && g2[0].variant_id === V.sio2m && g2[0].final_line_price === 0);

  /* 5. Remove every bottle: the sealant goes too ------------------------- */
  for (let n = 0; n < 6; n++) {
    const remove = page.locator(".lp-line__remove").first();
    if (!(await remove.count())) break;
    await remove.click();
    await page.waitForFunction(() => !document.querySelector("[data-lp-drawer][aria-busy]"));
    await page.waitForTimeout(250);
  }
  c = await cart();
  save("cart-after-removing-bottles.json", c);
  check("remove all bottles: cart empty, SiO2 gone", c.items.length === 0, JSON.stringify(summary(c)));
  await page.close();

  /* 6. Marine bottle first ------------------------------------------------ */
  await reset({ settings: LIVE });
  page = await newPage(browser);
  await page.goto(BASE + "/");
  await addFromCard(page, V.sp9m);
  await addFromCard(page, V.sp9);
  c = await cart();
  save("cart-marine-first.json", c);
  const gm = c.items.filter((i) => i.variant_id === V.sio2 || i.variant_id === V.sio2m);
  check("marine first: SiO2 Marine, only one", gm.length === 1 && gm[0].variant_id === V.sio2m, JSON.stringify(summary(c)));
  await page.close();

  /* 7. Matching sealant sold out: the other one is used ------------------ */
  await reset({ settings: LIVE, stock: { "sio2-top-sealant-473ml": 0 } });
  page = await newPage(browser);
  await page.goto(BASE + "/");
  await addFromCard(page, V.sp9);
  c = await cart();
  check("standard sealant sold out: Marine one goes in", c.items.some((i) => i.variant_id === V.sio2m));
  await page.close();

  /* 8. Both sold out: no promise, bottle still sells --------------------- */
  await reset({ settings: LIVE, stock: { "sio2-top-sealant-473ml": 0, "sio2-top-sealant-473ml-marine": 0 } });
  page = await newPage(browser);
  await page.goto(BASE + "/");
  check("both sold out: notice shown", (await page.locator(".lp-hero .lp-notice").innerText()).includes("Free SiO2 while supplies last: sold out"));
  check("both sold out: offer line drops the free item", !(await page.locator(".lp-hero__offer").innerText()).includes("SiO2"));
  await addFromCard(page, V.sp9);
  c = await cart();
  check("both sold out: bottle added alone", c.items.length === 1 && c.items[0].variant_id === V.sp9);
  await page.close();

  /* 9. Sealant sells out between page load and click --------------------- */
  await reset({ settings: LIVE });
  page = await newPage(browser);
  await page.goto(BASE + "/");
  await fetch(BASE + "/test/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings: LIVE, stock: { "sio2-top-sealant-473ml": 0 } }),
  });
  await addFromCard(page, V.sp9);
  c = await cart();
  check("sealant sold out mid-session: bottle still added, Marine sealant instead", c.items.some((i) => i.variant_id === V.sp9) && c.items.some((i) => i.variant_id === V.sio2m), JSON.stringify(summary(c)));
  await page.close();

  /* 10. No JavaScript ---------------------------------------------------- */
  await reset({ settings: LIVE });
  fs.writeFileSync(path.join(__dirname, "form-posts.log"), "");
  page = await newPage(browser, { js: false });
  await page.goto(BASE + "/");
  await page.locator(`[data-lp-add="${V.blackm}"]`).first().click();
  await page.waitForURL("**/cart");
  c = await cart();
  save("cart-no-js.json", c);
  save("form-post-no-js.json", fs.readFileSync(path.join(__dirname, "form-posts.log"), "utf8").trim().split("\n").map(JSON.parse));
  check("no JS: form adds bottle + matching sealant", c.items.length === 2 && c.items.some((i) => i.variant_id === V.blackm) && c.items.some((i) => i.variant_id === V.sio2m && i.final_line_price === 0), JSON.stringify(summary(c)));
  await page.goto(BASE + "/");
  await page.locator(`[data-lp-add="${V.glass}"]`).first().click();
  await page.waitForURL("**/cart");
  c = await cart();
  const ng = c.items.filter((i) => i.variant_id === V.sio2 || i.variant_id === V.sio2m);
  check("no JS: second bottle does not add a second sealant", ng.length === 1 && ng[0].quantity === 1);
  await page.close();

  /* 11. After the end ---------------------------------------------------- */
  await reset({ settings: ENDED });
  page = await newPage(browser, { scale: 2 });
  await page.goto(BASE + "/");
  await page.waitForTimeout(500);
  check("ended: message", await page.locator(".lp-ended").isVisible());
  check("ended: buttons disabled 'Offer ended'", (await page.locator(`[data-lp-add="${V.sp9}"]`).first().textContent()).trim() === "Offer ended");
  check("ended: no countdown", await page.locator("[data-lp-countdown]").isHidden());
  await page.screenshot({ path: path.join(OUT, "ended-375-fold.png") });
  await page.close();

  await reset({ settings: OVER });
  page = await newPage(browser);
  await page.goto(BASE + "/");
  await page.waitForTimeout(500);
  check("over (coming soon, no dates): no countdown, no seal", (await page.locator("[data-lp-countdown]").isHidden()) && (await page.locator(".lp-seal").isHidden()));
  check("over: buttons disabled", await page.locator(`[data-lp-add="${V.sp9}"]`).first().isDisabled());
  await page.close();

  /* 12. Desktop, live ---------------------------------------------------- */
  await reset({ settings: LIVE });
  page = await newPage(browser, { viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, "live-1440-full.png"), fullPage: true });
  await page.locator('[data-lp-filter="boat"]').click();
  await page.waitForTimeout(300);
  check("filter: Boat shows only the Boat group", (await page.locator('[data-lp-group="car"]').isHidden()) && (await page.locator('[data-lp-group="boat"]').isVisible()));
  await page.close();

  await browser.close();
  save("results.json", results);
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
})();
