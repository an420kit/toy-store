import React from 'react';
import { ScreenType } from '../types.ts';

interface BrandPhilosophyScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast?: (title: string, subtitle: string) => void;
}

export const BrandPhilosophyScreen: React.FC<BrandPhilosophyScreenProps> = ({ onNavigate, onShowToast }) => (
  <div className="flex flex-col w-full bg-[#fbf9f6] text-[#20291f]">
    <section className="bg-[#f0ece4] border-b border-[#e3d8c8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-14 md:py-20">
        <span className="inline-flex rounded-full bg-white/80 border border-[#ded3c3] px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#876541]">The WOODKIND approach</span>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight max-w-3xl mt-5">Thoughtful forms. Transparent choices.</h1>
        <p className="text-base md:text-lg text-[#675e52] max-w-2xl leading-relaxed mt-5">We are shaping a focused collection of wooden play concepts for calmer, open-ended play. The current range is in pilot development, so materials, dimensions, age guidance and safety requirements will be published only after they are verified.</p>
        <button onClick={() => onNavigate('all-collections')} className="mt-7 rounded-lg bg-[#233b2d] hover:bg-[#314d3b] px-6 py-3.5 text-sm font-semibold text-white transition-colors">Explore the pilot collection →</button>
      </div>
    </section>

    <section className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="rounded-2xl bg-white border border-[#e7e0d5] p-6 md:p-7">
          <span className="text-[#8b6845] text-2xl">01</span>
          <h2 className="font-serif text-2xl mt-4">Material clarity</h2>
          <p className="text-sm text-[#70665a] leading-relaxed mt-3">Each listing will identify the actual timber, coatings and hardware after supplier specifications are checked. No sourcing or certification badge is implied before evidence is available.</p>
          <span className="inline-flex mt-5 rounded-full bg-[#f2eee7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#79664d]">Verification pending</span>
        </article>
        <article className="rounded-2xl bg-white border border-[#e7e0d5] p-6 md:p-7">
          <span className="text-[#8b6845] text-2xl">02</span>
          <h2 className="font-serif text-2xl mt-4">Useful by design</h2>
          <p className="text-sm text-[#70665a] leading-relaxed mt-3">The collection explores balance, movement, rocking, climbing and tactile play. Prototype geometry and manufacturing choices will be tested before final product claims are made.</p>
          <span className="inline-flex mt-5 rounded-full bg-[#f2eee7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#79664d]">Pilot development</span>
        </article>
        <article className="rounded-2xl bg-white border border-[#e7e0d5] p-6 md:p-7">
          <span className="text-[#8b6845] text-2xl">03</span>
          <h2 className="font-serif text-2xl mt-4">Safety before sales</h2>
          <p className="text-sm text-[#70665a] leading-relaxed mt-3">Age suitability, pinch points, stability, capacity, finish safety and assembly guidance are launch gates. We will not claim completed testing or certification until the relevant evidence exists.</p>
          <span className="inline-flex mt-5 rounded-full bg-[#f2eee7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#79664d]">Testing not yet claimed</span>
        </article>
      </div>
    </section>

    <section className="bg-[#f3efe7] border-y border-[#e3d8c8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8b6845]">Before the first order</span>
        <h2 className="font-serif text-3xl md:text-4xl mt-2 max-w-2xl">A product page should answer the questions that matter.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {[
            ['Materials & finish', 'Supplier documents and coating details will be confirmed.'],
            ['Dimensions & assembly', 'Measured prototype specifications and instructions are pending.'],
            ['Age guidance & use', 'Published only after appropriate review and testing.'],
            ['Price, shipping & returns', 'Policies will be shown when live commerce is configured.'],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-xl bg-white border border-[#e3d8c8] p-5">
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="text-sm text-[#70665a] mt-2 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 md:py-16">
      <div className="rounded-2xl bg-[#233b2d] text-white px-6 py-10 md:px-10 md:py-12">
        <h2 className="font-serif text-3xl md:text-4xl">Help shape the pilot.</h2>
        <p className="text-sm text-white/75 max-w-xl leading-relaxed mt-3">Share the product, age range or use case you are interested in. Enquiries are a research step, not a confirmed order.</p>
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={() => { onShowToast?.('Pilot enquiry', 'Checkout and payment are not active yet. Use this as a product-interest enquiry only.'); onNavigate('all-collections'); }} className="rounded-lg bg-[#f5e8d6] text-[#233b2d] hover:bg-white px-5 py-3 text-sm font-semibold transition-colors">Browse products</button>
          <button onClick={() => onNavigate('home')} className="rounded-lg border border-white/35 hover:bg-white/10 px-5 py-3 text-sm font-semibold transition-colors">Back to home</button>
        </div>
      </div>
    </section>
  </div>
);
