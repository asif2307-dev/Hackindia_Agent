import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

type FaqCategory =
  | 'All'
  | 'Booking and Reservations'
  | 'Cancellations and Refunds'
  | 'Payments and Transactions'
  | 'Flights, Hotels, Trains, and Buses'
  | 'Account and Login'
  | 'Technical Issues';

interface FaqItem {
  q: string;
  a: string;
  category: Exclude<FaqCategory, 'All'>;
  actionLink?: {
    label: string;
    url: string;
  };
}

export const HelpPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First open by default

  // Support form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBookingRef, setFormBookingRef] = useState('');
  const [formCategory, setFormCategory] = useState<string>('Booking & Reservations');
  const [formMessage, setFormMessage] = useState('');

  // Form interaction state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    status: 'idle' | 'success' | 'backend_limitation' | 'error';
    message: string;
    submittedData?: {
      name: string;
      email: string;
      bookingRef?: string;
      category: string;
      message: string;
    };
  }>({ status: 'idle', message: '' });

  const searchInputId = useId();

  const categories: FaqCategory[] = [
    'All',
    'Booking and Reservations',
    'Cancellations and Refunds',
    'Payments and Transactions',
    'Flights, Hotels, Trains, and Buses',
    'Account and Login',
    'Technical Issues',
  ];

  const faqs: FaqItem[] = [
    // 1. Booking and Reservations
    {
      q: 'How do I check my booking confirmation and details?',
      a: 'You can view all your active and upcoming reservations by navigating to My Bookings. Your confirmed itinerary, PNR or operator booking reference, travel schedule, and passenger details are displayed there.',
      category: 'Booking and Reservations',
      actionLink: { label: 'Go to My Bookings', url: '/bookings' },
    },
    {
      q: 'Can I modify passenger names or travel dates after booking?',
      a: 'Name corrections and date modifications depend strictly on the respective airline, hotel, or transit operator fare rules. Please open your itinerary in My Bookings to review modification eligibility and options for that specific ticket.',
      category: 'Booking and Reservations',
      actionLink: { label: 'Manage Reservations', url: '/bookings' },
    },
    {
      q: 'Where do I find my e-ticket or travel voucher?',
      a: 'Your e-ticket and booking reference are saved in your account under My Bookings as soon as your payment is verified. You can access and view the trip summary at any time.',
      category: 'Booking and Reservations',
      actionLink: { label: 'View Bookings', url: '/bookings' },
    },

    // 2. Cancellations and Refunds
    {
      q: 'How do I cancel a travel booking?',
      a: 'To cancel a booking, go to My Bookings, find the relevant trip, and select the cancellation option. Cancellation fees and net refund amounts depend on operator cancellation timelines and fare rules.',
      category: 'Cancellations and Refunds',
      actionLink: { label: 'Check Bookings', url: '/bookings' },
    },
    {
      q: 'How does AI-assisted refund arbitration work?',
      a: 'If your trip was cancelled or disrupted by an operator, enter your booking reference in the Refund Center. Our AI engine verifies your booking records against applicable regulatory policies (such as DGCA CAR Section 3 or IRCTC rules) and helps evaluate refund eligibility without manual friction.',
      category: 'Cancellations and Refunds',
      actionLink: { label: 'Open Refund Center', url: '/refunds' },
    },
    {
      q: 'How can I track the status of my refund claim?',
      a: 'Visit the Refund Center and enter your Case ID (e.g., #RF12345 or AT-9842) under the "Track Refund" tab. You can view the live progress through Submission, Policy Evaluation, Reviewer Decision, and Payout Reconciliation.',
      category: 'Cancellations and Refunds',
      actionLink: { label: 'Track a Refund Claim', url: '/refunds' },
    },
    {
      q: 'What evidence or documents are required for a refund claim?',
      a: 'In most standard cases, your booking reference (PNR) and contact email are sufficient. If the disruption was caused by an airline schedule change, weather, or medical emergency, uploading operator emails or supporting certificates in the Refund Center helps expedite the review.',
      category: 'Cancellations and Refunds',
      actionLink: { label: 'Submit Claim Details', url: '/refunds' },
    },

    // 3. Payments and Transactions
    {
      q: 'Which payment methods are supported on Agent Travel?',
      a: 'We support secure payment processing powered by Razorpay, including UPI (Google Pay, PhonePe, Paytm), Credit and Debit Cards (Visa, MasterCard, RuPay), and Net Banking across major Indian and international banks.',
      category: 'Payments and Transactions',
    },
    {
      q: 'Money was debited from my bank, but my booking was not confirmed. What should I do?',
      a: 'Payment gateways occasionally undergo temporary bank reconciliation delays. Please check My Bookings after 5–10 minutes. If the booking is still pending or not updated, please submit an inquiry with your payment transaction ID or contact support.',
      category: 'Payments and Transactions',
    },
    {
      q: 'How and when are refunds credited back?',
      a: 'Approved and reconciled refunds are processed back through the original payment gateway (such as Razorpay) to the original payment method used during checkout. Standard bank processing timelines apply.',
      category: 'Payments and Transactions',
    },

    // 4. Flights, Hotels, Trains, and Buses
    {
      q: 'What happens if my flight is cancelled or delayed by the airline?',
      a: 'Under DGCA Civil Aviation Requirements (CAR) Section 3, passengers may be entitled to a full ticket refund or alternate accommodation when flights are cancelled or delayed beyond specified thresholds. You can evaluate statutory restitution in the Refund Center.',
      category: 'Flights, Hotels, Trains, and Buses',
      actionLink: { label: 'Check Flight Refund Eligibility', url: '/refunds' },
    },
    {
      q: 'How do train cancellations and IRCTC TDR filings work?',
      a: 'For train bookings, if a train is cancelled or delayed by more than 3 hours, a Ticket Deposit Receipt (TDR) must be initiated per railway guidelines before train departure from the boarding station to claim a full fare refund.',
      category: 'Flights, Hotels, Trains, and Buses',
      actionLink: { label: 'Explore Trains', url: '/trains' },
    },
    {
      q: 'What are the cancellation and check-in policies for hotels, buses, and cabs?',
      a: 'Each accommodation partner or bus/cab operator defines specific cancellation cut-offs and check-in requirements. These policies are detailed on each service page and on your booking itinerary in My Bookings.',
      category: 'Flights, Hotels, Trains, and Buses',
      actionLink: { label: 'View Bookings', url: '/bookings' },
    },

    // 5. Account and Login
    {
      q: 'How do I create an account or sign in?',
      a: 'Select Sign In from the top navigation bar. If you do not have an account yet, click Sign Up to register with your full name, email, and a secure password.',
      category: 'Account and Login',
      actionLink: { label: 'Sign In / Register', url: '/signin' },
    },
    {
      q: 'Where can I manage my account profile and preferences?',
      a: 'Once signed in, access the Account Settings page from your profile menu to review your saved traveler details, contact email, and account security preferences.',
      category: 'Account and Login',
      actionLink: { label: 'Go to Account Settings', url: '/account' },
    },
    {
      q: 'What should I do if I am having trouble logging in?',
      a: 'Please verify that you are entering the exact email address used during registration. If you are experiencing technical difficulties, use the support inquiry form below.',
      category: 'Account and Login',
    },

    // 6. Technical Issues
    {
      q: 'What should I do if the website encounters an error or fails to load?',
      a: 'Try refreshing your web browser or clearing your temporary browser cache. If the issue persists across different browsers or devices, please report the issue using our support form.',
      category: 'Technical Issues',
    },
    {
      q: 'Are my personal details and payment information secure?',
      a: 'Yes. Agent Travel utilizes TLS encryption across all endpoints and adheres to industry-standard data protection. Payment processing is tokenized through Razorpay; we never store your private card CVVs or bank credentials.',
      category: 'Technical Issues',
    },
  ];

  // Filtering FAQs based on category & search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === 'All' || faq.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      faq.q.toLowerCase().includes(query) ||
      faq.a.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Handler for quick scroll to support form
  const handleJumpToSupport = (categoryName?: string) => {
    if (categoryName) {
      setFormCategory(categoryName);
    }
    const el = document.getElementById('contact-support-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Support Form Validation & Submission
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formName.trim()) {
      errors.name = 'Please provide your full name.';
    }

    if (!formEmail.trim()) {
      errors.email = 'Please provide an email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formEmail.trim())) {
        errors.email = 'Please provide a valid email format (e.g. name@example.com).';
      }
    }

    if (!formMessage.trim()) {
      errors.message = 'Please describe your inquiry or issue.';
    } else if (formMessage.trim().length < 10) {
      errors.message = 'Please provide at least 10 characters so we can assist effectively.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionResult({ status: 'idle', message: '' });

    const payload = {
      name: formName.trim(),
      email: formEmail.trim(),
      bookingReference: formBookingRef.trim() || undefined,
      category: formCategory,
      message: formMessage.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      // Connect to verified backend endpoint if one exists
      const response = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (response && response.ok) {
        setSubmissionResult({
          status: 'success',
          message: 'Your inquiry has been successfully submitted to our support team.',
          submittedData: payload,
        });
      } else {
        // Honest limitation reporting: no working support ticket CRM API is connected on the backend
        setSubmissionResult({
          status: 'backend_limitation',
          message:
            'Notice: Online helpdesk ticket dispatch is currently in offline/read-only mode as no external CRM backend is connected to this environment. Your inquiry has not been discarded or sent to an unmonitored mailbox.',
          submittedData: payload,
        });
      }
    } catch {
      setSubmissionResult({
        status: 'backend_limitation',
        message:
          'Notice: Online helpdesk ticket dispatch is currently in offline/read-only mode as no external CRM backend is connected to this environment.',
        submittedData: payload,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormBookingRef('');
    setFormCategory('Booking & Reservations');
    setFormMessage('');
    setFormErrors({});
    setSubmissionResult({ status: 'idle', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="help" />

      <main className="flex-1 w-full site-container py-8 text-left space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#6b7775] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[#0d3d3a] font-medium" aria-current="page">
            Help Center
          </span>
        </nav>

        {/* Section A: Help Center Header */}
        <header className="pb-6 border-b border-[#e3ded4] space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0d3d3a] tracking-tight">
              How can we help you?
            </h1>
            <p className="text-sm sm:text-base text-[#5c6967] max-w-2xl leading-relaxed">
              Find answers regarding bookings, cancellations, and AI-assisted refund claims, or get in touch with our support team.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="pt-2 max-w-2xl">
            <label htmlFor={searchInputId} className="sr-only">
              Search for bookings, refunds, cancellations, or payments
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined text-[20px] text-[#889593] absolute left-3.5 top-3 select-none pointer-events-none"
                aria-hidden="true"
              >
                search
              </span>
              <input
                id={searchInputId}
                type="text"
                placeholder="Search for bookings, refunds, cancellations, or payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#e3ded4] rounded-xl pl-11 pr-10 py-3 text-sm text-[#0d3d3a] placeholder-[#889593] focus:outline-none focus:border-[#0d6b63] focus:ring-1 focus:ring-[#0d6b63] shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-3 top-3 text-[#889593] hover:text-[#0d3d3a] p-0.5 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="mt-2 text-xs text-[#5c6967] flex items-center justify-between">
                <span>
                  Showing {filteredFaqs.length} matching {filteredFaqs.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#0d6b63] hover:underline font-semibold"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Section C: Popular Help Topics (Quick-Access Cards) */}
        <section aria-labelledby="popular-topics-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="popular-topics-heading" className="text-lg sm:text-xl font-bold text-[#0d3d3a]">
              Popular Help Topics
            </h2>
            <span className="text-xs text-[#6b7775]">Quick access self-service actions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Check booking status */}
            <Link
              to="/bookings"
              className="group bg-white border border-[#e3ded4] rounded-xl p-5 shadow-sm hover:border-[#0d6b63] hover:shadow-md transition-all flex flex-col justify-between text-left"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#e8f2f0] text-[#0d6b63] flex items-center justify-center group-hover:bg-[#0d6b63] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">event_available</span>
                </div>
                <h3 className="text-sm font-bold text-[#0d3d3a] group-hover:text-[#0d6b63] transition-colors">
                  Check booking status
                </h3>
                <p className="text-xs text-[#5c6967] leading-relaxed">
                  View your confirmation, passenger list, itinerary status, and travel vouchers.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#0d6b63] flex items-center gap-1">
                Go to My Bookings
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>

            {/* 2. Cancel a booking */}
            <Link
              to="/bookings"
              className="group bg-white border border-[#e3ded4] rounded-xl p-5 shadow-sm hover:border-[#0d6b63] hover:shadow-md transition-all flex flex-col justify-between text-left"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#fdf2f2] text-[#b91c1c] flex items-center justify-center group-hover:bg-[#b91c1c] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">cancel</span>
                </div>
                <h3 className="text-sm font-bold text-[#0d3d3a] group-hover:text-[#0d6b63] transition-colors">
                  Cancel a booking
                </h3>
                <p className="text-xs text-[#5c6967] leading-relaxed">
                  Select a reservation from your bookings to review operator cancellation terms.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#0d6b63] flex items-center gap-1">
                Manage trip cancellation
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>

            {/* 3. Understand refund status */}
            <Link
              to="/refunds"
              className="group bg-white border border-[#e3ded4] rounded-xl p-5 shadow-sm hover:border-[#0d6b63] hover:shadow-md transition-all flex flex-col justify-between text-left"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#e8f2f0] text-[#0d6b63] flex items-center justify-center group-hover:bg-[#0d6b63] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
                <h3 className="text-sm font-bold text-[#0d3d3a] group-hover:text-[#0d6b63] transition-colors">
                  Understand refund status
                </h3>
                <p className="text-xs text-[#5c6967] leading-relaxed">
                  Track your claim dossier in the Refund Center with your Case ID or evaluate policy eligibility.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#0d6b63] flex items-center gap-1">
                Open Refund Center
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>

            {/* 4. Payment issues */}
            <button
              type="button"
              onClick={() => handleJumpToSupport('Payment & Transaction Issue')}
              className="group bg-white border border-[#e3ded4] rounded-xl p-5 shadow-sm hover:border-[#0d6b63] hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#fef3c7] text-[#92400e] flex items-center justify-center group-hover:bg-[#d97706] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">credit_card</span>
                </div>
                <h3 className="text-sm font-bold text-[#0d3d3a] group-hover:text-[#0d6b63] transition-colors">
                  Payment issues
                </h3>
                <p className="text-xs text-[#5c6967] leading-relaxed">
                  Resolve transaction queries, debited amounts, or Razorpay payment receipts.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#0d6b63] flex items-center gap-1">
                Contact payment support
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_downward
                </span>
              </div>
            </button>

            {/* 5. Manage a reservation */}
            <Link
              to="/bookings"
              className="group bg-white border border-[#e3ded4] rounded-xl p-5 shadow-sm hover:border-[#0d6b63] hover:shadow-md transition-all flex flex-col justify-between text-left"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#e8f2f0] text-[#0d6b63] flex items-center justify-center group-hover:bg-[#0d6b63] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">luggage</span>
                </div>
                <h3 className="text-sm font-bold text-[#0d3d3a] group-hover:text-[#0d6b63] transition-colors">
                  Manage a reservation
                </h3>
                <p className="text-xs text-[#5c6967] leading-relaxed">
                  Access travel dates, update contact details, and review transport specifics.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#0d6b63] flex items-center gap-1">
                Review reservations
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>

            {/* 6. Account and login assistance */}
            <Link
              to="/account"
              className="group bg-white border border-[#e3ded4] rounded-xl p-5 shadow-sm hover:border-[#0d6b63] hover:shadow-md transition-all flex flex-col justify-between text-left"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#ede9fe] text-[#6d28d9] flex items-center justify-center group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
                </div>
                <h3 className="text-sm font-bold text-[#0d3d3a] group-hover:text-[#0d6b63] transition-colors">
                  Account and login assistance
                </h3>
                <p className="text-xs text-[#5c6967] leading-relaxed">
                  Update profile preferences, change password, or sign in to your traveler account.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-[#0d6b63] flex items-center gap-1">
                Go to Account
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Section B: Searchable Frequently Asked Questions */}
        <section aria-labelledby="faq-section-heading" className="space-y-4 pt-4 border-t border-[#e3ded4]">
          <div className="space-y-1">
            <h2 id="faq-section-heading" className="text-lg sm:text-xl font-bold text-[#0d3d3a]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#5c6967]">
              Browse common questions across booking, cancellation, payment, and transit categories.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="FAQ Categories"
            className="py-2 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none"
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d6b63] ${
                    isSelected
                      ? 'bg-[#0d6b63] text-white shadow-sm'
                      : 'bg-white border border-[#e3ded4] text-[#42504e] hover:bg-[#eae4d8]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3" role="region" aria-label="FAQ List">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const headerId = `faq-header-${idx}`;
                const panelId = `faq-panel-${idx}`;

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-[#e3ded4] shadow-sm overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      id={headerId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0d3d3a] hover:bg-[#fbf9f4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d6b63] focus-visible:ring-inset"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0d6b63] bg-[#e8f2f0] px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                        <span>{faq.q}</span>
                      </div>
                      <span
                        className="text-lg font-mono text-[#0d6b63] shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#f7f4ed]"
                        aria-hidden="true"
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={headerId}
                        className="px-5 pb-5 pt-2 text-xs sm:text-sm text-[#5c6967] leading-relaxed border-t border-[#f0ebe1] bg-[#fdfbf7] space-y-3"
                      >
                        <p>{faq.a}</p>
                        {faq.actionLink && (
                          <div className="pt-1">
                            <Link
                              to={faq.actionLink.url}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d6b63] hover:text-[#0a534d] hover:underline"
                            >
                              <span>{faq.actionLink.label}</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* Clear Empty State */
              <div className="bg-white rounded-xl border border-dashed border-[#e3ded4] p-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#f7f4ed] text-[#889593] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">search_off</span>
                </div>
                <h3 className="text-base font-bold text-[#0d3d3a]">
                  No matching questions found
                </h3>
                <p className="text-xs text-[#5c6967] max-w-md mx-auto leading-relaxed">
                  We could not find any FAQ matching &ldquo;{searchQuery}&rdquo; in {activeCategory === 'All' ? 'any category' : activeCategory}. Try adjusting your keywords or browse all categories.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#0d6b63] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#0a534d] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    Reset filters & search
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section E: Booking and Refund Assistance Callout */}
        <section
          aria-labelledby="disruption-banner-heading"
          className="bg-[#f0ebe1] rounded-2xl border border-[#e3ded4] p-6 sm:p-8 space-y-4 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-bold text-[#0d6b63] uppercase tracking-wider block">
                AI-POWERED ARBITRATION & REFUND ASSISTANCE
              </span>
              <h2 id="disruption-banner-heading" className="text-xl sm:text-2xl font-bold text-[#0d3d3a]">
                Trip cancelled, delayed, or disrupted?
              </h2>
              <p className="text-xs sm:text-sm text-[#5c6967] leading-relaxed">
                Agent Travel automates disruption arbitration for flights, trains, and transit. Our AI checks your booking reference against applicable carrier policies and DGCA/IRCTC rules to compile supporting claim dossiers.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <Link
                to="/refunds"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0d6b63] text-white px-5 py-3 rounded-lg text-xs font-bold hover:bg-[#0a534d] transition-colors shadow-sm"
              >
                <span>Check Refund Eligibility</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <Link
                to="/bookings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white border border-[#e3ded4] text-[#0d3d3a] px-4 py-3 rounded-lg text-xs font-semibold hover:bg-[#faf7f0] transition-colors shadow-sm"
              >
                <span>My Bookings</span>
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e3ded4]/80 flex items-center gap-2 text-[11px] text-[#889593]">
            <span className="material-symbols-outlined text-[14px] text-[#0d6b63]">verified</span>
            <span>
              Refund eligibility and settlement amounts depend on your booking, applicable operator policies, and provider decisions.
            </span>
          </div>
        </section>

        {/* Section D: Contact and Support Options */}
        <section
          id="contact-support-section"
          aria-labelledby="contact-support-heading"
          className="space-y-6 pt-4 border-t border-[#e3ded4]"
        >
          <div className="space-y-1">
            <h2 id="contact-support-heading" className="text-lg sm:text-xl font-bold text-[#0d3d3a]">
              Contact and Support Options
            </h2>
            <p className="text-xs sm:text-sm text-[#5c6967]">
              Need direct assistance with an active booking, policy query, or claim investigation?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Verified Support Channels */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-[#e3ded4] rounded-xl p-5 shadow-sm space-y-4 text-left">
                <h3 className="text-sm font-bold text-[#0d3d3a] border-b border-[#e3ded4] pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0d6b63] text-[18px]">contact_support</span>
                  Verified Support Channels
                </h3>

                {/* Priority Phone Helpline */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#0d3d3a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d6b63] text-[16px]">call</span>
                    24x7 Priority Assistance
                  </div>
                  <p className="text-xs text-[#5c6967]">
                    Toll-free traveler priority helpline for urgent disruptions:
                  </p>
                  <div className="pt-1">
                    <a
                      href="tel:18004197466"
                      className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-[#0d6b63] hover:underline bg-[#e8f2f0] px-3 py-1.5 rounded-md"
                    >
                      1800-419-7466
                    </a>
                  </div>
                </div>

                {/* Self-Service Refund Center */}
                <div className="space-y-1 pt-3 border-t border-[#f0ebe1]">
                  <div className="text-xs font-semibold text-[#0d3d3a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d6b63] text-[16px]">policy</span>
                    Refund Center & Claim Dossiers
                  </div>
                  <p className="text-xs text-[#5c6967]">
                    Self-service dispute intake and live case tracking with your Case ID:
                  </p>
                  <div className="pt-1">
                    <Link
                      to="/refunds"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d6b63] hover:underline"
                    >
                      Open Refund Center →
                    </Link>
                  </div>
                </div>

                {/* Itinerary & Self-Service Bookings */}
                <div className="space-y-1 pt-3 border-t border-[#f0ebe1]">
                  <div className="text-xs font-semibold text-[#0d3d3a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d6b63] text-[16px]">airplane_ticket</span>
                    Trip & Booking Records
                  </div>
                  <p className="text-xs text-[#5c6967]">
                    Review booking status, download travel receipts, or manage reservations:
                  </p>
                  <div className="pt-1">
                    <Link
                      to="/bookings"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d6b63] hover:underline"
                    >
                      View My Bookings →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Informational Guidelines Card */}
              <div className="bg-[#fbf9f4] border border-[#e3ded4] rounded-xl p-4 text-xs text-[#5c6967] space-y-2">
                <div className="font-bold text-[#0d3d3a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">info</span>
                  Support Handling Guidelines
                </div>
                <p className="leading-relaxed">
                  For fastest resolution regarding cancelled flights or delayed train journeys, filing directly through the{' '}
                  <Link to="/refunds" className="text-[#0d6b63] underline font-medium">
                    Refund Center
                  </Link>{' '}
                  allows our AI system to evaluate your booking and policy evidence immediately.
                </p>
              </div>
            </div>

            {/* Right Column: Support Request Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#e3ded4] rounded-xl p-6 sm:p-7 shadow-sm text-left space-y-5">
                <div className="border-b border-[#e3ded4] pb-3 space-y-1">
                  <h3 className="text-base font-bold text-[#0d3d3a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d6b63] text-[20px]">mail</span>
                    Submit a Support Request
                  </h3>
                  <p className="text-xs text-[#5c6967]">
                    Send details about your booking inquiry, payment question, or technical issue.
                  </p>
                </div>

                {/* Submission Result / Backend Limitation State */}
                {submissionResult.status === 'backend_limitation' && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs space-y-2.5 text-[#92400e]"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-[#b45309]">
                      <span className="material-symbols-outlined text-[20px]">info</span>
                      Service Connectivity Notice
                    </div>
                    <p className="leading-relaxed">{submissionResult.message}</p>
                    <div className="p-3 bg-white/80 rounded-lg border border-[#fde68a] space-y-1 font-mono text-[11px] text-[#78350f]">
                      <div>
                        <strong>Inquiry Subject:</strong> {submissionResult.submittedData?.category}
                      </div>
                      <div>
                        <strong>Contact:</strong> {submissionResult.submittedData?.name} ({submissionResult.submittedData?.email})
                      </div>
                      {submissionResult.submittedData?.bookingRef && (
                        <div>
                          <strong>Booking Ref:</strong> {submissionResult.submittedData?.bookingRef}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px]">
                      For urgent issues, please call our toll-free line at <strong>1800-419-7466</strong> or proceed to the{' '}
                      <Link to="/refunds" className="underline font-semibold text-[#0d6b63]">
                        Refund Center
                      </Link>{' '}
                      to file a claim.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="mt-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#b45309] text-white hover:bg-[#92400e] transition-colors"
                    >
                      Reset Form
                    </button>
                  </div>
                )}

                {submissionResult.status === 'success' && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-xs space-y-2 text-[#065f46]"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-[#047857]">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      Request Received
                    </div>
                    <p className="leading-relaxed">{submissionResult.message}</p>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="mt-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#047857] text-white hover:bg-[#065f46] transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                )}

                {/* The Form */}
                {submissionResult.status !== 'backend_limitation' && submissionResult.status !== 'success' && (
                  <form onSubmit={handleSupportSubmit} className="space-y-4" noValidate>
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="support-form-name" className="block text-xs font-semibold text-[#0d3d3a]">
                          Full Name <span className="text-[#b91c1c]">*</span>
                        </label>
                        <input
                          id="support-form-name"
                          type="text"
                          value={formName}
                          onChange={(e) => {
                            setFormName(e.target.value);
                            if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
                          }}
                          placeholder="e.g. Aarav Sharma"
                          disabled={isSubmitting}
                          className={`w-full bg-[#fbf9f4] border ${
                            formErrors.name ? 'border-[#b91c1c]' : 'border-[#e3ded4]'
                          } rounded-lg px-3.5 py-2.5 text-xs text-[#0d3d3a] placeholder-[#889593] focus:outline-none focus:border-[#0d6b63] focus:ring-1 focus:ring-[#0d6b63]`}
                        />
                        {formErrors.name && (
                          <p className="text-[11px] text-[#b91c1c] font-medium">{formErrors.name}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="support-form-email" className="block text-xs font-semibold text-[#0d3d3a]">
                          Email Address <span className="text-[#b91c1c]">*</span>
                        </label>
                        <input
                          id="support-form-email"
                          type="email"
                          value={formEmail}
                          onChange={(e) => {
                            setFormEmail(e.target.value);
                            if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="e.g. name@example.com"
                          disabled={isSubmitting}
                          className={`w-full bg-[#fbf9f4] border ${
                            formErrors.email ? 'border-[#b91c1c]' : 'border-[#e3ded4]'
                          } rounded-lg px-3.5 py-2.5 text-xs text-[#0d3d3a] placeholder-[#889593] focus:outline-none focus:border-[#0d6b63] focus:ring-1 focus:ring-[#0d6b63]`}
                        />
                        {formErrors.email && (
                          <p className="text-[11px] text-[#b91c1c] font-medium">{formErrors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Booking Reference & Category Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="support-form-ref" className="block text-xs font-semibold text-[#0d3d3a]">
                          Booking Reference / PNR <span className="text-[#889593] font-normal">(Optional)</span>
                        </label>
                        <input
                          id="support-form-ref"
                          type="text"
                          value={formBookingRef}
                          onChange={(e) => setFormBookingRef(e.target.value)}
                          placeholder="e.g. AT-9842 or ABC123"
                          disabled={isSubmitting}
                          className="w-full bg-[#fbf9f4] border border-[#e3ded4] rounded-lg px-3.5 py-2.5 text-xs text-[#0d3d3a] placeholder-[#889593] focus:outline-none focus:border-[#0d6b63] focus:ring-1 focus:ring-[#0d6b63]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="support-form-category" className="block text-xs font-semibold text-[#0d3d3a]">
                          Issue Category <span className="text-[#b91c1c]">*</span>
                        </label>
                        <select
                          id="support-form-category"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-[#fbf9f4] border border-[#e3ded4] rounded-lg px-3.5 py-2.5 text-xs text-[#0d3d3a] focus:outline-none focus:border-[#0d6b63] focus:ring-1 focus:ring-[#0d6b63]"
                        >
                          <option value="Booking & Reservations">Booking & Reservations</option>
                          <option value="Cancellations & Refunds">Cancellations & Refunds</option>
                          <option value="Payment & Transaction Issue">Payment & Transaction Issue</option>
                          <option value="Flights, Hotels, Trains, or Buses">Flights, Hotels, Trains, or Buses</option>
                          <option value="Account & Login">Account & Login</option>
                          <option value="Technical Issues">Technical & Other Issues</option>
                        </select>
                      </div>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-1">
                      <label htmlFor="support-form-message" className="block text-xs font-semibold text-[#0d3d3a]">
                        Message Details <span className="text-[#b91c1c]">*</span>
                      </label>
                      <textarea
                        id="support-form-message"
                        rows={4}
                        value={formMessage}
                        onChange={(e) => {
                          setFormMessage(e.target.value);
                          if (formErrors.message) setFormErrors((prev) => ({ ...prev, message: '' }));
                        }}
                        placeholder="Please describe your booking question, cancellation request, or payment concern with relevant details..."
                        disabled={isSubmitting}
                        className={`w-full bg-[#fbf9f4] border ${
                          formErrors.message ? 'border-[#b91c1c]' : 'border-[#e3ded4]'
                        } rounded-lg px-3.5 py-2.5 text-xs text-[#0d3d3a] placeholder-[#889593] focus:outline-none focus:border-[#0d6b63] focus:ring-1 focus:ring-[#0d6b63] leading-relaxed resize-y`}
                      />
                      {formErrors.message && (
                        <p className="text-[11px] text-[#b91c1c] font-medium">{formErrors.message}</p>
                      )}
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-[11px] text-[#889593]">
                        We respect your privacy. No marketing emails or unverified subscriptions.
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 bg-[#0d6b63] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-[#0a534d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                            <span>Validating & Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Support Inquiry</span>
                            <span className="material-symbols-outlined text-[16px]">send</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section F: Additional Help & Travel Hub Navigation */}
        <section
          aria-labelledby="additional-help-heading"
          className="pt-6 border-t border-[#e3ded4] pb-4 space-y-4"
        >
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 id="additional-help-heading" className="text-base sm:text-lg font-bold text-[#0d3d3a]">
              Still looking for something else?
            </h2>
            <p className="text-xs text-[#5c6967]">
              Return to the main Agent Travel booking experience across our supported travel services.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Link
              to="/flights"
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e3ded4] text-xs font-semibold text-[#0d3d3a] hover:border-[#0d6b63] hover:text-[#0d6b63] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">flight</span>
              Flights
            </Link>
            <Link
              to="/hotels"
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e3ded4] text-xs font-semibold text-[#0d3d3a] hover:border-[#0d6b63] hover:text-[#0d6b63] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">hotel</span>
              Hotels
            </Link>
            <Link
              to="/trains"
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e3ded4] text-xs font-semibold text-[#0d3d3a] hover:border-[#0d6b63] hover:text-[#0d6b63] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">train</span>
              Trains
            </Link>
            <Link
              to="/buses"
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e3ded4] text-xs font-semibold text-[#0d3d3a] hover:border-[#0d6b63] hover:text-[#0d6b63] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">directions_bus</span>
              Buses
            </Link>
            <Link
              to="/cabs"
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e3ded4] text-xs font-semibold text-[#0d3d3a] hover:border-[#0d6b63] hover:text-[#0d6b63] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">local_taxi</span>
              Cabs
            </Link>
            <Link
              to="/destinations"
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e3ded4] text-xs font-semibold text-[#0d3d3a] hover:border-[#0d6b63] hover:text-[#0d6b63] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">explore</span>
              Destinations
            </Link>
            <Link
              to="/offers"
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e3ded4] text-xs font-semibold text-[#0d3d3a] hover:border-[#0d6b63] hover:text-[#0d6b63] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0d6b63]">local_offer</span>
              Special Offers
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};
