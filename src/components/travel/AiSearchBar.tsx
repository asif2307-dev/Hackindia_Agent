import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface AiSearchBarProps {
  onAiParsedQuery?: (tab: string, from?: string, to?: string) => void;
}

export const AiSearchBar: React.FC<AiSearchBarProps> = ({ onAiParsedQuery }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const quickPrompts = [
    { label: t('search.promptFlight', '✈️ Flights Delhi to Mumbai'), tab: 'flights', from: 'Delhi', to: 'Mumbai' },
    { label: t('search.promptTrain', '🚆 Train Delhi to Varanasi'), tab: 'trains', from: 'New Delhi', to: 'Varanasi' },
    { label: t('search.promptHotel', '🏨 Luxury Beach Resorts in Goa'), tab: 'hotels', from: 'Goa', to: '' },
    { label: t('search.promptBus', '🚌 Volvo Bus to Manali'), tab: 'buses', from: 'Delhi', to: 'Manali' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const lower = query.toLowerCase();
    let detectedTab = 'flights';
    let detectedFrom = 'Delhi';
    let detectedTo = 'Mumbai';

    if (lower.includes('train') || lower.includes('rail') || lower.includes('vande')) {
      detectedTab = 'trains';
      if (lower.includes('varanasi')) detectedTo = 'Varanasi';
    } else if (lower.includes('hotel') || lower.includes('resort') || lower.includes('stay')) {
      detectedTab = 'hotels';
      if (lower.includes('goa')) detectedFrom = 'Goa';
    } else if (lower.includes('bus') || lower.includes('volvo')) {
      detectedTab = 'buses';
      if (lower.includes('manali')) detectedTo = 'Manali';
    } else if (lower.includes('holiday') || lower.includes('package') || lower.includes('tour')) {
      detectedTab = 'holidays';
    } else if (lower.includes('cab') || lower.includes('taxi')) {
      detectedTab = 'cabs';
    }

    if (lower.includes('mumbai') && lower.includes('delhi')) {
      detectedFrom = 'Delhi';
      detectedTo = 'Mumbai';
    } else if (lower.includes('bangalore') || lower.includes('blr')) {
      detectedTo = 'Bengaluru';
    }

    setFeedback(`AI Assistant: Configured ${detectedTab.toUpperCase()} search for "${query.trim()}" with instant disruption protection.`);
    onAiParsedQuery?.(detectedTab, detectedFrom, detectedTo);

    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const handleQuickPromptClick = (p: typeof quickPrompts[0]) => {
    setQuery(p.label.replace(/^[^\s]+\s/, ''));
    setFeedback(`AI Assistant: Switched to ${p.tab.toUpperCase()} booking mode.`);
    onAiParsedQuery?.(p.tab, p.from, p.to);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 flex flex-col items-center">
      {/* Search Input Bar */}
      <form 
        onSubmit={handleSearch}
        className={`w-full relative flex items-center bg-white/95 backdrop-blur-md rounded-full p-2 sm:p-2.5 shadow-2xl border-2 transition-all duration-300 ${
          isFocused ? 'border-[#006D77] ring-4 ring-[#006D77]/20 bg-white' : 'border-[#C2EAE7] hover:border-[#20B8B0]'
        }`}
      >
        {/* AI Sparkle Badge */}
        <div className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-[#EAF8F7] text-[#006D77] font-bold text-xs shrink-0 select-none border border-[#BCE8E4]">
          <span className="material-symbols-outlined text-[18px] text-[#E8B86D]">auto_awesome</span>
          <span className="hidden sm:inline font-['Plus_Jakarta_Sans'] font-extrabold tracking-wide">{t('search.button', 'AI Search')}</span>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t('search.placeholder', 'Find flights, trains, buses, hotels, or your next holiday destination...')}
          className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-[#17324D] placeholder-gray-400 font-medium focus:outline-none"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#006D77] via-[#007b86] to-[#00565E] hover:from-[#00565E] hover:to-[#004349] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">travel_explore</span>
          <span>{t('search.button', 'AI Search')}</span>
        </button>
      </form>

      {/* Natural Language Prompt Chips */}
      <div className="flex items-center gap-2 mt-3 flex-wrap justify-center text-xs">
        <span className="text-white/90 font-semibold text-[11px] flex items-center gap-1 drop-shadow-sm">
          <span className="material-symbols-outlined text-[14px] text-[#E8B86D]">lightbulb</span>
          {t('search.try', 'Try:')}
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPromptClick(p)}
            className="px-3 py-1 rounded-full bg-black/35 hover:bg-black/50 border border-white/30 text-white text-[11px] font-semibold transition-all backdrop-blur-sm cursor-pointer shadow-sm"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="mt-3 px-4 py-2 rounded-xl bg-[#EAF8F7] text-[#006D77] border border-[#20B8B0] text-xs font-bold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
