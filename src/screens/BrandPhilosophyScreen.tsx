import React from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Leaf, PencilRuler } from 'lucide-react';
import { ScreenType } from '../types.ts';

interface BrandPhilosophyScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast?: (title: string, subtitle: string) => void;
}

const principles = [
  { number: '01', icon: Compass, title: 'Play without a script', copy: 'We favour open-ended forms that invite children to carry, balance, build, sort and imagine their own rules.' },
  { number: '02', icon: PencilRuler, title: 'Design before claims', copy: 'Every idea starts with a clear purpose. Dimensions, material choices and build details are confirmed as the actual product develops.' },
  { number: '03', icon: Leaf, title: 'Honest by design', copy: 'We share what is known, label what is still a concept, and avoid publishing safety or material claims that have not been verified.' },
];

export const BrandPhilosophyScreen: React.FC<BrandPhilosophyScreenProps> = ({ onNavigate, onShowToast }) => (
  <main className="min-h-screen bg-[#fbf8f2] text-[#27251f]">
    <section className="border-b border-[#e5dbce] bg-[#eee6da] px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#927352]"><span className="h-px w-8 bg-[#ad8c67]" /> The WOODKIND point of view</div>
        <h1 className="max-w-[850px] font-serif text-4xl font-normal leading-[1.08] tracking-[-0.035em] sm:text-6xl">A quieter kind of play.<br/><span className="italic text-[#896849]">A more thoughtful way to make.</span></h1>
        <p className="mt-6 max-w-[660px] text-sm leading-7 text-[#72695c] sm:text-base">WOODKIND is a small, evolving range of wooden play ideas for everyday family spaces. We want products to feel considered, useful and inviting—and we believe trust begins with being clear about what is ready and what is not.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button type="button" onClick={() => onNavigate('all-collections')} className="inline-flex items-center gap-3 bg-[#2e3d31] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#435644]">Explore the range <ArrowRight size={14}/></button>
          <button type="button" onClick={() => onShowToast?.('WOODKIND approach', 'The pilot range is being validated product by product.')} className="inline-flex items-center gap-2 border border-[#cfc2b1] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4e483e] transition hover:bg-white/50">Our promise <ArrowUpRight size={14}/></button>
        </div>
      </div>
    </section>

    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 max-w-[680px]">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#927352]">Three simple principles</p>
          <h2 className="font-serif text-3xl font-normal tracking-[-0.025em] sm:text-4xl">Good intentions need good details.</h2>
        </div>
        <div className="grid gap-px border border-[#e1d5c3] bg-[#e1d5c3] md:grid-cols-3">
          {principles.map(({ number, icon: Icon, title, copy }) => (
            <article key={number} className="bg-[#fbf8f2] p-6 sm:p-8 lg:p-10">
              <div className="mb-12 flex items-start justify-between"><span className="font-serif text-xl italic text-[#ad9475]">{number}</span><Icon size={23} strokeWidth={1.25} className="text-[#8c7358]"/></div>
              <h3 className="font-serif text-2xl font-normal text-[#302c25]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#746d60]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#f2eadf] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="flex min-h-[300px] flex-col items-center justify-center bg-[#e4d3bc] p-8 text-center sm:min-h-[390px]">
          <div className="font-serif text-7xl italic text-[#8e6e4d]">W.</div>
          <div className="mt-5 h-px w-14 bg-[#a88a67]"/>
          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.23em] text-[#80684e]">Wood. Form. Play.</p>
        </div>
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#927352]">A work in progress, by choice</p>
          <h2 className="font-serif text-3xl font-normal leading-tight tracking-[-0.025em] sm:text-4xl">We will earn the right to say “ready”.</h2>
          <p className="mt-5 text-sm leading-7 text-[#746d60]">Our pilot catalogue brings together balance boards, stepping-play concepts, climbing pieces, ride-ons and tactile toys. The current prices are planning targets, not final supplier quotations. Images may be supplied references or concept visuals.</p>
          <div className="mt-6 space-y-4">
            {[
              'Confirm the final dimensions, material and finish.',
              'Review joinery, stability, moving parts and age suitability.',
              'Complete relevant product testing and publish accurate product information.',
            ].map((line) => <div key={line} className="flex items-start gap-3 text-sm leading-6 text-[#5f584b]"><CheckCircle2 size={17} className="mt-1 shrink-0 text-[#8c7358]"/><span>{line}</span></div>)}
          </div>
          <button type="button" onClick={() => onNavigate('all-collections')} className="mt-8 inline-flex items-center gap-3 border-b border-[#927352] pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51473a] hover:text-[#2e3d31]">See the pilot collection <ArrowRight size={14}/></button>
        </div>
      </div>
    </section>
  </main>
);
