import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { TransportIllustration, TransportMode } from '../components/common/TransportIllustration';
import { YatraHeader } from '../components/travel/YatraHeader';
import { AiRefundHero } from '../components/travel/AiRefundHero';
import { FestiveHeroBackground } from '../components/travel/FestiveHeroBackground';
import { AiSearchBar } from '../components/travel/AiSearchBar';
import { MultiServiceBookingPanel, ServiceTab } from '../components/travel/MultiServiceBookingPanel';
import { PromotionalOffers } from '../components/travel/PromotionalOffers';
import { PopularDestinations } from '../components/travel/PopularDestinations';
import { AiChatbotDrawer } from '../components/travel/AiChatbotDrawer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Booking panel and AI Search State
  const [bookingTab, setBookingTab] = useState<ServiceTab>('flights');
  const [searchFrom, setSearchFrom] = useState<string>('Delhi');
  const [searchTo, setSearchTo] = useState<string>('Mumbai');

  // Mode state for the preserved Transport Illustration inside How It Works
  const [selectedMode, setSelectedMode] = useState<TransportMode>('flights');
  const [activeSection, setActiveSection] = useState<string>('booking-hero');

  const modeData = {
    flights: {
      fromIcon: 'flight_takeoff',
      toIcon: 'flight_land',
      fromCity: 'Delhi',
      fromCode: 'DEL',
      toCity: 'Mumbai',
      toCode: 'BOM',
    },
    trains: {
      fromIcon: 'train',
      toIcon: 'directions_railway',
      fromCity: 'New Delhi',
      fromCode: 'NDLS',
      toCity: 'Mumbai Central',
      toCode: 'MMCT',
    },
    buses: {
      fromIcon: 'directions_bus',
      toIcon: 'directions_bus',
      fromCity: 'Delhi ISBT',
      fromCode: 'ISBT',
      toCity: 'Mumbai Borivali',
      toCode: 'BVI',
    },
  };

  const handleModeChange = (mode: TransportMode) => {
    setSelectedMode(mode);
  };

  // Scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      const sections = [
        { id: 'booking-hero', offset: document.getElementById('booking-hero')?.offsetTop || 0 },
        { id: 'how-it-works', offset: document.getElementById('how-it-works')?.offsetTop || 0 },
        { id: 'features', offset: document.getElementById('features')?.offsetTop || 0 },
        { id: 'refund-engine', offset: document.getElementById('refund-engine')?.offsetTop || 0 },
        { id: 'special-offers', offset: document.getElementById('special-offers')?.offsetTop || 0 },
        { id: 'destinations', offset: document.getElementById('destinations')?.offsetTop || 0 },
      ];

      const sortedSections = [...sections].sort((a, b) => b.offset - a.offset);
      for (const section of sortedSections) {
        if (scrollPosition >= section.offset - 60) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hash link smooth scroll handling on load
  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.replace('#', '');
      const el = document.getElementById(sectionId);
      if (el) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = Math.max(0, elementPosition + window.scrollY - headerOffset);
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
          setActiveSection(sectionId);
        }, 100);
      }
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'booking-hero') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setActiveSection('booking-hero');
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = Math.max(0, elementPosition + window.scrollY - headerOffset);
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

  // Callback from AI Search Bar to auto-configure booking tabs
  const handleAiParsedQuery = (tab: string, from?: string, to?: string) => {
    const validTabs: ServiceTab[] = ['flights', 'hotels', 'holidays', 'bus', 'trains', 'cabs'];
    const mappedTab = tab === 'buses' ? 'bus' : tab;
    if (validTabs.includes(mappedTab as ServiceTab)) {
      setBookingTab(mappedTab as ServiceTab);
    }
    if (from) setSearchFrom(from);
    if (to) setSearchTo(to);
    scrollToSection('booking-hero');
  };

  // Callback from Promotional Offers category selection
  const handleCategorySelect = (category: string) => {
    const validTabs: ServiceTab[] = ['flights', 'hotels', 'holidays', 'bus', 'trains', 'cabs'];
    const mapped = category === 'buses' ? 'bus' : category;
    if (validTabs.includes(mapped as ServiceTab)) {
      setBookingTab(mapped as ServiceTab);
    }
    scrollToSection('booking-hero');
  };

  // Callback from Popular Destinations
  const handleDestinationSelect = (cityName: string) => {
    setSearchFrom('Delhi');
    setSearchTo(cityName);
    setBookingTab('flights');
    scrollToSection('booking-hero');
  };

  return (
    <div className="bg-[#fcfcfd] font-sans text-gray-900 antialiased min-h-screen flex flex-col selection:bg-[#006D77] selection:text-white">
      {/* 1. Header & Navigation with Language Selector */}
      <YatraHeader
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
      />

      {/* Main Body Content */}
      <main className="flex-1 w-full">
        {/* Position 1: Continuous Beach Hero Background enclosing AI Refund Hero + Travel Booking UI */}
        <section id="booking-hero" className="w-full relative scroll-mt-20">
          <FestiveHeroBackground>
            {/* 1. AI Refund Hero Section (transparent over beach background) */}
            <AiRefundHero />

            {/* 2. Wide Rounded AI Travel Search Bar */}
            <AiSearchBar onAiParsedQuery={handleAiParsedQuery} />

            {/* 3. 6-Service Travel Booking Panel */}
            <MultiServiceBookingPanel
              currentTab={bookingTab}
              initialFrom={searchFrom}
              initialTo={searchTo}
              onTabChange={(tab) => setBookingTab(tab)}
            />
          </FestiveHeroBackground>
        </section>

        {/* 3. Position 2 (Second Position / Slide): SIMPLIFIED HOW IT WORKS SECTION */}
        <section id="how-it-works" className="w-full bg-[#f8fbfa] py-16 sm:py-20 scroll-mt-20 border-b border-[#C2EAE7]/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
              <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF8F7] text-[#006D77] text-xs font-bold uppercase tracking-wider mx-auto border border-[#C2EAE7]">
                <span className="material-symbols-outlined text-[15px] text-[#20B8B0]">offline_bolt</span>
                <span>{t('howItWorks.badge', 'Simple 4-Step Process')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans'] leading-tight">
                {t('howItWorks.title', 'How Agent Travel Works')}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
                {t('howItWorks.subtitle', 'A clear, transparent way to book travel and resolve disruption refunds with zero hassle.')}
              </p>
            </div>

            {/* 4 Clean Steps Stepper Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left relative">
              {/* Step 1: Book Your Trip */}
              <div className="relative p-6 sm:p-7 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#C2EAE7] group">
                {/* Connecting arrow indicator on desktop */}
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#EAF8F7] text-[#006D77] border border-[#20B8B0] flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-[#EAF8F7] text-[#006D77] font-black text-sm flex items-center justify-center border border-[#C2EAE7]">
                      {t('howItWorks.step1Num', '01')}
                    </span>
                    <span className="w-12 h-12 rounded-2xl bg-[#006D77]/10 text-[#006D77] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">flight_takeoff</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
                    {t('howItWorks.step1Title', 'Book Your Trip')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-normal mt-2 leading-relaxed">
                    {t('howItWorks.step1Desc', 'Book your flight, train, or bus through the supported booking workflow.')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[#006D77] text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">confirmation_number</span>
                  <span>Instant Booking Sync</span>
                </div>
              </div>

              {/* Step 2: We Monitor Disruptions */}
              <div className="relative p-6 sm:p-7 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#C2EAE7] group">
                {/* Connecting arrow indicator on desktop */}
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#EAF8F7] text-[#006D77] border border-[#20B8B0] flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-[#EAF8F7] text-[#006D77] font-black text-sm flex items-center justify-center border border-[#C2EAE7]">
                      {t('howItWorks.step2Num', '02')}
                    </span>
                    <span className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">radar</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
                    {t('howItWorks.step2Title', 'We Monitor Disruptions')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-normal mt-2 leading-relaxed">
                    {t('howItWorks.step2Desc', 'The platform checks relevant travel disruption information where supported by configured data sources.')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-amber-700 text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">notifications_active</span>
                  <span>Live Telemetry Radar</span>
                </div>
              </div>

              {/* Step 3: AI Checks Your Case */}
              <div className="relative p-6 sm:p-7 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#C2EAE7] group">
                {/* Connecting arrow indicator on desktop */}
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#EAF8F7] text-[#006D77] border border-[#20B8B0] flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-[#EAF8F7] text-[#006D77] font-black text-sm flex items-center justify-center border border-[#C2EAE7]">
                      {t('howItWorks.step3Num', '03')}
                    </span>
                    <span className="w-12 h-12 rounded-2xl bg-[#20B8B0]/15 text-[#006D77] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">psychology_alt</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
                    {t('howItWorks.step3Title', 'AI Checks Your Case')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-normal mt-2 leading-relaxed">
                    {t('howItWorks.step3Desc', 'The Refund Engine reviews the available booking and disruption information to help assess possible refund eligibility.')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[#006D77] text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">policy</span>
                  <span>DGCA & Carrier Rules</span>
                </div>
              </div>

              {/* Step 4: Track Your Refund (With Status Tracker Pill Sequence) */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#C2EAE7] group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-[#EAF8F7] text-[#006D77] font-black text-sm flex items-center justify-center border border-[#C2EAE7]">
                      {t('howItWorks.step4Num', '04')}
                    </span>
                    <span className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">payments</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
                    {t('howItWorks.step4Title', 'Track Your Refund')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-normal mt-2 leading-relaxed">
                    {t('howItWorks.step4Desc', 'View your claim status and the next steps through the available refund workflow.')}
                  </p>

                  {/* Visual Status Tracker Badges */}
                  <div className="mt-4 p-2.5 rounded-2xl bg-[#f0f8f7] border border-[#C2EAE7]/70 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#006D77] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
                        {t('howItWorks.statusSubmitted', 'Submitted')}
                      </span>
                      <span className="text-[#5A738E]">&rarr;</span>
                      <span className="text-amber-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-amber-500 animate-spin">sync</span>
                        {t('howItWorks.statusReview', 'Under Review')}
                      </span>
                      <span className="text-[#5A738E]">&rarr;</span>
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-emerald-600">verified</span>
                        {t('howItWorks.statusResolved', 'Resolved')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-emerald-700 text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
                  <span>Real-time Claim Status</span>
                </div>
              </div>
            </div>

            {/* Clear Primary CTA Button Linking to Refund Engine */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('refund-engine')}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#006D77] via-[#007b86] to-[#00565E] hover:from-[#00565E] hover:to-[#004349] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#E8B86D]">auto_fix_high</span>
                <span>{t('howItWorks.cta', 'Check My Refund')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/refund-investigations/AT-9842')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#EAF8F7] text-[#17324D] font-bold text-xs sm:text-sm tracking-wide border border-[#C2EAE7] shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#006D77]">visibility</span>
                <span>View Sample Case (AT-9842)</span>
              </button>
            </div>

            {/* Interactive Dynamic Transport Illustration Preserved */}
            <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#C2EAE7] flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mb-6 gap-4">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#006D77] uppercase tracking-wider block">
                      {t('howItWorks.radarTitle', 'Live Transport Radar')}
                    </span>
                    <span className="text-xs font-bold text-[#17324D] bg-[#EAF8F7] px-2.5 py-0.5 rounded-full border border-[#C2EAE7]">
                      {modeData[selectedMode].fromCity} [{modeData[selectedMode].fromCode}] &rarr; {modeData[selectedMode].toCity} [{modeData[selectedMode].toCode}]
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-[#17324D] mt-0.5 font-['Plus_Jakarta_Sans']">
                    {t('howItWorks.radarSubtitle', 'Multi-Modal Telemetry & Dispute Detection')}
                  </h4>
                </div>

                {/* Mode Selector Pills (Flights, Trains, Buses) */}
                <div className="flex items-center gap-1.5 p-1 bg-[#EAF8F7] rounded-full border border-[#C2EAE7]">
                  {(['flights', 'trains', 'buses'] as TransportMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                        selectedMode === mode
                          ? 'bg-[#006D77] text-white shadow-md'
                          : 'text-[#17324D] hover:text-[#006D77]'
                      }`}
                    >
                      {t(`tab.${mode === 'buses' ? 'bus' : mode}`, mode)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Transport Illustration Component */}
              <div className="w-full max-w-4xl transition-all duration-300">
                <TransportIllustration mode={selectedMode} />
              </div>

              {/* Live Carrier Auditing Strip */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-500 text-xs sm:text-sm font-medium">
                <span className="flex items-center gap-1.5 text-[#17324D] font-semibold">
                  <span className="material-symbols-outlined text-[#006D77] text-[18px]">verified</span>
                  Trusted coverage across 450+ airlines, rail networks, and bus operators worldwide
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Position 3 (Third Position / Slide): FEATURES - Fully Preserved */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full scroll-mt-20 text-left">
          <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-[#006D77] font-bold">
              {t('features.badge', 'Autonomous Protocol')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans'] leading-tight">
              {t('features.title', 'The AI Refund Flow Architecture')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
              {t('features.subtitle', 'An end-to-end automated pipeline connecting passenger itineraries directly to statutory compensation payouts.')}
            </p>
          </div>

          {/* 4 Step Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all flex flex-col justify-between border border-[#C2EAE7] group">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-[#EAF8F7] border border-[#C2EAE7] flex items-center justify-center text-sm font-black text-[#006D77] group-hover:bg-[#006D77] group-hover:text-white transition-colors">
                    01
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
                  {t('features.step1Title', 'Booking Sync')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-normal mt-2 leading-relaxed">
                  {t('features.step1Desc', 'Trip search query, e-ticket forward, or instant booking reference lookup.')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[#006D77] text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                <span>{t('features.step1Tag', 'Zero-friction sync')}</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all flex flex-col justify-between border border-[#C2EAE7] group">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-[#EAF8F7] border border-[#C2EAE7] text-[#006D77] flex items-center justify-center text-sm font-black group-hover:bg-[#006D77] group-hover:text-white transition-colors">
                    02
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
                  {t('features.step2Title', 'AI Investigation')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-normal mt-2 leading-relaxed">
                  {t('features.step2Desc', 'Deep scan of operator schedule logs, flight radar, and passenger rights regulations.')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[#006D77] text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>{t('features.step2Tag', 'Automated Policy Check')}</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all flex flex-col justify-between border border-[#C2EAE7] group">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-[#EAF8F7] border border-[#C2EAE7] text-[#006D77] flex items-center justify-center text-sm font-black group-hover:bg-[#006D77] group-hover:text-white transition-colors">
                    03
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
                  {t('features.step3Title', 'Dossier Generation')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-normal mt-2 leading-relaxed">
                  {t('features.step3Desc', 'Assembly of tickets, delay metrics, and undisputed claim documents.')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[#006D77] text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">folder_special</span>
                <span>{t('features.step3Tag', 'Verified Dossier')}</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all flex flex-col justify-between border border-[#C2EAE7] group">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-[#EAF8F7] border border-[#C2EAE7] text-[#006D77] flex items-center justify-center text-sm font-black group-hover:bg-[#006D77] group-hover:text-white transition-colors">
                    04
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
                  {t('features.step4Title', 'Refund Decision')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-normal mt-2 leading-relaxed">
                  {t('features.step4Desc', 'Precise settlement calculation and direct transmission to operator portals.')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-emerald-700 text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>{t('features.step4Tag', 'Fast Restitution')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Position 4 (Fourth Position / Slide): REFUND ENGINE - Ocean Theme & i18n */}
        <section id="refund-engine" className="w-full bg-[#0a1e2e] text-white py-16 sm:py-20 scroll-mt-20 border-y border-[#006D77]/40 relative overflow-hidden text-left">
          {/* Ambient Lighting Background */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#006D77]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#20B8B0]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1.5 max-w-2xl text-left">
                <span className="text-xs uppercase tracking-widest text-[#E8B86D] font-bold">
                  {t('refund.badge', 'Real-time Audit Engine')}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans'] leading-tight">
                  {t('refund.title', 'AI Refund Investigation System')}
                </h2>
                <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                  {t('refund.subtitle', 'Automated verification and policy checking parsing active disruption claims.')}
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold tracking-wide transition-all self-start md:self-auto cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#E8B86D]">dashboard</span>
                <span>{t('nav.refundConsole', 'Open Refund Console')}</span>
              </button>
            </div>

            {/* Main High-Contrast Obsidian Glass Panel */}
            <div className="w-full rounded-3xl bg-black/40 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-[#20B8B0]/30">
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Console Panel */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-6 text-left">
                  {/* Flight Pill Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#006D77]/40 text-[#E8B86D] border border-[#20B8B0]/30 flex items-center justify-center font-black text-lg">
                        AI
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                            {t('refund.flight', 'Flight AI-805')}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/40 text-[11px] font-bold tracking-wider">
                            {t('refund.cancelled', 'CANCELLED')}
                          </span>
                        </div>
                        <span className="text-xs text-white/80 font-medium">
                          {t('refund.route', 'Delhi (DEL) → Mumbai (BOM)')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[11px] text-white/60 uppercase tracking-wider font-bold">Disruption Notice</span>
                      <span className="text-xs text-white font-semibold">{t('refund.notice', 'Under 24h Threshold')}</span>
                    </div>
                  </div>

                  {/* Disruption & Regulation Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-sm flex flex-col gap-2 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#E8B86D] uppercase tracking-wider font-bold">
                          Disruption Audit
                        </span>
                        <span className="material-symbols-outlined text-[#E8B86D] text-[18px]">verified</span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-white tracking-tight">{t('refund.auditTitle', 'Clear Conditions')}</span>
                      <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
                        {t('refund.auditDesc', 'Weather defense verified clear; carrier operational liability established.')}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-sm flex flex-col gap-2 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#E8B86D] uppercase tracking-wider font-bold">
                          Regulation Rule
                        </span>
                        <span className="material-symbols-outlined text-[#E8B86D] text-[18px]">gavel</span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-white tracking-tight">{t('refund.ruleTitle', 'DGCA CAR Sec 3')}</span>
                      <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
                        {t('refund.ruleDesc', 'Mandates 100% full ticket refund without cancellation penalty.')}
                      </p>
                    </div>
                  </div>

                  {/* Verified Status Bar */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] flex items-center justify-between border border-white/10">
                    <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                      <span className="material-symbols-outlined text-[18px] text-[#20B8B0]">check_circle</span>
                      <span>{t('refund.verifiedBar', 'Passenger ticket and payment receipts verified')}</span>
                    </div>
                    <span className="text-xs text-[#20B8B0] font-mono font-bold uppercase tracking-wider">{t('refund.dossierReady', 'Dossier Ready')}</span>
                  </div>
                </div>

                {/* Right Verdict Panel */}
                <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl gap-6 border border-white/10 text-left">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-[#E8B86D] font-bold">
                        {t('refund.verdictTitle', 'Investigation Verdict')}
                      </span>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{t('refund.confidence', '99.4% Confidence')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">{t('refund.payableLabel', 'Verified Restitution Payable:')}</span>
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-baseline gap-2 mt-1 font-['Plus_Jakarta_Sans']">
                        <span>{t('refund.amount', '₹9,450')}</span>
                        <span className="text-base sm:text-lg text-white/60 font-semibold">($120 USD)</span>
                      </div>
                      <span className="text-xs text-[#E8B86D] font-semibold mt-1">
                        {t('refund.taxRelief', 'Includes full unused ticket refund & statutory tax relief')}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-4 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2.5 text-white font-medium text-xs sm:text-sm">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </span>
                        <span>{t('refund.check1', 'Flight cancellation confirmed')}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white font-medium text-xs sm:text-sm">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </span>
                        <span>{t('refund.check2', 'Eligible for full fare refund')}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white font-medium text-xs sm:text-sm">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </span>
                        <span>{t('refund.check3', 'Ready for direct bank transfer')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/refund-investigations/AT-9842')}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#E8B86D] to-[#d9a552] hover:from-[#d9a552] hover:to-[#c79443] text-[#0d283e] text-sm sm:text-base font-extrabold hover:shadow-lg transition-all cursor-pointer mt-4"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>{t('refund.inspectBtn', 'Inspect Refund Details')} &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Promotional Banners and Special Offers Section */}
        <PromotionalOffers onBookCategory={handleCategorySelect} />

        {/* 7. Popular Destinations Section */}
        <PopularDestinations onSelectCity={handleDestinationSelect} />

        {/* 8. High-Impact Call To Action Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 w-full">
          <div className="w-full rounded-3xl bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#0a1e2e] text-white p-8 sm:p-14 relative overflow-hidden flex flex-col items-center text-center shadow-2xl border border-[#20B8B0]/30">
            {/* Ambient Lighting */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#20B8B0]/20 blur-3xl pointer-events-none rounded-full" />

            <div className="relative z-10 flex flex-col items-center max-w-3xl gap-4">
              <span className="px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-[#E8B86D] font-extrabold text-xs uppercase tracking-wider border border-white/10">
                {t('cta.badge', 'Instant Zero-Risk Investigation')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight font-black font-['Plus_Jakarta_Sans'] leading-tight">
                {t('cta.title', 'Have a disrupted travel booking?')}{' '}
                <span className="text-[#E8B86D] block sm:inline">
                  {t('cta.titleHighlight', 'Let our AI claim your statutory refund.')}
                </span>
              </h2>
              <p className="text-sm sm:text-base text-white/85 max-w-xl leading-relaxed">
                {t('cta.subtitle', 'No tedious forms. Zero paperwork. Get an instant, mathematically verified refund verdict in under 60 seconds.')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/refund-investigations/AT-9842')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#E8B86D] to-[#d9a552] hover:from-[#d9a552] hover:to-[#c79443] text-[#0d283e] font-extrabold text-sm sm:text-base shadow-xl active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  <span>{t('cta.startBtn', 'Start Free AI Refund Check')}</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base transition-all border border-white/20 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#20B8B0]">shield_with_heart</span>
                  <span>{t('cta.exploreBtn', 'Explore Refund Console')}</span>
                </button>
              </div>

              {/* Metric micro-strip */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-white/80 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#20B8B0] text-[16px]">check_circle</span>
                  {t('cta.metric1', '99.2% Claim Resolution Rate')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#20B8B0] text-[16px]">check_circle</span>
                  {t('cta.metric2', 'Direct Regulatory Enforcement')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#20B8B0] text-[16px]">check_circle</span>
                  {t('cta.metric3', 'No Recovery, No Fee')}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI Assistant Chatbot */}
      <AiChatbotDrawer />
    </div>
  );
};
export default LandingPage;
