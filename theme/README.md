# Malbor campaign landing page — Shopify theme files

Liquid section, snippets, layout and assets for the campaign landing page of
the Shopify store `us8kmm-n0`, served as the homepage of
`bogo.malborcoatings.com` (the store's primary domain). The brand site runs on
Framer at the apex domain, so the Shopify homepage is free for campaigns.

The current campaign is **Black Friday 2026**. Earlier campaigns (September
BOGO, October Boat Show) live in git history and in the unpublished themes
listed under [Rollback](#rollback).

## The offer

Professional Line 60ml bottles only. The Classic Line and the kits are out.

| Rule | Value |
|---|---|
| Every bottle | 25% off |
| 5 bottles or more, mixed | 35% off every bottle |
| Free item | 1 SiO2 Top Sealant 473ml per order, standard or Marine |
| Period | Section settings (see [Dates](#dates)); default Nov 27, 2026 |
| Fulfilment | Local pickup only: Pompano Beach, Safe Harbor Lauderdale Marine Center |

## Files

| File | Purpose |
|---|---|
| `sections/lp-blackfriday.liquid` | The page and its theme-editor schema |
| `snippets/lp-blackfriday-card.liquid` | One bottle card (rendered once per group it belongs to) |
| `snippets/lp-blackfriday-logo.liquid` | Malbor wordmark, inline SVG |
| `snippets/lp-blackfriday-cart-icon.liquid` | Cart glyph |
| `layout/lp-blackfriday.liquid` | Minimal layout: no theme header, footer or cart drawer; campaign title and share card |
| `assets/lp-blackfriday.css` | Styles, mobile first |
| `assets/lp-blackfriday.js` | Page state, countdown, filter, cart drawer and free-sealant sync |
| `templates/index.json` | Homepage: the campaign link is the bare domain |
| `templates/page.black-friday.json` | Same page at `/pages/black-friday`, for review |
| `sections/header-group.json` | Announcement bar for the rest of the store |

`docs/balance-index-backup.json` (outside `theme/`, never synced) is the
original Balance homepage, to restore when campaigns stop using `/`.

## Dates

The period is never hardcoded. In the theme editor, **Black Friday landing
page → Period**:

- **Offer starts / Offer ends**: `YYYY-MM-DD HH:MM`, Florida time.
- **Florida time offset**: EST (−05:00) for November.
- **After the offer ends**: "coming soon" without dates, or "This offer has
  ended".
- **Seal and ribbon date** (e.g. `NOV 27` or `NOV 27–30`) and **Period text**
  (shown under the countdown and in the fine print wherever `[period]` appears).

| Before the start (`soon`) | Between the dates (`live`) | After the end (`over` / `ended`) |
|---|---|---|
| Full prices, "25% off from Black Friday" | Price with 25% off, "$X each with 5+" | Full prices |
| Countdown "Starts in" | Countdown "Ends in" | No countdown |
| Buttons disabled: "Starts Black Friday" | Buttons active | Disabled: "Starts Black Friday" / "Offer ended" |

Liquid renders the state from `'now'`; the script re-checks it every second,
so a page Shopify served from cache still flips on time.

Keep the section dates, the fine print and the three automatic discounts'
dates the same.

## Why the free item is added by the page

Shopify's automatic "buy X get Y" discount prices the free item at $0 only if
it is already in the cart. It never adds it. The September BOGO discounts were
used once in fifteen days, because shoppers had to add the free unit by hand.

So this page:

- **One click, two items.** The first bottle goes in with the sealant in the
  same `/cart/add.js` request: Marine sealant with a Marine bottle (handle
  contains `marine`), standard otherwise. If the cart already has a sealant,
  only the bottle goes in. The no-JS form does the same with `items[][id]` /
  `items[][quantity]`, and leaves the sealant out when the cart already has one.
- **Sold out.** A variant counts as in stock only if it is available *and*, when
  Shopify tracks it, has at least one on hand (several of these products keep
  selling at zero). Sold-out bottles show "Sold out". If the matching sealant is
  out, the other version is used; if both are out, the page says "Free SiO2
  while supplies last: sold out", drops the free item from the offer line and
  the bottle sells alone. If a sealant sells out between page load and click,
  the script falls back to the other version, then to the bottle alone.
- **Kept in step.** After any change on the page, the cart holds exactly one
  sealant at quantity 1 while it has a bottle, and none once the last bottle
  is gone. A sealant in the cart with no bottle on page load is left alone
  (it may have been bought at full price elsewhere in the store).
- **The drawer** shows the sealant as FREE with no quantity controls, only a
  standard/Marine switch; a progress bar "Add N more for 35% off"; and the
  savings line from Shopify's `total_discount`.

The lock applies to this page's drawer. The theme's own `/cart` page can still
change the sealant's quantity; the free-item discount is capped at one use per
order, so a second unit would be charged at full price.

## Shopify setup

Created on 2026-11-11, **not active**:

| Object | Setting |
|---|---|
| Collection **Professional — 60 ml** (`professional-60ml`) | Automatic: product type = Professional AND title contains `60ml`. 15 products, no kits. Not published to the storefront (not needed for discounts) |
| Automatic discount **Black Friday 2026 — Professional 60ml 25% off** | 25% on the collection, no minimum, combines with product discounts |
| Automatic discount **Black Friday 2026 — Professional 60ml 35% off (5+)** | 35% on the collection, minimum 5 items, combines with product discounts |
| Automatic discount **Black Friday 2026 — Free SiO2 Top Sealant 473ml** | Buy 1 from the collection, get 1 of either SiO2 Top Sealant 473ml at 100%, 1 use per order, combines with product discounts |

The three were created with a one-minute window on Nov 10, so they show as
**Expired** and have never applied. To turn them on, set their start and end
to the campaign period (Florida time). With both percentage discounts active,
Shopify applies only the larger one to each line; confirm that in the first
real cart test.

## Theme and pages

| Theme | Role | Use |
|---|---|---|
| **Black Friday LP (Nov 2026)** (`189978640704`) | Unpublished | Duplicate of the Boat Show theme with this branch's files |
| Boat Show LP (Oct 15 – Nov 1) | **Published** | Still shows the gallon offer that ended Nov 1 |
| BOGO LP — mobile fixes | Unpublished | September page |

Review: `https://bogo.malborcoatings.com/pages/black-friday?preview_theme_id=189978640704`
(the page `black-friday` uses the `page.black-friday` template). The `/` of
that theme already serves the Black Friday page, so publishing the theme
switches the homepage and the announcement bar together.

Files are uploaded with the Admin API's `themeFilesUpsert`, from the raw
GitHub URL of a specific commit. The connector cannot write to the published
theme and cannot delete theme files: the duplicate still contains the old
`lp-bogo*` and `lp-boatshow*` files. They are not used by the Black Friday
templates and can be deleted in the code editor.

## Rollback

Republish **Boat Show LP (Oct 15 – Nov 1)** or **BOGO LP — mobile fixes** in
**Online Store → Themes**. Both still have their own homepage and files.

## Copy rules (legal)

No "permanent" in any form, no environmental claims, no competitor
comparisons, no protection-duration numbers anywhere ("9H" and "10H" only as
product names), no kit names, no delivery (local pickup only), phone
(925) 876-9005. Check before publishing:

```sh
grep -rniE "BOGO|Buy 1|gallon|Boat Show|FLIBS|October|delivery|permanent|months|years|lifetime|booth|visit us" \
  --exclude=README.md theme/
```

Bottle descriptions come from the block's "Short description", never from the
product description, which may contain duration claims.
