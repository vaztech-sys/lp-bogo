import svgPaths from "./svg-idowsku68f";
import imgRectangle from "./385cd84b3a50068c7922958b32d60ec408d73fc2.png";
import imgRectangle1 from "./ccd308befe699871ae233645cefb6f29cd95357d.png";
import imgRectangle2 from "./598a9f408abf9e3ff59aacfad4f1ab8ca6e9c36d.png";
import imgRectangle3 from "./ed866f33b3e121c138d651b3d30e5b558670d778.png";
import imgRectangle4 from "./0532bfbde1dfdcf4e5a42b39e862a45ca83fdf73.png";
import imgRectangle5 from "./d99a4cfaa8b71c0f6cf8a0cda43b68a52e839367.png";
type LogoMalborProps = {
  className?: string;
  property1?: "nova logo_Malbor White";
};

function LogoMalbor({ className, property1 = "nova logo_Malbor White" }: LogoMalborProps) {
  return (
    <div className={className || "relative w-[175px]"}>
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[8px] relative size-full">
        <div className="h-[34.169px] relative shrink-0 w-[175px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="34.1685" preserveAspectRatio="none" viewBox="0 0 175 34.1685" width="175">
            <g id="Group 1">
              <g id="Group">
                <path d={svgPaths.p3c147500} fill="white" id="Vector" />
                <path d={svgPaths.p12452b00} fill="white" id="Vector_2" />
              </g>
              <path d={svgPaths.p3f8a3800} fill="#F4F4F2" id="Vector_3" />
              <path d={svgPaths.p3864bd40} fill="#F4F4F2" id="Vector_4" />
              <path d={svgPaths.p36f33800} fill="#F4F4F2" id="Vector_5" />
              <path d={svgPaths.p2874df00} fill="#EA560D" id="Vector_6" />
              <path d={svgPaths.p260be040} fill="#EA560D" id="Vector_7" />
              <path d={svgPaths.p98e1a80} fill="#F4F4F2" id="Vector_8" />
              <path d={svgPaths.p3ccdf900} fill="#EF7D00" id="Vector_9" />
            </g>
          </svg>
        </div>
        <div className="h-[9.602px] relative shrink-0 w-[79px]" data-name="Group">
          <svg className="absolute block inset-0 size-full" fill="none" height="9.60196" preserveAspectRatio="none" viewBox="0 0 79 9.60196" width="79">
            <g id="Group">
              <path d={svgPaths.p3c7d1400} fill="#FFF7ED" id="Vector" />
              <path d={svgPaths.pfae8c00} fill="#FFF7ED" id="Vector_2" />
              <path d={svgPaths.p244bde00} fill="#FFF7ED" id="Vector_3" />
              <path d={svgPaths.p3e56e300} fill="#FFF7ED" id="Vector_4" />
              <path d={svgPaths.pf73ae00} fill="#FFF7ED" id="Vector_5" />
              <path d={svgPaths.p2f72ba80} fill="#FFF7ED" id="Vector_6" />
              <path d={svgPaths.p32e8da80} fill="#FFF7ED" id="Vector_7" />
              <path d={svgPaths.p15c61000} fill="#FFF7ED" id="Vector_8" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function MenuLinks() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Poppins:Medium',sans-serif] gap-[32px] items-center leading-[24px] not-italic relative shrink-0 text-[#f4f4f2] text-[14px] whitespace-nowrap" data-name="Menu Links">
      <p className="relative shrink-0">PRODUCTS</p>
      <p className="relative shrink-0">{`DELIVERY & PICKUP`}</p>
      <p className="relative shrink-0">HOW IT WORKS</p>
      <p className="relative shrink-0">CONTACT</p>
    </div>
  );
}

function CartButton() {
  return (
    <div className="bg-[#47423c] content-stretch flex items-center p-[10px] relative rounded-[8px] shrink-0" data-name="Cart Button">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="shopping_cart">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="absolute inset-[8.33%_12.5%_8.33%_4.17%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
            <path d={svgPaths.p31ff7500} fill="#F4F4F2" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function QuickCta() {
  return (
    <div className="bg-[#ea560d] content-stretch flex items-start px-[20px] py-[10px] relative rounded-[6px] shrink-0" data-name="Quick CTA">
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#431307] text-[14px] whitespace-nowrap">CLAIM BOGO</p>
    </div>
  );
}

function NavActions() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Nav Actions">
      <CartButton />
      <QuickCta />
    </div>
  );
}

