import React, { useState } from 'react';

interface HolidayBookingFormProps {
  onSearch: (searchData: any) => void;
}

export const HolidayBookingForm: React.FC<HolidayBookingFormProps> = ({ onSearch }) => {
  const [destination, setDestination] = useState('Kashmir');
  const [theme, setTheme] = useState('Honeymoon');
  const [travelMonth, setTravelMonth] = useState('October 2026');
  const [travellers, setTravellers] = useState(2);
  const [budgetTier, setBudgetTier] = useState('₹25k - ₹50k');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: 'holidays',
      destination,
      theme,
      travelMonth,
      travellers,
      budgetTier,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C2EAE7]">
        <div className="flex items-center gap-2 text-sm font-bold text-[#17324D]">
          <span className="material-symbols-outlined text-[20px] text-[#006D77]">luggage</span>
          <span>Curated Domestic & International Tour Packages with Flexible Date Changes</span>
        </div>
        <div className="text-xs font-semibold text-[#006D77] bg-[#EAF8F7] px-3.5 py-1 rounded-full border border-[#BCE8E4]">
          ✓ Verified Hotels, Private Cabs & Guided Sightseeing Included
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
        {/* Destination */}
        <div className="md:col-span-4 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Holiday Destination</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="font-extrabold text-base sm:text-lg text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
          >
            <option value="Kashmir">Kashmir (Srinagar, Gulmarg, Pahalgam)</option>
            <option value="Kerala">Kerala (Munnar, Alleppey, Kovalam)</option>
            <option value="Himachal">Himachal (Shimla, Manali, Dharamshala)</option>
            <option value="Goa">Goa (North & South Beach Retreats)</option>
            <option value="Andaman">Andaman Islands (Havelock & Port Blair)</option>
            <option value="Dubai">Dubai & Abu Dhabi Grand Tour</option>
            <option value="Thailand">Thailand (Phuket & Krabi Island)</option>
            <option value="Europe">Europe Alpine Panorama</option>
          </select>
        </div>

        {/* Holiday Theme */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Travel Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="font-extrabold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
          >
            <option value="Honeymoon">Honeymoon & Romantic</option>
            <option value="Family">Family Holiday</option>
            <option value="Adventure">Adventure & Trekking</option>
            <option value="Luxury">Luxury Heritage</option>
            <option value="Spiritual">Spiritual & Temple Circuit</option>
          </select>
        </div>

        {/* Travel Month */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Travel Month</span>
          <select
            value={travelMonth}
            onChange={(e) => setTravelMonth(e.target.value)}
            className="font-extrabold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
          >
            <option value="October 2026">October 2026 (Festive Season)</option>
            <option value="November 2026">November 2026</option>
            <option value="December 2026">December 2026 (New Year)</option>
            <option value="January 2027">January 2027</option>
            <option value="Flexible">I am flexible with dates</option>
          </select>
        </div>

        {/* Travellers & Budget */}
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Travellers</span>
          <select
            value={travellers}
            onChange={(e) => setTravellers(Number(e.target.value))}
            className="font-bold text-sm text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
          >
            {[1, 2, 3, 4, 6, 8, 10].map((n) => (
              <option key={n} value={n}>{n} People</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Budget selection and submit button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#C2EAE7] text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-[#5A738E] font-bold">Budget Per Person:</span>
          {['Under ₹25k', '₹25k - ₹50k', '₹50k - ₹1 Lakh', 'Luxury (₹1L+)'].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudgetTier(b)}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                budgetTier === b
                  ? 'bg-[#EAF8F7] border-[#006D77] text-[#006D77] font-bold'
                  : 'bg-white border-[#C2EAE7] text-[#5A738E] hover:border-[#20B8B0]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#006D77] via-[#007b86] to-[#00565E] hover:from-[#00565E] hover:to-[#004349] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">beach_access</span>
          <span>Search Holiday Packages</span>
        </button>
      </div>
    </form>
  );
};
