import { useState, useCallback, useRef, useEffect } from "react";
import svgPaths from "@/imports/LpBogoMalbor/svg-idowsku68f";
import imgRectangle from "@/imports/LpBogoMalbor/385cd84b3a50068c7922958b32d60ec408d73fc2.png";
import imgRectangle1 from "@/imports/LpBogoMalbor/ccd308befe699871ae233645cefb6f29cd95357d.png";
import imgRectangle2 from "@/imports/LpBogoMalbor/598a9f408abf9e3ff59aacfad4f1ab8ca6e9c36d.png";
import imgRectangle3 from "@/imports/LpBogoMalbor/ed866f33b3e121c138d651b3d30e5b558670d778.png";
import imgRectangle4 from "@/imports/LpBogoMalbor/0532bfbde1dfdcf4e5a42b39e862a45ca83fdf73.png";
import imgRectangle5 from "@/imports/LpBogoMalbor/d99a4cfaa8b71c0f6cf8a0cda43b68a52e839367.png";

type ProductId = "apc" | "shampoo" | "polymer";

interface Product {
  id: ProductId;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  img: string;
  imgStyle: string;
}

const PRODUCTS: Product[] = [
  {
    id: "apc",
    name: "Deep Cleaning APC",
    subtitle: "3.78L GALLON · ALL-PURPOSE CLEANER",
    description:
      "Super-concentrated all-purpose cleaner for interior and exterior. Engine rooms, non-skid decks, interiors and heavy soil. Cuts through grease, salt and grime, rinsing clean without leaving residue.",
    price: "$39",
    img: imgRectangle1,
    imgStyle: "absolute h-[121.17%] left-[21.12%] max-w-none top-[-9.5%] w-[56.74%]",
  },
  {
    id: "shampoo",
    name: "Max Pro Shampoo",
    subtitle: "3.78L GALLON · SiO2 HIGH-FOAM SHAMPOO",
    description:
      "SiO2 shampoo for detail washes and salt rinses on hulls, fishing tackle, trailers and vehicles. Leaves a protective layer that will not yellow. Safe on fiberglass, epoxy paints, clear coat, metals, wood and plastics.",
    price: "$45",
    img: imgRectangle2,
    imgStyle: "absolute h-[124.87%] left-[20.69%] max-w-none top-[-10.87%] w-[58.65%]",
  },
  {
    id: "polymer",
    name: "Max Shield Polymer",
    subtitle: "3.78L GALLON · SiO2 SEALANT",
    description:
      "SiO2 polymer sealant and the final step after compounding and micro finishing. Super hydrophobic finish, UV barrier and high gloss on gelcoat and painted surfaces. Up to 6 months of protection on vehicles maintained on a biweekly wash schedule; minimum one month on vessels, where monthly reapplication keeps a continuous barrier.",
    price: "$199",
    img: imgRectangle3,
    imgStyle: "absolute h-[132.17%] left-[19.13%] max-w-none top-[-15.11%] w-[61.95%]",
  },
];

