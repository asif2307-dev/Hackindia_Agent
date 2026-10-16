import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { useTravelBooking } from '../context/TravelBookingContext';

export const HolidaysPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchCriteria, openBookingSummary } = useTravelBooking();
  const [selectedDestTypes, setSelectedDestTypes] = useState<string[]>(['Mountains', 'Beaches', 'Heritage', 'Backwaters']);
  const [selectedDurations, setSelectedDurations] = useState<string[]>(['3 – 4 nights', '5 – 6 nights', '7+ nights']);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>(['Flights included', 'Hotel stay', 'Meals', 'Sightseeing']);

  const packages = [
    {
      id: 'pkg1',
      tag: 'KASHMIR',
      title: 'Valley of Lakes & Meadows',
      duration: '5 Nights / 6 Days',
      locations: 'Srinagar · Gulmarg · Pahalgam',
      inclusions: ['Return flights included', '4-Star boutique stay', 'Breakfast & dinner', 'Shikara cruise on Dal Lake'],
      price: '₹ 28,499',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pkg2',
      tag: 'GOA',
      title: 'Goa Coastal Beach Retreat',
      duration: '4 Nights / 5 Days',
      locations: 'Candolim & Palolem',
      inclusions: ['Direct flights', 'Beachfront resort', 'Daily buffet breakfast', 'Airport transfers'],
      price: '₹ 16,999',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pkg3',
      tag: 'KERALA',
      title: 'Backwaters & Spice Hills',
      duration: '6 Nights / 7 Days',
      locations: 'Munnar · Thekkady · Alleppey',
      inclusions: ['Flights included', 'Private houseboat stay', 'All meals on houseboat', 'Sightseeing cab'],
      price: '₹ 32,500',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pkg4',
      tag: 'RAJASTHAN',
      title: 'Royal Heritage & Palaces',
      duration: '5 Nights / 6 Days',
      locations: 'Jaipur · Jodhpur · Udaipur',
      inclusions: ['Intercity AC cab', 'Heritage Haveli stays', 'Daily breakfast', 'Fort guided passes'],
      price: '₹ 24,999',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const parsedDate = new Date(searchCriteria.departDate + 'T00:00:00');
  const formattedDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : 'Nov – Dec 2026';

  const handleBook = (pkg: typeof packages[0]) => {
    const fareNum = parseInt(pkg.price.replace(/[^0-9]/g, '')) || 24999;
    openBookingSummary({
      id: pkg.id,
      serviceType: 'holidays',
      title: `${pkg.title} (${pkg.tag})`,
      operator: 'Agent Travel Holidays',
      code: `PKG-${pkg.tag}`,
      route: `${searchCriteria.origin || 'Delhi'} → ${pkg.locations}`,
      origin: searchCriteria.origin || 'Delhi',
      destination: pkg.locations,
      departDate: searchCriteria.departDate,
      duration: pkg.duration,
      passengers: searchCriteria.passengers || '2 travellers',
      fareFormatted: pkg.price,
      fareAmount: fareNum,
      baseRatePerUnit: fareNum,
      refundable: true,
      notes: `${pkg.duration} · ${pkg.inclusions.join(' · ')}`,
    });
  };

  const tagToCategory: Record<string, string> = {
    KASHMIR: 'Mountains',
    GOA: 'Beaches',
    KERALA: 'Backwaters',
    RAJASTHAN: 'Heritage',
  };

  const filteredPackages = packages.filter((pkg) => {
    const category = tagToCategory[pkg.tag] || 'Mountains';
    if (selectedDestTypes.length > 0 && !selectedDestTypes.includes(category)) {
      return false;
    }
    return true;
  });

  const toggleDestType = (dt: string) => {
    setSelectedDestTypes((prev) =>
      prev.includes(dt) ? prev.filter((item) => item !== dt) : [...prev, dt]
    );
  };

  const handleClearFilters = () => {
    setSelectedDestTypes(['Mountains', 'Beaches', 'Heritage', 'Backwaters']);
    setSelectedDurations(['3 – 4 nights', '5 – 6 nights', '7+ nights']);
    setSelectedInclusions(['Flights included', 'Hotel stay', 'Meals', 'Sightseeing']);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="holidays" />

      <main className="flex-1 w-full site-container py-6 text-left">
        {/* Breadcrumb */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="text-[#6b7775]">Holidays</span>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">From {searchCriteria.origin || 'Delhi'}</span>
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#e3ded4] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Holiday packages from {searchCriteria.origin || 'Delhi'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              Departing {formattedDate} · {searchCriteria.passengers || '2 travellers'} · {filteredPackages.length} packages found
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors"
          >
            Modify search
          </button>
        </div>

        {/* 2-Column Split: Filters + Packages (Page 20) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left Filters */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-[#e3ded4] p-4 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#e3ded4]">
                <h3 className="font-bold text-[#0d3d3a]">Filters</h3>
                <button onClick={handleClearFilters} className="text-[#0d6b63] hover:underline font-semibold">Clear all</button>
              </div>

              {/* Destination Type */}
              <div className="space-y-2">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Destination type</label>
                {['Mountains', 'Beaches', 'Heritage', 'Backwaters'].map((dt) => (
                  <label key={dt} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="checkbox"
                      checked={selectedDestTypes.includes(dt)}
                      onChange={() => toggleDestType(dt)}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{dt}</span>
                  </label>
                ))}
              </div>

              {/* Duration */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Duration</label>
                {['3 – 4 nights', '5 – 6 nights', '7+ nights'].map((dur) => (
                  <label key={dur} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="checkbox"
                      checked={selectedDurations.includes(dur)}
                      onChange={() => {
                        setSelectedDurations((prev) =>
                          prev.includes(dur) ? prev.filter((d) => d !== dur) : [...prev, dur]
                        );
                      }}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{dur}</span>
                  </label>
                ))}
              </div>

              {/* Inclusions */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">Inclusions</label>
                {['Flights included', 'Hotel stay', 'Meals', 'Sightseeing'].map((inc) => (
                  <label key={inc} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input
                      type="checkbox"
                      checked={selectedInclusions.includes(inc)}
                      onChange={() => {
                        setSelectedInclusions((prev) =>
                          prev.includes(inc) ? prev.filter((i) => i !== inc) : [...prev, inc]
                        );
                      }}
                      className="accent-[#0d6b63] rounded"
                    />
                    <span>{inc}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Packages List */}
          <div className="lg:col-span-9 space-y-4">
            <div className="text-xs text-[#6b7775]">
              Showing {filteredPackages.length} of {packages.length} packages · Prices are sample data per person on twin sharing
            </div>

            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl border border-[#e3ded4] overflow-hidden shadow-sm hover:border-[#0d6b63]/60 transition-all grid grid-cols-1 sm:grid-cols-12"
              >
                <div className="sm:col-span-4 h-48 sm:h-auto overflow-hidden relative">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0d3d3a]/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    {pkg.tag}
                  </div>
                </div>

                <div className="sm:col-span-8 p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#0d3d3a] text-base">{pkg.title}</h3>
                      <span className="text-xs font-semibold text-[#0d6b63] bg-[#e8f2f0] px-2 py-0.5 rounded">
                        {pkg.duration}
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7775] mt-0.5">{pkg.locations}</p>

                    <div className="grid grid-cols-2 gap-1.5 mt-3 text-xs text-[#42504e]">
                      {pkg.inclusions.map((inc) => (
                        <div key={inc} className="flex items-center gap-1.5">
                          <span className="text-[#166534] font-bold text-xs">✓</span>
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f0ebe1] flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-[#0d3d3a]">{pkg.price}</span>
                      <span className="text-[11px] text-[#889593] block">/ person</span>
                    </div>

                    <button
                      onClick={() => handleBook(pkg)}
                      className="bg-[#0d6b63] text-white px-5 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm"
                    >
                      Book package
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPackages.length === 0 && (
              <div className="bg-white rounded-xl border border-[#e3ded4] p-10 text-center text-[#6b7775]">
                <p className="text-sm font-semibold text-[#0d3d3a]">No packages match selected filters</p>
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
