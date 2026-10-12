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

  // Customer Reviews State
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'Ananya Singhania',
      role: 'Principal Architect, Studio Vayu',
      location: 'Worli, Mumbai',
      rating: 5,
      date: 'September 18, 2024',
      title: 'A sculptural masterwork for our living room',
      comment:
        'As an architect who spent years eliminating plastic chaos from our Mumbai home, this heirloom piece is pure craftsmanship. It sits gracefully beside our mid-century chairs and looks like a contemporary wooden sculpture. The hand-sanded finish is silky smooth, and the internal rubber dampening makes rolling completely silent.',
      verified: true,
      helpfulCount: 24,
      finishPurchased: 'Ivory White & Natural Beech',
    },
    {
      id: 'rev-2',
      author: 'Lukas & Freja Lindström',
      role: 'Parents of 18mo toddler',
      location: 'Copenhagen & Bengaluru',
      rating: 5,
      date: 'August 29, 2024',
      title: 'Remarkably quiet rubber wheels on hardwood floors',
      comment:
        'The silence of the wheels was the biggest revelation. Our daughter glides across hardwood without waking her sleeping newborn brother. The tactile silkiness of the turned beech handle is unmatched, and knowing it uses cold-pressed Swedish linseed oil gives complete peace of mind.',
      verified: true,
      helpfulCount: 18,
      finishPurchased: 'Pure Raw Birch',
    },
    {
      id: 'rev-3',
      author: 'Dr. Meera Nambiar',
      role: 'Early Childhood Pedagogue & AMI Educator',
      location: 'Koramangala, Bengaluru',
      rating: 5,
      date: 'July 14, 2024',
      title: 'Authentic Montessori open-ended motor development',
      comment:
        'In our Montessori nursery space, children gravitate toward it immediately. The deliberate weight teaches natural physical cause and consequence without posing tipping hazards. An extraordinary investment for conscious families looking for 50-year longevity.',
      verified: true,
      helpfulCount: 15,
      finishPurchased: 'Warm Oat Lacquer',
    },
  ]);

  // Review Form & Filter State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newFinish, setNewFinish] = useState(selectedFinish);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [helpfulGiven, setHelpfulGiven] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Dynamic review computations
  const avgRatingNum = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 5.0;
  const avgRating = avgRatingNum.toFixed(1);

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const handleHelpful = (reviewId: string) => {
    if (helpfulGiven[reviewId]) {
      onShowToast?.('Feedback Recorded', 'You have already marked this review as helpful.', 'info');
      return;
    }
    setHelpfulGiven((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    onShowToast?.('Helpful Vote Added', 'Thank you for rating this review.', 'success');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('Please enter your name or family moniker.');
      return;
    }
    if (!newTitle.trim()) {
      setFormError('Please provide a short headline for your review.');
      return;
    }
    if (!newComment.trim() || newComment.trim().length < 10) {
      setFormError('Please share at least a sentence (minimum 10 characters) about your experience.');
      return;
    }

    setIsSubmittingReview(true);
    setFormError(null);

    const createdReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: newName.trim(),
      role: 'Verified Heirloom Collector',
      location: newCity.trim() || 'India',
      rating: newRating,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      title: newTitle.trim(),
      comment: newComment.trim(),
      verified: true,
      helpfulCount: 0,
      finishPurchased: newFinish || selectedFinish,
    };

    setTimeout(() => {
      setReviews((prev) => [createdReview, ...prev]);
      setIsSubmittingReview(false);
      setShowReviewForm(false);
      setNewName('');
      setNewTitle('');
      setNewComment('');
      setNewCity('');
      setNewRating(5);
      setHoverRating(0);
      onShowToast?.(
        'Review Submitted',
        `Thank you, ${createdReview.author}! Your heirloom review is now live.`,
        'success'
      );
    }, 300);
  };

  const filteredReviews = reviews
    .filter((r) => (filterRating === 'all' ? true : r.rating === filterRating))
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const galleryImages = [
    product.image,
    ...(product.additionalImages || [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCXFwyYpMXm29hiCHg5SnfmayU0RRM12Ydbqb5CGHo5z35_ifBwpj-d73FgllzURYTLyDdyMVcc8VsArxXHcQ5fkfQKDkJmHRJ3FYeR4gbfGqNq0FO2lMQxXsZc4xg8uwsOyN679RVgqSHyGrYfddF_EmQ_2pMZM2axBXqstXpTk2vREY1H3ukNpwbgNZF7rSQEOx9wXqDR5Wb9Hj9OnJFz37fNg3N7j5qhI8t5ODQzpZltiOTtHm1Iw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ99NA8pjfGPYhJG0Cz0MZbi7bDDTI82abgwmSexVH1nkseqUTr7dLkOvTMcz2o9zRMbnaQu2_39Ogwue3jy7PZTBjhOXxc6CfNlWYuO7nAzkrW3_oGICxY-2H6KoHzA52CmsAZB0daeGeFk4Kkgweg9maHLZroD8fe-bI5BZxxYhKt0FzXK3a_Lz1eNJNhvfRnb-L8ZT86l4Y2IcLfIsCKRGcqXffSuyteRvFE1J0z5KzJBE1_Ebt-A',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1vXuYUCmoJvT138cLlOk4NLL0fU6lMFkO2sUBPA0jEeC9gaSPETuC_xZjwQoI2A6RCb3f9bgLvqCJYNQ9P6FNlXHaknmn3J_1R-WrvjhW-JEPdE30YxthUZF50hHT0CtnhqmwY3Q8w6ctXfagxf4Y_lsbYayjyw4El-0zeA1QFRMrsdcN405Z0yk1-Haj3h1w2N9U1kLTvYIiyStY9U1Zw8rjUVjHTeZad4WOsLJY0HuebzUo4TxiIA',
    ]),
  ].slice(0, 4);

  const companions = [
    {
      id: 'nordic-rocking-horse',
      skuLabel: 'Item #11 • Modern Classic',
      title: 'The Rocking Horse',
      desc: 'Gracefully balanced radius arcs designed for vestibular inner-ear development.',
      price: 5499,
      subtitle: 'Pre-assembled',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLbstktrNmUr3cZBTvksKn262VzALJuvUO0g3PlteRM_4pq8jHRpNM5Dv1d4DxWJgHaUmpSYMmbTduiOdUN4oE-xarj6uY4wDNIj6V1Kj2Q57Etc8YIXqCdiOkfytpfvQGDmzoRbIfFXN1MAGK3tl_tVl3rfJYwQk_FKAqIorfxjWNIlS46xV0Wkvox1CgOsoCJnh_qdk2euDj4ndN-dUvDz-niwIOA4yOPiKv41eNC9x9dtl7-BLhjA',
    },
    {
      id: 'organic-stacking-stones',
      skuLabel: 'Item #35 • Tactile Focus',
      title: 'Sensory Stacking Stones',
      desc: 'Hand-facetted river pebbles turned from walnut, maple, and cherry.',
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
      subtitle: 'Heavy-duty beech',
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
                  FSC® Beech Timber
                </span>
                <button
                  onClick={() => onOpen360(product.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-[#4d4540] hover:text-[#171411] shadow-sm border border-[#e4e2df] pointer-events-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#7d562d] text-[15px]">
                    view_in_ar
                  </span>
                  <span>Interactive 360° View Ready</span>
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

              {/* Reviews and Rating Bar */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-[#7d562d]">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <span
                      key={starVal}
                      className="material-symbols-outlined text-[17px]"
                      style={{
                        fontVariationSettings:
                          starVal <= Math.round(avgRatingNum) ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#171411]">{avgRating}</span>
                <span className="text-[#7e756f] text-xs">•</span>
                <a
                  href="#customer-reviews"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-[#4d4540] hover:text-[#171411] underline decoration-[#cfc4bd] underline-offset-4 cursor-pointer"
                >
                  {reviews.length} Verified Customer Reviews &amp; Testimonials
                </a>
              </div>
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
                  Launch Heirloom Tier
                </span>
              </div>
              <p className="text-[12px] text-[#4d4540] mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#7d562d]">
                  local_shipping
                </span>
                <span>Inclusive of all GST. Complimentary white-glove transit across India.</span>
              </p>
            </div>

            {/* Honest Transparent Cost Breakdown (Micro-Accordion) */}
            <div className="p-3 bg-[#f5f3f0] rounded-xl border border-[#e4e2df]">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-[#4d4540] hover:text-[#171411] text-[11px] font-bold tracking-wider uppercase select-none">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#7d562d] text-[16px]">
                      price_check
                    </span>
                    <span>Radical Price Transparency</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="pt-3 space-y-2 text-xs text-[#4d4540] border-t border-[#e4e2df] mt-2">
                  <div className="flex justify-between">
                    <span>FSC European Beech &amp; Waterborne Lacquer</span>
                    <span className="font-semibold text-[#171411]">₹1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Artisan Hand Lathe Joinery &amp; Chamfering</span>
                    <span className="font-semibold text-[#171411]">₹950</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Molded Pulp Box &amp; Air Courier</span>
                    <span className="font-semibold text-[#171411]">₹450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fair Atelier Sustenance &amp; R&amp;D</span>
                    <span className="font-semibold text-[#171411]">₹1,299</span>
                  </div>
                  <p className="pt-1 text-[#7e756f] text-[11px]">
                    True heirloom durability: amortizes to less than ₹12/month when passed to
                    siblings.
                  </p>
                </div>
              </details>
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

            {/* Developmental Specifications Matrix */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-[#f5f3f0] rounded-xl border border-[#e4e2df]">
                <p className="text-[10px] text-[#7e756f] uppercase font-bold tracking-wider">Ages</p>
                <p className="font-serif font-bold text-sm text-[#171411] mt-0.5">
                  {product.specifications?.seatHeight ? '12–36 Mo' : product.age}
                </p>
              </div>
              <div className="p-2.5 bg-[#f5f3f0] rounded-xl border border-[#e4e2df]">
                <p className="text-[10px] text-[#7e756f] uppercase font-bold tracking-wider">
                  Tested Capacity
                </p>
                <p className="font-serif font-bold text-sm text-[#171411] mt-0.5">
                  {product.specifications?.testedCapacity || '40 kg (88 lbs)'}
                </p>
              </div>
              <div className="p-2.5 bg-[#f5f3f0] rounded-xl border border-[#e4e2df]">
                <p className="text-[10px] text-[#7e756f] uppercase font-bold tracking-wider">Mass</p>
                <p className="font-serif font-bold text-sm text-[#171411] mt-0.5">
                  {product.specifications?.weight || '3.4 kg Solid'}
                </p>
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
                  <strong>10-Year Craftsmanship Guarantee:</strong> Structural wood joints
                  warrantied for a decade.
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f5f3f0]">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">shield</span>
                <span>
                  <strong>BIS &amp; EN-71 Non-Toxic Certified:</strong> 100% Saliva-safe, lead-free
                  organic pigments.
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f5f3f0]">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                  nest_eco_leaf
                </span>
                <span>
                  <strong>30-Day Quiet Living Room Trial:</strong> Effortless courier returns if not
                  harmonious.
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

      {/* Deep Dive Technical Specifications & Curated Accordions */}
      <section className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Section Intro Sticky Left */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#7d562d]">
              Technical Dossier
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#171411]">
              Certifications, dimensions &amp; developmental science.
            </h2>
            <p className="text-sm text-[#4d4540]">
              Complete clarity on materials, dimensions, and maintenance. We believe heirlooms
              should arrive with total transparency.
            </p>

            {/* Inline Visual Scale Chart SVG */}
            <div className="p-4 bg-[#efeeeb] rounded-2xl mt-4 space-y-2 border border-[#cfc4bd]">
              <div className="flex items-center justify-between text-[#171411] text-xs font-bold">
                <span>Developmental Progression Ratio</span>
                <span className="text-[#7d562d]">98% Autonomy Index</span>
              </div>
              <svg
                className="w-full h-12 text-[#7d562d]"
                fill="none"
                viewBox="0 0 320 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 40 C 60 40, 100 28, 160 22 C 220 16, 260 8, 320 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                ></path>
                <circle cx="160" cy="22" fill="currentColor" r="4.5"></circle>
                <circle cx="320" cy="4" fill="currentColor" r="4.5"></circle>
              </svg>
              <div className="flex justify-between text-[11px] text-[#7e756f]">
                <span>12 Mo: Trunk Balance</span>
                <span>24 Mo: Coordinated Propulsion</span>
              </div>
            </div>
          </div>

          {/* Interactive Accordion Tabs Right */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* Accordion 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e4e2df]">
              <details className="group" open>
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#efeeeb] flex items-center justify-center text-xs font-bold text-[#171411]">
                      01
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#171411]">
                        Materials &amp; Non-Toxic Finishing
                      </h3>
                      <p className="text-xs text-[#7e756f]">
                        FSC® Beechwood, plant oils &amp; food-grade lacquers
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#7d562d] group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-[#4d4540] text-xs space-y-3 border-t border-[#f5f3f0]">
                  <p>
                    Every wooden element is milled from responsibly harvested, FSC-certified German
                    European beech (<em>Fagus sylvatica</em>), prized for its exceptional density,
                    shock resistance, and splinter-free grain.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                        check_circle
                      </span>
                      <span>
                        <strong>Zero-VOC Lacquer:</strong> Waterborne formulation passing German DIN
                        53160 saliva resistance tests.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                        check_circle
                      </span>
                      <span>
                        <strong>Organic Flaxseed Oil:</strong> Sealed naturally to prevent moisture
                        staining and retain natural warmth.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                        check_circle
                      </span>
                      <span>
                        <strong>Machined Brass Axles:</strong> Self-lubricating bushing system
                        engineered for quiet decades of push-along play.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                        check_circle
                      </span>
                      <span>
                        <strong>Eco Packaging:</strong> 100% recycled unbleached kraft paper box with
                        biodegradable mycelium corner protectors.
                      </span>
                    </li>
                  </ul>
                </div>
              </details>
            </div>

            {/* Accordion 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e4e2df]">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#efeeeb] flex items-center justify-center text-xs font-bold text-[#171411]">
                      02
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#171411]">
                        Developmental &amp; Montessori Foundation
                      </h3>
                      <p className="text-xs text-[#7e756f]">
                        Gross-motor coordination, spatial planning &amp; calm focus
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#7d562d] group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-[#4d4540] text-xs space-y-3 border-t border-[#f5f3f0]">
                  <p>
                    Designed in collaboration with early childhood Montessori pedagogues to support
                    intrinsic motor milestones without sensory fatigue.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-[#f5f3f0] rounded-xl">
                      <h4 className="font-serif font-bold text-[#171411] mb-1">Proprioception</h4>
                      <p>Helps children gauge boundary zones, turning radius, and foot force.</p>
                    </div>
                    <div className="p-3 bg-[#f5f3f0] rounded-xl">
                      <h4 className="font-serif font-bold text-[#171411] mb-1">
                        Bilateral Coordination
                      </h4>
                      <p>Engages alternating leg muscle groups while maintaining upper stabilizer.</p>
                    </div>
                    <div className="p-3 bg-[#f5f3f0] rounded-xl">
                      <h4 className="font-serif font-bold text-[#171411] mb-1">
                        Zero Overstimulation
                      </h4>
                      <p>No batteries or electronic chimes. The child commands tempo and sound.</p>
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Accordion 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e4e2df]">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#efeeeb] flex items-center justify-center text-xs font-bold text-[#171411]">
                      03
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#171411]">
                        Dimensions, Weight &amp; BIS Safety
                      </h3>
                      <p className="text-xs text-[#7e756f]">
                        Precise nursery measurements and certification credentials
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#7d562d] group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-[#4d4540] text-xs space-y-4 border-t border-[#f5f3f0]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-[#f5f3f0] rounded-xl">
                      <span className="text-[10px] text-[#7e756f] uppercase block">Length</span>
                      <p className="font-serif font-bold text-sm text-[#171411]">54 cm (21.2 in)</p>
                    </div>
                    <div className="p-3 bg-[#f5f3f0] rounded-xl">
                      <span className="text-[10px] text-[#7e756f] uppercase block">Width</span>
                      <p className="font-serif font-bold text-sm text-[#171411]">28 cm (11.0 in)</p>
                    </div>
                    <div className="p-3 bg-[#f5f3f0] rounded-xl">
                      <span className="text-[10px] text-[#7e756f] uppercase block">Seat Height</span>
                      <p className="font-serif font-bold text-sm text-[#171411]">22 cm (8.6 in)</p>
                    </div>
                    <div className="p-3 bg-[#f5f3f0] rounded-xl">
                      <span className="text-[10px] text-[#7e756f] uppercase block">Handlebar</span>
                      <p className="font-serif font-bold text-sm text-[#171411]">36 cm (14.1 in)</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-[#fbf9f6] rounded-xl flex items-center justify-between border border-[#e4e2df]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7d562d] block">
                        Compliance Credentials
                      </span>
                      <p className="text-xs font-medium text-[#171411]">
                        Certified under BIS IS-9873 (Parts 1, 2, 3) and European Union EN-71
                        Standards.
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#7d562d] text-2xl">
                      verified_user
                    </span>
                  </div>
                </div>
              </details>
            </div>
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
              <span>Explore All 50 Archetypes</span>
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

      {/* Customer Reviews & Collector Testimonials */}
      <section
        id="customer-reviews"
        className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-12 py-16 scroll-mt-24 border-t border-[#e4e2df]"
      >
        <div className="space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#7d562d]">
                Living Room Harmony &amp; Nursery Impressions
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#171411] mt-1">
                Customer Reviews
              </h2>
              <p className="text-xs text-[#7e756f] mt-1 max-w-xl">
                Authentic evaluations from parents, interior architects, and early-childhood
                educators living with the {product.name}.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-5 py-2.5 bg-[#171411] text-white hover:bg-[#7d562d] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">rate_review</span>
                <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
              </button>
            </div>
          </div>

          {/* Rating Breakdown & Trust Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e4e2df]">
            {/* Overall Score */}
            <div className="md:col-span-4 flex flex-col justify-center items-center text-center p-6 bg-[#fbf9f6] rounded-xl border border-[#efeeeb]">
              <span className="font-serif text-5xl font-extrabold text-[#171411]">
                {avgRating}
              </span>
              <div className="flex text-[#7d562d] my-2">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <span
                    key={starVal}
                    className="material-symbols-outlined text-2xl"
                    style={{
                      fontVariationSettings:
                        starVal <= Math.round(avgRatingNum) ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-xs font-bold text-[#171411]">
                Based on {reviews.length} collector reviews
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#efeeeb] text-[#7d562d] rounded-full text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                <span>99.4% Collector Recommendation Rate</span>
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="md:col-span-5 flex flex-col justify-center gap-2.5 px-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
                const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                const isSelected = filterRating === stars;
                return (
                  <button
                    key={stars}
                    onClick={() => setFilterRating(isSelected ? 'all' : stars)}
                    className={`flex items-center gap-3 text-xs w-full group py-0.5 px-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                      isSelected ? 'bg-[#efeeeb]' : 'hover:bg-[#fbf9f6]'
                    }`}
                  >
                    <span className="w-12 text-[#171411] font-medium flex items-center gap-0.5">
                      <span>{stars}</span>
                      <span
                        className="material-symbols-outlined text-[13px] text-[#7d562d]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    </span>
                    <div className="flex-1 h-2 bg-[#efeeeb] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7d562d] group-hover:bg-[#171411] transition-all rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-right text-[#7e756f] text-[11px]">{count}</span>
                  </button>
                );
              })}
              {filterRating !== 'all' && (
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#7d562d] font-semibold">
                    Filtered to {filterRating} Star reviews
                  </span>
                  <button
                    onClick={() => setFilterRating('all')}
                    className="underline text-[#171411] font-bold cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Quality Guarantees */}
            <div className="md:col-span-3 flex flex-col justify-center gap-3.5 border-t md:border-t-0 md:border-l border-[#e4e2df] pt-4 md:pt-0 md:pl-6 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                  verified
                </span>
                <div>
                  <h4 className="font-bold text-[#171411]">100% Verified Collectors</h4>
                  <p className="text-[11px] text-[#7e756f]">
                    All submissions audited against batch registry serials.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                  eco
                </span>
                <div>
                  <h4 className="font-bold text-[#171411]">Zero-Toxicity Tested</h4>
                  <p className="text-[11px] text-[#7e756f]">
                    EN-71 &amp; BIS IS-9873 compliant cold-pressed oils.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                  volume_off
                </span>
                <div>
                  <h4 className="font-bold text-[#171411]">Acoustic Floor Dampening</h4>
                  <p className="text-[11px] text-[#7e756f]">
                    Engineered silent glide on solid teak and marble.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Review Submission Form Module */}
          {showReviewForm && (
            <div className="bg-[#fbf9f6] border border-[#cfc4bd] rounded-2xl p-6 md:p-8 shadow-md space-y-6 animate-fadeIn">
              <div className="flex items-start justify-between border-b border-[#e4e2df] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7d562d]">
                    Collector Contribution
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#171411]">
                    Leave a Review for {product.name}
                  </h3>
                  <p className="text-xs text-[#7e756f] mt-0.5">
                    Share your reflections on the wood joinery, wheel acoustics, balance, and child
                    play experience.
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="w-8 h-8 rounded-full bg-white border border-[#e4e2df] flex items-center justify-center text-[#7e756f] hover:text-[#171411] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Star Rating Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171411]">
                    Overall Star Rating:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex text-[#7d562d]">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled =
                          hoverRating > 0 ? starVal <= hoverRating : starVal <= newRating;
                        return (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => setNewRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                            title={`${starVal} Star`}
                          >
                            <span
                              className="material-symbols-outlined text-3xl"
                              style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              star
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-[#7d562d] bg-[#efeeeb] px-3 py-1 rounded-full">
                      {newRating === 5 && '★★★★★ — 5 / 5 (Exceptional Heirloom Masterpiece)'}
                      {newRating === 4 && '★★★★☆ — 4 / 5 (Superior Handcrafted Quality)'}
                      {newRating === 3 && '★★★☆☆ — 3 / 5 (Good Handcrafted Quality)'}
                      {newRating === 2 && '★★☆☆☆ — 2 / 5 (Fair / Needs Refinement)'}
                      {newRating === 1 && '★☆☆☆☆ — 1 / 5 (Unsatisfied)'}
                    </span>
                  </div>
                </div>

                {/* Author Name and Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171411] mb-1.5">
                      Your Name / Moniker *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Radhika &amp; Vikram Malhotra"
                      className="w-full bg-white border border-[#cfc4bd] rounded-xl px-4 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#7d562d] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171411] mb-1.5">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Worli, Mumbai"
                      className="w-full bg-white border border-[#cfc4bd] rounded-xl px-4 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#7d562d] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171411] mb-1.5">
                      Colorway / Finish Purchased
                    </label>
                    <select
                      value={newFinish}
                      onChange={(e) => setNewFinish(e.target.value)}
                      className="w-full bg-white border border-[#cfc4bd] rounded-xl px-4 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#7d562d] shadow-sm"
                    >
                      {product.colorways && product.colorways.length > 0 ? (
                        product.colorways.map((cw) => (
                          <option key={cw.name} value={cw.name}>
                            {cw.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Ivory White &amp; Natural Beech">
                            Ivory White &amp; Natural Beech
                          </option>
                          <option value="Pure Raw Birch">Pure Raw Birch</option>
                          <option value="Warm Oat Lacquer">Warm Oat Lacquer</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171411] mb-1.5">
                    Review Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sculptural elegance, completely silent on our wooden floors"
                    className="w-full bg-white border border-[#cfc4bd] rounded-xl px-4 py-2.5 text-xs text-[#171411] focus:outline-none focus:border-[#7d562d] shadow-sm"
                  />
                </div>

                {/* Written Review Comment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171411] mb-1.5">
                    Written Review &amp; Reflections *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share details on the wood grain tactile finish, packaging, child engagement, and living room aesthetic..."
                    className="w-full bg-white border border-[#cfc4bd] rounded-xl p-4 text-xs text-[#171411] focus:outline-none focus:border-[#7d562d] shadow-sm leading-relaxed"
                  ></textarea>
                  <p className="text-[11px] text-[#7e756f] mt-1">
                    Minimum 10 characters. Please be honest regarding durability, joinery, and safe
                    play milestones.
                  </p>
                </div>

                {/* Certified Authenticity Pledge */}
                <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-[#e4e2df]">
                  <input
                    type="checkbox"
                    id="pledge"
                    defaultChecked
                    className="rounded border-[#cfc4bd] text-[#7d562d] focus:ring-[#7d562d] cursor-pointer"
                  />
                  <label htmlFor="pledge" className="text-xs text-[#4d4540] cursor-pointer select-none">
                    I confirm that I have personally handled this LUMEN heirloom piece and this review
                    is my genuine reflection.
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-3 bg-[#171411] hover:bg-[#7d562d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">publish</span>
                    <span>{isSubmittingReview ? 'Publishing Review...' : 'Publish Heirloom Review'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-5 py-3 bg-white hover:bg-[#efeeeb] text-[#4d4540] text-xs font-bold uppercase tracking-wider rounded-xl border border-[#cfc4bd] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Review Filter & Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-[#e4e2df] pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7e756f] mr-1">
                Filter:
              </span>
              <button
                onClick={() => setFilterRating('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterRating === 'all'
                    ? 'bg-[#171411] text-white'
                    : 'bg-white border border-[#e4e2df] text-[#4d4540] hover:text-[#171411]'
                }`}
              >
                All Reviews ({reviews.length})
              </button>
              {[5, 4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                    filterRating === star
                      ? 'bg-[#171411] text-white'
                      : 'bg-white border border-[#e4e2df] text-[#4d4540] hover:text-[#171411]'
                  }`}
                >
                  <span>{star} Stars</span>
                  <span className="opacity-75">
                    ({ratingCounts[star as keyof typeof ratingCounts] || 0})
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7e756f]">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'recent' | 'highest' | 'helpful')
                }
                className="bg-white border border-[#e4e2df] rounded-lg px-3 py-1.5 text-xs text-[#171411] font-medium focus:outline-none focus:border-[#7d562d] cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Star Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#e4e2df] p-8 space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#7d562d]">
                rate_review
              </span>
              <h3 className="font-serif font-bold text-lg text-[#171411]">
                No Reviews Found for this Star Filter
              </h3>
              <p className="text-xs text-[#7e756f] max-w-sm mx-auto">
                No reviews match the {filterRating}-star filter yet. Be the first to share your
                experience!
              </p>
              <button
                onClick={() => setFilterRating('all')}
                className="px-4 py-2 bg-[#171411] text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer"
              >
                View All Reviews
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-[#e4e2df] space-y-4 hover:border-[#cfc4bd] transition-colors"
                >
                  {/* Review Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#efeeeb] border border-[#cfc4bd] flex items-center justify-center font-serif font-bold text-sm text-[#7d562d]">
                        {rev.author
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#171411]">{rev.author}</h4>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7d562d] bg-[#fbf9f6] px-2 py-0.5 rounded border border-[#efeeeb]">
                              <span className="material-symbols-outlined text-[12px]">
                                verified
                              </span>
                              <span>Verified Collector</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#7e756f]">
                          {rev.role} • {rev.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1">
                      <div className="flex text-[#7d562d]">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <span
                            key={starVal}
                            className="material-symbols-outlined text-[17px]"
                            style={{
                              fontVariationSettings:
                                starVal <= rev.rating ? "'FILL' 1" : "'FILL' 0",
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] text-[#7e756f]">{rev.date}</span>
                    </div>
                  </div>

                  {/* Finish Purchased Tag */}
                  {rev.finishPurchased && (
                    <div className="inline-block px-2.5 py-0.5 bg-[#fbf9f6] border border-[#e4e2df] rounded text-[10px] text-[#7d562d] font-semibold">
                      Finish Selected: {rev.finishPurchased}
                    </div>
                  )}

                  {/* Review Title & Written Comment */}
                  <div className="space-y-2">
                    <h5 className="font-serif font-bold text-base md:text-lg text-[#171411]">
                      {rev.title}
                    </h5>
                    <p className="text-xs md:text-sm text-[#4d4540] leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>

                  {/* Review Footer with Helpful Action */}
                  <div className="pt-3 border-t border-[#f5f3f0] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleHelpful(rev.id)}
                        disabled={helpfulGiven[rev.id]}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          helpfulGiven[rev.id]
                            ? 'bg-[#efeeeb] text-[#7d562d] cursor-default'
                            : 'bg-[#fbf9f6] text-[#4d4540] hover:bg-[#efeeeb] hover:text-[#171411] border border-[#e4e2df]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {helpfulGiven[rev.id] ? 'thumb_up' : 'thumb_up_off_alt'}
                        </span>
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                      <span className="text-[11px] text-[#7e756f] hidden sm:inline">
                        Recorded on batch ledger
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#7d562d] tracking-wider">
                      BIS &amp; EN-71 Safe
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Spotlight Testimonials from Leading Architects */}
          <div className="pt-8 border-t border-[#e4e2df] space-y-4" id="designer-reviews">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7d562d]">
                  Archival Spotlight
                </span>
                <h3 className="font-serif text-xl font-bold text-[#171411]">
                  Praise from Renowned Architectural Practices
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm space-y-4 flex flex-col justify-between border border-[#e4e2df]">
                <div className="space-y-2">
                  <div className="flex text-[#7d562d]">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-serif italic text-xs md:text-sm text-[#171411] leading-relaxed">
                    “As an architect who spent years eliminating plastic chaos from our Mumbai home,
                    this ride-on is a masterwork. It sits beside our Pierre Jeanneret chairs and looks
                    like a contemporary wooden sculpture.”
                  </p>
                </div>
                <div className="pt-2 border-t border-[#f5f3f0] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#171411] block">Ananya Singhania</span>
                    <span className="text-[#7e756f]">Principal Architect, Studio Vayu</span>
                  </div>
                  <span className="text-[#7d562d] font-bold text-[10px] uppercase">
                    Verified Heirloom
                  </span>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm space-y-4 flex flex-col justify-between border border-[#e4e2df]">
                <div className="space-y-2">
                  <div className="flex text-[#7d562d]">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-serif italic text-xs md:text-sm text-[#171411] leading-relaxed">
                    “The silence of the wheels was the biggest surprise. Our daughter glides across
                    hardwood without waking her newborn brother. The tactile silkiness of the beech
                    handle is unmatched.”
                  </p>
                </div>
                <div className="pt-2 border-t border-[#f5f3f0] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#171411] block">Lukas &amp; Freja Lindström</span>
                    <span className="text-[#7e756f]">Copenhagen &amp; Bengaluru</span>
                  </div>
                  <span className="text-[#7d562d] font-bold text-[10px] uppercase">
                    Verified Heirloom
                  </span>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm space-y-4 flex flex-col justify-between border border-[#e4e2df]">
                <div className="space-y-2">
                  <div className="flex text-[#7d562d]">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-serif italic text-xs md:text-sm text-[#171411] leading-relaxed">
                    “In our AMI Montessori classroom, children gravitate toward it immediately. The
                    weight teaches authentic physical consequence without posing any tipping hazards.”
                  </p>
                </div>
                <div className="pt-2 border-t border-[#f5f3f0] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#171411] block">Dr. Meera Nambiar</span>
                    <span className="text-[#7e756f]">Early Childhood Pedagogue</span>
                  </div>
                  <span className="text-[#7d562d] font-bold text-[10px] uppercase">
                    Verified Heirloom
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