function LogoMalbor({ className }: { className?: string }) {
  return (
    <div className={className || "relative w-[175px]"}>
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[8px] relative size-full">
        <div className="h-[34.169px] relative shrink-0 w-[175px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="34.1685" preserveAspectRatio="none" viewBox="0 0 175 34.1685" width="175">
            <g id="Group 1">
              <g id="Group">
                <path d={svgPaths.p3c147500} fill="white" />
                <path d={svgPaths.p12452b00} fill="white" />
              </g>
              <path d={svgPaths.p3f8a3800} fill="#F4F4F2" />
              <path d={svgPaths.p3864bd40} fill="#F4F4F2" />
              <path d={svgPaths.p36f33800} fill="#F4F4F2" />
              <path d={svgPaths.p2874df00} fill="#EA560D" />
              <path d={svgPaths.p260be040} fill="#EA560D" />
              <path d={svgPaths.p98e1a80} fill="#F4F4F2" />
              <path d={svgPaths.p3ccdf900} fill="#EF7D00" />
            </g>
          </svg>
        </div>
        <div className="h-[9.602px] relative shrink-0 w-[79px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="9.60196" preserveAspectRatio="none" viewBox="0 0 79 9.60196" width="79">
            <g>
              <path d={svgPaths.p3c7d1400} fill="#FFF7ED" />
              <path d={svgPaths.pfae8c00} fill="#FFF7ED" />
              <path d={svgPaths.p244bde00} fill="#FFF7ED" />
              <path d={svgPaths.p3e56e300} fill="#FFF7ED" />
              <path d={svgPaths.pf73ae00} fill="#FFF7ED" />
              <path d={svgPaths.p2f72ba80} fill="#FFF7ED" />
              <path d={svgPaths.p32e8da80} fill="#FFF7ED" />
              <path d={svgPaths.p15c61000} fill="#FFF7ED" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

interface CartItem {
  product: Product;
  qty: number;
}

function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
  onChangeQty,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: ProductId) => void;
  onChangeQty: (id: ProductId, delta: number) => void;
}) {
  const total = items.reduce((acc, { product, qty }) => {
    const price = parseFloat(product.price.replace("$", ""));
    return acc + price * qty;
  }, 0);

  const bogoSavings = items.reduce((acc, { product, qty }) => {
    const price = parseFloat(product.price.replace("$", ""));
    const freePairs = Math.floor(qty / 2);
    return acc + freePairs * price;
  }, 0);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[420px] bg-[#2e2a25] z-50 flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#47423c]">
          <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[#f4f4f2] text-[20px] leading-[1.3]">
            Your Cart
          </p>
          <button
            onClick={onClose}
            className="text-[#acaa98] hover:text-[#f4f4f2] transition-colors p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea560d]"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[#504b43]">
                <path d="M8 8H12L16 32H36L40 16H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="38" r="2" fill="currentColor" />
                <circle cx="34" cy="38" r="2" fill="currentColor" />
              </svg>
              <p className="font-['Poppins:Regular',sans-serif] text-[#acaa98] text-[14px] text-center">
                Your cart is empty.<br />Add a gallon to get started.
              </p>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 items-start">
                <div className="w-[72px] h-[72px] rounded-[12px] overflow-hidden shrink-0 bg-[#47423c]">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[#f4f4f2] text-[14px] leading-[1.4]">
                    {product.name}
                  </p>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[#fcb875] text-[11px] tracking-[0.6px] uppercase mt-0.5">
                    {product.subtitle}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 bg-[#3a352f] rounded-[8px] px-2 py-1">
                      <button
                        onClick={() => onChangeQty(product.id, -1)}
                        className="text-[#acaa98] hover:text-[#f4f4f2] transition-colors w-5 h-5 flex items-center justify-center text-lg leading-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ea560d] rounded"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="font-['Poppins:Medium',sans-serif] text-[#f4f4f2] text-[13px] w-5 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => onChangeQty(product.id, 1)}
                        className="text-[#acaa98] hover:text-[#f4f4f2] transition-colors w-5 h-5 flex items-center justify-center text-lg leading-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ea560d] rounded"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(product.id)}
                      className="font-['Poppins:Regular',sans-serif] text-[#6b6660] hover:text-[#ea560d] text-[11px] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ea560d] rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[#f4f4f2] text-[16px]">
                    {product.price}
                  </p>
                  {qty > 1 && (
                    <p className="font-['Poppins:Regular',sans-serif] text-[#acaa98] text-[11px] text-right">
                      × {qty}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-[#47423c] flex flex-col gap-4">
            {bogoSavings > 0 && (
              <div className="bg-[#3a2a1a] border border-[#ea560d]/30 rounded-[12px] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ea560d]" />
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[#fcb875] text-[12px] tracking-[0.4px] uppercase">
                    BOGO Savings Applied
                  </p>
                </div>
                <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[#ea560d] text-[14px]">
                  −${bogoSavings.toFixed(2)}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[#acaa98] text-[13px]">Subtotal</p>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[#f4f4f2] text-[20px]">
                ${(total - bogoSavings).toFixed(2)}
              </p>
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[#6b6660] text-[11px]">
              Shipping &amp; taxes calculated at checkout
            </p>
            <button className="w-full bg-[#ea560d] hover:bg-[#d44d0b] active:bg-[#bf450a] text-[#431307] font-['Poppins:Medium',sans-serif] text-[14px] py-3 rounded-[6px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea560d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2e2a25]">
              CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Add to Cart Button ───────────────────────────────────────────────────────

function AddToCartButton({ productId, onAdd }: { productId: ProductId; onAdd: (id: ProductId) => void }) {
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    if (state !== "idle") return;
    setState("adding");
    timerRef.current = setTimeout(() => {
      onAdd(productId);
      setState("added");
      timerRef.current = setTimeout(() => setState("idle"), 1600);
    }, 300);
  }, [state, productId, onAdd]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <button
      onClick={handleClick}
      disabled={state === "adding"}
      className={`
        content-stretch flex items-center gap-[6px] px-[16px] py-[8px] rounded-[6px] shrink-0
        font-['Poppins:Medium',sans-serif] text-[14px] leading-[24px] whitespace-nowrap
        transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea560d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#47423c]
        active:scale-95
        ${state === "added"
          ? "bg-[#2d6a3f] text-[#9ef5b2]"
          : state === "adding"
          ? "bg-[#c44c0b] text-[#431307] cursor-wait"
          : "bg-[#ea560d] text-[#431307] hover:bg-[#d44d0b]"
        }
      `}
      aria-label={state === "added" ? "Added to cart" : "Add to cart"}
    >
      {state === "added" ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Added
        </>
      ) : state === "adding" ? (
        <>
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeDasharray="10 8" />
          </svg>
          Adding…
        </>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onAdd }: { product: Product; onAdd: (id: ProductId) => void }) {
  return (
    <div className="bg-[#47423c] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shadow-[0px_5px_16px_0px_rgba(8,15,52,0.06)] shrink-0 w-[384px] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0px_12px_28px_0px_rgba(8,15,52,0.14)]">
      <div className="h-[240px] relative shrink-0 w-full">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className={product.imgStyle} src={product.img} />
          </div>
          <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0" />
        </div>
      </div>
      <div className="content-stretch flex flex-col flex-1 items-start justify-between min-h-px p-[24px] w-full gap-[12px]">
        <div className="flex flex-col gap-[4px] w-full">
          <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] text-[#f4f4f2] text-[24px]">
            {product.name}
          </p>
          <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.7] not-italic text-[#fcb875] text-[12px] tracking-[0.8px] uppercase">
            {product.subtitle}
          </p>
        </div>
        <p className="font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic text-[#e4e3dd] text-[14px] w-full flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-[8px] w-full">
          <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.1] text-[#f4f4f2] text-[32px]">
            {product.price}
          </p>
          <AddToCartButton productId={product.id} onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────

export default function LandingPage() {
  const [cart, setCart] = useState<Partial<Record<ProductId, number>>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const cartItems: CartItem[] = PRODUCTS.filter((p) => (cart[p.id] ?? 0) > 0).map((p) => ({
    product: p,
    qty: cart[p.id]!,
  }));

  const cartCount = Object.values(cart).reduce((a, b) => a + (b ?? 0), 0);

  const handleAddToCart = useCallback((id: ProductId) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const handleRemove = useCallback((id: ProductId) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleChangeQty = useCallback((id: ProductId, delta: number) => {
    setCart((prev) => {
      const next = (prev[id] ?? 0) + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#24211e] flex flex-col items-start w-full min-h-full">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full bg-[#24211e]/90 backdrop-blur-md border-b border-[#47423c]/40">
        <div className="flex items-center justify-between px-[80px] py-[20px]">
          <LogoMalbor className="relative shrink-0 w-[175px]" />

          <nav className="flex gap-[32px] items-center font-['Poppins:Medium',sans-serif] text-[14px] leading-[24px] text-[#f4f4f2]">
            {[
              { label: "PRODUCTS", ref: productsRef },
              { label: "DELIVERY & PICKUP", ref: howItWorksRef },
              { label: "HOW IT WORKS", ref: howItWorksRef },
              { label: "CONTACT", ref: contactRef },
            ].map(({ label, ref }) => (
              <button
                key={label}
                onClick={() => scrollTo(ref)}
                className="relative shrink-0 hover:text-white transition-colors duration-150 focus:outline-none focus-visible:text-white after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#ea560d] after:transition-all hover:after:w-full"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex gap-[16px] items-center">
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-[#47423c] hover:bg-[#5a544d] active:bg-[#6b6056] p-[10px] rounded-[8px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea560d]"
              aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
            >
              <div className="overflow-clip relative size-[24px]">
                <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                  <g />
                </svg>
                <div className="absolute inset-[8.33%_12.5%_8.33%_4.17%]">
                  <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
                    <path d={svgPaths.p31ff7500} fill="#F4F4F2" />
                  </svg>
                </div>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ea560d] text-[#431307] font-['Poppins:SemiBold',sans-serif] text-[10px] leading-none rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Claim BOGO */}
            <button
              onClick={() => scrollTo(productsRef)}
              className="bg-[#ea560d] hover:bg-[#d44d0b] active:bg-[#bf450a] active:scale-95 px-[20px] py-[10px] rounded-[6px] font-['Poppins:Medium',sans-serif] text-[#431307] text-[14px] leading-[24px] whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea560d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24211e]"
            >
              CLAIM BOGO
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="flex gap-[40px] items-center pb-[100px] pt-[80px] px-[80px] w-full">
        <div className="flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px">
          {/* Live badge */}
          <div className="flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[100px]">
            <div aria-hidden className="absolute border border-[#ea560d] border-solid inset-0 pointer-events-none rounded-[100px]" />
            <span className="relative size-[8px] shrink-0">
              <svg className="absolute block inset-0 size-full animate-pulse" fill="none" height="8" viewBox="0 0 8 8" width="8">
                <circle cx="4" cy="4" fill="#EA560D" r="4" />
              </svg>
            </span>
            <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic text-[#fcb875] text-[11px] whitespace-nowrap">
              LIMITED TIME · STOCK CLEARANCE
            </p>
          </div>

          <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[1.2] text-[#f4f4f2] text-[64px] tracking-[-2px]">
            Buy 1, Get 1 Free
          </p>
          <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.1] text-[#fed6aa] text-[32px]">
            Every 3.78L gallon in the Classic Line — while stock lasts.
          </p>
          <p className="font-['Poppins:Regular',sans-serif] leading-[1.5] not-italic text-[#acaa98] text-[16px]">
            Formulated for the marine environment first, where salt and constant sun break down protection faster than anything a car sees on the road. High gloss, UV barrier and a super hydrophobic finish on both gelcoat and automotive paint.
          </p>

          <div className="flex gap-[16px] items-center pt-[12px]">
            <button
              onClick={() => scrollTo(productsRef)}
              className="bg-[#ea560d] hover:bg-[#d44d0b] active:bg-[#bf450a] active:scale-95 px-[96px] py-[10px] rounded-[4px] font-['Poppins:Medium',sans-serif] text-[#431307] text-[14px] leading-[24px] whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea560d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24211e]"
            >
              SHOP THE BOGO NOW
            </button>
            <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic text-[#f4f4f2] text-[12px] whitespace-nowrap">
              Discount automatically applied at checkout
            </p>
          </div>
        </div>

        <div className="flex flex-[1_0_0] h-[480px] items-start min-w-px overflow-clip rounded-[24px]">
          <img alt="Malbor product in use" className="w-full h-full object-cover" src={imgRectangle} />
        </div>
      </section>

      {/* ── Trust Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-[#47423c] flex items-center justify-between px-[80px] py-[24px] w-full border-y border-[#504b43]">
        {["TRUSTED BY THE PROS", "BUILT FOR MARINE, PROVEN ON PAINT", "SIO2 FORMULA", "MADE IN THE USA"].map((label, i) => (
          <div key={label} className="flex items-center gap-[24px]">
            {i > 0 && <div className="bg-[#504b43] h-[20px] w-px" />}
            <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic text-[#acaa98] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Products ───────────────────────────────────────────────────────── */}
      <section ref={productsRef} className="flex flex-col gap-[56px] items-center px-[80px] py-[100px] w-full scroll-mt-[80px]">
        <div className="flex flex-col gap-[16px] items-center">
          <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic text-[#ea560d] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">
            CLASSIC LINE
          </p>
          <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] text-[#f4f4f2] text-[44px] whitespace-nowrap">
            Choose Your 3.78L Gallons
          </p>
          <p className="font-['Poppins:Regular',sans-serif] leading-[1.5] not-italic text-[#acaa98] text-[16px] text-center w-[600px]">
            Buy 1 and Get 1 free of the same product. Add two of the same 3.78L gallon to your cart — the second one is on us.
          </p>
        </div>

        <div className="flex gap-[24px] items-stretch justify-center w-full">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
          ))}
        </div>
      </section>

      {/* ── Crossover Proof ────────────────────────────────────────────────── */}
      <section className="bg-[#47423c] flex gap-[64px] items-center px-[80px] py-[100px] w-full">
        <div className="flex flex-[1_0_0] h-[420px] items-start min-w-px overflow-clip rounded-[24px]">
          <img alt="Malbor in use on marine surface" className="w-full h-full object-cover" src={imgRectangle4} />
        </div>
        <div className="flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px">
          <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic text-[#ea560d] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">
            CROSSOVER TECHNOLOGY
          </p>
          <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] text-[#f4f4f2] text-[44px]">
            Built where conditions are worse.
          </p>
          <p className="font-['Poppins:Regular',sans-serif] leading-[1.5] not-italic text-[#e4e3dd] text-[16px]">
            Malbor formulas were engineered for saltwater and the relentless UV exposure of tropical marine environments. These are the conditions the line was built to handle, not conditions it was later adapted to.
          </p>
          <p className="font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic text-[#e4e3dd] text-[14px]">
            From small center consoles to superyachts, the routine is the same: wash, compound, finish, protect — then do it again before salt and sun undo it. What holds up on a hull holds up on paint.
          </p>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section ref={howItWorksRef} className="flex flex-col gap-[56px] items-center px-[80px] py-[100px] w-full scroll-mt-[80px]">
        <div className="flex flex-col gap-[16px] items-center whitespace-nowrap">
          <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic text-[#ea560d] text-[14px] tracking-[0.8px] uppercase">
            PROMOTION STEP-BY-STEP
          </p>
          <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] text-[#f4f4f2] text-[44px]">
            How the BOGO Works
          </p>
        </div>

        <div className="flex gap-[32px] items-start justify-center w-full">
          {[
            { step: "STEP 01", title: "Add To Cart", body: "Add your 3.78L gallons to the cart." },
            { step: "STEP 02", title: "Automatic Discount", body: "The second gallon is set to $0 at checkout. No code required." },
            { step: "STEP 03", title: "Delivery or Pickup", body: "Choose delivery within Palm Beach, Broward and Miami-Dade counties, or pick up locally at no shipping cost." },
          ].map(({ step, title, body }) => (
            <div key={step} className="bg-[#47423c] flex flex-col gap-[16px] items-start p-[32px] rounded-[24px] shrink-0 w-[384px]">
              <div className="bg-[#ea560d] px-[12px] py-[6px] rounded-[12px]">
                <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic text-[#431307] text-[12px] whitespace-nowrap">
                  {step}
                </p>
              </div>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] text-[#f4f4f2] text-[20px] whitespace-nowrap">
                {title}
              </p>
              <p className="font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic text-[#e4e3dd] text-[14px]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Offer Details / Fine Print ─────────────────────────────────────── */}
      <section className="bg-[#47423c] flex gap-[64px] items-center px-[80px] py-[100px] w-full">
        <div className="flex flex-[1_0_0] flex-col gap-[32px] items-start min-w-px">
          <div className="flex flex-col gap-[16px] items-start whitespace-nowrap">
            <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic text-[#ea560d] text-[14px] tracking-[0.8px] uppercase">
              PROMOTION GUIDELINES
            </p>
            <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] text-[#f4f4f2] text-[44px]">
              The Fine Print
            </p>
          </div>
          <div className="flex flex-col gap-[16px] w-full">
            {[
              "Limit of 2 free gallons per individual order.",
              "Valid September 15–29, 2026, or while stock lasts.",
              "Delivery available in Palm Beach, Broward and Miami-Dade counties only.",
              "Local pickup available in Pompano Beach, FL and at Safe Harbor Lauderdale Marine Center, Fort Lauderdale, FL.",
              "Shipping calculated at checkout.",
            ].map((item) => (
              <div key={item} className="flex gap-[12px] items-start">
                <svg className="shrink-0 mt-[6px]" fill="none" height="8" viewBox="0 0 8 8" width="8">
                  <circle cx="4" cy="4" fill="#EA560D" r="4" />
                </svg>
                <p className="font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic text-[#e4e3dd] text-[14px]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-[1_0_0] h-[360px] items-start min-w-px overflow-clip rounded-[24px]">
          <img alt="Malbor product lineup" className="w-full h-full object-cover" src={imgRectangle5} />
        </div>
      </section>

      {/* ── Application Tips / Contact ─────────────────────────────────────── */}
      <section ref={contactRef} className="flex flex-col items-center px-[80px] py-[100px] w-full scroll-mt-[80px]">
        <div className="bg-[#47423c] flex flex-col gap-[24px] items-center p-[48px] rounded-[32px] w-[1000px]">
          <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic text-[#ea560d] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">
            EXPERT ASSISTANCE
          </p>
          <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.1] text-[#f4f4f2] text-[32px] text-center whitespace-nowrap">
            Questions on how to apply?
          </p>
          <p className="font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic text-[#acaa98] text-[14px] text-center w-[600px]">
            Need guidance on prepping gelcoat or clear coat, or on cure times in South Florida humidity? Our team is happy to walk you through it before you order.
          </p>
          <div className="flex gap-[48px] items-center pt-[8px]">
            <a
              href="mailto:sales@malborcoatings.com"
              className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] text-[#fed6aa] text-[20px] whitespace-nowrap hover:text-[#ea560d] transition-colors duration-150 underline-offset-4 hover:underline"
            >
              sales@malborcoatings.com
            </a>
            <div className="bg-[#504b43] h-[24px] w-px" />
            <a
              href="tel:+19258769005"
              className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] text-[#fed6aa] text-[20px] whitespace-nowrap hover:text-[#ea560d] transition-colors duration-150 underline-offset-4 hover:underline"
            >
              (925) 876-9005
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-[#24211e] flex flex-col gap-[32px] items-center px-[80px] py-[120px] w-full">
        <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic text-[#ea560d] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">
          ACT BEFORE STOCK DEPLETES
        </p>
        <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[1.2] text-[#f4f4f2] text-[64px] text-center tracking-[-2px] w-[800px]">
          Stock clearance runs until September 29, or until stock is gone.
        </p>
        <p className="font-['Poppins:Regular',sans-serif] leading-[1.5] not-italic text-[#e4e3dd] text-[16px] text-center w-[600px]">
          Maximize your business margins and keep your fleet or collection gleaming. Do not wait — these formulas are available while stock lasts.
        </p>
        <div className="pt-[16px]">
          <button
            onClick={() => scrollTo(productsRef)}
            className="bg-[#ea560d] hover:bg-[#d44d0b] active:bg-[#bf450a] active:scale-95 px-[96px] py-[10px] rounded-[4px] font-['Poppins:Medium',sans-serif] text-[#431307] text-[14px] leading-[24px] whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea560d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24211e]"
          >
            SHOP THE BOGO NOW
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#24211e] flex flex-col gap-[64px] items-start pb-[40px] pt-[80px] px-[80px] w-full relative border-t border-[#47423c]">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-[24px] items-start w-[320px]">
            <LogoMalbor className="relative shrink-0 w-[175px]" />
            <p className="font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic text-[#acaa98] text-[14px]">
              Ocean-tested silicon dioxide protection engineered for deep gloss and lasting surface performance
            </p>
          </div>

          <div className="flex flex-col gap-[16px] items-start leading-[1.4]">
            <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[#f4f4f2] text-[16px]">Products</p>
            {["Deep Cleaning APC", "Max Pro Shampoo", "Max Shield Polymer"].map((name) => (
              <button
                key={name}
                onClick={() => scrollTo(productsRef)}
                className="font-['Poppins:Regular',sans-serif] not-italic text-[#acaa98] text-[12px] hover:text-[#f4f4f2] transition-colors text-left"
              >
                {name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-[16px] items-start leading-[1.4]">
            <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[#f4f4f2] text-[16px]">Company</p>
            <p className="font-['Poppins:Regular',sans-serif] not-italic text-[#acaa98] text-[12px]">About Malbor</p>
            <p className="font-['Poppins:Regular',sans-serif] not-italic text-[#acaa98] text-[12px]">Certified Installer Program</p>
          </div>

          <div className="flex flex-col gap-[16px] items-end leading-[1.4]">
            <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[#f4f4f2] text-[16px]">Headquarters</p>
            <p className="font-['Poppins:Regular',sans-serif] not-italic text-[#acaa98] text-[12px]">Fort Lauderdale, Florida</p>
            <p className="font-['Poppins:Regular',sans-serif] not-italic text-[#acaa98] text-[12px]">MADE IN THE USA</p>
          </div>
        </div>

        <div className="flex items-center justify-between font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic text-[#acaa98] text-[11px] w-full whitespace-nowrap">
          <p>Copyright © 2026 Malbor Coatings. All rights reserved.</p>
          <div className="flex gap-[24px] items-start">
            <button className="hover:text-[#f4f4f2] transition-colors">Privacy Policy</button>
            <button className="hover:text-[#f4f4f2] transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* ── Cart Drawer ────────────────────────────────────────────────────── */}
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemove={handleRemove}
        onChangeQty={handleChangeQty}
      />
    </div>
  );
}
