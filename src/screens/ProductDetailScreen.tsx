import React, { useState } from 'react';
import { Product, ScreenType } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

export interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  finishPurchased?: string;
}

interface ProductDetailScreenProps {
  productId: string;
  onNavigate: (screen: ScreenType, productId?: string) => void;
  onAddToCart: (product: Product, quantity?: number, colorway?: string) => void;
  onInstantBuy: (product: Product, quantity?: number, colorway?: string) => void;
  onOpen360: (productName: string) => void;
  onOpenSpecPdf?: () => void;
  onOpenBOM?: () => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  onShowToast?: (title: string, subtitle: string, type?: 'success' | 'info') => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  productId,
  onNavigate,
  onAddToCart,
  onInstantBuy,
  onOpen360,
  onOpenSpecPdf,
  onOpenBOM,
  onToggleWishlist,
  isWishlisted = false,
  onShowToast,
}) => {
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(
    product.colorways?.[0]?.name || 'Ivory White & Natural Beech'
  );
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Only show images belonging to this product; never mix other catalogue photos into its gallery.
  const galleryImages = [product.image, ...(product.additionalImages || [])].slice(0, 4);

  const companions = [
    {
      id: 'nordic-rocking-horse',
      skuLabel: 'Item #11 • Modern Classic',
      title: 'Wooden Rocking Horse',
      desc: 'Rocking-horse concept; runner geometry and stability need testing.',
      price: 5499,
      subtitle: 'Pre-assembled',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLbstktrNmUr3cZBTvksKn262VzALJuvUO0g3PlteRM_4pq8jHRpNM5Dv1d4DxWJgHaUmpSYMmbTduiOdUN4oE-xarj6uY4wDNIj6V1Kj2Q57Etc8YIXqCdiOkfytpfvQGDmzoRbIfFXN1MAGK3tl_tVl3rfJYwQk_FKAqIorfxjWNIlS46xV0Wkvox1CgOsoCJnh_qdk2euDj4ndN-dUvDz-niwIOA4yOPiKv41eNC9x9dtl7-BLhjA',
    },
    {
      id: 'stacking-stones-sorter',
      skuLabel: 'Item #35 • Tactile Focus',
      title: 'Stacking Stones & Shape Sorter',
      desc: 'Stacking-and-sorting concept; final shape and materials pending.',
      price: 899,
      subtitle: 'Set of 7 Stones',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC41wtRY5FtMxlXvcaXqMV9JyPgiSdXnSePDFgyiexvIsUyYuPbcHqhdFkdgtCQ1UalI2uNj1f6Ul5QNOdYTeVYACq89AGpzebKUXFFpgFtdQcm9e3_DZyaz6xF5KWqsDOaCZSNsLpjsjTAHj158n_IyFNgOF4Br0Fpa4Xh5Z0gsUZR2tNTuI7Tzr-8RLdt_qnNwljCvOR5U4qIqyj1UOOuZ_kIJe0HtqTtubx643GIWHD9zHnXDmeb0A',
    },
    {
      id: 'the-cart-wagon',
      skuLabel: 'Item #30 • Motion & Cargo',
      title: 'The Cart Wagon',
      desc: 'Deep cargo chamber for carrying treasured collections, books, and companions.',
      price: 3999,
      subtitle: 'Pilot concept',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApuKJglacCLNgAbH193ab_aBAYRpLSAQgMlbxYtTnkbl9TClkHSzS2Z1EXg5fP2UwGXP1MM-63JgNPiuvKBTV-KWYF5xf4cyCIyfzEYOPT-lPKKmij1kOp2mAwd_pYLf7p0pHOtfpk-jiuw7RJ4Wu_VOOy7mdl7P6wwfWqVWcMxkek_p0Jcs8bWjP-RwwGu9rvW8vsfA_0kzHYRATbdN0EQgvk6eYS-b39WMhV2EOE_LVm36wzb7ZcDg',
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Editorial Breadcrumb Bar */}
      <section className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-12 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#7e756f]">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#171411] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="opacity-40">/</span>
          <button
            onClick={() => onNavigate('wheels-and-motion')}
            className="hover:text-[#171411] transition-colors cursor-pointer"
          >
            {product.categoryLabel}
          </button>
          <span className="opacity-40">/</span>
          <span className="text-[#171411] font-semibold">{product.name}</span>
        </nav>
      </section>

      {/* Main Showcase & Purchase Module (2-Column Architecture) */}
      <section className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery & Tactile Visual Narratives */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Stage Image Container with Interactive Zoom */}
            <div
              className="relative w-full aspect-[4/5] bg-[#f5f3f0] rounded-2xl overflow-hidden group shadow-sm cursor-crosshair border border-[#e4e2df]"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={galleryImages[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-300 ease-out"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
                }}
              />

              {/* Floating Editorial Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-[#171411] shadow-sm border border-[#e4e2df]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7d562d]"></span>
                  Material details pending
                </span>
                <button
                  onClick={() => onOpen360(product.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-[#4d4540] hover:text-[#171411] shadow-sm border border-[#e4e2df] pointer-events-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#7d562d] text-[15px]">
                    view_in_ar
                  </span>
                  <span>Interactive concept preview</span>
                </button>
              </div>

              {/* Bottom Floating Control Pill */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[#4d4540] text-[11px] font-semibold border border-[#e4e2df]">
                <button
                  onClick={() => onOpen360(product.name)}
                  className="hover:text-[#171411] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Expand View"
                >
                  <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                  <span>Inspect Detail</span>
                </button>
                <span className="opacity-30">|</span>
                <span className="text-[#171411] font-bold">
                  0{activeImageIndex + 1} / 0{galleryImages.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery Grid */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square rounded-xl overflow-hidden bg-[#f5f3f0] p-1 transition-all shadow-sm cursor-pointer border ${
                    activeImageIndex === i
                      ? 'ring-2 ring-[#171411] border-transparent opacity-100'
                      : 'border-[#e4e2df] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>

            {/* Artisan Story Micro-Card */}
            <div className="mt-2 p-4 bg-[#efeeeb] rounded-2xl flex items-center justify-between gap-4 shadow-sm border border-[#cfc4bd]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#eae8e5] shrink-0 shadow-inner ring-1 ring-white">
                  <img
                    alt="Wood Craftsman"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4gR3YJs2zyysTOUR4BHIDxpe3dkn8aXoW2hRRydrfDribfa-2Sk7FbAeBJQeMDoNW5I0Xv-9b1O2SNmvJJVD2R9PFm7SpFNiaSTnX6DCvN0fwDfscGDiWDmJm1P13X4ACzjCAaBSGy6Tl-RpDtQZ6zQdmbvpPEFGSc3P_pCSJnTvML8NkAyl4jqBNKfJkkj2vMkqD8WNfGx-3SwGTuQo8_iKkbkyomkK0QDXH5DO8B_oSHpBxnmkEhg"
                  />
                </div>
                <div>
                  <p className="font-serif font-bold text-sm text-[#171411]">
                    Hand-finished in Bavaria &amp; Gujarat
                  </p>
                  <p className="text-[12px] text-[#4d4540]">
                    Each curve buffed with three grades of organic beeswax for silky tactile safety.
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#7d562d] shrink-0 text-2xl">
                verified
              </span>
            </div>
          </div>

          {/* Right Column: Sticky Purchasing Console */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-5 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#e4e2df]">
            {/* Header & Series Monograph */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7d562d]">
                  Debut Collection • Prototype Edition 01
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#efeeeb] text-[#4d4540] font-semibold">
                  In Stock (Batch 04)
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#171411] tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 pt-1 text-xs text-[#7a7166]">
              <span className="inline-flex items-center rounded-full bg-[#f1e7d7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7d562d]">Pilot concept</span>
              <span>Customer reviews open after launch.</span>
            </div>

            {/* Pricing Tier & Taxation Disclaimer */}
            <div className="py-1">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#171411]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#7e756f] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                <span className="text-[10px] text-[#7d562d] font-bold uppercase tracking-wider bg-[#ffdcbd] px-2 py-0.5 rounded">
                  Indicative target
                </span>
              </div>
              <p className="text-[12px] text-[#4d4540] mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#7d562d]">
                  local_shipping
                </span>
                <span>Planning target only. Shipping and checkout are not active yet.</span>
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#e4e2df] bg-[#f7f3ed]">
              <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#8a6847]">About pilot pricing</p>
              <p className="text-xs leading-relaxed text-[#5f564b] mt-2">The amount shown is an indicative planning target, not a confirmed retail price. Final pricing depends on supplier quotations, materials, packaging, shipping and testing requirements.</p>
            </div>

            {/* Finishes Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#171411] font-bold uppercase tracking-wider">
                  Finish &amp; Colorway:
                </span>
                <span className="text-[#7d562d] font-semibold">{selectedFinish}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Ivory White & Natural Beech', label: 'Ivory & Beech', color: '#f4f1ea' },
                  { name: 'Pure Raw Birch', label: 'Raw Birch', color: '#E5D7C3' },
                  { name: 'Warm Oat Lacquer', label: 'Warm Oat', color: '#D7C2AB' },
                ].map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => setSelectedFinish(opt.name)}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 text-[11px] transition-all cursor-pointer border ${
                      selectedFinish === opt.name
                        ? 'ring-2 ring-[#171411] bg-[#efeeeb] font-bold text-[#171411] border-transparent'
                        : 'bg-[#f5f3f0] text-[#4d4540] hover:bg-[#efeeeb] border-[#e4e2df]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-[#cfc4bd] shadow-inner"
                      style={{ backgroundColor: opt.color }}
                    ></div>
                    <span className="truncate w-full text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-[#f5f3f0] rounded-xl border border-[#e4e2df]">
                <p className="text-[9px] uppercase font-bold tracking-[0.12em] text-[#7e756f]">Age guide</p>
                <p className="font-semibold text-xs text-[#171411] mt-1">Pending review</p>
              </div>
              <div className="p-3 bg-[#f5f3f0] rounded-xl border border-[#e4e2df]">
                <p className="text-[9px] uppercase font-bold tracking-[0.12em] text-[#7e756f]">Capacity</p>
                <p className="font-semibold text-xs text-[#171411] mt-1">Testing pending</p>
              </div>
              <div className="p-3 bg-[#f5f3f0] rounded-xl border border-[#e4e2df]">
                <p className="text-[9px] uppercase font-bold tracking-[0.12em] text-[#7e756f]">Dimensions</p>
                <p className="font-semibold text-xs text-[#171411] mt-1">To confirm</p>
              </div>
            </div>

            {/* Purchase Actions (Quantity, Primary Add, Express Checkout) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-[#f5f3f0] rounded-xl px-2 py-1 border border-[#e4e2df]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-9 flex items-center justify-center text-[#171411] hover:text-[#7d562d] font-bold text-lg cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-[#171411]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(8, q + 1))}
                    className="w-8 h-9 flex items-center justify-center text-[#171411] hover:text-[#7d562d] font-bold text-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Bag Button */}
                <button
                  onClick={() => onAddToCart(product, quantity, selectedFinish)}
                  className="flex-1 bg-[#171411] text-white hover:bg-[#7d562d] h-[48px] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Acquire Heirloom Piece</span>
                </button>

                {/* Wishlist Heart Toggle */}
                {onToggleWishlist && (
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`w-12 h-[48px] rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#ffebee] border-red-300 text-red-600'
                        : 'bg-[#f5f3f0] border-[#e4e2df] text-[#4d4540] hover:text-[#171411]'
                    }`}
                    title={isWishlisted ? 'Saved in Nursery Wishlist' : 'Save to Nursery Wishlist'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isWishlisted ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                )}
              </div>

              {/* Express Checkout with Apple Pay / UPI */}
              <button
                onClick={() => onInstantBuy(product, quantity, selectedFinish)}
                className="w-full bg-[#f0bd8b] text-[#2c1600] hover:bg-[#ffdcbd] h-[46px] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Instant Express Checkout (UPI / Apple Pay)</span>
              </button>

              {/* Quick Dossier Actions */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <button
                  onClick={() => onNavigate('gift-registry')}
                  className="flex-1 min-w-[120px] py-2 rounded-lg bg-[#fbf9f6] border border-[#cfc4bd] hover:border-[#171411] text-[#171411] text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🎁 Add to Gift Registry</span>
                </button>
                {onOpenSpecPdf && (
                  <button
                    onClick={onOpenSpecPdf}
                    className="flex-1 min-w-[120px] py-2 rounded-lg bg-[#fbf9f6] border border-[#cfc4bd] hover:border-[#171411] text-[#171411] text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>📄 View Spec PDF</span>
                  </button>
                )}
                {onOpenBOM && (
                  <button
                    onClick={onOpenBOM}
                    className="flex-1 min-w-[120px] py-2 rounded-lg bg-[#fbf9f6] border border-[#cfc4bd] hover:border-[#171411] text-[#171411] text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>🌲 Raw Wood BOM</span>
                  </button>
                )}
              </div>
            </div>

            {/* Reassurance Guarantees */}
            <div className="pt-2 grid grid-cols-1 gap-2 text-[12px] text-[#4d4540]">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f5f3f0]">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                  workspace_premium
                </span>
                <span>
                  <strong>Prototype design review:</strong> joinery, stability and repair requirements will be assessed before launch.
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f5f3f0]">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">shield</span>
                <span>
                  <strong>Safety validation pending:</strong> testing, age guidance and finish requirements must be confirmed before sale.
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f5f3f0]">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                  nest_eco_leaf
                </span>
                <span>
                  <strong>Launch policies pending:</strong> order, shipping, returns and warranty terms are not active yet.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Spotlight: Tactile Detail & Design Anatomy */}
      <section className="w-full bg-[#f5f3f0] py-16 md:py-20 border-y border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#7d562d]">
                Anatomy of Quiet Play
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#171411]">
                Sculpted for child autonomy, calibrated for peaceful interiors.
              </h2>
            </div>
            <p className="text-sm text-[#4d4540] max-w-md">
              Unlike commercial plastic ride-ons that flood children with electronic beeps and frantic
              flashing lights, The Minimal Ride-On centers inner poise and proprioception.
            </p>
          </div>

          {/* Bento Grid of Craft Innovations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-[#e4e2df]">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#efeeeb] mb-4">
                <img
                  alt="Silent Floor-Safe Rolling"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxhAV3AreHj42JSt7EJuitBeZmIWse7-72OOeqLuoWGRzNcayJEKrn7fmpk1NihH-YUpGjck3oPbGv5WXTj5JdDG3HKX40pxr6aEyn8CitoguqtJUxdEGOFhCkwx5Q62ugtybZjvrPLAA9dheZ_4GzsPSzHHY6AKVVyyxaS1eYRNTqYeFVIZYGmrIObsxu-UnKG3opJsoIkKi50bEncPwTwR97yavwOEWePohlcH-oT1N4RM8JTmqRfQ"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#7d562d]">
                  <span className="material-symbols-outlined text-[16px]">volume_off</span>
                  <span>Acoustic Comfort</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#171411]">
                  Floor-Safe Silent Rollers
                </h3>
                <p className="text-xs text-[#4d4540] leading-relaxed">
                  Concealed medical-grade elastomer dampening rings glide effortlessly over Italian
                  marble, hardwood, and jute without scratching or clattering.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-[#e4e2df]">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#efeeeb] mb-4">
                <img
                  alt="Anatomical Grip Radius"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUj7rdK3Y9w-0mk6nxcsFJurwyIdU6_8WLhdeMoDmAGz6156mB895cWP0Fj6stZpbogO8DJp92WlUUuxIjLoC1nTbHZPPo32DFrhJd0fvGrue3t8qmMbp_Ch4vZxT7mZ8a2XVTGXgRBWa0hey1uR-rYFF_7Ttl7cU76DMBAoSsJ7Aaio1vIw4fvReoPqK2mnmmyk3m5pmVmZuhroDYTwjd-Elu1nrTRY1zumCPkVVqInMS9dmFRZuUhw"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#7d562d]">
                  <span className="material-symbols-outlined text-[16px]">front_hand</span>
                  <span>Biomechanical Precision</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#171411]">
                  28mm Anatomical Grip Bar
                </h3>
                <p className="text-xs text-[#4d4540] leading-relaxed">
                  Turned from a single solid bough of beech, sized precisely for toddler palms
                  (12–36 months) to foster confident arm stabilization and upright posture.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-[#e4e2df]">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#efeeeb] mb-4">
                <img
                  alt="Interlocking Timber Stability"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxvdXvNtCvCtJ1TQaOXGi7AXRi5BLEEr29Hhq1tIxBmZ2W8_nJNWWShVbvbWs3fOpEXoEbWodgBg5C_7apVFc7CnXSF1eJ1u25Ucua_ChwRORaVtBTX-il9zQ0L_HXcR6qjCzekkRO99jYWfFziwkq4dyDsegV9yY981j3Dp1jc2MyRJYBfLWyNjeTecipsj0nnsMJnsHGjq747_XggTsgkyqQf0AqSlljkU6-VmMMqGZJrabeSp8CLA"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#7d562d]">
                  <span className="material-symbols-outlined text-[16px]">architecture</span>
                  <span>Generational Joinery</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#171411]">
                  Tip-Resistant Low Center
                </h3>
                <p className="text-xs text-[#4d4540] leading-relaxed">
                  An ultra-low 14cm ground chassis height combined with an ergonomic 52cm wheelbase
                  minimizes rollover risk during spirited nursery adventures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#f3efe7] py-12 md:py-16 border-y border-[#e3d8c8]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8a6847]">Product dossier</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">Details that will be verified before launch.</h2>
            <p className="text-sm text-[#6d6256] leading-relaxed mt-4">The images show the intended visual direction, not a certified production unit. Final dimensions, materials, finishes, age guidance, assembly instructions and capacity will be published after engineering and supplier review.</p>
          </div>
          <div className="rounded-2xl bg-white border border-[#e2d7c8] p-5 space-y-3">
            {[
              ['Materials & finish', 'Supplier and coating specifications pending'],
              ['Dimensions & assembly', 'Prototype measurements pending'],
              ['Age guidance & stability', 'Qualified safety review pending'],
              ['Price, delivery & returns', 'Confirmed when the launch plan is ready'],
            ].map(([title, detail]) => (
              <div key={title} className="py-2 border-b border-[#eee7dc] last:border-0">
                <p className="text-sm font-semibold text-[#2b332b]">{title}</p>
                <p className="text-xs text-[#7d7469] mt-1">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Co-Purchase Grid: Complete the Heirloom Playroom */}
      <section className="w-full bg-[#f5f3f0] py-16 border-y border-[#e4e2df]">
        <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#7d562d]">
                Harmonious Companions
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#171411]">
                Complete the Heirloom Playroom
              </h2>
            </div>
            <button
              onClick={() => onNavigate('all-collections')}
              className="text-xs text-[#171411] hover:text-[#7d562d] uppercase tracking-wider flex items-center gap-1 font-bold transition-colors cursor-pointer"
            >
              <span>Explore all pilot products</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companions.map((comp) => {
              const fullProd = PRODUCTS.find((p) => p.id === comp.id);
              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-[#e4e2df]"
                >
                  <div>
                    <div
                      onClick={() => onNavigate('product-detail', comp.id)}
                      className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#f5f3f0] mb-3 cursor-pointer group"
                    >
                      <img
                        src={comp.img}
                        alt={comp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold text-[#171411] shadow-sm">
                        {comp.skuLabel}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#7e756f] uppercase font-bold tracking-wider">
                        {comp.subtitle}
                      </span>
                      <h3
                        onClick={() => onNavigate('product-detail', comp.id)}
                        className="font-serif text-base font-bold text-[#171411] cursor-pointer hover:text-[#7d562d]"
                      >
                        {comp.title}
                      </h3>
                      <p className="text-[12px] text-[#4d4540] line-clamp-2">{comp.desc}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-[#f5f3f0] flex items-center justify-between">
                    <div>
                      <span className="font-serif text-lg font-bold text-[#171411]">
                        {formatINR(comp.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => fullProd && onAddToCart(fullProd)}
                      className="px-4 py-2 bg-[#efeeeb] hover:bg-[#171411] hover:text-white text-[#171411] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>+ Pair</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="customer-reviews" className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="rounded-2xl bg-[#f0ece4] border border-[#e2d7c8] p-6 md:p-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6847]">Community feedback</span>
          <h2 className="font-serif text-2xl md:text-3xl mt-2">Real reviews come after real experiences.</h2>
          <p className="text-sm text-[#6d6256] mt-3 max-w-2xl leading-relaxed">This product is currently a pilot concept. We have removed placeholder testimonials and star ratings. Verified customer feedback can be added once products are available and the review system is connected.</p>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] font-bold text-[#625848]">No sample reviews</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] font-bold text-[#625848]">Safety review pending</span>
          </div>
        </div>
      </section>
    </div>
  );
};
