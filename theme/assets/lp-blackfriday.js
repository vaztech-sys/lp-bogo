/* ==========================================================================
   Malbor Black Friday landing page — states, countdown and cart wiring.

   The offer: 25% off every Professional Line 60ml bottle, 35% off every
   bottle from five up, and one free SiO2 Top Sealant with every bottle.

   Shopify's automatic "buy X get Y" discount prices the free sealant at $0
   only when it is already in the cart; it never adds it. So:

   - every bottle goes into the cart with its sealant in the same
     /cart/add.js call: Marine with a Marine bottle, standard otherwise;
   - after every change made on this page, the cart holds one sealant per
     bottle (never more), and none once the last bottle is gone;
   - the sealant has no quantity controls of its own, only a switch that
     moves one unit between the standard and the Marine version.

   Every price, discount and total in the drawer comes from /cart.js, so the
   savings shown are the ones Shopify actually applied.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.querySelector("[data-lp-page]");
  if (!root) return;

  var config = {};
  try {
    var configEl = document.querySelector("[data-lp-config]");
    config = JSON.parse(configEl ? configEl.textContent : "{}");
  } catch (error) {
    config = {};
  }

  var bottles = {};
  (config.bottles || []).forEach(function (bottle) {
    bottles[bottle.id] = bottle;
  });

  var gift = config.gift || {};
  var giftIds = {};
  if (gift.standard) giftIds[gift.standard] = "standard";
  if (gift.marine) giftIds[gift.marine] = "marine";

  var tier = config.tier || { min: 5, base: 25, bulk: 35 };
  var text = config.text || {};

  var moneyFormat = root.dataset.moneyFormat || "${{amount}}";
  var drawer = root.querySelector("[data-lp-drawer]");
  var itemsEl = root.querySelector("[data-lp-items]");
  var footEl = root.querySelector("[data-lp-foot]");
  var progressEl = root.querySelector("[data-lp-progress]");
  var errorEl = root.querySelector("[data-lp-error]");
  var countEl = root.querySelector("[data-lp-count]");
  var lastFocused = null;
  var lastCart = null;

  /* --- helpers ----------------------------------------------------------- */

  function formatMoney(cents) {
    var value = (cents / 100).toFixed(2);
    var parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var withComma = parts.join(".");
    var withoutDecimals = parts[0];

    return moneyFormat
      .replace(/\{\{\s*amount\s*\}\}/g, withComma)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, withoutDecimals)
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, value.replace(".", ","))
      .replace(/\{\{\s*amount_no_decimals_with_comma_separator\s*\}\}/g, withoutDecimals.replace(/,/g, "."));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function request(url, body) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.description || data.message || "Cart request failed");
        return data;
      });
    });
  }

  function getCart() {
    return fetch("/cart.js", { headers: { Accept: "application/json" } }).then(function (r) {
      return r.json();
    });
  }

  function isBottle(item) {
    return Boolean(bottles[item.variant_id]);
  }

  function isGift(item) {
    return Boolean(giftIds[item.variant_id]);
  }

  function bottleCount(cart) {
    return cart.items.reduce(function (sum, item) {
      return isBottle(item) ? sum + item.quantity : sum;
    }, 0);
  }

  function giftLines(cart) {
    return cart.items.filter(isGift);
  }

  function giftStock(kind) {
    return kind === "marine" ? gift.marineOk : gift.standardOk;
  }

  // How many of a sealant the cart may hold: the stock on hand when Shopify
  // tracks it, otherwise no limit.
  function giftCap(kind) {
    if (!gift[kind] || !giftStock(kind)) return 0;
    var max = kind === "marine" ? gift.marineMax : gift.standardMax;
    return max == null ? Infinity : max;
  }

  // Bottles in the cart by kind, and sealants by version.
  function tally(cart) {
    var t = { marineBottles: 0, otherBottles: 0, standard: 0, marine: 0 };
    cart.items.forEach(function (item) {
      if (isBottle(item)) {
        if (bottles[item.variant_id].marine) t.marineBottles += item.quantity;
        else t.otherBottles += item.quantity;
      } else if (isGift(item)) {
        t[giftIds[item.variant_id]] += item.quantity;
      }
    });
    return t;
  }

  // The sealant that goes with a bottle: the matching version, or the other
  // one if the matching version is out of stock.
  function giftFor(bottleId) {
    var marine = Boolean(bottles[bottleId] && bottles[bottleId].marine);
    var first = marine ? "marine" : "standard";
    var second = marine ? "standard" : "marine";
    var picks = [];
    if (gift[first] && giftStock(first)) picks.push(gift[first]);
    if (gift[second] && giftStock(second)) picks.push(gift[second]);
    return picks;
  }

  /* --- page state -------------------------------------------------------- */

  // soon: before the start; live: during; over/ended: after the end.
  function currentState() {
    var now = Date.now();
    if (config.end && now >= config.end) return config.afterEnd === "ended" ? "ended" : "over";
    if (config.start && now >= config.start) return "live";
    return "soon";
  }

  function applyState(state) {
    root.dataset.lpState = state;

    root.querySelectorAll("[data-lp-add]").forEach(function (button) {
      if (button.dataset.lpBusy === "true") return;
      button.disabled = state !== "live";
      var label = button.querySelector("[data-lp-label]");
      if (!label) return;
      if (state === "live") label.textContent = "Add to cart";
      else if (state === "ended") label.textContent = text.endedButton || "Offer ended";
      else label.textContent = text.soonButton || "Starts Black Friday";
    });

    if (lastCart) renderProgress(lastCart);
  }

  /* --- countdown --------------------------------------------------------- */

  var countdownEl = root.querySelector("[data-lp-countdown]");
  var cdParts = {};
  if (countdownEl) {
    countdownEl.querySelectorAll("[data-lp-cd]").forEach(function (el) {
      cdParts[el.dataset.lpCd] = el;
    });
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function tick() {
    var state = currentState();
    if (state !== root.dataset.lpState) applyState(state);

    if (!countdownEl) return;
    var target = state === "soon" ? config.start : state === "live" ? config.end : 0;
    if (!target) {
      countdownEl.hidden = true;
      return;
    }

    countdownEl.hidden = false;
    var left = Math.max(0, Math.floor((target - Date.now()) / 1000));
    var d = Math.floor(left / 86400);
    var h = Math.floor((left % 86400) / 3600);
    var m = Math.floor((left % 3600) / 60);
    var s = left % 60;
    if (cdParts.d) cdParts.d.textContent = pad(d);
    if (cdParts.h) cdParts.h.textContent = pad(h);
    if (cdParts.m) cdParts.m.textContent = pad(m);
    if (cdParts.s) cdParts.s.textContent = pad(s);
    countdownEl.setAttribute(
      "aria-label",
      (state === "soon" ? "Starts in " : "Ends in ") + d + " days " + h + " hours " + m + " minutes"
    );
  }

  /* --- free sealant sync ------------------------------------------------- */

  // A sealant becomes this page's responsibility once it shares the cart with
  // a bottle. Before that it may be one the shopper bought at full price
  // elsewhere in the store, and the page leaves it alone.
  var adopted = false;

  // Work out how many of each sealant the cart should hold:
  // - one per bottle in total, never more;
  // - when there are too many (a bottle was removed), drop first the version
  //   that outnumbers its own bottles, so a shopper's switch is kept;
  // - when there are too few (live offer only), add the matching version,
  //   or the other one if the matching one is out of stock or capped.
  function wantedGifts(t, live) {
    var bottlesTotal = t.marineBottles + t.otherBottles;
    var want = { standard: t.standard, marine: t.marine };
    var excess = want.standard + want.marine - bottlesTotal;

    if (excess > 0) {
      ["standard", "marine"].forEach(function (kind) {
        var own = kind === "marine" ? t.marineBottles : t.otherBottles;
        var drop = Math.min(excess, Math.max(0, want[kind] - own));
        want[kind] -= drop;
        excess -= drop;
      });
      ["standard", "marine"].forEach(function (kind) {
        var drop = Math.min(excess, want[kind]);
        want[kind] -= drop;
        excess -= drop;
      });
    }

    var missing = bottlesTotal - want.standard - want.marine;
    if (missing > 0 && live) {
      var needs = [
        ["marine", Math.max(0, t.marineBottles - want.marine)],
        ["standard", Math.max(0, t.otherBottles - want.standard)],
      ];
      needs.forEach(function (pair) {
        var kind = pair[0];
        var other = kind === "marine" ? "standard" : "marine";
        var need = Math.min(pair[1], missing);
        var own = Math.min(need, Math.max(0, giftCap(kind) - want[kind]));
        want[kind] += own;
        missing -= own;
        var rest = Math.min(need - own, Math.max(0, giftCap(other) - want[other]));
        want[other] += rest;
        missing -= rest;
      });
    }
    return want;
  }

  // Bring the cart in line with wantedGifts. Resolves with the cart as it
  // stands afterwards. If Shopify refuses (a sealant just sold out) the cart
  // is left as it is.
  function syncGift(cart) {
    var t = tally(cart);
    var bottlesTotal = t.marineBottles + t.otherBottles;
    var haveGifts = t.standard + t.marine;

    if (bottlesTotal === 0) {
      if (!adopted || !haveGifts) return Promise.resolve(cart);
      adopted = false;
    } else {
      adopted = true;
    }

    var want = bottlesTotal === 0 ? { standard: 0, marine: 0 } : wantedGifts(t, root.dataset.lpState === "live");
    var updates = {};
    var changed = false;
    ["standard", "marine"].forEach(function (kind) {
      if (gift[kind] && want[kind] !== t[kind]) {
        updates[gift[kind]] = want[kind];
        changed = true;
      }
    });

    if (!changed) return Promise.resolve(cart);

    return request("/cart/update.js", { updates: updates }).catch(function () {
      return getCart();
    });
  }

  /* --- rendering --------------------------------------------------------- */

  function renderCount(cart) {
    if (!countEl) return;
    countEl.textContent = cart.item_count;
    countEl.hidden = cart.item_count === 0;
  }

  function renderProgress(cart) {
    if (!progressEl) return;
    var count = bottleCount(cart);
    if (!count || root.dataset.lpState !== "live") {
      progressEl.hidden = true;
      progressEl.innerHTML = "";
      return;
    }

    var done = count >= tier.min;
    var pct = Math.min(100, Math.round((count / tier.min) * 100));
    var more = tier.min - count;
    var message = done
      ? tier.bulk + "% off unlocked on every bottle"
      : "Add " + more + " more for " + tier.bulk + "% off";

    progressEl.hidden = false;
    progressEl.innerHTML =
      '<p class="lp-progress__text">' + escapeHtml(message) + "</p>" +
      '<div class="lp-progress__bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + tier.min +
      '" aria-valuenow="' + Math.min(count, tier.min) + '" aria-label="Bottles toward ' + tier.bulk + '% off">' +
      '<span style="width:' + pct + '%"></span></div>' +
      '<p class="lp-progress__meta">' + count + " of " + tier.min + " bottles · " +
      (done ? tier.bulk : tier.base) + "% off now</p>";
  }

  function lineImage(item) {
    if (!item.image) return "";
    var src = item.image + (item.image.indexOf("?") === -1 ? "?" : "&") + "width=144";
    return '<img src="' + escapeHtml(src) + '" alt="" loading="lazy" width="64" height="64">';
  }

  function renderItems(cart) {
    if (!itemsEl) return;

    if (!cart.items.length) {
      itemsEl.innerHTML =
        '<div class="lp-drawer__empty"><p>Your cart is empty.<br>Pick a coating to get started.</p></div>';
      return;
    }

    var bottlesInCart = bottleCount(cart) > 0;

    itemsEl.innerHTML = cart.items
      .map(function (item, index) {
        var discounted = item.original_line_price > item.final_line_price;
        var free = isGift(item) && bottlesInCart;
        var controls;

        if (free) {
          var kind = giftIds[item.variant_id];
          var other = kind === "marine" ? "standard" : "marine";
          var counts = tally(cart);
          var canSwitch = counts[other] < giftCap(other);
          controls =
            '<p class="lp-line__gift">Free with your bottles &times; ' + item.quantity + "</p>" +
            (canSwitch
              ? '<button type="button" class="lp-line__switch" data-lp-switch="' + gift[other] + '" data-lp-switch-from="' +
                item.variant_id + '">Switch one to ' + (other === "marine" ? "Marine" : "standard") + "</button>"
              : "");
        } else {
          controls =
            '<div class="lp-line__controls">' +
            '<div class="lp-qty">' +
            '<button type="button" data-lp-qty="' + (item.quantity - 1) + '" aria-label="Decrease quantity of ' +
            escapeHtml(item.product_title) + '">&minus;</button>' +
            "<span>" + item.quantity + "</span>" +
            '<button type="button" data-lp-qty="' + (item.quantity + 1) + '" aria-label="Increase quantity of ' +
            escapeHtml(item.product_title) + '">+</button>' +
            "</div>" +
            '<button type="button" class="lp-line__remove" data-lp-qty="0">Remove</button>' +
            "</div>";
        }

        var priceHtml = free && item.final_line_price === 0
          ? "FREE"
          : formatMoney(item.final_line_price);

        return (
          '<div class="lp-line" data-lp-line="' + (index + 1) + '">' +
          '<div class="lp-line__media">' + lineImage(item) + "</div>" +
          '<div class="lp-line__info">' +
          '<p class="lp-line__title">' + escapeHtml(item.product_title) + "</p>" +
          controls +
          "</div>" +
          '<div class="lp-line__price">' +
          "<p" + (free ? ' class="lp-line__free"' : "") + ">" + priceHtml + "</p>" +
          (discounted ? "<s>" + formatMoney(item.original_line_price) + "</s>" : "") +
          "</div></div>"
        );
      })
      .join("");
  }

  function renderFoot(cart) {
    if (!footEl) return;

    if (!cart.items.length) {
      footEl.hidden = true;
      footEl.innerHTML = "";
      return;
    }

    footEl.hidden = false;

    // Shopify's own figure: what the automatic discounts really took off.
    var savings = cart.total_discount;
    var savingsBlock = savings
      ? '<div class="lp-savings"><p>Black Friday savings</p><p class="lp-savings__amount">&minus;' +
        formatMoney(savings) + "</p></div>"
      : "";

    footEl.innerHTML =
      savingsBlock +
      '<dl class="lp-subtotal"><dt>Subtotal</dt><dd>' + formatMoney(cart.total_price) + "</dd></dl>" +
      '<p class="lp-drawer__note">Local pickup or shipping at checkout · Taxes calculated at checkout</p>' +
      '<a class="lp-btn lp-btn--block" href="/checkout">CHECKOUT</a>';
  }

  function render(cart) {
    lastCart = cart;
    renderCount(cart);
    renderProgress(cart);
    renderItems(cart);
    renderFoot(cart);
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message || "";
    errorEl.hidden = !message;
  }

  /* --- drawer open/close ------------------------------------------------- */

  function openDrawer() {
    if (isOpen()) return;
    lastFocused = document.activeElement;
    root.dataset.cartOpen = "true";
    document.body.style.overflow = "hidden";
    var close = drawer && drawer.querySelector("[data-lp-close]");
    if (close) close.focus();
  }

  function closeDrawer() {
    root.dataset.cartOpen = "false";
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    lastFocused = null;
  }

  function isOpen() {
    return root.dataset.cartOpen === "true";
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || !isOpen() || !drawer) return;
    var focusable = drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* --- add to cart ------------------------------------------------------- */

  function setButtonState(button, state) {
    var label = button.querySelector("[data-lp-label]");
    var icon = button.querySelector("[data-lp-icon]");
    if (!label) return;

    button.classList.toggle("lp-btn--added", state === "added");
    button.dataset.lpBusy = state === "adding" ? "true" : "false";
    button.disabled = state === "adding" || root.dataset.lpState !== "live";

    if (state === "adding") {
      label.textContent = "Adding…";
      if (icon) {
        icon.hidden = false;
        icon.innerHTML =
          '<svg class="lp-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
          '<circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="2" stroke-dasharray="10 8"/></svg>';
      }
    } else if (state === "added") {
      label.textContent = "Added";
      if (icon) {
        icon.hidden = false;
        icon.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
          '<path d="M2 7l3.5 3.5L12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }
    } else {
      label.textContent = "Add to cart";
      if (icon) {
        icon.hidden = true;
        icon.innerHTML = "";
      }
    }
  }

  function announce(message) {
    var live = root.querySelector("[data-lp-live]");
    if (live) live.textContent = message;
  }

  // Try each payload in turn. /cart/add.js is all-or-nothing, so a sealant
  // that sold out a second ago would otherwise block the bottle as well.
  function addFirstThatWorks(payloads) {
    var attempt = payloads.shift();
    return request("/cart/add.js", { items: attempt }).catch(function (error) {
      if (!payloads.length) throw error;
      return addFirstThatWorks(payloads);
    });
  }

  function addToCart(button) {
    var variantId = Number(button.dataset.lpAdd);
    if (!variantId || button.disabled || root.dataset.lpState !== "live") return;

    setButtonState(button, "adding");
    showError("");

    getCart()
      .then(function (cart) {
        var bottle = { id: variantId, quantity: 1 };
        var payloads = [];

        // One click, two items: every bottle brings its sealant along, as
        // long as the sealant has stock left and the cart does not already
        // hold more sealants than bottles.
        var t = tally(cart);
        if (t.standard + t.marine <= t.marineBottles + t.otherBottles) {
          giftFor(variantId).forEach(function (giftId) {
            var kind = giftIds[giftId];
            if (t[kind] < giftCap(kind)) payloads.push([bottle, { id: giftId, quantity: 1 }]);
          });
        }
        payloads.push([bottle]);
        return addFirstThatWorks(payloads);
      })
      .then(getCart)
      .then(syncGift)
      .then(function (cart) {
        render(cart);
        setButtonState(button, "added");
        announce(button.dataset.lpAddLabel + " added to cart.");
        openDrawer();
        setTimeout(function () {
          setButtonState(button, "idle");
        }, 1600);
      })
      .catch(function (error) {
        setButtonState(button, "idle");
        var message = "Could not add to cart. " + error.message;
        announce(message);
        showError(message);
        getCart().then(render);
        openDrawer();
      });
  }

  function busy(promise) {
    if (drawer) drawer.setAttribute("aria-busy", "true");
    showError("");
    return promise
      .then(render)
      .catch(function (error) {
        var message = "Could not update cart. " + error.message;
        announce(message);
        showError(message);
        return getCart().then(render);
      })
      .then(function () {
        if (drawer) drawer.removeAttribute("aria-busy");
      });
  }

  function changeQty(lineIndex, quantity) {
    busy(
      request("/cart/change.js", { line: Number(lineIndex), quantity: Number(quantity) }).then(syncGift)
    );
  }

  // Move one free unit from one version to the other.
  function switchGift(fromId, toId) {
    var cart = lastCart;
    if (!cart) return;
    var t = tally(cart);
    var updates = {};
    updates[fromId] = t[giftIds[fromId]] - 1;
    updates[toId] = t[giftIds[toId]] + 1;
    busy(request("/cart/update.js", { updates: updates }).then(syncGift));
  }

  /* --- product filter ---------------------------------------------------- */

  var groupsEl = root.querySelector("[data-lp-groups]");

  function setFilter(value) {
    if (!groupsEl) return;
    groupsEl.dataset.lpActive = value;
    root.querySelectorAll("[data-lp-filter]").forEach(function (link) {
      if (link.dataset.lpFilter === value) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  /* --- events ------------------------------------------------------------ */

  root.addEventListener("click", function (event) {
    var addBtn = event.target.closest("[data-lp-add]");
    if (addBtn) {
      event.preventDefault();
      addToCart(addBtn);
      return;
    }

    var filter = event.target.closest("[data-lp-filter]");
    if (filter) {
      event.preventDefault();
      setFilter(filter.dataset.lpFilter);
      return;
    }

    if (event.target.closest("[data-lp-open]")) {
      event.preventDefault();
      openDrawer();
      return;
    }

    if (event.target.closest("[data-lp-close]") || event.target.closest("[data-lp-backdrop]")) {
      event.preventDefault();
      closeDrawer();
      return;
    }

    var switchBtn = event.target.closest("[data-lp-switch]");
    if (switchBtn) {
      event.preventDefault();
      switchGift(Number(switchBtn.dataset.lpSwitchFrom), Number(switchBtn.dataset.lpSwitch));
      return;
    }

    var qtyBtn = event.target.closest("[data-lp-qty]");
    if (qtyBtn) {
      event.preventDefault();
      var line = qtyBtn.closest("[data-lp-line]");
      if (line) changeQty(line.dataset.lpLine, qtyBtn.dataset.lpQty);
      return;
    }

    // Smooth in-page navigation.
    var link = event.target.closest('a[href^="#"]');
    if (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) closeDrawer();
    trapFocus(event);
  });

  /* --- init -------------------------------------------------------------- */

  applyState(currentState());
  tick();
  setInterval(tick, 1000);

  // On load: adopt sealants already sitting next to bottles, and tidy the
  // cart if it breaks the one-per-bottle rule (e.g. changed on the cart page).
  getCart()
    .then(function (cart) {
      if (bottleCount(cart) > 0 && giftLines(cart).length) adopted = true;
      return bottleCount(cart) > 0 ? syncGift(cart) : cart;
    })
    .then(render)
    .catch(function () {
      /* An unreachable cart leaves the server-rendered state. */
    });
})();
