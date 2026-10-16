import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

interface FlightItem {
  id: string;
  airline: string;
  code: string;
  flightNo: string;
  fromTime: string;
  toTime: string;
  fromCode: string;
  toCode: string;
  duration: string;
  stops: string;
  price: number;
  priceFormatted: string;
  refundable: boolean;
  logo: string;
}

export const FlightsPage: React.FC = () => {
  const navigate = useNavigate();

  // Selected date in carousel
  const [selectedDate, setSelectedDate] = useState('Sat, 24 Oct');

  // Filters state
  const [selectedStops, setSelectedStops] = useState<string[]>(['nonstop']);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [bookedFlight, setBookedFlight] = useState<string | null>(null);

  const dates = [
    { day: 'Wed, 21 Oct', price: '₹ 5,420' },
    { day: 'Thu, 22 Oct', price: '₹ 5,190' },
    { day: 'Fri, 23 Oct', price: '₹ 6,340' },
    { day: 'Sat, 24 Oct', price: '₹ 4,872', isRecommended: true },
    { day: 'Sun, 25 Oct', price: '₹ 5,100' },
    { day: 'Mon, 26 Oct', price: '₹ 4,950' },
    { day: 'Tue, 27 Oct', price: '₹ 5,280' },
  ];

  const flights: FlightItem[] = [
    {
      id: 'AI-805',
      airline: 'Air India',
      code: 'AI',
      flightNo: 'AI-805',
      fromTime: '06:10',
      toTime: '08:25',
      fromCode: 'DEL',
      toCode: 'BOM',
      duration: '2h 15m',
      stops: 'Non-stop',
      price: 4872,
      priceFormatted: '₹ 4,872',
      refundable: true,
      logo: 'flight_takeoff',
    },
    {
      id: '6E-2134',
      airline: 'IndiGo',
      code: '6E',
      flightNo: '6E-2134',
      fromTime: '08:30',
      toTime: '10:40',
      fromCode: 'DEL',
      toCode: 'BOM',
      duration: '2h 10m',
      stops: 'Non-stop',
      price: 5120,
      priceFormatted: '₹ 5,120',
      refundable: true,
      logo: 'flight_takeoff',
    },
    {
      id: 'UK-995',
      airline: 'Vistara',
      code: 'UK',
      flightNo: 'UK-995',
      fromTime: '10:20',
      toTime: '12:35',
      fromCode: 'DEL',
      toCode: 'BOM',
      duration: '2h 15m',
      stops: 'Non-stop',
      price: 6450,
      priceFormatted: '₹ 6,450',
      refundable: true,
      logo: 'flight_takeoff',
    },
    {
      id: 'QP-1102',
      airline: 'Akasa Air',
      code: 'QP',
      flightNo: 'QP-1102',
      fromTime: '14:15',
      toTime: '16:35',
      fromCode: 'DEL',
      toCode: 'BOM',
      duration: '2h 20m',
      stops: 'Non-stop',
      price: 4910,
      priceFormatted: '₹ 4,910',
      refundable: true,
      logo: 'flight_takeoff',
    },
    {
      id: '6E-5321',
      airline: 'IndiGo',
      code: '6E',
      flightNo: '6E-5321',
      fromTime: '17:45',
      toTime: '20:00',
      fromCode: 'DEL',
      toCode: 'BOM',
      duration: '2h 15m',
      stops: 'Non-stop',
      price: 5490,
      priceFormatted: '₹ 5,490',
      refundable: true,
      logo: 'flight_takeoff',
    },
  ];

  const toggleAirline = (name: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleBook = (flight: FlightItem) => {
    setBookedFlight(flight.flightNo);
    setTimeout(() => {
      navigate('/bookings');
    }, 1200);
  };

  const filteredFlights = flights.filter((f) => {
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airline)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="flights" />

      {bookedFlight && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center gap-2 text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Flight {bookedFlight} added to your bookings with AI refund tracking enabled!</span>
        </div>
      )}

      <main className="flex-1 w-full site-container py-6 text-left">
        {/* Breadcrumb (Page 3) */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="hover:text-[#0d3d3a]">Flights</span>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Delhi to Mumbai</span>
        </div>

        {/* Header Strip & Modify Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e3ded4] gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Flights from Delhi to Mumbai
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              Sat, 24 Oct 2026 · 1 traveller · Economy · {filteredFlights.length} flights found
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors"
          >
            Modify search
          </button>
        </div>

        {/* Date Strip Carousel */}
        <div className="py-4 border-b border-[#e3ded4] overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {dates.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDate(d.day)}
                className={`px-4 py-2.5 rounded-lg border text-xs font-medium transition-all text-center min-w-[120px] ${
                  selectedDate === d.day
                    ? 'border-[#0d6b63] bg-white text-[#0d3d3a] shadow-sm ring-1 ring-[#0d6b63]'
                    : 'border-[#e3ded4] bg-white/70 text-[#6b7775] hover:bg-white hover:text-[#0d3d3a]'
                }`}
              >
                <div className="font-semibold">{d.day}</div>
                <div className={`mt-0.5 text-xs ${selectedDate === d.day ? 'text-[#0d6b63] font-bold' : 'text-[#889593]'}`}>
                  {d.price}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout: Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left Filters Column */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-[#e3ded4] p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e3ded4]">
                <h3 className="text-sm font-bold text-[#0d3d3a]">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedAirlines([]);
                    setSelectedStops(['nonstop']);
                  }}
                  className="text-xs text-[#0d6b63] hover:underline font-medium"
                >
                  Clear all
                </button>
              </div>

              {/* Stops Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0d3d3a] uppercase tracking-wider block">
                  Stops
                </label>
                <label className="flex items-center gap-2 text-xs text-[#42504e] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStops.includes('nonstop')}
                    onChange={() => {}}
                    className="accent-[#0d6b63] rounded"
                  />
                  <span>Non-stop (82)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#42504e] cursor-pointer">
                  <input type="checkbox" className="accent-[#0d6b63] rounded" />
                  <span>1 stop (124)</span>
                </label>
              </div>

              {/* Airlines Filter */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="text-xs font-bold text-[#0d3d3a] uppercase tracking-wider block">
                  Airlines
                </label>
                {['Air India', 'IndiGo', 'Vistara', 'Akasa Air'].map((airline) => (
                  <label key={airline} className="flex items-center gap-2 text-xs text-[#42504e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{airline}</span>
                  </label>
                ))}
              </div>

              {/* Refund Protection Info */}
              <div className="pt-3 border-t border-[#e3ded4] bg-[#e8f2f0]/60 -mx-4 -mb-4 p-3.5 rounded-b-xl">
                <div className="flex items-start gap-2 text-xs text-[#2d5650]">
                  <span className="material-symbols-outlined text-[16px] text-[#0d6b63] shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <div>
                    <span className="font-bold block">Protected by Agent Travel</span>
                    <span className="text-[11px] leading-tight text-[#5c6967] block mt-0.5">
                      All tickets include automated dispute arbitration if delayed or cancelled.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Flight Results Column */}
          <div className="lg:col-span-9 space-y-4">
            {filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm hover:border-[#0d6b63]/60 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Airline & Timings */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f0ebe1] flex items-center justify-center text-[#0d3d3a] font-bold text-xs border border-[#e3ded4]">
                      {flight.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0d3d3a] text-sm">
                        {flight.airline} · {flight.flightNo}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#6b7775] mt-0.5">
                        <span className="font-semibold text-[#0d3d3a]">{flight.fromTime}</span>
                        <span>{flight.fromCode}</span>
                        <span className="text-[#889593]">→ {flight.duration} ({flight.stops}) →</span>
                        <span className="font-semibold text-[#0d3d3a]">{flight.toTime}</span>
                        <span>{flight.toCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e3ded4] gap-2">
                    <div className="text-right">
                      <span className="text-xl font-bold text-[#0d3d3a] leading-none block">
                        {flight.priceFormatted}
                      </span>
                      <span className="text-[11px] text-[#889593]">per traveller</span>
                    </div>

                    <button
                      onClick={() => handleBook(flight)}
                      className="bg-[#0d6b63] text-white px-5 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm"
                    >
                      Book flight
                    </button>
                  </div>
                </div>

                {/* Footer Strip with Refund Assurance */}
                <div className="pt-2 border-t border-[#f0ebe1] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#0d6b63] font-semibold text-[11px] bg-[#e8f2f0] px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d6b63]"></span>
                    Eligible for refund assistance
                  </div>
                  <span className="text-[#889593] text-[11px]">
                    Free cancellation before 22 Oct · Flight ops tracked 24/7
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
