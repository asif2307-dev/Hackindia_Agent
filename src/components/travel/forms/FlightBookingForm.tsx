import React, { useState } from 'react';

interface FlightBookingFormProps {
  initialFrom?: string;
  initialTo?: string;
  onSearch: (searchData: any) => void;
}

export const FlightBookingForm: React.FC<FlightBookingFormProps> = ({
  initialFrom = 'Delhi',
  initialTo = 'Mumbai',
  onSearch,
}) => {
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [departDate, setDepartDate] = useState('2026-10-24');
  const [returnDate, setReturnDate] = useState('2026-10-30');
  const [travellers, setTravellers] = useState({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState('Economy');
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);
  const [specialFare, setSpecialFare] = useState<'regular' | 'student' | 'armed' | 'senior'>('regular');
  const [nonStopOnly, setNonStopOnly] = useState(false);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const totalTravellers = travellers.adults + travellers.children + travellers.infants;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: 'flights',
      tripType,
      fromCity,
      toCity,
      departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      travellers,
      totalTravellers,
      cabinClass,
      specialFare,
      nonStopOnly,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left">
      {/* Trip Type Radio Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C2EAE7]">
        <div className="flex items-center gap-6 text-sm font-semibold text-[#17324D]">
          <label className="flex items-center gap-2 cursor-pointer hover:text-[#006D77] transition-colors">
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'oneway'}
              onChange={() => setTripType('oneway')}
              className="accent-[#006D77] w-4 h-4 cursor-pointer"
            />
            <span>One Way</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-[#006D77] transition-colors">
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'roundtrip'}
              onChange={() => setTripType('roundtrip')}
              className="accent-[#006D77] w-4 h-4 cursor-pointer"
            />
            <span>Round Trip</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-[#006D77] transition-colors">
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'multicity'}
              onChange={() => setTripType('multicity')}
              className="accent-[#006D77] w-4 h-4 cursor-pointer"
            />
            <span>Multi City</span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#006D77] bg-[#EAF8F7] px-3.5 py-1 rounded-full border border-[#BCE8E4]">
          <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">verified_user</span>
          <span>100% Guaranteed Autonomous Refund on Flight Disruptions</span>
        </div>
      </div>

      {/* Main Grid Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
        {/* From City */}
        <div className="md:col-span-3 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all relative">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">From</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <input
              type="text"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="font-extrabold text-lg sm:text-xl text-[#17324D] bg-transparent w-full focus:outline-none"
              placeholder="Origin City"
              required
            />
          </div>
          <span className="text-xs text-[#5A738E] font-medium block truncate">
            {fromCity.toLowerCase().includes('del') ? 'DEL, Indira Gandhi Intl Airport' : `${fromCity} Airport`}
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
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">To</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <input
              type="text"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="font-extrabold text-lg sm:text-xl text-[#17324D] bg-transparent w-full focus:outline-none"
              placeholder="Destination City"
              required
            />
          </div>
          <span className="text-xs text-[#5A738E] font-medium block truncate">
            {toCity.toLowerCase().includes('bom') || toCity.toLowerCase().includes('mum') ? 'BOM, Chhatrapati Shivaji Intl' : `${toCity} Airport`}
          </span>
        </div>

        {/* Departure Date */}
        <div className="md:col-span-2 p-3 rounded-2xl bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border border-[#C2EAE7] transition-all">
          <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block">Departure</span>
          <input
            type="date"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            className="font-bold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer"
            required
          />
        </div>

        {/* Return Date (Enabled for Round Trip) */}
        <div className={`md:col-span-3 p-3 rounded-2xl border transition-all ${
          tripType === 'roundtrip' 
            ? 'bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] border-[#C2EAE7]' 
            : 'bg-gray-100/60 border-gray-200 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider">Return Date</span>
            {tripType !== 'roundtrip' && (
              <button 
                type="button" 
                onClick={() => setTripType('roundtrip')}
                className="text-[11px] text-[#006D77] font-bold hover:underline cursor-pointer"
              >
                + Add Return
              </button>
            )}
          </div>
          <input
            type="date"
            value={returnDate}
            disabled={tripType !== 'roundtrip'}
            onChange={(e) => setReturnDate(e.target.value)}
            className="font-bold text-sm sm:text-base text-[#17324D] bg-transparent w-full focus:outline-none mt-1 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Row 2: Travellers & Special Fares */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#C2EAE7]">
        {/* Travellers & Class Dropdown trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTravellerDropdown(!showTravellerDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EAF8F7]/50 border border-[#C2EAE7] hover:border-[#006D77] text-sm font-semibold text-[#17324D] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006D77]">group</span>
            <span>{totalTravellers} Traveller{totalTravellers > 1 ? 's' : ''}, {cabinClass}</span>
            <span className="material-symbols-outlined text-[16px] text-[#5A738E]">expand_more</span>
          </button>

          {/* Travellers dropdown popup */}
          {showTravellerDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#C2EAE7] p-4 z-50 animate-fade-in text-left">
              <div className="space-y-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#17324D]">Adults (12+ yrs)</div>
                    <div className="text-[11px] text-[#5A738E]">on the day of travel</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={travellers.adults <= 1}
                      onClick={() => setTravellers({ ...travellers, adults: Math.max(1, travellers.adults - 1) })}
                      className="w-7 h-7 rounded-lg bg-[#EAF8F7] text-[#006D77] font-bold hover:bg-[#d5f0ee] disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-[#17324D]">{travellers.adults}</span>
                    <button
                      type="button"
                      disabled={travellers.adults >= 9}
                      onClick={() => setTravellers({ ...travellers, adults: travellers.adults + 1 })}
                      className="w-7 h-7 rounded-lg bg-[#EAF8F7] text-[#006D77] font-bold hover:bg-[#d5f0ee] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#17324D]">Children (2-12 yrs)</div>
                    <div className="text-[11px] text-[#5A738E]">with seat</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={travellers.children <= 0}
                      onClick={() => setTravellers({ ...travellers, children: Math.max(0, travellers.children - 1) })}
                      className="w-7 h-7 rounded-lg bg-[#EAF8F7] text-[#006D77] font-bold hover:bg-[#d5f0ee] disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-[#17324D]">{travellers.children}</span>
                    <button
                      type="button"
                      disabled={travellers.children >= 6}
                      onClick={() => setTravellers({ ...travellers, children: travellers.children + 1 })}
                      className="w-7 h-7 rounded-lg bg-[#EAF8F7] text-[#006D77] font-bold hover:bg-[#d5f0ee] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Class selection */}
              <div className="pt-3">
                <span className="text-[11px] font-bold text-[#5A738E] uppercase tracking-wider block mb-2">Cabin Class</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {['Economy', 'Premium Economy', 'Business', 'First'].map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setCabinClass(cls)}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-all cursor-pointer ${
                        cabinClass === cls ? 'bg-[#006D77] text-white font-bold' : 'bg-[#EAF8F7]/60 hover:bg-[#EAF8F7] text-[#17324D]'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTravellerDropdown(false)}
                className="w-full mt-4 py-2 bg-[#006D77] text-white rounded-xl text-xs font-bold hover:bg-[#00565E] cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Special Fares */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-[#5A738E] font-bold mr-1">Special Fares:</span>
          {[
            { id: 'regular', label: 'Regular Fare' },
            { id: 'student', label: 'Student Fare' },
            { id: 'armed', label: 'Armed Forces' },
            { id: 'senior', label: 'Senior Citizen' },
          ].map((fare) => (
            <button
              key={fare.id}
              type="button"
              onClick={() => setSpecialFare(fare.id as any)}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                specialFare === fare.id
                  ? 'bg-[#EAF8F7] border-[#006D77] text-[#006D77] font-bold'
                  : 'bg-white border-[#C2EAE7] text-[#5A738E] hover:border-[#20B8B0]'
              }`}
            >
              {fare.label}
            </button>
          ))}
        </div>

        {/* Non-stop Checkbox */}
        <label className="flex items-center gap-2 text-xs font-bold text-[#17324D] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={nonStopOnly}
            onChange={(e) => setNonStopOnly(e.target.checked)}
            className="accent-[#006D77] w-4 h-4 rounded cursor-pointer"
          />
          <span>Non-Stop Flights Only</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full bg-gradient-to-r from-[#006D77] via-[#007b86] to-[#00565E] hover:from-[#00565E] hover:to-[#004349] text-white font-extrabold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">flight_takeoff</span>
          <span>Search Flights</span>
        </button>
      </div>
    </form>
  );
};
