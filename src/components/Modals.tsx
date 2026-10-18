import React, { useState } from 'react';
import { Product, ScreenType } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

// Quick View Modal
export const QuickViewModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}> = ({ product, onClose, onAddToCart, onViewDetails }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#fbf9f6] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border border-[#cfc4bd] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#efeeeb] shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d562d]">
                {product.categoryLabel} • {product.sku}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#171411] mt-1">
                {product.name}
              </h3>
              <p className="text-[13px] text-[#4d4540] mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="p-3 bg-[#f5f3f0] rounded-lg space-y-1 text-[12px] text-[#4d4540]">
              <div className="flex justify-between">
                <span>Timber:</span>
                <span className="font-semibold text-[#171411]">{product.timber}</span>
              </div>
              <div className="flex justify-between">
                <span>Recommended Age:</span>
                <span className="font-semibold text-[#171411]">{product.age}</span>
              </div>
              {product.specifications?.testedCapacity && (
                <div className="flex justify-between">
                  <span>Certification:</span>
                  <span className="font-semibold text-[#171411]">
                    {product.specifications.testedCapacity}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-[#e4e2df]">
              <div>
                <span className="font-serif text-2xl font-bold text-[#171411]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-[#7e756f] line-through ml-2">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#7d562d] font-semibold bg-[#ffdcbd] px-2 py-0.5 rounded">
                Free Dispatch
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 bg-[#171411] hover:bg-[#7d562d] text-white py-3 rounded-lg text-[13px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>Add to Bag</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onViewDetails(product.id);
                }}
                className="px-4 py-3 bg-[#efeeeb] hover:bg-[#eae8e5] text-[#171411] rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
                title="Full Dossier"
              >
                View Dossier →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 360 Degree View Interactive Modal
export const Interactive360Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}> = ({ isOpen, onClose, productName }) => {
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/70 backdrop-blur-md">
      <div className="bg-[#fbf9f6] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-[#cfc4bd] text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffdcbd] text-[#2c1600] rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[14px]">360</span>
          <span>Virtual Joinery Inspection</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#171411]">{productName}</h3>
        <p className="text-[13px] text-[#4d4540] mt-1">
          Drag slider or use arrow controls to examine 360° beechwood grain and hidden mortise joinery.
        </p>

        {/* 360 preview container */}
        <div className="my-6 relative aspect-square max-w-[320px] mx-auto rounded-2xl bg-gradient-to-b from-[#f5f3f0] to-[#eae8e5] p-4 flex items-center justify-center shadow-inner overflow-hidden border border-[#cfc4bd]">
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-100"
            style={{
              transform: `rotate(${rotation}deg) scale(${1 + Math.sin((rotation * Math.PI) / 180) * 0.05})`,
            }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZAYhi-vHQlYOxTANjZUZXUhFSORYUxk8BWuVylgR5LtV8qKyzhWcsbbA46TER3u44xjC7napnwp1ltDqZuQXhZhztD9uX0kKcuo6V3-v6N1YZdtO7i00lajswcWXcbf4YmKkge7E_MDesy34R6INjdUvaMaVogN2ug-7Hhp3BwGcomMa-KxTlGYCcn54k2LIUMh1xhs9pPWWFXNYxK9biCSYhWTKIl3Ghj94_o_tCWFe0IokYIQ-T4A"
              alt="360 view"
              className="max-h-full max-w-full object-contain filter drop-shadow-xl"
            />
          </div>
          <div className="absolute bottom-3 left-3 bg-[#fbf9f6]/90 px-2.5 py-1 rounded text-[11px] font-mono text-[#171411] shadow-sm">
            Angle: {Math.round(rotation % 360)}°
          </div>
        </div>

        {/* Slider control */}
        <div className="space-y-3 max-w-sm mx-auto">
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value, 10))}
            className="w-full accent-[#7d562d] cursor-pointer"
          />
          <div className="flex justify-between items-center text-[12px] text-[#7e756f]">
            <button
              onClick={() => setRotation((prev) => (prev - 45 + 360) % 360)}
              className="px-3 py-1 bg-[#efeeeb] rounded hover:bg-[#eae8e5] text-[#171411] font-semibold"
            >
              ↺ Rotate -45°
            </button>
            <button
              onClick={() => setRotation(0)}
              className="px-3 py-1 bg-[#efeeeb] rounded hover:bg-[#eae8e5] text-[#171411]"
            >
              Reset Front
            </button>
            <button
              onClick={() => setRotation((prev) => (prev + 45) % 360)}
              className="px-3 py-1 bg-[#efeeeb] rounded hover:bg-[#eae8e5] text-[#171411] font-semibold"
            >
              ↻ Rotate +45°
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Spec Sheet PDF Preview / Export Modal
export const SpecSheetPdfModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/70 backdrop-blur-md">
      <div className="bg-[#fbf9f6] rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative border border-[#cfc4bd] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="border-b border-[#e4e2df] pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-[#171411]">WOODKIND</span>
              <span className="text-[10px] bg-[#ffca98] text-[#7a532a] font-bold px-2 py-0.5 rounded uppercase">
                Confidential Engineering Doc
              </span>
            </div>
            <h3 className="font-serif text-lg text-[#171411] mt-1">
              Pilot Production Specification Sheets (SKU 01 - 04)
            </h3>
            <p className="text-[12px] text-[#7e756f]">
              Draft product brief · planning only · not production approved
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#efeeeb] hover:bg-[#eae8e5] text-[#171411] px-4 py-2 rounded text-[12px] font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Spec</span>
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="flex items-center gap-1.5 bg-[#171411] hover:bg-[#7d562d] text-white px-4 py-2 rounded text-[12px] font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Spec Sheet Document Content */}
        <div className="space-y-6 text-[#1b1c1a] font-sans text-[13px]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#f5f3f0] rounded-xl border border-[#e4e2df]">
            <div>
              <span className="text-[11px] text-[#7e756f] uppercase block">Timber Density</span>
              <strong className="text-[#171411]">Supplier data pending</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#7e756f] uppercase block">Moisture Tolerance</span>
              <strong className="text-[#171411]">Moisture target pending</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#7e756f] uppercase block">Heavy Metals (EN71-3)</span>
              <strong className="text-[#171411]">Testing pending</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#7e756f] uppercase block">Saliva Seal</span>
              <strong className="text-[#171411]">Finish test pending</strong>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#171411]">
              Hero SKU Material &amp; CAD Tolerances
            </h4>
            <div className="border border-[#e4e2df] rounded-xl overflow-hidden">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#efeeeb] text-[#4d4540] uppercase font-semibold">
                  <tr>
                    <th className="p-3">SKU &amp; Prototype</th>
                    <th className="p-3">Dimensions</th>
                    <th className="p-3">Primary Joint</th>
                    <th className="p-3">Pilot Price Target</th>
                    <th className="p-3">Safety Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e2df]">
                  <tr className="bg-white">
                    <td className="p-3 font-medium">WK-SS-001: Stacking Stones</td>
                    <td className="p-3">Final dimensions pending</td>
                    <td className="p-3">Design review pending</td>
                    <td className="p-3 font-semibold">₹1,299 target</td>
                    <td className="p-3 text-emerald-700 font-semibold">Small-parts review pending</td>
                  </tr>
                  <tr className="bg-[#fbf9f6]">
                    <td className="p-3 font-medium">WK-WG-001: Wooden Pull Wagon</td>
                    <td className="p-3">Final dimensions pending</td>
                    <td className="p-3">Wheel and pull-cord design pending</td>
                    <td className="p-3 font-semibold">₹3,999 target</td>
                    <td className="p-3 text-emerald-700 font-semibold">Wheel retention testing pending</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-medium">WK-RO-001: Wooden Ride-On</td>
                    <td className="p-3">Final dimensions pending</td>
                    <td className="p-3">Final construction pending</td>
                    <td className="p-3 font-semibold">₹4,499 target</td>
                    <td className="p-3 text-emerald-700 font-semibold">Stability review pending</td>
                  </tr>
                  <tr className="bg-[#fbf9f6]">
                    <td className="p-3 font-medium">WK-PT-001: Pikler Triangle + Ramp</td>
                    <td className="p-3">Final dimensions pending</td>
                    <td className="p-3">Locking hardware pending</td>
                    <td className="p-3 font-semibold">₹11,999 target</td>
                    <td className="p-3 text-emerald-700 font-semibold">Structural testing pending</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-[#ffdcbd]/30 rounded-xl text-[12px] text-[#7a532a] border border-[#ffca98]">
            <strong>Compliance note:</strong> No product-specific safety certification or test result is confirmed in this brief. Confirm applicable Indian requirements and a qualified test plan before offering any product for sale.
          </div>
        </div>
      </div>
    </div>
  );
};

// Raw Wood BOM Invoices Modal
export const RawWoodBOMModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/70 backdrop-blur-md">
      <div className="bg-[#fbf9f6] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border border-[#cfc4bd]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-2 text-[#7d562d] font-bold text-[11px] uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px]">forest</span>
          <span>Sourcing documentation checklist</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#171411]">
          Raw Wood BOM &amp; Forest Sourcing Invoices
        </h3>
        <p className="text-[13px] text-[#4d4540] mt-1">
          Supplier names, invoices, wood species and finish datasheets are pending collection.
        </p>

        <div className="mt-6 space-y-4 text-[13px]">
          <div className="p-4 bg-[#f5f3f0] rounded-xl border border-[#e4e2df] space-y-2">
            <div className="flex justify-between font-semibold text-[#171411]">
              <span>Wood species / supplier: pending</span>
              <span className="text-emerald-700">Documentation pending</span>
            </div>
            <p className="text-[#4d4540] text-[12px]">
              Confirm wood species, grade, moisture content, supplier invoice, and chain-of-custody documents if a sourcing certification is claimed.
            </p>
          </div>

          <div className="p-4 bg-[#f5f3f0] rounded-xl border border-[#e4e2df] space-y-2">
            <div className="flex justify-between font-semibold text-[#171411]">
              <span>Finish material — supplier to confirm</span>
              <span className="text-emerald-700">Safety data pending</span>
            </div>
            <p className="text-[#4d4540] text-[12px]">
              Request a complete finish specification and toy-specific suitability evidence. Do not publish safety, food-contact or chemical-free claims until independently substantiated.
            </p>
          </div>

          <div className="p-4 bg-[#f5f3f0] rounded-xl border border-[#e4e2df] space-y-2">
            <div className="flex justify-between font-semibold text-[#171411]">
              <span>Packaging direction: kraft carton</span>
              <span className="text-emerald-700">Recyclability to be reviewed</span>
            </div>
            <p className="text-[#4d4540] text-[12px]">
              Confirm packaging supplier, shipping protection, strength, price and disposal instructions before selecting the final format.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#171411] text-white hover:bg-[#7d562d] px-6 py-2.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Close Provenance Ledger
          </button>
        </div>
      </div>
    </div>
  );
};

