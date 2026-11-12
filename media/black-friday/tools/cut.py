import sys, os
from rembg import remove, new_session
from PIL import Image
model = sys.argv[1]
s = new_session(model)
for src in sys.argv[2:]:
    im = Image.open(src).convert("RGB")
    out = remove(im, session=s)
    dst = os.path.join(os.environ["OUT"], model + "-" + os.path.basename(src).rsplit(".",1)[0] + ".png")
    out.save(dst)
    print("wrote", dst, out.getbbox())
