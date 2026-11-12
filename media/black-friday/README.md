# Black Friday bottle renders

Campaign renders of five Professional Line bottles (9H Special Edition and
Black Ceramic 10H, each in the car and Marine version, and Glass Coating),
cut out (rembg, isnet-general-use). The floor reflection is removed by
cutting 1130px below the top of the cap (same bottle and camera in every
render; a little more on the two car renders, whose floor line is brighter),
and each bottle is placed on a
transparent 900x1200 canvas so the bottle sits where it does in the store's
product photos: 34.5%–65.5% across, 22.2%–80.2% down. That framing is what
`snippets/lp-blackfriday-bottle.liquid` trims to, so the bottle stands on the
page's pedestal.

They are uploaded to Shopify Files under the same names and referenced from
the templates as `shopify://shop_images/<name>`.

To redo them: `tools/cut.py` runs rembg on the renders (`OUT=<dir> python
cut.py isnet-general-use <render files>`), and `tools/place.py <dir>` cuts the
reflection and places each bottle on the canvas (the render-number to handle
map is at the top of the script).
