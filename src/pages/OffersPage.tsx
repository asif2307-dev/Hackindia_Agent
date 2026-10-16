import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

type OfferCategory = 'All offers' | 'Flights' | 'Hotels' | 'Holidays' | 'Trains & Bus' | 'Bank offers';

interface OfferItem {
  id: string;
  category: OfferCategory;
  serviceTag: string;
  title: string;
  validTill: string;
  code: string;
  description: string;
}

export const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<OfferCategory>('All offers');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const categories: OfferCategory[] = [
    'All offers',
    'Flights',
    'Hotels',
    'Holidays',
    'Trains & Bus',
    'Bank offers',
  ];

  const offers: OfferItem[] = [
    {
      id: '1',
      category: 'Flights',
      serviceTag: 'FLIGHTS',
      title: 'Up to 20% off domestic flights',
      validTill: 'Valid till 31 Oct 2026',
      code: 'FLYINTRA',
      description: 'Applicable on all major domestic carriers including Air India, IndiGo and Vistara.',
    },
    {
      id: '2',
      category: 'Hotels',
      serviceTag: 'HOTELS',
      title: 'Flat 30% off hotel bookings',
      validTill: 'Valid till 15 Nov 2026',
      code: 'STAYMORE',
      description: 'Valid across handpicked partner luxury resorts, boutique villas and city hotels.',
    },
    {
      id: '3',
      category: 'Holidays',
      serviceTag: 'HOLIDAYS',
      title: '₹5,000 off holiday packages',
      validTill: 'Valid till 30 Nov 2026',
      code: 'HOLIDAY5K',
      description: 'On minimum booking value of ₹35,000 for Kashmir, Goa, Kerala and Himachal packages.',
    },
    {
      id: '4',
      category: 'Trains & Bus',
      serviceTag: 'TRAINS',
      title: 'Zero convenience fee on train tickets',
      validTill: 'Valid till 30 Nov 2026',
      code: 'RAILFREE',
      description: 'Enjoy 100% waiver of portal charges on Vande Bharat, Shatabdi and express trains.',
    },
    {
      id: '5',
      category: 'Trains & Bus',
      serviceTag: 'BUS',
      title: '₹ 250 cashback on intercity buses',
      validTill: 'Valid till 31 Oct 2026',
      code: 'BUS250',
      description: 'Get instant wallet cashback on luxury sleeper and multi-axle Volvo rides.',
    },
    {
      id: '6',
      category: 'Bank offers',
      serviceTag: 'BANK OFFERS',
      title: '10% instant discount with partner cards',
      validTill: 'Valid till 31 Dec 2026',
      code: 'CARD10',
      description: 'Use eligible HDFC, ICICI, SBI or Axis Bank credit cards during checkout.',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribeSuccess(true);
      setTimeout(() => setSubscribeSuccess(false), 4000);
      setSubscribedEmail('');
    }
  };

  const filtered = offers.filter(
    (o) => activeCategory === 'All offers' || o.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="offers" />

      {/* Copy Toast */}
      {copiedCode && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center gap-2 text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">content_copy</span>
          <span>Promo code <strong>{copiedCode}</strong> copied to clipboard!</span>
        </div>
      )}

      <main className="flex-1 w-full site-container py-8 text-left">
        {/* Breadcrumb */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Offers</span>
        </div>

        {/* Title Header */}
        <div className="pb-6 border-b border-[#e3ded4]">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0d3d3a] tracking-tight">
            Travel deals & offers
          </h1>
          <p className="text-sm sm:text-base text-[#5c6967] mt-1 max-w-2xl">
            Handpicked offers on flights, hotels, trains and holiday packages. Copy a code
            and apply it at checkout.
          </p>
        </div>

        {/* Category Filter Pills (Page 6) */}
        <div className="py-4 border-b border-[#e3ded4] flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#0d6b63] text-white'
                  : 'bg-white border border-[#e3ded4] text-[#42504e] hover:bg-[#eae4d8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FESTIVE SEASON BANNER (Page 6) */}
        <div className="my-8 rounded-2xl overflow-hidden border border-[#e3ded4] bg-[#0d3d3a] text-white shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d0dfd3] bg-white/10 px-2.5 py-1 rounded inline-block">
              Festive Season
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Festive travel offers on flights, hotels and holidays
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Celebrate this festive season with exclusive discounts across domestic flights,
              heritage hotel stays and curated holiday getaways.
            </p>
          </div>

          <button
            onClick={() => navigate('/flights')}
            className="shrink-0 bg-white text-[#0d3d3a] font-bold text-xs px-5 py-2.5 rounded-md hover:bg-[#f7f4ed] transition-colors shadow-sm"
          >
            Explore festive deals →
          </button>
        </div>

        {/* Offers Grid (Page 6) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d6b63] block">
                  {offer.serviceTag}
                </span>
                <h3 className="text-base font-bold text-[#0d3d3a]">
                  {offer.title}
                </h3>
                <p className="text-xs text-[#6b7775]">{offer.validTill}</p>
                <p className="text-xs text-[#5c6967] pt-1">{offer.description}</p>
              </div>

              <div className="pt-3 border-t border-[#f0ebe1] flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-[#f3eee5] text-[#0d3d3a] border border-[#e3ded4]">
                  {offer.code}
                </span>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className="border border-[#0d6b63] text-[#0d6b63] text-xs font-semibold px-3 py-1 rounded hover:bg-[#e8f2f0] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  {copiedCode === offer.code ? 'Copied!' : 'Copy code'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Refund Assistance Banner on Offers Page (Page 6) */}
        <div className="my-10 bg-[#f0ebe1] rounded-xl border border-[#e3ded4] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0d3d3a]">
              Booked with an offer?
            </h4>
            <p className="text-xs text-[#5c6967]">
              If your booking is cancelled or disrupted, our AI helps you check refund
              eligibility, understand applicable policies and track your claim.
            </p>
          </div>
          <Link
            to="/refunds"
            className="shrink-0 bg-[#0d6b63] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors"
          >
            Check Refund Eligibility →
          </Link>
        </div>

        {/* Newsletter Subscription (Page 7) */}
        <div className="my-8 bg-white rounded-xl border border-[#e3ded4] p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-sm space-y-3">
          <h3 className="text-xl font-bold text-[#0d3d3a]">
            Get the latest travel deals
          </h3>
          <p className="text-xs text-[#6b7775]">
            Subscribe for new offers and travel inspiration. No spam.
          </p>

          {subscribeSuccess ? (
            <div className="p-3 bg-[#e8f2f0] text-[#0d6b63] text-xs font-semibold rounded-md">
              ✓ Thank you for subscribing! We'll send you curated seasonal travel deals.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={subscribedEmail}
                onChange={(e) => setSubscribedEmail(e.target.value)}
                className="flex-1 border border-[#e3ded4] rounded-md px-3.5 py-2 text-xs focus:outline-none focus:border-[#0d6b63]"
              />
              <button
                type="submit"
                className="bg-[#0d6b63] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#0a534d] transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
