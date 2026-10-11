import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FlightBookingForm } from './forms/FlightBookingForm';
import { HotelBookingForm } from './forms/HotelBookingForm';
import { HolidayBookingForm } from './forms/HolidayBookingForm';
import { BusBookingForm } from './forms/BusBookingForm';
import { TrainBookingForm } from './forms/TrainBookingForm';
import { CabBookingForm } from './forms/CabBookingForm';
import { SearchResultsModal } from './SearchResultsModal';

export type ServiceTab = 'flights' | 'hotels' | 'holidays' | 'bus' | 'trains' | 'cabs';

interface MultiServiceBookingPanelProps {
  currentTab?: ServiceTab;
  initialFrom?: string;
  initialTo?: string;
  onTabChange?: (tab: ServiceTab) => void;
}

export const MultiServiceBookingPanel: React.FC<MultiServiceBookingPanelProps> = ({
  currentTab = 'flights',
  initialFrom,
  initialTo,
  onTabChange,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ServiceTab>(currentTab);
  const [activeSearchResults, setActiveSearchResults] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync external tab changes (e.g. from AI Search Bar)
  React.useEffect(() => {
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [currentTab]);

  const handleTabSelect = (tab: ServiceTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const handleSearchTrigger = (searchData: any) => {
    setActiveSearchResults(searchData);
    setIsModalOpen(true);
  };

  const tabs = [
    { id: 'flights', label: t('tab.flights', 'Flights'), icon: 'flight', desc: t('tab.flightsDesc', 'Domestic & Intl') },
    { id: 'hotels', label: t('tab.hotels', 'Hotels'), icon: 'hotel', desc: t('tab.hotelsDesc', 'Resorts & Homestays') },
    { id: 'holidays', label: t('tab.holidays', 'Holidays'), icon: 'luggage', desc: t('tab.holidaysDesc', 'Packages & Tours') },
    { id: 'bus', label: t('tab.bus', 'Bus'), icon: 'directions_bus', desc: t('tab.busDesc', 'Volvo & Intercity') },
    { id: 'trains', label: t('tab.trains', 'Trains'), icon: 'train', desc: t('tab.trainsDesc', 'IRCTC & Vande Bharat') },
    { id: 'cabs', label: t('tab.cabs', 'Cabs'), icon: 'local_taxi', desc: t('tab.cabsDesc', 'Airport & Outstation') },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(0,109,119,0.22)] border border-[#C2EAE7] overflow-hidden text-left relative z-10">
      {/* Top Six Service Tabs */}
      <div className="bg-gradient-to-r from-[#EAF8F7] via-white to-[#EAF8F7] border-b border-[#C2EAE7] px-2 sm:px-6 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[560px] gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabSelect(tab.id as ServiceTab)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 sm:py-3 px-3 rounded-2xl transition-all duration-200 cursor-pointer relative ${
                  isActive
                    ? 'bg-[#006D77] text-white shadow-md transform -translate-y-0.5'
                    : 'text-[#17324D] hover:text-[#006D77] hover:bg-[#EAF8F7]/70'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`material-symbols-outlined text-[20px] sm:text-[22px] ${isActive ? 'text-[#E8B86D]' : 'text-[#5A738E]'}`}>
                    {tab.icon}
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight font-['Plus_Jakarta_Sans']">
                    {tab.label}
                  </span>
                </div>
                <span className={`text-[10px] font-medium hidden sm:inline-block mt-0.5 ${isActive ? 'text-white/80' : 'text-[#5A738E]'}`}>
                  {tab.desc}
                </span>

                {/* Active Underline Pill */}
                {isActive && (
                  <div className="absolute -bottom-2 w-8 h-1 bg-[#20B8B0] rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Form Panels */}
      <div className="p-4 sm:p-7 bg-white">
        {activeTab === 'flights' && (
          <FlightBookingForm
            initialFrom={initialFrom || 'Delhi'}
            initialTo={initialTo || 'Mumbai'}
            onSearch={handleSearchTrigger}
          />
        )}

        {activeTab === 'hotels' && (
          <HotelBookingForm
            initialCity={initialFrom || 'Goa'}
            onSearch={handleSearchTrigger}
          />
        )}

        {activeTab === 'holidays' && (
          <HolidayBookingForm
            onSearch={handleSearchTrigger}
          />
        )}

        {activeTab === 'bus' && (
          <BusBookingForm
            initialFrom={initialFrom || 'Delhi'}
            initialTo={initialTo || 'Manali'}
            onSearch={handleSearchTrigger}
          />
        )}

        {activeTab === 'trains' && (
          <TrainBookingForm
            initialFrom={initialFrom || 'New Delhi'}
            initialTo={initialTo || 'Mumbai Central'}
            onSearch={handleSearchTrigger}
          />
        )}

        {activeTab === 'cabs' && (
          <CabBookingForm
            onSearch={handleSearchTrigger}
          />
        )}
      </div>

      {/* Search Results Preview Modal */}
      <SearchResultsModal
        isOpen={isModalOpen}
        searchData={activeSearchResults}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
