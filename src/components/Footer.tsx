import React, { useState } from 'react';
import { ScreenType } from '../types.ts';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (title: string, subtitle: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowToast }) => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onShowToast('Welcome to The WOODKIND Journal', `Monograph release dispatch registered for ${email}`);
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#f5f3f0] text-[#1b1c1a] py-12 md:py-16 border-t border-[#e4e2df]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <div className="font-serif text-3xl text-[#171411] tracking-tight font-bold">
              WOODKIND
            </div>
            <p className="text-[14px] leading-relaxed text-[#4d4540] max-w-md">
              Sculptural play objects hand-finished in FSC-certified European beechwood. Rooted in
              pure Scandinavian design and respectful Montessori principles to nurture developmental
              autonomy through tactile, enduring heirlooms.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[#4d4540] text-[11px] font-medium tracking-wide">
              <div className="flex items-center gap-1.5 bg-[#fbf9f6] px-2.5 py-1 rounded border border-[#e4e2df]">
                <span className="material-symbols-outlined text-[#7d562d] text-[16px]">forest</span>
                <span>FSC® Certified Timber</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fbf9f6] px-2.5 py-1 rounded border border-[#e4e2df]">
                <span className="material-symbols-outlined text-[#7d562d] text-[16px]">verified_user</span>
                <span>EN71 &amp; BIS Safety Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fbf9f6] px-2.5 py-1 rounded border border-[#e4e2df]">
                <span className="material-symbols-outlined text-[#7d562d] text-[16px]">eco</span>
                <span>Organic Non-Toxic Oils</span>
              </div>
            </div>
          </div>

          {/* Curated Play */}
          <div className="space-y-3">
            <div className="text-[12px] uppercase tracking-wider text-[#171411] font-bold">
              Curated Play
            </div>
            <ul className="space-y-2 text-[13px] text-[#4d4540]">
              <li>
                <button
                  onClick={() => onNavigate('wheels-and-motion')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left"
                >
                  Wheels &amp; Motion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rocking-and-balance')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left"
                >
                  Rocking &amp; Balance Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('climbing-and-play-gyms')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left"
                >
                  Pikler Climbing Triangles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('learning-and-montessori')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left"
                >
                  Sensory &amp; Montessori Blocks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('play-furniture')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left"
                >
                  Architectural Nursery Furniture
                </button>
              </li>
            </ul>
          </div>

          {/* Artisan Concierge */}
          <div className="space-y-3">
            <div className="text-[12px] uppercase tracking-wider text-[#171411] font-bold">
              Artisan Concierge
            </div>
            <ul className="space-y-2 text-[13px] text-[#4d4540]">
              <li>
                <button
                  onClick={() => onNavigate('gift-registry')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left font-medium text-[#c46927]"
                >
                  🎁 Heirloom Gift Hub &amp; Registry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-collections')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left"
                >
                  Bespoke Heirloom Gifting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('brand-philosophy')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left"
                >
                  Wood Care &amp; Restoration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('brand-philosophy')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left font-medium text-[#7d562d]"
                >
                  Safety &amp; Compliance (EN71 / BIS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cart')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left"
                >
                  Track Heirloom Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('founder-portal')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left font-bold text-[#c46927] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                  Founder &amp; Admin Portal (Economics)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('marketing-kit')}
                  className="hover:text-[#171411] transition-colors cursor-pointer text-left text-[#7d562d] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">campaign</span>
                  Launch &amp; Marketing Kit
                </button>
              </li>
            </ul>
          </div>

          {/* The WOODKIND Journal */}
          <div className="space-y-3">
            <div className="text-[12px] uppercase tracking-wider text-[#171411] font-bold">
              The WOODKIND Journal
            </div>
            <p className="text-[13px] text-[#4d4540] leading-relaxed">
              Receive seasonal monographs on developmental play, slow living, and private archival
              collection releases.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <div className="flex items-center bg-[#ffffff] rounded p-1 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-[#e4e2df]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-1.5 bg-transparent text-[#1b1c1a] placeholder:text-[#7e756f] text-[13px] focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#171411] text-[#ffffff] hover:bg-[#7d562d] px-4 py-1.5 rounded text-[12px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
              <span className="text-[11px] text-[#7e756f]">
                Discreet releases only. Unsubscribe at any hour.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#e4e2df] flex flex-col md:flex-row items-center justify-between gap-4 text-[#7e756f] text-[12px]">
          <p>© 2026 WOODKIND Nordic Toys Ltd. Crafted with reverence in Europe &amp; India.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('brand-philosophy')}
              className="hover:text-[#171411] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('brand-philosophy')}
              className="hover:text-[#171411] transition-colors cursor-pointer"
            >
              Privacy Statement
            </button>
            <button
              onClick={() => onNavigate('brand-philosophy')}
              className="hover:text-[#171411] transition-colors cursor-pointer"
            >
              Sustainability Charter
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