function HeaderNavigation() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-0 px-[80px] py-[20px] right-0 top-0" data-name="Header Navigation">
      <LogoMalbor className="relative shrink-0 w-[175px]" />
      <MenuLinks />
      <NavActions />
    </div>
  );
}

function LiveStatusBadge() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-name="Live Status Badge">
      <div aria-hidden className="absolute border border-[#ea560d] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="#EA560D" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic relative shrink-0 text-[#fcb875] text-[11px] whitespace-nowrap">LIMITED TIME · STOCK CLEARANCE</p>
    </div>
  );
}

function SecondaryInfo() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Secondary info">
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic relative shrink-0 text-[#f4f4f2] text-[12px] whitespace-nowrap">Discount automatically applied at checkout</p>
    </div>
  );
}

function HeroCtaGroup() {
  return (
    <div className="content-stretch flex gap-[16px] items-center pt-[12px] relative shrink-0" data-name="Hero CTA Group">
      <div className="bg-[#ea560d] relative rounded-[4px] shrink-0" data-name="Botão_Primário Enable">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[96px] py-[10px] relative size-full">
            <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#431307] text-[14px] whitespace-nowrap">SHOP THE BOGO NOW</p>
          </div>
        </div>
      </div>
      <SecondaryInfo />
    </div>
  );
}

function HeroContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="Hero Content">
      <LiveStatusBadge />
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[1.2] min-w-full relative shrink-0 text-[#f4f4f2] text-[64px] tracking-[-2px] w-[min-content]">Buy 1, Get 1 Free</p>
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.1] min-w-full relative shrink-0 text-[#fed6aa] text-[32px] w-[min-content]">Every 3.78L gallon in the Classic Line — while stock lasts.</p>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#acaa98] text-[16px] w-[min-content]">Formulated for the marine environment first, where salt and constant sun break down protection faster than anything a car sees on the road. High gloss, UV barrier and a super hydrophobic finish on both gelcoat and automotive paint.</p>
      <HeroCtaGroup />
    </div>
  );
}

function HeroImageFrame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[480px] items-start min-w-px overflow-clip relative rounded-[24px]" data-name="Hero Image Frame">
      <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle} />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="content-stretch flex gap-[40px] items-center pb-[100px] pt-[180px] px-[80px] relative shrink-0 w-full" data-name="Hero Section">
      <HeroContent />
      <HeroImageFrame />
    </div>
  );
}

function TrustBar() {
  return (
    <div className="bg-[#47423c] content-stretch flex items-center justify-between px-[80px] py-[24px] relative shrink-0 w-full" data-name="Trust Bar">
      <div aria-hidden className="absolute border-[#504b43] border-b border-solid border-t inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#acaa98] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">TRUSTED BY THE PROS</p>
      <div className="bg-[#504b43] h-[20px] relative shrink-0 w-px" data-name="Rectangle" />
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#acaa98] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">BUILT FOR MARINE, PROVEN ON PAINT</p>
      <div className="bg-[#504b43] h-[20px] relative shrink-0 w-px" data-name="Rectangle" />
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#acaa98] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">SIO2 FORMULA</p>
      <div className="bg-[#504b43] h-[20px] relative shrink-0 w-px" data-name="Rectangle" />
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#acaa98] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">MADE IN THE USA</p>
    </div>
  );
}

function ProductTitleWrapper() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-name="Product Title Wrapper">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#ea560d] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">CLASSIC LINE</p>
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[44px] whitespace-nowrap">Choose Your 3.78L Gallons</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#acaa98] text-[16px] text-center w-[600px]">Buy 1 and Get 1 free of the same product. Add two of the same 3.78L gallon to your cart — the second one is on us.</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[24px]">Deep Cleaning APC</p>
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[#fcb875] text-[12px] tracking-[0.8px] uppercase">3.78L GALLON · ALL-PURPOSE CLEANER</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#ea560d] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#431307] text-[14px] whitespace-nowrap">Add to Cart</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[8px] relative shrink-0 w-full" data-name="Frame">
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.1] relative shrink-0 text-[#f4f4f2] text-[32px] whitespace-nowrap">$39</p>
      <Frame3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px p-[24px] relative w-full" data-name="Frame">
      <Frame1 />
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#e4e3dd] text-[14px] w-full">Super-concentrated all-purpose cleaner for interior and exterior. Engine rooms, non-skid decks, interiors and heavy soil. Cuts through grease, salt and grime, rinsing clean without leaving residue.</p>
      <Frame2 />
    </div>
  );
}

