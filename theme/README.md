# Malbor BOGO — Shopify theme files

Native Liquid port of the React landing page in `src/LandingPage.tsx`, meant to
be dropped into the store's **Balance** theme and served at `/pages/bogo`.

## Files

| File | Purpose |
|---|---|
| `sections/lp-bogo.liquid` | The whole landing page, with a theme-editor schema |
| `templates/index.json` | Homepage — the campaign URL needs no path |
| `templates/page.bogo.json` | Same page at /pages/bogo, kept as a fallback |
| `layout/lp-bogo.liquid` | Minimal layout: no theme header, footer or cart drawer |
| `snippets/lp-bogo-logo.liquid` | Malbor wordmark, inlined SVG |
| `snippets/lp-bogo-cart-icon.liquid` | Cart glyph |
| `assets/lp-bogo.css` | Styles (adds the responsive behaviour the prototype lacked) |
| `assets/lp-bogo.js` | Cart wiring against the Shopify AJAX API |
| `assets/lp-bogo-*.png` | Hero and lifestyle photography |

## What changed from the React prototype

- **Prices and availability are live.** Product name, price and stock come from
  the Shopify product object instead of the hardcoded `PRODUCTS` array, so the
  page cannot quote a price the checkout disagrees with. A sold-out gallon
  renders "Sold out" instead of an Add to Cart button.
- **The cart is the real cart.** `/cart/add.js`, `/cart/change.js` and
  `/cart.js` back the drawer. The "BOGO savings" line shows Shopify's
  `total_discount` — the discount actually applied — rather than a number
  computed in the browser.
- **Add to cart works without JavaScript.** Each card is a real `/cart/add`
  form; the script intercepts the submit when it loads.
- **The page is responsive.** The prototype had no breakpoints at all and broke
  below ~1200px. Layouts now collapse at 1200px, 900px and 760px.
- **Footer policy links resolve.** They were inert `<button>` elements; they now
  point at the store's real policy pages and disappear when a policy is unset.
- **Nav no longer has two entries pointing to the same anchor.** The prototype's
  "DELIVERY & PICKUP" and "HOW IT WORKS" both scrolled to the same section, so
  the duplicate is gone.

## Deploying

The files live under `theme/` so they can sit alongside the Vite app. Shopify's
GitHub integration expects theme files at the **root** of the connected branch,
so promoting this to a synced branch means publishing this directory as the
root of a dedicated branch, e.g.:

```sh
git subtree split --prefix=theme -b shopify-theme
git push -u origin shopify-theme
```

Then in the Shopify admin: **Online Store → Themes → Add theme → Connect from
GitHub**, and point it at that branch.

To install by hand instead, copy each file into the matching directory of a
**duplicate** of the Balance theme — never the live one — then create a page
with the handle `bogo` and assign it the `page.bogo` template.

## The homepage

`templates/index.json` renders the same section as the page template, so the
campaign link is the bare domain rather than a `/pages/...` path. This means
**the store's homepage is the campaign page** for as long as this theme is
published. The Shopify storefront is not the public storefront here — the brand
site runs on Framer at the apex domain — so the homepage is free for the
campaign to use.

To restore the Balance homepage when the campaign ends, copy
`docs/balance-index-backup.json` (kept outside `theme/` so it never syncs as a
theme file) over `templates/index.json`.

The page is reachable at both `/` and `/pages/bogo`, which is deliberate: the
page template is a fallback if anything goes wrong with the homepage, and it can
be checked without touching `/`. Only advertise one of them.

## Before going live

- The campaign copy hardcodes **September 16–30, 2026**. Keep the "Fine Print"
  setting, the final call to action, and the automatic discounts' active dates
  in sync — all three name the window.
- The campaign domain must be the store's **primary** domain. Shopify redirects
  non-primary domains to the primary one, so a subdomain that is merely
  connected will bounce visitors to the `.myshopify.com` address.
- The offer is three separate automatic BOGO discounts, one per gallon, each
  capped at one use per order. There is deliberately no cross-product cap: stock
  is the control on exposure, not the fine print.
- `max-pro-shampoo-3-78l-copy` is the live handle of the Max Pro Shampoo 3.78L
  product. Renaming the handle would break the product block in
  `templates/page.bogo.json`.

---

# Boat Show campaign (October 15 – November 1, 2026)

The BOGO page above ended on September 30. The Boat Show page sits beside it in
separate files, so uploading them changes nothing on the live storefront until
the homepage is switched on purpose.

**The offer:** buy a 3.78L gallon and get the small size of the same product
free. There is no code; each pair has its own automatic Buy X Get Y discount.

