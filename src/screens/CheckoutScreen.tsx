import React, { useState, useEffect } from 'react';
import { CartItem, Product, ScreenType } from '../types.ts';
import { formatINR, PRODUCTS } from '../data/products.ts';
import { OrderDocumentsModal } from '../components/OrderDocumentsModal.tsx';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateMonogram: (productId: string, text: string) => void;
  onToggleLeatherTag: (productId: string, enabled: boolean) => void;
  onAddCompanion: (product: Product) => void;
  onNavigate: (screen: ScreenType, productId?: string) => void;
  onOrderSuccess: (orderData: any) => void;
  onSaveToWishlist: (productId: string) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateMonogram,
  onToggleLeatherTag,
  onAddCompanion,
  onNavigate,
  onOrderSuccess,
  onSaveToWishlist,
}) => {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [engravingEnabled, setEngravingEnabled] = useState(true);
  const [monogramText, setMonogramText] = useState('A. Singhania');
  const [leatherTagEnabled, setLeatherTagEnabled] = useState(false);
  const [transparencyOpen, setTransparencyOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');
  const [giftNote, setGiftNote] = useState(
    'With love, crafted to last generations. May your curious steps echo with warmth and laughter through this home. — Nani & Dadu'
  );

  // Delivery Dossier state
  const [fullName, setFullName] = useState('Ananya Singhania');
  const [phone, setPhone] = useState('+91 98201 44520');
  const [email, setEmail] = useState('ananya.s@singhaniagroup.in');
  const [address, setAddress] = useState('Penthouse 4B, The Anya Residences, Worli Sea Face');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('400030');

  // Subtotal calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = voucherApplied ? 500 : 0;
  const total = Math.max(0, subtotal - discount);

  const companionProduct = PRODUCTS.find((p) => p.id === 'organic-stacking-stones') || PRODUCTS[2];

  // Order confirmation & document state
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [showUpiQrModal, setShowUpiQrModal] = useState<boolean>(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [upiTimer, setUpiTimer] = useState<number>(300);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (showUpiQrModal && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showUpiQrModal, upiTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim().toLowerCase() === 'heirloom' || voucherCode.trim().length > 3) {
      setVoucherApplied(true);
    }
  };

  const handleFinalizeOrder = (methodOverride?: string) => {
    const method = methodOverride || paymentMethod;
    const orderData = {
      orderId: `LMN-${Math.floor(10000 + Math.random() * 90000)}`,
      total,
      subtotal,
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pinCode,
      items: cartItems.map((c) => ({
        name: c.product.name,
        sku: c.product.sku,
        price: c.product.price,
        quantity: c.quantity,
        selectedColorway: c.selectedColorway,
      })),
      cartItems: [...cartItems],
      monogramText: engravingEnabled ? monogramText : undefined,
      leatherTagEnabled,
      paymentMethod: method,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setShowUpiQrModal(false);
    setCompletedOrder(orderData);
    onOrderSuccess(orderData);
  };

  const handleInitiatePayment = (chosenMethod?: 'card' | 'upi' | 'netbanking' | 'cod') => {
    const selected = chosenMethod || paymentMethod;
    setPaymentMethod(selected);
    if (selected === 'upi') {
      setUpiTimer(300);
      setShowUpiQrModal(true);
    } else {
      handleFinalizeOrder(selected);
    }
  };

  const handleCopyUpiId = () => {
    navigator.clipboard?.writeText('lumen.crafts@okhdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Progress Stepper / Editorial Stage Indicator */}
      <section className="w-full bg-[#f5f3f0]/70 py-4 border-b border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#7e756f] uppercase tracking-widest">
              <span className="text-[#7d562d] font-bold">Curated Checkout</span>
              <span>/</span>
              <span>Dossier #LMN-84920</span>
            </div>
            <nav
              aria-label="Checkout Progress"
              className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-1 md:pb-0"
            >
              <div
                onClick={() => setActiveStep(1)}
                className="flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                    activeStep === 1
                      ? 'bg-[#171411] text-white'
                      : 'bg-[#efeeeb] text-[#171411]'
                  }`}
                >
                  1
                </span>
                <span className="text-xs font-bold text-[#171411]">01. Curated Cart</span>
              </div>
              <div className="w-8 h-px bg-[#cfc4bd] shrink-0"></div>
              <div
                onClick={() => setActiveStep(2)}
                className="flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                    activeStep === 2
                      ? 'bg-[#ffca98] text-[#7a532a]'
                      : 'bg-[#efeeeb] text-[#171411]'
                  }`}
                >
                  2
                </span>
                <span className="text-xs font-bold text-[#171411]">
                  02. Heirloom Delivery &amp; Engraving
                </span>
              </div>
              <div className="w-8 h-px bg-[#cfc4bd] shrink-0"></div>
              <div className="flex items-center gap-2 shrink-0 opacity-60">
                <span className="w-6 h-6 rounded-full bg-[#eae8e5] text-[#4d4540] text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-medium text-[#4d4540]">03. White-Glove Dispatch</span>
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Checkout Dossier: Two-Column Canvas */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          {/* Title & Reassurance Header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-[#7d562d] font-bold">
                  Artisanal Nursery Portfolio
                </span>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#171411]">
                  Review Your Heirloom Selection
                </h1>
                <p className="text-sm md:text-base text-[#4d4540] max-w-2xl leading-relaxed">
                  Each sculpted piece is custom calibrated, oiled with botanical wax, and shielded in
                  humidity-monitored wooden crating before white-glove transport across India.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#f5f3f0] px-4 py-2.5 rounded-xl border border-[#e4e2df] self-start md:self-auto">
                <span
                  className="material-symbols-outlined text-[#7d562d]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  shield_with_heart
                </span>
                <span className="text-xs font-semibold text-[#171411]">
                  Insured Pan-India Air Transit Included
                </span>
              </div>
            </div>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN: Cart Items, Personalization & Delivery Dossier */}
            <div className="lg:col-span-7 space-y-8">
              {/* SECTION 1: Cart Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-[#171411]">
                    Selected Heirlooms ({cartItems.reduce((acc, c) => acc + c.quantity, 0)})
                  </h2>
                  <span className="text-[11px] text-[#7e756f] uppercase font-bold tracking-wider">
                    European Beechwood • FSC 100%
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-[#e4e2df] space-y-4">
                    <span className="material-symbols-outlined text-5xl text-[#cfc4bd]">
                      shopping_bag
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#171411]">
                      Your Heirloom Bag is Empty
                    </h3>
                    <p className="text-xs text-[#7e756f]">
                      Explore our 50 master archetypes to begin curating your nursery.
                    </p>
                    <button
                      onClick={() => onNavigate('all-collections')}
                      className="bg-[#171411] hover:bg-[#7d562d] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Explore Master Archive
                    </button>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div
                      key={item.product.id}
                      className="bg-white p-6 rounded-2xl shadow-sm space-y-4 border border-[#e4e2df] hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative w-full sm:w-40 aspect-[4/5] rounded-xl overflow-hidden bg-[#efeeeb] shrink-0 border border-[#e4e2df]">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-[#171411] font-bold tracking-wider">
                            MODEL #{item.product.sku.replace('SKU #', '').padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#7d562d]">
                                  {item.product.categoryLabel}
                                </span>
                                <h3 className="font-serif text-xl font-bold text-[#171411]">
                                  {item.product.name}
                                </h3>
                              </div>
                              <span className="font-serif text-2xl font-bold text-[#171411] whitespace-nowrap">
                                {formatINR(item.product.price * item.quantity)}
                              </span>
                            </div>
                            <p className="text-xs text-[#4d4540] mt-1">
                              Finish:{' '}
                              {item.selectedColorway ||
                                'Satin Ivory Shell & Hand-Turned Blonde Beechwood'}
                            </p>
                            <p className="text-[11px] text-[#7e756f] mt-0.5">
                              Batch Code: DK-2025-C12 • Recommended Age: {item.product.age}
                            </p>
                          </div>

                          {/* Complimentary Accompaniments */}
                          <div className="bg-[#f5f3f0] p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#4d4540]">
                            <span
                              className="material-symbols-outlined text-[#7d562d] text-[18px] shrink-0 mt-0.5"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              spa
                            </span>
                            <div className="leading-snug">
                              <strong className="text-[#171411]">Archival Care Included:</strong>{' '}
                              Complimentary organic beeswax restoration balm (60ml) &amp;
                              unbleached GOTS cotton dust envelope.
                            </div>
                          </div>

                          {/* Quantity & Actions */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2 bg-[#f5f3f0] rounded-lg px-2 py-1 border border-[#e4e2df]">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 flex items-center justify-center text-[#4d4540] hover:text-[#171411] cursor-pointer"
                              >
                                −
                              </button>
                              <span className="text-xs font-bold text-[#171411] w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, 1)}
                                aria-label="Increase quantity"
                                className="w-6 h-6 flex items-center justify-center text-[#4d4540] hover:text-[#171411] cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => onSaveToWishlist(item.product.id)}
                                className="text-xs text-[#4d4540] hover:text-[#171411] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  bookmark_border
                                </span>
                                <span>Save to Wishlist</span>
                              </button>
                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  delete
                                </span>
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Custom Nursery Monogram (for first item) */}
                      {index === 0 && (
                        <div className="bg-[#f5f3f0]/70 p-4 rounded-xl space-y-3 border border-[#e4e2df]">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={engravingEnabled}
                                onChange={(e) => setEngravingEnabled(e.target.checked)}
                                className="w-4 h-4 accent-[#171411] rounded cursor-pointer"
                              />
                              <span className="text-xs font-bold text-[#171411]">
                                Laser-Etched Nursery Monogram (Complimentary Atelier Service)
                              </span>
                            </label>
                            <span className="text-[10px] font-bold text-[#7d562d] uppercase tracking-wider">
                              Permanent Heirloom Badge
                            </span>
                          </div>

                          {engravingEnabled && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                              <div className="md:col-span-2">
                                <input
                                  type="text"
                                  value={monogramText}
                                  onChange={(e) => {
                                    setMonogramText(e.target.value);
                                    onUpdateMonogram(item.product.id, e.target.value);
                                  }}
                                  placeholder="e.g. Eleanor Rose • 14.04.2024"
                                  className="w-full bg-white px-4 py-2.5 rounded-lg text-sm text-[#171411] shadow-inner border border-[#cfc4bd] focus:outline-none focus:ring-1 focus:ring-[#7d562d]"
                                />
                                <p className="text-[11px] text-[#7e756f] mt-1">
                                  Carved underneath chassis in timeless serif typography.
                                </p>
                              </div>
                              <div className="bg-[#eae8e5] px-4 py-2.5 rounded-lg flex items-center justify-center text-center border border-[#cfc4bd]">
                                <span className="font-serif italic text-base text-[#171411]">
                                  “{monogramText || 'A. Singhania'}”
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Foil Leather tag option (for second item) */}
                      {index === 1 && (
                        <div className="bg-[#f5f3f0]/70 p-4 rounded-xl flex items-center justify-between border border-[#e4e2df]">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={leatherTagEnabled}
                              onChange={(e) => {
                                setLeatherTagEnabled(e.target.checked);
                                onToggleLeatherTag(item.product.id, e.target.checked);
                              }}
                              className="w-4 h-4 accent-[#171411] rounded cursor-pointer"
                            />
                            <span className="text-xs text-[#4d4540]">
                              Add personalized archival leather tag stamped in copper foil
                            </span>
                          </label>
                          <span className="text-[11px] font-bold text-[#7d562d]">Free</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* SECTION 2: Harmonious Companion Upsell Box */}
              <div className="bg-[#ffdcbd]/40 p-6 rounded-2xl shadow-sm border border-[#ffca98]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-[#e4e2df]">
                      <img
                        src={companionProduct.image}
                        alt={companionProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#171411] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                          Curator Pair
                        </span>
                        <span className="text-[10px] font-bold text-[#7d562d]">
                          Special Bundle Price
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#171411] mt-0.5">
                        Organic Stacking Stones (Set of 7)
                      </h4>
                      <p className="text-xs text-[#4d4540]">
                        Tactile sensory stones in varying wood densities for spatial balance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                    <div className="text-right">
                      <span className="font-serif font-bold text-lg text-[#171411]">₹749</span>
                      <span className="text-xs text-[#7e756f] line-through ml-1">₹899</span>
                    </div>
                    <button
                      onClick={() => onAddCompanion(companionProduct)}
                      className="bg-[#171411] hover:bg-[#7d562d] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1 whitespace-nowrap cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Pan-India White-Glove Delivery Details Form */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6 border border-[#e4e2df]">
                <div className="flex items-center justify-between border-b border-[#f5f3f0] pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7d562d] tracking-wider">
                      Step 02 of 03
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#171411]">
                      Heirloom Delivery Dossier
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#4d4540] bg-[#f5f3f0] px-3 py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-[#7d562d] text-[16px]">
                      ac_unit
                    </span>
                    <span>Climate-Shielded Packaging</span>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#4d4540]">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full legal name"
                        className="w-full bg-[#f5f3f0] px-4 py-3 rounded-xl text-sm text-[#171411] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7d562d] border border-[#e4e2df] transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#4d4540]">
                        Contact Phone (for Driver Concierge) *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 00000 00000"
                        className="w-full bg-[#f5f3f0] px-4 py-3 rounded-xl text-sm text-[#171411] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7d562d] border border-[#e4e2df] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#4d4540]">
                      Email for Archival Provenance Certificate *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@estate.com"
                      className="w-full bg-[#f5f3f0] px-4 py-3 rounded-xl text-sm text-[#171411] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7d562d] border border-[#e4e2df] transition-all"
                    />
                    <p className="text-[11px] text-[#7e756f]">
                      Real-time GPS delivery coordinates and master carpenter certificate dispatched
                      here.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#4d4540]">
                      Residence / Nursery Delivery Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Apartment, Bungalow or Estate name"
                      className="w-full bg-[#f5f3f0] px-4 py-3 rounded-xl text-sm text-[#171411] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7d562d] border border-[#e4e2df] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#4d4540]">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#f5f3f0] px-4 py-3 rounded-xl text-sm text-[#171411] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7d562d] border border-[#e4e2df]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#4d4540]">
                        State *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-[#f5f3f0] px-4 py-3 rounded-xl text-sm text-[#171411] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7d562d] border border-[#e4e2df]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#4d4540]">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="w-full bg-[#f5f3f0] px-4 py-3 rounded-xl text-sm text-[#171411] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7d562d] border border-[#e4e2df]"
                      />
                    </div>
                  </div>

                  {/* Gift Message Card Preview Module */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#4d4540]">
                        Heirloom Gift Dossier Letterpress Card
                      </label>
                      <span className="text-[10px] font-bold text-[#7d562d]">
                        Heavyweight 350 GSM Cotton Card
                      </span>
                    </div>
                    <div className="bg-[#f5f3f0] p-4 rounded-xl space-y-2 relative overflow-hidden border border-[#e4e2df]">
                      <div className="absolute -right-4 -bottom-4 text-[#eae8e5] select-none pointer-events-none">
                        <span className="material-symbols-outlined text-[90px]">format_quote</span>
                      </div>
                      <textarea
                        rows={3}
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        className="w-full bg-transparent text-sm text-[#171411] font-serif focus:outline-none resize-none leading-relaxed"
                        placeholder="Inscribe a personal letterpress note for the child's milestone..."
                      />
                      <div className="flex items-center justify-between text-[11px] text-[#7e756f] pt-1 border-t border-[#e4e2df]">
                        <span>Hand-sealed with natural bronze wax impression</span>
                        <span>{giftNote.length} / 250 characters</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* SECTION 4: Reassurance Guarantee */}
              <div className="bg-[#eae8e5]/60 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-[#cfc4bd]">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#7d562d] shrink-0 shadow-sm border border-[#e4e2df]">
                  <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-serif font-bold text-lg text-[#171411]">
                    30-Day Unhurried In-Home Trial + 10-Year Craftsmanship Guarantee
                  </h4>
                  <p className="text-xs text-[#4d4540] leading-relaxed">
                    Live with each piece in your child’s nursery. If the touch, organic weight, or
                    movement doesn’t bring peaceful harmony to your space, our white-glove team will
                    arrange an effortless, uncrating-free reverse collection with zero fee deductions.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Order Summary & Multi-Gateway Express Checkout */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl space-y-6 border border-[#e4e2df]">
                <div className="border-b border-[#f5f3f0] pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-bold text-[#171411]">Order Summary</h3>
                    <span className="text-[11px] bg-[#efeeeb] px-2.5 py-1 rounded-full text-[#7d562d] font-bold">
                      {cartItems.reduce((acc, c) => acc + c.quantity, 0)} Heirloom Items
                    </span>
                  </div>
                  <p className="text-xs text-[#4d4540] mt-1">
                    Guaranteed dispatched from European joinery warehouse within 48h.
                  </p>
                </div>

                {/* Cost Line Items */}
                <div className="space-y-3 text-xs text-[#4d4540]">
                  <div className="flex justify-between items-center">
                    <span>Selected Works Subtotal</span>
                    <span className="text-[#171411] font-bold text-sm">
                      {formatINR(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#7d562d] font-semibold">
                    <span className="flex items-center gap-1">
                      <span>Insured White-Glove Air Cargo</span>
                      <span
                        className="material-symbols-outlined text-[15px] text-[#7e756f] cursor-help"
                        title="Zero risk in-transit breakage replacement"
                      >
                        info
                      </span>
                    </span>
                    <span className="bg-[#ffdcbd] text-[#2c1600] px-2 py-0.5 rounded text-[10px] font-bold">
                      COMPLIMENTARY
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Solid Pine Protective Crating &amp; Dust Bags</span>
                    <span className="text-[#171411] font-bold">₹0</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Personalized Nursery Laser Monogramming</span>
                    <span className="text-[#171411] font-bold">FREE (Save ₹650)</span>
                  </div>

                  {voucherApplied && (
                    <div className="flex justify-between items-center text-emerald-700 font-bold">
                      <span>Patron Loyalty Voucher</span>
                      <span>-₹500</span>
                    </div>
                  )}

                  {/* Price Transparency Collapsible Drawer */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setTransparencyOpen(!transparencyOpen)}
                      className="w-full flex items-center justify-between text-left py-2 px-3 bg-[#f5f3f0] rounded-xl text-[#171411] hover:bg-[#efeeeb] transition-colors cursor-pointer border border-[#e4e2df]"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-bold">
                        <span className="material-symbols-outlined text-[17px] text-[#7d562d]">
                          pie_chart
                        </span>
                        <span>Radical Price Transparency</span>
                      </span>
                      <span
                        className={`material-symbols-outlined text-[18px] transition-transform ${
                          transparencyOpen ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {transparencyOpen && (
                      <div className="mt-2 p-3 bg-[#f5f3f0]/80 rounded-xl space-y-2 text-xs text-[#4d4540] border border-[#e4e2df] animate-in fade-in">
                        <div className="flex justify-between">
                          <span>FSC® European Beechwood &amp; Brass</span>
                          <span className="font-bold text-[#171411]">
                            24% ({formatINR(total * 0.24)})
                          </span>
                        </div>
                        <div className="w-full bg-[#e4e2df] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#7d562d] h-full" style={{ width: '24%' }}></div>
                        </div>

                        <div className="flex justify-between pt-1">
                          <span>Artisan Lathe Work &amp; Wax Sanding</span>
                          <span className="font-bold text-[#171411]">
                            16% ({formatINR(total * 0.16)})
                          </span>
                        </div>
                        <div className="w-full bg-[#e4e2df] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#7d562d] h-full" style={{ width: '16%' }}></div>
                        </div>

                        <div className="flex justify-between pt-1">
                          <span>Pan-India Air Logistics &amp; Packing</span>
                          <span className="font-bold text-[#171411]">
                            8% ({formatINR(total * 0.08)})
                          </span>
                        </div>
                        <div className="w-full bg-[#e4e2df] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#7d562d] h-full" style={{ width: '8%' }}></div>
                        </div>

                        <div className="flex justify-between pt-1">
                          <span>Goods &amp; Services Tax (GST 18%)</span>
                          <span className="font-bold text-[#171411]">
                            18% ({formatINR(total * 0.18)})
                          </span>
                        </div>
                        <div className="w-full bg-[#e4e2df] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#171411] h-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Promo Code Input */}
                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Artisan patron or gift voucher"
                      className="flex-1 bg-[#f5f3f0] px-3 py-2 rounded-xl text-xs text-[#171411] uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#7d562d] border border-[#e4e2df]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      className="bg-[#eae8e5] hover:bg-[#cfc4bd] text-[#171411] px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {voucherApplied ? 'Applied ✓' : 'Apply'}
                    </button>
                  </div>
                </div>

                {/* Total Amount Bar */}
                <div className="border-t border-[#f5f3f0] pt-4">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-serif text-xl font-bold text-[#171411]">
                        Total Investment
                      </span>
                      <p className="text-[11px] text-[#7e756f]">
                        Inclusive of all local duties &amp; 18% GST
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-3xl font-bold text-[#171411]">
                        {formatINR(total)}
                      </span>
                      <p className="text-[11px] text-[#7d562d] font-bold">
                        Or {formatINR(total / 6)}/mo (6 mos. No Cost EMI)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instant Express Checkout Button */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleInitiatePayment()}
                    disabled={cartItems.length === 0}
                    className="w-full bg-[#171411] hover:bg-[#7d562d] disabled:opacity-50 text-white py-4 px-6 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
                      lock
                    </span>
                    <span>Confirm Heirloom Order • {formatINR(total)}</span>
                  </button>

                  <div className="flex items-center gap-2 justify-center text-[#7e756f] text-[11px] py-1">
                    <span>Instant White-Glove Dispatch Booking</span>
                    <span>•</span>
                    <span className="text-[#7d562d] font-bold">Zero Prepayment Penalty</span>
                  </div>
                </div>

                {/* Payment Gateway Options Selector */}
                <div className="space-y-3 border-t border-[#f5f3f0] pt-4">
                  <span className="text-[10px] text-[#7e756f] uppercase tracking-wider block text-center font-bold">
                    Seamless Indian &amp; Global Gateways
                  </span>

                  {/* Fast UPI & Wallet Row */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'GPay', sub: 'Instant QR' },
                      { name: 'PhonePe', sub: 'Scan & Pay' },
                      { name: 'Paytm', sub: 'UPI Direct' },
                      { name: 'CRED', sub: 'UPI Members' },
                    ].map((g) => (
                      <div
                        key={g.name}
                        onClick={() => handleInitiatePayment('upi')}
                        className="bg-[#f5f3f0] p-2 rounded-xl flex flex-col items-center justify-center hover:bg-[#eae8e5] cursor-pointer transition-colors text-center border border-[#e4e2df] group"
                      >
                        <span className="text-xs font-bold text-[#171411] group-hover:text-[#7d562d]">
                          {g.name}
                        </span>
                        <span className="text-[9px] text-[#7e756f]">{g.sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Types Radio List */}
                  <div className="space-y-2 pt-1">
                    {/* UPI Radio Option */}
                    <label
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        paymentMethod === 'upi'
                          ? 'bg-[#efeeeb] border-[#171411] shadow-sm'
                          : 'bg-[#f5f3f0] border-[#e4e2df]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="w-4 h-4 accent-[#171411]"
                        />
                        <span className="text-xs font-bold text-[#171411]">
                          UPI (Google Pay, PhonePe, Paytm, BHIM QR)
                        </span>
                      </div>
                      <span className="text-[10px] bg-[#10b981]/15 text-[#059669] px-2 py-0.5 rounded font-bold">
                        ⚡ Instant
                      </span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        paymentMethod === 'card'
                          ? 'bg-[#efeeeb] border-[#171411] shadow-sm'
                          : 'bg-[#f5f3f0] border-[#e4e2df]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-4 h-4 accent-[#171411]"
                        />
                        <span className="text-xs font-bold text-[#171411]">
                          Credit / Debit Cards (Amex, Visa, Mastercard)
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7d562d] font-bold">0% EMI Available</span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        paymentMethod === 'netbanking'
                          ? 'bg-[#efeeeb] border-[#171411] shadow-sm'
                          : 'bg-[#f5f3f0] border-[#e4e2df]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'netbanking'}
                          onChange={() => setPaymentMethod('netbanking')}
                          className="w-4 h-4 accent-[#171411]"
                        />
                        <span className="text-xs font-bold text-[#171411]">
                          Net Banking (HDFC, ICICI, SBI, Axis, Kotak)
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[#7e756f] text-[18px]">
                        account_balance
                      </span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        paymentMethod === 'cod'
                          ? 'bg-[#efeeeb] border-[#171411] shadow-sm'
                          : 'bg-[#f5f3f0] border-[#e4e2df]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 accent-[#171411]"
                        />
                        <span className="text-xs font-bold text-[#171411]">
                          Cash on Delivery (White-Glove Handover)
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7e756f]">OTP Verified</span>
                    </label>
                  </div>
                </div>

                {/* Trust Badges & Safety Grid */}
                <div className="border-t border-[#f5f3f0] pt-4 grid grid-cols-2 gap-3 text-[11px] text-[#4d4540]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7d562d] text-[18px]">eco</span>
                    <span>Saliva-Safe Plant Oils</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                      verified
                    </span>
                    <span>BIS &amp; EN-71 Tested</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7d562d] text-[18px]">lock</span>
                    <span>256-Bit Bank Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                      door_front
                    </span>
                    <span>Doorstep Unboxing Inspection</span>
                  </div>
                </div>
              </div>

              {/* Need Nursery Assistance Card */}
              <div className="bg-[#f5f3f0] p-4 rounded-2xl flex items-center justify-between border border-[#e4e2df]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#7d562d] text-[24px]">
                    support_agent
                  </span>
                  <div>
                    <span className="text-xs font-bold text-[#171411] block">
                      Need Nursery Guidance?
                    </span>
                    <span className="text-[11px] text-[#4d4540]">
                      Talk with our pediatric curator directly.
                    </span>
                  </div>
                </div>
                <a
                  href="https://wa.me/918000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#171411] hover:text-[#7d562d] underline decoration-[#7d562d] whitespace-nowrap"
                >
                  WhatsApp Concierge
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Full-Width Ambient Banner */}
      <section className="w-full bg-[#f5f3f0] py-16 border-t border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#7d562d]">
                <span className="material-symbols-outlined text-[24px]">air</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Climate-Controlled Packing
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#171411]">
                Humidity-Isolated Crating
              </h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Solid European beechwood is living matter. Every order is encased in breathable
                silica-sealed protective wraps to withstand monsoon transitions seamlessly across
                Indian climates.
              </p>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#7d562d]">
                <span className="material-symbols-outlined text-[24px]">draw</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Atelier Personalization
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#171411]">
                Individual Provenance Dossier
              </h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Each toy carries a discreetly etched serial number and an embossed certificate
                recording timber harvest location, artisan lathe craftsman, and child's dedicated
                dedication date.
              </p>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#7d562d]">
                <span className="material-symbols-outlined text-[24px]">published_with_changes</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Generational Durability
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#171411]">
                Heirloom Circular Buyback
              </h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                When your children outgrow their toys, return them to our Mumbai atelier for
                complimentary sanding, re-oiling, or an guaranteed 40% archival trade-in credit
                toward nursery furniture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Confirmation & Serialized Provenance Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#fbf9f6] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border border-[#cfc4bd] max-h-[90vh] overflow-y-auto">
            <div className="text-center pb-6 border-b border-[#e4e2df]">
              <div className="w-14 h-14 bg-[#55866b]/10 text-[#55866b] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c46927] font-semibold">
                Order Confirmed • Serialized Dossier Generated
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#171411] mt-1">
                Thank You, {completedOrder.fullName}
              </h3>
              <p className="text-xs text-[#7e756f] font-mono mt-1">
                Order Ref: {completedOrder.orderId} • Date: {completedOrder.date}
              </p>
            </div>

            {/* Serialized Heirloom Certificate Card */}
            <div className="my-6 p-6 bg-[#171411] text-white rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute top-2 right-2 opacity-10 font-serif text-8xl select-none">L</div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-serif font-bold text-lg tracking-wider">LUMEN ATELIER</span>
                <span className="text-[10px] font-mono text-[#d0c5b4] uppercase">
                  10-YEAR PROVENANCE GUARANTEE
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#a0988e] uppercase block">Assigned Serial No:</span>
                  <span className="text-white font-bold text-sm">#LMN-2025-BATCH01</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#a0988e] uppercase block">Total Pledged:</span>
                  <span className="text-white font-bold text-sm">{formatINR(completedOrder.total)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#a0988e] uppercase block">Engraving Inscription:</span>
                  <span className="text-[#ffca98] font-serif italic text-sm">
                    {completedOrder.monogramText ? `"${completedOrder.monogramText}"` : 'None requested'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#a0988e] uppercase block">Destination Nursery:</span>
                  <span className="text-white truncate block">{completedOrder.city}</span>
                </div>
              </div>
            </div>

            {/* Tracking Milestones */}
            <div className="p-4 bg-[#ffffff] rounded-xl border border-[#e4e2df] space-y-3 text-xs">
              <h4 className="font-serif font-bold text-sm text-[#171411]">
                White-Glove Delivery Timeline
              </h4>
              <div className="space-y-2 font-mono text-[11px] text-[#4a453e]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#55866b]"></span>
                  <span>1. Precision CNC &amp; Lathe Milling — Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e58a47] animate-pulse"></span>
                  <span>2. Hand Linseed Oil Immersion &amp; Laser Engraving — In Progress (1–2 Days)</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <span className="w-2 h-2 rounded-full bg-[#cfc4bd]"></span>
                  <span>3. Climate-Sealed Archival Crate Dispatch — Scheduled</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setIsDocModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#7d562d] hover:bg-[#171411] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                <span>View Tax Invoice &amp; Provenance Certificate</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl border border-[#cfc4bd] hover:bg-[#eae8e5] text-[#171411] text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Archival Receipt</span>
                </button>
                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    onNavigate('all-collections');
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#171411] hover:bg-[#322f2b] text-white text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue Exploring Archive →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC UPI QR CODE PAYMENT MODAL */}
      {showUpiQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-[#fbf9f6] rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-[#cfc4bd] text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUpiQrModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#10b981]/15 text-[#059669] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
                <span>Dynamic UPI Payment Gateway</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#171411]">
                Scan &amp; Pay with Any UPI App
              </h3>
              <p className="text-xs text-[#7e756f] mt-1">
                Google Pay, PhonePe, Paytm, BHIM, or Banking Apps
              </p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#171411] inline-block shadow-md relative mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  `upi://pay?pa=lumen.crafts@okhdfcbank&pn=LUMEN%20Heirloom%20Toys&am=${total}&cu=INR&tn=LUMEN%20Heirloom%20Order`
                )}&bgcolor=ffffff&color=171411&margin=1`}
                alt="Scan UPI QR Code"
                className="w-48 h-48 object-contain mx-auto"
              />
              <div className="mt-2 text-[11px] font-mono font-bold text-[#171411]">
                Amount: {formatINR(total)}
              </div>
            </div>

            {/* Timer and VPA */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#7d562d]">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>QR expires in {formatTimer(upiTimer)}</span>
              </div>

              {/* VPA Copy Pill */}
              <div className="flex items-center justify-between p-2.5 bg-[#f5f3f0] rounded-xl border border-[#e4e2df] text-xs">
                <div className="text-left">
                  <span className="text-[10px] text-[#7e756f] block uppercase font-bold">
                    Official VPA
                  </span>
                  <span className="font-mono font-bold text-[#171411]">
                    lumen.crafts@okhdfcbank
                  </span>
                </div>
                <button
                  onClick={handleCopyUpiId}
                  className="px-2.5 py-1 bg-white hover:bg-[#eae8e5] text-[#171411] rounded-lg text-xs font-semibold border border-[#cfc4bd] transition-colors cursor-pointer"
                >
                  {copiedUpi ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Simulation & Confirmation Trigger */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => handleFinalizeOrder('upi')}
                className="w-full py-3 bg-[#171411] hover:bg-[#7d562d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Simulate App Approval (Test Payment)</span>
              </button>
              <button
                onClick={() => setShowUpiQrModal(false)}
                className="w-full py-2 text-xs text-[#7e756f] hover:text-[#171411] transition-colors cursor-pointer"
              >
                Cancel and Choose Another Gateway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL (TAX INVOICE & PROVENANCE CERTIFICATE) */}
      <OrderDocumentsModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        order={completedOrder}
      />
    </div>
  );
};
