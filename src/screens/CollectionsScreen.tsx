import React, { useMemo, useState } from 'react';
import { ArrowRight, Heart, Search, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { Product, ScreenType } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

interface CollectionsScreenProps {
  initialCategory?: string;
  onNavigate: (screen: ScreenType, productId?: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

const categoryNames: Record<string, string> = {
  all: 'All products',
  wheels: 'Wheels & motion',
  rocking: 'Balance & movement',
  climbing: 'Climbing & play',
  learning: 'Sorting & discovery',
  pretend: 'Pretend play',
  furniture: 'Play furniture',
};

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  initialCategory = 'all',
  onNavigate,
  onAddToCart,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [search, setSearch] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');

  React.useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
  }, [initialCategory]);

  const categories = useMemo(() => [
    { id: 'all', label: 'All products', count: PRODUCTS.length },
    ...(['wheels', 'rocking', 'climbing', 'learning', 'pretend', 'furniture'] as const)
      .map((id) => ({ id, label: categoryNames[id], count: PRODUCTS.filter((p) => p.category === id).length }))
      .filter((item) => item.count > 0),
  ], []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      const query = search.trim().toLowerCase();
      if (query && ![item.name, item.subtitle, item.categoryLabel, item.sku].join(' ').toLowerCase().includes(query)) return false;
      if (selectedPrice === 'under-2500' && item.price >= 2500) return false;
      if (selectedPrice === '2500-8000' && (item.price < 2500 || item.price > 8000)) return false;
      if (selectedPrice === 'over-8000' && item.price <= 8000) return false;
      if (selectedMaterial !== 'all' && item.timberCode !== selectedMaterial) return false;
      if (selectedAge !== 'all' && item.ageGroup !== selectedAge && item.ageGroup !== 'all') return false;
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'name') return a.name.localeCompare(b.name);
      return PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b);
    });
  }, [selectedCategory, search, selectedPrice, selectedMaterial, selectedAge, selectedSort]);

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#27251f]">
      <section className="border-b border-[#e7dfd3] bg-[#eee6da] px-4 py-11 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#927352]">
            <span className="h-px w-8 bg-[#ad8c67]" /> WOODKIND · The pilot collection
          </div>
          <div className="grid gap-8 md:grid-cols-[1fr_0.6fr] md:items-end">
            <div>
              <h1 className="max-w-[780px] font-serif text-4xl font-normal leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl">Small, considered pieces.<br/><span className="italic text-[#896849]">Big room to play.</span></h1>
              <p className="mt-5 max-w-[650px] text-sm leading-7 text-[#72695c] sm:text-base">Browse the current WOODKIND range of wooden movement, ride-on and discovery concepts. Clear status, indicative prices and thoughtful details—without pretending a concept is a finished product.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-[#d7c8b4] pt-4 md:justify-self-end md:self-end md:border-t-0 md:border-l md:pl-5">
              {[['10', 'Range pieces'], ['04', 'Play themes'], ['01', 'Thoughtful start']].map(([n, label]) => (
                <div key={label} className="pr-1">
                  <div className="font-serif text-2xl text-[#74583c]">{n}</div>
                  <div className="mt-1 text-[8px] font-semibold uppercase leading-4 tracking-[0.13em] text-[#817462] sm:text-[9px]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-4 border-b border-[#e4dbcf] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-2 border px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${selectedCategory === category.id ? 'border-[#2e3d31] bg-[#2e3d31] text-white' : 'border-[#d8cfc2] bg-transparent text-[#62594d] hover:border-[#86917d] hover:bg-[#f3eee6]'}`}
                >
                  {category.label} <span className={`text-[9px] ${selectedCategory === category.id ? 'text-white/65' : 'text-[#9a8c79]'}`}>{category.count}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex min-w-[220px] items-center gap-2 border border-[#d8cfc2] bg-white px-3">
                <Search size={15} className="text-[#998b78]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pieces or SKU" className="w-full border-0 bg-transparent py-2.5 text-xs outline-none placeholder:text-[#a9a091]" />
              </label>
              <label className="flex items-center gap-2 border border-[#d8cfc2] bg-white px-3">
                <SlidersHorizontal size={14} className="text-[#998b78]" />
                <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} className="border-0 bg-transparent py-2.5 text-xs outline-none">
                  <option value="featured">Curated order</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-3 border-b border-[#e4dbcf] py-5 sm:grid-cols-3 lg:grid-cols-4">
            <label className="flex flex-col gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#877762]">Indicative price
              <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} className="border border-[#ded4c5] bg-white px-3 py-2.5 text-xs font-normal normal-case tracking-normal text-[#464136]">
                <option value="all">Any price</option><option value="under-2500">Under ₹2,500</option><option value="2500-8000">₹2,500–₹8,000</option><option value="over-8000">Above ₹8,000</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#877762]">Material direction
              <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} className="border border-[#ded4c5] bg-white px-3 py-2.5 text-xs font-normal normal-case tracking-normal text-[#464136]">
                <option value="all">All materials</option><option value="beech">Beech direction</option><option value="birch">Birch / plywood direction</option><option value="lacquer">Painted / coated direction</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#877762]">Play stage
              <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="border border-[#ded4c5] bg-white px-3 py-2.5 text-xs font-normal normal-case tracking-normal text-[#464136]">
                <option value="all">All stages</option><option value="infant">Infant</option><option value="toddler">Toddler</option><option value="preschool">Preschool</option>
              </select>
            </label>
            <div className="flex items-end justify-between gap-3 text-[10px] text-[#80776a]">
              <span><strong className="text-[#3d3a31]">{filteredProducts.length}</strong> pieces shown</span>
              <button type="button" onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedPrice('all'); setSelectedMaterial('all'); setSelectedAge('all'); setSelectedSort('featured'); }} className="border-b border-[#9b886f] pb-1 font-semibold uppercase tracking-[0.12em] hover:text-[#2e3d31]">Reset filters</button>
            </div>
          </div>

          {filteredProducts.length ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 pt-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const wished = wishlistIds.includes(product.id);
                return (
                  <article key={product.id} className="group min-w-0">
                    <div className="relative">
                      <button type="button" onClick={() => onQuickView(product)} className="block w-full text-left" aria-label={`Quick view ${product.name}`}>
                        <div className="relative aspect-[4/4.3] overflow-hidden bg-[#eee6da]">
                          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                          <div className="absolute inset-0 -z-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#f8f3eb,#e5d4bd)]">
                            <span className="font-serif text-3xl italic text-[#8b7053]">W.</span>
                          </div>
                        </div>
                      </button>
                      <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-[#fbf8f1]/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#62533f]">{product.badge || 'Pilot concept'}</span>
                      <button type="button" onClick={() => onToggleWishlist(product.id)} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wished} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 backdrop-blur transition ${wished ? 'bg-[#2e3d31] text-white' : 'bg-white/85 text-[#5d5548] hover:bg-white'}`}>
                        <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="pt-4">
                      <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#987957]">{product.categoryLabel} <span className="px-1 text-[#cab8a0]">/</span> {product.sku}</div>
                      <h2 className="font-serif text-xl leading-tight text-[#302c25]">{product.name}</h2>
                      <p className="mt-2 min-h-[40px] text-xs leading-5 text-[#81796c]">{product.subtitle}</p>
                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#e6ded2] pt-3">
                        <div><div className="text-sm font-semibold text-[#302c25]">{formatINR(product.price)}</div><div className="mt-1 text-[9px] uppercase tracking-[0.09em] text-[#9a9081]">Indicative pilot price</div></div>
                        <button type="button" onClick={() => onNavigate('product-detail', product.id)} className="inline-flex items-center gap-1.5 border border-[#d9d0c2] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#51473a] transition hover:border-[#2e3d31] hover:bg-[#2e3d31] hover:text-white">Explore <ArrowUpRight size={13} /></button>
                      </div>
                      <p className="mt-3 line-clamp-2 text-[10px] leading-4 text-[#8c8273]">{product.status}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl">No pieces found.</p>
              <p className="mt-2 text-sm text-[#82796d]">Try another search or reset the filters.</p>
            </div>
          )}
          <div className="mt-12 flex items-start gap-3 border-t border-[#e4dbcf] pt-5 text-[10px] leading-5 text-[#83796b]"><span className="font-serif text-lg italic text-[#9a7955]">i</span><p>Prices are planning targets, not final quotations. Visuals may be references or concept illustrations. Final materials, age guidance, dimensions and safety details will be published only after product validation.</p></div>
        </div>
      </section>
    </div>
  );
};
