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

- The campaign copy hardcodes **September 15–29, 2026**. Keep the "Fine Print"
  setting and the automatic discount's active dates in sync.
- The campaign domain must be the store's **primary** domain. Shopify redirects
  non-primary domains to the primary one, so a subdomain that is merely
  connected will bounce visitors to the `.myshopify.com` address.
- The offer is three separate automatic BOGO discounts, one per gallon, each
  capped at one use per order. There is deliberately no cross-product cap: stock
  is the control on exposure, not the fine print.
- `max-pro-shampoo-3-78l-copy` is the live handle of the Max Pro Shampoo 3.78L
  product. Renaming the handle would break the product block in
  `templates/page.bogo.json`.
