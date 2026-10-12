import React, { useState } from 'react';
import { ScreenType, Product } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

interface GiftRegistryHubProps {
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onNavigate: (screen: ScreenType, productId?: string) => void;
  onShowToast: (title: string, subtitle: string, type?: 'success' | 'info') => void;
}

export const GiftRegistryHubScreen: React.FC<GiftRegistryHubProps> = ({
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onNavigate,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'my-registry' | 'find-registry' | 'bundles'>('my-registry');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Registry Settings
  const [registryTitle, setRegistryTitle] = useState("Baby Leo's Heirloom Nursery Registry");
  const [childName, setChildName] = useState('Leo');
  const [occasion, setOccasion] = useState('1st Birthday Celebration');
  const [eventDate, setEventDate] = useState('2024-11-20');
  const [noteToFamily, setNoteToFamily] = useState(
    "We have chosen timeless, non-toxic Bavarian beechwood toys for Leo's playroom. Each heirloom piece is designed to be passed down through generations. Thank you for celebrating with our family!"
  );

  // Group gifting modal / contribution state
  const [contributeProduct, setContributeProduct] = useState<Product | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(2500);

  // Pre-seeded community registries for "Find a Registry"
  const sampleRegistries = [
    {
      id: 'LMN-REG-8492',
      title: "Baby Leo's Heirloom Nursery Registry",
      parents: 'Ananya & Siddharth Singhania',
      child: 'Leo',
      occasion: '1st Birthday Celebration',
      date: 'Nov 20, 2024',
      itemCount: 4,
      totalValue: 24796,
      fundedPercent: 65,
      items: ['minimal-ride-on', 'nordic-rocking-horse', 'geometric-arch-pikler'],
    },
    {
      id: 'LMN-REG-5120',
      title: "Aria's Montessori Sensory Playroom",
      parents: 'Dr. Meera & Rohan Varma',
      child: 'Aria',
      occasion: 'Luxury Baby Shower',
      date: 'Dec 05, 2024',
      itemCount: 3,
      totalValue: 18297,
      fundedPercent: 40,
      items: ['stacking-stones-sorter', 'sensory-stacking-rings', 'foldable-climber-slide'],
    },
    {
      id: 'LMN-REG-9934',
      title: "Kabir & Tara's Welcome World Registry",
      parents: 'Vikram & Radhika Oberoi',
      child: 'Twins Kabir & Tara',
      occasion: 'Naming Ceremony',
      date: 'Jan 15, 2025',
      itemCount: 5,
      totalValue: 32495,
      fundedPercent: 85,
      items: ['minimal-ride-on', 'handcrafted-play-kitchen', 'nordic-rocking-horse'],
    },
  ];

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const totalRegistryValue = wishlistedProducts.reduce((sum, p) => sum + p.price, 0);

  // Generate encoded URL string of current wishlist items
  const generateEncodedRegistryUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lumen-heirloom.com';
    const encodedItems = encodeURIComponent(wishlistIds.join(','));
    const registryCode = `REG-${Math.abs(
      wishlistIds.join('').split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000)
    )}`;
    const encodedRegistryId = encodeURIComponent(registryCode);
    const encodedTitle = encodeURIComponent(registryTitle.trim() || "Baby Leo's Nursery Registry");
    const encodedChild = encodeURIComponent(childName.trim() || "Leo");
    const encodedOccasion = encodeURIComponent(occasion);

    return `${origin}?registry=${encodedRegistryId}&title=${encodedTitle}&child=${encodedChild}&occasion=${encodedOccasion}&items=${encodedItems}`;
  };

  const shareUrl = generateEncodedRegistryUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    onShowToast(
      'Registry URL Copied',
      'Encoded registry link copied to clipboard. Ready to paste into invitations or messaging apps.'
    );
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! We've created a LUMEN Heirloom Gift Registry for ${childName}'s ${occasion}:\n\n"${registryTitle}"\n\nExplore our curated beechwood nursery wishlist here: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`LUMEN Heirloom Gift Registry for ${childName}`);
    const body = encodeURIComponent(
      `Dear family and friends,\n\nWe have set up an Heirloom Gift Registry for ${childName}'s ${occasion} with LUMEN Nordic Wooden Toys.\n\n${noteToFamily}\n\nYou can browse our saved pieces and gift directly here:\n${shareUrl}\n\nWarmly,\n${registryTitle}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePrintKeepsake = () => {
    window.print();
  };

  // Pre-curated bundles
  const registryBundles = [
    {
      id: 'bundle-infant',
      name: 'The Newborn & Infant Tactile Suite (0–12 Mo)',
      desc: 'Hand-turned sensory grasping rattles, organic stacking rings, and curved cradle rocker.',
      price: 6897,
      originalPrice: 7999,
      itemIds: ['sensory-stacking-rings', 'stacking-stones-sorter', 'balance-curved-board'],
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'bundle-toddler',
      name: 'The Toddler Motor Discovery Suite (1–3 Yrs)',
      desc: 'The Minimal Ride-On, Sculpted Rocking Swan, and balance arch for gross motor development.',
      price: 15897,
      originalPrice: 17999,
      itemIds: ['minimal-ride-on', 'sculpted-rocking-swan', 'geometric-arch-pikler'],
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'bundle-architect',
      name: 'The Master Heirloom Playroom Suite',
      desc: 'The complete architectural nursery centerpiece: Ride-On, Climber & Slide, and Play Kitchen.',
      price: 25497,
      originalPrice: 28999,
      itemIds: ['minimal-ride-on', 'foldable-climber-slide', 'handcrafted-play-kitchen'],
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleAddBundleToRegistry = (bundle: typeof registryBundles[0]) => {
    bundle.itemIds.forEach((id) => {
      if (!wishlistIds.includes(id)) {
        onToggleWishlist(id);
      }
    });
    onShowToast(
      'Bundle Added to Registry',
      `All pieces from "${bundle.name}" have been added to your heirloom registry.`
    );
    setActiveTab('my-registry');
  };

  const filteredRegistries = sampleRegistries.filter(
    (reg) =>
      reg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.parents.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.child.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 bg-[#fbf9f6] text-[#171411] min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#171411] text-[#ffffff] border-b border-[#322f2b] py-12 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-[#c46927] text-white">
                  Gift Hub &amp; Registry
                </span>
                <span className="text-xs font-mono text-[#d0c5b4]">Architectural Nursery Gifting</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#ffffff] leading-tight">
                LUMEN Heirloom Gift Registry Hub
              </h1>
              <p className="text-sm text-[#a0988e] leading-relaxed">
                Curate an intentional, plastic-free nursery for baby showers, first birthdays, and naming celebrations. Share an encoded link or print an archival keepsake card for family and loved ones.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyLink}
                className="px-5 py-3 rounded-xl bg-[#e58a47] hover:bg-[#cc7535] text-white text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedLink ? 'done' : 'link'}
                </span>
                <span>{copiedLink ? '✓ Copied Encoded URL!' : 'Copy Shareable Registry Link'}</span>
              </button>

              <button
                onClick={() => onNavigate('all-collections')}
                className="px-5 py-3 rounded-xl border border-[#4a453e] hover:bg-[#26221d] text-white text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>Browse 50 Archetypes →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Pills */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center gap-3 border-b border-[#e4e2df] pb-3 overflow-x-auto">
          {[
            { id: 'my-registry', label: '1. My Registry & Shareable Link' },
            { id: 'find-registry', label: '2. Find a Friend\'s Registry' },
            { id: 'bundles', label: '3. Pre-Curated Heirloom Bundles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#171411] text-[#ffffff] font-bold shadow-xs'
                  : 'text-[#7a746e] hover:text-[#171411] hover:bg-[#eeeae3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: My Registry & Shareable Link */}
        {activeTab === 'my-registry' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Cols: Selected Registry Items & Customization */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header Box */}
              <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#e4e2df] shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#eeeae3]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#c46927] font-bold">
                      Registry Overview
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#171411] mt-0.5">
                      {registryTitle}
                    </h3>
                    <p className="text-xs text-[#7a746e] mt-0.5">
                      Celebrating {childName} • {occasion} • Event Date: {eventDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#7a746e] block uppercase">Registry Total</span>
                    <span className="font-serif text-xl font-bold text-[#171411]">
                      {formatINR(totalRegistryValue)}
                    </span>
                  </div>
                </div>

                {/* Items in Registry */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono text-[#7a746e]">
                    <span>SELECTED PIECES ({wishlistedProducts.length})</span>
                    <span>ACTION</span>
                  </div>

                  {wishlistedProducts.length === 0 ? (
                    <div className="p-8 text-center bg-[#faf8f4] rounded-xl border border-dashed border-[#d0c5b4] space-y-2">
                      <span className="material-symbols-outlined text-3xl text-[#7a746e]">card_giftcard</span>
                      <p className="text-sm font-serif font-bold text-[#171411]">No items added yet</p>
                      <p className="text-xs text-[#7a746e] max-w-sm mx-auto">
                        Click the heart icon on any toy in the master catalog, or pick from our curated bundles below to add pieces to your registry.
                      </p>
                      <button
                        onClick={() => onNavigate('all-collections')}
                        className="mt-2 px-4 py-2 bg-[#171411] text-white rounded-lg text-xs font-mono"
                      >
                        Explore Collections
                      </button>
                    </div>
                  ) : (
                    wishlistedProducts.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#fbf9f6] rounded-xl border border-[#e4e2df] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg bg-[#efeeeb] cursor-pointer"
                            onClick={() => onNavigate('product-detail', item.id)}
                          />
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#7d562d]">
                              {item.sku} • {item.age}
                            </span>
                            <h4
                              onClick={() => onNavigate('product-detail', item.id)}
                              className="font-serif font-bold text-sm text-[#171411] cursor-pointer hover:text-[#7d562d]"
                            >
                              {item.name}
                            </h4>
                            <span className="text-xs font-semibold text-[#171411]">
                              {formatINR(item.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setContributeProduct(item)}
                            className="px-3 py-1.5 rounded-lg border border-[#cfc4bd] hover:bg-[#ffffff] text-[#171411] text-[11px] font-mono font-medium transition-colors"
                          >
                            Group Gift 🤝
                          </button>
                          <button
                            onClick={() => onAddToCart(item)}
                            className="px-3 py-1.5 rounded-lg bg-[#171411] hover:bg-[#322f2b] text-white text-[11px] font-mono font-medium transition-colors"
                          >
                            Gift Full Piece 🎁
                          </button>
                          <button
                            onClick={() => onToggleWishlist(item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Registry Details Form */}
              <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#e4e2df] shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#171411]">
                  Personalize Registry Dossier
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-[#4a453e] font-medium mb-1">Registry Title</label>
                    <input
                      type="text"
                      value={registryTitle}
                      onChange={(e) => setRegistryTitle(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4a453e] font-medium mb-1">Child / Honoree Name</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4a453e] font-medium mb-1">Occasion</label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411]"
                    >
                      <option value="1st Birthday Celebration">1st Birthday Celebration</option>
                      <option value="Luxury Baby Shower">Luxury Baby Shower</option>
                      <option value="Naming Ceremony">Naming Ceremony / Welcome World</option>
                      <option value="Festive & Milestones">Festive &amp; Milestones</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#4a453e] font-medium mb-1">Event Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#4a453e] font-medium mb-1">
                    Personal Note to Guests &amp; Family
                  </label>
                  <textarea
                    rows={2}
                    value={noteToFamily}
                    onChange={(e) => setNoteToFamily(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Shareable Encoded URL & Keepsake Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Encoded Shareable URL Box */}
              <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#e4e2df] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#c46927] font-semibold">
                    Encoded Shareable URL
                  </span>
                  <span className="text-[10px] bg-[#55866b]/10 text-[#55866b] font-mono px-2 py-0.5 rounded font-semibold">
                    Live
                  </span>
                </div>

                <p className="text-xs text-[#5c554e]">
                  This unique link encodes your entire wishlist so family members can directly view, claim, or gift items without needing an account.
                </p>

                <div className="p-3 bg-[#f5f2ed] rounded-xl border border-[#e4e2df] space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full bg-white p-2 rounded-lg border border-[#cfc4bd] text-xs font-mono text-[#3a352e] truncate"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                        copiedLink ? 'bg-[#55866b] text-white' : 'bg-[#171411] text-white hover:bg-[#322f2b]'
                      }`}
                    >
                      {copiedLink ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#7a746e] font-mono block">
                    Length: {shareUrl.length} chars • Encodes {wishlistIds.length} items
                  </span>
                </div>

                {/* Quick Share Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleShareWhatsApp}
                    className="py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#25D366]/20"
                  >
                    <span>💬 Share WhatsApp</span>
                  </button>
                  <button
                    onClick={handleShareEmail}
                    className="py-2.5 px-3 rounded-xl bg-[#ffffff] hover:bg-[#fbf9f6] text-[#171411] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#cfc4bd]"
                  >
                    <span>✉️ Email Registry</span>
                  </button>
                </div>
              </div>

              {/* Luxury Printable Keepsake Card */}
              <div className="bg-[#171411] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden space-y-4">
                <div className="absolute top-2 right-2 opacity-10 font-serif text-8xl select-none">L</div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#d0c5b4]">
                    Printable Nursery Keepsake Card
                  </span>
                  <h4 className="font-serif text-xl font-bold mt-1 text-[#ffffff]">
                    {registryTitle}
                  </h4>
                  <p className="text-xs text-[#cfc4bd] mt-1">
                    Slip this digital or printed card into formal baby shower envelopes.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs space-y-2">
                  <div className="flex justify-between text-[11px] text-[#d0c5b4] font-mono">
                    <span>HONOREE: {childName.toUpperCase()}</span>
                    <span>OCCASION: {occasion.toUpperCase()}</span>
                  </div>
                  <p className="italic text-[#f4f1ea] text-xs">
                    "{noteToFamily}"
                  </p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#d0c5b4]">
                    <span>REGISTRY: LMN-REG-8492</span>
                    <span>100% EUROPEAN BEECHWOOD</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrintKeepsake}
                    className="flex-1 py-2.5 rounded-lg bg-[#ffffff] hover:bg-[#f5f2ed] text-[#171411] text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print Keepsake Card</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-lg bg-[#e58a47] hover:bg-[#cc7535] text-white text-xs font-mono font-medium transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Find a Friend's Registry */}
        {activeTab === 'find-registry' && (
          <div className="mt-8 space-y-6">
            <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#e4e2df] shadow-xs max-w-2xl mx-auto">
              <h3 className="font-serif text-xl font-bold text-[#171411] text-center">
                Search Heirloom Registries
              </h3>
              <p className="text-xs text-[#7a746e] text-center mt-1">
                Enter registry code (e.g. LMN-REG-8492) or parent name to find and gift an heirloom.
              </p>

              <div className="mt-4 flex items-center gap-2 bg-[#fbf9f6] p-2 rounded-xl border border-[#cfc4bd]">
                <span className="material-symbols-outlined text-[#7d562d] ml-1">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by registry ID or parent name (e.g. Leo, Singhania, Oberoi)..."
                  className="w-full bg-transparent text-xs font-sans text-[#171411] focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-xs text-[#7a746e] mr-1">
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Registries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRegistries.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#c46927] font-bold uppercase">{reg.id}</span>
                      <span className="bg-[#55866b]/10 text-[#55866b] px-2 py-0.5 rounded font-semibold">
                        {reg.fundedPercent}% Pledged
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#171411] mt-2 line-clamp-1">
                      {reg.title}
                    </h4>
                    <p className="text-xs text-[#5c554e] mt-1">
                      Parents: <strong>{reg.parents}</strong>
                    </p>
                    <p className="text-[11px] text-[#7a746e] mt-0.5">
                      {reg.occasion} • {reg.date}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-[#7a746e]">
                        <span>Registry Value</span>
                        <span>{formatINR(reg.totalValue)}</span>
                      </div>
                      <div className="w-full bg-[#eeeae3] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#55866b] h-1.5 rounded-full"
                          style={{ width: `${reg.fundedPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#eeeae3]">
                    <button
                      onClick={() => {
                        reg.items.forEach((id) => {
                          if (!wishlistIds.includes(id)) {
                            onToggleWishlist(id);
                          }
                        });
                        onShowToast(
                          'Registry Loaded',
                          `Viewing ${reg.title}. Saved pieces updated.`
                        );
                        setActiveTab('my-registry');
                      }}
                      className="w-full py-2.5 rounded-lg bg-[#171411] hover:bg-[#322f2b] text-white text-xs font-mono font-medium transition-colors"
                    >
                      Inspect &amp; Gift Pieces →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Pre-Curated Bundles */}
        {activeTab === 'bundles' && (
          <div className="mt-8 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c46927] font-bold">
                Turnkey Nursery Suites
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#171411]">
                Pre-Curated Architectural Bundles
              </h3>
              <p className="text-xs text-[#5c554e]">
                Add harmonious heirloom groupings to your registry with a single click.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {registryBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-[#7d562d] font-bold">
                        Curated Trio
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#171411]">
                        {bundle.name}
                      </h4>
                      <p className="text-xs text-[#5c554e] leading-relaxed">
                        {bundle.desc}
                      </p>
                      <div className="flex items-baseline gap-2 pt-2">
                        <span className="font-serif text-xl font-bold text-[#171411]">
                          {formatINR(bundle.price)}
                        </span>
                        <span className="text-xs text-[#7a746e] line-through">
                          {formatINR(bundle.originalPrice)}
                        </span>
                        <span className="text-[10px] font-mono text-[#55866b] font-semibold bg-[#55866b]/10 px-2 py-0.5 rounded">
                          Save 15%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleAddBundleToRegistry(bundle)}
                      className="w-full py-2.5 rounded-lg bg-[#171411] hover:bg-[#322f2b] text-white text-xs font-mono font-medium transition-colors"
                    >
                      + Add Bundle to My Registry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Group Gift Contribution Modal */}
      {contributeProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 border border-[#e4e2df] shadow-2xl">
            <div className="flex justify-between items-start pb-4 border-b border-[#eeeae3]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#c46927] font-semibold">
                  Group Gifting Pledges
                </span>
                <h3 className="font-serif text-xl font-bold text-[#171411] mt-0.5">
                  Contribute to {contributeProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setContributeProduct(null)}
                className="w-7 h-7 rounded-full bg-[#fbf9f6] text-[#7a746e] flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs font-sans">
              <div className="flex items-center gap-3 p-3 bg-[#faf8f4] rounded-xl border border-[#eeeae3]">
                <img
                  src={contributeProduct.image}
                  alt={contributeProduct.name}
                  className="w-14 h-14 object-cover rounded-lg bg-white"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#171411]">{contributeProduct.name}</h4>
                  <p className="text-[#7a746e]">Full Price: {formatINR(contributeProduct.price)}</p>
                </div>
              </div>

              <div>
                <label className="block text-[#4a453e] font-medium mb-1.5 font-mono uppercase text-[11px]">
                  Choose Contribution Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setContributionAmount(amt)}
                      className={`p-2.5 rounded-xl border font-mono font-medium text-xs transition-colors ${
                        contributionAmount === amt
                          ? 'border-[#171411] bg-[#171411] text-white'
                          : 'border-[#e4e2df] bg-[#faf8f4] text-[#171411] hover:bg-[#eeeae3]'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onShowToast(
                      `Pledged ${formatINR(contributionAmount)}`,
                      `Your gift pledge towards ${contributeProduct.name} has been added to the registry order.`
                    );
                    setContributeProduct(null);
                  }}
                  className="w-full py-3 bg-[#171411] text-white rounded-xl font-mono text-xs font-medium hover:bg-[#322f2b]"
                >
                  Confirm {formatINR(contributionAmount)} Gift Pledge →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
