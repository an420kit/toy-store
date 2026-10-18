import React, { useState, useEffect } from 'react';
import { ScreenType, Product, CartItem, ToastMessage } from './types.ts';
import { PRODUCTS, CurrencyCode } from './data/products.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { CollectionsScreen } from './screens/CollectionsScreen.tsx';
import { ProductDetailScreen } from './screens/ProductDetailScreen.tsx';
import { CheckoutScreen } from './screens/CheckoutScreen.tsx';
import { FounderPortalScreen } from './screens/FounderPortalScreen.tsx';
import { MarketingKitScreen } from './screens/MarketingKitScreen.tsx';
import { GiftRegistryHubScreen } from './screens/GiftRegistryHubScreen.tsx';
import { BrandPhilosophyScreen } from './screens/BrandPhilosophyScreen.tsx';
import { AiGiftAdvisorModal } from './components/AiGiftAdvisorModal.tsx';
import {
  QuickViewModal,
  SearchModal,
  WishlistDrawer,
  CustomerAccountModal,
  Interactive360Modal,
  SpecSheetPdfModal,
  RawWoodBOMModal,
  BespokeConsultationModal,
} from './components/Modals.tsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeProductId, setActiveProductId] = useState<string>('minimal-ride-on');
  const [initialCategory, setInitialCategory] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Start with a genuinely empty bag; only restore items saved by this WOODKIND app.
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('woodkind_cart_v1');
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item?.product?.id && PRODUCTS.some((product) => product.id === item.product.id))
        .map((item) => ({ ...item, product: PRODUCTS.find((product) => product.id === item.product.id)! }));
    } catch {
      return [];
    }
  });

  // Restore only real products from the WOODKIND wishlist; no sample items.
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('woodkind_wishlist_v1');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === 'string' && PRODUCTS.some((product) => product.id === id))
        : [];
    } catch {
      return [];
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('woodkind_cart_v1', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('woodkind_wishlist_v1', JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [is360Open, setIs360Open] = useState<boolean>(false);
  const [isSpecPdfOpen, setIsSpecPdfOpen] = useState<boolean>(false);
  const [isBOMOpen, setIsBOMOpen] = useState<boolean>(false);
  const [isBespokeOpen, setIsBespokeOpen] = useState<boolean>(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);
  const [modalProductName, setModalProductName] = useState<string>('The Minimal Ride-On');

  // Global Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, subtitle: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, subtitle, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Check for shared gift registry in URL on load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const registryCode = params.get('registry');
      const itemsParam = params.get('items');
      if (registryCode) {
        if (itemsParam) {
          const ids = itemsParam.split(',').filter(Boolean);
          if (ids.length > 0) {
            setWishlistIds(ids);
          }
        }
        setIsWishlistOpen(true);
        showToast(
          'Shared Gift Registry Loaded',
          `Viewing Registry #${registryCode}. You can browse and gift pieces.`,
          'info'
        );
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation handler
  const handleNavigate = (screen: ScreenType, productId?: string) => {
    if (productId) {
      setActiveProductId(productId);
    }

    // Category mapping for collection filters
    if (screen === 'wheels-and-motion') {
      setInitialCategory('wheels');
      setCurrentScreen('all-collections');
    } else if (screen === 'rocking-and-balance') {
      setInitialCategory('rocking');
      setCurrentScreen('all-collections');
    } else if (screen === 'climbing-and-play-gyms') {
      setInitialCategory('climbing');
      setCurrentScreen('all-collections');
    } else if (screen === 'learning-and-montessori') {
      setInitialCategory('learning');
      setCurrentScreen('all-collections');
    } else if (screen === 'play-furniture') {
      setInitialCategory('furniture');
      setCurrentScreen('all-collections');
    } else if (screen === 'all-collections') {
      setInitialCategory(undefined);
      setCurrentScreen('all-collections');
    } else {
      setCurrentScreen(screen);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart handler
  const handleAddToCart = (product: Product, quantity = 1, colorway?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColorway: colorway || 'Natural Beechwood',
        },
      ];
    });

    showToast(
      'Acquired to Curated Bag',
      `${product.name} has been placed in your heirloom order.`
    );
  };

  // Instant buy (Add & go to checkout)
  const handleInstantBuy = (product: Product, quantity = 1, colorway?: string) => {
    handleAddToCart(product, quantity, colorway);
    handleNavigate('cart');
  };

  // Update quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove from cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed from Bag', 'Item removed from your heirloom order.');
  };

  // Monogram update in cart
  const handleUpdateMonogram = (productId: string, text: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, monogram: text } : item
      )
    );
  };

  // Leather tag toggle in cart
  const handleToggleLeatherTag = (productId: string, enabled: boolean) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, includeLeatherTag: enabled } : item
      )
    );
  };

  // Add companion upsell
  const handleAddCompanion = (product: Product) => {
    handleAddToCart(product, 1);
  };

  // Checkout is a frontend preview until a verified payment/order backend is connected.
  const handleOrderSuccess = (_orderData: any) => {
    showToast(
      'Checkout preview only',
      'No live order or payment was placed. WOODKIND checkout integration is not active yet.',
      'info'
    );
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist', `${product?.name || 'Object'} removed.`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Nursery Wishlist', `${product?.name || 'Object'} saved.`);
        return [...prev, productId];
      }
    });
  };

  // Total cart item count
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#171411] font-sans antialiased flex flex-col selection:bg-[#e58a47] selection:text-white">
      {/* Global Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        cartCount={cartItemCount}
        wishlistCount={wishlistIds.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Screen Router */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onQuickView={(product) => setQuickViewProduct(product)}
            onOpenBespokeModal={() => setIsBespokeOpen(true)}
          />
        )}

        {currentScreen === 'all-collections' && (
          <CollectionsScreen
            initialCategory={initialCategory}
            onNavigate={handleNavigate}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onQuickView={(product) => setQuickViewProduct(product)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentScreen === 'product-detail' && (
          <ProductDetailScreen
            productId={activeProductId}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onInstantBuy={handleInstantBuy}
            onOpen360={(name) => {
              setModalProductName(name);
              setIs360Open(true);
            }}
            onOpenSpecPdf={() => setIsSpecPdfOpen(true)}
            onOpenBOM={() => setIsBOMOpen(true)}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(activeProductId)}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'cart' && (
          <CheckoutScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onUpdateMonogram={handleUpdateMonogram}
            onToggleLeatherTag={handleToggleLeatherTag}
            onAddCompanion={handleAddCompanion}
            onNavigate={handleNavigate}
            onOrderSuccess={handleOrderSuccess}
            onSaveToWishlist={handleToggleWishlist}
          />
        )}

        {currentScreen === 'founder-portal' && (
          <FounderPortalScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'marketing-kit' && (
          <MarketingKitScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'gift-registry' && (
          <GiftRegistryHubScreen
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'brand-philosophy' && (
          <BrandPhilosophyScreen
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} onShowToast={showToast} />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(product) => handleAddToCart(product, 1)}
        onViewDetails={(id) => {
          setQuickViewProduct(null);
          handleNavigate('product-detail', id);
        }}
      />

      {/* 360 Degree Viewer Modal */}
      <Interactive360Modal
        isOpen={is360Open}
        onClose={() => setIs360Open(false)}
        productName={modalProductName}
      />

      {/* Technical Spec Sheet PDF Modal */}
      <SpecSheetPdfModal
        isOpen={isSpecPdfOpen}
        onClose={() => setIsSpecPdfOpen(false)}
      />

      {/* Raw Wood Provenance & BOM Modal */}
      <RawWoodBOMModal
        isOpen={isBOMOpen}
        onClose={() => setIsBOMOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(id) => {
          setIsSearchOpen(false);
          handleNavigate('product-detail', id);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        onRemove={(id) => handleToggleWishlist(id)}
        onAddToCart={(product) => handleAddToCart(product, 1)}
        onSelectProduct={(id) => {
          setIsWishlistOpen(false);
          handleNavigate('product-detail', id);
        }}
        onShowToast={showToast}
      />

      {/* Customer Account Modal */}
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Bespoke Architectural Consultation Modal */}
      <BespokeConsultationModal
        isOpen={isBespokeOpen}
        onClose={() => setIsBespokeOpen(false)}
        onSubmit={(data) => {
          showToast(
            'Consultation Booked',
            `Our lead architectural atelier will connect with you at ${data.email} for your ${data.nurseryStyle} layout.`
          );
        }}
      />

      {/* LUMEN AI Milestone & Keepsake Concierge Modal */}
      <AiGiftAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        onAddToCart={(product) => handleAddToCart(product, 1)}
        onViewProduct={(id) => handleNavigate('product-detail', id)}
        onApplyEngraving={(text) => {
          showToast('Engraving Applied', `Dedicated monogram "${text}" registered for your unboxing dossier.`);
        }}
      />

      {/* Floating AI Advisor Trigger Pill */}
      <button
        onClick={() => setIsAiAdvisorOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-[#171411] hover:bg-[#7d562d] text-white px-4 py-2.5 rounded-full shadow-2xl border border-[#ffca98]/40 flex items-center gap-2 group transition-all transform hover:scale-105 cursor-pointer"
        title="Ask LUMEN AI Toy Advisor"
      >
        <span className="material-symbols-outlined text-[#ffca98] text-[20px] animate-pulse">
          auto_awesome
        </span>
        <span className="text-xs font-serif font-bold tracking-wide">
          ✨ Ask AI Toy Advisor
        </span>
      </button>

      {/* Toast Notifications Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#171411] text-[#ffffff] px-4 py-3 rounded-xl shadow-2xl border border-[#3b3631] flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div>
              <p className="font-serif font-bold text-xs tracking-wide">{toast.title}</p>
              <p className="text-[11px] text-[#cfc4bd] mt-0.5 leading-tight">{toast.subtitle}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#cfc4bd] hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
