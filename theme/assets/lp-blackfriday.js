/* ==========================================================================
   Malbor Boat Show landing page — cart wiring.

   Every figure in the drawer comes from /cart.js, so the savings shown are the
   ones the automatic Buy X Get Y discounts really applied.

   The offer is "buy the gallon, get the small size free". Shopify's automatic
   Buy X Get Y discount only prices the free item at $0 when it is already in
   the cart; it never adds it. So each Add to Cart sends the gallon AND its free
   size, and after every cart change the free size is set back to its gallon's
   quantity. The BOGO page added a single unit and its discount was never used.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.querySelector("[data-lp-page]");
  if (!root) return;

  // Gallon variant id -> free-size variant id, rendered by the section.
  var giftFor = {};
  var gallonFor = {};
  try {
    var pairsEl = document.querySelector("[data-lp-pairs]");
    JSON.parse(pairsEl ? pairsEl.textContent : "[]").forEach(function (pair) {
      giftFor[pair.gallon] = pair.gift;
      gallonFor[pair.gift] = pair.gallon;
    });
  } catch (error) {
    /* Without the pairs the drawer still works; it just stops syncing. */
  }

  var moneyFormat = root.dataset.moneyFormat || "${{amount}}";
  var drawer = root.querySelector("[data-lp-drawer]");
  var itemsEl = root.querySelector("[data-lp-items]");
  var footEl = root.querySelector("[data-lp-foot]");
  var countEl = root.querySelector("[data-lp-count]");
  var lastFocused = null;

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
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, value.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d),)/g, "."))
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

  /* --- rendering --------------------------------------------------------- */

  function renderCount(cart) {
    if (!countEl) return;
    countEl.textContent = cart.item_count;
    countEl.hidden = cart.item_count === 0;
  }

  function renderItems(cart) {
    if (!itemsEl) return;

    if (!cart.items.length) {
      itemsEl.innerHTML =
        '<div class="lp-drawer__empty">' +
        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">' +
        '<path d="M8 8H12L16 32H36L40 16H16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="20" cy="38" r="2" fill="currentColor"/><circle cx="34" cy="38" r="2" fill="currentColor"/>' +
        "</svg>" +
        "<p>Your cart is empty.<br>Add a gallon to get started.</p>" +
        "</div>";
      return;
    }

    itemsEl.innerHTML = cart.items
      .map(function (item, index) {
        // line_price is post-discount; original_line_price is pre-discount.
        var discounted = item.original_line_price > item.line_price;
        var free = discounted && item.line_price === 0;
        // A free size that rides on a gallon in this cart follows the gallon's
        // quantity, so it gets no controls of its own.
        var gallonId = gallonFor[item.variant_id];
        var pinned = Boolean(gallonId) && cart.items.some(function (other) {
          return other.variant_id === gallonId;
        });
        var image = item.image
          ? '<img src="' + escapeHtml(item.image.replace(/(\.[a-z]+)(\?|$)/i, "_144x$1$2")) + '" alt="" loading="lazy">'
          : "";

        return (
          '<div class="lp-line" data-lp-line="' + (index + 1) + '">' +
          '<div class="lp-line__media">' + image + "</div>" +
          '<div class="lp-line__info">' +
          '<p class="lp-line__title">' + escapeHtml(item.product_title) + "</p>" +
          (item.variant_title
            ? '<p class="lp-line__variant">' + escapeHtml(item.variant_title) + "</p>"
            : "") +
          (pinned
            ? '<p class="lp-line__gift">Free with your gallon &times; ' + item.quantity + "</p>"
            : '<div class="lp-line__controls">' +
          '<div class="lp-qty">' +
          '<button type="button" data-lp-qty="' + (item.quantity - 1) + '" aria-label="Decrease quantity of ' + escapeHtml(item.product_title) + '">&minus;</button>' +
          "<span>" + item.quantity + "</span>" +
          '<button type="button" data-lp-qty="' + (item.quantity + 1) + '" aria-label="Increase quantity of ' + escapeHtml(item.product_title) + '">+</button>' +
          "</div>" +
          '<button type="button" class="lp-line__remove" data-lp-qty="0">Remove</button>' +
          "</div>") +
          "</div>" +
          '<div class="lp-line__price">' +
          "<p>" + (free ? "FREE" : formatMoney(item.line_price)) + "</p>" +
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

    // Shopify reports the real savings from the automatic Buy X Get Y discounts.
    var savings = cart.total_discount;
    var savingsBlock = savings
      ? '<div class="lp-savings">' +
        '<p class="lp-savings__label">Free size savings applied</p>' +
        '<p class="lp-savings__amount">&minus;' + formatMoney(savings) + "</p>" +
        "</div>"
      : "";

    footEl.innerHTML =
      savingsBlock +
      '<dl class="lp-subtotal"><dt>Subtotal</dt><dd>' + formatMoney(cart.total_price) + "</dd></dl>" +
      '<p class="lp-drawer__note">Shipping &amp; taxes calculated at checkout</p>' +
      '<a class="lp-btn lp-btn--block" href="/checkout">CHECKOUT</a>';
  }

  function render(cart) {
    renderCount(cart);
    renderItems(cart);
    renderFoot(cart);
  }

  /* --- drawer open/close ------------------------------------------------- */

  function openDrawer() {
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

  // Keep Tab inside the drawer while it is open.
  function trapFocus(event) {
    if (event.key !== "Tab" || !isOpen() || !drawer) return;

    var focusable = drawer.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
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

  /* --- free-size sync ---------------------------------------------------- */

  // Free sizes this page is responsible for: a pair is adopted the first time
  // its gallon is in the cart. Until then the free size is the shopper's own —
  // a small size bought on its own must not be swept out of the cart because
  // some other gallon was added.
  var adopted = {};

  // Set every adopted free size to its gallon's quantity. Resolves with the
  // cart as it stands afterwards. If Shopify refuses (free size out of stock)
  // the cart is left as it is: the gallon still sells, and the card already
  // says the free size is being restocked.
  function syncGifts(cart) {
    var qtyOf = {};
    cart.items.forEach(function (item) {
      qtyOf[item.variant_id] = (qtyOf[item.variant_id] || 0) + item.quantity;
    });

    var updates = {};
    var changed = false;
    Object.keys(giftFor).forEach(function (gallonId) {
      var giftId = giftFor[gallonId];
      var want = qtyOf[gallonId] || 0;
      var have = qtyOf[giftId] || 0;

      if (want > 0) adopted[giftId] = true;
      // want === 0 on a pair this page never adopted means the gallon is not
      // here and never was: leave the free size alone.
      if (want === 0 && !adopted[giftId]) return;

      if (want !== have) {
        updates[giftId] = want;
        changed = true;
      }
      if (want === 0) delete adopted[giftId];
    });

    if (!changed) return Promise.resolve(cart);

    return request("/cart/update.js", { updates: updates }).catch(function () {
      return getCart();
    });
  }

  /* --- add to cart ------------------------------------------------------- */

  function setButtonState(button, state) {
    var label = button.querySelector("[data-lp-label]");
    var icon = button.querySelector("[data-lp-icon]");
    if (!label) return;

    button.classList.toggle("lp-btn--added", state === "added");
    button.disabled = state === "adding";

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
      label.textContent = "Add to Cart";
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

  function addToCart(button) {
    var variantId = button.dataset.lpAdd;
    if (!variantId || button.disabled) return;

    // The gallon alone. /cart/add.js is atomic, so sending the pair meant a
    // free size that sold out mid-campaign failed the whole request and the
    // shopper could not add the gallon either. syncGifts raises the free size
    // to the gallon's quantity straight after, which is also idempotent: it
    // never stacks a second free unit on a gallon added twice.
    var items = [{ id: Number(variantId), quantity: 1 }];

    setButtonState(button, "adding");

    request("/cart/add.js", { items: items })
      .then(getCart)
      .then(syncGifts)
      .then(function (cart) {
        render(cart);
        setButtonState(button, "added");
        announce(button.dataset.lpAddLabel + " added to cart.");
        setTimeout(function () {
          setButtonState(button, "idle");
        }, 1600);
      })
      .catch(function (error) {
        setButtonState(button, "idle");
        announce("Could not add to cart. " + error.message);
      });
  }

  function changeQty(lineIndex, quantity) {
    if (drawer) drawer.setAttribute("aria-busy", "true");

    request("/cart/change.js", { line: Number(lineIndex), quantity: Number(quantity) })
      .then(syncGifts)
      .then(function (cart) {
        render(cart);
      })
      .catch(function (error) {
        announce("Could not update cart. " + error.message);
      })
      .then(function () {
        if (drawer) drawer.removeAttribute("aria-busy");
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

    var qtyBtn = event.target.closest("[data-lp-qty]");
    if (qtyBtn) {
      event.preventDefault();
      var line = qtyBtn.closest("[data-lp-line]");
      if (line) changeQty(line.dataset.lpLine, qtyBtn.dataset.lpQty);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) closeDrawer();
    trapFocus(event);
  });

  // Smooth in-page navigation without letting the URL hash jump the page.
  root.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* --- init -------------------------------------------------------------- */

  // No sync on load: a small size the shopper added somewhere else, at full
  // price, is theirs to keep. Pairs are enforced only on this page's actions.
  // A pair already sitting in the cart is adopted, though, so dropping that
  // gallon later still drops its free size.
  getCart()
    .then(function (cart) {
      cart.items.forEach(function (item) {
        var giftId = giftFor[item.variant_id];
        if (giftId && item.quantity > 0) adopted[giftId] = true;
      });
      render(cart);
    })
    .catch(function () {
      /* An empty or unreachable cart just leaves the server-rendered state. */
    });
})();
