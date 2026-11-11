# Black Friday page: local tests

The cloud environment these were written in cannot reach the storefront, so
`server.js` stands in for it: it renders `theme/templates/index.json` with the
real section, snippets and layout (liquidjs plus the Shopify filters the files
use), implements the AJAX cart endpoints with Shopify's semantics, and applies
the three automatic discounts as configured. Product ids, prices, stock and
inventory policies are the Admin API snapshot of 2026-11-11.

```sh
npm install
npm run serve &      # http://localhost:4410
npm test             # Playwright; writes evidence/
```

`evidence/*.json` are `/cart.js` responses from the last run. This is not a
substitute for one real cart test on the store once the discounts are active.

## Review file

`node build-review.js out.html` (with `npm run serve` running) writes one
self-contained HTML of the page for people without access to the preview
theme: CSS and JS inlined, a bar to switch between Coming soon / Live /
Ended, and a simulated cart with the same discount rules. Photos and fonts
load from Shopify's CDN and Google Fonts.