| Gallon | Free size |
|---|---|
| `hydro-coat-3-78l` | `hydro-coat-473ml-1` |
| `deep-cleaning-apc-3-78l` | `deep-cleaning-apc-473ml` |
| `max-pro-shampoo-3-78l-copy` | `max-pro-shampoo-946ml` |
| `nano-polymer-spray-3-78l` | `nano-polymer-spray-473ml` |
| `nano-polymer-spray-3-78l-marine` | `nano-polymer-spray-473ml-marine` |

## Files

| File | Purpose |
|---|---|
| `sections/lp-boatshow.liquid` | The page. Each product block pairs a gallon with its free size |
| `templates/page.boat-show.json` | The page at `/pages/boat-show`, for review |
| `layout/lp-boatshow.liquid` | Minimal layout, with the campaign title and share card |
| `assets/lp-boatshow.css` | `lp-bogo.css` with the root class renamed to `.lp-page`, plus free-size styles |
| `assets/lp-boatshow.js` | Cart wiring: adds both items and keeps the free size in step with its gallon |

The page reuses `snippets/lp-bogo-logo.liquid`, `snippets/lp-bogo-cart-icon.liquid`
and the `lp-bogo-*.png` photography.

## Why the BOGO discount was never used, and what this page does about it

Shopify's automatic Buy X Get Y discount prices the free item at $0 only when
it is already in the cart. It never adds it. The BOGO page added one unit per
click, so a shopper who did not add a second gallon by hand paid full price
and got nothing.

In fifteen days the three BOGO discounts were used in exactly one order
(#1124, Sept 29): a real customer who added two gallons of Max Shield and two
of Max Pro Shampoo by hand and got $244 off. The offer worked; almost nobody
found the one extra step it needed.

This page:

- **Adds both items in one click:** `/cart/add.js` with `items: [gallon, free size]`.
  The no-JS fallback posts the same pair through `items[][id]` form fields.
- **Keeps the pair in step:** after every add or quantity change on this page,
  the script sets each free size to its gallon's quantity. Removing a gallon
  removes its free size. On page load it does not touch the cart, so a small
  size bought separately is left alone.
- **Shows the free size as FREE** in the drawer, with no quantity controls of
  its own. The savings line still comes from Shopify's `total_discount`.
- **Handles a sold-out free size.** If the free size is out of stock, the card
  says so, the "+ FREE" flag is withheld, the pair is left out of the sync map,
  and Add to Cart adds the gallon at its regular price.
- **Adds the gallon alone, then raises the free size to match.** `/cart/add.js`
  is atomic, so posting the pair meant a free size that sold out mid-campaign
  failed the whole request and the shopper could not buy the gallon either.
  The no-JS form still posts both, having no second step available to it.

## Free-size stock

The free sizes are the constraint, and two of them deny overselling, so the
offer stops working for that product the moment stock runs out. Checked
October 6:

| Free size | On hand | When out of stock |
|---|---|---|
| `hydro-coat-473ml-1` | 1 | **deny** — offer dies after one order |
| `deep-cleaning-apc-473ml` | 5 | **deny** — offer dies after five |
| `max-pro-shampoo-946ml` | 53 | continue |
| `nano-polymer-spray-473ml` | 5 | continue |
| `nano-polymer-spray-473ml-marine` | 6 | continue |

`nano-polymer-spray-3-78l-marine`, the gallon, is at 0 on hand and set to
continue selling, so that card sells an item with none in stock.

## Discounts

Create one automatic **Buy X Get Y** discount per row of the table above:

- customer buys 1 of the gallon and gets 1 of the free size at 100% off;
- no limit on uses per order;
- active October 15, 2026 00:00 to November 1, 2026 23:59, Florida time.

Turn off the three BOGO discounts first. Keep the fine print, the final call
to action and the discounts' dates in sync — all three name the window.

## Going live

1. Upload the files on this branch to the unpublished copy of the live theme.
   The Admin API connector cannot write to the published theme.
2. Review the page through that theme's preview link. Optionally create a page
   with the handle `boat-show` and the `page.boat-show` template, for a
   fallback URL.
3. Run one real cart test per product: gallon and free size in the cart, the
   free size at $0 at checkout, and local pickup offered.
4. On this branch `templates/index.json` already serves the Boat Show page,
   and `sections/header-group.json` announces the new offer. In the store they
   live in the unpublished theme **"Boat Show LP (Oct 15 – Nov 1)"**, a copy of
   the live theme. Publishing that theme on October 15 switches the homepage
   and the announcement bar in one step. To go back, republish
   "BOGO LP — mobile fixes".
