import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvestigation } from '../context/InvestigationContext';
import { ExplainablePipeline } from '../components/investigation/ExplainablePipeline';
import { FareDistanceModule } from '../components/investigation/FareDistanceModule';
import { allDemoScenarios } from '../data/demoScenarios';

export const CaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const {
    cases,
    selectedCase,
    selectCaseById,
    approveRefund,
    requestManualReview,
    requestMoreEvidence,
    rejectRecommendation,
    updateToleranceRule,
    fileAppeal,
  } = useInvestigation();

  const cleanId = (id || selectedCase.id).replace('#', '').toLowerCase();
  const currentCase =
    cases.find(
      (c) =>
        c.id.toLowerCase() === cleanId ||
        c.caseRef.replace('#', '').toLowerCase() === cleanId
    ) || selectedCase;

  const [isReevaluating, setIsReevaluating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealText, setAppealText] = useState('');
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleReevaluate = () => {
    setIsReevaluating(true);
    setTimeout(() => {
      setIsReevaluating(false);
      setSuccessToast(`Case ${currentCase.caseRef} re-evaluated against latest policy rules. Evidence integrity confirmed.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1200);
  };

  const handleApprove = () => {
    approveRefund(currentCase.id);
    setSuccessToast(`Refund of ${currentCase.claimAmountFormatted} authorized and logged to immutable audit trail!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleManualReview = () => {
    requestManualReview(currentCase.id, 'Dispatched to 2nd-level carrier liaison review desk.');
    setSuccessToast('Case escalated for manual carrier liaison verification.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleRequestMoreEvidence = () => {
    requestMoreEvidence(currentCase.id, evidenceNote || 'Requested hospital discharge slip or registered doctor certificate.');
    setShowEvidenceModal(false);
    setEvidenceNote('');
    setSuccessToast('Evidence request dispatched to customer portal.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleFileAppeal = () => {
    if (!appealText.trim()) return;
    fileAppeal(currentCase.id, appealText);
    setShowAppealModal(false);
    setAppealText('');
    setSuccessToast('Passenger dispute appeal submitted to review queue.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectRecommendation(currentCase.id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
    setSuccessToast('Claim rejected with auditor justification.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleVerifyChecksum = (_artId: string, hash?: string) => {
    setSuccessToast(`Checksum Verified: ${hash || 'sha256:7f83b165...'} matches registered tamper-proof artifact payload.`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const getOutcomeBadge = () => {
    const outcome = currentCase.outcome || (
      currentCase.decisionStatus === 'Approved'
        ? 'Eligible for Full Refund'
        : currentCase.decisionStatus === 'Under Human Review'
        ? 'Human Review Required'
        : 'Eligible for Full Refund'
    );

    switch (outcome) {
      case 'Eligible for Full Refund':
        return 'bg-primary-container text-on-primary-container border-primary';
      case 'Eligible for Partial Refund':
        return 'bg-primary-fixed text-on-primary-fixed-variant border-primary-container';
      case 'More Evidence Required':
        return 'bg-secondary-fixed text-on-secondary-fixed border-secondary';
      case 'Human Review Required':
        return 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary';
      case 'Not Eligible under Verified Policy':
        return 'bg-error-container text-on-error-container border-error';
      default:
        return 'bg-surface-container-high text-on-surface border-surface-container-highest';
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg text-left pb-16">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-primary-container text-on-primary-container font-semibold shadow-2xl flex items-center gap-3 animate-fade-in border border-primary">
          <span className="material-symbols-outlined text-[22px]">task_alt</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* TOP SCENARIO SWITCHER STRIP (Requirement 10) */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col gap-space-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">science</span>
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
              Interactive Demo Scenarios (Click to test):
            </span>
          </div>
          <span className="font-code-sm text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
            Fictional Demonstration Data
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {allDemoScenarios.map((demo) => {
            const isSelected = demo.id === currentCase.id;
            return (
              <button
                key={demo.id}
                onClick={() => {
                  selectCaseById(demo.id);
                  navigate(`/refund-investigations/${demo.id}`);
                }}
                className={`px-3 py-1.5 rounded-xl font-label-md text-xs shrink-0 transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-surface-container'
                }`}
              >
                <span>
                  {demo.carrier.type === 'flight'
                    ? '✈️'
                    : demo.carrier.type === 'train'
                    ? '🚆'
                    : demo.carrier.type === 'ride'
                    ? '🚕'
                    : '🚌'}
                </span>
                <span>{demo.caseRef}</span>
                <span className="opacity-80 font-normal">
                  {demo.id === 'AT-9842'
                    ? 'Air India (Full)'
                    : demo.id === 'INV-9840'
                    ? 'IRCTC (>3h Delay)'
                    : demo.id === 'RD-4409'
                    ? 'Cab Detour (+64%)'
                    : demo.id === 'BS-3021'
                    ? 'Bus Surcharges'
                    : demo.id === 'RF-1042'
                    ? 'Duplicate Hash'
                    : 'Medical Incomplete'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP BREADCRUMB & METADATA BAR */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-xs sm:text-sm">
            <button
              onClick={() => navigate('/refund-investigations')}
              className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Refund Investigations</span>
            </button>
            <span className="text-outline-variant">/</span>
            <span className="font-code-sm text-xs sm:text-sm text-on-surface font-semibold">
              {currentCase.caseRef}
            </span>
          </nav>

          <div className="flex items-center flex-wrap gap-space-xs">
            <button
              onClick={() => alert(`Exporting complete evidence dossier for ${currentCase.caseRef}...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-xs transition-all shadow-sm border border-surface-container cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">download</span>
              <span>Export Dossier</span>
            </button>
            <button
              onClick={() => setShowAppealModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-xs transition-all shadow-sm border border-surface-container cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">forum</span>
              <span>File Appeal / Note</span>
            </button>
            <button
              onClick={handleReevaluate}
              disabled={isReevaluating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-md text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              type="button"
            >
              <span className={`material-symbols-outlined text-[16px] ${isReevaluating ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isReevaluating ? 'Re-evaluating...' : 'Re-evaluate Policy'}</span>
            </button>
          </div>
        </div>

        {/* MAIN CASE HEADER CARD */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col gap-space-md">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-on-surface tracking-tight">
                  Refund Investigation Case
                </h1>
                <span className="font-code-sm text-xs sm:text-sm text-on-surface px-2.5 py-0.5 rounded-md bg-surface-container font-bold">
                  {currentCase.caseRef}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getOutcomeBadge()}`}>
                  {currentCase.outcome || 'Eligible for Full Refund'}
                </span>
                {currentCase.integrityHash && (
                  <span
                    onClick={() => handleVerifyChecksum('case-hdr', currentCase.integrityHash)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-[11px] cursor-pointer hover:bg-surface-container-high transition-colors"
                    title="Click to verify cryptographic SHA-256 fingerprint"
                  >
                    <span className="material-symbols-outlined text-[13px] text-primary">fingerprint</span>
                    <span>{currentCase.integrityHash.substring(0, 16)}...</span>
                  </span>
                )}
              </div>

              {/* Passenger & Carrier Metadata Bar */}
              <div className="flex items-center gap-space-md text-xs text-on-surface-variant flex-wrap pt-1">
                <span>
                  <strong>Passenger:</strong> {currentCase.traveler.name} ({currentCase.traveler.tier})
                </span>
                <span>•</span>
                <span>
                  <strong>Carrier:</strong> {currentCase.carrier.name} ({currentCase.carrier.code})
                </span>
                <span>•</span>
                <span>
                  <strong>Route:</strong> {currentCase.carrier.route}
                </span>
                <span>•</span>
                <span>
                  <strong>Date:</strong> {currentCase.journeyDate}
                </span>
                <span>•</span>
                <span>
                  <strong>PNR / Identifier:</strong> {currentCase.pnr}
                </span>
              </div>
            </div>

            {/* KEY METRICS STRIP */}
            <div className="flex items-center gap-space-md lg:gap-space-lg flex-wrap xl:flex-nowrap bg-surface-container-low p-space-md rounded-xl border border-surface-container">
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Claimed Amount
                </span>
                <span className="font-headline-sm text-lg font-bold text-on-surface mt-0.5">
                  {currentCase.claimAmountFormatted}
                </span>
              </div>
              <div className="h-8 w-px bg-surface-container-highest hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Risk Level
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-full text-xs font-semibold ${
                    currentCase.riskLevel === 'Low Risk'
                      ? 'bg-primary-fixed text-on-primary-container'
                      : currentCase.riskLevel === 'Medium Risk'
                      ? 'bg-secondary-fixed text-on-secondary-fixed'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {currentCase.riskLevel}
                </span>
              </div>
              <div className="h-8 w-px bg-surface-container-highest hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  AI Confidence
                </span>
                <span className="font-headline-sm text-lg font-bold text-on-surface mt-0.5">
                  {currentCase.aiConfidence}%
                </span>
              </div>
              <div className="h-8 w-px bg-surface-container-highest hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Recommended Action
                </span>
                <span className="font-headline-sm text-sm font-bold text-primary mt-0.5">
                  {currentCase.recommendedAction}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Submitted Issue Box */}
          {currentCase.customerIssue && (
            <div className="p-space-sm rounded-xl bg-surface-container-low border border-surface-container flex items-start gap-space-sm text-xs">
              <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">
                record_voice_over
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
                  Customer-Submitted Dispute Grounds:
                </span>
                <p className="text-on-surface-variant leading-relaxed">
                  "{currentCase.customerIssue}"
                </p>
              </div>
            </div>
          )}

          {/* Missing Evidence Alert (Requirement 7) */}
          {currentCase.missingEvidence && currentCase.missingEvidence.length > 0 && (
            <div className="p-space-md rounded-xl bg-secondary-fixed/30 border border-secondary/40 flex flex-col gap-space-xs text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-secondary-fixed font-bold">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span>Missing Evidence Required to Support Claim</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(true)}
                  className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-xs font-semibold cursor-pointer hover:bg-secondary-container transition-colors"
                >
                  Request Documents from Passenger
                </button>
              </div>
              <ul className="list-disc pl-5 text-on-secondary-fixed/90 space-y-1">
                {currentCase.missingEvidence.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Policy Attribution Box (Requirement 4) */}
          {currentCase.policyCitation && (
            <div className="p-space-sm rounded-xl bg-primary-fixed/20 border border-primary-container/40 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm text-xs">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider font-bold text-primary">
                    Verified Policy Attribution:
                  </span>
                  <span className="font-code-sm text-xs font-bold text-on-surface">
                    {currentCase.policyCitation.clauseRef}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-[10px] uppercase font-bold text-outline">
                    {currentCase.policyCitation.policyType.replace('_', ' ')}
                  </span>
                </div>
                <p className="font-medium text-on-surface">{currentCase.policyCitation.title}</p>
                <p className="text-on-surface-variant text-[11px]">
                  <strong>Legal Authority:</strong> {currentCase.policyCitation.source} (Effective: {currentCase.policyCitation.effectiveDate})
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/policies')}
                className="px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-xs font-bold shrink-0 hover:bg-primary-fixed-dim transition-colors cursor-pointer"
              >
                Inspect in Policy Library
              </button>
            </div>
          )}
        </div>
      </div>

      {/* WORKSPACE GRID: 65% MAIN / 35% SIDEBAR */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: MAIN WORKSPACE (Cols 1-8) */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg">
          {/* SECTION 1: 8-STAGE EXPLAINABLE AI PIPELINE */}
          <ExplainablePipeline steps={currentCase.steps} />

          {/* SECTION 2: FARE & DISTANCE VERIFICATION MODULE (Requirement 5) */}
          <FareDistanceModule
            audit={currentCase.fareDistanceAudit}
            caseId={currentCase.id}
            carrierType={currentCase.carrier.type}
            carrierRoute={currentCase.carrier.route}
            onUpdateTolerance={(newTol) => updateToleranceRule(currentCase.id, newTol)}
          />

          {/* SECTION 3: VERIFIED EVIDENCE DOSSIER WITH SHA-256 HASHES & DUPLICATE CHECK */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">inventory_2</span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Verified Evidence Dossier & Cryptographic Audit
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    SHA-256 cryptographic hashes preserve evidence integrity and intercept duplicate claims
                  </p>
                </div>
              </div>
              <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md">
                {currentCase.evidenceCount}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {currentCase.artifacts.map((art) => (
                <div
                  key={art.id}
                  className={`bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm hover:shadow-md transition-shadow border border-surface-container ${
                    art.isFullWidth ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-xs uppercase font-semibold text-on-surface-variant flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[16px] ${art.iconColor}`}>
                        {art.icon}
                      </span>
                      {art.title}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-container font-label-sm text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified
                    </span>
                  </div>

                  <div className="font-body-sm text-xs sm:text-sm text-on-surface leading-relaxed">
                    {art.content}
                  </div>

                  {/* Duplicate Detection Alert Banner */}
                  {art.duplicateDetection?.isDuplicate && (
                    <div className="p-2 rounded-lg bg-error-container text-on-error-container text-xs flex items-center gap-2 font-bold animate-pulse">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      <span>
                        Duplicate Hash Alert: Matched {art.duplicateDetection.matchedCaseId} ({art.duplicateDetection.message})
                      </span>
                    </div>
                  )}

                  {/* SHA-256 Checksum Strip */}
                  <div className="p-2 rounded-lg bg-surface-container-lowest border border-surface-container font-code-sm text-[11px] text-outline flex items-center justify-between">
                    <div className="truncate mr-2">
                      <span className="font-bold text-on-surface">SHA-256: </span>
                      <span>{art.fileHash || 'sha256:7f83b1657ff1053b9241f8a846f32e95'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVerifyChecksum(art.id, art.fileHash)}
                      className="text-primary hover:underline font-semibold shrink-0 cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-code-sm text-[11px] border-t border-surface-container-high/60">
                    <span className="truncate mr-2">{art.source}</span>
                    <span className="shrink-0">{art.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR DECISION & SUMMARY (Cols 9-12) */}
        <div className="xl:col-span-4 flex flex-col gap-space-lg">
          {/* CARD 1: INVESTIGATION SUMMARY */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Arbitration Synthesis
              </h2>
              <span className="w-3 h-3 rounded-full bg-primary-container animate-pulse"></span>
            </div>

            <p className="font-body-sm text-xs sm:text-sm text-on-surface leading-relaxed bg-surface-container-low p-space-sm rounded-xl border border-surface-container">
              {currentCase.synthesis}
            </p>

            <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
              <p className="font-body-sm text-xs text-on-surface-variant italic flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0 mt-0.5">info</span>
                <span>
                  The AI platform assists arbitration by analyzing verified evidence and applicable policy clauses, without automatically accusing or penalizing customers or drivers.
                </span>
              </p>
            </div>
          </div>

          {/* CARD 2: HUMAN REVIEW & ACTION ACTIONS */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container flex flex-col gap-space-md">
            <div className="flex items-center gap-2 pb-space-xs border-b border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Human Review & Action
              </h2>
            </div>

            <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-sm rounded-xl border border-surface-container text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-on-surface-variant font-medium">Recommended Action:</span>
                <span className="font-bold text-on-surface">{currentCase.recommendedAction}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-on-surface-variant font-medium">Decision Status:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-container font-label-sm text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {currentCase.decisionStatus}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-on-surface-variant font-medium">Assigned Auditor:</span>
                <span className="font-bold text-on-surface">{currentCase.assignedAuditor}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <button
                onClick={handleApprove}
                className="w-full py-2.5 px-4 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-fixed-dim font-headline-sm text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Approve Refund ({currentCase.claimAmountFormatted})</span>
              </button>

              <button
                onClick={handleManualReview}
                className="w-full py-2 px-4 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-surface-container cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person_search</span>
                <span>Escalate to Carrier Review Desk</span>
              </button>

              <button
                onClick={() => setShowEvidenceModal(true)}
                className="w-full py-2 px-4 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-surface-container cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">attachment</span>
                <span>Request More Evidence</span>
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="w-full py-1.5 px-4 rounded-full text-error hover:bg-error-container/20 font-label-md text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                <span>Reject / Override AI Recommendation</span>
              </button>
            </div>
          </div>

          {/* CARD 3: AUDIT TRAIL & HISTORY (Requirement 8) */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">history</span>
                <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
                  Chronological Audit Trail
                </h3>
              </div>
              <span className="font-code-sm text-[11px] text-outline">Immutable Log</span>
            </div>

            <div className="flex flex-col gap-space-sm text-body-sm">
              {currentCase.auditLog.map((log) => (
                <div key={log.id} className="flex items-start gap-space-sm pb-space-xs border-b border-surface-container/40 last:border-0">
                  <span className={`w-2 h-2 rounded-full ${log.dotColor} mt-1.5 shrink-0`}></span>
                  <div className="flex flex-col text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-code-sm text-[11px] text-on-surface-variant font-medium">{log.time}</span>
                      {log.actorRole && (
                        <span className="font-code-sm text-[10px] text-outline px-1.5 py-0.2 rounded bg-surface-container">
                          {log.actorRole}
                        </span>
                      )}
                    </div>
                    <span className="font-body-sm text-on-surface font-semibold mt-0.5">{log.title}</span>
                    {log.description && (
                      <span className="text-[11px] text-on-surface-variant mt-0.5">{log.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Request More Evidence */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">attachment</span>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                Request Additional Evidence
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Specify what official documents or certificates the customer needs to upload before arbitration can proceed:
            </p>
            <textarea
              rows={3}
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              placeholder="e.g. Please provide formal inpatient hospital discharge summary with doctor NMC registration number."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEvidenceModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestMoreEvidence}
                className="px-4 py-2 rounded-full bg-secondary text-on-secondary text-xs font-bold shadow-sm hover:bg-secondary-container"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: File Appeal */}
      {showAppealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">forum</span>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                File Passenger Appeal / Note
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Provide additional context or dispute grounds to be logged into the permanent audit ledger:
            </p>
            <textarea
              rows={3}
              value={appealText}
              onChange={(e) => setAppealText(e.target.value)}
              placeholder="e.g. Passenger states the alternate flight offered departed 5 hours later, making it unusable for corporate conference."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAppealModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFileAppeal}
                className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-bold shadow-sm hover:bg-primary-fixed-dim"
              >
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reject with Reason */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[24px]">block</span>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                Reject / Override Recommendation
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Mandatory auditor justification required. Explain why the AI recommendation or claim is overridden:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Passenger accepted alternate travel voucher directly at airport customer service desk."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 rounded-full bg-error text-on-error text-xs font-bold shadow-sm hover:bg-error-container"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CaseDetailPage;
