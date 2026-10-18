import React, { useState, useMemo } from 'react';
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

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  initialCategory = 'all',
  onNavigate,
  onAddToCart,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync state whenever navigation passes a new initialCategory
  React.useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
    setCurrentPage(1);
  }, [initialCategory]);

  const categories = [
    { id: 'all', label: `All Products (${PRODUCTS.length})` },
    { id: 'wheels', label: `Wheels & Motion (${PRODUCTS.filter((p) => p.category === 'wheels').length})` },
    { id: 'rocking', label: `Rocking & Balance (${PRODUCTS.filter((p) => p.category === 'rocking').length})` },
    { id: 'climbing', label: `Climbing & Gyms (${PRODUCTS.filter((p) => p.category === 'climbing').length})` },
    { id: 'learning', label: `Learning & Montessori (${PRODUCTS.filter((p) => p.category === 'learning').length})` },
    { id: 'pretend', label: `Pretend Play (${PRODUCTS.filter((p) => p.category === 'pretend').length})` },
    { id: 'furniture', label: `Kids Furniture (${PRODUCTS.filter((p) => p.category === 'furniture').length})` },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (selectedPrice === 'essentials' && item.price > 1500) return false;
      if (
        selectedPrice === 'active' &&
        (item.price < 2900 || item.price > 6000)
      )
        return false;
      if (selectedPrice === 'heirloom' && item.price < 6500) return false;

      // Material filter
      if (selectedMaterial !== 'all' && item.timberCode !== selectedMaterial) {
        return false;
      }

      // Age filter
      if (selectedAge !== 'all' && item.ageGroup !== selectedAge && item.ageGroup !== 'all') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'low-high') return a.price - b.price;
      if (selectedSort === 'high-low') return b.price - a.price;
      if (selectedSort === 'popular') return (b.reviewCount || 0) - (a.reviewCount || 0);
      return 0; // default curated index
    });
  }, [selectedCategory, selectedPrice, selectedMaterial, selectedAge, selectedSort]);

  // Handle category change and reset page
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  // Products slice based on current view
  const firstBatch = filteredProducts.slice(0, 4);
  const secondBatch = filteredProducts.slice(4);

  return (
    <div className="flex flex-col w-full">
      {/* Archival Hero Intro */}
      <section className="w-full bg-[#f5f3f0] py-12 md:py-16 border-b border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-[#7d562d] text-[11px] font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-[16px]">filter_vintage</span>
                <span>WOODKIND Pilot Catalogue • {PRODUCTS.length} Products</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl text-[#171411] tracking-tight font-bold">
                Sculptural Play, Honed in Beechwood
              </h1>
              <p className="text-sm md:text-base text-[#4d4540] leading-relaxed">
                Explore the current pilot catalogue of wooden ride-ons, balance toys, climbing concepts and Montessori-inspired play pieces. Product specifications, target pricing and launch readiness are confirmed as each prototype is reviewed.
              </p>
            </div>

            {/* Metric highlights */}
            <div className="flex items-center gap-4 sm:gap-6 bg-white p-4 rounded-xl shadow-sm border border-[#e4e2df]">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#7e756f] uppercase block font-semibold">
                  Material Standard
                </span>
                <span className="font-serif font-bold text-sm text-[#171411]">
                  100% FSC® Certified
                </span>
              </div>
              <div className="w-px h-8 bg-[#e4e2df]"></div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#7e756f] uppercase block font-semibold">
                  Craft Origin
                </span>
                <span className="font-serif font-bold text-sm text-[#171411]">
                  Bavarian Beech &amp; Birch
                </span>
              </div>
              <div className="w-px h-8 bg-[#e4e2df]"></div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#7e756f] uppercase block font-semibold">
                  Warranty
                </span>
                <span className="font-serif font-bold text-sm text-[#171411]">
                  10-Year Heirloom
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Filter Console */}
      <section className="w-full bg-[#fbf9f6] border-b border-[#e4e2df] py-4 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-3">
          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#171411] text-white shadow-sm'
                      : 'bg-[#efeeeb] hover:bg-[#eae8e5] text-[#4d4540]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Refinement Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-[#4d4540]">
            <div className="flex flex-wrap items-center gap-3">
              {/* Price Range Selector */}
              <div className="relative inline-block text-left">
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="bg-[#f5f3f0] text-[#171411] text-xs font-semibold rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-[#7d562d] cursor-pointer shadow-sm border border-[#e4e2df]"
                >
                  <option value="all">Price: All Tiers</option>
                  <option value="essentials">Small Essentials (₹699 – ₹1,499)</option>
                  <option value="active">Active &amp; Ride-ons (₹2,999 – ₹5,999)</option>
                  <option value="heirloom">Heirloom Furniture (₹6,999 – ₹14,999)</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-sm text-[#7e756f]">
                  expand_more
                </span>
              </div>

              {/* Timber/Material Selector */}
              <div className="relative inline-block text-left">
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="bg-[#f5f3f0] text-[#171411] text-xs font-semibold rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-[#7d562d] cursor-pointer shadow-sm border border-[#e4e2df]"
                >
                  <option value="all">Material: All Timbers</option>
                  <option value="beech">Natural Beech Wood</option>
                  <option value="birch">Baltic Birch Multi-ply</option>
                  <option value="lacquer">Ivory White Organic Lacquer</option>
                  <option value="ash">Untreated Austrian Ash</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-sm text-[#7e756f]">
                  expand_more
                </span>
              </div>

              {/* Age Span Selector */}
              <div className="relative inline-block text-left">
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="bg-[#f5f3f0] text-[#171411] text-xs font-semibold rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-[#7d562d] cursor-pointer shadow-sm border border-[#e4e2df]"
                >
                  <option value="all">Age: All Stages</option>
                  <option value="infant">6m – 18m (Grasp &amp; Sensory)</option>
                  <option value="toddler">18m – 3y (Balance &amp; Mobility)</option>
                  <option value="preschool">3y – 6y (Creative &amp; Gross Motor)</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-sm text-[#7e756f]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Sort & Count Summary */}
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-xs text-[#7e756f]">
                Showing {filteredProducts.length} of 50 Designs
              </span>
              <div className="relative inline-block text-left">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="bg-white text-[#171411] text-xs font-bold rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none shadow-sm cursor-pointer border border-[#e4e2df]"
                >
                  <option value="featured">Sort: Curated Index</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="popular">Most Coveted</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-sm text-[#171411]">
                  sort
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-12">
          {/* Primary Bento Showcase */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#efeeeb] rounded-2xl p-8 border border-[#cfc4bd] space-y-4">
              <span className="material-symbols-outlined text-4xl text-[#7d562d]">search_off</span>
              <h3 className="font-serif text-2xl font-bold text-[#171411]">No Heirloom Objects Found</h3>
              <p className="text-sm text-[#4d4540] max-w-md mx-auto">
                No items match your active filters in this category. Reset filters to explore our full master archive.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPrice('all');
                  setSelectedMaterial('all');
                  setSelectedAge('all');
                }}
                className="bg-[#171411] text-white hover:bg-[#7d562d] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {firstBatch.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  isWishlisted={wishlistIds.includes(item.id)}
                  onToggleWishlist={() => onToggleWishlist(item.id)}
                  onAddToCart={() => onAddToCart(item)}
                  onQuickView={() => onQuickView(item)}
                  onSelect={() => onNavigate('product-detail', item.id)}
                />
              ))}
            </div>
          )}

          {/* EDITORIAL INTERLUDE: Heirloom Testing Banner */}
          <div className="w-full bg-[#efeeeb] rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-sm border border-[#cfc4bd]">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#7d562d]/5 blur-3xl pointer-events-none"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-[#7d562d] text-xs font-bold border border-[#e4e2df]">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>The WOODKIND Assurance</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#171411]">
                  Heirloom In-Home Trial: 30 Days of Unhurried Wonder
                </h2>
                <p className="text-sm md:text-base text-[#4d4540] max-w-2xl leading-relaxed">
                  Children test toys through their natural pace of discovery. Experience any WOODKIND
                  piece in your home for a full month. If it doesn’t inspire lasting calm, curiosity,
                  and aesthetic harmony, our concierge arranges effortless, complimentary collection.
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-[#171411]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#7d562d] text-sm">cycle</span>
                    <span>Zero Return Fees</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#7d562d] text-sm">security</span>
                    <span>Natural Beeswax Touch-up Kit Included</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#7d562d] text-sm">child_care</span>
                    <span>Tested to EN71 &amp; BIS Norms</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2 justify-center items-start lg:items-end">
                <button
                  onClick={() => onNavigate('brand-philosophy')}
                  className="w-full sm:w-auto text-center bg-[#171411] hover:bg-[#7d562d] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Read Heirloom Charter
                </button>
                <span className="text-[#7e756f] text-[11px]">
                  Available across all major Indian metros
                </span>
              </div>
            </div>
          </div>

          {/* SECOND BATCH: Active Play, Montessori, and Furniture */}
          {secondBatch.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {secondBatch.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  isWishlisted={wishlistIds.includes(item.id)}
                  onToggleWishlist={() => onToggleWishlist(item.id)}
                  onAddToCart={() => onAddToCart(item)}
                  onQuickView={() => onQuickView(item)}
                  onSelect={() => onNavigate('product-detail', item.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination & Archive Navigation */}
          <div className="pt-8 border-t border-[#e4e2df] flex flex-col md:flex-row items-center justify-between gap-6 text-[#7e756f]">
            <div className="text-xs">
              Displaying objects <span className="font-bold text-[#171411]">1 to {filteredProducts.length}</span> of{' '}
              <span className="font-bold text-[#171411]">50</span> cataloged master models
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#171411] text-white shadow-sm'
                      : 'bg-[#f5f3f0] hover:bg-[#efeeeb] text-[#171411]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-1 text-[#7e756f]">…</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(4, p + 1))}
                className="w-9 h-9 rounded-lg bg-[#f5f3f0] hover:bg-[#efeeeb] text-[#171411] flex items-center justify-center transition-colors cursor-pointer"
                title="Next Page"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#7e756f]">
              <span className="material-symbols-outlined text-sm text-[#7d562d]">local_shipping</span>
              <span>Pan-India complimentary delivery via temperature-shielded freight</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke Concierge Callout */}
      <section className="w-full bg-[#eae8e5] py-16 border-t border-[#cfc4bd]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl space-y-2 shadow-sm border border-[#cfc4bd]/60">
              <div className="w-10 h-10 rounded-full bg-[#ffdcbd]/50 text-[#7d562d] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined">palette</span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#171411]">
                Custom Nursery Engraving
              </h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Personalize any heirloom with hand-chiseled child monogramming in classic Roman
                serifs.
              </p>
              <button
                onClick={() => onNavigate('cart')}
                className="text-[#7d562d] text-xs font-bold uppercase tracking-wider pt-2 hover:underline cursor-pointer block text-left"
              >
                Explore Personalization →
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl space-y-2 shadow-sm border border-[#cfc4bd]/60">
              <div className="w-10 h-10 rounded-full bg-[#ffdcbd]/50 text-[#7d562d] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined">nest_eco_leaf</span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#171411]">
                Regenerative Forest Pledge
              </h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                For every WOODKIND toy brought home, two beech saplings are planted in our monitored
                Black Forest acreage.
              </p>
              <button
                onClick={() => onNavigate('brand-philosophy')}
                className="text-[#7d562d] text-xs font-bold uppercase tracking-wider pt-2 hover:underline cursor-pointer block text-left"
              >
                Our Reforestation Audit →
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl space-y-2 shadow-sm border border-[#cfc4bd]/60">
              <div className="w-10 h-10 rounded-full bg-[#ffdcbd]/50 text-[#7d562d] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#171411]">
                Interior Design Advisory
              </h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Book a complimentary 20-minute digital consultation with our nursery ergonomics
                specialists.
              </p>
              <button
                onClick={() => onNavigate('brand-philosophy')}
                className="text-[#7d562d] text-xs font-bold uppercase tracking-wider pt-2 hover:underline cursor-pointer block text-left"
              >
                Schedule Video Session →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sub-component: Product Card in catalog
const ProductCard: React.FC<{
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onQuickView: () => void;
  onSelect: () => void;
}> = ({ product, isWishlisted, onToggleWishlist, onAddToCart, onQuickView, onSelect }) => {
  return (
    <div className="group relative flex flex-col bg-[#f5f3f0] rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-[#e4e2df]">
      <div className="relative w-full aspect-[4/5] bg-[#eae8e5] rounded-lg overflow-hidden mb-3">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
          src={product.image}
          alt={product.name}
          onClick={onSelect}
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="bg-white/90 backdrop-blur-sm text-[#171411] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {product.sku}
          </span>
          <span className="bg-[#fbf9f6]/90 backdrop-blur-sm text-[#7d562d] px-2 py-0.5 rounded text-[10px] font-semibold shadow-sm">
            {product.age}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          aria-label="Add to Wishlist"
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer shadow-sm ${
            isWishlisted ? 'text-red-600' : 'text-[#4d4540] hover:text-red-600'
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {/* Hover Action Bar */}
        <div className="absolute bottom-2.5 inset-x-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="flex-1 bg-[#171411] text-white hover:bg-[#7d562d] py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-colors text-center shadow-md cursor-pointer"
          >
            Add to Bag
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="bg-white text-[#171411] hover:bg-[#eae8e5] p-2 rounded flex items-center justify-center shadow-md cursor-pointer"
            title="Quick View"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] font-semibold text-[#7e756f] uppercase tracking-wider">
          {product.timber}
        </span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#cf9a62] shadow-inner"></span>
        </div>
      </div>

      <h3
        onClick={onSelect}
        className="font-serif text-base font-bold text-[#171411] hover:text-[#7d562d] transition-colors cursor-pointer"
      >
        {product.name}
      </h3>
      <p className="text-[12px] text-[#4d4540] line-clamp-1 mb-2">{product.subtitle}</p>

      <div className="mt-auto flex items-baseline justify-between pt-2 border-t border-[#e4e2df]">
        <span className="font-serif text-base font-bold text-[#171411]">
          {formatINR(product.price)}
        </span>
        <span className="text-[10px] text-[#7d562d] font-bold uppercase tracking-wider">
          {product.badge || 'Free Dispatch'}
        </span>
      </div>
    </div>
  );
};
