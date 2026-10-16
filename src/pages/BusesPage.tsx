import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { useTravelBooking } from '../context/TravelBookingContext';

export const BusesPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchCriteria, openBookingSummary, bookingSuccessAlert, clearBookingSuccessAlert } = useTravelBooking();

  const origin = searchCriteria.origin || 'Bengaluru';
  const destination = searchCriteria.destination || 'Goa';
  const departDate = searchCriteria.departDate || '2026-11-06';
  const passengers = searchCriteria.passengers || '1 passenger';

  const [selectedTypes, setSelectedTypes] = useState<string[]>(['AC Sleeper', 'Multi-Axle']);

  const displayDateFormatted = (() => {
    const d = new Date(departDate + 'T00:00:00');
    return !isNaN(d.getTime())
      ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      : departDate;
  })();

  const buses = [
    {
      id: 'b1',
      operator: 'Coastline Travels',
      type: 'AC Sleeper (2+1)',
      rating: 4.5,
      seatsLeft: '12 seats left',
      depTime: '21:30',
      boarding: 'Majestic',
      duration: '10h 30m',
      arrTime: '08:00',
      drop: 'Panaji',
      fare: '₹ 1,450',
    },
    {
      id: 'b2',
      operator: 'VRL Travels',
      type: 'Multi-Axle I-Shift A/C Sleeper',
      rating: 4.6,
      seatsLeft: '8 seats left',
      depTime: '22:00',
      boarding: 'Silk Board',
      duration: '10h 00m',
      arrTime: '08:00',
      drop: 'Mapusa',
      fare: '₹ 1,650',
    },
    {
      id: 'b3',
      operator: 'SRS Travels',
      type: 'Non-AC Sleeper (2+1)',
      rating: 4.1,
      seatsLeft: '18 seats left',
      depTime: '20:30',
      boarding: 'Madiwala',
      duration: '11h 00m',
      arrTime: '07:30',
      drop: 'Panaji',
      fare: '₹ 950',
    },
    {
      id: 'b4',
      operator: 'Orange Tours & Travels',
      type: 'Volvo 9600 AC Sleeper',
      rating: 4.7,
      seatsLeft: '6 seats left',
      depTime: '22:30',
      boarding: 'Majestic',
      duration: '09h 45m',
      arrTime: '08:15',
      drop: 'Panaji',
      fare: '₹ 1,890',
    },
  ];

  const handleBook = (bus: typeof buses[0]) => {
    const baseFare = parseInt(bus.fare.replace(/[^0-9]/g, '')) || 1450;
    const matchPassengers = passengers.match(/(\d+)/);
    const passengerCount = matchPassengers ? Math.max(1, parseInt(matchPassengers[1], 10)) : 1;
    const totalFare = baseFare * passengerCount;

    openBookingSummary({
      id: bus.id,
      serviceType: 'buses',
      title: `${bus.operator} · ${bus.type}`,
      operator: bus.operator,
      code: `#BUS-${bus.id.toUpperCase()}`,
      route: `${origin} → ${destination}`,
      origin,
      destination,
      departDate,
      departTime: bus.depTime,
      arriveTime: bus.arrTime,
      duration: bus.duration,
      travelClass: bus.type,
      passengers,
      passengerCount,
      baseRatePerUnit: baseFare,
      fareFormatted: `₹ ${totalFare.toLocaleString('en-IN')}`,
      fareAmount: totalFare,
      refundable: true,
    });
  };

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const filteredBuses = buses.filter((b) => {
    if (selectedTypes.length === 0) return true;
    return selectedTypes.some((t) => b.type.toLowerCase().includes(t.toLowerCase().split(' ')[0]));
  });

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="buses" />

      {bookingSuccessAlert && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center justify-between gap-3 text-sm animate-fade-in max-w-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">directions_bus</span>
            <span>{bookingSuccessAlert}</span>
          </div>
          <button onClick={clearBookingSuccessAlert} className="text-white/80 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      <main className="flex-1 w-full site-container py-6 text-left">
        {/* Breadcrumb */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="text-[#6b7775]">Buses</span>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">{origin} to {destination}</span>
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#e3ded4] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Buses from {origin} to {destination}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              {displayDateFormatted} · {passengers} · {filteredBuses.length} buses available
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors cursor-pointer"
          >
            Modify search
          </button>
        </div>

        {/* 2-Column Split: Filters + Bus Cards (Page 18) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left Filters */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-[#e3ded4] p-4 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#e3ded4]">
                <h3 className="font-bold text-[#0d3d3a]">Filters</h3>
                <button
                  onClick={() => setSelectedTypes(['AC Sleeper', 'Volvo / Multi-Axle', 'AC Semi-Sleeper', 'Non-AC'])}
                  className="text-[#0d6b63] hover:underline font-semibold"
                >
                  Clear all
                </button>
              </div>

              {/* Bus Type */}
              <div className="space-y-2">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Bus type</label>
                {['AC Sleeper', 'Volvo / Multi-Axle', 'AC Semi-Sleeper', 'Non-AC'].map((bt) => (
                  <label key={bt} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(bt)}
                      onChange={() => toggleType(bt)}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{bt}</span>
                  </label>
                ))}
              </div>

              {/* Departure Time */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Departure time</label>
                {['Evening · 18–22', 'Night · 22–06', 'Morning · 06–12'].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input type="checkbox" defaultChecked className="accent-[#0d6b63] rounded" />
                    <span>{t}</span>
                  </label>
                ))}
              </div>

              {/* Boarding Point */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Boarding point</label>
                {['Majestic', 'Silk Board', 'Madiwala'].map((bp) => (
                  <label key={bp} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input type="checkbox" defaultChecked className="accent-[#0d6b63] rounded" />
                    <span>{bp}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Bus Cards */}
          <div className="lg:col-span-9 space-y-4">
            <div className="text-xs text-[#6b7775]">
              Showing 4 of 38 buses · Fares per passenger · Sample data
            </div>

            {filteredBuses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm hover:border-[#0d6b63]/60 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f0ebe1]">
                  <div>
                    <h3 className="font-bold text-[#0d3d3a] text-base">{bus.operator}</h3>
                    <p className="text-xs text-[#6b7775]">{bus.type}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="bg-[#e8f2f0] text-[#0d6b63] text-xs font-bold px-2 py-0.5 rounded">
                      ★ {bus.rating}
                    </span>
                    <span className="text-xs text-[#b45309] font-medium bg-[#fffbeb] px-2 py-0.5 rounded border border-[#fde68a]">
                      {bus.seatsLeft}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-base text-[#0d3d3a] block">{bus.depTime}</span>
                    <span className="text-[#6b7775] text-xs">{bus.boarding}</span>
                  </div>

                  <div className="text-center text-xs text-[#889593]">
                    <span>{bus.duration}</span>
                    <div className="w-24 sm:w-36 h-0.5 bg-[#e3ded4] my-1"></div>
                    <span>Overnight</span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-base text-[#0d3d3a] block">{bus.arrTime}</span>
                    <span className="text-[#6b7775] text-xs">{bus.drop}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f0ebe1] flex items-center justify-between">
                  <span className="text-lg font-bold text-[#0d3d3a]">{bus.fare}</span>
                  <button
                    type="button"
                    onClick={() => handleBook(bus)}
                    className="bg-[#0d6b63] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors cursor-pointer"
                  >
                    Select seats
                  </button>
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
