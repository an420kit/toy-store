import React, { useState } from 'react';
import { ScreenType } from '../types.ts';

interface MarketingKitProps {
  onNavigate: (screen: ScreenType, productId?: string) => void;
  onShowToast: (title: string, subtitle: string) => void;
}

export const MarketingKitScreen: React.FC<MarketingKitProps> = ({ onNavigate, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'email' | 'paid-ads' | 'social' | 'press'>('campaigns');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Copied to Clipboard', `${label} is ready to paste into your campaign manager.`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="pb-20 bg-[#fbf9f6] text-[#171411] min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#171411] text-[#ffffff] border-b border-[#322f2b] py-5 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-[#c46927] text-white">
                Launch Collateral
              </span>
              <span className="text-xs font-mono text-[#d0c5b4]">GTM Tooling • Batch #01 Debut</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#ffffff] mt-1">
              LUMEN Brand Launch & Acquisition Kit
            </h1>
            <p className="text-xs text-[#a0988e] mt-1 max-w-2xl">
              Turnkey positioning angles, tested editorial email drafts, paid creative hooks, and creator briefing dossiers for the debut European beechwood drop.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('founder-portal')}
              className="px-3.5 py-2 rounded-lg border border-[#4a453e] hover:bg-[#26221d] text-xs font-mono text-[#d0c5b4] transition-colors"
            >
              ← Founder Economics
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 rounded-lg bg-[#e58a47] hover:bg-[#cc7535] text-white text-xs font-medium font-sans transition-colors"
            >
              View Live Storefront →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#e4e2df] mb-8">
          {[
            { id: 'campaigns', label: '1. Master Campaign Angles' },
            { id: 'email', label: '2. Email Editorial & Flow' },
            { id: 'paid-ads', label: '3. Meta & Google Paid Copy' },
            { id: 'social', label: '4. Organic Drops & Reels' },
            { id: 'press', label: '5. Press Release & Media Kit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#171411] text-[#ffffff] font-medium shadow-xs'
                  : 'text-[#7a746e] hover:text-[#171411] hover:bg-[#eeeae3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Master Campaign Angles */}
        {activeTab === 'campaigns' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Angle 1 */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#c46927] font-semibold">
                    Core Angle #01 • Aesthetic Nurseries
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#171411] mt-2">
                    "Playrooms that belong in architectural digests."
                  </h3>
                  <p className="text-xs text-[#5c554e] mt-3 leading-relaxed">
                    Targeted at modern design-conscious parents weary of neon plastic clutter. Positions LUMEN objects as sculptural centerpieces that foster quiet focus and blend seamlessly with mid-century interior spaces.
                  </p>
                  <div className="mt-4 p-3 bg-[#faf8f4] rounded-lg border border-[#eeeae3] text-xs font-mono space-y-1">
                    <p className="text-[#7a746e]">Target CAC: <strong className="text-[#171411]">₹1,150</strong></p>
                    <p className="text-[#7a746e]">Target Audience: <strong className="text-[#171411]">Architects, Interior Enthusiasts, Design Parents (Age 28-42)</strong></p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#eeeae3]">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Headline: Playrooms that belong in architectural digests.\nHook: You don't have to sacrifice your home's aesthetics to give your child boundless open-ended play. Crafted from solid Bavarian beechwood and finished with cold-pressed organic linseed oil.`,
                        'Angle #01 Hook',
                        'angle1'
                      )
                    }
                    className="w-full py-2 rounded-lg bg-[#f5f2ed] hover:bg-[#e8e4dc] text-xs font-mono font-medium text-[#171411] transition-colors"
                  >
                    {copiedId === 'angle1' ? '✓ Copied Hook!' : 'Copy Angle & Hooks'}
                  </button>
                </div>
              </div>

              {/* Angle 2 */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#55866b] font-semibold">
                    Core Angle #02 • Generational Heirloom
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#171411] mt-2">
                    "Built for your toddler today. Kept for their toddler in 2055."
                  </h3>
                  <p className="text-xs text-[#5c554e] mt-3 leading-relaxed">
                    Focuses on radical longevity, sustainable FSC forestry, zero planned obsolescence, and the emotional value of passing down heirloom toys through generations.
                  </p>
                  <div className="mt-4 p-3 bg-[#faf8f4] rounded-lg border border-[#eeeae3] text-xs font-mono space-y-1">
                    <p className="text-[#7a746e]">Target CAC: <strong className="text-[#171411]">₹1,280</strong></p>
                    <p className="text-[#7a746e]">Target Audience: <strong className="text-[#171411]">Grandparents, First-time Parents, Luxury Baby Showers</strong></p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#eeeae3]">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Headline: Built for your toddler today. Kept for their toddler in 2055.\nHook: In a world of disposable plastic playthings destined for landfills in 6 months, LUMEN toys are turned from 40mm solid timber monoliths. Guaranteed for 10 years of unbounded discovery.`,
                        'Angle #02 Hook',
                        'angle2'
                      )
                    }
                    className="w-full py-2 rounded-lg bg-[#f5f2ed] hover:bg-[#e8e4dc] text-xs font-mono font-medium text-[#171411] transition-colors"
                  >
                    {copiedId === 'angle2' ? '✓ Copied Hook!' : 'Copy Angle & Hooks'}
                  </button>
                </div>
              </div>

              {/* Angle 3 */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b5a3c] font-semibold">
                    Core Angle #03 • Sensory Non-Toxic Pure
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#171411] mt-2">
                    "Zero microplastics. Zero synthetic varnishes. Just pure wood."
                  </h3>
                  <p className="text-xs text-[#5c554e] mt-3 leading-relaxed">
                    Appeals to health-conscious parents seeking non-toxic, safe materials for teething children. Highlights EN71 food-contact safety ratings and botanical oil finishes.
                  </p>
                  <div className="mt-4 p-3 bg-[#faf8f4] rounded-lg border border-[#eeeae3] text-xs font-mono space-y-1">
                    <p className="text-[#7a746e]">Target CAC: <strong className="text-[#171411]">₹980</strong></p>
                    <p className="text-[#7a746e]">Target Audience: <strong className="text-[#171411]">Holistic Wellness, Waldorf & Montessori Families</strong></p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#eeeae3]">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Headline: Zero microplastics. Zero synthetic varnishes. Just pure wood.\nHook: What your child touches every day matters. Every curve is finished by hand using cold-pressed Swedish linseed oil and organic beeswax. Safe for teething gums, quiet for calm homes.`,
                        'Angle #03 Hook',
                        'angle3'
                      )
                    }
                    className="w-full py-2 rounded-lg bg-[#f5f2ed] hover:bg-[#e8e4dc] text-xs font-mono font-medium text-[#171411] transition-colors"
                  >
                    {copiedId === 'angle3' ? '✓ Copied Hook!' : 'Copy Angle & Hooks'}
                  </button>
                </div>
              </div>
            </div>

            {/* Brand Positioning Statement Dossier */}
            <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 md:p-8 shadow-xs">
              <h3 className="font-serif text-xl font-bold text-[#171411]">Master Brand Positioning Statement</h3>
              <p className="text-xs text-[#7a746e] mt-1 font-mono">FOR INTERNAL TEAM, PR PARTNERS & CAMPAIGN MANAGERS</p>

              <blockquote className="mt-4 p-5 rounded-xl bg-[#faf8f4] border-l-4 border-[#c46927] text-sm text-[#322f2b] italic leading-relaxed">
                "For conscious parents and discerning caregivers who cherish deliberate aesthetics and sensory growth, LUMEN is the Nordic-inspired heirloom toy atelier that turns Bavarian beechwood into timeless instruments of childhood. Unlike mass-manufactured synthetic toys that overstimulate and break, LUMEN delivers architectural monoliths engineered with whisper-quiet rubber bearings and organic edible oil finishes, designed to be loved today and passed down tomorrow."
              </blockquote>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `"For conscious parents and discerning caregivers who cherish deliberate aesthetics and sensory growth, LUMEN is the Nordic-inspired heirloom toy atelier that turns Bavarian beechwood into timeless instruments of childhood. Unlike mass-manufactured synthetic toys that overstimulate and break, LUMEN delivers architectural monoliths engineered with whisper-quiet rubber bearings and organic edible oil finishes, designed to be loved today and passed down tomorrow."`,
                      'Positioning Statement',
                      'pos'
                    )
                  }
                  className="px-4 py-2 bg-[#171411] text-white rounded-lg text-xs font-mono font-medium hover:bg-[#322f2b]"
                >
                  {copiedId === 'pos' ? '✓ Copied!' : 'Copy Positioning Statement'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Email Editorial & Flow */}
        {activeTab === 'email' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Email Details & Copy Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#171411]">Launch Drop Announcement #01</h3>
                <p className="text-xs text-[#7a746e] mt-1">High-converting welcome & debut batch drop sequence.</p>

                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="font-mono text-[#7a746e] block uppercase text-[10px]">Subject Line Option A (Curiosity):</span>
                    <p className="font-medium text-[#171411] mt-0.5">The nursery toy that lasts 50 years (Debut Batch #01)</p>
                  </div>
                  <div>
                    <span className="font-mono text-[#7a746e] block uppercase text-[10px]">Subject Line Option B (Direct):</span>
                    <p className="font-medium text-[#171411] mt-0.5">Introducing LUMEN — Heirloom Beechwood Toys for Mindful Homes</p>
                  </div>
                  <div>
                    <span className="font-mono text-[#7a746e] block uppercase text-[10px]">Preview Snippet Text:</span>
                    <p className="text-[#5c554e] mt-0.5">100 limited units. Zero synthetic varnishes. Handcrafted in Bavarian beechwood.</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#eeeae3] space-y-2">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Subject: The nursery toy that lasts 50 years (Debut Batch #01)\n\nDear friend,\n\nLook around your child's playroom. How many objects will survive until their tenth birthday? How many will you cherish saving in the attic for your grandchildren?\n\nWe started LUMEN with a single conviction: children deserve play objects crafted with the same dignity, timeless beauty, and architectural restraint as an Eames lounge or an Alvar Aalto stool.\n\nToday, we are opening Debut Batch #01 — exactly 100 numbered pieces of The Minimal Ride-On, milled from sustainably harvested European beechwood and hand-finished with Swedish linseed oil.\n\nReserve your heirloom: https://lumen-heirloom.com/debut\n\nWarmly,\nThe LUMEN Atelier`,
                        'Email Newsletter Copy',
                        'email-copy'
                      )
                    }
                    className="w-full py-2.5 rounded-lg bg-[#171411] hover:bg-[#322f2b] text-white text-xs font-mono font-medium transition-colors"
                  >
                    {copiedId === 'email-copy' ? '✓ Copied Entire Email!' : 'Copy Full Email Text'}
                  </button>
                  <button
                    onClick={() => onShowToast('Template Exported', 'Klaviyo / Mailchimp HTML snippet copied.')}
                    className="w-full py-2 rounded-lg border border-[#e4e2df] text-xs font-mono text-[#4a453e] hover:bg-[#faf8f4] transition-colors"
                  >
                    Export for Klaviyo / HTML
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Email Visual Preview (7 cols) */}
            <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-8 shadow-xs">
              <div className="max-w-[520px] mx-auto border border-[#eeeae3] rounded-xl overflow-hidden bg-[#fbf9f6] shadow-sm">
                {/* Email Header */}
                <div className="bg-[#171411] p-6 text-center text-white">
                  <h2 className="font-serif text-2xl tracking-widest font-bold">L U M E N</h2>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-[#d0c5b4] mt-1">
                    HEIRLOOM NORDIC WOODEN TOYS
                  </p>
                </div>

                {/* Email Hero Image */}
                <img
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"
                  alt="LUMEN Beechwood Ride On"
                  className="w-full h-56 object-cover"
                />

                {/* Email Body */}
                <div className="p-6 md:p-8 space-y-4 text-xs font-sans text-[#3a352e] leading-relaxed">
                  <p className="font-serif text-base font-bold text-[#171411]">
                    The nursery toy that will last 50 years.
                  </p>
                  <p>
                    Look around your child’s playroom. How many objects will survive until their tenth birthday? How many will you cherish saving in the attic for your grandchildren?
                  </p>
                  <p>
                    We started LUMEN with a single conviction: children deserve play objects crafted with the same dignity, architectural restraint, and honest materiality as heirloom Scandinavian furniture.
                  </p>
                  <p>
                    Today, we open Debut Batch #01: 100 limited, numbered units of <strong>The Minimal Ride-On</strong> and <strong>The Sculpted Rocking Swan</strong>. Milled from sustainably harvested Bavarian beechwood, fitted with silent rubber bearings, and sealed with cold-pressed organic linseed oil.
                  </p>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => onNavigate('product-detail', 'minimal-ride-on')}
                      className="inline-block px-6 py-3 bg-[#171411] text-white rounded-lg text-xs font-medium tracking-wide uppercase font-mono hover:bg-[#322f2b]"
                    >
                      Acquire From Batch #01 →
                    </button>
                  </div>

                  <p className="text-[11px] text-[#7a746e] text-center pt-2 italic">
                    Free climate-neutral shipping across India. Includes hand-engraved monogramming.
                  </p>
                </div>

                {/* Email Footer */}
                <div className="bg-[#f2efe9] p-4 text-center border-t border-[#e4e2df] text-[10px] text-[#7a746e] font-mono">
                  <p>© 2024 LUMEN Nordic Heirloom Toys. Crafted for mindful childhoods.</p>
                  <p className="mt-1">Unsubscribe • Manage Preferences</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Paid Ads Copy (Meta & Google) */}
        {activeTab === 'paid-ads' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meta Ad #01 */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-[#1877F2]/10 text-[#1877F2] px-2 py-0.5 rounded font-semibold">
                      Meta Instagram / Feed Video
                    </span>
                    <span className="text-[11px] font-mono text-[#55866b] font-medium">Est. ROAS: 3.8x</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#171411] mt-3">
                    Creative: "Quiet Play vs Plastic Overstimulation"
                  </h4>
                  <div className="mt-3 p-3 bg-[#faf8f4] rounded-lg border border-[#eeeae3] text-xs font-mono space-y-1.5 text-[#4a453e]">
                    <p><strong>Primary Text:</strong> If you are tired of batteries, blinking lights, and plastic toys scattered across your living room floor, meet LUMEN. Handcrafted from European beechwood with zero toxic chemicals. Designed for calm focus and open imagination.</p>
                    <p><strong>Headline:</strong> Nordic Heirloom Wooden Toys</p>
                    <p><strong>Call to Action:</strong> Shop Now</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#eeeae3]">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `PRIMARY TEXT:\nIf you are tired of batteries, blinking lights, and plastic toys scattered across your living room floor, meet LUMEN. Handcrafted from European beechwood with zero toxic chemicals. Designed for calm focus and open imagination.\n\nHEADLINE:\nNordic Heirloom Wooden Toys (Debut Batch)\n\nCTA: Shop Now`,
                        'Meta Ad Copy #01',
                        'meta1'
                      )
                    }
                    className="w-full py-2 bg-[#f5f2ed] hover:bg-[#e8e4dc] rounded-lg text-xs font-mono font-medium text-[#171411] transition-colors"
                  >
                    {copiedId === 'meta1' ? '✓ Copied Meta Ad!' : 'Copy Ad Bundle'}
                  </button>
                </div>
              </div>

              {/* Meta Ad #02 */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-[#1877F2]/10 text-[#1877F2] px-2 py-0.5 rounded font-semibold">
                      Meta Instagram Reels / Stories
                    </span>
                    <span className="text-[11px] font-mono text-[#55866b] font-medium">Est. ROAS: 4.2x</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#171411] mt-3">
                    Creative: "ASMR Wood Sound & Smooth Wheel Glide"
                  </h4>
                  <div className="mt-3 p-3 bg-[#faf8f4] rounded-lg border border-[#eeeae3] text-xs font-mono space-y-1.5 text-[#4a453e]">
                    <p><strong>Visual Script:</strong> Close up of silent rubber wheels gliding over oak hardwood floor. Mother runs fingers over hand-sanded curved beechwood handle. Zero sound except subtle rolling.</p>
                    <p><strong>Overlay Text:</strong> "Silent rubber bearings. 40mm solid European beechwood. Heirloom guaranteed."</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#eeeae3]">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `HOOK: The most calming sound you'll hear in a playroom.\nOVERLAY: Silent rubber bearings. Solid European beech. No plastic, no screens.\nCAPTION: Designed to foster quiet confidence and deep motor coordination. Meet Batch #01.\nLINK: lumen-heirloom.com`,
                        'Reels Video Script',
                        'reels1'
                      )
                    }
                    className="w-full py-2 bg-[#f5f2ed] hover:bg-[#e8e4dc] rounded-lg text-xs font-mono font-medium text-[#171411] transition-colors"
                  >
                    {copiedId === 'reels1' ? '✓ Copied Script!' : 'Copy Reels Script'}
                  </button>
                </div>
              </div>
            </div>

            {/* Google Search Ads */}
            <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 shadow-xs">
              <span className="text-[10px] font-mono uppercase bg-[#4285F4]/10 text-[#4285F4] px-2 py-0.5 rounded font-semibold">
                Google Search High-Intent Ad Group
              </span>
              <h4 className="font-serif text-lg font-bold text-[#171411] mt-2">
                High-Intent Keywords: "wooden ride on toy", "montessori wooden toys", "luxury nursery gifts"
              </h4>

              <div className="mt-4 p-4 rounded-xl bg-[#faf8f4] border border-[#eeeae3] space-y-2 text-xs font-mono">
                <p className="text-[#1a0dab] font-sans font-medium text-sm hover:underline cursor-pointer">
                  LUMEN — Handcrafted Nordic Wooden Toys | Batch #01 Now Open
                </p>
                <p className="text-[#006621] text-[11px]">https://www.lumen-heirloom.com/debut-batch</p>
                <p className="text-[#545454] font-sans">
                  Heirloom toys crafted from FSC® European beechwood. Silent rubber bearings, non-toxic organic linseed finish, and custom nursery monograms. 10-year heirloom guarantee.
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `Headline 1: LUMEN — Nordic Wooden Toys\nHeadline 2: 100% Solid Beechwood\nHeadline 3: Debut Batch #01 Available\nDescription: Handcrafted heirloom playthings engineered for quiet motor discovery. Safe organic finishes and custom initials monogramming. Free shipping.`,
                      'Google Ads Copy',
                      'gsearch'
                    )
                  }
                  className="px-4 py-2 bg-[#171411] text-white rounded-lg text-xs font-mono font-medium hover:bg-[#322f2b]"
                >
                  {copiedId === 'gsearch' ? '✓ Copied Google Ads!' : 'Copy Google Ad Assets'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Organic Social & Creator Brief */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 md:p-8 shadow-xs">
              <h3 className="font-serif text-xl font-bold text-[#171411]">Creator & Influencer Gifting Brief</h3>
              <p className="text-xs text-[#7a746e] mt-1 font-mono">
                UNBOXING INSTRUCTIONS FOR INTERIOR & MONTESSORI CREATORS
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#faf8f4] border border-[#eeeae3]">
                  <span className="font-mono text-xs font-bold text-[#c46927] block">1. The Unboxing Moment</span>
                  <p className="text-xs text-[#5c554e] mt-1.5 leading-relaxed">
                    Capture the unboxing of the rigid kraft crate, untying the unbleached cotton dustbag, and the faint natural aroma of organic linseed oil.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#faf8f4] border border-[#eeeae3]">
                  <span className="font-mono text-xs font-bold text-[#c46927] block">2. In-Room Staging</span>
                  <p className="text-xs text-[#5c554e] mt-1.5 leading-relaxed">
                    Stage the piece naturally alongside neutral linen rugs, open wood shelving, and warm morning window daylight.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#faf8f4] border border-[#eeeae3]">
                  <span className="font-mono text-xs font-bold text-[#c46927] block">3. Child Interaction</span>
                  <p className="text-xs text-[#5c554e] mt-1.5 leading-relaxed">
                    Allow the toddler to explore freely — climbing, pushing, turning wheels. Highlight the silent gliding and tactile beech texture.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `LUMEN CREATOR BRIEF:\n- Brand: LUMEN Nordic Heirloom Wooden Toys\n- Deliverable: 1x Instagram Reel / TikTok + 3x High-Res In-Situ Photos\n- Talking Points: 100% European Beechwood, Silent Bearings, Non-toxic Linseed finish, No batteries, 10-year guarantee.\n- Discount Code: HEIRLOOM10 for 10% off debut batch.`,
                      'Creator Briefing Kit',
                      'creator'
                    )
                  }
                  className="px-4 py-2 bg-[#171411] text-white rounded-lg text-xs font-mono font-medium hover:bg-[#322f2b]"
                >
                  {copiedId === 'creator' ? '✓ Copied Brief!' : 'Copy Creator Brief (PDF/Text)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Press Release */}
        {activeTab === 'press' && (
          <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#eeeae3] pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#7a746e]">FOR IMMEDIATE RELEASE</span>
                <h3 className="font-serif text-2xl font-bold text-[#171411] mt-1">
                  LUMEN Unveils Debut Heirloom Toy Collection Honed in Bavarian Beechwood
                </h3>
                <p className="text-xs text-[#7a746e] font-mono mt-0.5">NEW DELHI / STOCKHOLM — Q3 2024</p>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `FOR IMMEDIATE RELEASE:\n\nLUMEN Unveils Debut Heirloom Toy Collection Honed in Bavarian Beechwood\n\nDesign Atelier Reinvents Early Childhood Play With Architectural Restraint, Zero Plastics, and Whisper-Quiet Mechanical Engineering.\n\nToday marks the public launch of LUMEN, an independent design atelier crafting generational wooden toys from sustainably harvested European beechwood...`,
                    'Press Release',
                    'pr-copy'
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-[#171411] text-white text-xs font-mono hover:bg-[#322f2b]"
              >
                {copiedId === 'pr-copy' ? '✓ Copied Press Release' : 'Copy Press Release'}
              </button>
            </div>

            <div className="text-xs text-[#4a453e] font-sans leading-relaxed space-y-4 max-w-3xl">
              <p>
                <strong>NEW DELHI & STOCKHOLM</strong> — Today marks the official unveiling of <strong>LUMEN</strong>, a contemporary design studio dedicated to re-imagining children’s toys through the lens of Nordic minimalism, honest materials, and radical heirloom durability.
              </p>
              <p>
                In an era where over 80% of children’s toys are made of non-recyclable plastic and discarded within six months, LUMEN introduces an antidote: sculpted play objects designed to endure for 50 years. The Debut Collection features five hero archetypes, led by <em>The Minimal Ride-On</em> and <em>The Sculpted Rocking Swan</em>.
              </p>
              <p>
                “We asked ourselves why children’s spaces must be saturated with disposable plastic that overstimulates their senses and clutters our homes,” says the founding team. “Children possess an innate sensitivity to honest weight, warmth, and grain. By using solid Bavarian beechwood and cold-pressed organic botanical oils, we create toys that honor their developmental journey.”
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
