import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface PopularDestinationsProps {
  onSelectCity?: (city: string) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ onSelectCity }) => {
  const { t } = useLanguage();

  const destinations = [
    {
      city: 'Goa',
      state: 'Coastal Paradise',
      tag: 'Beaches & Nightlife',
      flightFrom: '₹3,499',
      image: '🏖️',
    },
    {
      city: 'Kashmir',
      state: 'Paradise on Earth',
      tag: 'Snow & Houseboats',
      flightFrom: '₹4,899',
      image: '🏔️',
    },
    {
      city: 'Manali',
      state: 'Himachal Valley',
      tag: 'Mountains & Adventure',
      flightFrom: '₹1,299 (Bus)',
      image: '🌲',
    },
    {
      city: 'Kerala',
      state: "God's Own Country",
      tag: 'Ayurveda & Lagoons',
      flightFrom: '₹4,199',
      image: '🌴',
    },
    {
      city: 'Varanasi',
      state: 'Spiritual Capital',
      tag: 'Ghats & Vande Bharat',
      flightFrom: '₹1,750 (Train)',
      image: '🪔',
    },
    {
      city: 'Dubai',
      state: 'United Arab Emirates',
      tag: 'Luxury & Desert Safari',
      flightFrom: '₹18,900',
      image: '🌆',
    },
  ];

  return (
    <section id="destinations" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#006D77]">
            {t('destinations.badge', 'Trending Getaways')}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17324D] tracking-tight font-['Plus_Jakarta_Sans']">
            {t('destinations.title', 'Popular Destinations for Festive Holidays')}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {t('destinations.subtitle', 'Top booked routes with guaranteed autonomous refund monitoring against schedule disruptions.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {destinations.map((d, i) => (
          <div
            key={i}
            onClick={() => onSelectCity?.(d.city)}
            className="rounded-2xl p-4 bg-white border border-[#C2EAE7] hover:border-[#20B8B0] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF8F7] border border-[#C2EAE7] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                {d.image}
              </div>
              <span className="text-[10px] font-bold text-[#006D77] uppercase tracking-wider block">
                {d.tag}
              </span>
              <h4 className="font-extrabold text-lg text-[#17324D] group-hover:text-[#006D77] transition-colors mt-0.5">
                {d.city}
              </h4>
              <p className="text-xs text-gray-500 font-medium truncate">{d.state}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-bold">{t('destinations.from', 'From')}</span>
              <span className="text-xs font-extrabold text-[#17324D]">{d.flightFrom}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