function ProductCard() {
  return (
    <div className="bg-[#47423c] content-stretch flex flex-col h-[602px] items-start overflow-clip relative rounded-[20px] shadow-[0px_5px_16px_0px_rgba(8,15,52,0.06)] shrink-0 w-[384px]" data-name="Product Card">
      <div className="h-[240px] relative shrink-0 w-full" data-name="Rectangle">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[121.17%] left-[21.12%] max-w-none top-[-9.5%] w-[56.74%]" src={imgRectangle1} />
          </div>
          <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0" />
        </div>
      </div>
      <Frame />
    </div>
  );
}

function Frame5() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[24px]">Max Pro Shampoo</p>
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[#fcb875] text-[12px] tracking-[0.8px] uppercase">3.78L GALLON · SiO2 HIGH-FOAM SHAMPOO</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#ea560d] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#431307] text-[14px] whitespace-nowrap">Add to Cart</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[8px] relative shrink-0 w-full" data-name="Frame">
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.1] relative shrink-0 text-[#f4f4f2] text-[32px] whitespace-nowrap">$45</p>
      <Frame7 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col h-[362px] items-start justify-between p-[24px] relative shrink-0 w-full" data-name="Frame">
      <Frame5 />
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#e4e3dd] text-[14px] w-full">SiO2 shampoo for detail washes and salt rinses on hulls, fishing tackle, trailers and vehicles. Leaves a protective layer that will not yellow. Safe on fiberglass, epoxy paints, clear coat, metals, wood and plastics.</p>
      <Frame6 />
    </div>
  );
}

function ProductCard1() {
  return (
    <div className="bg-[#47423c] content-stretch flex flex-col h-[602px] items-start overflow-clip relative rounded-[20px] shadow-[0px_5px_16px_0px_rgba(8,15,52,0.06)] shrink-0 w-[384px]" data-name="Product Card">
      <div className="h-[240px] relative shrink-0 w-full" data-name="Rectangle">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[124.87%] left-[20.69%] max-w-none top-[-10.87%] w-[58.65%]" src={imgRectangle2} />
          </div>
          <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0" />
        </div>
      </div>
      <Frame4 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
      <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[24px]">Max Shield Polymer</p>
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.7] not-italic relative shrink-0 text-[#fcb875] text-[12px] tracking-[0.8px] uppercase">3.78L GALLON · SiO2 SEALANT</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[#ea560d] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#431307] text-[14px] whitespace-nowrap">Add to Cart</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[8px] relative shrink-0 w-full" data-name="Frame">
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.1] relative shrink-0 text-[#f4f4f2] text-[32px] whitespace-nowrap">$199</p>
      <Frame11 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-name="Frame">
      <Frame9 />
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#e4e3dd] text-[14px] w-full">SiO2 polymer sealant and the final step after compounding and micro finishing. Super hydrophobic finish, UV barrier and high gloss on gelcoat and painted surfaces. Up to 6 months of protection on vehicles maintained on a biweekly wash schedule; minimum one month on vessels, where monthly reapplication keeps a continuous barrier.</p>
      <Frame10 />
    </div>
  );
}

function ProductCard2() {
  return (
    <div className="bg-[#47423c] content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shadow-[0px_5px_16px_0px_rgba(8,15,52,0.06)] shrink-0 w-[384px]" data-name="Product Card">
      <div className="h-[240px] relative shrink-0 w-full" data-name="Rectangle">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[132.17%] left-[19.13%] max-w-none top-[-15.11%] w-[61.95%]" src={imgRectangle3} />
          </div>
          <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0" />
        </div>
      </div>
      <Frame8 />
    </div>
  );
}

function ProductCardGrid() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Product Card Grid">
      <ProductCard />
      <ProductCard1 />
      <ProductCard2 />
    </div>
  );
}

function ProductSection() {
  return (
    <div className="content-stretch flex flex-col gap-[56px] items-center px-[80px] py-[100px] relative shrink-0 w-full" data-name="Product Section">
      <ProductTitleWrapper />
      <ProductCardGrid />
    </div>
  );
}

