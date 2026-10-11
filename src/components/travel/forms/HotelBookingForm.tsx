import React, { useState } from 'react';

interface HotelBookingFormProps {
  initialCity?: string;
  onSearch: (searchData: any) => void;
}

export const HotelBookingForm: React.FC<HotelBookingFormProps> = ({
  initialCity = 'Goa',
  onSearch,
}) => {
  const [city, setCity] = useState(initialCity);
  const [checkIn, setCheckIn] = useState('2026-10-24');
  const [checkOut, setCheckOut] = useState('2026-10-28');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [starRating, setStarRating] = useState('any');
  const [priceTier, setPriceTier] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: 'hotels',
      city,
      checkIn,
      checkOut,
      rooms,
      adults,
      children,
      starRating,
      priceTier,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C2EAE7]">
        <div className="flex items-center gap-2 text-sm font-bold text-[#17324D]">
          <span className="material-symbols-outlined text-[20px] text-[#006D77]">hotel</span>
          <span>Book Domestic & International Hotels with Instant Zero-Penalty Cancellation</span>
        </div>
        <div className="text-xs font-semibold text-[#006D77] bg-[#EAF8F7] px-3.5 py-1 rounded-full border border-[#BCE8E4]">
          ✓ Free Breakfast Available &bull; Pay at Hotel Options
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
        {/* Destination City / Hotel */}
        <div className="md:col-span-5 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">City, Location or Hotel</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="font-extrabold text-lg sm:text-xl text-[#17324D] bg-transparent w-full focus:outline-none"
              placeholder="e.g. Goa, Calangute Beach"
              required
            />
          </div>
          <span className="text-xs text-[#5A738E] font-medium block truncate">
            India &bull; Resorts, Luxury Villas & Homestays
          </span>
        </div>

        {/* Check-in Date */}
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Check-in</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="font-bold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
            required
          />
        </div>

        {/* Check-out Date */}
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Check-out</span>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="font-bold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
            required
          />
        </div>

        {/* Rooms & Guests */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Rooms & Guests</span>
          <div className="flex items-center gap-2 mt-1">
            <select
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="bg-transparent font-bold text-sm text-[#17324D] focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            <span className="text-gray-300">|</span>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="bg-transparent font-bold text-sm text-[#17324D] focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 6, 8].map((n) => (
                <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            <span className="text-gray-300">|</span>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="bg-transparent font-bold text-sm text-[#17324D] focus:outline-none cursor-pointer"
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>{n} Child{n > 1 ? 'ren' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Star rating filter & price tier */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#C2EAE7] text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-[#5A738E] font-bold">Star Rating:</span>
          {['any', '3-star', '4-star', '5-star'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setStarRating(r)}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                starRating === r
                  ? 'bg-[#EAF8F7] border-[#006D77] text-[#006D77] font-bold'
                  : 'bg-white border-[#C2EAE7] text-[#5A738E] hover:border-[#20B8B0]'
              }`}
            >
              {r === 'any' ? 'All Ratings' : r.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#5A738E] font-bold">Property Type:</span>
          {['all', 'resort', 'villa', 'business'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriceTier(p)}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                priceTier === p
                  ? 'bg-[#EAF8F7] border-[#006D77] text-[#006D77] font-bold'
                  : 'bg-white border-[#C2EAE7] text-[#5A738E] hover:border-[#20B8B0]'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#006D77] via-[#007b86] to-[#00565E] hover:from-[#00565E] hover:to-[#004349] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            <span>Search Hotels</span>
          </button>
        </div>
      </div>
    </form>
  );
};
