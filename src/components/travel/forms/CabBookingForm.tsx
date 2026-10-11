import React, { useState } from 'react';

interface CabBookingFormProps {
  onSearch: (searchData: any) => void;
}

export const CabBookingForm: React.FC<CabBookingFormProps> = ({ onSearch }) => {
  const [tripType, setTripType] = useState<'outstation-oneway' | 'outstation-round' | 'airport' | 'hourly'>('outstation-oneway');
  const [pickupCity, setPickupCity] = useState('Delhi');
  const [dropCity, setDropCity] = useState('Agra');
  const [pickupDate, setPickupDate] = useState('2026-10-24');
  const [pickupTime, setPickupTime] = useState('06:00 AM');
  const [carType, setCarType] = useState('Sedan');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: 'cabs',
      tripType,
      pickupCity,
      dropCity: tripType === 'hourly' ? 'Local Rental (8 hrs / 80 km)' : dropCity,
      pickupDate,
      pickupTime,
      carType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C2EAE7]">
        <div className="flex items-center gap-6 text-sm font-semibold text-[#17324D]">
          <label className="flex items-center gap-2 cursor-pointer hover:text-[#006D77] transition-colors">
            <input
              type="radio"
              name="cabTripType"
              checked={tripType === 'outstation-oneway'}
              onChange={() => setTripType('outstation-oneway')}
              className="accent-[#006D77] w-4 h-4 cursor-pointer"
            />
            <span>Outstation One-Way</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-[#006D77] transition-colors">
            <input
              type="radio"
              name="cabTripType"
              checked={tripType === 'outstation-round'}
              onChange={() => setTripType('outstation-round')}
              className="accent-[#006D77] w-4 h-4 cursor-pointer"
            />
            <span>Outstation Round-Trip</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-[#006D77] transition-colors">
            <input
              type="radio"
              name="cabTripType"
              checked={tripType === 'airport'}
              onChange={() => setTripType('airport')}
              className="accent-[#006D77] w-4 h-4 cursor-pointer"
            />
            <span>Airport Transfer</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-[#006D77] transition-colors">
            <input
              type="radio"
              name="cabTripType"
              checked={tripType === 'hourly'}
              onChange={() => setTripType('hourly')}
              className="accent-[#006D77] w-4 h-4 cursor-pointer"
            />
            <span>Hourly Rental</span>
          </label>
        </div>

        <div className="text-xs font-semibold text-[#006D77] bg-[#EAF8F7] px-3.5 py-1 rounded-full border border-[#BCE8E4]">
          ✓ Verified Commercial Chauffeurs &bull; All Tolls & Taxes Transparent
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
        {/* Pickup Location */}
        <div className="md:col-span-4 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Pickup City / Address</span>
          <input
            type="text"
            value={pickupCity}
            onChange={(e) => setPickupCity(e.target.value)}
            className="font-extrabold text-lg text-[#17324D] bg-transparent w-full focus:outline-none mt-0.5"
            placeholder="e.g. Delhi NCR (Airport / Home)"
            required
          />
        </div>

        {/* Drop Location */}
        <div className="md:col-span-4 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">
            {tripType === 'hourly' ? 'Package Duration' : 'Drop-off City / Destination'}
          </span>
          {tripType === 'hourly' ? (
            <select
              value={dropCity}
              onChange={(e) => setDropCity(e.target.value)}
              className="font-extrabold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
            >
              <option value="4 hrs / 40 km">4 Hours &bull; 40 KM Package</option>
              <option value="8 hrs / 80 km">8 Hours &bull; 80 KM (Full Day)</option>
              <option value="12 hrs / 120 km">12 Hours &bull; 120 KM Extended</option>
            </select>
          ) : (
            <input
              type="text"
              value={dropCity}
              onChange={(e) => setDropCity(e.target.value)}
              className="font-extrabold text-lg text-[#17324D] bg-transparent w-full focus:outline-none mt-0.5"
              placeholder="e.g. Agra, Uttar Pradesh"
              required
            />
          )}
        </div>

        {/* Pickup Date */}
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Pickup Date</span>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="font-bold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
            required
          />
        </div>

        {/* Pickup Time */}
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Pickup Time</span>
          <select
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="font-bold text-sm text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
          >
            {['05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '05:00 PM', '08:00 PM'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Car Type and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#C2EAE7] text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-[#5A738E] font-bold">Cab Category:</span>
          {['Sedan (Dzire / Etios)', 'SUV (Ertiga / Innova)', 'Hatchback (WagonR)'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCarType(c.split(' ')[0])}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                carType === c.split(' ')[0]
                  ? 'bg-[#EAF8F7] border-[#006D77] text-[#006D77] font-bold'
                  : 'bg-white border-[#C2EAE7] text-[#5A738E] hover:border-[#20B8B0]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#006D77] via-[#007b86] to-[#00565E] hover:from-[#00565E] hover:to-[#004349] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">local_taxi</span>
          <span>Search Cabs</span>
        </button>
      </div>
    </form>
  );
};
