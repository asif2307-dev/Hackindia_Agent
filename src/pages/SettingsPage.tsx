import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

type AccountTab = 'profile' | 'travellers' | 'payment' | 'notifications' | 'security';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  // Form State
  const [fullName, setFullName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [dob, setDob] = useState('1990-03-14');
  const [nationality, setNationality] = useState('Indian');
  const [homeAirport, setHomeAirport] = useState('Indira Gandhi International Airport (DEL)');

  // Notification Toggles
  const [bookingNotifs, setBookingNotifs] = useState(true);
  const [refundNotifs, setRefundNotifs] = useState(true);
  const [dealNotifs, setDealNotifs] = useState(false);

  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="account" />

      {savedAlert && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center gap-2 text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <main className="flex-1 w-full site-container py-8 text-left">
        {/* Breadcrumb */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Account</span>
        </div>

        {/* Title Header */}
        <div className="pb-6 border-b border-[#e3ded4]">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0d3d3a] tracking-tight">
            Profile & settings
          </h1>
          <p className="text-sm text-[#5c6967] mt-1">
            Manage your personal details and preferences.
          </p>
        </div>

        {/* 2-Column Layout (Page 13) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-4 bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-5">
            {/* User Profile Card */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#f0ebe1]">
              <div className="w-12 h-12 rounded-full bg-[#0d6b63] text-white font-bold text-lg flex items-center justify-center shrink-0">
                A
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0d3d3a]">Aarav Sharma</h3>
                <p className="text-xs text-[#6b7775]">Member since 2025</p>
                <button
                  type="button"
                  className="text-[11px] text-[#0d6b63] font-semibold hover:underline mt-0.5"
                >
                  Change photo
                </button>
              </div>
            </div>

            {/* Navigation Tabs (Page 13) */}
            <nav className="space-y-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2.5 ${
                  activeTab === 'profile'
                    ? 'bg-[#0d6b63] text-white'
                    : 'text-[#42504e] hover:bg-[#fbf9f4]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                Profile
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('travellers')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2.5 ${
                  activeTab === 'travellers'
                    ? 'bg-[#0d6b63] text-white'
                    : 'text-[#42504e] hover:bg-[#fbf9f4]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">group</span>
                Traveller details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payment')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2.5 ${
                  activeTab === 'payment'
                    ? 'bg-[#0d6b63] text-white'
                    : 'text-[#42504e] hover:bg-[#fbf9f4]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">credit_card</span>
                Payment methods
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2.5 ${
                  activeTab === 'notifications'
                    ? 'bg-[#0d6b63] text-white'
                    : 'text-[#42504e] hover:bg-[#fbf9f4]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                Notifications
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2.5 ${
                  activeTab === 'security'
                    ? 'bg-[#0d6b63] text-white'
                    : 'text-[#42504e] hover:bg-[#fbf9f4]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Security
              </button>

              <div className="pt-3 border-t border-[#f0ebe1]">
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-md text-[#991b1b] hover:bg-[#fee2e2]/40 transition-colors flex items-center gap-2.5"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Log out
                </button>
              </div>
            </nav>
          </aside>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-8 space-y-8">
            {/* Personal Information Form */}
            <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-[#0d3d3a] pb-3 border-b border-[#f0ebe1]">
                Personal information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#0d3d3a] block">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-[#e3ded4] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0d6b63]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0d3d3a] block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#e3ded4] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0d6b63]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0d3d3a] block">Phone number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-[#e3ded4] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0d6b63]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0d3d3a] block">Date of birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full border border-[#e3ded4] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0d6b63]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0d3d3a] block">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full border border-[#e3ded4] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0d6b63]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0d3d3a] block">Home airport</label>
                  <input
                    type="text"
                    value={homeAirport}
                    onChange={(e) => setHomeAirport(e.target.value)}
                    className="w-full border border-[#e3ded4] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#0d6b63]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3 border-t border-[#f0ebe1]">
                <button
                  type="submit"
                  className="bg-[#0d6b63] text-white px-5 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  className="bg-white border border-[#e3ded4] text-[#42504e] px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#fbf9f4]"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Saved Travellers Section (Page 13) */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe1]">
                <div>
                  <h3 className="text-base font-bold text-[#0d3d3a]">
                    Saved travellers
                  </h3>
                  <p className="text-xs text-[#6b7775]">
                    Used to fill in flights, trains, buses, hotels and cabs faster.
                  </p>
                </div>

                <button
                  type="button"
                  className="text-xs font-semibold text-[#0d6b63] border border-[#0d6b63] px-3 py-1.5 rounded-md hover:bg-[#e8f2f0] transition-colors"
                >
                  + Add traveller
                </button>
              </div>

              <div className="space-y-3">
                {/* Aarav Sharma */}
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#e3ded4] bg-[#fbf9f4] text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0d6b63] text-white font-bold flex items-center justify-center text-xs">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0d3d3a]">Aarav Sharma</h4>
                      <p className="text-[11px] text-[#6b7775]">Primary traveller · Adult</p>
                    </div>
                  </div>
                  <button className="text-xs text-[#0d6b63] font-semibold hover:underline">
                    Edit
                  </button>
                </div>

                {/* Priya Sharma */}
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#e3ded4] bg-[#fbf9f4] text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#185e5b] text-white font-bold flex items-center justify-center text-xs">
                      P
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0d3d3a]">Priya Sharma</h4>
                      <p className="text-[11px] text-[#6b7775]">Adult · Passport on file</p>
                    </div>
                  </div>
                  <button className="text-xs text-[#0d6b63] font-semibold hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications Preferences (Page 13) */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#0d3d3a] pb-3 border-b border-[#f0ebe1]">
                Notifications
              </h3>

              <div className="space-y-4 text-xs">
                {/* 1. Booking confirmations */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-[#0d3d3a]">Booking confirmations</h4>
                    <p className="text-[#6b7775] mt-0.5">
                      Email and SMS when a flight, hotel, train, bus or cab is booked or changed.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingNotifs}
                    onChange={(e) => setBookingNotifs(e.target.checked)}
                    className="w-4 h-4 accent-[#0d6b63] cursor-pointer mt-0.5"
                  />
                </div>

                {/* 2. Refund updates */}
                <div className="flex items-start justify-between gap-4 pt-3 border-t border-[#f0ebe1]">
                  <div>
                    <h4 className="font-bold text-[#0d3d3a]">Refund updates</h4>
                    <p className="text-[#6b7775] mt-0.5">
                      Updates as your refund claim moves to each step.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={refundNotifs}
                    onChange={(e) => setRefundNotifs(e.target.checked)}
                    className="w-4 h-4 accent-[#0d6b63] cursor-pointer mt-0.5"
                  />
                </div>

                {/* 3. Offers and deals */}
                <div className="flex items-start justify-between gap-4 pt-3 border-t border-[#f0ebe1]">
                  <div>
                    <h4 className="font-bold text-[#0d3d3a]">Offers and deals</h4>
                    <p className="text-[#6b7775] mt-0.5">
                      Occasional travel offers. No spam.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dealNotifs}
                    onChange={(e) => setDealNotifs(e.target.checked)}
                    className="w-4 h-4 accent-[#0d6b63] cursor-pointer mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
