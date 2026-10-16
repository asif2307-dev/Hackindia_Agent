import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const ReviewerHeader: React.FC = () => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Internal Notice Strip */}
      <div className="w-full bg-[#062423] text-[#9fc2be] text-[11px] font-medium tracking-wide py-1 px-4 sm:px-6 flex items-center justify-between border-b border-[#133b3a]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#20B8B0] animate-pulse"></span>
          <span>INTERNAL REVIEWER CONSOLE · Not visible to travellers</span>
        </div>
        <Link
          to="/"
          className="text-[#d5e7e4] hover:text-white transition-colors flex items-center gap-1 text-[11px] font-semibold underline"
        >
          <span>Switch to Traveller View</span>
          <span className="material-symbols-outlined text-[13px]">open_in_new</span>
        </Link>
      </div>

      {/* Main Dark Teal Navigation Bar */}
      <div className="w-full bg-[#0a3635] text-white border-b border-[#134947]">
        <div className="site-container h-15 flex items-center justify-between gap-4 py-2.5">
          {/* Logo & Console Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/reviewer" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-md bg-[#0d6b63] border border-white/20 text-white flex items-center justify-center font-bold text-sm">
                AT
              </span>
              <div className="flex flex-col text-left">
                <span className="text-white font-bold text-base leading-tight tracking-tight">
                  Agent Travel
                </span>
                <span className="text-[#a4c7c3] text-[11px] leading-tight font-medium">
                  Reviewer console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/reviewer"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isCurrent('/reviewer') || isCurrent('/reviews') || isCurrent('/reviewer/queue')
                  ? 'bg-white/15 text-white'
                  : 'text-[#c2dedb] hover:text-white hover:bg-white/10'
              }`}
            >
              Review queue
            </Link>
            <Link
              to="/reviewer/cases"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isCurrent('/reviewer/cases') || isCurrent('/refund-investigations')
                  ? 'bg-white/15 text-white'
                  : 'text-[#c2dedb] hover:text-white hover:bg-white/10'
              }`}
            >
              All cases
            </Link>
            <Link
              to="/reviewer/analytics"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isCurrent('/reviewer/analytics') || isCurrent('/analytics')
                  ? 'bg-white/15 text-white'
                  : 'text-[#c2dedb] hover:text-white hover:bg-white/10'
              }`}
            >
              Analytics
            </Link>
            <Link
              to="/reviewer/audit"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isCurrent('/reviewer/audit')
                  ? 'bg-white/15 text-white'
                  : 'text-[#c2dedb] hover:text-white hover:bg-white/10'
              }`}
            >
              Audit log
            </Link>
            <Link
              to="/reviewer/settings"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isCurrent('/reviewer/settings')
                  ? 'bg-white/15 text-white'
                  : 'text-[#c2dedb] hover:text-white hover:bg-white/10'
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Right User Profile (Meera Iyer - Senior Reviewer) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 text-right">
              <div className="hidden sm:flex flex-col">
                <span className="text-white text-xs font-bold leading-tight">Meera Iyer</span>
                <span className="text-[#a4c7c3] text-[10px] leading-tight">Senior reviewer</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#185e5b] border border-[#2db3a8]/40 text-[#b5ece7] font-bold text-xs flex items-center justify-center">
                M
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
