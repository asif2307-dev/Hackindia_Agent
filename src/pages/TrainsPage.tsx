import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { useTravelBooking } from '../context/TravelBookingContext';

export const TrainsPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchCriteria, openBookingSummary, bookingSuccessAlert, clearBookingSuccessAlert } = useTravelBooking();

  const origin = searchCriteria.origin || 'New Delhi (NDLS)';
  const destination = searchCriteria.destination || 'Jaipur (JP)';
  const departDate = searchCriteria.departDate || '2026-11-02';
  const passengers = searchCriteria.passengers || '2 passengers';

  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Chair Car']);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['Early morning · 04–08', 'Morning · 08–12']);

  const displayDateFormatted = (() => {
    const d = new Date(departDate + 'T00:00:00');
    return !isNaN(d.getTime())
      ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      : departDate;
  })();

  const trains = [
    {
      id: '12015',
      name: 'Ajmer Shatabdi',
      number: '12015',
      frequency: 'Runs daily',
      depTime: '06:05',
      fromStation: origin,
      duration: '4h 35m',
      arrTime: '10:40',
      toStation: destination,
      classes: [
        { name: 'Chair Car (CC)', status: 'AVAILABLE 42', fare: '₹ 945' },
        { name: 'Exec Chair (EC)', status: 'AVAILABLE 12', fare: '₹ 1,785' },
      ],
    },
    {
      id: '20978',
      name: 'Vande Bharat Express',
      number: '20978',
      frequency: 'Runs daily except Wed',
      depTime: '06:10',
      fromStation: origin,
      duration: '3h 45m',
      arrTime: '09:55',
      toStation: destination,
      classes: [
        { name: 'Chair Car (CC)', status: 'AVAILABLE 18', fare: '₹ 1,050' },
        { name: 'Exec Chair (EC)', status: 'AVAILABLE 06', fare: '₹ 1,980' },
      ],
    },
    {
      id: '12986',
      name: 'Double Decker Express',
      number: '12986',
      frequency: 'Runs daily',
      depTime: '17:35',
      fromStation: origin,
      duration: '4h 30m',
      arrTime: '22:05',
      toStation: destination,
      classes: [
        { name: 'Chair Car (CC)', status: 'AVAILABLE 84', fare: '₹ 580' },
        { name: 'Exec Chair (EC)', status: 'WL 04', fare: '₹ 1,320' },
      ],
    },
  ];

  const handleBook = (train: typeof trains[0], classItem: typeof trains[0]['classes'][0]) => {
    const baseFare = parseInt(classItem.fare.replace(/[^0-9]/g, '')) || 945;
    const matchPassengers = passengers.match(/(\d+)/);
    const passengerCount = matchPassengers ? Math.max(1, parseInt(matchPassengers[1], 10)) : 1;
    const totalFare = baseFare * passengerCount;

    openBookingSummary({
      id: `${train.id}-${classItem.name}`,
      serviceType: 'trains',
      title: `${train.name} (${train.number})`,
      operator: `${train.name} · ${classItem.name}`,
      code: `#${train.number}`,
      route: `${origin} → ${destination}`,
      origin,
      destination,
      departDate,
      departTime: train.depTime,
      arriveTime: train.arrTime,
      duration: train.duration,
      travelClass: classItem.name,
      passengers,
      passengerCount,
      baseRatePerUnit: baseFare,
      fareFormatted: `₹ ${totalFare.toLocaleString('en-IN')}`,
      fareAmount: totalFare,
      refundable: true,
    });
  };

  const toggleClassFilter = (cls: string) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const toggleTimeFilter = (tm: string) => {
    setSelectedTimes((prev) =>
      prev.includes(tm) ? prev.filter((t) => t !== tm) : [...prev, tm]
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="trains" />

      {bookingSuccessAlert && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center justify-between gap-3 text-sm animate-fade-in max-w-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">train</span>
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
          <span className="text-[#6b7775]">Trains</span>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">{origin} to {destination}</span>
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#e3ded4] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Trains from {origin} to {destination}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              {displayDateFormatted} · {passengers} · 3 trains found
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors cursor-pointer"
          >
            Modify search
          </button>
        </div>

        {/* 2-Column Split: Filters + Train Cards (Page 17) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left Filters */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-[#e3ded4] p-4 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#e3ded4]">
                <h3 className="font-bold text-[#0d3d3a]">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedClasses(['Chair Car', 'Executive Chair', 'Sleeper', '3A / 2A']);
                    setSelectedTimes(['Early morning · 04–08', 'Morning · 08–12', 'Evening · 18–24']);
                  }}
                  className="text-[#0d6b63] hover:underline font-semibold"
                >
                  Clear all
                </button>
              </div>

              {/* Class */}
              <div className="space-y-2">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Class</label>
                {['Chair Car', 'Executive Chair', 'Sleeper', '3A / 2A'].map((cls) => (
                  <label key={cls} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls)}
                      onChange={() => toggleClassFilter(cls)}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{cls}</span>
                  </label>
                ))}
              </div>

              {/* Departure Time */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Departure time</label>
                {['Early morning · 04–08', 'Morning · 08–12', 'Evening · 18–24'].map((time) => (
                  <label key={time} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes(time)}
                      onChange={() => toggleTimeFilter(time)}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>

              {/* Train Type */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Train type</label>
                {['Shatabdi / Vande Bharat', 'Superfast', 'Express'].map((tp) => (
                  <label key={tp} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input type="checkbox" defaultChecked className="accent-[#0d6b63] rounded" />
                    <span>{tp}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Train Cards */}
          <div className="lg:col-span-9 space-y-4">
            <div className="text-xs text-[#6b7775]">
              Showing 3 trains · Fares per passenger · Sample data
            </div>

            {trains.map((train) => (
              <div
                key={train.id}
                className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm hover:border-[#0d6b63]/60 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ebe1]">
                  <div>
                    <h3 className="font-bold text-[#0d3d3a] text-base">{train.name}</h3>
                    <p className="text-xs text-[#6b7775]">#{train.number} · {train.frequency}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0d6b63] bg-[#e8f2f0] px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d6b63]"></span>
                    TDR Refund Protected
                  </div>
                </div>

                {/* Schedule Strip */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-base text-[#0d3d3a] block">{train.depTime}</span>
                    <span className="text-[#6b7775] text-xs">{train.fromStation}</span>
                  </div>

                  <div className="text-center text-xs text-[#889593]">
                    <span>{train.duration}</span>
                    <div className="w-24 sm:w-36 h-0.5 bg-[#e3ded4] my-1 relative">
                      <div className="w-2 h-2 rounded-full bg-[#0d6b63] absolute left-1/2 -top-0.5 -translate-x-1/2"></div>
                    </div>
                    <span>Direct</span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-base text-[#0d3d3a] block">{train.arrTime}</span>
                    <span className="text-[#6b7775] text-xs">{train.toStation}</span>
                  </div>
                </div>

                {/* Class Availability Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {train.classes.map((c) => (
                    <div
                      key={c.name}
                      className="p-3 rounded-lg border border-[#e3ded4] bg-[#fbf9f4] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#0d3d3a] block">{c.name}</span>
                        <span className="text-[11px] font-semibold text-[#166534]">{c.status}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-[#0d3d3a]">{c.fare}</span>
                        <button
                          type="button"
                          onClick={() => handleBook(train, c)}
                          className="bg-[#0d6b63] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#0a534d] transition-colors cursor-pointer"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
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
