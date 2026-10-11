import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SearchModal } from './SearchModal';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans text-gray-900 flex flex-col selection:bg-[#006D77] selection:text-white">
      <div className="flex flex-1 relative min-h-screen">
        {/* Sleek Oceanic Audit Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content Column */}
        <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 bg-[#fcfcfd]">
            <Outlet />
          </main>
        </div>
      </div>

      <SearchModal />
    </div>
  );
};
