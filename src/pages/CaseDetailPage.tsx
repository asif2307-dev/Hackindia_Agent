import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const caseId = id ? (id.startsWith('RF') || id.startsWith('AT') ? id : `RF${id}`) : 'RF12345';

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'cancellation_email.pdf',
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

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <SiteHeader activeTab="refunds" />

      {downloadSuccess && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0d6b63] text-white font-semibold shadow-xl flex items-center gap-2 text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">download_done</span>
          <span>Case summary for #{caseId} downloaded successfully!</span>
        </div>
      )}

      <main className="flex-1 w-full site-container py-8 text-left">
        {/* Breadcrumb (Page 10) */}
        <div className="text-xs text-[#6b7775] mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#0d3d3a]">Home</Link>
          <span>›</span>
          <Link to="/refunds" className="hover:text-[#0d3d3a]">Refunds</Link>
          <span>›</span>
          <span className="text-[#0d3d3a] font-medium">Case #{caseId}</span>
        </div>

        {/* Title Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e3ded4] gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
                Refund case #{caseId}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-xs font-semibold border border-[#fde68a]">
                Under review
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-1">
              Flight · Delhi → Mumbai · Last updated 20 Oct 2026, 10:24 AM
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors flex items-center gap-1.5 shadow-sm"
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
              <span className="text-[#889593] text-[11px]">18 Oct</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#0d6b63] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#0d6b63]/15">
                ✓
              </div>
              <span className="font-bold text-[#0d6b63]">AI review</span>
              <span className="text-[#889593] text-[11px]">20 Oct</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#f3eee5] border border-[#0d6b63] text-[#0d6b63] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="font-bold text-[#0d3d3a]">Decision</span>
              <span className="text-[#b45309] font-medium text-[11px]">Pending</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#f3eee5] text-[#889593] flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-[#889593]">Completed</span>
              <span className="text-[#889593] text-[11px]">—</span>
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
                  Your booking has been checked against the airline's records and the applicable policies.
                </p>
              </div>

              {/* Evidence Checklist (Page 10) */}
              <div className="space-y-4 pt-2">
                {/* 1. Cancellation notice */}
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#fbf9f4] border border-[#e3ded4]">
                  <span className="w-5 h-5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-[#0d3d3a] text-xs">
                      Cancellation notice found
                    </h4>
                    <p className="text-xs text-[#5c6967] mt-0.5">
                      The airline's records show flight AI-805 on 24 Oct 2026 as cancelled.
                    </p>
                  </div>
                </div>

                {/* 2. Booking and payment details match */}
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#fbf9f4] border border-[#e3ded4]">
                  <span className="w-5 h-5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-[#0d3d3a] text-xs">
                      Booking and payment details match
                    </h4>
                    <p className="text-xs text-[#5c6967] mt-0.5">
                      The ticket and payment receipt match the traveller on this booking.
                    </p>
                  </div>
                </div>

                {/* 3. Applicable policy identified */}
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#fbf9f4] border border-[#e3ded4]">
                  <span className="w-5 h-5 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-[#0d3d3a] text-xs">
                      Applicable policy identified
                    </h4>
                    <p className="text-xs text-[#5c6967] mt-0.5">
                      Cancellations by the airline may qualify for a refund of the fare, subject to the airline's published policy and its decision.
                    </p>
                  </div>
                </div>

                {/* 4. Policy check in progress */}
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#fbf9f4] border border-[#e3ded4]">
                  <span className="w-5 h-5 rounded-full bg-[#0d6b63] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 animate-pulse">
                    …
                  </span>
                  <div>
                    <h4 className="font-bold text-[#0d3d3a] text-xs">
                      Policy check in progress
                    </h4>
                    <p className="text-xs text-[#5c6967] mt-0.5">
                      We are confirming the remaining conditions before the case moves to a decision.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What happens next? (Page 10) */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-2">
              <h3 className="text-base font-bold text-[#0d3d3a]">
                What happens next?
              </h3>
              <p className="text-xs sm:text-sm text-[#5c6967] leading-relaxed">
                Our team reviews the AI findings, then shares the case with the provider. You'll get an email
                when there is a decision or if we need more documents. The provider makes the final decision.
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
                  className="text-xs font-semibold text-[#0d6b63] hover:underline flex items-center gap-1"
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
                        <span className="text-[10px] text-[#889593]">Uploaded 18 Oct 2026</span>
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
                ₹ 4,872
              </div>
              <p className="text-xs text-[#5c6967] leading-relaxed pt-1">
                This is the fare you paid, shown as an estimate only. The final amount is decided by the provider.
              </p>
            </div>

            {/* Booking Details Card (Page 10) */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#0d3d3a] pb-2 border-b border-[#f0ebe1]">
                Booking details
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Booking reference</span>
                  <span className="font-mono font-bold text-[#0d3d3a]">ABC123</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Service</span>
                  <span className="font-medium text-[#0d3d3a]">Flight</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Trip</span>
                  <span className="font-semibold text-[#0d3d3a]">Delhi → Mumbai</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Date</span>
                  <span className="font-medium text-[#0d3d3a]">24 Oct 2026</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fbf9f4]">
                  <span className="text-[#889593]">Traveller</span>
                  <span className="font-medium text-[#0d3d3a]">1 · Economy</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#889593]">Reason</span>
                  <span className="font-semibold text-[#991b1b]">Flight cancelled (airline)</span>
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
          Refund eligibility and amounts depend on your booking, applicable policies and provider decisions.
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