function ProofIllustrationFrame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[420px] items-start min-w-px overflow-clip relative rounded-[24px]" data-name="Proof Illustration Frame">
      <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle4} />
      </div>
    </div>
  );
}

function ProofContent() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="Proof Content">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#ea560d] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">CROSSOVER TECHNOLOGY</p>
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] min-w-full relative shrink-0 text-[#f4f4f2] text-[44px] w-[min-content]">Built where conditions are worse.</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[1.5] min-w-full not-italic relative shrink-0 text-[#e4e3dd] text-[16px] w-[min-content]">Malbor formulas were engineered for saltwater and the relentless UV exposure of tropical marine environments. These are the conditions the line was built to handle, not conditions it was later adapted to.</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[1.6] min-w-full not-italic relative shrink-0 text-[#e4e3dd] text-[14px] w-[min-content]">From small center consoles to superyachts, the routine is the same: wash, compound, finish, protect — then do it again before salt and sun undo it. What holds up on a hull holds up on paint.</p>
    </div>
  );
}

function CrossoverProofSection() {
  return (
    <div className="bg-[#47423c] content-stretch flex gap-[64px] items-center px-[80px] py-[100px] relative shrink-0 w-full" data-name="Crossover Proof Section">
      <ProofIllustrationFrame />
      <ProofContent />
    </div>
  );
}

function HowHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-center relative shrink-0 whitespace-nowrap" data-name="How Header">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#ea560d] text-[14px] tracking-[0.8px] uppercase">PROMOTION STEP-BY-STEP</p>
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[44px]">How the BOGO Works</p>
    </div>
  );
}

function StepBadge() {
  return (
    <div className="bg-[#ea560d] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[12px] shrink-0" data-name="Step Badge">
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic relative shrink-0 text-[#431307] text-[12px] whitespace-nowrap">STEP 01</p>
    </div>
  );
}

function Step() {
  return (
    <div className="bg-[#47423c] content-stretch flex flex-col gap-[16px] items-start p-[32px] relative rounded-[24px] shrink-0 w-[384px]" data-name="Step 1">
      <StepBadge />
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[20px] whitespace-nowrap">Add To Cart</p>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] min-w-full not-italic relative shrink-0 text-[#e4e3dd] text-[14px] w-[min-content]">Add your 3.78L gallons to the cart.</p>
    </div>
  );
}

function StepBadge1() {
  return (
    <div className="bg-[#ea560d] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[12px] shrink-0" data-name="Step Badge">
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic relative shrink-0 text-[#431307] text-[12px] whitespace-nowrap">STEP 02</p>
    </div>
  );
}

function Step1() {
  return (
    <div className="bg-[#47423c] content-stretch flex flex-col gap-[16px] items-start p-[32px] relative rounded-[24px] shrink-0 w-[384px]" data-name="Step 2">
      <StepBadge1 />
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[20px] whitespace-nowrap">Automatic Discount</p>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] min-w-full not-italic relative shrink-0 text-[#e4e3dd] text-[14px] w-[min-content]">The second gallon is set to $0 at checkout. No code required.</p>
    </div>
  );
}

function StepBadge2() {
  return (
    <div className="bg-[#ea560d] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[12px] shrink-0" data-name="Step Badge">
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.8] not-italic relative shrink-0 text-[#431307] text-[12px] whitespace-nowrap">STEP 03</p>
    </div>
  );
}

function Step2() {
  return (
    <div className="bg-[#47423c] content-stretch flex flex-col gap-[16px] items-start p-[32px] relative rounded-[24px] shrink-0 w-[384px]" data-name="Step 3">
      <StepBadge2 />
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[20px] whitespace-nowrap">Delivery or Pickup</p>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] min-w-full not-italic relative shrink-0 text-[#e4e3dd] text-[14px] w-[min-content]">Choose delivery within Palm Beach, Broward and Miami-Dade counties, or pick up locally at no shipping cost.</p>
    </div>
  );
}

function StepsContainer() {
  return (
    <div className="content-stretch flex gap-[32px] items-start justify-center relative shrink-0 w-full" data-name="Steps Container">
      <Step />
      <Step1 />
      <Step2 />
    </div>
  );
}

function HowItWorksSection() {
  return (
    <div className="content-stretch flex flex-col gap-[56px] items-center px-[80px] py-[100px] relative shrink-0 w-full" data-name="How It Works Section">
      <HowHeader />
      <StepsContainer />
    </div>
  );
}

function Frame12() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#ea560d] text-[14px] tracking-[0.8px] uppercase">PROMOTION GUIDELINES</p>
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#f4f4f2] text-[44px]">The Fine Print</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="#EA560D" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#e4e3dd] text-[14px] whitespace-nowrap">Limit of 2 free gallons per individual order.</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="#EA560D" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#e4e3dd] text-[14px] whitespace-nowrap">Valid September 15–29, 2026, or while stock lasts.</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="#EA560D" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#e4e3dd] text-[14px] whitespace-nowrap">Delivery available in Palm Beach, Broward and Miami-Dade counties only.</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="#EA560D" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[1.6] min-w-px not-italic relative text-[#e4e3dd] text-[14px]">Local pickup available in Pompano Beach, FL and at Safe Harbor Lauderdale Marine Center, Fort Lauderdale, FL.</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Frame">
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="#EA560D" id="Ellipse" r="4" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#e4e3dd] text-[14px] w-[230px]">Shipping calculated at checkout.</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame14 />
      <Frame15 />
      <Frame16 />
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function DetailsContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-w-px relative" data-name="Details Content">
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function DetailsGraphicsFrame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[360px] items-start min-w-px overflow-clip relative rounded-[24px]" data-name="Details Graphics Frame">
      <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle5} />
      </div>
    </div>
  );
}

