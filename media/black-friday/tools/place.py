import sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
S=sys.argv[1]
W,H=900,1200
names={"27":"wheel-caliper-ceramic-60ml","28":"ppf-vinyl-ceramic-60ml","29":"leather-coating-60ml",
       "30":"leather-ceramic-matte-60ml","31":"plastic-coating-60ml"}
for n,h in names.items():
    im=Image.open(f"{S}/renders-cut/isnet-general-use-{n}.png").convert("RGBA")
    a=np.array(im)[:,:,3]; rows=(a>200).sum(1)
    # The bottle meets its reflection at the narrowest row near the bottom.
    # The base is the last row before the width falls off sharply: below it
    # the floor reflection is much narrower (or gone).
    # Same bottle, same camera in every render: from the top of the cap to the
    # base is ~1140px; cutting at 1130 drops the last sliver of reflection. Measuring the base directly is unreliable where the
    # floor reflection is strong and continuous.
    top=int(np.argmax(rows>0))
    base=top+1130-{'16':25,'17':12,'27':12,'28':12,'29':12,'30':12,'31':12}.get(n,0)  # the gold v2 has a brighter floor line
    # The body's columns (cap to label) bound the bottle; drop stray pixels.
    body=np.where((a[300:1150]>200).any(0))[0]
    x0,x1=int(body.min())-4,int(body.max())+4
    arr=np.array(im); arr[base+1:,:,3]=0; arr[:,:x0,3]=0; arr[:,x1+1:,3]=0; im=Image.fromarray(arr)
    b=im.crop(im.getbbox()); bw,bh=b.size
    th=round(0.58*H); tw=round(bw*th/bh); b=b.resize((tw,th),Image.LANCZOS)
    c=Image.new("RGBA",(W,H),(0,0,0,0)); c.alpha_composite(b,(round((W-tw)/2),round(0.802*H)-th))
    c.save(f"{S}/renders-out/lp-bf-render-{h}.png",optimize=True)
    print(f"{h:38} base {base} bbox {im.getbbox()} height {base-im.getbbox()[1]} w {tw/W:.3f}")

