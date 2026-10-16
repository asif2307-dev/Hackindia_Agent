import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

export const HotelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookedHotel, setBookedHotel] = useState<string | null>(null);

  const hotels = [
    {
      id: 'h1',
      name: 'Azure Bay Beach Resort',
      location: 'Candolim, Goa',
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
      location: 'Palolem, South Goa',
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
      location: 'Calangute, North Goa',
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
      location: 'Panaji, Goa',
      rating: 4.7,
      reviewsCount: '1,560 reviews',
      type: '5-Star Luxury',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
      price: '₹ 11,200',
      features: ['5-Star', 'Riverfront dining', 'Airport transfer', 'Free cancellation'],
    },
  ];

  const handleBook = (name: string) => {
    setBookedHotel(name);
    setTimeout(() => {
      navigate('/bookings');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="hotels" />

      {bookedHotel && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center gap-2 text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Reservation at {bookedHotel} confirmed with refund protection!</span>
        </div>
      )}

      <main className="flex-1 w-full site-container py-6 text-left">
        {/* Breadcrumb */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="text-[#6b7775]">Hotels</span>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Goa</span>
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#e3ded4] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Hotels in Goa
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              12 – 16 Dec 2026 · 2 guests · 1 room · 186 stays found
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-3.5 py-1.5 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors"
          >
            Modify search
          </button>
        </div>

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

                  <div className="pt-3 border-t border-[#f0ebe1] flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#0d3d3a]">{hotel.price}</span>
                      <span className="text-[11px] text-[#889593] block">/ night · includes taxes</span>
                    </div>

                    <button
                      onClick={() => handleBook(hotel.name)}
                      className="bg-[#0d6b63] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm"
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
