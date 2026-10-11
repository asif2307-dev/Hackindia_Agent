import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface FloatingSectionNavProps {
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const FloatingSectionNav: React.FC<FloatingSectionNavProps> = ({
  activeSection,
  onNavigateSection,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in select-none">
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#0d283e]/90 backdrop-blur-xl border border-[#20B8B0]/30 shadow-[0_12px_40px_rgba(0,109,119,0.35)]">
        <button
          type="button"
          onClick={() => onNavigateSection('how-it-works')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'how-it-works'
              ? 'bg-white text-[#17324D] shadow-md scale-105'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">help_center</span>
          <span>{t('nav.howItWorks', 'How It Works')}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSection('features')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'features'
              ? 'bg-white text-[#17324D] shadow-md scale-105'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">featured_play_list</span>
          <span>{t('nav.features', 'Features')}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSection('refund-engine')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'refund-engine'
              ? 'bg-gradient-to-r from-[#E8B86D] to-[#d9a552] text-[#0d283e] shadow-md scale-105 font-black'
              : 'text-[#E8B86D] hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
          <span>{t('nav.refundEngine', 'Refund Engine')}</span>
        </button>
      </div>
    </div>
  );
};
