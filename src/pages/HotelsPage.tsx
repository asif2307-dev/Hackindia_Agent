import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { useTravelBooking } from '../context/TravelBookingContext';

const parseLocalDate = (isoStr: string, fallback: Date) => {
  if (!isoStr) return fallback;
  const parts = isoStr.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const d = new Date(isoStr);
  return isNaN(d.getTime()) ? fallback : d;
};

export const HotelsPage: React.FC = () => {
  const { searchCriteria, setSearchCriteria, openBookingSummary, bookingSuccessAlert, clearBookingSuccessAlert } = useTravelBooking();

  const city = searchCriteria.destination || 'Goa';
  const checkIn = searchCriteria.departDate || '2026-12-21';
  const checkOut = searchCriteria.returnDate || '2026-12-24';
  const guests = searchCriteria.passengers || '2 Guests · 1 Room';

  // Inline Modify Search State
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [modCity, setModCity] = useState(city);
  const [modCheckIn, setModCheckIn] = useState(checkIn);
  const [modCheckOut, setModCheckOut] = useState(checkOut);
  const [modGuests, setModGuests] = useState(guests);
  const [modifyError, setModifyError] = useState<string | null>(null);

  // Exact stay duration calculation (21 Dec to 24 Dec = exactly 3 nights)
  const inDate = parseLocalDate(checkIn, new Date(2026, 11, 21));
  const outDate = parseLocalDate(checkOut, new Date(2026, 11, 24));
  const diffDays = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
  const nights = Math.max(1, diffDays > 0 ? diffDays : 1);

  // Room count extraction
  const matchRoom = guests.match(/(\d+)\s*room/i);
  const roomCount = searchCriteria.rooms || (matchRoom ? parseInt(matchRoom[1], 10) : 1);

  const checkInFormatted = inDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const checkOutFormatted = outDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const stayDurationText = `${nights} night${nights > 1 ? 's' : ''}`;

  const handleApplyModify = (e: React.FormEvent) => {
    e.preventDefault();
    const c = modCity.trim();
    if (!c) {
      setModifyError('Please specify a destination city.');
      return;
    }
    if (!modCheckIn || !modCheckOut) {
      setModifyError('Please select both check-in and check-out dates.');
      return;
    }
    const inD = parseLocalDate(modCheckIn, new Date());
    const outD = parseLocalDate(modCheckOut, new Date());
    if (outD.getTime() <= inD.getTime()) {
      setModifyError('Check-out date must be later than check-in date.');
      return;
    }
    setModifyError(null);
    setSearchCriteria({
      destination: c,
      departDate: modCheckIn,
      returnDate: modCheckOut,
      passengers: modGuests,
    });
    setIsModifyOpen(false);
  };

  const hotels = [
    {
      id: 'h1',
      name: 'Azure Bay Beach Resort',
      location: `Candolim, ${city}`,
      rating: 4.6,
      reviewsCount: '1,248 reviews',
      type: 'Resort',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      price: '₹ 7,499',
      features: ['Beachfront', 'Infinity pool', 'Free breakfast', 'Free cancellation'],
    },
    {
      id: 'h2',
      name: 'Heritage Palolem Villa & Spa',
      location: `Palolem, South ${city}`,
      rating: 4.8,
      reviewsCount: '890 reviews',
      type: 'Boutique Villa',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
      price: '₹ 5,850',
      features: ['Garden view', 'Ayurvedic spa', 'Free Wi-Fi', 'Free cancellation'],
    },
    {
      id: 'h3',
      name: 'Calangute Grand Resort',
      location: `Calangute, North ${city}`,
      rating: 4.3,
      reviewsCount: '2,100 reviews',
      type: 'Hotel',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
      price: '₹ 4,200',
      features: ['Near beach', 'Breakfast included', 'Swimming pool'],
    },
    {
      id: 'h4',
      name: 'Vivanta Goa Haven',
      location: `Panaji, ${city}`,
      rating: 4.7,
      reviewsCount: '1,560 reviews',
      type: '5-Star Luxury',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
      price: '₹ 11,200',
      features: ['5-Star', 'Riverfront dining', 'Airport transfer', 'Free cancellation'],
    },
  ];

  const handleBook = (hotel: typeof hotels[0]) => {
    const ratePerNight = parseInt(hotel.price.replace(/[^0-9]/g, '')) || 7499;
    const totalStayPrice = ratePerNight * nights * roomCount;
    const taxAmount = Math.round(totalStayPrice * 0.12);

    openBookingSummary({
      id: hotel.id,
      serviceType: 'hotels',
      title: hotel.name,
      operator: hotel.name,
      code: `#HTL-${hotel.id.toUpperCase()}`,
      route: `${hotel.location}`,
      origin: hotel.location,
      destination: city,
      departDate: checkIn,
      returnDate: checkOut,
      nights,
      rooms: roomCount,
      passengers: guests,
      baseRatePerUnit: ratePerNight,
      taxAmount,
      fareFormatted: `₹ ${totalStayPrice.toLocaleString('en-IN')}`,
      fareAmount: totalStayPrice,
      refundable: true,
      notes: `${hotel.type} · ${stayDurationText} (${checkInFormatted} to ${checkOutFormatted}) · Free cancellation`,
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="hotels" />

      {bookingSuccessAlert && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center justify-between gap-3 text-sm animate-fade-in max-w-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">hotel</span>
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
          <span className="text-[#6b7775]">Hotels</span>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">{city}</span>
        </div>

        {/* Title Bar & Modify Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#e3ded4] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Hotels in {city}
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              {checkInFormatted} – {checkOutFormatted} · <strong className="text-[#0d6b63] font-semibold">{stayDurationText}</strong> · {guests} · 186 stays found
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsModifyOpen(!isModifyOpen);
              setModCity(city);
              setModCheckIn(checkIn);
              setModCheckOut(checkOut);
              setModGuests(guests);
              setModifyError(null);
            }}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isModifyOpen ? 'close' : 'tune'}
            </span>
            <span>{isModifyOpen ? 'Close modify' : 'Modify search'}</span>
          </button>
        </div>

        {/* Inline Modify Search Drawer */}
        {isModifyOpen && (
          <form
            onSubmit={handleApplyModify}
            className="my-4 p-4 sm:p-5 bg-white rounded-xl border border-[#0d6b63]/30 shadow-md animate-fade-in text-left space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#e3ded4]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0d3d3a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">search</span>
                Modify Hotel Criteria
              </span>
              <span className="text-[11px] text-[#889593]">
                Duration and stay prices recalculate automatically
              </span>
            </div>

            {modifyError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>{modifyError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
              {/* Destination */}
              <div className="lg:col-span-4">
                <label className="text-[11px] font-bold text-[#5c6967] block uppercase mb-1">
                  Destination City
                </label>
                <input
                  type="text"
                  value={modCity}
                  onChange={(e) => {
                    setModCity(e.target.value);
                    setModifyError(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-[#e3ded4] rounded-lg focus:outline-none focus:border-[#0d6b63] bg-[#fbf9f4]"
                  placeholder="e.g. Goa, India"
                />
              </div>

              {/* Check-in */}
              <div className="lg:col-span-3">
                <label className="text-[11px] font-bold text-[#5c6967] block uppercase mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={modCheckIn}
                  onChange={(e) => {
                    setModCheckIn(e.target.value);
                    setModifyError(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-[#e3ded4] rounded-lg focus:outline-none focus:border-[#0d6b63] bg-[#fbf9f4]"
                />
              </div>

              {/* Check-out */}
              <div className="lg:col-span-3">
                <label className="text-[11px] font-bold text-[#5c6967] block uppercase mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={modCheckOut}
                  onChange={(e) => {
                    setModCheckOut(e.target.value);
                    setModifyError(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-[#e3ded4] rounded-lg focus:outline-none focus:border-[#0d6b63] bg-[#fbf9f4]"
                />
              </div>

              {/* Guests */}
              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-[#5c6967] block uppercase mb-1">
                  Guests & Rooms
                </label>
                <select
                  value={modGuests}
                  onChange={(e) => setModGuests(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#e3ded4] rounded-lg focus:outline-none focus:border-[#0d6b63] bg-[#fbf9f4]"
                >
                  <option value="1 Guest · 1 Room">1 Guest · 1 Room</option>
                  <option value="2 Guests · 1 Room">2 Guests · 1 Room</option>
                  <option value="3 Guests · 1 Room">3 Guests · 1 Room</option>
                  <option value="4 Guests · 2 Rooms">4 Guests · 2 Rooms</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e3ded4]">
              <button
                type="button"
                onClick={() => setIsModifyOpen(false)}
                className="px-3.5 py-1.5 text-xs text-[#5c6967] hover:text-[#0d3d3a] hover:bg-[#f0ebe1] rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-[#0d6b63] text-white hover:bg-[#0a534d] rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px]">check</span>
                <span>Update Hotels</span>
              </button>
            </div>
          </form>
        )}

        {/* 2-Column Split: Filters + Hotel Cards (Page 16) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left Filters */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-[#e3ded4] p-4 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#e3ded4]">
                <h3 className="font-bold text-[#0d3d3a]">Filters</h3>
                <button className="text-[#0d6b63] hover:underline font-semibold">Clear all</button>
              </div>

              {/* Price Per Night */}
              <div className="space-y-2">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">
                  Price per night
                </label>
                <div className="flex items-center justify-between text-[#5c6967]">
                  <span>₹ 2,000</span>
                  <span>₹ 15,000</span>
                </div>
                <input type="range" min="2000" max="15000" className="w-full accent-[#0d6b63]" />
              </div>

              {/* Property Type */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">
                  Property type
                </label>
                {['Resorts', 'Hotels', 'Boutique stays', 'Villas'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input type="checkbox" defaultChecked={type === 'Resorts'} className="accent-[#0d6b63] rounded" />
                    <span>{type}</span>
                  </label>
                ))}
              </div>

              {/* Star Rating */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">
                  Star rating
                </label>
                {['5 stars', '4 stars', '3 stars'].map((star) => (
                  <label key={star} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input type="checkbox" defaultChecked className="accent-[#0d6b63] rounded" />
                    <span>{star}</span>
                  </label>
                ))}
              </div>

              {/* Amenities */}
              <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                <label className="font-bold text-[#0d3d3a] uppercase tracking-wider block">
                  Amenities
                </label>
                {['Free breakfast', 'Pool', 'Free cancellation', 'Airport transfer'].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer text-[#42504e]">
                    <input type="checkbox" defaultChecked={amenity === 'Free cancellation'} className="accent-[#0d6b63] rounded" />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Hotel Results */}
          <div className="lg:col-span-9 space-y-4">
            <div className="text-xs text-[#6b7775] flex items-center justify-between pb-1">
              <span>Showing 4 of 186 stays · Sorted by recommended</span>
            </div>

            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-xl border border-[#e3ded4] overflow-hidden shadow-sm hover:border-[#0d6b63]/60 transition-all grid grid-cols-1 sm:grid-cols-12"
              >
                <div className="sm:col-span-5 h-48 sm:h-auto overflow-hidden relative">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0d3d3a]/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    {hotel.type}
                  </div>
                </div>

                <div className="sm:col-span-7 p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#0d3d3a] text-base">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-[#e8f2f0] text-[#0d6b63] px-2 py-0.5 rounded text-xs font-bold">
                        <span>★</span>
                        <span>{hotel.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6b7775] mt-0.5">{hotel.location} · {hotel.reviewsCount}</p>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {hotel.features.map((f) => (
                        <span key={f} className="text-[11px] bg-[#fbf9f4] border border-[#e3ded4] px-2 py-0.5 rounded text-[#42504e]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f0ebe1] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-[#0d3d3a]">{hotel.price}</span>
                        <span className="text-[11px] text-[#889593]">/ night</span>
                      </div>
                      <span className="text-xs font-semibold text-[#0d6b63] block mt-0.5">
                        Total: ₹ {(parseInt(hotel.price.replace(/[^0-9]/g, '')) * nights * roomCount).toLocaleString('en-IN')} for {nights} night{nights > 1 ? 's' : ''}{roomCount > 1 ? ` · ${roomCount} rooms` : ''}
                      </span>
                    </div>

                    <button
                      onClick={() => handleBook(hotel)}
                      className="bg-[#0d6b63] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
                    >
                      Book stay
                    </button>
                  </div>
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
