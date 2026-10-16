import React from 'react';
import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export const TravellerShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};
