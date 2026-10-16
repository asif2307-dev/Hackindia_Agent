import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

type TopicCategory = 'Popular' | 'Refunds & claims' | 'Flights' | 'Hotels' | 'Trains' | 'Buses' | 'Cabs' | 'Payments';

export const HelpPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TopicCategory>('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default like Page 15

  const categories: TopicCategory[] = [
    'Popular',
    'Refunds & claims',
    'Flights',
    'Hotels',
    'Trains',
    'Buses',
    'Cabs',
    'Payments',
  ];

  const faqs = [
    {
      q: 'How does AI-powered refund assistance work?',
      a: 'If a booking is cancelled or disrupted, enter your booking details in the Refund center. Our AI checks your booking against the applicable policies, helps you understand your options and lets you track your claim. Refund eligibility and amounts depend on your booking, applicable policies and provider decisions.',
      category: 'Refunds & claims',
    },
    {
      q: 'Do I still pay for my booking as usual?',
      a: 'Yes. You pay for your bookings as usual through our secure checkout. If a flight, hotel, train, bus or cab encounters cancellation or disruption, our AI immediately assesses policy arbitration and helps you submit your claim without friction.',
      category: 'Payments',
    },
    {
      q: 'How do I cancel or change a flight, hotel, train, bus or cab booking?',
      a: 'Navigate to My Bookings, find your itinerary and click "Manage booking". You can initiate cancellation or date modifications in accordance with the operator\'s cancellation timeline.',
      category: 'Flights',
    },
    {
      q: 'What documents might I need for a refund claim?',
      a: 'Generally, your booking PNR and email are sufficient. If the airline cancelled or delayed the trip, our engine fetches GDS logs automatically. For medical emergencies or special waivers, hospital certificates or operator cancellation emails can be uploaded.',
      category: 'Refunds & claims',
    },
    {
      q: 'How can I track my claim?',
      a: 'Visit the Refund Center and enter your Case ID (e.g., #RF12345) in the Track Refund tab. You will see a live 4-step progress timeline: Submitted → AI review → Decision → Completed.',
      category: 'Refunds & claims',
    },
    {
      q: 'How do I contact customer support?',
      a: 'Our priority assistance team is available 24/7. You can reach us at 1800-419-7466, email priority-support@agenttravel.com, or launch the AI Chat Assistant anytime.',
      category: 'Popular',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === 'Popular' || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="help" />

      <main className="flex-1 w-full site-container py-8 text-left space-y-6">
        {/* Breadcrumb */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Help</span>
        </div>

        {/* Title Header */}
        <div className="pb-6 border-b border-[#e3ded4] space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0d3d3a] tracking-tight">
            How can we help?
          </h1>
          <p className="text-sm sm:text-base text-[#5c6967]">
            Find answers about bookings and refund claims, or get in touch with our team.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <span className="material-symbols-outlined text-[18px] text-[#889593] absolute left-3.5 top-3">
                search
              </span>
              <input
                type="text"
                placeholder="Search help topics, booking rules or refund guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#e3ded4] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#0d3d3a] placeholder-[#889593] focus:outline-none focus:border-[#0d6b63] shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Topic Filter Pills (Page 15) */}
        <div className="py-2 border-b border-[#e3ded4] flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#0d6b63] text-white shadow-sm'
                  : 'bg-white border border-[#e3ded4] text-[#42504e] hover:bg-[#eae4d8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion Section (Page 15) */}
        <div className="py-4 space-y-3">
          <h2 className="text-lg font-bold text-[#0d3d3a] pb-2">
            Popular questions
          </h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#e3ded4] shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0d3d3a] hover:bg-[#fbf9f4] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-mono text-[#0d6b63]">
                    {openFaq === idx ? '–' : '+'}
                  </span>
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5c6967] leading-relaxed border-t border-[#f0ebe1] bg-[#fdfbf7]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI-POWERED REFUND CALLOUT BOX (Page 15) */}
        <div className="my-8 bg-[#f0ebe1] rounded-2xl border border-[#e3ded4] p-6 sm:p-8 space-y-3">
          <span className="text-[11px] font-bold text-[#0d6b63] uppercase tracking-wider block">
            AI-POWERED REFUND ASSISTANCE
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0d3d3a]">
            Booking cancelled or disrupted?
          </h3>
          <p className="text-xs sm:text-sm text-[#5c6967] max-w-xl leading-relaxed">
            Our AI helps you check refund eligibility, understand applicable policies and track your claim.
          </p>
          <div className="pt-2">
            <Link
              to="/refunds"
              className="inline-flex items-center gap-1.5 bg-[#0d6b63] text-white px-5 py-2.5 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm"
            >
              Check Refund Eligibility →
            </Link>
          </div>
          <p className="text-[11px] text-[#889593]">
            Refund eligibility and amounts depend on your booking, applicable policies and provider decisions.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
