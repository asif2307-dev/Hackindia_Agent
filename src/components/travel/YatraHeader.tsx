import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

interface YatraHeaderProps {
  activeSection?: string;
  onNavigateSection: (sectionId: string) => void;
}

export const YatraHeader: React.FC<YatraHeaderProps> = ({
  activeSection,
  onNavigateSection,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#0a1e2e] text-white shadow-lg sticky top-0 z-50">
      {/* Top Utility Strip */}
      <div className="border-b border-white/10 bg-black/20 text-[11px] font-medium tracking-wide">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 text-white/80 shrink-0">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[14px] text-[#E8B86D]">verified</span>
              {t('nav.certified', 'Govt. Certified Travel & Refund Arbitration')}
            </span>
            <span className="hidden sm:inline-block text-white/30">•</span>
            <span className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[14px] text-[#E8B86D]">support_agent</span>
              {t('nav.support', '24x7 Priority Support: 1800-419-7466')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-white/85 flex-wrap justify-end">
            <button
              onClick={() => navigate('/bookings')}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Audited Bookings Ledger"
            >
              <span className="material-symbols-outlined text-[14px]">airplane_ticket</span>
              <span>{t('nav.myBookings', 'My Bookings')}</span>
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Refund Risk Console"
            >
              <span className="material-symbols-outlined text-[14px]">shield_with_heart</span>
              <span>{t('nav.refundConsole', 'Refund Console')}</span>
            </button>
            <span className="hidden sm:inline-block text-white/30">•</span>
            <button
              onClick={() => navigate('/refund-investigations')}
              className="hidden sm:flex hover:text-white transition-colors items-center gap-1 cursor-pointer"
              title="Refund Investigations & Disputes"
            >
              <span className="material-symbols-outlined text-[14px]">policy</span>
              <span>{t('nav.investigations', 'Refund Investigations')}</span>
            </button>
            <span className="hidden md:inline-block text-white/30">•</span>
            <button
              onClick={() => navigate('/reviews')}
              className="hidden md:flex hover:text-white transition-colors items-center gap-1 cursor-pointer"
              title="Human Auditor Reviews"
            >
              <span className="material-symbols-outlined text-[14px]">rate_review</span>
              <span>{t('nav.reviews', 'Reviews')}</span>
            </button>
            <span className="hidden lg:inline-block text-white/30">•</span>
            <button
              onClick={() => navigate('/analytics')}
              className="hidden lg:flex hover:text-white transition-colors items-center gap-1 cursor-pointer"
              title="Restitution & Recovery Analytics"
            >
              <span className="material-symbols-outlined text-[14px]">monitoring</span>
              <span>{t('nav.analytics', 'Analytics')}</span>
            </button>
            <span className="hidden xl:inline-block text-white/30">•</span>
            <button
              onClick={() => navigate('/settings')}
              className="hidden xl:flex hover:text-white transition-colors items-center gap-1 cursor-pointer"
              title="Platform Settings & Rules"
            >
              <span className="material-symbols-outlined text-[14px]">settings</span>
              <span>{t('nav.settings', 'Settings')}</span>
            </button>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1 font-semibold text-[#E8B86D]">
              <span className="material-symbols-outlined text-[13px]">currency_rupee</span>
              {t('nav.currency', 'INR (₹)')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate('/');
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#20B8B0] via-[#006D77] to-white p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d283e] rounded-[14px] flex items-center justify-center text-[#E8B86D] font-extrabold text-base">
              AT
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Agent Travel
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#E8B86D] text-[#0d283e] shadow-sm">
                YATRA
              </span>
            </div>
            <span className="text-[10px] text-white/70 font-medium tracking-wide -mt-0.5">
              AI-Powered Travel & Autonomous Refunds
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-inner">
          <button
            onClick={() => onNavigateSection('how-it-works')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeSection === 'how-it-works'
                ? 'bg-white text-[#17324D] shadow-md font-bold'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('nav.howItWorks', 'How It Works')}
          </button>

          <button
            onClick={() => onNavigateSection('features')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeSection === 'features'
                ? 'bg-white text-[#17324D] shadow-md font-bold'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('nav.features', 'Features')}
          </button>

          <button
            onClick={() => onNavigateSection('refund-engine')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1 cursor-pointer ${
              activeSection === 'refund-engine'
                ? 'bg-[#20B8B0] text-[#0d283e] shadow-md font-bold'
                : 'text-[#E8B86D] hover:text-[#f3caa1] hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">auto_fix_high</span>
            {t('nav.refundEngine', 'Refund Engine')}
          </button>

          <button
            onClick={() => onNavigateSection('special-offers')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeSection === 'special-offers'
                ? 'bg-white text-[#17324D] shadow-md font-bold'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('nav.offers', 'Offers')}
          </button>

          <button
            onClick={() => onNavigateSection('destinations')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeSection === 'destinations'
                ? 'bg-white text-[#17324D] shadow-md font-bold'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('nav.destinations', 'Destinations')}
          </button>
        </nav>

        {/* Right CTA / User Action */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="inline-flex">
            <LanguageSelector variant="header" />
          </div>

          <button
            onClick={() => navigate('/refund-investigations/AT-9842')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">verified_user</span>
            <span>{t('nav.checkPnr', 'Check PNR')}</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#E8B86D] to-[#d9a552] hover:from-[#d9a552] hover:to-[#c79443] text-[#0d283e] text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>{t('nav.launchConsole', 'Launch Console')}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSelector variant="compact" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c2438] border-t border-white/10 px-4 py-4 space-y-3 text-left">
          {/* Mobile Language Selector */}
          <div className="pb-2 border-b border-white/10">
            <LanguageSelector variant="mobile" />
          </div>

          <button
            onClick={() => {
              onNavigateSection('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold flex items-center justify-between"
          >
            <span>{t('nav.howItWorks', 'How It Works')}</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>

          <button
            onClick={() => {
              onNavigateSection('features');
              setMobileMenuOpen(false);
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold flex items-center justify-between"
          >
            <span>{t('nav.features', 'Features')}</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>

          <button
            onClick={() => {
              onNavigateSection('refund-engine');
              setMobileMenuOpen(false);
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-[#006D77]/30 text-[#20B8B0] hover:bg-[#006D77]/50 text-sm font-bold flex items-center justify-between border border-[#20B8B0]/30"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              {t('nav.refundEngine', 'AI Refund Engine')}
            </span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>

          <button
            onClick={() => {
              onNavigateSection('special-offers');
              setMobileMenuOpen(false);
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold flex items-center justify-between"
          >
            <span>{t('nav.offers', 'Special Offers')}</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>

          <div className="pt-2">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2 px-1">
              Audit Operations & Console
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigate('/bookings');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-left flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">airplane_ticket</span>
                <span className="truncate">{t('nav.myBookings', 'My Bookings')}</span>
              </button>

              <button
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-[#E8B86D] text-[#0d283e] hover:bg-[#d9a552] text-xs font-bold text-left flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">shield_with_heart</span>
                <span className="truncate">{t('nav.refundConsole', 'Refund Console')}</span>
              </button>

              <button
                onClick={() => {
                  navigate('/refund-investigations');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-left flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">policy</span>
                <span className="truncate">{t('nav.investigations', 'Investigations')}</span>
              </button>

              <button
                onClick={() => {
                  navigate('/reviews');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-left flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">rate_review</span>
                <span className="truncate">{t('nav.reviews', 'Reviews')}</span>
              </button>

              <button
                onClick={() => {
                  navigate('/analytics');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-left flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">monitoring</span>
                <span className="truncate">{t('nav.analytics', 'Analytics')}</span>
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-left flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">settings</span>
                <span className="truncate">{t('nav.settings', 'Settings')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
