import React, { useState } from 'react';

interface TrainBookingFormProps {
  initialFrom?: string;
  initialTo?: string;
  onSearch: (searchData: any) => void;
}

export const TrainBookingForm: React.FC<TrainBookingFormProps> = ({
  initialFrom = 'New Delhi',
  initialTo = 'Mumbai Central',
  onSearch,
}) => {
  const [fromStation, setFromStation] = useState(initialFrom);
  const [toStation, setToStation] = useState(initialTo);
  const [journeyDate, setJourneyDate] = useState('2026-10-24');
  const [trainClass, setTrainClass] = useState('All Classes');
  const [quota, setQuota] = useState('General');

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: 'trains',
      fromStation,
      toStation,
      journeyDate,
      trainClass,
      quota,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C2EAE7]">
        <div className="flex items-center gap-2 text-sm font-bold text-[#17324D]">
          <span className="material-symbols-outlined text-[20px] text-[#006D77]">train</span>
          <span>IRCTC Authorized Train Ticket Booking with Automated TDR Refund Filing</span>
        </div>
        <div className="text-xs font-semibold text-[#006D77] bg-[#EAF8F7] px-3.5 py-1 rounded-full border border-[#BCE8E4]">
          ✓ Zero Payment Gateway Charges via UPI
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
        {/* From Station */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">From Station</span>
          <input
            type="text"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="font-extrabold text-lg sm:text-xl text-[#17324D] bg-transparent w-full focus:outline-none mt-0.5"
            placeholder="e.g. New Delhi (NDLS)"
            required
          />
          <span className="text-xs text-[#5A738E] font-medium block truncate">
            NDLS, Northern Railway
          </span>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 md:my-0 md:col-span-1">
          <button
            type="button"
            onClick={handleSwap}
            className="w-9 h-9 rounded-full bg-white shadow-md border border-[#C2EAE7] text-[#006D77] hover:bg-[#EAF8F7] flex items-center justify-center transition-transform hover:rotate-180 duration-300 cursor-pointer"
            title="Swap Origin and Destination"
          >
            <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
          </button>
        </div>

        {/* To Station */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">To Station</span>
          <input
            type="text"
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="font-extrabold text-lg sm:text-xl text-[#17324D] bg-transparent w-full focus:outline-none mt-0.5"
            placeholder="e.g. Mumbai Central (MMCT)"
            required
          />
          <span className="text-xs text-[#5A738E] font-medium block truncate">
            MMCT, Western Railway
          </span>
        </div>

        {/* Journey Date */}
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Journey Date</span>
          <input
            type="date"
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
            className="font-bold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
            required
          />
        </div>

        {/* Class Selection */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Class & Quota</span>
          <div className="flex items-center gap-2 mt-1">
            <select
              value={trainClass}
              onChange={(e) => setTrainClass(e.target.value)}
              className="bg-transparent font-bold text-xs sm:text-sm text-[#17324D] focus:outline-none cursor-pointer flex-1"
            >
              <option value="All Classes">All Classes</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="SL">Sleeper (SL)</option>
              <option value="CC">AC Chair Car (CC)</option>
              <option value="EC">Exec Chair Car (EC)</option>
            </select>
            <span className="text-gray-300">|</span>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className="bg-transparent font-bold text-xs sm:text-sm text-[#006D77] focus:outline-none cursor-pointer"
            >
              <option value="General">General</option>
              <option value="Tatkal">Tatkal</option>
              <option value="Ladies">Ladies</option>
              <option value="Senior Citizen">Senior Citizen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Popular Vande Bharat Quick Select & Search Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#C2EAE7] text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-[#5A738E] font-bold">Trending Express:</span>
          {['Vande Bharat Express', 'Tejas Rajdhani', 'Shatabdi'].map((exp) => (
            <button
              key={exp}
              type="button"
              onClick={() => setFromStation('New Delhi')}
              className="px-3 py-1 rounded-full bg-white border border-[#C2EAE7] hover:border-[#20B8B0] text-[#17324D] transition-colors cursor-pointer"
            >
              {exp}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#006D77] via-[#007b86] to-[#00565E] hover:from-[#00565E] hover:to-[#004349] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">directions_railway</span>
          <span>Search Trains</span>
        </button>
      </div>
    </form>
  );
};
