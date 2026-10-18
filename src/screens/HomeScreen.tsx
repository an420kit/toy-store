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
  // 5 Debut Core Launch Products
  const debutSkus = [
    'curved-balance-board',
    'forest-steps',
    'climbing-arch',
    'pikler-triangle-ramp',
    'mini-jungle-gym',
  ];
  const debutProducts = debutSkus
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-[#f5f3f0] py-12 md:py-20 lg:py-24 border-b border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#fbf9f6] px-3.5 py-1.5 rounded-full text-[#7d562d] text-[12px] font-semibold tracking-wider uppercase border border-[#e4e2df] shadow-sm">
                <span className="material-symbols-outlined text-[16px]">eco</span>
                <span>WOODKIND • Pilot Collection</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171411] tracking-tight leading-[1.12]">
                Wooden Play, <br className="hidden sm:inline" />
                Made for Everyday Discovery.
              </h1>

              <p className="text-base sm:text-lg text-[#4d4540] max-w-xl leading-relaxed">
                Explore our pilot range—from balance boards and stepping sets to climbing concepts and first rides. Pilot prices and availability remain subject to prototype, supplier and safety validation.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('all-collections')}
                  className="bg-[#171411] text-[#ffffff] hover:bg-[#7d562d] transition-colors px-8 py-3.5 rounded-lg text-[13px] font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Explore The Core Collection</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => onNavigate('gift-registry')}
                  className="bg-[#fbf9f6] text-[#171411] hover:bg-[#efeeeb] transition-colors px-6 py-3.5 rounded-lg text-[13px] font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm border border-[#cfc4bd] cursor-pointer"
                >
                  <span>Heirloom Gift Registry</span>
                  <span className="material-symbols-outlined text-[18px] text-[#7d562d]">featured_seasonal_and_gifts</span>
                </button>
              </div>

              {/* Proof points */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#cfc4bd]/60 text-[#4d4540]">
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold text-[#171411]">100%</span>
                  <p className="text-[12px]">FSC® Certified European Beech</p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold text-[#171411]">320-Grit</span>
                  <p className="text-[12px]">Hand-Sanded Silk Touch</p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold text-[#171411]">0% Plastic</span>
                  <p className="text-[12px]">Pure Plant Oils &amp; Organic Waxes</p>
                </div>
              </div>
            </div>

            {/* Visual Hero Showcase Right */}
            <div className="lg:col-span-5 relative">
              <div
                onClick={() => onNavigate('product-detail', 'minimal-ride-on')}
                className="relative rounded-2xl overflow-hidden bg-[#efeeeb] shadow-xl aspect-[4/5] flex items-center justify-center p-4 cursor-pointer group"
              >
                <img
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                  alt="Editorial warm photograph of an artisanal wooden child ride-on and minimalist rocking horse"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfYXUkIXMWQX4eGpXly31NOPFXaNCXQbun1GuMzpA0mkGHsibdqG2IwizVlU38dxTBoHiKRrrSnn_PCG1ZyU4Z_6pee_s2MX4ifCvEaRcMmbBXa3LBJ7jcO1HRrQTOF3maXvbPQvbY_3iKmEiAqGVEhngQBGM0xbS6i36WOoh6-AD_mhExDq1-_DuULdtjr5NsWX-uScRnxg9G9UCKByVJB05LjrDK_v6JUZimpBpq6OArKrzBurdUuA"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-[#fbf9f6]/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#e4e2df]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d562d]">
                        Flagship Archetype
                      </span>
                      <p className="font-serif text-lg font-bold text-[#171411]">
                        The Minimal Ride-On • No. 01
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xl font-bold text-[#171411]">₹4,499</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative subtle badge */}
              <div className="absolute -top-3 -right-3 bg-white text-[#171411] px-4 py-2 rounded-full shadow-md hidden sm:flex items-center gap-2 border border-[#e4e2df]">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">verified</span>
                <span className="text-[11px] font-semibold">EN71 &amp; BIS Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHIVAL MATRICES SHOWCASE */}
      <section className="w-full py-16 md:py-20 bg-[#fbf9f6]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7d562d]">
              The Master Catalogue
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#171411]">
              Fifty Handcrafted Forms for Childhood
            </h2>
            <p className="text-sm md:text-base text-[#4d4540]">
              From motion-driven wooden engines to sensory Montessori tools and sculptural play
              furniture. Explore the complete design lineage documented in our twin archival suites.
            </p>
          </div>

          {/* Twin Visual Panels of the 50 toys */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              onClick={() => onNavigate('all-collections')}
              className="bg-[#efeeeb] rounded-2xl p-6 shadow-sm space-y-4 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#7d562d] font-bold">
                    Archive Series I
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#171411] group-hover:text-[#7d562d] transition-colors">
                    Motion, Rockers &amp; Pretend Play (01-50)
                  </h3>
                </div>
                <span className="bg-[#fbf9f6] px-3 py-1 rounded text-[#171411] text-[11px] font-bold border border-[#cfc4bd]">
                  50 Archetypes
                </span>
              </div>
              <div className="overflow-hidden rounded-xl bg-[#f5f3f0] shadow-inner border border-[#cfc4bd]">
                <img
                  alt="WOODKIND Master Toy Collection Series 1"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgcE-84tGgayP_rjdBt_MrwPtu6V68VlUzM6S6QTYbubggsMAF7x4abHp7A1S3lrofrDWylJZsfYjTprFbjyAwOkmPHVepMe_s0v5U1VFOOGf3bFSWYQjfw1NMVE-WrqOP_KZ5DAJHDrIRtppteXXQXTsR9fa9awYV_Fzgqi3Fb32Tq8HOb6yZ1s3I6Mhpcbtb8Ymqn2tQuU75Xp8yZA3FUWsOBIQnTUZoYtVi-k8DUGEst1Qz0yHqmEDle8yK9hs-Uts"
                />
              </div>
              <p className="text-[13px] text-[#4d4540]">
                Featuring the Wave Ride-on, Vintage Tractor, Rocking Llama, Foldable Climbing Triangle,
                Sensory Gear Wall, and Miniature Architectural Playhouses.
              </p>
            </div>

            <div
              onClick={() => onNavigate('all-collections')}
              className="bg-[#efeeeb] rounded-2xl p-6 shadow-sm space-y-4 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#7d562d] font-bold">
                    Archive Series II
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#171411] group-hover:text-[#7d562d] transition-colors">
                    Animal Silhouettes &amp; Sensory Explorations
                  </h3>
                </div>
                <span className="bg-[#fbf9f6] px-3 py-1 rounded text-[#171411] text-[11px] font-bold border border-[#cfc4bd]">
                  50 Archetypes
                </span>
              </div>
              <div className="overflow-hidden rounded-xl bg-[#f5f3f0] shadow-inner border border-[#cfc4bd]">
                <img
                  alt="WOODKIND Master Toy Collection Series 2"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcbiQ4bxllqAGBWmkkdRjGJcZ6nP0bPhveRnNzZ_SIkNGKPmRL5Wx0NhpKFkF762l_wd37Qg_dxqeSq9Res3A7ecIBQGX9aVuqxn7resv3gBrDwE4dQwoFSA9VHPAHrqCDahfsb4zeHdJ7SkS6M_q-cfotE0hCXfDlqAnAjZCOFzK5DtqaEwjf7_kkoV43I6YYFAroRW-9JDBnNXbWhXifXD4vpAA81jUu1yi7GbOJb-gWst-JgDF5kibuuOrKUXmHwhY"
                />
              </div>
              <p className="text-[13px] text-[#4d4540]">
                Featuring the Orbit Scooter, Steerable Safari Giraffe, Moon Rocker, Rainbow Arch
                Bridge, 320-grit Stacking Stones, and the Montessori Chef Kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEBUT LAUNCH HERO TEST PRODUCTS */}
      <section className="w-full py-16 md:py-20 bg-[#f5f3f0] border-y border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#7d562d]">
                The Debut Tier
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#171411]">
                Core Debut Launch Collection
              </h2>
              <p className="text-sm md:text-base text-[#4d4540] max-w-xl">
                Initial workshop release of five highly requested archetypes, ready for direct
                dispatch across India with complimentary insured delivery.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#7d562d] bg-white px-3 py-2 rounded-lg border border-[#e4e2df]">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>Complimentary Heirloom Freight Included</span>
            </div>
          </div>

          {/* WOODKIND Pilot Collection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {debutProducts.map((prod, idx) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group border border-[#e4e2df]"
              >
                <div className="space-y-3">
                  <div
                    onClick={() => onNavigate('product-detail', prod.id)}
                    className="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#efeeeb] cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={prod.image}
                      alt={prod.name}
                    />
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-[#171411]">
                      No. 0{idx + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(prod);
                      }}
                      className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full text-[#171411] hover:text-[#7d562d] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Quick View"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7d562d]">
                      {prod.categoryLabel}
                    </span>
                    <h3
                      onClick={() => onNavigate('product-detail', prod.id)}
                      className="font-serif text-base font-bold text-[#171411] group-hover:text-[#7d562d] transition-colors cursor-pointer mt-0.5 line-clamp-1"
                    >
                      {prod.name}
                    </h3>
                    <p className="text-[12px] text-[#4d4540] mt-1 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#f5f3f0] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-lg font-bold text-[#171411]">
                      {formatINR(prod.price)}
                    </span>
                    <span className="text-[11px] text-[#7e756f]">{prod.age}</span>
                  </div>

                  <button
                    onClick={() => onAddToCart(prod)}
                    className="w-full bg-[#171411] text-white hover:bg-[#7d562d] py-2 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
                    <span>Reserve Piece</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES MATRIX */}
      <section className="w-full py-16 md:py-20 bg-[#fbf9f6]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#7d562d]">
                Artisanal Taxonomies
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#171411]">
                Explore by Play Dimension
              </h2>
              <p className="text-sm md:text-base text-[#4d4540] max-w-xl">
                Each category corresponds to pivotal developmental thresholds identified in Pikler
                and Montessori observation pedagogy.
              </p>
            </div>
            <div className="text-[12px] font-semibold text-[#7e756f]">
              8 Curated Collections • 50 Distinct Sculptures
            </div>
          </div>

          {/* 8 Matrix Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Wheels & Motion',
                screen: 'wheels-and-motion' as ScreenType,
                count: '10 Designs',
                icon: 'directions_car',
                desc: 'Ride-ons, Minimal Scooters, Cargo Trucks, and Push Wagons.',
              },
              {
                title: 'Rocking & Balance',
                screen: 'rocking-and-balance' as ScreenType,
                count: '8 Designs',
                icon: 'toys',
                desc: 'Rocking Horses, Gentle Deers, Playful Dinosaurs & Rocking Ships.',
              },
              {
                title: 'Sliding & Ramps',
                screen: 'climbing-and-play-gyms' as ScreenType,
                count: '4 Designs',
                icon: 'downhill_skiing',
                desc: 'Indoor Beechwood Slides, Incline Ramps, and 2-in-1 Dual Fun Glides.',
              },
              {
                title: 'Climbing Gyms',
                screen: 'climbing-and-play-gyms' as ScreenType,
                count: '6 Designs',
                icon: 'stairs',
                desc: 'Pikler Triangles, Arch Rockers, Rope Climbers & Arch Tunnels.',
              },
              {
                title: 'Balance & Vestibular',
                screen: 'rocking-and-balance' as ScreenType,
                count: '6 Designs',
                icon: 'balance',
                desc: 'Curved Balance Boards, Minimalist Seesaws & Wobble Disks.',
              },
              {
                title: 'Sensory & Montessori',
                screen: 'learning-and-montessori' as ScreenType,
                count: '8 Designs',
                icon: 'extension',
                desc: 'Shape Sorters, Sensory Tactile Walls, Bead Mazes & Marble Runs.',
              },
              {
                title: 'Pretend Play',
                screen: 'play-furniture' as ScreenType,
                count: '4 Designs',
                icon: 'cottage',
                desc: 'Open Dollhouses, Market Stalls, Puppet Theatres & Play Kitchens.',
              },
              {
                title: 'Kids Furniture',
                screen: 'play-furniture' as ScreenType,
                count: '4 Designs',
                icon: 'chair',
                desc: 'Kid Table Sets, Step Stools, Reading Nooks & Toy Storage Benches.',
              },
            ].map((cat, i) => (
              <div
                key={i}
                onClick={() => onNavigate(cat.screen)}
                className="bg-[#efeeeb] hover:bg-[#eae8e5] rounded-xl p-5 transition-all duration-200 cursor-pointer group border border-[#cfc4bd]/60 shadow-sm hover:shadow"
              >
                <div className="flex items-center justify-between pb-4">
                  <span className="material-symbols-outlined text-[#7d562d] text-[28px]">
                    {cat.icon}
                  </span>
                  <span className="text-[11px] font-bold bg-[#fbf9f6] px-2.5 py-0.5 rounded text-[#4d4540]">
                    {cat.count}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#171411] group-hover:text-[#7d562d] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[12px] text-[#4d4540] mt-1 leading-relaxed">{cat.desc}</p>
                <div className="mt-4 pt-3 flex items-center gap-1 text-[11px] font-bold text-[#171411] uppercase tracking-wider">
                  <span>Explore series</span>
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENT QUALITY & PRICING PHILOSOPHY */}
      <section className="w-full py-16 md:py-20 bg-[#efeeeb] border-y border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#7d562d]">
                The WOODKIND Standard
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#171411]">
                Why European Craftsmanship Matters
              </h2>
              <p className="text-base text-[#4d4540] leading-relaxed">
                Mass-market play has normalized hollow plastics with built-in obsolescence. We
                engineer toys intended to be passed to younger siblings, cousins, and future
                generations.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-[#e4e2df] shadow-sm">
                  <span className="material-symbols-outlined text-[#7d562d] text-2xl mt-0.5">
                    forest
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-[#171411]">
                      Single-Estate European Beech
                    </h4>
                    <p className="text-[13px] text-[#4d4540] mt-0.5">
                      Dense, closed-grain timber harvested sustainably in certified forestry zones.
                      Unlikely to splinter even under decades of heavy active use.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-[#e4e2df] shadow-sm">
                  <span className="material-symbols-outlined text-[#7d562d] text-2xl mt-0.5">
                    spa
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-[#171411]">Botanical Wax &amp; Nut Oils</h4>
                    <p className="text-[13px] text-[#4d4540] mt-0.5">
                      Zero volatile organic compounds (VOCs). Micro-polished with cold-pressed linseed
                      oils and organic beeswax harmless to teething toddlers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-[#e4e2df] shadow-sm">
                  <span className="material-symbols-outlined text-[#7d562d] text-2xl mt-0.5">
                    architecture
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-[#171411]">Concealed Blind Joinery</h4>
                    <p className="text-[13px] text-[#4d4540] mt-0.5">
                      Interlocking mortise-and-tenon joints engineered without exposed sharp screws or
                      dangerous small mechanical detachments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparent Price Tiers Breakdown */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between border border-[#e4e2df]">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#7d562d]">
                  Radical Honesty
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#171411]">
                  Structured Price Architecture
                </h3>
                <p className="text-sm text-[#4d4540]">
                  Every rupee reflects honest living wages for master joiners, certified timber
                  reserves, and stringent laboratory toxicology tests.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Tier 1 */}
                <div className="bg-[#f5f3f0] p-4 rounded-xl space-y-2 border border-[#e4e2df]">
                  <span className="text-[10px] uppercase font-bold text-[#7d562d]">
                    Grasp &amp; Sensory
                  </span>
                  <div className="font-serif text-xl font-bold text-[#171411]">
                    ₹699 – ₹1,499
                  </div>
                  <p className="text-[12px] text-[#4d4540]">
                    Tactile stacking stones, bead mazes, pull-along turtles, and geometric shape
                    sorters.
                  </p>
                  <ul className="text-[11px] text-[#7e756f] space-y-1 pt-2">
                    <li>• Hand-turned beech balls</li>
                    <li>• Beeswax finish</li>
                    <li>• Perfect first gifts</li>
                  </ul>
                </div>

                {/* Tier 2 */}
                <div className="bg-[#f5f3f0] p-4 rounded-xl space-y-2 border border-[#e4e2df]">
                  <span className="text-[10px] uppercase font-bold text-[#7d562d]">
                    Wheels &amp; Rockers
                  </span>
                  <div className="font-serif text-xl font-bold text-[#171411]">
                    ₹2,999 – ₹5,999
                  </div>
                  <p className="text-[12px] text-[#4d4540]">
                    Ride-on automobiles, animal rocking sculptures, scooters, and balancing disks.
                  </p>
                  <ul className="text-[11px] text-[#7e756f] space-y-1 pt-2">
                    <li>• Bentwood curved chassis</li>
                    <li>• Whisper-soft rubber rings</li>
                    <li>• 50 kg load tested</li>
                  </ul>
                </div>

                {/* Tier 3 */}
                <div className="bg-[#f5f3f0] p-4 rounded-xl space-y-2 border border-[#e4e2df]">
                  <span className="text-[10px] uppercase font-bold text-[#7d562d]">
                    Gyms &amp; Furniture
                  </span>
                  <div className="font-serif text-xl font-bold text-[#171411]">
                    ₹6,999 – ₹14,999
                  </div>
                  <p className="text-[12px] text-[#4d4540]">
                    Pikler climbing triangles, play kitchens, reading nooks, and architectural
                    dollhouses.
                  </p>
                  <ul className="text-[11px] text-[#7e756f] space-y-1 pt-2">
                    <li>• Multi-generational timber</li>
                    <li>• German safety hinges</li>
                    <li>• Tool-free folding locks</li>
                  </ul>
                </div>
              </div>

              {/* Wood restoration badge */}
              <div className="flex items-center justify-between p-4 bg-[#f5f3f0] rounded-xl text-[#4d4540] text-[13px] border border-[#e4e2df]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7d562d]">autorenew</span>
                  <span>
                    Included Heirloom Care Kit: Natural beeswax balm &amp; sanding pad with every
                    order above ₹4,000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS & CERTIFICATION PLEDGE */}
      <section className="w-full py-16 md:py-20 bg-[#fbf9f6]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7d562d]">
              Discerning Homes
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#171411]">
              Voices from Intentional Nurseries
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f5f3f0] p-6 rounded-2xl space-y-4 flex flex-col justify-between border border-[#e4e2df]">
              <div className="space-y-3">
                <div className="flex text-[#7d562d] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-serif italic text-[14px] text-[#171411] leading-relaxed">
                  “The Minimal Ride-On is more like an architectural sculpture than a toy. It rests in
                  our living room without visual clutter, and our 18-month-old spends hours
                  effortlessly gliding.”
                </p>
              </div>
              <div className="pt-2 border-t border-[#e4e2df]">
                <p className="font-bold text-sm text-[#171411]">Ananya Singhania</p>
                <p className="text-[11px] text-[#7e756f]">Architect &amp; Mother, New Delhi</p>
              </div>
            </div>

            <div className="bg-[#f5f3f0] p-6 rounded-2xl space-y-4 flex flex-col justify-between border border-[#e4e2df]">
              <div className="space-y-3">
                <div className="flex text-[#7d562d] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-serif italic text-[14px] text-[#171411] leading-relaxed">
                  “The Foldable Climbing Triangle survived monsoon humidity without warping a
                  millimeter. The silk-smooth rungs gave our daughter confidence to climb on her own
                  schedule.”
                </p>
              </div>
              <div className="pt-2 border-t border-[#e4e2df]">
                <p className="font-bold text-sm text-[#171411]">Vikramaditya Iyer</p>
                <p className="text-[11px] text-[#7e756f]">Industrial Designer, Bengaluru</p>
              </div>
            </div>

            <div className="bg-[#f5f3f0] p-6 rounded-2xl space-y-4 flex flex-col justify-between border border-[#e4e2df]">
              <div className="space-y-3">
                <div className="flex text-[#7d562d] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-serif italic text-[14px] text-[#171411] leading-relaxed">
                  “Finding toys that aren't garish plastic is nearly impossible in Mumbai. WOODKIND's
                  shape sorters and stacking stones are absolute works of quiet art. Exceptional wood
                  finish.”
                </p>
              </div>
              <div className="pt-2 border-t border-[#e4e2df]">
                <p className="font-bold text-sm text-[#171411]">Meera &amp; Dev Vora</p>
                <p className="text-[11px] text-[#7e756f]">Montessori Educators, Mumbai</p>
              </div>
            </div>
          </div>

          {/* Compliance & Certification Row */}
          <div className="bg-[#efeeeb] rounded-2xl p-6 md:p-8 flex flex-wrap items-center justify-around gap-6 border border-[#cfc4bd]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7d562d] text-[32px]">verified</span>
              <div>
                <div className="text-[13px] font-bold text-[#171411]">BIS IS 9873 Certified</div>
                <div className="text-[12px] text-[#4d4540]">
                  Indian Toy Safety Standard Compliant
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7d562d] text-[32px]">
                shield_with_heart
              </span>
              <div>
                <div className="text-[13px] font-bold text-[#171411]">EN71-1, 2 &amp; 3 Certified</div>
                <div className="text-[12px] text-[#4d4540]">
                  European Union Toy Safety Directive
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7d562d] text-[32px]">park</span>
              <div>
                <div className="text-[13px] font-bold text-[#171411]">FSC® C140228 Sourced</div>
                <div className="text-[12px] text-[#4d4540]">
                  100% Responsibly Managed Woodlands
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL EDITORIAL CALLOUT */}
      <section className="w-full py-16 md:py-24 bg-[#171411] text-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 text-center space-y-6">
          <span className="text-[11px] uppercase tracking-widest text-[#ffdcbd] font-bold">
            Private Atelier Consultations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl max-w-2xl mx-auto leading-tight">
            Curate a Childhood Sanctuary
          </h2>
          <p className="text-base text-[#cfc5c0] max-w-xl mx-auto leading-relaxed">
            Need bespoke sizing or personalized heirloom engraving? Our private concierge works
            directly with parents and interior architects.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenBespokeModal}
              className="bg-[#fbf9f6] text-[#171411] hover:bg-[#ffdcbd] transition-colors px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Request Bespoke Gifting Kit
            </button>
            <button
              onClick={() => onNavigate('all-collections')}
              className="bg-transparent text-white border border-[#cfc5c0] hover:bg-white/10 transition-colors px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Explore Full 50 Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
