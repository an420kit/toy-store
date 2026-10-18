import React, { useState } from 'react';
import { Product } from '../types.ts';
import { PRODUCTS, formatINR } from '../data/products.ts';

interface AiGiftAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (productId: string) => void;
  onApplyEngraving?: (text: string) => void;
}

type TabType = 'milestone' | 'story' | 'chat';

export const AiGiftAdvisorModal: React.FC<AiGiftAdvisorModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onViewProduct,
  onApplyEngraving,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('milestone');

  // Milestone Finder State
  const [selectedAge, setSelectedAge] = useState<string>('1-3');
  const [selectedFocus, setSelectedFocus] = useState<string>('balance');
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(PRODUCTS[0]);
  const [aiRationale, setAiRationale] = useState<string>(
    'For 1–3 year toddlers developing bilateral balance and spatial confidence, The Minimal Ride-On promotes vestibular stimulation while silent elastomer wheels protect hardwood floors.'
  );

  // Keepsake Engraving State
  const [childName, setChildName] = useState<string>('Aria');
  const [occasion, setOccasion] = useState<string>('First Birthday');
  const [generatedStory, setGeneratedStory] = useState<string>(
    'To our dearest Aria — may these quiet wooden curves carry your first bold steps into a world of boundless wonder and laughter. Crafted in honest European beech to grow with your spirit. — With eternal love.'
  );
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: 'Hi, I’m the WOODKIND Play Guide. I can help compare pilot products, explain intended play use, and flag details that still need confirmation. I can’t assess an individual child’s development or certify product safety.',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle milestone selection and compute recommendation
  const handleCalculateRecommendation = (age: string, focus: string) => {
    setSelectedAge(age);
    setSelectedFocus(focus);

    let match: Product | undefined;
    let rationale = '';

    if (age === '0-6m') {
      match = PRODUCTS.find((p) => p.id === 'sensory-stacking-rings') || PRODUCTS[4];
      rationale =
        'For infant use, confirm age guidance, piece dimensions and small-part risks for the specific final product. WOODKIND’s pilot catalogue does not yet publish verified age ratings.';
    } else if (age === '6-12m') {
      match = PRODUCTS.find((p) => p.id === 'stacking-stones-sorter') || PRODUCTS[3];
      rationale =
        'As sitting and pincer-grasp coordination mature, organic stacking elements encourage fine motor concentration and hand-eye calibration through Montessori open-ended discovery.';
    } else if (age === '1-3' && focus === 'balance') {
      match = PRODUCTS.find((p) => p.id === 'minimal-ride-on') || PRODUCTS[0];
      rationale =
        'Toddlers taking their first independent steps need a low-center-of-gravity anchor. The Minimal Ride-On strengthens pelvic girdle balance with zero pinch-points.';
    } else if (age === '1-3' && focus === 'climbing') {
      match = PRODUCTS.find((p) => p.id === 'foldable-climber-slide') || PRODUCTS[2];
      rationale =
        'Self-directed gross motor climbing builds proprioception and safe physical risk assessment indoors, foldably stowing away in uncluttered nursery interiors.';
    } else if (age === '1-3') {
      match = PRODUCTS.find((p) => p.id === 'nordic-rocking-horse') || PRODUCTS[1];
      rationale =
        'Rhythmic rocking calms the toddler nervous system while strengthening core postural control, engineered with anti-tip curved beech runners.';
    } else if (age === '3-5') {
      match = PRODUCTS.find((p) => p.id === 'handcrafted-play-kitchen') || PRODUCTS[4];
      rationale =
        'Preschoolers engage deeply in cooperative pretend play and practical life routines. Solid joinery and soft magnetic latches inspire hours of screen-free domestic imagination.';
    } else {
      match = PRODUCTS.find((p) => p.id === 'sculptural-play-table-set') || PRODUCTS[5];
      rationale =
        'For growing children, dedicated ergonomic furniture creates a focused sanctuary for drawing, wooden building blocks, and generational quiet focus.';
    }

    setRecommendedProduct(match || PRODUCTS[0]);
    setAiRationale(rationale);
  };

  // Generate Heirloom Inscription Story
  const handleGenerateStory = () => {
    setIsGeneratingStory(true);
    setTimeout(() => {
      const templates = [
        `For dearest ${childName || 'Little One'}, inscribed on your ${occasion} — May your curious fingers trace these smooth grains, learning that the most enduring things in life are shaped with patience, warmth, and love.`,
        `To ${childName || 'our beloved child'} — Handcrafted in German beechwood for your ${occasion}. May this heirloom accompany your childhood laughter, standing sturdy through generations of bedtime stories.`,
        `Dearest ${childName || 'Child'} — In celebration of your ${occasion}. Free from noise and plastic, made purely of earth, timber, and the warmest wishes for the beautiful journey ahead.`,
      ];
      const random = templates[Math.floor(Math.random() * templates.length)];
      setGeneratedStory(random);
      setIsGeneratingStory(false);
    }, 600);
  };

  // Chat message submission
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiThinking(true);

    // Knowledge-driven pediatric response
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('finish') || q.includes('saliva') || q.includes('mouth') || q.includes('safe') || q.includes('chemical')) {
        reply =
          'WOODKIND’s pilot products are still at concept and supplier-review stages. Final materials, coatings and applicable safety test results have not been verified across the range; check the specific product status before choosing.';
      } else if (q.includes('humid') || q.includes('care') || q.includes('clean') || q.includes('maintain') || q.includes('wipe')) {
        reply =
          'Follow the care instructions supplied with the final product. Until its material and coating are confirmed, avoid applying oils or cleaners that the manufacturer has not approved.';
      } else if (q.includes('plastic') || q.includes('compare') || q.includes('wood')) {
        reply =
          'Unlike plastic toys which produce sensory fatigue from flashing diodes and synthetic odors, natural beechwood possesses natural antibacterial properties, comforting tactile warmth, and an intentional weight that anchors a child’s concentration.';
      } else if (q.includes('gift') || q.includes('recommend') || q.includes('month') || q.includes('year') || q.includes('age')) {
        reply =
          'For 0–12 months, our Sensory Stacking Rings and Arch Sorter are peerless for fine motor calibration. For 1–3 years, The Minimal Ride-On and Nordic Rocking Horse are our most revered generational investments.';
      } else {
        reply =
          'Our atelier crafts each object under strict Montessori open-ended principles. Whether encouraging vestibular balance, spatial sorting, or quiet tactile discovery, each piece is engineered with rounded safety radii (DIN EN 71-1:2018) to last across siblings and grandchildren.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAiThinking(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#171411]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#fbf9f6] rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative border border-[#cfc4bd] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e4e2df] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#171411] text-[#ffca98] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171411]">
                  WOODKIND AI Concierge
                </h3>
                <span className="bg-[#7d562d]/10 text-[#7d562d] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#7d562d]/20">
                  Play &amp; Product Guide
                </span>
              </div>
              <p className="text-xs text-[#7e756f]">
                Curating the ideal wooden milestone for intentional nurseries.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#4d4540] hover:text-[#171411] rounded-full hover:bg-[#eae8e5] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-[#e4e2df] shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('milestone')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'milestone'
                ? 'bg-[#171411] text-white shadow-sm'
                : 'text-[#4d4540] hover:bg-[#efeeeb]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">child_care</span>
            <span>Milestone Matcher</span>
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'story'
                ? 'bg-[#171411] text-white shadow-sm'
                : 'text-[#4d4540] hover:bg-[#efeeeb]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history_edu</span>
            <span>Keepsake Engraving AI</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-[#171411] text-white shadow-sm'
                : 'text-[#4d4540] hover:bg-[#efeeeb]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">forum</span>
            <span>Atelier Advisor Chat</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* TAB 1: MILESTONE MATCHER */}
          {activeTab === 'milestone' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Age Selection */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d562d] block mb-2">
                  1. Select Child's Developmental Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: '0-6m', label: '0–6 Mo', sub: 'Sensory & Grasp' },
                    { id: '6-12m', label: '6–12 Mo', sub: 'Sitting & Sorting' },
                    { id: '1-3', label: '1–3 Yrs', sub: 'Balance & Steps' },
                    { id: '3-5', label: '3–5 Yrs', sub: 'Active Climbing' },
                    { id: '5+', label: '5+ Yrs', sub: 'Pretend & Focus' },
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleCalculateRecommendation(a.id, selectedFocus)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedAge === a.id
                          ? 'border-[#171411] bg-[#171411] text-white shadow-sm'
                          : 'border-[#e4e2df] bg-[#f5f3f0] hover:bg-[#efeeeb] text-[#171411]'
                      }`}
                    >
                      <span className="text-xs font-bold block">{a.label}</span>
                      <span
                        className={`text-[10px] block ${
                          selectedAge === a.id ? 'text-[#cfc4bd]' : 'text-[#7e756f]'
                        }`}
                      >
                        {a.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Area */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d562d] block mb-2">
                  2. Desired Play &amp; Nursery Growth Focus
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'balance', label: 'Core Balance & Motion', icon: 'directions_run' },
                    { id: 'climbing', label: 'Proprioception & Climb', icon: 'stairs' },
                    { id: 'sensory', label: 'Tactile Fine Motor', icon: 'touch_app' },
                    { id: 'quiet', label: 'Open-Ended Pretend Play', icon: 'cottage' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleCalculateRecommendation(selectedAge, f.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                        selectedFocus === f.id
                          ? 'border-[#7d562d] bg-[#ffdcbd]/30 text-[#171411] font-bold'
                          : 'border-[#e4e2df] bg-[#f5f3f0] hover:bg-[#efeeeb] text-[#4d4540]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#7d562d]">
                        {f.icon}
                      </span>
                      <span className="text-xs">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Card */}
              {recommendedProduct && (
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#cfc4bd] shadow-sm space-y-4">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-[#7d562d]">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>AI Curated Heirloom Match</span>
                    </span>
                    <span className="bg-[#efeeeb] text-[#171411] px-2.5 py-0.5 rounded-full">
                      {recommendedProduct.age}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-4 aspect-square rounded-xl overflow-hidden bg-[#efeeeb] shadow-inner">
                      <img
                        src={recommendedProduct.image}
                        alt={recommendedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="sm:col-span-8 space-y-2">
                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#171411]">
                        {recommendedProduct.name}
                      </h4>
                      <p className="text-xs text-[#7d562d] font-semibold">
                        {recommendedProduct.categoryLabel} • {recommendedProduct.timber}
                      </p>
                      <div className="p-3 bg-[#fbf9f6] rounded-xl border border-[#e4e2df] text-xs text-[#4d4540] leading-relaxed">
                        <span className="font-bold text-[#171411]">Play idea: </span>
                        {aiRationale}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-serif text-2xl font-bold text-[#171411]">
                          {formatINR(recommendedProduct.price)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onViewProduct(recommendedProduct.id);
                              onClose();
                            }}
                            className="px-3.5 py-2 rounded-xl border border-[#cfc4bd] hover:bg-[#eae8e5] text-xs font-semibold text-[#171411] transition-colors cursor-pointer"
                          >
                            View Specs
                          </button>
                          <button
                            onClick={() => {
                              onAddToCart(recommendedProduct);
                              onClose();
                            }}
                            className="px-4 py-2 rounded-xl bg-[#171411] hover:bg-[#7d562d] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              shopping_bag
                            </span>
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KEEPSAKE ENGRAVING STORYTELLER */}
          {activeTab === 'story' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-[#f5f3f0] rounded-xl border border-[#e4e2df] space-y-3">
                <p className="text-xs text-[#4d4540] leading-relaxed">
                  Personalisation is a possible future feature; it is not confirmed for the pilot range. Enter
                  the child’s details to generate an evocative letterpress dedication card for their
                  unboxing dossier.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d562d] block mb-1">
                      Child's Name / Monogram
                    </label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Leo, Aria, Kabir"
                      className="w-full bg-white px-3 py-2 rounded-lg text-sm text-[#171411] border border-[#e4e2df] focus:outline-none focus:ring-1 focus:ring-[#7d562d]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d562d] block mb-1">
                      Celebration Occasion
                    </label>
                    <input
                      type="text"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      placeholder="e.g. 1st Birthday, Baby Shower, Naming Ceremony"
                      className="w-full bg-white px-3 py-2 rounded-lg text-sm text-[#171411] border border-[#e4e2df] focus:outline-none focus:ring-1 focus:ring-[#7d562d]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleGenerateStory}
                    disabled={isGeneratingStory}
                    className="bg-[#171411] hover:bg-[#7d562d] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isGeneratingStory ? 'hourglass_top' : 'auto_fix_high'}
                    </span>
                    <span>
                      {isGeneratingStory ? 'Generating Poetry...' : 'Generate Inscription'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Inscription Dossier Display */}
              <div className="p-6 bg-white rounded-2xl border border-[#cfc4bd] shadow-sm relative overflow-hidden">
                <div className="absolute top-2 right-4 text-[#efeeeb] select-none pointer-events-none font-serif text-7xl font-bold">
                  “
                </div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-[#7d562d] pb-2 border-b border-[#f5f3f0]">
                  <span className="material-symbols-outlined text-[16px]">draw</span>
                  <span>Letterpress Inscription for 350 GSM Cotton Card</span>
                </div>
                <p className="font-serif italic text-base sm:text-lg text-[#171411] leading-relaxed pt-3">
                  {generatedStory}
                </p>

                <div className="mt-4 pt-3 border-t border-[#f5f3f0] flex items-center justify-between">
                  <span className="text-[11px] text-[#7e756f]">
                    Laser etching depth: 0.3mm into solid beechwood
                  </span>
                  {onApplyEngraving && (
                    <button
                      onClick={() => {
                        onApplyEngraving(childName);
                        onClose();
                      }}
                      className="bg-[#7d562d] hover:bg-[#171411] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Apply "{childName}" to My Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATELIER ADVISOR CHAT */}
          {activeTab === 'chat' && (
            <div className="space-y-3 flex flex-col h-[340px] animate-in fade-in duration-200">
              {/* Quick Prompts */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {[
                  'Is the beechwood saliva-safe for teething?',
                  'How to clean wood in humid climates?',
                  'Why avoid battery & plastic toys?',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#4d4540] px-3 py-1 rounded-full whitespace-nowrap border border-[#e4e2df] transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-white rounded-xl border border-[#e4e2df]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#171411] text-white rounded-br-none shadow-sm'
                          : 'bg-[#f5f3f0] text-[#171411] rounded-bl-none border border-[#e4e2df]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-[#7e756f] mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-1.5 text-xs text-[#7d562d] p-2 bg-[#fbf9f6] rounded-xl border border-[#e4e2df] w-fit">
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      progress_activity
                    </span>
                    <span>Consulting pediatric archives...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask any question about toy safety, timber, or age suitability..."
                  className="flex-1 bg-white px-4 py-2.5 rounded-xl text-xs text-[#171411] border border-[#cfc4bd] focus:outline-none focus:ring-1 focus:ring-[#7d562d]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAiThinking}
                  className="bg-[#171411] hover:bg-[#7d562d] disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
