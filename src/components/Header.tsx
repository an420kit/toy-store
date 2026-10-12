import React, { useState } from 'react';
import { ScreenType } from '../types.ts';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType, productId?: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenSearch,
  onOpenWishlist,
  onOpenAccount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; screen: ScreenType; highlight?: boolean }[] = [
    { label: 'All Collections', screen: 'all-collections' },
    { label: 'Wheels & Motion', screen: 'wheels-and-motion' },
    { label: 'Rocking & Balance', screen: 'rocking-and-balance' },
    { label: 'Climbing & Play Gyms', screen: 'climbing-and-play-gyms' },
    { label: 'Learning & Montessori', screen: 'learning-and-montessori' },
    { label: 'Play Furniture', screen: 'play-furniture' },
    { label: 'Gift Hub & Registry', screen: 'gift-registry' },
    { label: 'Wood Care & Charter', screen: 'brand-philosophy' },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-[#fbf9f6]/98 backdrop-blur-xl border-b border-[#e4e2df] shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
      {/* Top Announcement Banner */}
      <div className="bg-[#171411] text-[#fbf9f6] py-1.5 px-4 text-center text-[11px] tracking-wider uppercase font-medium flex items-center justify-center gap-2 sm:gap-3">
        <span>Free insured shipping on heirloom orders across India</span>
        <span className="opacity-30 hidden sm:inline">•</span>
        <span className="hidden sm:inline">100% Sustainable European Beech Wood</span>
      </div>

      {/* Main Brand & Action Bar */}
      <div className="h-16 md:h-20 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + Currency Badge */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1 text-[#4d4540] hover:text-[#171411] rounded-md hover:bg-[#efeeeb] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Currency Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4d4540] bg-[#efeeeb] hover:bg-[#eae8e5] px-2.5 py-1 rounded border border-[#e4e2df] transition-colors cursor-default">
            <span className="font-bold text-[#171411]">₹</span>
            <span>INR • India</span>
          </div>

          {/* Quick Search Button on Desktop */}
          <button
            onClick={onOpenSearch}
            className="hidden md:inline-flex items-center gap-2 text-[12px] text-[#7e756f] hover:text-[#171411] bg-[#f5f3f0] hover:bg-[#eae8e5] px-3 py-1.5 rounded-lg border border-[#e4e2df] transition-colors cursor-pointer"
            title="Search 50 Archetypes"
          >
            <span className="material-symbols-outlined text-[16px] text-[#7d562d]">search</span>
            <span>Search 50 Archetypes...</span>
          </button>
        </div>

        {/* Center: Brand Identity */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group cursor-pointer text-center focus:outline-none"
            aria-label="LUMEN Homepage"
          >
            <img
              alt="Lumen Nordic Toys Logo"
              className="h-7 md:h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XndE-ZA6KIQF2WLwO3c9sv69yuIXFel4TRvlZuLxVbttUVPHnQDfbny6cIyLQFeqg17CEBx7FONxJbt9wqR_UupbA2_0b7fEiTf0u13MSdNXr4LrRdqxCW8L4tFfCNXoFmVnzYVic415Qu-YcbcbB5LqOIuXWuPn6d-MqFwfbrFl-BaxhRe_RG0ljyRNbSurux2IxP9ZerVysoalc8vyjQQKC_DlToiuBurKQnAdWCgZAdQbwAiyKKxCvV"
            />
            <div className="flex flex-col items-start leading-none text-left">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#171411]">
                LUMEN
              </span>
              <span className="text-[9px] tracking-[0.22em] uppercase text-[#7d562d] font-semibold hidden sm:inline">
                Nordic Heirloom
              </span>
            </div>
          </button>
        </div>

        {/* Right Side: Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            aria-label="Search Catalog"
            className="md:hidden p-2 text-[#4d4540] hover:text-[#171411] transition-colors rounded-full hover:bg-[#eae8e5] cursor-pointer"
            title="Search Archetypes"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            aria-label="Wishlist"
            className="relative p-2 text-[#4d4540] hover:text-[#171411] transition-colors rounded-full hover:bg-[#eae8e5] cursor-pointer"
            title="Nursery Wishlist"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#7d562d] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Icon */}
          <button
            onClick={() => onNavigate('cart')}
            aria-label="Shopping Bag"
            className="relative p-2 text-[#4d4540] hover:text-[#171411] transition-colors rounded-full hover:bg-[#eae8e5] cursor-pointer flex items-center gap-1"
            title="Curated Bag"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#171411] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Profile */}
          <button
            onClick={onOpenAccount}
            aria-label="Customer Account"
            className="p-1 cursor-pointer focus:outline-none"
            title="Collector Account"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#e4e2df] hover:ring-[#7d562d] transition-all"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHsTYhXqG28SIlepM-9p5ZGrgCwufsBOutMRwoUJgoE1Oeda81nGkFhZ8Y2K2HRCwGo3vvC-D4Xy48MzyJ4cGeMJC2ab4THgj7fymUaQu-_P-zKUq9eNgs_6igTSmyt5rBV-4CN_MJEKlJqrhUD4ZC1qCyBwv8UgTyDSmIERVHByGcLqjCbhPJnJkj3JrD2131N11DBfVqWz2QxHI-btcyU7LeqefyVx8Elz_wl3hQLcnx0oq8CIPlLg"
            />
          </button>
        </div>
      </div>

      {/* Category Navigation Bar - Dedicated Horizontal Row */}
      <nav className="border-t border-[#e4e2df]/80 bg-[#fbf9f6]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-start lg:justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-none py-2.5 text-[11px] md:text-[12px] font-semibold tracking-wider uppercase">
            {navLinks.map((link) => {
              const isActive = currentScreen === link.screen;
              return (
                <button
                  key={link.screen}
                  onClick={() => onNavigate(link.screen)}
                  className={`transition-all pb-0.5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
                    isActive
                      ? 'text-[#171411] font-bold border-[#171411]'
                      : link.highlight
                      ? 'text-[#7d562d] hover:text-[#171411] border-transparent hover:border-[#7d562d]/40'
                      : 'text-[#5c544d] hover:text-[#171411] border-transparent hover:border-[#171411]/30'
                  }`}
                >
                  {link.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7d562d] animate-pulse"></span>
                  )}
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fbf9f6] border-t border-[#e4e2df] px-6 py-5 shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 font-semibold text-[13px] uppercase tracking-wider text-[#4d4540]">
            <div className="pb-2 mb-2 border-b border-[#e4e2df] flex items-center justify-between text-xs text-[#7e756f]">
              <span>Explore Archetypes</span>
              <span>₹ INR • India</span>
            </div>
            {navLinks.map((link) => (
              <button
                key={link.screen}
                onClick={() => {
                  onNavigate(link.screen);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors ${
                  currentScreen === link.screen
                    ? 'bg-[#efeeeb] text-[#171411] font-bold'
                    : 'hover:bg-[#f5f3f0]'
                }`}
              >
                <span>{link.label}</span>
                <span className="material-symbols-outlined text-[16px] opacity-40">chevron_right</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
