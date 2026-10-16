import React from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader />

      <main className="flex-1 w-full site-container py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#e8f2f0] border border-[#d0dfd3] flex items-center justify-center text-[#0d6b63]">
          <span className="material-symbols-outlined text-[32px]">travel_explore</span>
        </div>

        <div className="space-y-2 max-w-md">
          <span className="text-xs font-bold uppercase tracking-wider text-[#889593]">
            404 Error · Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0d3d3a] tracking-tight">
            Destination not found
          </h1>
          <p className="text-sm text-[#5c6967] leading-relaxed">
            The page or itinerary you are looking for doesn't exist, has been moved, or the link is incorrect.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="bg-[#0d6b63] text-white px-5 py-2.5 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Return to Homepage
          </Link>

          <Link
            to="/bookings"
            className="border border-[#0d6b63] text-[#0d6b63] bg-white px-5 py-2.5 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors"
          >
            View My Bookings
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
