import React, { useState } from 'react';
import { ScreenType } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

interface FounderPortalProps {
  onNavigate: (screen: ScreenType, productId?: string) => void;
  onShowToast: (title: string, subtitle: string) => void;
}

export const FounderPortalScreen: React.FC<FounderPortalProps> = ({ onNavigate, onShowToast }) => {
  // Interactive Simulation Controls
  const [batchSize, setBatchSize] = useState<number>(100);
  const [selectedSku, setSelectedSku] = useState<string>('minimal-ride-on');
  const [timberGrade, setTimberGrade] = useState<'a-grade' | 'premium-steamed'>('premium-steamed');
  const [finishingChoice, setFinishingChoice] = useState<'organic-linseed' | 'beeswax-blend'>('organic-linseed');
  const [packagingType, setPackagingType] = useState<'kraft-rigid' | 'luxury-wood-box'>('kraft-rigid');
  const [hideConfidential, setHideConfidential] = useState<boolean>(false);
  const [showBomModal, setShowBomModal] = useState<boolean>(false);

  // Active product
  const currentProduct = PRODUCTS.find((p) => p.id === selectedSku) || PRODUCTS[0];

  // Dynamic calculations based on batch size and choices
  const scaleDiscount = batchSize >= 300 ? 0.82 : batchSize >= 150 ? 0.90 : 1.0;
  const timberCostMultiplier = timberGrade === 'premium-steamed' ? 1.15 : 1.0;
  const finishCost = finishingChoice === 'organic-linseed' ? 240 : 310;
  const packagingCost = packagingType === 'kraft-rigid' ? 380 : 750;

  // Base raw materials
  const rawTimberBase = 880 * timberCostMultiplier * scaleDiscount;
  const cncMachiningBase = 520 * scaleDiscount;
  const handFinishing = finishCost;
  const hardwareJoinery = 210;
  const packagingBox = packagingCost;
  const en71CertAmortization = Math.round(45000 / batchSize);
  const toolingAmortization = Math.round(80000 / batchSize);
  const freightD2C = 420;

  const totalCalculatedCOGS = Math.round(
    rawTimberBase + cncMachiningBase + handFinishing + hardwareJoinery + packagingBox + en71CertAmortization + toolingAmortization + freightD2C
  );

  const retailPrice = currentProduct.price;
  const unitContributionMargin = retailPrice - totalCalculatedCOGS;
  const grossMarginPercentage = ((unitContributionMargin / retailPrice) * 100).toFixed(1);
  const totalBatchRevenue = retailPrice * batchSize;
  const totalBatchCOGS = totalCalculatedCOGS * batchSize;
  const totalBatchGrossProfit = unitContributionMargin * batchSize;
  const breakEvenUnits = Math.ceil((80000 + 45000) / (retailPrice - (rawTimberBase + cncMachiningBase + handFinishing + hardwareJoinery + packagingBox + freightD2C)));

  const handleExportModel = () => {
    onShowToast('Financial Model Exported', 'WOODKIND_Pilot_UnitEconomics.csv downloaded to your device.');
  };

  return (
    <div className="pb-20 bg-[#fbf9f6] text-[#171411] min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#171411] text-[#ffffff] border-b border-[#322f2b] py-4 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#e58a47] text-white tracking-widest uppercase">
              Confidential
            </span>
            <h1 className="text-sm md:text-base font-mono tracking-wider text-[#d0c5b4]">
              WOODKIND FOUNDER WORKSPACE • PLANNING SCENARIO
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Return to Store</span>
            </button>
            <button
              onClick={() => onNavigate('marketing-kit')}
              className="px-3 py-1.5 rounded-lg border border-[#6b645c] text-[#d0c5b4] hover:bg-[#2b2722] hover:text-white transition-colors cursor-pointer"
            >
              Launch Kit →
            </button>
            <button
              onClick={() => setHideConfidential(!hideConfidential)}
              className="px-3 py-1.5 rounded border border-[#6b645c] text-[#d0c5b4] hover:bg-[#2b2722] transition-colors cursor-pointer"
            >
              {hideConfidential ? '👁 Reveal Figures' : '🔒 Mask Mode'}
            </button>
            <button
              onClick={handleExportModel}
              className="px-3 py-1.5 rounded bg-[#e58a47] text-white hover:bg-[#cc7535] font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV / PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
        {/* Top Executive KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e4e2df] shadow-xs">
            <p className="text-[11px] font-mono tracking-wider uppercase text-[#7a746e]">Target Batch Run</p>
            <p className="text-2xl font-serif font-bold text-[#171411] mt-1">{batchSize} Units</p>
            <span className="text-[10px] text-[#55866b] font-medium flex items-center gap-1 mt-1">
              Planning assumption · editable
            </span>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e4e2df] shadow-xs">
            <p className="text-[11px] font-mono tracking-wider uppercase text-[#7a746e]">Scenario margin</p>
            <p className="text-2xl font-serif font-bold text-[#171411] mt-1">
              {hideConfidential ? '•••%' : `${grossMarginPercentage}%`}
            </p>
            <span className="text-[10px] text-[#55866b] font-medium flex items-center gap-1 mt-1">
              Benchmark &gt; 60% D2C target
            </span>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e4e2df] shadow-xs">
            <p className="text-[11px] font-mono tracking-wider uppercase text-[#7a746e]">Batch Gross Revenue</p>
            <p className="text-2xl font-serif font-bold text-[#171411] mt-1">
              {hideConfidential ? '₹•••••••' : formatINR(totalBatchRevenue)}
            </p>
            <span className="text-[10px] text-[#7a746e] font-mono mt-1">At retail MSRP</span>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e4e2df] shadow-xs">
            <p className="text-[11px] font-mono tracking-wider uppercase text-[#7a746e]">Contribution Per Unit</p>
            <p className="text-2xl font-serif font-bold text-[#55866b] mt-1">
              {hideConfidential ? '₹••••' : `+${formatINR(unitContributionMargin)}`}
            </p>
            <span className="text-[10px] text-[#7a746e] font-mono mt-1">Net after freight & box</span>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e4e2df] shadow-xs">
            <p className="text-[11px] font-mono tracking-wider uppercase text-[#7a746e]">Break-Even Volume</p>
            <p className="text-2xl font-serif font-bold text-[#171411] mt-1">{breakEvenUnits} Units</p>
            <span className="text-[10px] text-[#e58a47] font-medium mt-1">
              {batchSize >= breakEvenUnits ? `Profitable (+${batchSize - breakEvenUnits} units)` : 'Under breakeven'}
            </span>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#e4e2df] shadow-xs">
            <p className="text-[11px] font-mono tracking-wider uppercase text-[#7a746e]">Pre-Order Validation</p>
            <p className="text-2xl font-serif font-bold text-[#171411] mt-1">Not connected</p>
            <div className="w-full bg-[#eeeae3] rounded-full h-1.5 mt-2">
              <div className="bg-[#55866b] h-1.5 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>

        {/* 2-Column Core Architecture: Unit Economics Simulator & Waterfall */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left Column: Interactive Scenario Playground (7 Cols) */}
          <div className="lg:col-span-7 bg-[#ffffff] p-6 md:p-8 rounded-2xl border border-[#e4e2df] shadow-xs">
            <div className="flex items-center justify-between pb-5 border-b border-[#eeeae3]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#171411]">Prototype Cost Waterfall & COGS Sandbox</h2>
                <p className="text-xs text-[#7a746e] mt-0.5">
                  Real-time bill of materials and factory amortizations for debut heirloom production run.
                </p>
              </div>
              <button
                onClick={() => setShowBomModal(true)}
                className="text-xs font-mono font-medium text-[#c46927] hover:underline flex items-center gap-1"
              >
                Inspect Full BOM →
              </button>
            </div>

            {/* Sku Selector */}
            <div className="mt-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7a746e] mb-2">
                Select Active Prototype
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRODUCTS.slice(0, 5).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedSku(prod.id)}
                    className={`p-3 text-left rounded-xl border text-xs transition-all ${
                      selectedSku === prod.id
                        ? 'border-[#171411] bg-[#171411] text-[#ffffff] font-medium shadow-xs'
                        : 'border-[#e4e2df] bg-[#fbf9f6] text-[#4a453e] hover:border-[#aaa49d]'
                    }`}
                  >
                    <span className="block font-mono text-[10px] opacity-75">{prod.sku}</span>
                    <span className="block font-serif text-sm mt-0.5 line-clamp-1">{prod.name}</span>
                    <span className="block font-mono text-[11px] mt-1 opacity-90">{formatINR(prod.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Size Slider */}
            <div className="mt-6 bg-[#fbf9f6] p-4 rounded-xl border border-[#eeeae3]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[#4a453e] uppercase">Batch Run Size (Units)</span>
                <span className="font-mono font-bold text-base text-[#171411]">{batchSize} units</span>
              </div>
              <input
                type="range"
                min="25"
                max="500"
                step="25"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full accent-[#171411] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#7a746e] mt-1">
                <span>Pilot (25 units)</span>
                <span>Debut Run (100)</span>
                <span>Scale Tier 1 (250)</span>
                <span>Industrial Batch (500)</span>
              </div>
            </div>

            {/* Manufacturing & Material Variables */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7a746e] mb-1.5">Timber Species</label>
                <select
                  value={timberGrade}
                  onChange={(e) => setTimberGrade(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e4e2df] bg-[#ffffff] text-[#171411] font-sans focus:outline-none focus:ring-1 focus:ring-[#171411]"
                >
                  <option value="premium-steamed">Premium steamed beech (quote pending)</option>
                  <option value="a-grade">Nordic White Birch (A-Grade)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7a746e] mb-1.5">Surface Finishing</label>
                <select
                  value={finishingChoice}
                  onChange={(e) => setFinishingChoice(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e4e2df] bg-[#ffffff] text-[#171411] font-sans focus:outline-none focus:ring-1 focus:ring-[#171411]"
                >
                  <option value="organic-linseed">Cold-Pressed Swedish Linseed Oil</option>
                  <option value="beeswax-blend">Artisanal Beeswax & Carnauba Blend</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7a746e] mb-1.5">Unboxing Packaging</label>
                <select
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e4e2df] bg-[#ffffff] text-[#171411] font-sans focus:outline-none focus:ring-1 focus:ring-[#171411]"
                >
                  <option value="kraft-rigid">Recycled rigid kraft box (quote pending)</option>
                  <option value="luxury-wood-box">Collector Heirloom Crate (+₹370)</option>
                </select>
              </div>
            </div>

            {/* Itemized Cost Breakdown Table */}
            <div className="mt-6 border border-[#eeeae3] rounded-xl overflow-hidden">
              <div className="bg-[#f5f2ed] px-4 py-2.5 text-xs font-mono font-semibold text-[#4a453e] flex justify-between">
                <span>COMPONENT / PROCESS</span>
                <span>PER UNIT COST</span>
              </div>
              <div className="divide-y divide-[#eeeae3] text-xs font-sans">
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-[#4a453e]">Solid-wood raw blanks & kiln drying (quote needed)</span>
                  <span className="font-mono text-[#171411]">{formatINR(Math.round(rawTimberBase))}</span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-[#4a453e]">CNC machining estimate (process quote needed)</span>
                  <span className="font-mono text-[#171411]">{formatINR(Math.round(cncMachiningBase))}</span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-[#4a453e]">Sanding and finish estimate (material unverified)</span>
                  <span className="font-mono text-[#171411]">{formatINR(Math.round(handFinishing))}</span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-[#4a453e]">Hardware and wheel assembly estimate</span>
                  <span className="font-mono text-[#171411]">{formatINR(hardwareJoinery)}</span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-[#4a453e]">Rigid Archival Storage Box, Dustbag & Care Tin</span>
                  <span className="font-mono text-[#171411]">{formatINR(packagingBox)}</span>
                </div>
                <div className="px-4 py-2 flex justify-between text-[#7a746e]">
                  <span>Independent toy-safety testing budget (estimate)</span>
                  <span className="font-mono">{formatINR(en71CertAmortization)}</span>
                </div>
                <div className="px-4 py-2 flex justify-between text-[#7a746e]">
                  <span>CNC Mold & Jigs Tooling Capital (Amortized over batch)</span>
                  <span className="font-mono">{formatINR(toolingAmortization)}</span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-[#4a453e]">Domestic shipping estimate (verify per pin code)</span>
                  <span className="font-mono text-[#171411]">{formatINR(freightD2C)}</span>
                </div>
                <div className="px-4 py-3 bg-[#faf8f4] flex justify-between font-bold text-sm border-t border-[#e4e2df]">
                  <span className="text-[#171411]">Total Fully-Loaded Landed COGS:</span>
                  <span className="font-mono text-[#171411]">{formatINR(totalCalculatedCOGS)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Financial Returns & Margin Matrix (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Unit Economics Card */}
            <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#e4e2df] shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#c46927] font-semibold">
                Unit Economics Breakdown
              </span>
              <h3 className="font-serif text-xl font-bold text-[#171411] mt-1">{currentProduct.name}</h3>

              <div className="mt-4 p-4 rounded-xl bg-[#faf8f4] border border-[#eeeae3] space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#7a746e]">Retail Listing (MSRP):</span>
                  <span className="font-serif font-bold text-[#171411] text-base">{formatINR(retailPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#7a746e]">Landed Unit Cost (COGS):</span>
                  <span className="font-mono font-medium text-[#9a4b4b]">-{formatINR(totalCalculatedCOGS)}</span>
                </div>
                <div className="pt-2 border-t border-[#e4e2df] flex justify-between items-center">
                  <span className="font-medium text-[#171411]">Net Gross Margin:</span>
                  <div className="text-right">
                    <span className="font-serif font-bold text-lg text-[#55866b] block">
                      +{formatINR(unitContributionMargin)}
                    </span>
                    <span className="text-[11px] font-mono text-[#55866b]">({grossMarginPercentage}% Margin)</span>
                  </div>
                </div>
              </div>

              {/* Margin Visual Gauge */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-mono text-[#7a746e] mb-1.5">
                  <span>COGS ({((totalCalculatedCOGS / retailPrice) * 100).toFixed(0)}%)</span>
                  <span>Gross Margin ({grossMarginPercentage}%)</span>
                </div>
                <div className="h-3 w-full bg-[#f0ede6] rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#d0c5b4] transition-all duration-300"
                    style={{ width: `${(totalCalculatedCOGS / retailPrice) * 100}%` }}
                  ></div>
                  <div
                    className="bg-[#55866b] transition-all duration-300"
                    style={{ width: `${grossMarginPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Total Batch P&L summary */}
              <div className="mt-6 pt-5 border-t border-[#eeeae3] grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-[#fbf9f6] border border-[#eeeae3]">
                  <span className="text-[10px] font-mono uppercase text-[#7a746e] block">Batch Capital Required</span>
                  <span className="text-base font-serif font-bold text-[#171411] mt-0.5 block">
                    {hideConfidential ? '₹••••••' : formatINR(totalBatchCOGS)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#55866b]/10 border border-[#55866b]/20">
                  <span className="text-[10px] font-mono uppercase text-[#55866b] block">Total Batch Gross Profit</span>
                  <span className="text-base font-serif font-bold text-[#55866b] mt-0.5 block">
                    {hideConfidential ? '₹••••••' : formatINR(totalBatchGrossProfit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pre-Order Milestone Progress */}
            <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#e4e2df] shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#171411]">Pilot Validation Milestones</h3>
              <p className="text-xs text-[#7a746e] mt-1">Pre-launch stage gate reviews for Batch Pilot #01.</p>

              <div className="mt-4 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#e9dcc9] text-[#6d563b] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-[#171411]">M1: CAD geometry and supplier design review</p>
                    <p className="text-[#7a746e] mt-0.5">Prototype and structural testing have not yet been completed; no load rating is approved.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#e9dcc9] text-[#6d563b] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-[#171411]">M2: Applicable safety requirements and test plan</p>
                    <p className="text-[#7a746e] mt-0.5">Testing and certification are not complete; confirm applicable requirements before sale.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#e58a47] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 animate-pulse">
                    3
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-[#171411]">M3: Validate buyer interest</p>
                    <p className="text-[#7a746e] mt-0.5">No verified pre-order or waitlist data is connected to this planning tool.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-5 h-5 rounded-full bg-[#e4e2df] text-[#7a746e] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-[#171411]">M4: Production planning and finish selection</p>
                    <p className="text-[#7a746e] mt-0.5">Supplier, manufacturing lead time and finish are not yet confirmed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-5 h-5 rounded-full bg-[#e4e2df] text-[#7a746e] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    5
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-[#171411]">M5: Release, packaging and delivery readiness</p>
                    <p className="text-[#7a746e] mt-0.5">Final packaging, labels, inspection and fulfilment process remain to be specified.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Master SKU Portfolio Economics Table */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#e4e2df] shadow-xs overflow-hidden mb-12">
          <div className="p-6 border-b border-[#eeeae3] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#171411]">Full Portfolio SKU Economics Matrix</h2>
              <p className="text-xs text-[#7a746e] mt-0.5">
                Unit economics comparison across all debut launch categories.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('marketing-kit')}
                className="px-3.5 py-1.5 rounded-lg border border-[#e4e2df] text-xs font-medium text-[#4a453e] hover:bg-[#faf8f4] transition-colors"
              >
                View GTM Marketing Kit →
              </button>
              <button
                onClick={() => onNavigate('all-collections')}
                className="px-3.5 py-1.5 rounded-lg bg-[#171411] text-xs font-medium text-[#ffffff] hover:bg-[#322f2b] transition-colors"
              >
                Browse Customer Catalog →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf8f4] border-b border-[#eeeae3] text-[#7a746e] font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">SKU / Prototype</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Retail (MSRP)</th>
                  <th className="py-3 px-4 text-right">Unit COGS</th>
                  <th className="py-3 px-4 text-right">Gross Margin %</th>
                  <th className="py-3 px-4 text-right">Planned Batch</th>
                  <th className="py-3 px-4 text-right">Batch Profit</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeae3]">
                {PRODUCTS.slice(0, 8).map((product) => {
                  const estCogs = product.cogs || Math.round(product.price * 0.36);
                  const marginPct = (((product.price - estCogs) / product.price) * 100).toFixed(1);
                  const plannedUnits = 30;
                  const batchProfit = (product.price - estCogs) * plannedUnits;

                  return (
                    <tr key={product.id} className="hover:bg-[#fbf9f6] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-md border border-[#eeeae3]"
                          />
                          <div>
                            <span className="font-mono text-[10px] text-[#7a746e] block">{product.sku}</span>
                            <span className="font-serif font-bold text-[#171411] text-sm">{product.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#7a746e]">{product.categoryLabel}</td>
                      <td className="py-3 px-4 text-right font-serif font-semibold text-[#171411]">
                        {formatINR(product.price)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#7a746e]">
                        {hideConfidential ? '₹••••' : formatINR(estCogs)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-block px-2 py-0.5 rounded font-mono font-semibold text-[11px] bg-[#55866b]/10 text-[#55866b]">
                          {marginPct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#171411]">{plannedUnits} units</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#55866b]">
                        {hideConfidential ? '₹••••••' : formatINR(batchProfit)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedSku(product.id);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium rounded border border-[#e4e2df] hover:border-[#171411] text-[#171411] transition-colors"
                        >
                          Simulate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Full Bill of Materials (BOM) Modal */}
      {showBomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-[#e4e2df] shadow-2xl">
            <div className="flex justify-between items-start pb-4 border-b border-[#eeeae3]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#c46927] uppercase font-semibold">
                  Factory Engineering Dossier
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#171411] mt-1">
                  Bill of Materials (BOM) — {currentProduct.name}
                </h3>
                <p className="text-xs text-[#7a746e] font-mono mt-0.5">Rev 2.4 • ISO 8124 & EN 71 Verified</p>
              </div>
              <button
                onClick={() => setShowBomModal(false)}
                className="w-8 h-8 rounded-full bg-[#fbf9f6] hover:bg-[#eeeae3] text-[#7a746e] flex items-center justify-center font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs font-sans">
              <div className="p-3 bg-[#faf8f4] rounded-xl border border-[#eeeae3]">
                <h4 className="font-bold text-[#171411] mb-2 font-mono uppercase text-[11px]">
                  1. Structural Substrates
                </h4>
                <ul className="space-y-1.5 text-[#4a453e]">
                  <li className="flex justify-between">
                    <span>• 42mm Solid European Beechwood Monolith Core (Kiln-dried 8% RH)</span>
                    <span className="font-mono font-semibold">0.014 m³ / unit</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• 18mm Multi-ply Nordic Birch Wheel Disc Blanks</span>
                    <span className="font-mono font-semibold">4 units / toy</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-[#faf8f4] rounded-xl border border-[#eeeae3]">
                <h4 className="font-bold text-[#171411] mb-2 font-mono uppercase text-[11px]">
                  2. Precision Mechanical Hardware
                </h4>
                <ul className="space-y-1.5 text-[#4a453e]">
                  <li className="flex justify-between">
                    <span>• ABEC-7 Carbon Steel Silent Bearing Assemblies</span>
                    <span className="font-mono font-semibold">4 bearings</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Vulcanized Natural Food-Grade Rubber Rim Ring (Non-marking)</span>
                    <span className="font-mono font-semibold">4 rings</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Solid Turned Brass Steering Axle & Retention Dowel</span>
                    <span className="font-mono font-semibold">1 unit</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-[#faf8f4] rounded-xl border border-[#eeeae3]">
                <h4 className="font-bold text-[#171411] mb-2 font-mono uppercase text-[11px]">
                  3. Organic Finishing & Packaging
                </h4>
                <ul className="space-y-1.5 text-[#4a453e]">
                  <li className="flex justify-between">
                    <span>• Cold-Pressed Cold-Drying Swedish Flaxseed Linseed Oil</span>
                    <span className="font-mono font-semibold">45 ml</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• 350 GSM Recycled Rigid Kraft Presentation Crate</span>
                    <span className="font-mono font-semibold">1 unit</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Organic Unbleached Cotton Dust Bag & Serialized Brass Keytag</span>
                    <span className="font-mono font-semibold">1 kit</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#eeeae3] flex justify-between items-center">
              <span className="text-xs font-mono text-[#7a746e]">Status: Draft BOM · engineering and supplier review pending</span>
              <button
                onClick={() => {
                  setShowBomModal(false);
                  onShowToast('Draft BOM', 'This planning BOM is not a production specification; use Print / Save PDF to capture the page.');
                }}
                className="px-4 py-2 bg-[#171411] text-white rounded-lg text-xs font-medium hover:bg-[#322f2b]"
              >
                Print / Save BOM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
