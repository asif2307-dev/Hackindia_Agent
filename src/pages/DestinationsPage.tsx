import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { useTravelBooking } from '../context/TravelBookingContext';

type CategoryType = 'All' | 'Beaches' | 'Mountains' | 'Heritage' | 'Spiritual' | 'Backwaters' | 'International';

interface DestinationItem {
  id: string;
  name: string;
  category: CategoryType;
  tags: string;
  bestTime: string;
  startingPrice: string;
  image: string;
  description: string;
}

export const DestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchCriteria } = useTravelBooking();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

  const handleExplore = (destinationName: string) => {
    // Map common destination names to airport format if needed, or pass clean name
    const airportMap: Record<string, string> = {
      Kashmir: 'Srinagar (SXR)',
      Goa: 'Goa (GOI)',
      Manali: 'Kullu (KUU)',
      Jaipur: 'Jaipur (JAI)',
      'Kerala (Alleppey)': 'Kochi (COK)',
      Varanasi: 'Varanasi (VNS)',
      Dubai: 'Dubai (DXB)',
      Shimla: 'Shimla (SLV)',
    };
    const targetDest = airportMap[destinationName] || destinationName;
    setSearchCriteria({ destination: targetDest });
    navigate('/flights');
  };

  const categories: CategoryType[] = [
    'All',
    'Beaches',
    'Mountains',
    'Heritage',
    'Spiritual',
    'Backwaters',
    'International',
  ];

  const destinations: DestinationItem[] = [
    {
      id: 'kashmir',
      name: 'Kashmir',
      category: 'Mountains',
      tags: 'Lakes · Scenic views',
      bestTime: 'Sep – Nov & Apr – Jun',
      startingPrice: '₹ 4,899',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      description: 'Crisp mountain breeze, chinar foliage, shikara stays and alpine meadows.',
    },
    {
      id: 'goa',
      name: 'Goa',
      category: 'Beaches',
      tags: 'Beaches · Nightlife',
      bestTime: 'Nov – Feb',
      startingPrice: '₹ 3,299',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      description: 'Sun-kissed coastlines, vibrant beach shacks, Portuguese architecture and water sports.',
    },
    {
      id: 'manali',
      name: 'Manali',
      category: 'Mountains',
      tags: 'Mountains · Adventure',
      bestTime: 'Oct – Mar',
      startingPrice: '₹ 3,699',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      description: 'Snow peaks, Solang valley excursions, pine forests and river rafting.',
    },
    {
      id: 'jaipur',
      name: 'Jaipur',
      category: 'Heritage',
      tags: 'Heritage · Culture',
      bestTime: 'Oct – Mar',
      startingPrice: '₹ 6,999',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      description: 'Majestic forts, royal palaces, bustling bazaars and quintessential Rajasthani hospitality.',
    },
    {
      id: 'kerala',
      name: 'Kerala (Alleppey)',
      category: 'Backwaters',
      tags: 'Backwaters · Houseboats',
      bestTime: 'Sep – Mar',
      startingPrice: '₹ 5,499',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      description: 'Tranquil palm-fringed canals, traditional houseboats, spices and ayurvedic retreats.',
    },
    {
      id: 'varanasi',
      name: 'Varanasi',
      category: 'Spiritual',
      tags: 'Spiritual · Ghats',
      bestTime: 'Oct – Mar',
      startingPrice: '₹ 3,899',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient river ghats, evening Ganga Aarti, timeless spirituality and silk weaving.',
    },
    {
      id: 'dubai',
      name: 'Dubai',
      category: 'International',
      tags: 'International · Desert Safari',
      bestTime: 'Nov – Apr',
      startingPrice: '₹ 18,999',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      description: 'Iconic architecture, luxury desert camps, premier shopping and world-class attractions.',
    },
    {
      id: 'shimla',
      name: 'Shimla',
      category: 'Mountains',
      tags: 'Hills · Heritage',
      bestTime: 'Year round',
      startingPrice: '₹ 4,199',
      image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      description: 'Colonial charm on Mall Road, toy train rides, cedar forests and mountain vistas.',
    },
  ];

  const filtered = destinations.filter(
    (d) => selectedCategory === 'All' || d.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="destinations" />

      <main className="flex-1 w-full site-container py-8 text-left">
        {/* Breadcrumb */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Destinations</span>
        </div>

        {/* Title Header */}
        <div className="pb-6 border-b border-[#e3ded4]">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0d3d3a] tracking-tight">
            Where to next?
          </h1>
          <p className="text-sm sm:text-base text-[#5c6967] mt-1 max-w-2xl">
            Hand-picked places across India and beyond, with the best time to go and
            flights from your city.
          </p>
        </div>

        {/* Category Filter Pills (Page 4) */}
        <div className="py-4 border-b border-[#e3ded4] flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0d6b63] text-white'
                  : 'bg-white border border-[#e3ded4] text-[#42504e] hover:bg-[#eae4d8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FEATURED THIS SEASON BANNER (Page 4) */}
        <div className="my-8 rounded-2xl overflow-hidden border border-[#e3ded4] bg-white shadow-sm grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-7 h-64 md:h-auto overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80"
              alt="Kashmir featured season"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-md text-xs font-bold text-[#0d3d3a] uppercase tracking-wider shadow-sm">
              Featured this season
            </div>
          </div>

          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-center space-y-4">
            <div>
              <span className="text-xs font-bold text-[#0d6b63] uppercase tracking-wide">
                Kashmir
              </span>
              <h2 className="text-2xl font-bold text-[#0d3d3a] tracking-tight mt-1">
                Valley of Lakes & Meadows
              </h2>
              <p className="text-xs sm:text-sm text-[#5c6967] mt-2 leading-relaxed">
                Crisp autumn air, golden chinar leaves and tranquil shikaras on Dal Lake.
                Experience peaceful snow-lined peaks and valley warmth.
              </p>
            </div>

            <div className="pt-2 border-t border-[#f0ebe1] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#889593] block">Fares starting at</span>
                <span className="text-lg font-bold text-[#0d3d3a]">₹ 4,899</span>
              </div>
              <button
                onClick={() => handleExplore('Kashmir')}
                className="bg-[#0d6b63] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm"
              >
                Search flights →
              </button>
            </div>
          </div>
        </div>

        {/* Destinations Grid (Page 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="group bg-white rounded-xl border border-[#e3ded4] overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col cursor-pointer"
              onClick={() => handleExplore(d.name)}
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-0.5 rounded-md text-xs font-bold text-[#0d3d3a] shadow-sm">
                  From {d.startingPrice}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#0d3d3a] text-base group-hover:text-[#0d6b63] transition-colors">
                      {d.name}
                    </h3>
                    <span className="text-[11px] text-[#6b7775]">{d.tags}</span>
                  </div>
                  <p className="text-xs text-[#5c6967] mt-1.5 line-clamp-2 leading-relaxed">
                    {d.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f0ebe1] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#889593]">
                    Best: {d.bestTime}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplore(d.name);
                    }}
                    className="text-[#0d6b63] font-semibold hover:underline"
                  >
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