// Search Modal
export const SearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
}> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
      p.timber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-[#171411]/70 backdrop-blur-md">
      <div className="bg-[#fbf9f6] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border border-[#cfc4bd]">
        <div className="flex items-center gap-3 border-b border-[#e4e2df] pb-4">
          <span className="material-symbols-outlined text-[#7d562d] text-2xl">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 50 heirloom objects (e.g. ride-on, rocker, triangle, kitchen)..."
            className="w-full bg-transparent text-[#171411] text-lg font-serif placeholder:font-sans placeholder:text-[#7e756f] focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-[#7e756f] text-sm">
              No matching heirloom sculptures found for "{query}".
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item.id);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#efeeeb] transition-colors cursor-pointer group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg bg-[#eae8e5]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#7d562d]">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[10px] text-[#7e756f]">• {item.age}</span>
                  </div>
                  <h4 className="font-serif font-bold text-[#171411] group-hover:text-[#7d562d] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[12px] text-[#4d4540] line-clamp-1">{item.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-[#171411]">
                    {formatINR(item.price)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Wishlist Drawer with Gift Registry Support
export const WishlistDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onRemove: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (id: string) => void;
  onShowToast?: (title: string, subtitle: string) => void;
}> = ({ isOpen, onClose, wishlistIds, onRemove, onAddToCart, onSelectProduct, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'registry'>('items');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Registry Form State
  const [registryTitle, setRegistryTitle] = useState("My WOODKIND Gift Registry");
  const [childName, setChildName] = useState('Leo');
  const [occasion, setOccasion] = useState('1st Birthday Celebration');
  const [eventDate, setEventDate] = useState('2024-11-20');
  const [noteToFamily, setNoteToFamily] = useState(
    "I'm creating a gift list from the WOODKIND pilot catalogue. Product specifications and availability are still being confirmed."
  );

  if (!isOpen) return null;

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const totalRegistryValue = wishlistedProducts.reduce((sum, p) => sum + p.price, 0);

  // Generate encoded URL string of current wishlist items
  const generateEncodedRegistryUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://toys.ankitalgo.store';
    const encodedItems = encodeURIComponent(wishlistIds.join(','));
    const registryCode = `REG-${Math.abs(
      wishlistIds.join('').split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000)
    )}`;
    const encodedRegistryId = encodeURIComponent(registryCode);
    const encodedTitle = encodeURIComponent(registryTitle.trim() || "Baby My WOODKIND Gift Registry");
    const encodedChild = encodeURIComponent(childName.trim() || "Leo");
    const encodedOccasion = encodeURIComponent(occasion);

    return `${origin}?registry=${encodedRegistryId}&title=${encodedTitle}&child=${encodedChild}&occasion=${encodedOccasion}&items=${encodedItems}`;
  };

  const [generatedEncodedUrl, setGeneratedEncodedUrl] = useState<string>('');

  const handleCreateGiftRegistry = () => {
    if (wishlistIds.length === 0) return;
    const encodedUrl = generateEncodedRegistryUrl();
    setGeneratedEncodedUrl(encodedUrl);
    navigator.clipboard.writeText(encodedUrl);
    setCopiedLink(true);

    if (onShowToast) {
      onShowToast(
        'Gift Registry Link Generated & Copied',
        `Encoded URL with ${wishlistIds.length} saved heirlooms copied to clipboard! Ready to share.`
      );
    }
    setTimeout(() => setCopiedLink(false), 3500);
  };

  const handleCopyLink = () => {
    const urlToCopy = generatedEncodedUrl || generateEncodedRegistryUrl();
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    if (onShowToast) {
      onShowToast(
        'Registry Link Copied',
        'Encoded shareable link copied to clipboard. Ready to send to family and friends!'
      );
    }
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const activeUrl = generatedEncodedUrl || generateEncodedRegistryUrl();
    const text = encodeURIComponent(
      `Hello! We've created a WOODKIND Heirloom Gift Registry for ${childName}'s ${occasion}:\n\n"${registryTitle}"\n\nExplore our curated beechwood nursery wishlist here: ${activeUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const activeUrl = generatedEncodedUrl || generateEncodedRegistryUrl();
    const subject = encodeURIComponent(`WOODKIND Heirloom Gift Registry for ${childName}`);
    const body = encodeURIComponent(
      `Dear family and friends,\n\nWe have set up an Heirloom Gift Registry for ${childName}'s ${occasion} with WOODKIND Nordic Wooden Toys.\n\n${noteToFamily}\n\nYou can browse our saved pieces and gift directly here:\n${activeUrl}\n\nWarmly,\n${registryTitle}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#171411]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fbf9f6] w-full max-w-lg h-full p-6 shadow-2xl flex flex-col border-l border-[#cfc4bd]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e2df] pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7d562d]">favorite</span>
            <h3 className="font-serif text-xl font-bold text-[#171411]">
              Nursery Collection &amp; Registry
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors"
            aria-label="Close Wishlist"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#e4e2df] mt-3">
          <button
            onClick={() => {
              setActiveTab('items');
              setIsPreviewMode(false);
            }}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-wider text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'items' && !isPreviewMode
                ? 'border-[#171411] text-[#171411] font-bold'
                : 'border-transparent text-[#7a746e] hover:text-[#171411]'
            }`}
          >
            <span>Saved Pieces ({wishlistedProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-wider text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'registry'
                ? 'border-[#c46927] text-[#c46927] font-bold'
                : 'border-transparent text-[#7a746e] hover:text-[#c46927]'
            }`}
          >
            <span>🎁 Gift Registry</span>
            {wishlistedProducts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#c46927]"></span>
            )}
          </button>
        </div>

        {/* Tab 1: Saved Items */}
        {activeTab === 'items' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {wishlistedProducts.length > 0 && (
              <div className="my-3 p-3.5 bg-gradient-to-r from-[#ffdcbd]/50 to-[#f5e9dc]/60 rounded-xl border border-[#ffca98] flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-[#7a532a] text-[11px] font-mono font-bold uppercase tracking-wider">
                    <span>🎁 Heirloom Gift Registry</span>
                    <span className="bg-[#c46927] text-white text-[9px] px-1.5 py-0.2 rounded font-sans">
                      New
                    </span>
                  </div>
                  <p className="text-[12px] text-[#4d4540] mt-0.5">
                    Share your wishlist with loved ones for baby showers &amp; birthdays.
                  </p>
                </div>
                <button
                  onClick={handleCreateGiftRegistry}
                  className="px-3 py-1.5 rounded-lg bg-[#171411] hover:bg-[#7d562d] text-white text-[11px] font-mono font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedLink ? 'done' : 'share'}
                  </span>
                  <span>{copiedLink ? '✓ Copied!' : 'Create Registry'}</span>
                </button>
              </div>
            )}

            {/* Generated Encoded URL Banner if created */}
            {generatedEncodedUrl && (
              <div className="mb-3 p-3 bg-[#eef7f2] rounded-xl border border-[#c3e3d2] animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-[#2d6a4f] font-mono font-medium mb-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Encoded Registry URL Ready!</span>
                  </span>
                  <span className="text-[10px] text-[#55866b]">Copied to clipboard</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#c3e3d2] text-[11px] font-mono">
                  <span className="truncate text-[#4a453e] flex-1">{generatedEncodedUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 bg-[#2d6a4f] text-white rounded text-[10px] font-medium whitespace-nowrap hover:bg-[#23533e]"
                  >
                    {copiedLink ? '✓ Copied' : 'Copy Again'}
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto py-2 space-y-3">
              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-16 text-[#7e756f] space-y-3">
                  <span className="material-symbols-outlined text-4xl opacity-40">favorite_border</span>
                  <p className="text-sm font-serif">Your nursery wishlist is currently empty.</p>
                  <p className="text-xs text-[#4d4540] max-w-xs mx-auto">
                    Save pieces while browsing the master catalog to curate your baby registry or pass down to architects.
                  </p>
                </div>
              ) : (
                wishlistedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3.5 p-3 bg-white rounded-xl border border-[#e4e2df] shadow-xs hover:border-[#cfc4bd] transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-[#efeeeb] cursor-pointer"
                      onClick={() => {
                        onSelectProduct(product.id);
                        onClose();
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#7d562d] block truncate">
                        {product.categoryLabel}
                      </span>
                      <h4
                        className="font-serif font-bold text-sm text-[#171411] cursor-pointer hover:text-[#7d562d] transition-colors truncate"
                        onClick={() => {
                          onSelectProduct(product.id);
                          onClose();
                        }}
                      >
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-[#171411]">
                          {formatINR(product.price)}
                        </span>
                        <span className="text-[10px] font-mono text-[#55866b]">Material details pending</span>
                      </div>
                      <div className="flex gap-3 mt-1.5">
                        <button
                          onClick={() => onAddToCart(product)}
                          className="text-[11px] font-bold text-[#7d562d] uppercase tracking-wider hover:underline"
                        >
                          + Add to Bag
                        </button>
                        <button
                          onClick={() => onRemove(product.id)}
                          className="text-[11px] text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {wishlistedProducts.length > 0 && (
              <div className="pt-3 border-t border-[#e4e2df] space-y-2">
                <button
                  onClick={() => {
                    wishlistedProducts.forEach((p) => onAddToCart(p));
                    onClose();
                  }}
                  className="w-full bg-[#171411] hover:bg-[#7d562d] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                  <span>Add All to Curated Bag ({formatINR(totalRegistryValue)})</span>
                </button>

                {/* Primary Create Gift Registry Button */}
                <button
                  onClick={handleCreateGiftRegistry}
                  className="w-full bg-[#f5f2ed] hover:bg-[#eae6de] text-[#171411] py-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 border border-[#cfc4bd] shadow-xs active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#c46927]">
                    {copiedLink ? 'check_circle' : 'card_giftcard'}
                  </span>
                  <span>
                    {copiedLink
                      ? '✓ Encoded Registry Link Copied to Clipboard!'
                      : 'Create Gift Registry'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Gift Registry Generator & Dossier */}
        {activeTab === 'registry' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 text-[#7e756f] space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#c46927]">card_giftcard</span>
                <p className="text-sm font-serif font-bold text-[#171411]">
                  Add Saved Pieces to Create Your Registry
                </p>
                <p className="text-xs text-[#4d4540] max-w-xs mx-auto">
                  Heart items across the catalog first. Once saved, click 'Create Gift Registry' to generate a shareable encoded URL string for family and friends.
                </p>
                <button
                  onClick={() => setActiveTab('items')}
                  className="mt-2 px-4 py-2 bg-[#171411] text-white rounded-lg text-xs font-mono font-medium"
                >
                  Return to Saved Pieces
                </button>
              </div>
            ) : !isPreviewMode ? (
              /* Configuration & Share Mode */
              <div className="space-y-4">
                {/* Registry Card Header */}
                <div className="p-4 bg-[#ffffff] rounded-xl border border-[#e4e2df] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#c46927] font-semibold">
                      Heirloom Registry ID: LMN-REG-8492
                    </span>
                    <span className="text-[10px] bg-[#55866b]/10 text-[#55866b] font-mono px-2 py-0.5 rounded font-semibold">
                      Active
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#171411] mt-1">
                    {registryTitle || "Baby My WOODKIND Gift Registry"}
                  </h4>
                  <p className="text-xs text-[#7a746e] mt-0.5">
                    {wishlistedProducts.length} heirlooms selected • Aggregate Value: {formatINR(totalRegistryValue)}
                  </p>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={handleCreateGiftRegistry}
                  className="w-full py-3 px-4 rounded-xl bg-[#171411] hover:bg-[#322f2b] text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#ffca98]">
                    {copiedLink ? 'check_circle' : 'card_giftcard'}
                  </span>
                  <span>
                    {copiedLink
                      ? '✓ Encoded Registry Link Copied!'
                      : 'Create Gift Registry'}
                  </span>
                </button>

                {/* Registry Setup Form */}
                <div className="space-y-3 bg-[#ffffff] p-4 rounded-xl border border-[#e4e2df] text-xs">
                  <h5 className="font-mono text-[11px] uppercase tracking-wider text-[#7a746e] font-semibold">
                    1. Customize Registry Details
                  </h5>

                  <div>
                    <label className="block text-[11px] font-medium text-[#4a453e] mb-1">
                      Registry Title
                    </label>
                    <input
                      type="text"
                      value={registryTitle}
                      onChange={(e) => setRegistryTitle(e.target.value)}
                      placeholder="e.g. Baby My WOODKIND Gift Registry"
                      className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411] focus:outline-none focus:border-[#171411]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#4a453e] mb-1">
                        Child / Beneficiary Name
                      </label>
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="e.g. Leo"
                        className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411] focus:outline-none focus:border-[#171411]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#4a453e] mb-1">
                        Occasion
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411] focus:outline-none focus:border-[#171411]"
                      >
                        <option value="1st Birthday Celebration">1st Birthday Celebration</option>
                        <option value="Luxury Baby Shower">Luxury Baby Shower</option>
                        <option value="Naming Ceremony">Naming Ceremony / Welcome</option>
                        <option value="Holiday & Milestone">Holiday &amp; Milestones</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#4a453e] mb-1">
                      Personal Message for Family &amp; Friends
                    </label>
                    <textarea
                      rows={2}
                      value={noteToFamily}
                      onChange={(e) => setNoteToFamily(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-[#fbf9f6] text-[#171411] text-xs focus:outline-none focus:border-[#171411]"
                    />
                  </div>
                </div>

                {/* Shareable Link Box */}
                <div className="p-4 bg-[#f5f2ed] rounded-xl border border-[#e4e2df] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#171411] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#c46927]">link</span>
                      <span>2. Encoded Shareable URL</span>
                    </span>
                    <span className="text-[10px] text-[#55866b] font-medium">Auto-encodes saved items</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#ffffff] p-2 rounded-lg border border-[#cfc4bd]">
                    <input
                      type="text"
                      readOnly
                      value={generatedEncodedUrl || generateEncodedRegistryUrl()}
                      className="w-full bg-transparent text-[11px] font-mono text-[#4a453e] focus:outline-none truncate"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-3 py-1.5 rounded text-[11px] font-mono font-medium whitespace-nowrap transition-all ${
                        copiedLink
                          ? 'bg-[#55866b] text-white'
                          : 'bg-[#171411] hover:bg-[#322f2b] text-white'
                      }`}
                    >
                      {copiedLink ? '✓ Copied!' : 'Copy Link'}
                    </button>
                  </div>

                  {/* Quick Share Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleShareWhatsApp}
                      className="py-2 px-3 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#25D366]/20"
                    >
                      <span>💬 Share WhatsApp</span>
                    </button>
                    <button
                      onClick={handleShareEmail}
                      className="py-2 px-3 rounded-lg bg-[#ffffff] hover:bg-[#fbf9f6] text-[#171411] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#cfc4bd]"
                    >
                      <span>✉️ Email Registry</span>
                    </button>
                  </div>
                </div>

                {/* Guest Preview Trigger */}
                <button
                  onClick={() => setIsPreviewMode(true)}
                  className="w-full py-2.5 rounded-lg border border-[#171411] text-[#171411] hover:bg-[#171411] hover:text-white transition-colors text-xs font-mono font-semibold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>Preview Guest View Experience →</span>
                </button>
              </div>
            ) : (
              /* Live Guest View Experience */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#e4e2df]">
                  <span className="text-[11px] font-mono text-[#c46927] font-semibold uppercase">
                    👁 Guest View Simulation
                  </span>
                  <button
                    onClick={() => setIsPreviewMode(false)}
                    className="text-xs font-mono text-[#171411] hover:underline flex items-center gap-1"
                  >
                    ← Edit Details
                  </button>
                </div>

                {/* Luxury Registry Header Card */}
                <div className="p-5 bg-gradient-to-b from-[#171411] to-[#26221d] rounded-2xl text-white text-center shadow-lg relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-10 font-serif text-7xl select-none">
                    L
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-[#d0c5b4] uppercase">
                    WOODKIND HEIRLOOM GIFT REGISTRY
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-1 text-white">
                    {registryTitle}
                  </h3>
                  <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#e58a47]/20 border border-[#e58a47]/40 text-[#ffca98] text-[11px] font-mono">
                    Celebrating {childName} • {occasion}
                  </div>
                  <p className="text-xs text-[#cfc4bd] mt-3 italic leading-relaxed max-w-sm mx-auto">
                    "{noteToFamily}"
                  </p>
                </div>

                {/* Items in Registry */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-mono text-[#7a746e]">
                    <span>HEIRLOOM PIECES SELECTED ({wishlistedProducts.length})</span>
                    <span>No contributions recorded</span>
                  </div>

                  {wishlistedProducts.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white rounded-xl border border-[#e4e2df] flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg bg-[#efeeeb]"
                        />
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#7d562d]">
                            {item.sku}
                          </span>
                          <h5 className="font-serif font-bold text-sm text-[#171411]">
                            {item.name}
                          </h5>
                          <span className="text-xs font-semibold text-[#171411]">
                            {formatINR(item.price)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onAddToCart(item);
                          if (onShowToast) {
                            onShowToast(
                              `Gift Added: ${item.name}`,
                              `Reserved for ${childName}'s registry. Ready for checkout.`
                            );
                          }
                          onClose();
                        }}
                        className="px-3 py-2 bg-[#171411] hover:bg-[#7d562d] text-white text-[11px] font-mono rounded-lg transition-colors whitespace-nowrap shadow-xs"
                      >
                        Gift This Piece 🎁
                      </button>
                    </div>
                  ))}
                </div>

                {/* Reassurance Note */}
                <div className="p-3 bg-[#f5f2ed] rounded-xl text-[11px] text-[#5c554e] border border-[#e4e2df] space-y-1">
                  <p className="font-medium text-[#171411]">✨ Archival Gifting Guarantee:</p>
                  <p>
                    Every gift from this registry is hand-stamped with a custom serialized provenance card and packaged in an archival unboxing box.
                  </p>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 bg-[#e58a47] hover:bg-[#cc7535] text-white rounded-lg text-xs font-mono font-medium transition-colors"
                >
                  {copiedLink ? '✓ Copied Shareable Link!' : 'Copy Shareable Link to Send to Guests'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// Customer Account Modal
export const CustomerAccountModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: any) => void;
}> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/70 backdrop-blur-md">
      <div className="bg-[#fbf9f6] rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-[#cfc4bd]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-4 border-b border-[#e4e2df] pb-4">
          <img
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#7d562d]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHsTYhXqG28SIlepM-9p5ZGrgCwufsBOutMRwoUJgoE1Oeda81nGkFhZ8Y2K2HRCwGo3vvC-D4Xy48MzyJ4cGeMJC2ab4THgj7fymUaQu-_P-zKUq9eNgs_6igTSmyt5rBV-4CN_MJEKlJqrhUD4ZC1qCyBwv8UgTyDSmIERVHByGcLqjCbhPJnJkj3JrD2131N11DBfVqWz2QxHI-btcyU7LeqefyVx8Elz_wl3hQLcnx0oq8CIPlLg"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ffdcbd] text-[#2c1600] px-2 py-0.5 rounded">
              Member profile
            </span>
            <h3 className="font-serif text-xl font-bold text-[#171411] mt-1">Your WOODKIND profile</h3>
            <p className="text-xs text-[#7e756f]">Profile preview · order data not connected</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-xs">
          <div className="p-4 bg-white rounded-xl border border-[#e4e2df] space-y-2">
            <div className="flex justify-between font-bold text-[#171411]">
              <span>Orders & product support</span>
              <span className="text-[#7d562d]">Not connected</span>
            </div>
            <p className="text-[#4d4540]">
              Order status, trial terms, returns and support details will appear once the store's order system is connected.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#e4e2df] space-y-2">
            <span className="font-bold text-[#171411] block">Product and sourcing documents</span>
            <div className="flex items-center justify-between text-[#4d4540] py-1 border-t border-[#f5f3f0]">
              <span>Product specification pending</span>
              <span className="text-[#7d562d] font-semibold cursor-pointer hover:underline">
                View Certificate ↗
              </span>
            </div>
            <div className="flex items-center justify-between text-[#4d4540] py-1 border-t border-[#f5f3f0]">
              <span>#LMN-RH-0094 (Nordic Rocking Horse)</span>
              <span className="text-[#7d562d] font-semibold cursor-pointer hover:underline">
                View Certificate ↗
              </span>
            </div>
          </div>

          {/* Admin & Founder Mode Shortcut */}
          <div className="p-4 bg-[#f2ede7] rounded-xl border border-[#e2d9cf] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#171411] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#c46927]">admin_panel_settings</span>
                Executive &amp; Founder Portal
              </p>
              <p className="text-[11px] text-[#7e756f] mt-0.5">
                Unit economics, BOM cost waterfall, production runs &amp; marketing collateral.
              </p>
            </div>
            {onNavigate && (
              <button
                onClick={() => {
                  onClose();
                  onNavigate('founder-portal');
                }}
                className="bg-[#171411] hover:bg-[#c46927] text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ml-3"
              >
                Open Admin
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#171411] text-white hover:bg-[#7d562d] px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Bespoke Nursery Architecture & Gifting Consultation Modal
export const BespokeConsultationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [parentName, setParentName] = useState('Your WOODKIND profile');
  const [email, setEmail] = useState('ananya.s@singhaniagroup.in');
  const [city, setCity] = useState('Mumbai, Maharashtra');
  const [nurseryStyle, setNurseryStyle] = useState('Nordic Warm Minimalist');
  const [preferredTimber, setPreferredTimber] = useState('Bavarian Steamed Beech');
  const [roomSqft, setRoomSqft] = useState('250 sq.ft');
  const [childAgeGroup, setChildAgeGroup] = useState('Toddler (1–3 Yrs)');
  const [customNotes, setCustomNotes] = useState(
    'Seeking integrated climbing arch and silent ride-on suite matching white oak flooring.'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171411]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#fbf9f6] rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative border border-[#cfc4bd] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="border-b border-[#e4e2df] pb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c46927] font-semibold">
            Atelier Architectural Consultation
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#171411] mt-1">
            Bespoke Nursery &amp; Playroom Gifting
          </h3>
          <p className="text-xs text-[#7a746e] mt-1">
            Collaborate directly with our master woodworkers to curate custom heirloom groupings tailored to your home's layout.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              parentName,
              email,
              city,
              nurseryStyle,
              preferredTimber,
              roomSqft,
              childAgeGroup,
              customNotes,
            });
            onClose();
          }}
          className="mt-6 space-y-4 text-xs font-sans"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#4a453e] font-medium mb-1 font-mono uppercase text-[10px]">
                Full Name
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-white text-[#171411] focus:outline-none focus:border-[#171411]"
              />
            </div>
            <div>
              <label className="block text-[#4a453e] font-medium mb-1 font-mono uppercase text-[10px]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-white text-[#171411] focus:outline-none focus:border-[#171411]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#4a453e] font-medium mb-1 font-mono uppercase text-[10px]">
                City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-white text-[#171411] focus:outline-none focus:border-[#171411]"
              />
            </div>
            <div>
              <label className="block text-[#4a453e] font-medium mb-1 font-mono uppercase text-[10px]">
                Child Age Milestone
              </label>
              <select
                value={childAgeGroup}
                onChange={(e) => setChildAgeGroup(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-white text-[#171411] focus:outline-none focus:border-[#171411]"
              >
                <option value="Infant (0–12 Mo)">Infant (0–12 Mo)</option>
                <option value="Toddler (1–3 Yrs)">Toddler (1–3 Yrs)</option>
                <option value="Preschool (3–6 Yrs)">Preschool (3–6 Yrs)</option>
                <option value="Multi-Age Siblings">Multi-Age Siblings</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#4a453e] font-medium mb-1 font-mono uppercase text-[10px]">
                Preferred Timber Species
              </label>
              <select
                value={preferredTimber}
                onChange={(e) => setPreferredTimber(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-white text-[#171411] focus:outline-none focus:border-[#171411]"
              >
                <option value="Bavarian Steamed Beech">Bavarian Steamed Beech (Warm Honey)</option>
                <option value="Nordic Raw Birch">Nordic Raw Birch (Pale Blonde)</option>
                <option value="Natural Ash & Lacquer">Natural Ash &amp; Waterborne Lacquer</option>
              </select>
            </div>
            <div>
              <label className="block text-[#4a453e] font-medium mb-1 font-mono uppercase text-[10px]">
                Approximate Room Size
              </label>
              <input
                type="text"
                value={roomSqft}
                onChange={(e) => setRoomSqft(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-white text-[#171411] focus:outline-none focus:border-[#171411]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#4a453e] font-medium mb-1 font-mono uppercase text-[10px]">
              Special Requests, Monogramming &amp; Floor Dimensions
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#e4e2df] bg-white text-[#171411] text-xs focus:outline-none focus:border-[#171411]"
            />
          </div>

          <div className="pt-3 border-t border-[#e4e2df] flex justify-between items-center">
            <span className="text-[11px] text-[#7a746e]">
              Complimentary 30-min design call with atelier principal
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#171411] hover:bg-[#322f2b] text-white rounded-xl font-mono text-xs font-semibold transition-colors shadow-md"
            >
              Request Consultation →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
