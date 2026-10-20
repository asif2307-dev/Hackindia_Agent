import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { useInvestigation } from '../context/InvestigationContext';
import { InvestigationCase } from '../types';
import { primaryCaseAT9842 } from '../data/mockData';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cases } = useInvestigation();
  const [backendCase, setBackendCase] = useState<InvestigationCase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const cleanParam = id?.trim().toLowerCase() || 'rf12345';
  const isMockDefault = cleanParam === 'at-9842' || cleanParam === '482910' || cleanParam === 'rf12345';

  const localMatched = cases.find(
    (c) =>
      c.id.toLowerCase() === cleanParam ||
      c.caseRef.toLowerCase().replace('#', '') === cleanParam.replace('#', '') ||
      c.pnr.toLowerCase() === cleanParam ||
      (c.bookingId && c.bookingId.toLowerCase() === cleanParam) ||
      `rf${c.pnr}`.toLowerCase() === cleanParam ||
      `rf${c.id}`.toLowerCase() === cleanParam
  );

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    const cleanId = id.trim().replace(/^#/, '');
    const fetchLiveCase = async () => {
      setIsLoading(true);
      try {
        let res: Response | null = null;
        try {
          res = await fetch(`/api/refunds/${cleanId}`);
        } catch {
          res = await fetch(`http://localhost:5001/api/refunds/${cleanId}`);
        }
        if (res && res.ok) {
          const data = await res.json();
          if (data.refund) {
            setBackendCase(data.refund);
          }
        }
      } catch (err) {
        console.warn('Error fetching live refund case:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiveCase();
  }, [id]);

  const currentCase = backendCase || localMatched || (isMockDefault ? primaryCaseAT9842 : null);

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'cancellation_notice.pdf',
    'carrier_advisory_log.pdf',
  ]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleUploadMore = () => {
    const newDoc = `supporting_doc_${Date.now().toString().slice(-4)}.pdf`;
    setUploadedFiles((prev) => [...prev, newDoc]);
  };

  if (isLoading && !currentCase) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
        <SiteHeader activeTab="refunds" />
        <main className="flex-1 w-full site-container py-16 text-center">
          <div className="inline-block p-6 bg-white rounded-xl border border-[#e3ded4] shadow-sm max-w-md mx-auto">
            <div className="w-8 h-8 border-2 border-[#0d6b63] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#0d3d3a]">Loading Case Details...</h3>
            <p className="text-xs text-[#5c6967] mt-1">Retrieving verified booking and refund dossier for #{id}</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
        <SiteHeader activeTab="refunds" />
        <main className="flex-1 w-full site-container py-16 text-center">
          <div className="p-8 bg-white rounded-xl border border-[#e3ded4] shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#fee2e2] text-[#991b1b] flex items-center justify-center font-bold text-lg mx-auto">
              ✕
            </div>
            <h2 className="text-lg font-bold text-[#0d3d3a]">Refund Case Not Found</h2>
            <p className="text-xs text-[#5c6967]">
              No refund case or eligible booking record was found for "{id}".
            </p>
            <div className="pt-2">
              <Link
                to="/refunds"
                className="inline-block bg-[#0d6b63] text-white px-5 py-2 rounded-md text-xs font-semibold hover:bg-[#0a544e] transition-colors"
              >
                Back to Refund Center
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const displayCaseId = currentCase.caseRef.replace('#', '') || currentCase.id;
  const isApprovedOrDisbursed = currentCase.decisionStatus === 'Approved' || currentCase.decisionStatus === 'Disbursed';
  const isRejected = currentCase.decisionStatus === 'Rejected';

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="refunds" />

      {downloadSuccess && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center gap-2 text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">download_done</span>
          <span>Case summary for #{displayCaseId} downloaded successfully!</span>
        </div>
      )}

      <main className="flex-1 w-full site-container py-8 text-left">
        {/* Breadcrumb (Page 10) */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <Link to="/refunds" className="hover:text-[#0d3d3a]">Refunds</Link>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Case #{displayCaseId}</span>
        </div>

        {/* Title Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e3ded4] gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
                Refund case #{displayCaseId}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  isApprovedOrDisbursed
                    ? 'bg-[#ecfdf5] text-[#166534] border-[#bbf7d0]'
                    : isRejected
                    ? 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]'
                    : 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                }`}
              >
                {currentCase.decisionStatus}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-1 capitalize">
              {currentCase.carrier.type} · {currentCase.carrier.route} · Journey date: {currentCase.journeyDate}
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download case summary
          </button>
        </div>

        {/* STEPPER PROGRESS BAR (Page 10) */}
        <div className="py-6 border-b border-[#e3ded4]">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#0d6b63] text-white flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <span className="font-bold text-[#0d3d3a]">Submitted</span>
              <span className="text-[#889593] text-[11px]">{currentCase.journeyDate}</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#0d6b63] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#0d6b63]/15">
                ✓
              </div>
              <span className="font-bold text-[#0d6b63]">AI review</span>
              <span className="text-[#889593] text-[11px]">{currentCase.aiConfidence}% Verified</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                  isApprovedOrDisbursed
                    ? 'bg-[#0d6b63] text-white border-[#0d6b63]'
                    : isRejected
                    ? 'bg-[#991b1b] text-white border-[#991b1b]'
                    : 'bg-[#f3eee5] border-[#0d6b63] text-[#0d6b63]'
                }`}
              >
                {isApprovedOrDisbursed ? '✓' : isRejected ? '✕' : '3'}
              </div>
              <span className="font-bold text-[#0d3d3a]">Decision</span>
              <span
                className={`font-medium text-[11px] ${
                  isApprovedOrDisbursed
                    ? 'text-[#166534]'
                    : isRejected
                    ? 'text-[#991b1b]'
                    : 'text-[#b45309]'
                }`}
              >
                {currentCase.decisionStatus}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentCase.decisionStatus === 'Disbursed'
                    ? 'bg-[#0d6b63] text-white'
                    : 'bg-[#f3eee5] text-[#889593]'
                }`}
              >
                {currentCase.decisionStatus === 'Disbursed' ? '✓' : '4'}
              </div>
              <span className={currentCase.decisionStatus === 'Disbursed' ? 'font-bold text-[#0d3d3a]' : 'text-[#889593]'}>
                Payout
              </span>
              <span className="text-[#889593] text-[11px]">
                {currentCase.decisionStatus === 'Disbursed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
          {/* Left Column (Findings & Documents) */}
          <div className="lg:col-span-8 space-y-6">
            {/* AI Review Findings Card */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-5">
              <div>
                <span className="text-[11px] font-bold text-[#0d6b63] uppercase tracking-wider block">
                  AI-POWERED REVIEW
                </span>
                <h2 className="text-xl font-bold text-[#0d3d3a] mt-0.5">
                  What we found so far
                </h2>
                <p className="text-xs text-[#5c6967] mt-1">
                  Your booking has been checked against the carrier's records and the applicable restitution policies.
                </p>
              </div>

              {/* Evidence Synthesis Quote */}
              <div className="p-3.5 bg-[#fbf9f4] border-l-4 border-[#0d6b63] rounded-r-lg text-xs text-[#42504e] leading-relaxed">
                <span className="font-bold text-[#0d3d3a] block mb-1">Autonomous Audit Assessment:</span>
                {currentCase.synthesis || currentCase.reasonSummary}
              </div>

              {/* Dynamic Investigation Steps */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0d3d3a]">
                  Arbitration & Evidence Verification Pipeline
                </h4>
                {currentCase.steps && currentCase.steps.length > 0 ? (
                  currentCase.steps.slice(0, 5).map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-lg bg-[#fbf9f4] border border-[#e3ded4]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <div>
                        <h4 className="font-bold text-[#0d3d3a] text-xs">
                          {step.title}
                        </h4>
                        <p className="text-xs text-[#5c6967] mt-0.5">
                          {step.summary}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#fbf9f4] border border-[#e3ded4]">
                    <span className="w-5 h-5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h4 className="font-bold text-[#0d3d3a] text-xs">
                        Carrier operational verification confirmed
                      </h4>
                      <p className="text-xs text-[#5c6967] mt-0.5">
                        {currentCase.reasonSummary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What happens next? (Page 10) */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-2">
              <h3 className="text-base font-bold text-[#0d3d3a]">
                What happens next?
              </h3>
              <p className="text-xs sm:text-sm text-[#5c6967] leading-relaxed">
                Our automated arbitration engine packages statutory evidence under DGCA CAR / EC 261 mandates.
                Final authorization is signed off by certified auditors before payment release to your original account.
              </p>
            </div>

            {/* Supporting Documents (Page 10) */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0d3d3a]">
                  Supporting documents
                </h3>
                <button
                  onClick={handleUploadMore}
                  className="text-xs font-semibold text-[#0d6b63] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">upload_file</span>
                  Upload more documents
                </button>
              </div>

              <div className="space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#e3ded4] bg-[#fbf9f4] text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#0d6b63]">description</span>
                      <div>
                        <span className="font-semibold text-[#0d3d3a] block">{file}</span>
                        <span className="text-[10px] text-[#889593]">Verified in GDS dossier</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#166534] font-semibold text-[11px] border border-[#bbf7d0]">
                      Received
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Potential Refund Estimate + Booking Details */}
          <div className="lg:col-span-4 space-y-5">
            {/* POTENTIAL REFUND ESTIMATE Card (Page 10) */}
            <div className="bg-[#f0ebe1] rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-[#0d6b63] uppercase tracking-wider block">
                Potential Refund Estimate
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-[#0d3d3a]">
                {currentCase.claimAmountFormatted}
              </div>
              <p className="text-xs text-[#5c6967] leading-relaxed pt-1">
                {currentCase.recommendedAction}
              </p>
              <div className="pt-2 border-t border-[#e3ded4] flex items-center justify-between text-xs text-[#6b7775]">
                <span>AI Confidence:</span>
                <span className="font-bold text-[#0d6b63]">{currentCase.aiConfidence}%</span>
              </div>
            </div>

            {/* Booking Details Card (Page 10) */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#0d3d3a] pb-2 border-b border-[#f0ebe1]">
                Booking details
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Booking reference</span>
                  <span className="font-mono font-bold text-[#0d3d3a]">{currentCase.pnr}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Carrier / Operator</span>
                  <span className="font-medium text-[#0d3d3a]">{currentCase.carrier.name} ({currentCase.carrier.code})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Trip</span>
                  <span className="font-semibold text-[#0d3d3a]">{currentCase.carrier.route}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Date</span>
                  <span className="font-medium text-[#0d3d3a]">{currentCase.journeyDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Traveller</span>
                  <span className="font-medium text-[#0d3d3a]">{currentCase.traveler.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#889593]">Reason</span>
                  <span className="font-semibold text-[#991b1b]">{currentCase.reasonSummary}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f0ebe1]">
                <Link
                  to="/reviewer"
                  className="w-full text-center block text-xs font-semibold text-[#0d6b63] hover:underline"
                >
                  View from Staff Reviewer Console →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer (Page 10) */}
        <div className="pt-4 pb-6 text-xs text-[#889593] border-t border-[#e3ded4]">
          Refund eligibility and amounts depend on your booking, applicable statutory policies and provider decisions.
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

