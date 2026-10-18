import React from 'react';
import { Product, ScreenType } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType, productId?: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenBespokeModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onAddToCart,
  onQuickView,
  onOpenBespokeModal,
}) => {
  const categories: { title: string; description: string; screen: ScreenType; count: number; icon: string }[] = [
    { title: 'Wheels & Motion', description: 'First rides and pull-along play.', screen: 'wheels-and-motion', count: PRODUCTS.filter((p) => p.category === 'wheels').length, icon: '↗' },
    { title: 'Rocking & Balance', description: 'Curves, balance and gentle movement.', screen: 'rocking-and-balance', count: PRODUCTS.filter((p) => p.category === 'rocking').length, icon: '◒' },
    { title: 'Climbing & Play Gyms', description: 'Movement concepts for supervised play.', screen: 'climbing-and-play-gyms', count: PRODUCTS.filter((p) => p.category === 'climbing').length, icon: '⌁' },
    { title: 'Learning & Montessori', description: 'Tactile sorting and open-ended play.', screen: 'learning-and-montessori', count: PRODUCTS.filter((p) => p.category === 'learning').length, icon: '◇' },
  ];

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] text-[#171411]">
      <section className="relative overflow-hidden bg-[#f1ece3] border-b border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d562d] border border-[#ded3c3]">
              <span className="w-2 h-2 rounded-full bg-[#7d562d]" />
              WOODKIND · Pilot collection
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-tight">
              Thoughtful wooden play for <span className="italic text-[#8d6947]">everyday discovery.</span>
            </h1>
            <p className="max-w-xl text-base md:text-lg leading-relaxed text-[#5d554c]">
              A considered range of ride-ons, rocking toys, balance boards, climbing concepts and tactile play objects—designed around natural materials and quiet forms.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button onClick={() => onNavigate('all-collections')} className="inline-flex items-center gap-3 bg-[#233b2d] text-white hover:bg-[#314d3b] px-6 py-3.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                Explore the collection <span aria-hidden="true">→</span>
              </button>
              <button onClick={onOpenBespokeModal} className="inline-flex items-center gap-2 bg-white/70 text-[#233b2d] hover:bg-white px-5 py-3.5 rounded-lg text-sm font-semibold border border-[#d8cdbd] transition-colors">
                Ask about the pilot
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#d6c9b8] max-w-xl">
              <div><div className="font-serif text-2xl md:text-3xl">10</div><p className="text-[11px] md:text-xs text-[#71675b] mt-1">Pilot concepts</p></div>
              <div><div className="font-serif text-2xl md:text-3xl">01</div><p className="text-[11px] md:text-xs text-[#71675b] mt-1">Curated range</p></div>
              <div><div className="font-serif text-base md:text-lg font-semibold mt-2">In progress</div><p className="text-[11px] md:text-xs text-[#71675b] mt-1">Prototype & testing</p></div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] border border-[#cdbda8] rotate-2" />
              <div className="relative overflow-hidden rounded-[1.6rem] bg-[#e5dac9] shadow-xl aspect-[5/4]">
                <img src="products/woodkind-wagon.webp" alt="Natural wooden pull wagon in a calm, light-filled playroom" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-[#1b211b]/75 via-[#1b211b]/25 to-transparent text-white">
                  <div className="flex items-end justify-between gap-4">
                    <div><span className="text-[10px] uppercase tracking-[0.2em] text-white/75">A quieter kind of play</span><p className="font-serif text-xl sm:text-2xl mt-1">Natural forms. Open-ended play.</p></div>
                    <button onClick={() => onNavigate('product-detail', 'the-cart-wagon')} className="shrink-0 rounded-full bg-white/90 text-[#233b2d] w-11 h-11 text-xl hover:bg-white transition-colors" aria-label="View wooden pull wagon">↗</button>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex absolute -left-5 -bottom-5 w-40 rounded-xl bg-white p-2.5 shadow-lg border border-[#e4e2df] rotate-[-4deg]">
                <img src="products/woodkind-ride-on.webp" alt="Wooden ride-on concept" className="w-full aspect-square object-cover rounded-lg" />
              </div>
              <div className="absolute -top-4 right-4 bg-[#233b2d] text-white rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.16em] shadow-md">Pilot range · 2026</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6845]">The first collection</span>
            <h2 className="font-serif text-3xl md:text-4xl">Ten ideas. One considered direction.</h2>
            <p className="text-sm text-[#6c6257] max-w-2xl">Explore the discussed product concepts and the wooden pieces shown in your references.</p>
          </div>
          <button onClick={() => onNavigate('all-collections')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#31543e] hover:text-[#7d562d] transition-colors">
            View all products <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
          {PRODUCTS.map((product, index) => (
            <article key={product.id} className="group rounded-2xl border border-[#e7e0d5] bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
              <button onClick={() => onNavigate('product-detail', product.id)} className="text-left relative aspect-[4/3] overflow-hidden bg-[#eee7dc]">
                <img src={product.image} alt={product.name} loading={index > 4 ? 'lazy' : 'eager'} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#5b513f]">{product.badge || 'Pilot concept'}</span>
                <span className="absolute bottom-3 right-3 flex items-center justify-center rounded-full w-9 h-9 bg-white/90 text-[#233b2d] shadow-sm">↗</span>
              </button>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[9px] uppercase tracking-[0.16em] text-[#8a6a4c] font-bold">{product.categoryLabel}</p>
                <h3 className="font-serif text-lg leading-snug mt-1">{product.name}</h3>
                <p className="text-xs text-[#71675c] leading-relaxed mt-2 flex-1 line-clamp-3">{product.subtitle}</p>
                <div className="border-t border-[#eee8de] mt-4 pt-3">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-[#8a8175]">Indicative target</p>
                  <p className="font-serif text-xl font-semibold mt-0.5">{formatINR(product.price)}</p>
                  <p className="text-[10px] text-[#8a8175] mt-1">Quote & safety review pending</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={() => onQuickView(product)} className="rounded-lg border border-[#dcd2c4] text-[#344839] hover:bg-[#f7f3ed] text-xs font-semibold py-2.5 transition-colors">Quick view</button>
                  <button onClick={() => onAddToCart(product)} className="rounded-lg bg-[#233b2d] hover:bg-[#314d3b] text-white text-xs font-semibold py-2.5 transition-colors">Add to bag</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="text-[11px] leading-relaxed text-[#83786c] mt-5 max-w-4xl">Important: displayed prices are planning targets, not confirmed retail prices. Material specifications, age guidance, stock, lead times and safety validation will be confirmed after prototypes and supplier quotations. No safety certification is claimed for these concepts.</p>
      </section>

      <section className="bg-[#f0ece4] border-y border-[#e3dacc]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-14">
          <div className="mb-7 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6845]">Browse by play style</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">Find your starting point.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <button key={category.title} onClick={() => onNavigate(category.screen)} className="text-left bg-white/80 hover:bg-white border border-[#e0d6c8] rounded-xl p-5 group transition-colors">
                <div className="flex items-start justify-between gap-3"><h3 className="font-serif text-xl">{category.title}</h3><span className="text-[#8b6845] text-lg group-hover:translate-x-1 transition-transform">↗</span></div>
                <p className="text-xs text-[#756b60] mt-2 leading-relaxed">{category.description}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#31543e] mt-5">{category.count} product{category.count === 1 ? '' : 's'}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-[#e7e0d5] p-6"><span className="text-[#8b6845] text-xl">01</span><h3 className="font-serif text-xl mt-3">Prototype before promises</h3><p className="text-sm text-[#70665a] mt-2 leading-relaxed">Dimensions, joinery, finish and fit are being refined before production is opened.</p></div>
          <div className="rounded-2xl bg-white border border-[#e7e0d5] p-6"><span className="text-[#8b6845] text-xl">02</span><h3 className="font-serif text-xl mt-3">Materials with clarity</h3><p className="text-sm text-[#70665a] mt-2 leading-relaxed">Timber species, surface treatments and supplier details will be stated once verified.</p></div>
          <div className="rounded-2xl bg-white border border-[#e7e0d5] p-6"><span className="text-[#8b6845] text-xl">03</span><h3 className="font-serif text-xl mt-3">Safety is a launch gate</h3><p className="text-sm text-[#70665a] mt-2 leading-relaxed">Age guidance, stability and applicable toy-safety testing must be reviewed before a product is offered for sale.</p></div>
        </div>
      </section>

      <section className="bg-[#233b2d] text-white">
        <div className="max-w-[1000px] mx-auto text-center px-4 sm:px-6 py-14 md:py-20 space-y-5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#d8c4a6] font-bold">Made for considered homes</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">Help shape the WOODKIND pilot.</h2>
          <p className="text-sm md:text-base text-white/75 max-w-2xl mx-auto leading-relaxed">Parents, preschool teams and retail partners can share their needs while the first prototypes and supplier plans are being refined.</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button onClick={onOpenBespokeModal} className="rounded-lg bg-[#f5e8d6] text-[#233b2d] hover:bg-white px-6 py-3 font-semibold text-sm transition-colors">Share an enquiry</button>
            <button onClick={() => onNavigate('all-collections')} className="rounded-lg border border-white/35 text-white hover:bg-white/10 px-6 py-3 font-semibold text-sm transition-colors">Explore the products</button>
          </div>
        </div>
      </section>
    </div>
  );
};
