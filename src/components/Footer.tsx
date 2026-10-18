import React, { useState } from 'react';
import { ScreenType } from '../types.ts';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (title: string, subtitle: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowToast }) => {
  const [email, setEmail] = useState('');
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onShowToast('Newsletter preview', 'Email signup is not connected yet. No subscription was submitted.');
    setEmail('');
  };

  return (
    <footer className="bg-[#20392c] text-[#f7f3eb]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          <div className="md:col-span-4">
            <button onClick={() => onNavigate('home')} className="text-left">
              <span className="block text-2xl font-extrabold tracking-[0.22em]">WOODKIND</span>
              <span className="block text-[9px] uppercase tracking-[0.28em] text-[#d8c4a6] mt-1">Thoughtful wooden play</span>
            </button>
            <p className="text-sm leading-relaxed text-white/70 max-w-sm mt-5">A considered pilot collection of wooden ride-ons, balance toys, climbing concepts and tactile play. Product details are being validated before launch.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="rounded-full border border-white/20 px-3 py-1 text-[9px] uppercase tracking-[0.14em] text-white/75">Pilot stage</span>
              <span className="rounded-full border border-white/20 px-3 py-1 text-[9px] uppercase tracking-[0.14em] text-white/75">Safety review pending</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#d8c4a6]">Explore</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <button onClick={() => onNavigate('all-collections')} className="text-left hover:text-white">All products</button>
              <button onClick={() => onNavigate('wheels-and-motion')} className="text-left hover:text-white">Wheels & motion</button>
              <button onClick={() => onNavigate('rocking-and-balance')} className="text-left hover:text-white">Rocking & balance</button>
              <button onClick={() => onNavigate('climbing-and-play-gyms')} className="text-left hover:text-white">Climbing & play</button>
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#d8c4a6]">About</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <button onClick={() => onNavigate('brand-philosophy')} className="text-left hover:text-white">Our approach</button>
              <button onClick={() => onNavigate('gift-registry')} className="text-left hover:text-white">Gift registry</button>
              <button onClick={() => onNavigate('marketing-kit')} className="text-left hover:text-white">Journal & launch kit</button>
              <button onClick={() => onNavigate('founder-portal')} className="text-left hover:text-white">Founder portal</button>
            </div>
          </div>
          <div className="md:col-span-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#d8c4a6]">Follow the pilot</h3>
            <p className="text-sm text-white/70 mt-4 leading-relaxed">Join the list when newsletter signup is enabled, or explore the concepts now.</p>
            <form onSubmit={handleNewsletter} className="flex gap-2 mt-4">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" aria-label="Email address" className="min-w-0 flex-1 rounded-lg bg-white/10 border border-white/20 px-3 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-[#d8c4a6]" />
              <button type="submit" className="rounded-lg bg-[#f1e3ce] text-[#20392c] px-4 py-3 text-sm font-bold hover:bg-white transition-colors">Join</button>
            </form>
            <p className="text-[10px] text-white/45 mt-2">Preview form only · signup is not connected.</p>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-[11px] text-white/55">
          <p>© 2026 WOODKIND · Pilot collection</p>
          <p>Indicative prices only. Material, age, availability and safety details will be published once verified.</p>
        </div>
      </div>
    </footer>
  );
};
