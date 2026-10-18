import React from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Heart, Leaf, MoveUpRight, Sparkles, Sprout, TreePine } from 'lucide-react';
import { Product, ScreenType } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType, productId?: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenBespokeModal: () => void;
}

const featuredIds = [
  'the-cart-wagon',
  'curved-balance-board',
  'nordic-rocking-horse',
  'minimal-ride-on',
  'stacking-stones-sorter',
  'forest-steps',
];

const collections = [
  { label: 'Balance & movement', note: 'Find a little rhythm', screen: 'rocking-and-balance' as ScreenType, number: '01' },
  { label: 'Climbing & discovery', note: 'Room to try again', screen: 'climbing-and-play-gyms' as ScreenType, number: '02' },
  { label: 'Wheels & motion', note: 'Made for little journeys', screen: 'wheels-and-motion' as ScreenType, number: '03' },
  { label: 'Sorting & stacking', note: 'Small pieces, big ideas', screen: 'learning-and-montessori' as ScreenType, number: '04' },
];

function ProductImage({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <div className="relative aspect-[4/4.4] overflow-hidden rounded-[5px] bg-[#eee6da]">
      <img
        src={product.image}
        alt={product.name}
        loading={priority ? 'eager' : 'lazy'}
        className="relative z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#f8f3eb,#e5d4bd)]">
        <div className="flex flex-col items-center gap-2 text-center text-[#766149]">
          <span className="font-serif text-3xl italic">W.</span>
          <span className="text-[9px] uppercase tracking-[0.24em]">Product concept</span>
        </div>
      </div>
      <div className="absolute left-3 top-3">
        <span className="inline-flex rounded-full border border-white/70 bg-[#fbf8f1]/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#62533f] backdrop-blur">
          {product.badge || 'Pilot collection'}
        </span>
      </div>
      <button
        type="button"
        onClick={() => {/* parent card controls the quick view */}}
        aria-label={product.name}
        className="pointer-events-none absolute inset-0"
      />
    </div>
  );
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onAddToCart,
  onQuickView,
  onOpenBespokeModal,
}) => {
  const featuredProducts = featuredIds
    .map((id) => PRODUCTS.find((product) => product.id === id))
    .filter(Boolean) as Product[];
  const wagon = PRODUCTS.find((product) => product.id === 'the-cart-wagon') || PRODUCTS[0];

  return (
    <div className="bg-[#fbf8f2] text-[#27251f]">
      {/* HERO */}
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-10 lg:pb-14 lg:pt-8">
        <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[8px] bg-[#e9e0d2] lg:min-h-[610px] lg:grid-cols-[0.87fr_1.13fr]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#806044]">
              <span className="h-px w-8 bg-[#a67e56]" />
              WOODKIND · A slower kind of play
            </div>
            <h1 className="max-w-[620px] font-serif text-4xl font-normal leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-[68px]">
              Childhood, made of <span className="italic text-[#8b6645]">little things.</span>
            </h1>
            <p className="mt-6 max-w-[440px] text-sm leading-7 text-[#655c50] sm:text-base">
              Thoughtful wooden play pieces for everyday discovery. Quiet forms, warm textures and room for children to make the story their own.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('all-collections')}
                className="group inline-flex items-center gap-4 rounded-[3px] bg-[#2e3d31] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#435644]"
              >
                Explore the collection <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('brand-philosophy')}
                className="inline-flex items-center gap-2 border border-[#b9a891] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4d463c] transition hover:bg-white/40"
              >
                Our point of view <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="mt-12 flex items-center gap-5 border-t border-[#d2c3ae] pt-5 text-[10px] uppercase tracking-[0.15em] text-[#766a5a]">
              <span className="flex items-center gap-2"><Sprout size={15} /> Open-ended play</span>
              <span className="h-4 w-px bg-[#cbbbA4]" />
              <span className="flex items-center gap-2"><Leaf size={15} /> Natural textures</span>
            </div>
          </div>
          <div className="group relative min-h-[320px] overflow-hidden sm:min-h-[440px] lg:min-h-[610px]">
            <img src={wagon.image} alt="WOODKIND wooden pull wagon in a calm nursery" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#251f18]/35 via-transparent to-white/5" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-5 text-white sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/80">A WOODKIND favourite-in-the-making</p>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl">The little pull wagon</h2>
              </div>
              <button type="button" onClick={() => onNavigate('product-detail', wagon.id)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/65 bg-white/10 backdrop-blur transition hover:bg-white hover:text-[#2e3d31]" aria-label="View wooden pull wagon">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STRIP */}
      <section className="border-y border-[#e7dfd3] bg-[#f5f0e7] px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
          {[
            ['01', 'Designed for real homes'],
            ['02', 'Made for open-ended play'],
            ['03', 'Simple, considered forms'],
            ['04', 'Honest about what’s ready'],
          ].map(([number, label]) => (
            <div key={number} className="flex items-center gap-3">
              <span className="font-serif text-xl italic text-[#a58a6d]">{number}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5f594f] sm:text-[11px]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-11 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#927352]">The pilot collection</p>
              <h2 className="font-serif text-3xl font-normal leading-tight tracking-[-0.025em] sm:text-4xl">Pieces to grow into.</h2>
              <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#777064]">A focused first range of ride-ons, balance pieces and tactile play. Prices shown are planning targets while the final specifications and supplier quotes are confirmed.</p>
            </div>
            <button type="button" onClick={() => onNavigate('all-collections')} className="inline-flex items-center gap-3 self-start border-b border-[#827157] pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4d4a40] transition hover:text-[#876445] sm:self-auto">
              View all 10 products <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {featuredProducts.map((product, index) => (
              <article key={product.id} className="group min-w-0">
                <button type="button" onClick={() => onQuickView(product)} className="block w-full text-left" aria-label={`Quick view ${product.name}`}>
                  <ProductImage product={product} priority={index < 2} />
                </button>
                <div className="pt-4">
                  <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#9a7955]">{product.categoryLabel}</div>
                  <h3 className="font-serif text-lg leading-tight text-[#302c25]">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-5 text-[#81796c]">{product.subtitle}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e6ded2] pt-3">
                    <div>
                      <div className="text-sm font-semibold text-[#302c25]">{formatINR(product.price)}</div>
                      <div className="mt-0.5 text-[9px] uppercase tracking-wide text-[#9a9081]">Indicative price</div>
                    </div>
                    <button type="button" onClick={() => onNavigate('product-detail', product.id)} className="flex h-9 w-9 items-center justify-center border border-[#d9d0c2] text-[#51473a] transition hover:border-[#2e3d31] hover:bg-[#2e3d31] hover:text-white" aria-label={`View ${product.name}`}>
                      <MoveUpRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 border-t border-[#e5dccf] pt-5 text-[10px] leading-5 text-[#81786b]">
            Product images include supplied visual references and concept illustrations. Final construction, age guidance and safety information will be updated after prototype and supplier validation.
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="bg-[#eee6da] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-9 grid gap-5 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#927352]">Find their kind of play</p>
              <h2 className="max-w-[630px] font-serif text-3xl font-normal leading-tight tracking-[-0.025em] sm:text-4xl">A little movement. A lot of imagination.</h2>
            </div>
            <p className="max-w-[440px] text-sm leading-6 text-[#746858] md:justify-self-end">Choose by the moments you want to make room for—climbing, carrying, balancing or sorting.</p>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#d7c8b4] sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((item) => (
              <button key={item.number} type="button" onClick={() => onNavigate(item.screen)} className="group flex min-h-[185px] flex-col justify-between bg-[#f6f1e8] p-6 text-left transition hover:bg-[#e4d6c3] sm:min-h-[220px] sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="font-serif text-xl italic text-[#ad9475]">{item.number}</span>
                  <ArrowUpRight size={17} className="text-[#8f7d67] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#302c25]">{item.label}</h3>
                  <p className="mt-2 text-xs text-[#827767]">{item.note}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STUDIO NOTE */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1350px] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div className="order-2 flex min-h-[330px] items-center justify-center overflow-hidden bg-[#f0e5d6] p-8 sm:min-h-[430px] lg:order-1">
            <div className="max-w-[340px] text-center">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#c7b49b] text-[#7a6044]"><TreePine size={28} strokeWidth={1.2} /></div>
              <p className="font-serif text-3xl leading-tight text-[#504334]">Less noise.<br/><span className="italic">More room to imagine.</span></p>
              <div className="mx-auto mt-8 h-px w-16 bg-[#ba9b76]" />
              <p className="mt-5 text-[9px] uppercase tracking-[0.22em] text-[#88745b]">The WOODKIND point of view</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#927352]">A thoughtful start</p>
            <h2 className="max-w-[620px] font-serif text-3xl font-normal leading-tight tracking-[-0.025em] sm:text-4xl">Good design starts with being honest.</h2>
            <p className="mt-5 max-w-[570px] text-sm leading-7 text-[#746d60]">WOODKIND is being built around a small, considered range of wooden play pieces. We share clear product concepts and indicative pricing while designs move through prototyping, supplier discussions and review.</p>
            <p className="mt-4 max-w-[570px] text-sm leading-7 text-[#746d60]">We will only publish final dimensions, age guidance and safety information once they are established for the actual product—not inferred from a reference photo.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate('brand-philosophy')} className="inline-flex items-center gap-3 bg-[#2e3d31] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#435644]">
                Get to know WOODKIND <ArrowRight size={14} />
              </button>
              <button type="button" onClick={onOpenBespokeModal} className="inline-flex items-center gap-3 border border-[#cfc2b1] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4e483e] transition hover:bg-[#f3ede3]">
                Talk to our team <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-6 bg-[#2e3d31] px-6 py-10 text-white sm:px-10 md:flex-row md:items-center lg:px-14 lg:py-12">
          <div>
            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.23em] text-[#c8b393]">The WOODKIND pilot range</p>
            <h2 className="max-w-[650px] font-serif text-3xl font-normal leading-tight sm:text-4xl">Make space for play that feels like home.</h2>
          </div>
          <button type="button" onClick={() => onNavigate('all-collections')} className="inline-flex shrink-0 items-center justify-center gap-3 self-start border border-white/40 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:bg-white hover:text-[#2e3d31] md:self-auto">
            Shop the pilot collection <ArrowDownRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
};
