# Place cut-outs exported from Figma (already transparent, no reflection) on
# the 900x1200 canvas: the 60ml bottles in the standard bottle frame, the
# two SiO2 sprays in the sealant frame used by the gift block.
import sys, glob, os
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
W, H = 900, 1200
for f in sorted(glob.glob(os.path.join(src, "*.png"))):
    h = os.path.basename(f)[:-4]
    im = Image.open(f).convert("RGBA")
    a = im.split()[3].point(lambda v: 255 if v > 20 else 0)
    b = im.crop(a.getbbox())
    bw, bh = b.size
    if h.startswith("sio2-"):
        top, height, centre = 0.176, 0.687, 0.282 + 0.38 / 2
    else:
        top, height, centre = 0.222, 0.58, 0.5
    th = round(height * H); tw = round(bw * th / bh)
    b = b.resize((tw, th), Image.LANCZOS)
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    c.alpha_composite(b, (round(centre * W - tw / 2), round(top * H)))
    c.save(os.path.join(out, f"lp-bf-render-{h}.png"), optimize=True)
    print(f"{h:34} w {tw/W:.3f}")
