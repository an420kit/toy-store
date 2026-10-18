import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart, Minus, Plus, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { Product, ScreenType } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

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
}) => {
  const product = PRODUCTS.find((item) => item.id === productId) || PRODUCTS[0];
  const images = [product.image, ...(product.additionalImages || [])].filter(Boolean);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState(product.colorways?.[0]?.name || 'Natural wood direction');

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setSelectedFinish(product.colorways?.[0]?.name || 'Natural wood direction');
  }, [productId]);

  const activeImage = images[activeImageIndex] || product.image;
  const isTargetPrice = Boolean(product.status?.toLowerCase().includes('planning target') || product.status?.toLowerCase().includes('pending') || product.badge?.toLowerCase().includes('concept'));

  return (
    <div className="min-h-screen bg-[#fbf8f2] pb-16 text-[#27251f]">
      <div className="border-b border-[#e6ddcf] px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between">
          <button type="button" onClick={() => onNavigate('all-collections')} className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#716657] transition hover:text-[#2e3d31]"><ArrowLeft size={14} /> Back to collection</button>
          <div className="text-[9px] uppercase tracking-[0.2em] text-[#9a846a]">WOODKIND · Pilot range</div>
        </div>
      </div>

      <section className="px-4 py-7 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <div className="relative aspect-[4/4.1] overflow-hidden bg-[#eee6da] sm:aspect-[1.12/1]">
              <img key={activeImage} src={activeImage} alt={product.name} className="relative z-10 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
              <div className="absolute inset-0 z-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#f8f3eb,#e5d4bd)]"><div className="text-center"><div className="font-serif text-5xl italic text-[#9a7955]">W.</div><div className="mt-2 text-[9px] uppercase tracking-[0.22em] text-[#927c62]">Concept image</div></div></div>
              <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-[#fbf8f1]/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#62533f] backdrop-blur">{product.badge || 'Pilot collection'}</div>
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button type="button" onClick={() => setActiveImageIndex((activeImageIndex + images.length - 1) % images.length)} aria-label="Previous image" className="flex h-10 w-10 items-center justify-center border border-white/70 bg-white/80 text-[#2e3d31] backdrop-blur"><ArrowLeft size={15} /></button>
                  <button type="button" onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)} aria-label="Next image" className="flex h-10 w-10 items-center justify-center border border-white/70 bg-white/80 text-[#2e3d31] backdrop-blur"><ArrowRight size={15} /></button>
                </div>
              )}
            </div>
            {images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3">{images.map((image, index) => <button type="button" key={image} onClick={() => setActiveImageIndex(index)} className={`aspect-square overflow-hidden border ${index === activeImageIndex ? 'border-[#2e3d31]' : 'border-transparent opacity-70'}`}><img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button type="button" onClick={() => onOpen360(product.name)} className="flex items-center justify-center gap-2 border border-[#ddd2c2] px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#635848] transition hover:bg-[#f1e9dd]"><Sparkles size={14} /> View concept</button>
              <button type="button" onClick={() => onOpenSpecPdf?.()} className="flex items-center justify-center gap-2 border border-[#ddd2c2] px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#635848] transition hover:bg-[#f1e9dd]"><Ruler size={14} /> Product brief</button>
              <button type="button" onClick={() => onOpenBOM?.()} className="flex items-center justify-center gap-2 border border-[#ddd2c2] px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#635848] transition hover:bg-[#f1e9dd]"><ShieldCheck size={14} /> Materials & build</button>
            </div>
          </div>

          <div className="flex flex-col pt-1 lg:pt-5">
            <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#947453]"><span>{product.categoryLabel}</span><span className="text-[#c7b7a0]">/</span><span>{product.sku}</span></div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="max-w-[640px] font-serif text-4xl font-normal leading-[1.08] tracking-[-0.03em] sm:text-5xl">{product.name}</h1>
              <button type="button" onClick={() => onToggleWishlist?.(product.id)} aria-pressed={isWishlisted} aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'} className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center border transition ${isWishlisted ? 'border-[#2e3d31] bg-[#2e3d31] text-white' : 'border-[#d8cbbb] text-[#6d604f] hover:bg-[#f1e9dd]'}`}><Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} /></button>
            </div>
            <p className="mt-5 max-w-[590px] text-sm leading-7 text-[#766d60]">{product.subtitle}</p>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-y border-[#e5dbce] py-5">
              <div>
                <div className="font-serif text-3xl text-[#2e3d31]">{formatINR(product.price)}</div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#9a8c79]">{isTargetPrice ? 'Indicative pilot price · subject to quote' : 'Indicative price'}</div>
              </div>
              <span className="inline-flex items-center gap-2 border border-[#ddcfba] bg-[#f5eee3] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#765c3f]"><span className="h-1.5 w-1.5 rounded-full bg-[#b58b5b]" /> Specification in review</span>
            </div>

            <div className="mt-6 text-sm leading-7 text-[#686154]">{product.description}</div>

            {product.colorways && product.colorways.length > 1 && (
              <div className="mt-6">
                <div className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#837663]">Finish direction</div>
                <div className="flex flex-wrap gap-2">{product.colorways.map((finish) => <button type="button" key={finish.name} onClick={() => setSelectedFinish(finish.name)} className={`border px-3 py-2 text-xs transition ${selectedFinish === finish.name ? 'border-[#2e3d31] bg-[#f0e8dc]' : 'border-[#ddd2c2] bg-transparent hover:bg-[#f4ede4]'}`}><span className="mr-2 inline-block h-3 w-3 rounded-full border border-black/10 align-middle" style={{ backgroundColor: finish.hex }} />{finish.name}</button>)}</div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="inline-flex h-12 items-center border border-[#d9cebf]">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="flex h-full w-10 items-center justify-center text-[#655847] hover:bg-[#f0e8dc]"><Minus size={13} /></button>
                <span className="w-8 text-center text-xs">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} aria-label="Increase quantity" className="flex h-full w-10 items-center justify-center text-[#655847] hover:bg-[#f0e8dc]"><Plus size={13} /></button>
              </div>
              <button type="button" onClick={() => onAddToCart(product, quantity, selectedFinish)} className="flex min-h-12 flex-1 items-center justify-center gap-3 bg-[#2e3d31] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#435644] sm:flex-none">Add to bag <ArrowRight size={15} /></button>
              <button type="button" onClick={() => onInstantBuy(product, quantity, selectedFinish)} className="min-h-12 border border-[#d9cebf] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51473a] transition hover:bg-[#f0e8dc]">Review bag</button>
            </div>

            <div className="mt-7 border border-[#e1d5c3] bg-[#f5eee3] p-4">
              <div className="flex items-start gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#90704b]" /><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#65513a]">Before this piece is released</p><p className="mt-2 text-xs leading-5 text-[#766958]">This catalogue includes pilot concepts and visual references. Final materials, dimensions, age guidance, safety information and availability are pending confirmation for the production-intent item.</p></div></div>
            </div>

            <div className="mt-8 border-t border-[#e5dbce] pt-5">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div><div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#958672]">Play theme</div><div className="mt-2 text-xs text-[#514a3e]">{product.categoryLabel}</div></div>
                <div><div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#958672]">Material direction</div><div className="mt-2 text-xs text-[#514a3e]">{product.timber}</div></div>
                <div><div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#958672]">Launch state</div><div className="mt-2 text-xs text-[#514a3e]">Pilot review</div></div>
              </div>
            </div>
            <button type="button" onClick={() => onNavigate('all-collections')} className="mt-7 inline-flex items-center gap-2 self-start border-b border-[#9b866e] pb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6d5c49] hover:text-[#2e3d31]">Continue exploring <ArrowUpRight size={13} /></button>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5dbce] bg-[#f3ece1] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1450px] gap-5 sm:grid-cols-3">
          {[
            ['01', 'A clear pilot price', 'Indicative pricing is labelled until supplier quotations are confirmed.'],
            ['02', 'A thoughtful review', 'Materials, dimensions and build details are checked before release.'],
            ['03', 'No invented guarantees', 'Safety details are published only after product-specific validation.'],
          ].map(([n, title, copy]) => <div key={n} className="flex gap-4"><div className="font-serif text-xl italic text-[#a58a6d]">{n}</div><div><h3 className="text-xs font-semibold text-[#464035]">{title}</h3><p className="mt-1 text-xs leading-5 text-[#827767]">{copy}</p></div></div>)}
        </div>
      </section>
    </div>
  );
};
