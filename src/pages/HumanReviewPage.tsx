import React, { useState } from 'react';
import { ReviewerHeader } from '../components/layout/ReviewerHeader';

interface QueueCase {
  id: string;
  service: string;
  serviceType: string;
  route: string;
  status: 'Ready for review' | 'Needs documents' | 'AI review';
  farePaid: string;
  flightOrEntity: string;
  traveller: string;
}

export const HumanReviewPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Ready' | 'Docs'>('All');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('RF12345');
  const [decision, setDecision] = useState<string>('eligible');
  const [reviewerNote, setReviewerNote] = useState<string>(
    'I have reviewed the AI findings and the supporting documents. Carrier operational cancellation confirmed in Amadeus logs.'
  );
  const [submittedAlert, setSubmittedAlert] = useState<string | null>(null);

  const queueCases: QueueCase[] = [
    {
      id: 'RF12345',
      service: 'Flight',
      serviceType: 'flight',
      flightOrEntity: 'AI-805 · 24 Oct 2026',
      route: 'Delhi → Mumbai',
      status: 'Ready for review',
      farePaid: '₹ 4,872',
      traveller: '1 · Economy',
    },
    {
      id: 'RF12360',
      service: 'Flight',
      serviceType: 'flight',
      flightOrEntity: '6E-402 · 25 Oct 2026',
      route: 'Bengaluru → Kochi',
      status: 'Needs documents',
      farePaid: '₹ 3,420',
      traveller: '1 · Economy',
    },
    {
      id: 'RF12371',
      service: 'Hotel',
      serviceType: 'hotel',
      flightOrEntity: 'Goa Beach Resort',
      route: 'Goa Beach Resort',
      status: 'Ready for review',
      farePaid: '₹ 8,900',
      traveller: '2 Guests',
    },
    {
      id: 'RF12388',
      service: 'Train',
      serviceType: 'train',
      flightOrEntity: 'Deccan Queen #12124',
      route: 'Mumbai → Pune',
      status: 'AI review',
      farePaid: '₹ 1,140',
      traveller: '2 · Chair Car',
    },
    {
      id: 'RF12402',
      service: 'Bus',
      serviceType: 'bus',
      flightOrEntity: 'Coastline Travels',
      route: 'Bengaluru → Goa',
      status: 'Ready for review',
      farePaid: '₹ 1,850',
      traveller: '1 · Sleeper',
    },
  ];

  const filteredCases = queueCases.filter((c) => {
    if (selectedFilter === 'Ready') return c.status === 'Ready for review';
    if (selectedFilter === 'Docs') return c.status === 'Needs documents';
    return true;
  });

  const selectedCase = queueCases.find((c) => c.id === selectedCaseId) || queueCases[0];

  const handleConfirmSubmit = () => {
    setSubmittedAlert(`Case #${selectedCase.id} decision recorded: Claim submitted to provider.`);
    setTimeout(() => setSubmittedAlert(null), 3500);
  };

  const handleSaveDraft = () => {
    setSubmittedAlert(`Draft saved for Case #${selectedCase.id}.`);
    setTimeout(() => setSubmittedAlert(null), 3000);
  };

  const handleEscalate = () => {
    setSubmittedAlert(`Case #${selectedCase.id} escalated to Principal Auditor Julian Hayes.`);
    setTimeout(() => setSubmittedAlert(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <ReviewerHeader />

      {/* Action Notification */}
      {submittedAlert && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0a3635] text-white font-semibold shadow-2xl flex items-center gap-2.5 text-xs animate-fade-in border border-[#185e5b]">
          <span className="material-symbols-outlined text-[18px] text-[#20B8B0]">verified</span>
          <span>{submittedAlert}</span>
        </div>
      )}

      <main className="flex-1 w-full site-container py-6 text-left">
        {/* Reviewer Header Sub-bar */}
        <div className="pb-5 border-b border-[#e3ded4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Case review
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              Check the AI findings and decide how the case should proceed. The provider makes the final refund decision.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-[#e8f2f0] text-[#0d6b63] border border-[#d0dfd3]">
            {queueCases.length} cases in your queue
          </span>
        </div>

        {/* Filter Tabs for Queue */}
        <div className="py-3 flex items-center gap-2">
          {(['All', 'Ready', 'Docs'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#0d6b63] text-white shadow-sm'
                  : 'bg-white border border-[#e3ded4] text-[#42504e] hover:bg-[#eae4d8]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 2-Column Split: Queue List + Detailed Review (Page 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* Left Column: Cases Queue List */}
          <div className="lg:col-span-4 space-y-3">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                  selectedCaseId === c.id
                    ? 'bg-white border-[#0d6b63] shadow-md ring-1 ring-[#0d6b63]'
                    : 'bg-white/80 border-[#e3ded4] hover:bg-white hover:border-[#0d6b63]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0d3d3a]">
                    #{c.id} · {c.service}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      c.status === 'Ready for review'
                        ? 'bg-[#ecfdf5] text-[#166534] border-[#bbf7d0]'
                        : c.status === 'Needs documents'
                        ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
                        : 'bg-[#e8f2f0] text-[#0d6b63] border-[#d0dfd3]'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="font-semibold text-sm text-[#0d3d3a]">{c.route}</div>

                <div className="flex items-center justify-between text-[#6b7775] pt-1 text-[11px] border-t border-[#f0ebe1]">
                  <span>{c.flightOrEntity}</span>
                  <span className="font-semibold text-[#0d3d3a]">{c.farePaid}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Active Case Review & Decision Form (Page 11) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-[#e3ded4] p-6 shadow-sm space-y-6">
            {/* Header of Active Case */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e3ded4]">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#0d3d3a]">
                    Case #{selectedCase.id}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#166534] text-xs font-semibold border border-[#bbf7d0]">
                    {selectedCase.status}
                  </span>
                </div>
                <p className="text-xs text-[#6b7775] mt-0.5">{selectedCase.route}</p>
              </div>

              <span className="font-mono font-bold text-lg text-[#0d3d3a]">
                {selectedCase.farePaid}
              </span>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 rounded-lg bg-[#fbf9f4] border border-[#e3ded4] text-xs">
              <div>
                <span className="text-[10px] text-[#889593] font-bold uppercase block">Service</span>
                <span className="font-semibold text-[#0d3d3a]">{selectedCase.service}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#889593] font-bold uppercase block">Details</span>
                <span className="font-semibold text-[#0d3d3a] truncate block">{selectedCase.flightOrEntity}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#889593] font-bold uppercase block">Route</span>
                <span className="font-semibold text-[#0d3d3a] truncate block">{selectedCase.route}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#889593] font-bold uppercase block">Traveller</span>
                <span className="font-semibold text-[#0d3d3a]">{selectedCase.traveller}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#889593] font-bold uppercase block">Fare Paid</span>
                <span className="font-bold text-[#0d6b63]">{selectedCase.farePaid}</span>
              </div>
            </div>

            {/* AI Summary Box (Page 11) */}
            <div className="p-4 rounded-lg bg-[#e8f2f0]/60 border border-[#d0dfd3] space-y-1.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d6b63] block">
                AI Summary · For Human Review
              </span>
              <p className="text-[#2d5650] leading-relaxed">
                The airline's records show the flight as cancelled, and the ticket and payment details match the traveller. The case
                appears to meet the conditions of the airline's published cancellation policy. This is a recommendation only.
              </p>
            </div>

            {/* Evidence Checked Table (Page 11) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#0d3d3a] uppercase tracking-wider">
                Evidence checked
              </h3>

              <div className="border border-[#e3ded4] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#fbf9f4] border-b border-[#e3ded4] text-[#6b7775]">
                    <tr>
                      <th className="p-3 font-semibold">Evidence item</th>
                      <th className="p-3 font-semibold">Source</th>
                      <th className="p-3 font-semibold">Finding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ebe1]">
                    <tr>
                      <td className="p-3 font-medium text-[#0d3d3a]">
                        Cancellation of AI-805 confirmed
                      </td>
                      <td className="p-3 text-[#6b7775]">Airline operational record</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#166534] font-semibold text-[11px]">
                          Matches
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-[#0d3d3a]">
                        cancellation_email.pdf
                      </td>
                      <td className="p-3 text-[#6b7775]">Traveller document</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#166534] font-semibold text-[11px]">
                          Reviewed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-[#0d3d3a]">
                        ₹ 4,872 paid by card
                      </td>
                      <td className="p-3 text-[#6b7775]">Payment receipt</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#166534] font-semibold text-[11px]">
                          Matches
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-[#0d3d3a]">
                        Cancellation by airline, section 3.2
                      </td>
                      <td className="p-3 text-[#6b7775]">Airline policy</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#fffbeb] text-[#92400e] font-semibold text-[11px]">
                          Needs reviewer check
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reviewer Decision Radio Form (Page 11) */}
            <div className="space-y-4 pt-3 border-t border-[#e3ded4]">
              <h3 className="text-sm font-bold text-[#0d3d3a]">
                Reviewer decision
              </h3>

              <div className="space-y-2.5 text-xs">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e3ded4] hover:bg-[#fbf9f4] cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    value="eligible"
                    checked={decision === 'eligible'}
                    onChange={() => setDecision('eligible')}
                    className="mt-0.5 accent-[#0d6b63]"
                  />
                  <div>
                    <span className="font-bold text-[#0d3d3a] block">
                      Submit claim to provider as eligible
                    </span>
                    <span className="text-[#5c6967]">
                      Send the case and evidence to the airline for its decision.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e3ded4] hover:bg-[#fbf9f4] cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    value="adjusted"
                    checked={decision === 'adjusted'}
                    onChange={() => setDecision('adjusted')}
                    className="mt-0.5 accent-[#0d6b63]"
                  />
                  <div>
                    <span className="font-bold text-[#0d3d3a] block">
                      Submit with adjusted estimate
                    </span>
                    <span className="text-[#5c6967]">
                      Enter a different estimate below before submitting.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e3ded4] hover:bg-[#fbf9f4] cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    value="docs"
                    checked={decision === 'docs'}
                    onChange={() => setDecision('docs')}
                    className="mt-0.5 accent-[#0d6b63]"
                  />
                  <div>
                    <span className="font-bold text-[#0d3d3a] block">
                      Request more documents
                    </span>
                    <span className="text-[#5c6967]">
                      Ask the traveller for additional proof.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e3ded4] hover:bg-[#fbf9f4] cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    value="not_eligible"
                    checked={decision === 'not_eligible'}
                    onChange={() => setDecision('not_eligible')}
                    className="mt-0.5 accent-[#0d6b63]"
                  />
                  <div>
                    <span className="font-bold text-[#0d3d3a] block">
                      Close as not eligible
                    </span>
                    <span className="text-[#5c6967]">
                      A reason is required and will be shared with the traveller.
                    </span>
                  </div>
                </label>
              </div>

              {/* Reviewer Note */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-[#0d3d3a] block">
                  Reviewer note (required)
                </label>
                <textarea
                  rows={3}
                  value={reviewerNote}
                  onChange={(e) => setReviewerNote(e.target.value)}
                  className="w-full border border-[#e3ded4] rounded-lg p-3 text-xs focus:outline-none focus:border-[#0d6b63]"
                />
                <span className="text-[11px] text-[#889593]">
                  The traveller will be notified of this outcome by email
                </span>
              </div>

              {/* Action Buttons (Page 11) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="bg-[#0d6b63] text-white px-5 py-2.5 rounded-md text-xs font-semibold hover:bg-[#0a534d] transition-colors shadow-sm"
                >
                  Confirm and submit
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="bg-white border border-[#e3ded4] text-[#0d3d3a] px-4 py-2.5 rounded-md text-xs font-semibold hover:bg-[#f7f4ed] transition-colors"
                >
                  Save as draft
                </button>
                <button
                  type="button"
                  onClick={handleEscalate}
                  className="bg-white border border-[#e3ded4] text-[#991b1b] px-4 py-2.5 rounded-md text-xs font-semibold hover:bg-[#fee2e2]/40 transition-colors"
                >
                  Escalate to senior reviewer
                </button>
              </div>
            </div>

            {/* Case History Log (Page 11) */}
            <div className="space-y-3 pt-4 border-t border-[#e3ded4]">
              <h3 className="text-xs font-bold text-[#0d3d3a] uppercase tracking-wider">
                Case history
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 text-[#6b7775]">
                  <span>Case submitted by traveller</span>
                  <span className="text-[#889593]">18 Oct, 09:12</span>
                </div>
                <div className="flex items-center justify-between py-1 text-[#6b7775]">
                  <span>Documents uploaded</span>
                  <span className="text-[#889593]">18 Oct, 09:40</span>
                </div>
                <div className="flex items-center justify-between py-1 text-[#6b7775]">
                  <span>AI review completed</span>
                  <span className="text-[#889593]">20 Oct, 10:24</span>
                </div>
                <div className="flex items-center justify-between py-1 text-[#0d6b63] font-semibold">
                  <span>Assigned to Meera Iyer</span>
                  <span>20 Oct, 10:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
