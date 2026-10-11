import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const AiRefundHero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div 
      id="ai-refund-hero" 
      className="w-full bg-transparent pt-2 sm:pt-4 pb-6 sm:pb-8 px-4 sm:px-6 text-center select-none"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Pill Badge with Green Status Dot */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-4 sm:mb-5 transition-transform hover:scale-102">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5bb318] shrink-0 shadow-[0_0_8px_rgba(91,179,24,0.6)]" />
          <span className="text-xs sm:text-[13px] font-semibold text-gray-800 tracking-normal">
            {t('refundHero.badge', 'AI-Assisted Autonomous Travel Disruption Arbitration')}
          </span>
        </div>

        {/* Large Centered Heading with Green-to-Blue-Violet Accent */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-[#0f172a] leading-[1.18] mb-3 sm:mb-4 font-['Plus_Jakarta_Sans',Inter,sans-serif] drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
          <span>{t('refundHero.title', 'Your Travel Refund,')} </span>
          <span className="text-[#2d6a2e]">{t('refundHero.simplified', 'Simplified')} </span>
          <span className="text-[#475569]">{t('refundHero.by', 'by')} </span>
          <span className="text-[#3b4998]">{t('refundHero.ai', 'AI.')}</span>
        </h1>

        {/* Centered Explanatory Paragraph */}
        <p className="text-sm sm:text-base md:text-[17px] text-[#1e293b] max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          {t(
            'refundHero.description',
            'Get refunds for cancelled or disrupted travel bookings with help from AI. We check your booking, cancellation details, and refund policy to recommend the right refund action.'
          )}
        </p>
      </div>
    </div>
  );
};