function OfferDetailsSection() {
  return (
    <div className="bg-[#47423c] content-stretch flex gap-[64px] items-center px-[80px] py-[100px] relative shrink-0 w-full" data-name="Offer Details Section">
      <DetailsContent />
      <DetailsGraphicsFrame />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#fed6aa] text-[20px] whitespace-nowrap">sales@malborcoatings.com</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#fed6aa] text-[20px] whitespace-nowrap">(925) 876-9005</p>
    </div>
  );
}

function ContactLinks() {
  return (
    <div className="content-stretch flex gap-[48px] items-center pt-[8px] relative shrink-0" data-name="Contact Links">
      <Frame19 />
      <div className="bg-[#504b43] h-[24px] relative shrink-0 w-px" data-name="Rectangle" />
      <Frame20 />
    </div>
  );
}

function TipsWrapper() {
  return (
    <div className="bg-[#47423c] content-stretch flex flex-col gap-[24px] items-center p-[48px] relative rounded-[32px] shrink-0 w-[1000px]" data-name="Tips Wrapper">
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#ea560d] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">EXPERT ASSISTANCE</p>
      <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[1.1] relative shrink-0 text-[#f4f4f2] text-[32px] text-center whitespace-nowrap">Questions on how to apply?</p>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#acaa98] text-[14px] text-center w-[600px]">Need guidance on prepping gelcoat or clear coat, or on cure times in South Florida humidity? Our team is happy to walk you through it before you order.</p>
      <ContactLinks />
    </div>
  );
}

function ApplicationTipsSection() {
  return (
    <div className="content-stretch flex flex-col items-center px-[80px] py-[100px] relative shrink-0 w-full" data-name="Application Tips Section">
      <TipsWrapper />
    </div>
  );
}

function FinalCtaButtons() {
  return (
    <div className="content-stretch flex items-center pt-[16px] relative shrink-0" data-name="Final CTA Buttons">
      <div className="bg-[#ea560d] relative rounded-[4px] shrink-0" data-name="Botão_Primário Enable">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[96px] py-[10px] relative size-full">
            <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#431307] text-[14px] whitespace-nowrap">SHOP THE BOGO NOW</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalCtaSection() {
  return (
    <div className="bg-[#24211e] content-stretch flex flex-col gap-[32px] items-center px-[80px] py-[120px] relative shrink-0 w-full" data-name="Final CTA Section">
      <p className="[word-break:break-word] font-['Poppins:SemiBold',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[#ea560d] text-[14px] tracking-[0.8px] uppercase whitespace-nowrap">ACT BEFORE STOCK DEPLETES</p>
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[1.2] relative shrink-0 text-[#f4f4f2] text-[64px] text-center tracking-[-2px] w-[800px]">Stock clearance runs until September 29, or until stock is gone.</p>
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#e4e3dd] text-[16px] text-center w-[600px]">Maximize your business margins and keep your fleet or collection gleaming. Do not wait — these formulas are available while stock lasts.</p>
      <FinalCtaButtons />
    </div>
  );
}

function FooterBrandCol() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[320px]" data-name="Footer Brand Col">
      <LogoMalbor className="relative shrink-0 w-[175px]" />
      <p className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[1.6] min-w-full not-italic relative shrink-0 text-[#acaa98] text-[14px] w-[min-content]">Ocean-tested silicon dioxide protection engineered for deep gloss and lasting surface performance</p>
    </div>
  );
}

function FooterLinkCol() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start leading-[1.4] relative shrink-0 whitespace-nowrap" data-name="Footer Link Col 1">
      <p className="font-['Montserrat:Bold',sans-serif] font-bold relative shrink-0 text-[#f4f4f2] text-[16px]">Products</p>
      <p className="font-['Poppins:Regular',sans-serif] not-italic relative shrink-0 text-[#acaa98] text-[12px]">Deep Cleaning APC</p>
      <p className="font-['Poppins:Regular',sans-serif] not-italic relative shrink-0 text-[#acaa98] text-[12px]">Max Pro Shampoo</p>
      <p className="font-['Poppins:Regular',sans-serif] not-italic relative shrink-0 text-[#acaa98] text-[12px]">Max Shield Polymer</p>
    </div>
  );
}

