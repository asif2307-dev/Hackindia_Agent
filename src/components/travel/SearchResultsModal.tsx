import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResultsModalProps {
  isOpen: boolean;
  searchData: any;
  onClose: () => void;
}

export const SearchResultsModal: React.FC<SearchResultsModalProps> = ({
  isOpen,
  searchData,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !searchData) return null;

  const getResults = () => {
    switch (searchData.type) {
      case 'flights':
        return [
          {
            operator: 'Air India',
            code: 'AI-805',
            depart: '08:15',
            arrive: '10:35',
            duration: '2h 20m',
            route: `${searchData.fromCity || 'Delhi'} → ${searchData.toCity || 'Mumbai'}`,
            price: '₹4,950',
            refundEligible: true,
            stops: 'Non-stop',
          },
          {
            operator: 'IndiGo',
            code: '6E-241',
            depart: '11:30',
            arrive: '13:45',
            duration: '2h 15m',
            route: `${searchData.fromCity || 'Delhi'} → ${searchData.toCity || 'Mumbai'}`,
            price: '₹4,420',
            refundEligible: true,
            stops: 'Non-stop',
          },
          {
            operator: 'Vistara',
            code: 'UK-992',
            depart: '17:00',
            arrive: '19:15',
            duration: '2h 15m',
            route: `${searchData.fromCity || 'Delhi'} → ${searchData.toCity || 'Mumbai'}`,
            price: '₹5,800',
            refundEligible: true,
            stops: 'Non-stop',
          },
        ];
      case 'trains':
        return [
          {
            operator: 'Vande Bharat Express',
            code: '22436',
            depart: '06:00',
            arrive: '14:00',
            duration: '8h 00m',
            route: `${searchData.fromStation || 'New Delhi'} → ${searchData.toStation || 'Varanasi'}`,
            price: '₹1,750 (CC)',
            refundEligible: true,
            stops: '4 Stops • High Speed',
          },
          {
            operator: 'Tejas Rajdhani Express',
            code: '12952',
            depart: '16:55',
            arrive: '08:35 (+1)',
            duration: '15h 40m',
            route: `${searchData.fromStation || 'New Delhi'} → ${searchData.toStation || 'Mumbai Central'}`,
            price: '₹3,240 (3A)',
            refundEligible: true,
            stops: 'Priority Express',
          },
        ];
      case 'hotels':
        return [
          {
            operator: 'Taj Fort Aguada Resort & Spa',
            code: '5-Star Luxury Resort',
            depart: searchData.checkIn,
            arrive: searchData.checkOut,
            duration: 'Ocean View Villa',
            route: `${searchData.city || 'Goa'}, Candolim Beach`,
            price: '₹14,500/night',
            refundEligible: true,
            stops: 'Free Cancellation till 24h prior',
          },
          {
            operator: 'Alila Diwa Luxury Heritage Resort',
            code: '5-Star Resort',
            depart: searchData.checkIn,
            arrive: searchData.checkOut,
            duration: 'Paddy Field View',
            route: `${searchData.city || 'Goa'}, Majorda Beach`,
            price: '₹9,800/night',
            refundEligible: true,
            stops: 'Includes Breakfast',
          },
        ];
      case 'buses':
        return [
          {
            operator: 'IntrCity SmartBus (Volvo Multi-Axle)',
            code: 'AC Sleeper 2+1',
            depart: '20:30',
            arrive: '09:00 (+1)',
            duration: '12h 30m',
            route: `${searchData.fromCity || 'Delhi'} → ${searchData.toCity || 'Manali'}`,
            price: '₹1,450',
            refundEligible: true,
            stops: 'Live GPS • Charging Point',
          },
          {
            operator: 'Zingbus Electric Lounge',
            code: 'Luxury AC Sleeper',
            depart: '21:15',
            arrive: '09:45 (+1)',
            duration: '12h 30m',
            route: `${searchData.fromCity || 'Delhi'} → ${searchData.toCity || 'Manali'}`,
            price: '₹1,299',
            refundEligible: true,
            stops: 'On-time Guarantee',
          },
        ];
      default:
        return [
          {
            operator: `${searchData.type?.toUpperCase()} Premier Option`,
            code: 'Standard Package',
            depart: 'Scheduled',
            arrive: 'Confirmed',
            duration: 'Direct Route',
            route: 'Verified Itinerary',
            price: '₹3,500',
            refundEligible: true,
            stops: 'Statutory Protection Included',
          },
        ];
    }
  };

  const results = getResults();

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#C2EAE7] overflow-hidden text-left" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#0a1e2e] text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E8B86D]">verified</span>
              <h3 className="font-extrabold text-xl capitalize font-['Plus_Jakarta_Sans']">
                {searchData.type} Search Results
              </h3>
            </div>
            <p className="text-xs text-white/80 mt-1">
              Active query with Agent Travel Autonomous Disruption & Refund Protection
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EAF8F7] border border-[#BCE8E4] text-[#006D77] text-xs font-semibold">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#20B8B0]">security</span>
              Every booking through Agent Travel is backed by automated refund monitoring against DGCA CAR & carrier policies.
            </span>
            <span className="hidden sm:inline font-bold uppercase tracking-wider text-[10px] bg-[#20B8B0]/20 text-[#006D77] px-2.5 py-0.5 rounded-full">
              Protected
            </span>
          </div>

          {results.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-gray-200 hover:border-[#20B8B0] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-[#17324D]">{item.operator}</span>
                  <span className="text-xs font-bold text-[#5A738E] bg-[#EAF8F7] px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                  <span className="text-[11px] font-semibold text-[#006D77] bg-[#EAF8F7] px-2 py-0.5 rounded border border-[#BCE8E4]">
                    {item.stops}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#17324D] mt-1">{item.route}</div>
                <div className="text-xs text-[#5A738E] flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-[#17324D]">{item.depart}</span>
                  <span>&rarr;</span>
                  <span className="font-bold text-[#17324D]">{item.arrive}</span>
                  <span>({item.duration})</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="font-black text-xl text-[#006D77]">{item.price}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/dashboard');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-[#EAF8F7] text-[#17324D] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Protect Trip
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/bookings');
                    }}
                    className="px-4 py-1.5 rounded-full bg-[#006D77] hover:bg-[#00565E] text-white text-xs font-extrabold shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#EAF8F7]/50 p-4 border-t border-[#C2EAE7] flex items-center justify-between text-xs text-[#5A738E]">
          <span>Search timestamp: {new Date().toLocaleTimeString()}</span>
          <button
            onClick={onClose}
            className="font-bold text-[#006D77] hover:underline cursor-pointer"
          >
            Modify Search
          </button>
        </div>
      </div>
    </div>
  );
};
