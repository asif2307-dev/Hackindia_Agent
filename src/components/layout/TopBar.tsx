import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation } from '../../context/InvestigationContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setIsSearchModalOpen } = useInvestigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNotifications) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    // Listen to both mousedown (desktop) and touchstart (mobile)
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotifications]);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.03)] border-b border-[#006D77]/10 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-700 hover:bg-[#006D77]/10 hover:text-[#006D77] transition-colors"
          aria-label="Open audit menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Back to Home Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#17324D] hover:text-[#006D77] bg-[#f0f5f7] hover:bg-[#EAF8F7] border border-[#006D77]/15 hover:border-[#20B8B0]/40 transition-colors cursor-pointer shrink-0 shadow-2xs"
          title="Back to Agent Travel Homepage"
        >
          <span className="material-symbols-outlined text-[16px] text-[#006D77]">arrow_back</span>
          <span className="hidden sm:inline">Back to Home</span>
        </button>

        {/* Global Search Pill */}
        <div
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-space-xs w-full bg-[#f0f5f7] hover:bg-[#e7eff2] rounded-full px-3.5 py-1.5 border border-[#006D77]/15 hover:border-[#006D77]/40 transition-all cursor-pointer group shadow-xs"
        >
          <span className="material-symbols-outlined text-[#006D77] text-[19px] group-hover:scale-105 transition-transform">
            search
          </span>
          <input
            className="bg-transparent w-full text-[#0d283e] placeholder:text-gray-500 focus:outline-none text-xs sm:text-sm font-medium cursor-pointer"
            placeholder="Search bookings, PNR, carrier, or refund ID..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            readOnly
          />
          <div className="hidden sm:flex px-2 py-0.5 rounded-full bg-white text-gray-600 font-mono text-[10px] uppercase border border-gray-200 shrink-0 font-bold">
            ⌘K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-space-sm lg:gap-space-md">
        {/* Notifications Button & Dropdown Container */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-full text-gray-700 hover:text-[#006D77] hover:bg-[#006D77]/10 transition-colors cursor-pointer"
            type="button"
            title="Notifications"
            aria-expanded={showNotifications}
            aria-haspopup="true"
            aria-label="Toggle notifications panel"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8B86D] ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-[#006D77]/20 p-space-md z-50 animate-fade-in"
              role="region"
              aria-label="Auditor Alerts"
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <span className="font-headline-sm text-[15px] font-bold text-[#0d283e]">Auditor Alerts</span>
                <span className="px-2 py-0.5 rounded-full bg-[#006D77]/10 text-[#006D77] text-[11px] font-bold">
                  2 Pending
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#006D77]/5 transition-colors flex items-start gap-2.5 border border-transparent hover:border-[#006D77]/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0d283e]">
                      High-Risk Investigation #RF-1042 Flagged
                    </span>
                    <span className="text-[11px] text-gray-600 mt-0.5">
                      Conflicting carrier logs require senior auditor authorization.
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-1">12 mins ago</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#006D77]/5 transition-colors flex items-start gap-2.5 border border-transparent hover:border-[#006D77]/20">
                  <span className="w-2 h-2 rounded-full bg-[#006D77] mt-1.5 shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0d283e]">
                      Case #AT-9842 Ready for Authorization
                    </span>
                    <span className="text-[11px] text-gray-600 mt-0.5">
                      Full refund of ₹9,450 recommended under DGCA policy.
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-1">28 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-space-xs border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#006D77] to-[#20B8B0] flex items-center justify-center text-white shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0d283e] leading-tight">
              Julian Hayes
            </span>
            <span className="text-[10px] font-semibold text-[#006D77] leading-tight">
              Lead Auditor
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
