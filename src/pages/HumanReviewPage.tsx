import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation } from '../context/InvestigationContext';

export const HumanReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases, selectedCase, selectCaseById, approveRefund, requestManualReview, rejectRecommendation } = useInvestigation();

  const [decisionReason, setDecisionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [decisionOutcome, setDecisionOutcome] = useState<'pending' | 'approved' | 'manual_review' | 'rejected'>('pending');
  const [showToast, setShowToast] = useState(false);

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      approveRefund(selectedCase.id, decisionReason || 'Authorized by Lead Auditor Julian Hayes.');
      setIsProcessing(false);
      setDecisionOutcome('approved');
      setShowToast(true);
    }, 900);
  };

  const handleManualReview = () => {
    requestManualReview(selectedCase.id, decisionReason || 'Dispatched for 2nd-level carrier liaison review.');
    setDecisionOutcome('manual_review');
    setShowToast(true);
  };

  const handleReject = () => {
    if (!decisionReason.trim()) {
      alert('Please enter an auditor justification / reason in the comment box before rejecting.');
      return;
    }
    rejectRecommendation(selectedCase.id, decisionReason);
    setDecisionOutcome('rejected');
    setShowToast(true);
  };

  return (
    <div className="flex flex-col w-full pb-16 text-left">
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 mb-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
            <button
              onClick={() => navigate('/refund-investigations')}
              className="hover:text-[#006D77] transition-colors cursor-pointer"
            >
              Refund Investigations
            </button>
            <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF8F7] text-[#006D77] border border-[#C2EAE7] font-bold">
              {selectedCase.caseRef}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl text-[#17324D] tracking-tight font-extrabold font-['Plus_Jakarta_Sans']">
            Human Review & Approval
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Review the AI investigation, supporting evidence, risk assessment, and recommendation before making the final refund decision.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={() => navigate(`/refund-investigations/${selectedCase.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#17324D] font-bold text-xs sm:text-sm hover:bg-[#EAF8F7] hover:text-[#006D77] hover:border-[#20B8B0] transition-all shadow-xs border border-slate-200 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#20B8B0]">visibility</span>
            <span>View Case Dossier</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-slate-600 hover:text-[#006D77] hover:bg-[#EAF8F7] transition-colors shadow-xs border border-slate-200 cursor-pointer"
            title="Print Case Dossier"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
          </button>
        </div>
      </div>

      {/* Case Switcher Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 bg-white p-2.5 rounded-2xl border border-[#C2EAE7]/70 shadow-2xs">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 whitespace-nowrap pl-2 pr-1 font-bold">
          Pending Auditor Review:
        </span>
        {cases
          .filter((c) => c.humanReviewRequired || c.isHighImpact || c.riskLevel === 'High Risk')
          .map((c) => {
            const isSelected = selectedCase.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  selectCaseById(c.id);
                  setDecisionOutcome('pending');
                  setDecisionReason('');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#006D77] to-[#20B8B0] text-white border-transparent font-bold shadow-sm'
                    : 'bg-[#f8fbfa] hover:bg-[#EAF8F7] text-slate-700 border-slate-200 hover:border-[#20B8B0]/40 font-medium'
                }`}
              >
                <span>{c.caseRef}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : c.riskLevel === 'High Risk'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-[#EAF8F7] text-[#006D77]'
                  }`}
                >
                  {c.riskLevel}
                </span>
                <span className={`font-semibold ${isSelected ? 'text-[#E8B86D]' : 'text-[#17324D]'}`}>{c.claimAmountFormatted}</span>
              </button>
            );
          })}
      </div>

      {/* Enterprise Summary Strip Banner */}
      <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-[#C2EAE7]/70">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 items-center text-left">
          {/* Case Meta */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Case Reference</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-[#17324D]">
                {selectedCase.caseRef}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  decisionOutcome === 'approved'
                    ? 'bg-[#006D77]'
                    : decisionOutcome === 'rejected'
                    ? 'bg-rose-500'
                    : 'bg-[#20B8B0] animate-pulse'
                }`}
              ></span>
              <span className="text-xs text-[#006D77] font-semibold">
                {decisionOutcome === 'approved'
                  ? 'Authorized'
                  : decisionOutcome === 'rejected'
                  ? 'Rejected'
                  : 'Ready for Review'}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Passenger</span>
            <span className="text-xs sm:text-sm text-[#17324D] font-bold mt-0.5 truncate">
              {selectedCase.traveler.name}
            </span>
            <span className="text-xs text-slate-500 font-medium">{selectedCase.traveler.tier}</span>
          </div>

          {/* Itinerary */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Trip Sector</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs sm:text-sm text-[#17324D] font-bold">DEL</span>
              <span className="material-symbols-outlined text-[14px] text-[#20B8B0]">flight_takeoff</span>
              <span className="text-xs sm:text-sm text-[#17324D] font-bold">BOM</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium truncate">
              {selectedCase.carrier.code} • Economy (M)
            </span>
          </div>

          {/* Journey Date */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Flight Date</span>
            <span className="text-xs sm:text-sm text-[#17324D] font-semibold mt-0.5">
              {selectedCase.journeyDate}
            </span>
            <span className="text-xs text-slate-500 font-medium">Scheduled 07:15 IST</span>
          </div>

          {/* Amount */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Refund Requested</span>
            <span className="text-base sm:text-lg text-[#006D77] font-black mt-0.5 tracking-tight font-['Plus_Jakarta_Sans']">
              {selectedCase.claimAmountFormatted}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Full Fare Value</span>
          </div>

          {/* Risk Tier */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Risk Classification</span>
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF8F7] text-[#006D77] border border-[#20B8B0]/30 text-xs font-bold">
                <span className="material-symbols-outlined text-[14px] text-[#20B8B0]">verified_user</span>
                <span>{selectedCase.riskLevel}</span>
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-0.5 font-medium">Score: {selectedCase.riskScore} Anomaly</span>
          </div>

          {/* AI Confidence */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Confidence</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl leading-none text-[#17324D] font-black font-['Plus_Jakarta_Sans']">
                {selectedCase.aiConfidence}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#006D77] to-[#20B8B0] h-full rounded-full"
                style={{ width: `${selectedCase.aiConfidence}%` }}
              ></div>
            </div>
          </div>

          {/* Evidence Status */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Evidence Pack</span>
            <span className="text-xs sm:text-sm text-[#17324D] font-bold mt-0.5">5/5 Verified</span>
            <span className="text-xs text-[#006D77] font-bold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-[#20B8B0]">done_all</span>
              <span>Strong Baseline</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2-Column Split: Main Content (65%) & Decision Cockpit (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / MAIN WORKSPACE (~65%) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* 1. AI Recommendation Engine Card */}
          <section className="rounded-2xl p-6 sm:p-7 bg-white shadow-sm border border-[#C2EAE7]/70 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#20B8B0]/10 blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#006D77] to-[#20B8B0] flex items-center justify-center text-white shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#006D77] font-bold">AI RECOMMENDATION</p>
                  <h2 className="text-base sm:text-lg font-bold text-[#17324D]">
                    AI Recommendation Engine
                  </h2>
                </div>
              </div>
            </div>

            {/* Hero Synthesis Result - Signature Oceanic Dark Gradient Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#0a1e2e] text-white mb-5 border border-white/10 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#E8B86D] font-bold">Recommended Action</span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#E8B86D] text-[#0d283e] text-xs font-black shadow-xs">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Full Refund</span>
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                      {selectedCase.claimAmountFormatted}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
                  <span className="material-symbols-outlined text-[#20B8B0] text-[20px]">policy</span>
                  <div>
                    <p className="text-[10px] text-white/70 leading-none font-medium">Policy Basis</p>
                    <p className="text-xs text-white font-semibold leading-tight mt-0.5">
                      Refund policy supports full refund
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-[11px] uppercase tracking-wider text-white/70 font-bold mb-1.5">
                  Investigation Synthesis
                </p>
                <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed italic bg-black/20 p-3.5 rounded-xl border border-white/10">
                  “{selectedCase.synthesis}”
                </p>
              </div>
            </div>

            {/* Metrics Strip inside AI Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7] flex flex-col justify-between shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold">Model Confidence</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base sm:text-lg font-black text-[#17324D]">94.2%</span>
                  <span className="material-symbols-outlined text-[#20B8B0] text-[20px]">bolt</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">Statistical deviation &lt;0.02</span>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7] flex flex-col justify-between shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold">Risk Assessment</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base sm:text-lg font-black text-[#006D77]">Low Risk</span>
                  <span className="material-symbols-outlined text-[#006D77] text-[20px]">security</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">Safe to execute</span>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7] flex flex-col justify-between shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold">Disbursement Route</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base sm:text-lg font-black text-[#17324D]">Auto-Credit</span>
                  <span className="material-symbols-outlined text-[#E8B86D] text-[20px]">credit_card</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">To primary card ending ••4012</span>
              </div>
            </div>

            {/* Compliance Governance Notice */}
            <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#E8B86D]/40 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#B87A1E] text-[20px] shrink-0 mt-0.5">gavel</span>
              <div className="text-[#8A5816]">
                <p className="text-xs sm:text-sm font-bold">Human Authorization Required</p>
                <p className="text-xs text-[#8A5816]/90 mt-0.5">
                  This recommendation requires human review and authorization before the refund is released.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Corroborated Evidence Review (5 Verified Items) */}
          <section className="rounded-2xl p-6 sm:p-7 bg-white shadow-sm border border-[#C2EAE7]/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#17324D]">
                    Corroborated Evidence Review
                  </h2>
                  <span className="px-3 py-0.5 rounded-full bg-[#EAF8F7] text-[#006D77] border border-[#20B8B0]/30 text-xs font-bold">
                    5 of 5 Verified Records
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-source cross-verification through airline GDS, card networks, and civil aviation feeds.
                </p>
              </div>
              <button
                onClick={() => alert('All audit proofs cryptographically verified.')}
                className="text-[#006D77] hover:text-[#20B8B0] text-xs font-bold hover:underline inline-flex items-center gap-1 self-start sm:self-center cursor-pointer transition-colors"
                type="button"
              >
                <span>Audit Proofs</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>

            {/* Evidence Cards Stack */}
            <div className="flex flex-col gap-3">
              {/* Evidence 1 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 hover:border-[#20B8B0] hover:bg-white transition-all shadow-2xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-[#17324D]">
                          Booking Record (GDS Amadeus)
                        </h3>
                        <span className="text-[11px] bg-[#EAF8F7] text-[#006D77] border border-[#C2EAE7] px-2 py-0.5 rounded font-bold">
                          PNR: 482910
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Confirmed electronic ticket issued under corporate travel itinerary. Fare class: M (Economy Flex • Refundable).
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-400 text-[11px] font-medium">
                        <span>E-Ticket: #098-2948102941</span>
                        <span>•</span>
                        <span>Synced: Today, 10:14 IST</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#006D77] to-[#20B8B0] text-white text-[11px] font-bold shadow-2xs">
                      <span className="material-symbols-outlined text-[14px]">check</span>Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Evidence 2 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 hover:border-[#20B8B0] hover:bg-white transition-all shadow-2xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-[#17324D]">
                          Settlement & Payment Ledger
                        </h3>
                        <span className="text-[11px] bg-[#EAF8F7] text-[#006D77] border border-[#C2EAE7] px-2 py-0.5 rounded font-bold">
                          REF: TXN-98420-IN
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Payment settled on corporate card ending ••4012. Breakdown: Net Base Fare ₹7,200 + Taxes ₹2,250 = ₹9,450.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-400 text-[11px] font-medium">
                        <span>Status: Settled</span>
                        <span>•</span>
                        <span>Route: Original Payment Method</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#006D77] to-[#20B8B0] text-white text-[11px] font-bold shadow-2xs">
                      <span className="material-symbols-outlined text-[14px]">check</span>Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Evidence 3 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 hover:border-[#20B8B0] hover:bg-white transition-all shadow-2xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">badge</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-[#17324D]">
                          Corporate Passenger History
                        </h3>
                        <span className="text-[11px] bg-[#EAF8F7] text-[#006D77] border border-[#C2EAE7] px-2 py-0.5 rounded font-bold">
                          Verified Identity
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Rahul Sharma has 14 past bookings with Acme Travel Corp. Clean record with zero prior disputes or rejected claims.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-400 text-[11px] font-medium">
                        <span>Account Standing: Good</span>
                        <span>•</span>
                        <span>14 Completed Trips</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF8F7] text-[#006D77] border border-[#20B8B0]/30 text-[11px] font-bold shadow-2xs">
                      <span className="material-symbols-outlined text-[14px] text-[#20B8B0]">verified</span>No disputes
                    </span>
                  </div>
                </div>
              </div>

              {/* Evidence 4 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 hover:border-[#20B8B0] hover:bg-white transition-all shadow-2xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">event_busy</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-[#17324D]">
                          Carrier Cancellation Notice
                        </h3>
                        <span className="text-[11px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold">
                          Flight AI-805
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Flight AI-805 cancellation verified via carrier operations feed. Notification dispatched prior to scheduled departure.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-400 text-[11px] font-medium">
                        <span>Status: Cancelled by Carrier</span>
                        <span>•</span>
                        <span>Eligible for Full Refund</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF8F7] text-[#006D77] border border-[#20B8B0]/30 text-[11px] font-bold shadow-2xs">
                      <span className="material-symbols-outlined text-[14px] text-[#20B8B0]">check</span>Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Evidence 5 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 hover:border-[#20B8B0] hover:bg-white transition-all shadow-2xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">balance</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-[#17324D]">
                          Refund Policy
                        </h3>
                        <span className="text-[11px] bg-[#EAF8F7] text-[#006D77] border border-[#C2EAE7] px-2 py-0.5 rounded font-bold">
                          Standard Disruption Policy
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Applicable airline and travel refund policy supports 100% refund for carrier-initiated cancellation.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-400 text-[11px] font-medium">
                        <span>Entitlement: 100% Full Refund</span>
                        <span>•</span>
                        <span>Deductions: ₹0</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#006D77] to-[#20B8B0] text-white text-[11px] font-bold shadow-2xs">
                      <span className="material-symbols-outlined text-[14px]">verified</span>Full refund supported
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Risk Assessment Panel */}
          <section className="rounded-2xl p-6 sm:p-7 bg-white shadow-sm border border-[#C2EAE7]/70">
            <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF8F7] text-[#006D77] border border-[#C2EAE7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#17324D]">
                    Telemetry & Anomaly Assessment
                  </h2>
                  <p className="text-xs text-slate-500">Real-time risk scoring matrix computed across 8 validation steps.</p>
                </div>
              </div>
              <span className="text-xs text-[#006D77] font-bold bg-[#EAF8F7] px-3 py-1 rounded-full border border-[#20B8B0]/30">
                Pass: All 8 Audits
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Overall Anomaly Score</p>
                <p className="text-xl sm:text-2xl text-[#006D77] font-extrabold mt-1 font-['Plus_Jakarta_Sans']">
                  0.04 <span className="text-xs text-slate-400 font-normal">/ 1.0</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Threshold: 0.35</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Risk Signals Detected</p>
                <p className="text-base sm:text-lg text-[#17324D] font-bold mt-1">0 Flagged</p>
                <p className="text-[11px] text-[#006D77] font-bold mt-0.5">Zero anomalies found</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Corroboration Score</p>
                <p className="text-base sm:text-lg text-[#17324D] font-bold mt-1">Strong (5/5)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Cross-verified datasets</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Investigation Cycle</p>
                <p className="text-base sm:text-lg text-[#17324D] font-bold mt-1">8 of 8 Done</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Latency: 1.84s</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EAF8F7] border border-[#20B8B0]/30 flex items-center gap-3 text-slate-800">
              <span className="material-symbols-outlined text-[#006D77] text-[22px] shrink-0">check_circle</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <span className="font-bold text-[#17324D]">Conclusion:</span> No significant risk indicators were detected during the automated investigation. Identity match verified, payment trajectory reconciles accurately, and telemetry directly aligns with official civil aviation records.
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR / DECISION COCKPIT (~35%) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
          {/* Final Decision Card */}
          <div className="rounded-2xl p-6 bg-white shadow-sm border border-[#C2EAE7]/70">
            {/* Header with Status */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Authorizer Cockpit</span>
                <h2 className="text-base sm:text-lg font-bold text-[#17324D]">Final Decision</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  decisionOutcome === 'approved'
                    ? 'bg-gradient-to-r from-[#006D77] to-[#20B8B0] text-white shadow-xs'
                    : decisionOutcome === 'rejected'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-[#FEF7EA] text-[#8A5816] border border-[#E8B86D]/50 animate-pulse'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${decisionOutcome === 'approved' ? 'bg-white' : decisionOutcome === 'rejected' ? 'bg-rose-600' : 'bg-[#E8B86D]'}`}></span>
                <span>
                  {decisionOutcome === 'approved'
                    ? 'Approved'
                    : decisionOutcome === 'rejected'
                    ? 'Rejected'
                    : 'Pending Human Approval'}
                </span>
              </span>
            </div>

            {/* Reviewer Metadata Block */}
            <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 mb-4 flex flex-col gap-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Designated Auditor</span>
                <span className="font-bold text-[#17324D]">Julian Hayes (Lead)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Audit Role</span>
                <span className="text-[#17324D] font-semibold">Enterprise Restitution Lead</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Resolution Status</span>
                <span className={decisionOutcome === 'approved' ? 'text-[#006D77] font-bold' : 'text-rose-600 font-bold'}>
                  {decisionOutcome === 'approved' ? 'Authorized' : 'Awaiting Execution'}
                </span>
              </div>
            </div>

            {/* Decision Reason Textarea */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#17324D]" htmlFor="decisionReason">
                  Decision Reason / Reviewer Comment
                </label>
                <span className="text-[11px] text-slate-400">Optional audit note</span>
              </div>
              <textarea
                className="w-full p-3 rounded-xl bg-[#f8fbfa] border border-slate-200 text-xs sm:text-sm text-[#17324D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20B8B0]/30 focus:border-[#006D77] focus:bg-white transition-all"
                id="decisionReason"
                placeholder="Enter auditor justification or override rationale for banking record..."
                rows={2}
                maxLength={300}
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
              />
              <div className="flex items-center justify-between mt-1 text-slate-400 text-[11px]">
                <span>Logged to internal immutable audit trail</span>
                <span>{decisionReason.length}/300</span>
              </div>
            </div>

            {/* Warning / Security Callout */}
            <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#E8B86D]/40 mb-5 flex items-start gap-2.5 text-xs">
              <span className="material-symbols-outlined text-[#B87A1E] text-[20px] shrink-0 mt-0.5">shield</span>
              <p className="text-[#8A5816] leading-relaxed">
                Approving this action will authorize the recommended refund of{' '}
                <span className="font-bold text-[#8A5816]">{selectedCase.claimAmountFormatted}</span> to the customer's original payment method.
              </p>
            </div>

            {/* Action Button Stack */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleApprove}
                disabled={isProcessing || decisionOutcome === 'approved'}
                className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#006D77] to-[#20B8B0] hover:from-[#005a63] hover:to-[#1aa39b] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                type="button"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                    <span>Processing Authorization...</span>
                  </>
                ) : decisionOutcome === 'approved' ? (
                  <>
                    <span className="material-symbols-outlined text-[20px]">done</span>
                    <span>Refund Authorized</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[22px]">check_circle</span>
                    <span>Approve Refund • {selectedCase.claimAmountFormatted}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleManualReview}
                className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#EAF8F7] hover:text-[#006D77] hover:border-[#20B8B0] text-[#17324D] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200 shadow-2xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">manage_search</span>
                <span>Request Manual Review</span>
              </button>

              <button
                onClick={handleReject}
                className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-rose-50 text-rose-700 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-200 shadow-2xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">block</span>
                <span>Reject Recommendation</span>
              </button>
            </div>

            {/* Success Toast */}
            {showToast && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#0a1e2e] text-white mt-4 animate-fade-in border border-[#20B8B0]/40 shadow-xl">
                <div className="flex items-center gap-2 font-bold text-xs text-[#E8B86D]">
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  <span>
                    {decisionOutcome === 'approved'
                      ? 'Refund Transmitted Successfully'
                      : decisionOutcome === 'rejected'
                      ? 'Recommendation Rejected'
                      : 'Dispatched for Manual Review'}
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Transaction ledger updated. Confirmation reference #REF-APPROVED-9842 logged to immutable audit trail.
                </p>
              </div>
            )}
          </div>

          {/* Chronological Audit Trail & Activity Timeline */}
          <div className="rounded-2xl p-6 bg-white shadow-sm border border-[#C2EAE7]/70">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006D77] text-[20px]">history_toggle_off</span>
                <h3 className="text-sm sm:text-base font-bold text-[#17324D]">Review Activity</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Automated Pipeline</span>
            </div>

            {/* Timeline Steps */}
            <div className="relative pl-6 flex flex-col gap-4">
              <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-slate-200"></div>

              {/* Step 1 */}
              <div className="relative flex items-start gap-3 text-xs">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-gradient-to-tr from-[#006D77] to-[#20B8B0] text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">check</span>
                </div>
                <div>
                  <p className="font-bold text-[#17324D]">AI Investigation Completed</p>
                  <p className="text-slate-500">Claim ingested, itinerary & PNR parsed</p>
                  <span className="text-slate-400 mt-0.5 block text-[10px]">10:14 AM IST</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-3 text-xs">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-gradient-to-tr from-[#006D77] to-[#20B8B0] text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">check</span>
                </div>
                <div>
                  <p className="font-bold text-[#17324D]">Evidence Verified</p>
                  <p className="text-slate-500">5 of 5 multi-tier data feeds reconciled</p>
                  <span className="text-slate-400 mt-0.5 block text-[10px]">10:15 AM IST</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-3 text-xs">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-gradient-to-tr from-[#006D77] to-[#20B8B0] text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">check</span>
                </div>
                <div>
                  <p className="font-bold text-[#17324D]">Risk Assessment Completed</p>
                  <p className="text-slate-500">Scored as Low Risk • 94% confidence</p>
                  <span className="text-slate-400 mt-0.5 block text-[10px]">10:16 AM IST</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-3 text-xs">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-gradient-to-tr from-[#006D77] to-[#20B8B0] text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">check</span>
                </div>
                <div>
                  <p className="font-bold text-[#17324D]">Recommendation Formulated</p>
                  <p className="text-slate-500">Full Refund ₹9,450 proposed via DGCA rule</p>
                  <span className="text-slate-400 mt-0.5 block text-[10px]">10:16 AM IST</span>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start gap-3 text-xs">
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                    decisionOutcome === 'approved'
                      ? 'bg-gradient-to-tr from-[#006D77] to-[#20B8B0] text-white'
                      : decisionOutcome === 'rejected'
                      ? 'bg-rose-600 text-white'
                      : 'bg-gradient-to-r from-[#E8B86D] to-[#d9a552] text-[#0d283e] animate-pulse'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {decisionOutcome === 'approved' ? 'check' : decisionOutcome === 'rejected' ? 'close' : 'pending'}
                  </span>
                </div>
                <div>
                  <p
                    className={`font-bold ${
                      decisionOutcome === 'approved'
                        ? 'text-[#006D77]'
                        : decisionOutcome === 'rejected'
                        ? 'text-rose-600'
                        : 'text-[#17324D]'
                    }`}
                  >
                    {decisionOutcome === 'approved'
                      ? 'Decision Executed: Approved'
                      : decisionOutcome === 'rejected'
                      ? 'Decision Executed: Rejected'
                      : 'Awaiting Human Decision'}
                  </p>
                  <p className="text-slate-500">Assigned to Lead Auditor Julian Hayes</p>
                  <span className="text-[#006D77] font-bold mt-0.5 block text-[10px]">
                    {decisionOutcome === 'approved' ? 'Complete' : 'In Progress (Active)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
