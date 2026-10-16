import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const PromotionalOffers: React.FC<{ onBookCategory?: (category: string) => void }> = ({
  onBookCategory,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Offers' },
    { id: 'flights', label: t('tab.flights', 'Flights') },
    { id: 'hotels', label: t('tab.hotels', 'Hotels') },
    { id: 'holidays', label: t('tab.holidays', 'Holidays') },
    { id: 'trains', label: t('tab.trains', 'Trains') },
    { id: 'cabs', label: t('tab.cabs', 'Cabs') },
  ];

  const offers = [
    {
      id: '1',
      category: 'flights',
      code: 'FLYYATRA',
      discount: 'FLAT 15% OFF',
      title: 'Domestic Flights Super Saver',
      description: 'Get up to ₹2,000 off on all domestic flights. Includes complimentary refund audit guarantee.',
      badge: 'AIRLINES',
      bgGradient: 'from-[#006D77] to-[#17324D]',
    },
    {
      id: '2',
      category: 'hotels',
      code: 'HOTELAI',
      discount: 'UP TO ₹3,500 OFF',
      title: 'Luxury Resorts & Heritage Hotels',
      description: 'Exclusive member discounts across 5-star properties in Goa, Jaipur, and Manali.',
      badge: 'STAYS',
      bgGradient: 'from-[#0d283e] to-[#006D77]',
    },
    {
      id: '3',
      category: 'trains',
      code: 'RAILSAFE',
      discount: 'ZERO CHARGES',
      title: 'IRCTC Vande Bharat & Express Bookings',
      description: 'Zero PG fees via UPI + automated IRCTC TDR filing if train delayed >3 hours.',
      badge: 'RAILWAYS',
      bgGradient: 'from-[#006D77] to-[#20B8B0]',
    },
    {
      id: '4',
      category: 'holidays',
      code: 'HOLIDAY2026',
      discount: 'FLAT ₹8,000 OFF',
      title: 'Kashmir & Kerala Festive Tour Packages',
      description: 'All-inclusive packages with private cab, verified houseboats, and flexible date rescheduling.',
      badge: 'HOLIDAYS',
      bgGradient: 'from-[#17324D] to-[#20B8B0]',
    },
    {
      id: '5',
      category: 'bus',
      code: 'BUSSUPER',
      discount: '₹250 CASHBACK',
      title: 'Intercity Volvo & Sleeper Buses',
      description: 'Assured on-time arrival guarantee or automatic 50% fare refund issued by AI Engine.',
      badge: 'BUSES',
      bgGradient: 'from-[#006D77] to-[#17324D]',
    },
    {
      id: '6',
      category: 'cabs',
      code: 'CABSAFE',
      discount: '10% OFF',
      title: 'Outstation & Airport Cab Transfers',
      description: 'Clean air-conditioned sedans and SUVs with commercial verified chauffeurs.',
      badge: 'CABS',
      bgGradient: 'from-[#0d283e] to-[#00565E]',
    },
  ];

  const filteredOffers = selectedCategory === 'all'
    ? offers
    : offers.filter((o) => o.category === selectedCategory);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section id="special-offers" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 text-left">
      {/* High-Impact Promotional Festive Banner */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#091b29] text-white p-6 sm:p-10 mb-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#20B8B0]/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8B86D] text-[#0d283e] font-extrabold text-xs uppercase tracking-wider mb-3 shadow-md">
            <span className="material-symbols-outlined text-[15px]">celebration</span>
            {t('offers.bannerBadge', 'Festive Travel Season Bonanza')}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-['Plus_Jakarta_Sans'] leading-tight">
            {t('offers.bannerTitle', 'Book Trips with 100% Refund Protection Against Disruptions')}
          </h2>
          <p className="text-white/85 text-xs sm:text-sm font-normal mt-2 leading-relaxed">
            {t('offers.bannerDesc', 'Unlike traditional platforms, Agent Travel continuously audits your bookings. In case of carrier cancellations or major delays, our AI files for your statutory restitution.')}
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto">
          <div className="bg-black/30 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center w-full">
            <span className="text-[11px] font-bold text-[#E8B86D] uppercase tracking-widest block">{t('offers.usePromo', 'Use Promo Code')}</span>
            <span className="font-mono font-black text-xl text-white tracking-widest">FESTIVEAI</span>
          </div>
          <button
            onClick={() => handleCopy('FESTIVEAI')}
            className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E8B86D] to-[#d9a552] hover:from-[#d9a552] hover:to-[#c79443] text-[#0d283e] font-extrabold text-xs tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {copiedCode === 'FESTIVEAI' ? t('offers.codeCopied', '✓ Code Copied!') : t('offers.copyCode', 'Copy Festive Code')}
          </button>
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#006D77]">{t('nav.offers', 'Special Offers')}</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
            {t('offers.heading', 'Exclusive Travel Deals & Promo Codes')}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {t('offers.subheading', 'Handpicked coupons applicable on flights, hotels, trains, and vacation packages.')}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#006D77] text-white shadow-md'
                  : 'bg-white border border-[#C2EAE7] text-[#17324D] hover:bg-[#EAF8F7]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-3xl border border-[#C2EAE7] bg-white hover:border-[#20B8B0] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            <div className={`p-4 bg-gradient-to-r ${offer.bgGradient} text-white flex items-center justify-between`}>
              <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                {offer.badge}
              </span>
              <span className="font-black text-sm tracking-tight text-[#E8B86D]">
                {offer.discount}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between text-left">
              <div>
                <h4 className="font-extrabold text-base text-[#17324D] group-hover:text-[#006D77] transition-colors">
                  {offer.title}
                </h4>
                <p className="text-xs text-gray-600 font-normal mt-2 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#17324D] bg-[#EAF8F7] px-3 py-1 rounded-lg border border-[#C2EAE7]">
                  <span>{offer.code}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="text-xs font-bold text-[#006D77] hover:underline cursor-pointer"
                  >
                    {copiedCode === offer.code ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => onBookCategory?.(offer.category)}
                    className="px-3.5 py-1.5 rounded-full bg-[#17324D] hover:bg-[#006D77] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('offers.bookNow', 'Book Now')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