function FooterLinkCol1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start leading-[1.4] relative shrink-0 whitespace-nowrap" data-name="Footer Link Col 2">
      <p className="font-['Montserrat:Bold',sans-serif] font-bold relative shrink-0 text-[#f4f4f2] text-[16px]">Company</p>
      <p className="font-['Poppins:Regular',sans-serif] not-italic relative shrink-0 text-[#acaa98] text-[12px]">About Malbor</p>
      <p className="font-['Poppins:Regular',sans-serif] not-italic relative shrink-0 text-[#acaa98] text-[12px]">Certified Installer Program</p>
    </div>
  );
}

function FooterLinkCol2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-end leading-[1.4] relative shrink-0 whitespace-nowrap" data-name="Footer Link Col 3">
      <p className="font-['Montserrat:Bold',sans-serif] font-bold relative shrink-0 text-[#f4f4f2] text-[16px]">Headquarters</p>
      <p className="font-['Poppins:Regular',sans-serif] not-italic relative shrink-0 text-[#acaa98] text-[12px]">Fort Lauderdale, Florida</p>
      <p className="font-['Poppins:Regular',sans-serif] not-italic relative shrink-0 text-[#acaa98] text-[12px]">MADE IN THE USA</p>
    </div>
  );
}

function FooterGrid() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Footer Grid">
      <FooterBrandCol />
      <FooterLinkCol />
      <FooterLinkCol1 />
      <FooterLinkCol2 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0" data-name="Frame">
      <p className="relative shrink-0">Privacy Policy</p>
      <p className="relative shrink-0">Terms of Service</p>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Poppins:SemiBold',sans-serif] items-center justify-between leading-[1.8] not-italic relative shrink-0 text-[#acaa98] text-[11px] w-full whitespace-nowrap" data-name="Footer Bottom">
      <p className="relative shrink-0">Copyright © 2026 Malbor Coatings. All rights reserved.</p>
      <Frame21 />
    </div>
  );
}

function FooterSection() {
  return (
    <div className="bg-[#24211e] content-stretch flex flex-col gap-[64px] items-start pb-[40px] pt-[80px] px-[80px] relative shrink-0 w-full" data-name="Footer Section">
      <div aria-hidden className="absolute border-[#47423c] border-solid border-t inset-0 pointer-events-none" />
      <FooterGrid />
      <FooterBottom />
    </div>
  );
}

export default function LpBogoMalbor() {
  return (
    <div className="bg-[#24211e] content-stretch flex flex-col items-start relative size-full" data-name="lp-bogo-malbor">
      <HeaderNavigation />
      <HeroSection />
      <TrustBar />
      <ProductSection />
      <CrossoverProofSection />
      <HowItWorksSection />
      <OfferDetailsSection />
      <ApplicationTipsSection />
      <FinalCtaSection />
      <FooterSection />
    </div>
  );
}