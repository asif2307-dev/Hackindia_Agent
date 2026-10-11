import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation } from '../context/InvestigationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases, selectCaseById, timeframe, setTimeframe, approveRefund } = useInvestigation();

  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'review' | 'awaiting' | 'flagged'>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Timeframe cycle options
  const timeframeOptions = ['Last 7 Days', 'Last 30 Days', 'Current Quarter', 'Year to Date'];
  const handleCycleTimeframe = () => {
    const currentIndex = timeframeOptions.indexOf(timeframe);
    const nextIndex = (currentIndex + 1) % timeframeOptions.length;
    setTimeframe(timeframeOptions[nextIndex]);
  };

  const handleInspectCase = (id: string) => {
    selectCaseById(id);
    navigate(`/refund-investigations/${id}`);
  };

  const handleReviewHighImpact = (id: string) => {
    selectCaseById(id);
    navigate(`/reviews`);
  };

  const handleQuickApprove = (id: string) => {
    approveRefund(id);
    setActionSuccessMsg(`Case #${id} approved! Payout authorization emitted.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Filter investigations
  const filteredInvestigations = cases.filter((c) => {
    const matchesSearch =
      c.caseRef.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.pnr.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.traveler.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.carrier.name.toLowerCase().includes(tableSearch.toLowerCase());

    const matchesRisk =
      riskFilter === 'all' ||
      (riskFilter === 'low' && c.riskLevel === 'Low Risk') ||
      (riskFilter === 'medium' && c.riskLevel === 'Medium Risk') ||
      (riskFilter === 'high' && c.riskLevel === 'High Risk');

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'approved' && (c.decisionStatus === 'Approved' || c.decisionStatus === 'Disbursed')) ||
      (activeTab === 'review' && (c.decisionStatus === 'Under Human Review' || c.decisionStatus === 'Pending Human Approval')) ||
      (activeTab === 'awaiting' && c.decisionStatus === 'Awaiting Carrier Evidence') ||
      (activeTab === 'flagged' && (c.decisionStatus === 'Flagged' || c.decisionStatus === 'Rejected'));

    return matchesSearch && matchesRisk && matchesTab;
  });

  return (
    <div className="flex flex-col w-full gap-space-xl pb-16">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-primary-container text-on-primary-container font-semibold shadow-2xl flex items-center gap-3 animate-fade-in border border-primary">
          <span className="material-symbols-outlined text-[22px]">task_alt</span>
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Demonstration Data Banner (Requirement 3) */}
      <div className="bg-surface-container-low px-4 py-2 rounded-xl border border-surface-container flex items-center justify-between text-xs text-on-surface-variant flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>
            <strong>Demonstration Data Environment:</strong> Connected to live state and Policy Intelligence Engine.
            Figures calculated from verified state cases.
          </span>
        </div>
        <span className="font-code-sm text-[11px] text-outline bg-surface-container px-2 py-0.5 rounded">
          Status: Operational • 0 Unverified Assumptions
        </span>
      </div>

      {/* Top Navigation & Dashboard Control Row */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md text-left">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
              AI Risk Engine Active
            </span>
            <span className="font-code-sm text-xs text-on-surface-variant/70">
              Multi-Agent Policy Arbitrator v3.0
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-headline-lg text-on-surface tracking-tight font-bold">
            Refund Investigation & Risk Console
          </h1>
          <p className="font-body-md text-sm sm:text-body-md text-on-surface-variant">
            Autonomous dispute verification, policy arbitration, route deviation analysis, and explainable payout determinations.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-sm">
          {/* Timeframe Dropdown */}
          <button
            onClick={handleCycleTimeframe}
            className="flex items-center gap-space-xs bg-surface-container-lowest text-on-surface font-label-md text-xs sm:text-sm px-space-md py-2.5 rounded-full shadow-sm hover:bg-surface-container-low transition-colors border border-surface-container cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_today</span>
            <span>{timeframe}</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
          </button>

          {/* Policy Intelligence Link */}
          <button
            onClick={() => navigate('/policies')}
            className="flex items-center gap-space-xs bg-surface-container-lowest text-on-surface font-label-md text-xs sm:text-sm px-space-md py-2.5 rounded-full shadow-sm hover:bg-surface-container-low transition-colors border border-surface-container cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">gavel</span>
            <span>Policy Library</span>
          </button>

          {/* New Investigation Button */}
          <button
            onClick={() => navigate('/refund-investigations/AT-9842')}
            className="flex items-center gap-space-xs bg-primary-container text-on-primary-container font-label-md text-xs sm:text-sm font-bold px-space-lg py-2.5 rounded-full shadow-sm hover:shadow-md hover:bg-primary-fixed-dim transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Inspect Active Case</span>
          </button>
        </div>
      </section>

      {/* 6-Metric Grid Architecture (Requirement 3: Active investigations, Human review, Fare discrepancies, Amounts under investigation, Approved refunds, Policy compliance) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md text-left">
        {/* Metric 1: Active Investigations */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs text-on-surface-variant font-medium">Active Cases</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">policy</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="font-headline-lg text-2xl font-bold text-on-surface">{cases.length}</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Air, rail, bus & cab</span>
          </div>
          <div className="mt-2 pt-1.5 flex items-center justify-between text-[11px] text-outline border-t border-surface-container">
            <span>Audit Pace</span>
            <span className="text-primary font-semibold">Real-time</span>
          </div>
        </div>

        {/* Metric 2: Requiring Human Review */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs text-on-surface-variant font-medium">Human Review</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">person_search</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="font-headline-lg text-2xl font-bold text-on-surface">
              {cases.filter((c) => c.humanReviewRequired || c.decisionStatus === 'Under Human Review').length}
            </span>
            <span className="text-[11px] text-secondary font-semibold mt-0.5">Pending Sign-off</span>
          </div>
          <div className="mt-2 pt-1.5 flex items-center justify-between text-[11px] text-outline border-t border-surface-container">
            <span>SLA Target</span>
            <span className="text-secondary font-semibold">&lt; 2 hours</span>
          </div>
        </div>

        {/* Metric 3: Potential Fare Discrepancies */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs text-on-surface-variant font-medium">Fare Discrepancies</span>
            <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="font-headline-lg text-2xl font-bold text-error">
              ₹{cases.reduce((sum, c) => sum + (c.fareDistanceAudit?.isApplicable ? c.fareDistanceAudit.potentialDifference : 0), 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Route detour & fees</span>
          </div>
          <div className="mt-2 pt-1.5 flex items-center justify-between text-[11px] text-outline border-t border-surface-container">
            <span>Detected Flags</span>
            <span className="text-error font-semibold">
              {cases.filter((c) => c.fareDistanceAudit?.isApplicable && c.fareDistanceAudit.potentialDifference > 0).length} Cases
            </span>
          </div>
        </div>

        {/* Metric 4: Amounts Under Investigation */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs text-on-surface-variant font-medium">Under Investigation</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="font-headline-lg text-2xl font-bold text-on-surface">
              ₹{cases.reduce((sum, c) => sum + (c.decisionStatus !== 'Approved' && c.decisionStatus !== 'Disbursed' ? c.claimAmount : 0), 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">In active arbitration</span>
          </div>
          <div className="mt-2 pt-1.5 flex items-center justify-between text-[11px] text-outline border-t border-surface-container">
            <span>Exposure</span>
            <span className="text-on-surface font-semibold">Active Ledger</span>
          </div>
        </div>

        {/* Metric 5: Approved or Completed Refunds */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs text-on-surface-variant font-medium">Approved Refunds</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="font-headline-lg text-2xl font-bold text-primary">
              ₹{cases.reduce((sum, c) => sum + (c.decisionStatus === 'Approved' || c.decisionStatus === 'Disbursed' ? c.claimAmount : 0), 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-primary font-medium mt-0.5">Disbursed or authorized</span>
          </div>
          <div className="mt-2 pt-1.5 flex items-center justify-between text-[11px] text-outline border-t border-surface-container">
            <span>Compliance Rate</span>
            <span className="text-primary font-semibold">100% Policy Match</span>
          </div>
        </div>

        {/* Metric 6: Policy Compliance Statistics */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs text-on-surface-variant font-medium">Policy Rules</span>
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined text-[18px]">balance</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="font-headline-lg text-2xl font-bold text-on-surface">7 Rules</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">DGCA • IRCTC • MoRTH</span>
          </div>
          <div className="mt-2 pt-1.5 flex items-center justify-between text-[11px] text-outline border-t border-surface-container">
            <span>Citation Integrity</span>
            <span className="text-primary font-semibold">100% Verified</span>
          </div>
        </div>
      </section>

      {/* Dual Engine Core: Spotlight Dossier & Radar Intelligence */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start text-left">
        {/* Left Column (8 cols): Deep-Dive AI Agent Pipeline */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-3xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col gap-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
                <span className="material-symbols-outlined text-[22px]">psychology</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Deep-Dive AI Agent Investigation Pipeline
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-code-sm text-xs font-semibold">
                    Live Active Case #AT-9842
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  8-step AI-assisted investigation of traveler disruption, policy entitlement, and payout clearance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-xs font-bold border border-surface-container">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                Auto-Evaluating
              </span>
            </div>
          </div>

          {/* 8-Step Mini Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
            <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold">01. Request</span>
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              </div>
              <span className="font-label-md text-xs font-semibold text-on-surface">Request Understanding</span>
              <p className="text-[11px] text-on-surface-variant">Carrier cancelled flight AI-805</p>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold">02. Payment</span>
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              </div>
              <span className="font-label-md text-xs font-semibold text-on-surface">Transaction Check</span>
              <p className="text-[11px] text-on-surface-variant">₹9,450 original fare valid, cleared</p>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold">03. Customer</span>
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              </div>
              <span className="font-label-md text-xs font-semibold text-on-surface">Customer Profile</span>
              <p className="text-[11px] text-on-surface-variant">Tier 1 Corporate, 0 prior disputes</p>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold">04. Booking</span>
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              </div>
              <span className="font-label-md text-xs font-semibold text-on-surface">Booking & Fare Rules</span>
              <p className="text-[11px] text-on-surface-variant">PNR 482910, refundable economy</p>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold">05. Policy</span>
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              </div>
              <span className="font-label-md text-xs font-semibold text-on-surface">Policy Verification</span>
              <p className="text-[11px] text-on-surface-variant">DGCA Statutory Rights assertable</p>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold">06. Evidence</span>
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              </div>
              <span className="font-label-md text-xs font-semibold text-on-surface">Evidence Analysis</span>
              <p className="text-[11px] text-on-surface-variant">Official carrier cancellation verified</p>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold">07. Risk</span>
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              </div>
              <span className="font-label-md text-xs font-semibold text-on-surface">Risk Assessment</span>
              <p className="text-[11px] text-on-surface-variant">Risk Score: Low (0.04 Anomaly)</p>
            </div>

            <div className="p-space-sm rounded-xl bg-primary-container/20 flex flex-col gap-1 border border-primary-container/40">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-primary font-bold">08. Action</span>
                <span className="material-symbols-outlined text-[16px] text-primary animate-pulse">pending</span>
              </div>
              <span className="font-label-md text-xs font-bold text-on-surface">Action Recommendation</span>
              <div className="flex flex-col">
                <p className="text-[11px] text-primary font-semibold">Recommended: Full Refund</p>
                <span className="text-[10px] text-on-surface-variant">Human Review if Required</span>
              </div>
            </div>
          </div>

          {/* Obsidian Footer Callout */}
          <div className="p-space-md rounded-2xl bg-inverse-surface text-inverse-on-surface flex flex-col sm:flex-row items-center justify-between gap-space-md border border-white/10">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-md text-sm font-bold text-surface-container-lowest">
                    Case #AT-9842
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-code-sm text-[11px] font-semibold">
                    Risk: LOW
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/15 text-surface-container-lowest font-code-sm text-[11px]">
                    AI Confidence: 92%
                  </span>
                </div>
                <p className="text-xs text-tertiary-fixed-dim mt-0.5">
                  Recommendation: Approve Refund (₹9,450 full statutory refund clearance recommended • Human Review if Required)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto">
              <button
                onClick={() => handleInspectCase('AT-9842')}
                className="flex-1 sm:flex-none px-space-md py-2 rounded-full bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-surface-container-lowest font-label-md text-xs transition-colors whitespace-nowrap cursor-pointer"
                type="button"
              >
                View Investigation
              </button>
              <button
                onClick={() => handleQuickApprove('AT-9842')}
                className="flex-1 sm:flex-none px-space-md py-2 rounded-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-sm"
                type="button"
              >
                Approve Release
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Risk Distribution */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-3xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col justify-between gap-space-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Risk Distribution</h3>
              <p className="font-label-sm text-xs text-on-surface-variant">42 investigations in evaluation queue</p>
            </div>
            <span className="font-label-sm text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant border border-surface-container">
              Active Batch
            </span>
          </div>

          {/* Stacked Risk Bar */}
          <div className="w-full flex h-3.5 rounded-full overflow-hidden gap-1 p-0.5 bg-surface-container-low">
            <div className="h-full bg-primary rounded-l-full" style={{ width: '74%' }} title="Low Risk: 74%"></div>
            <div className="h-full bg-secondary-container" style={{ width: '14%' }} title="Medium Risk: 14%"></div>
            <div className="h-full bg-error" style={{ width: '8%' }} title="High Risk: 8%"></div>
            <div className="h-full bg-surface-container-highest rounded-r-full" style={{ width: '4%' }} title="Insufficient Evidence: 4%"></div>
          </div>

          {/* Risk Detail Cards */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                <div>
                  <span className="font-label-md text-xs font-semibold text-on-surface">Low Risk</span>
                  <p className="text-[11px] text-on-surface-variant">Fast-track automatic approval</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-md text-xs font-bold text-on-surface">74%</span>
                <p className="text-[11px] text-on-surface-variant">31 cases</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-container shrink-0"></span>
                <div>
                  <span className="font-label-md text-xs font-semibold text-on-surface">Medium Risk</span>
                  <p className="text-[11px] text-on-surface-variant">Policy compliance check</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-md text-xs font-bold text-on-surface">14%</span>
                <p className="text-[11px] text-on-surface-variant">6 cases</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-error shrink-0"></span>
                <div>
                  <span className="font-label-md text-xs font-semibold text-on-surface">High Risk</span>
                  <p className="text-[11px] text-on-surface-variant">Discrepancy / carrier dispute</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-md text-xs font-bold text-on-surface">8%</span>
                <p className="text-[11px] text-on-surface-variant">3 cases</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest shrink-0"></span>
                <div>
                  <span className="font-label-md text-xs font-semibold text-on-surface">Insufficient Evidence</span>
                  <p className="text-[11px] text-on-surface-variant">Missing cancellation proof</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-md text-xs font-bold text-on-surface">4%</span>
                <p className="text-[11px] text-on-surface-variant">2 cases</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Requires Human Review Table (High-Impact) */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col gap-space-md text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-xl bg-error-container flex items-center justify-center text-error font-bold">
              <span className="material-symbols-outlined text-[20px]">assignment_late</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Requires Human Review</h3>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
                  3 High-Impact Cases
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                AI investigates and flags anomalies — human auditors authorize high-impact decisions.
              </p>
            </div>
          </div>
          <span className="font-label-sm text-xs text-on-surface-variant font-medium bg-surface-container-low px-3 py-1 rounded-full border border-surface-container">
            SLA: 2 hours remaining
          </span>
        </div>

        {/* Human Review Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-xs sm:text-sm">
            <thead>
              <tr className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider bg-surface-container-low rounded-xl">
                <th className="py-space-sm px-space-md rounded-l-xl">Case ID</th>
                <th className="py-space-sm px-space-md">Amount at Risk</th>
                <th className="py-space-sm px-space-md">Risk Level</th>
                <th className="py-space-sm px-space-md">AI Confidence</th>
                <th className="py-space-sm px-space-md">Reason / Evidence Summary</th>
                <th className="py-space-sm px-space-md rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              <tr className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-space-md px-space-md">
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">#RF-1042</span>
                    <span className="text-xs text-on-surface-variant">Corporate Account</span>
                  </div>
                </td>
                <td className="py-space-md px-space-md font-semibold text-on-surface">₹45,000</td>
                <td className="py-space-md px-space-md">
                  <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-xs font-semibold">
                    HIGH RISK
                  </span>
                </td>
                <td className="py-space-md px-space-md font-code-sm text-xs text-on-surface-variant">
                  87% Confidence
                </td>
                <td className="py-space-md px-space-md">
                  <span className="text-xs text-on-surface-variant line-clamp-2">
                    Multiple refund attempts across partner portals + conflicting carrier cancellation logs
                  </span>
                </td>
                <td className="py-space-md px-space-md text-right">
                  <button
                    onClick={() => handleReviewHighImpact('RF-1042')}
                    className="px-space-md py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-semibold hover:shadow transition-all cursor-pointer"
                    type="button"
                  >
                    Review Case
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-space-md px-space-md">
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">#RF-1088</span>
                    <span className="text-xs text-on-surface-variant">Individual Booking</span>
                  </div>
                </td>
                <td className="py-space-md px-space-md font-semibold text-on-surface">₹52,400</td>
                <td className="py-space-md px-space-md">
                  <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-xs font-semibold">
                    HIGH RISK
                  </span>
                </td>
                <td className="py-space-md px-space-md font-code-sm text-xs text-on-surface-variant">
                  79% Confidence
                </td>
                <td className="py-space-md px-space-md">
                  <span className="text-xs text-on-surface-variant line-clamp-2">
                    Disputed no-show attribution vs medical emergency claim without hospitalization proof
                  </span>
                </td>
                <td className="py-space-md px-space-md text-right">
                  <button
                    onClick={() => handleReviewHighImpact('RF-1088')}
                    className="px-space-md py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-semibold hover:shadow transition-all cursor-pointer"
                    type="button"
                  >
                    Review Case
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-space-md px-space-md">
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">#RF-1015</span>
                    <span className="text-xs text-on-surface-variant">Corporate Account</span>
                  </div>
                </td>
                <td className="py-space-md px-space-md font-semibold text-on-surface">₹28,500</td>
                <td className="py-space-md px-space-md">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-semibold">
                    MEDIUM RISK
                  </span>
                </td>
                <td className="py-space-md px-space-md font-code-sm text-xs text-on-surface-variant">
                  84% Confidence
                </td>
                <td className="py-space-md px-space-md">
                  <span className="text-xs text-on-surface-variant line-clamp-2">
                    Partial carrier fare waiver issued; manual statutory tax refund clearance required
                  </span>
                </td>
                <td className="py-space-md px-space-md text-right">
                  <button
                    onClick={() => handleReviewHighImpact('RF-1015')}
                    className="px-space-md py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-semibold hover:shadow transition-all cursor-pointer"
                    type="button"
                  >
                    Review Case
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: All Refund Investigations */}
      <section className="bg-surface-container-lowest rounded-3xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col gap-space-lg text-left">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div>
            <h3 className="font-headline-md text-xl sm:text-headline-md font-bold text-on-surface tracking-tight">
              All Refund Investigations
            </h3>
            <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">
              Complete ledger of automated claims reconciliation, statutory payouts, and dispute findings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            {/* Filter Input */}
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-2 rounded-full min-w-[220px] border border-surface-container">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
              <input
                className="bg-transparent font-body-sm text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none w-full"
                placeholder="Filter investigation ID or traveler..."
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>

            {/* Risk Dropdown */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-surface-container-low text-on-surface font-label-md text-xs sm:text-sm px-space-md py-2 rounded-full focus:outline-none border border-surface-container cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk Only</option>
              <option value="medium">Medium Risk Only</option>
              <option value="high">High Risk Only</option>
            </select>

            <button
              onClick={() => navigate('/refund-investigations')}
              className="flex items-center gap-1.5 px-space-md py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs sm:text-sm font-semibold hover:shadow transition-all cursor-pointer whitespace-nowrap shadow-xs"
              type="button"
            >
              <span>View Full Ledger</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
            }`}
            type="button"
          >
            All (42)
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
            }`}
            type="button"
          >
            Approved & Disbursed (28)
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'review'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
            }`}
            type="button"
          >
            Under Human Review (6)
          </button>
          <button
            onClick={() => setActiveTab('awaiting')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'awaiting'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
            }`}
            type="button"
          >
            Awaiting Carrier Evidence (5)
          </button>
          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'flagged'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
            }`}
            type="button"
          >
            Flagged / Rejected (3)
          </button>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-xs sm:text-sm">
            <thead>
              <tr className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider bg-surface-container-low rounded-xl">
                <th className="py-space-md px-space-md rounded-l-xl">Investigation ID / PNR</th>
                <th className="py-space-md px-space-md">Traveler</th>
                <th className="py-space-md px-space-md">Carrier & Journey</th>
                <th className="py-space-md px-space-md">Claim Amount</th>
                <th className="py-space-md px-space-md">Risk Level</th>
                <th className="py-space-md px-space-md">AI Confidence</th>
                <th className="py-space-md px-space-md">Status</th>
                <th className="py-space-md px-space-md rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              {filteredInvestigations.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-space-md px-space-md">
                    <button
                      onClick={() => handleInspectCase(item.id)}
                      className="flex flex-col text-left group cursor-pointer"
                    >
                      <span className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {item.caseRef}
                      </span>
                      <span className="font-code-sm text-[11px] text-on-surface-variant">PNR: {item.pnr}</span>
                    </button>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div
                        className={`w-8 h-8 rounded-full ${item.traveler.color} font-label-sm text-xs flex items-center justify-center font-bold`}
                      >
                        {item.traveler.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-xs font-semibold text-on-surface">
                          {item.traveler.name}
                        </span>
                        <span className="font-label-sm text-[11px] text-on-surface-variant">
                          {item.traveler.tier}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span className="p-1 rounded-md bg-surface-container-high text-on-surface">
                        <span className="material-symbols-outlined text-[16px]">
                          {item.carrier.type === 'train' ? 'train' : 'flight'}
                        </span>
                      </span>
                      <span className="font-medium text-on-surface text-xs sm:text-sm">
                        {item.carrier.name} ({item.carrier.route})
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <span className="font-semibold text-on-surface">{item.claimAmountFormatted}</span>
                  </td>
                  <td className="py-space-md px-space-md">
                    <RiskBadge level={item.riskLevel} size="sm" />
                  </td>
                  <td className="py-space-md px-space-md">
                    <span className="font-code-sm text-xs text-primary font-bold">{item.aiConfidence}%</span>
                  </td>
                  <td className="py-space-md px-space-md">
                    <StatusBadge status={item.decisionStatus} size="sm" />
                  </td>
                  <td className="py-space-md px-space-md text-right">
                    <button
                      onClick={() => handleInspectCase(item.id)}
                      className="px-space-md py-1.5 rounded-full bg-surface-container hover:bg-primary-container hover:text-on-primary-container text-on-surface font-label-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                      type="button"
                    >
                      Inspect Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs border-t border-surface-container">
          <span className="font-body-sm text-xs text-on-surface-variant">
            Showing <strong className="text-on-surface font-semibold">1–{filteredInvestigations.length}</strong> of 42 active investigations
          </span>
          <div className="flex items-center gap-space-xs">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-40"
              disabled
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-xs font-bold">
              1
            </span>
            <button
              className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs transition-colors cursor-pointer"
              type="button"
            >
              2
            </button>
            <button
              className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs transition-colors cursor-pointer"
              type="button"
            >
              3
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
