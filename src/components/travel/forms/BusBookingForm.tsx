import React, { useState } from 'react';

interface BusBookingFormProps {
  initialFrom?: string;
  initialTo?: string;
  onSearch: (searchData: any) => void;
}

export const BusBookingForm: React.FC<BusBookingFormProps> = ({
  initialFrom = 'Delhi',
  initialTo = 'Manali',
  onSearch,
}) => {
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [journeyDate, setJourneyDate] = useState('2026-10-24');
  const [passengers, setPassengers] = useState(1);
  const [busTypes, setBusTypes] = useState<string[]>(['AC', 'Sleeper']);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const toggleBusType = (type: string) => {
    if (busTypes.includes(type)) {
      setBusTypes(busTypes.filter((t) => t !== type));
    } else {
      setBusTypes([...busTypes, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: 'buses',
      fromCity,
      toCity,
      journeyDate,
      passengers,
      busTypes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C2EAE7]">
        <div className="flex items-center gap-2 text-sm font-bold text-[#17324D]">
          <span className="material-symbols-outlined text-[20px] text-[#006D77]">directions_bus</span>
          <span>Intercity Bus Booking with GPS Live Tracking & Instant Cancellation Guarantee</span>
        </div>
        <div className="text-xs font-semibold text-[#006D77] bg-[#EAF8F7] px-3.5 py-1 rounded-full border border-[#BCE8E4]">
          ✓ Verified Operators: IntrCity, Zingbus, HRTC, UPSRTC
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
        {/* From City */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">From City</span>
          <input
            type="text"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="font-extrabold text-lg sm:text-xl text-[#17324D] bg-transparent w-full focus:outline-none mt-0.5"
            placeholder="e.g. Delhi (Kashmere Gate ISBT)"
            required
          />
          <span className="text-xs text-[#5A738E] font-medium block truncate">
            Major ISBT Hubs
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

        {/* To City */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">To City</span>
          <input
            type="text"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="font-extrabold text-lg sm:text-xl text-[#17324D] bg-transparent w-full focus:outline-none mt-0.5"
            placeholder="e.g. Manali, Himachal Pradesh"
            required
          />
          <span className="text-xs text-[#5A738E] font-medium block truncate">
            Mall Road Drop Points
          </span>
        </div>

        {/* Journey Date */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Date of Journey</span>
          <input
            type="date"
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
            className="font-bold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
            required
          />
        </div>

        {/* Passengers */}
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Passengers</span>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="font-bold text-sm text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} Seat{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Bus Type Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#C2EAE7] text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-[#5A738E] font-bold">Bus Type:</span>
          {['AC', 'Non-AC', 'Sleeper', 'Seater', 'Volvo Multi-Axle'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleBusType(type)}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                busTypes.includes(type)
                  ? 'bg-[#EAF8F7] border-[#006D77] text-[#006D77] font-bold'
                  : 'bg-white border-[#C2EAE7] text-[#5A738E] hover:border-[#20B8B0]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#006D77] via-[#007b86] to-[#00565E] hover:from-[#00565E] hover:to-[#004349] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">directions_bus</span>
          <span>Search Buses</span>
        </button>
      </div>
    </form>
  );
};
