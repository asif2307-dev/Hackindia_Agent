import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: 'grid_view',
      activeExact: true,
    },
    {
      name: 'Bookings',
      path: '/bookings',
      icon: 'flight_takeoff',
    },
    {
      name: 'Refund Investigations',
      path: '/refund-investigations',
      icon: 'policy',
      indicator: true,
    },
    {
      name: 'Reviews',
      path: '/reviews',
      icon: 'rate_review',
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: 'monitoring',
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: 'settings',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#0c2438] via-[#081e2e] to-[#061622] text-white border-r border-[#006D77]/20 shadow-2xl z-40 flex flex-col justify-between py-space-md transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-space-md">
          {/* Back Button (Replaces Agent Travel YATRA Audit Console) */}
          <div className="px-space-md flex items-center justify-between h-12 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => {
                onClose?.();
                navigate('/');
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-[#20B8B0]/20 text-white hover:text-[#20B8B0] border border-white/15 hover:border-[#20B8B0]/40 transition-all group w-full cursor-pointer shadow-xs"
              title="Back to Agent Travel Homepage"
            >
              <span className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-[#20B8B0] group-hover:text-[#0d283e] flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold tracking-tight text-white group-hover:text-[#20B8B0] font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                  Back to Home
                </span>
                <span className="text-[10px] text-white/60 group-hover:text-white/80">
                  Return to Travel Portal
                </span>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden ml-2 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            <div className="px-space-md pb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#20B8B0]/80 font-bold">
                Audit Operations
              </span>
            </div>

            <nav className="flex flex-col gap-1 px-space-sm">
              {navItems.map((item) => {
                const isActive =
                  item.activeExact
                    ? location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/overview')
                    : location.pathname.startsWith(item.path);

                const dataPath = item.path.replace('/', '') || 'overview';

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      onClose?.();
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    data-path={dataPath}
                    className={`flex items-center gap-space-sm px-space-md py-2 rounded-xl text-xs sm:text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#006D77] to-[#20B8B0] text-white font-bold shadow-md shadow-[#006D77]/40 ring-1 ring-[#20B8B0]/40'
                        : 'text-white/75 hover:bg-white/10 hover:text-white font-medium'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-white' : 'text-[#20B8B0]'}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.name}</span>
                    {item.indicator && (
                      <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#E8B86D]' : 'bg-[#20B8B0]'}`}></span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tenant Information Footer */}
        <div className="px-space-sm">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-space-xs text-white">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#006D77]/40 border border-[#20B8B0]/30 flex items-center justify-center text-[#E8B86D] font-bold text-xs shrink-0">
                <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-white truncate font-semibold">
                  Acme Travel Corp
                </span>
                <span className="text-[10px] text-white/60 truncate">
                  Global Tier 1 • GDS Live
                </span>
              </div>
            </div>
            <button
              className="text-white/60 hover:text-white p-1 rounded transition-colors"
              type="button"
              title="Switch Organization"
            >
              <span className="material-symbols-outlined text-[18px]">unfold_more</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
