import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { useTravelBooking } from '../context/TravelBookingContext';

export const CabsPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchCriteria, openBookingSummary } = useTravelBooking();
  const [selectedTripType, setSelectedTripType] = useState('Airport transfer');
  const [selectedCabTypes, setSelectedCabTypes] = useState<string[]>(['Hatchback', 'Sedan', 'SUV', 'Premium SUV']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Flight tracking']);

  const cabs = [
    {
      id: 'c1',
      type: 'Hatchback',
      model: 'WagonR, Tiago or similar',
      capacity: 'Up to 4 passengers · 2 bags',
      features: ['Air conditioning', 'Clean sanitized cab', 'Free cancellation up to 1h before'],
      fare: '₹ 650',
    },
    {
      id: 'c2',
      type: 'Sedan',
      model: 'Dzire, Etios or similar',
      capacity: 'Up to 4 passengers · 3 bags',
      features: ['Spacious trunk', 'Top driver rating', 'Flight delay buffer included'],
      fare: '₹ 850',
    },
    {
      id: 'c3',
      type: 'SUV',
      model: 'Ertiga, Carens or similar',
      capacity: 'Up to 6 passengers · 4 bags',
      features: ['Extra legroom', 'Carrier on roof', 'Free cancellation'],
      fare: '₹ 1,350',
    },
    {
      id: 'c4',
      type: 'Premium SUV',
      model: 'Innova Crysta or Camry',
      capacity: 'Up to 6 passengers · 5 bags',
      features: ['Executive chauffeur', 'Meet & greet inside terminal', 'Premium leather seating'],
      fare: '₹ 1,950',
    },
  ];

  const parsedDate = new Date(searchCriteria.departDate + 'T00:00:00');
  const formattedDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    : 'Sat, 24 Oct 2026';

  const handleBook = (cab: typeof cabs[0]) => {
    const fareNum = parseInt(cab.fare.replace(/[^0-9]/g, '')) || 850;
    openBookingSummary({
      id: cab.id,
      serviceType: 'cabs',
      title: `${cab.type} Transfer`,
      operator: 'Agent Travel Fleet',
      code: `CAB-${cab.type.toUpperCase().replace(/\s+/g, '')}`,
      route: `${searchCriteria.origin || 'Delhi Airport'} → ${searchCriteria.destination || 'Connaught Place'}`,
      origin: searchCriteria.origin || 'Delhi Airport',
      destination: searchCriteria.destination || 'Connaught Place',
      departDate: searchCriteria.departDate,
      departTime: '08:30',
      arriveTime: '09:15',
      duration: '45m',
      travelClass: cab.type,
      passengers: searchCriteria.passengers || '2 passengers',
      fareFormatted: cab.fare,
      fareAmount: fareNum,
      baseRatePerUnit: fareNum,
      refundable: true,
      notes: `${cab.capacity} · Tolls & taxes included`,
    });
  };

  const filteredCabs = cabs.filter((c) => {
    if (selectedCabTypes.length > 0 && !selectedCabTypes.includes(c.type)) {
      return false;
    }
    return true;
  });

  const toggleCabType = (type: string) => {
    setSelectedCabTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedCabTypes(['Hatchback', 'Sedan', 'SUV', 'Premium SUV']);
    setSelectedFeatures([]);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="cabs" />

      <main className="flex-1 w-full site-container py-6 text-left">
        {/* Breadcrumb */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="text-[#6b7775]">Cabs</span>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Airport transfer</span>
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#e3ded4] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Cabs from {searchCriteria.origin || 'Delhi Airport'} to {searchCriteria.destination || 'Connaught Place'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              {formattedDate} · Pickup 08:30 · {searchCriteria.passengers || '2 passengers'} · Approx. 16 km, 45 min
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors"
          >
            Modify search
          </button>
        </div>

        {/* 2-Column Split: Filters + Cab Cards (Page 19) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left Filters */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-[#e3ded4] p-4 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#e3ded4]">
                <h3 className="font-bold text-[#0d3d3a]">Filters</h3>
                <button onClick={handleClearFilters} className="text-[#0d6b63] hover:underline font-semibold">Clear all</button>
              </div>

              {/* Trip Type */}
              <div className="space-y-2">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Trip type</label>
                {['Airport transfer', 'One-way outstation', 'Round trip', 'Hourly rental'].map((tt) => (
                  <label key={tt} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="radio"
                      name="tripType"
                      checked={selectedTripType === tt}
                      onChange={() => setSelectedTripType(tt)}
                      className="accent-[#0d6b63]"
                    />
                    <span>{tt}</span>
                  </label>
                ))}
              </div>

              {/* Cab Type */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Cab type</label>
                {['Hatchback', 'Sedan', 'SUV', 'Premium SUV'].map((ct) => (
                  <label key={ct} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="checkbox"
                      checked={selectedCabTypes.includes(ct)}
                      onChange={() => toggleCabType(ct)}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{ct}</span>
                  </label>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Features</label>
                {['Meet & greet', 'Flight tracking', 'Extra luggage space'].map((f) => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(f)}
                      onChange={() => {
                        setSelectedFeatures((prev) =>
                          prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
                        );
                      }}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Cab Cards */}
          <div className="lg:col-span-9 space-y-4">
            <div className="text-xs text-[#6b7775]">
              {filteredCabs.length} cab {filteredCabs.length === 1 ? 'type' : 'types'} available · Sample fares with toll included
            </div>

            {filteredCabs.map((cab) => (
              <div
                key={cab.id}
                className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm hover:border-[#0d6b63]/60 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f0ebe1]">
                  <div>
                    <h3 className="font-bold text-[#0d3d3a] text-base">{cab.type}</h3>
                    <p className="text-xs text-[#6b7775]">{cab.model}</p>
                  </div>
                  <span className="text-xs text-[#166534] font-semibold bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#bbf7d0]">
                    Instant Confirmation
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#42504e]">
                  <span className="font-medium text-[#0d3d3a]">{cab.capacity}</span>
                  <span className="text-[#889593]">•</span>
                  <div className="flex flex-wrap gap-2">
                    {cab.features.map((feat) => (
                      <span key={feat} className="bg-[#fbf9f4] px-2 py-0.5 rounded border border-[#e3ded4] text-[11px]">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f0ebe1] flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-[#0d3d3a]">{cab.fare}</span>
                    <span className="text-[11px] text-[#889593] block">Tolls & taxes included</span>
                  </div>

                  <button
                    onClick={() => handleBook(cab)}
                    className="bg-[#0d6b63] text-white px-5 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm"
                  >
                    Book cab
                  </button>
                </div>
              </div>
            ))}

            {filteredCabs.length === 0 && (
              <div className="bg-white rounded-xl border border-[#e3ded4] p-10 text-center text-[#6b7775]">
                <p className="text-sm font-semibold text-[#0d3d3a]">No cabs match selected filters</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-2 text-xs font-semibold text-[#0d6b63] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
