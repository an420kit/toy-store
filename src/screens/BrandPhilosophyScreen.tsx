import React from 'react';
import { ScreenType } from '../types.ts';

interface BrandPhilosophyScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast?: (title: string, subtitle: string) => void;
}

export const BrandPhilosophyScreen: React.FC<BrandPhilosophyScreenProps> = ({
  onNavigate,
  onShowToast,
}) => {
  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] text-[#171411]">
      {/* Hero Header */}
      <section className="w-full bg-[#f5f3f0] py-16 md:py-24 border-b border-[#e4e2df]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#fbf9f6] px-3.5 py-1.5 rounded-full text-[#7d562d] text-xs font-semibold tracking-wider uppercase border border-[#e4e2df] shadow-xs">
            <span className="material-symbols-outlined text-[16px]">eco</span>
            <span>The Lumen Manifesto • Sustainable Heirloom Charter</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#171411] max-w-3xl mx-auto">
            Quiet Wood, Enduring Childhoods
          </h1>
          <p className="text-base md:text-lg text-[#4d4540] max-w-2xl mx-auto leading-relaxed">
            We exist to counter the disposable, battery-driven toys that overwhelm children&apos;s senses.
            Every LUMEN object is shaped by hand from European beechwood to foster calm focus, open curiosity,
            and generational wonder.
          </p>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#e4e2df] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffdcbd]/40 text-[#7d562d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">forest</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#171411]">100% FSC® Certified Timber</h3>
            <p className="text-sm text-[#4d4540] leading-relaxed">
              Milled solely from sustainably harvested German and Bavarian European beech (<em>Fagus sylvatica</em>).
              For every toy welcomed into a family nursery, two saplings are planted in our monitored Black Forest acreage.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#7d562d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Zero clear-cutting • Chain-of-custody certified</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#e4e2df] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffdcbd]/40 text-[#7d562d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">spa</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#171411]">Organic Cold-Pressed Oils</h3>
            <p className="text-sm text-[#4d4540] leading-relaxed">
              Finished using raw cold-pressed linseed oils, organic beeswax, and waterborne food-safe pigments.
              Free of volatile organic compounds (VOCs), formaldehyde, phthalates, and plasticizers.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#7d562d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Teething safe • Saliva resistant (DIN 53160)</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#e4e2df] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffdcbd]/40 text-[#7d562d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">family_history</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#171411]">10-Year Heirloom Warranty</h3>
            <p className="text-sm text-[#4d4540] leading-relaxed">
              Constructed with mortise-and-tenon joints and brass hardware designed to outlive trends.
              If any structural joinery ever loosens within ten years, our master workshop restores or replaces it.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#7d562d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Generational repair kits included with orders</span>
            </div>
          </div>
        </div>

        {/* Detailed Wood Care Guide */}
        <div className="bg-[#f5f3f0] rounded-3xl p-8 md:p-12 border border-[#e4e2df] space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#7d562d]">Care &amp; Restoration Monograph</span>
            <h2 className="font-serif text-3xl font-bold text-[#171411]">
              How to Nurture Natural Beechwood
            </h2>
            <p className="text-sm text-[#4d4540]">
              Like fine heirloom furniture, solid beechwood matures gracefully with a warm amber patina.
              Here is how to care for your pieces:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-[#e4e2df] space-y-2">
              <span className="text-xs font-bold text-[#7d562d] uppercase">01 • Daily Cleaning</span>
              <h4 className="font-serif font-bold text-base text-[#171411]">Damp Cloth Only</h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Wipe gently with a slightly damp cotton cloth. Avoid submerged soaking, harsh chemical detergents, or steam cleaners.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e4e2df] space-y-2">
              <span className="text-xs font-bold text-[#7d562d] uppercase">02 • Annual Nourishment</span>
              <h4 className="font-serif font-bold text-base text-[#171411]">Beeswax Reconditioning</h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Apply a thin coat of natural beeswax balm once a year to hydrate wood fibers and restore the silky hand feel.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e4e2df] space-y-2">
              <span className="text-xs font-bold text-[#7d562d] uppercase">03 • Minor Scratches</span>
              <h4 className="font-serif font-bold text-base text-[#171411]">Fine 320-Grit Buff</h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Small toddler play marks can be buffed with the included 320-grit sanding pad along the wood grain and sealed with oil.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e4e2df] space-y-2">
              <span className="text-xs font-bold text-[#7d562d] uppercase">04 • Environment</span>
              <h4 className="font-serif font-bold text-base text-[#171411]">Room Humidity</h4>
              <p className="text-xs text-[#4d4540] leading-relaxed">
                Keep indoor relative humidity between 40% and 65%. Avoid resting wooden pieces against heating radiators or direct midday monsoons.
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Safety Compliance Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 bg-white rounded-2xl border border-[#e4e2df] space-y-2">
            <h4 className="font-serif font-bold text-lg text-[#171411]">BIS IS 9873 Certification</h4>
            <p className="text-xs text-[#4d4540] leading-relaxed">
              Certified under the Bureau of Indian Standards toy safety specifications for mechanical stability, flammability, and zero heavy metal migration.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-[#e4e2df] space-y-2">
            <h4 className="font-serif font-bold text-lg text-[#171411]">EN 71-1, 2, 3 Compliant</h4>
            <p className="text-xs text-[#4d4540] leading-relaxed">
              Full European Union conformity verifying safety thresholds for pinch points, wheel entrapments, small part choke tests, and organic surface saliva safety.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-[#e4e2df] space-y-2">
            <h4 className="font-serif font-bold text-lg text-[#171411]">30-Day Quiet Home Trial</h4>
            <p className="text-xs text-[#4d4540] leading-relaxed">
              Take 30 days to experience any LUMEN object in your nursery. If it doesn’t inspire lasting harmony, complimentary doorstep return pickup is provided across India.
            </p>
          </div>
        </div>

        {/* Return to Collections CTA */}
        <div className="text-center pt-8 pb-4 space-y-4">
          <button
            onClick={() => onNavigate('all-collections')}
            className="bg-[#171411] text-white hover:bg-[#7d562d] px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <span>Explore The 50 Archetypes Master Archive</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};
