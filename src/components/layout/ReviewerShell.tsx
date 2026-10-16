import React from 'react';
import { Outlet } from 'react-router-dom';
import { ReviewerHeader } from './ReviewerHeader';

export const ReviewerShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <ReviewerHeader />
      <main className="flex-1 w-full site-container py-6">
        <Outlet />
      </main>
    </div>
  );
};
