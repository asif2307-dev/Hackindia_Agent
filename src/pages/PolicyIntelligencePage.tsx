import React, { useState } from 'react';
import { officialPolicyLibrary } from '../data/policyLibrary';
import { PolicyCard } from '../components/policy/PolicyCard';
import { PolicyVerifierSandbox } from '../components/policy/PolicyVerifierSandbox';
import { PolicyRule } from '../types';

export const PolicyIntelligencePage: React.FC = () => {
  const [policies] = useState<PolicyRule[]>(officialPolicyLibrary);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransport, setSelectedTransport] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showSandbox, setShowSandbox] = useState<boolean>(true);

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clauseRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.operatorOrPlatform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTransport =
      selectedTransport === 'all' || p.transportType === 'all' || p.transportType === selectedTransport;

    const matchesType = selectedType === 'all' || p.policyType === selectedType;

    return matchesSearch && matchesTransport && matchesType;
  });

  return (
    <div className="flex flex-col w-full gap-space-xl pb-16 text-left">
      {/* Top Header & Breadcrumbs Bar */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
              Core Differentiator
            </span>
            <span className="font-code-sm text-xs text-on-surface-variant/70">
              Regulatory Corpus & Contract Parser v3.0
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-headline-lg text-on-surface tracking-tight font-bold">
            Policy Intelligence Engine
          </h1>
          <p className="font-body-md text-sm sm:text-body-md text-on-surface-variant max-w-3xl">
            Source-backed policy library and automated legal arbitration. Explains the exact regulatory clause,
            distinguishes statutory law from contractual policies, and recalculates refund entitlements with mathematical precision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSandbox(!showSandbox)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs sm:text-sm font-bold shadow-sm hover:bg-primary-fixed-dim transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showSandbox ? 'visibility_off' : 'tune'}
            </span>
            <span>{showSandbox ? 'Hide Test Sandbox' : 'Open Verification Sandbox'}</span>
          </button>
        </div>
      </section>

      {/* METRICS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col">
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">
            Active Verified Regulations
          </span>
          <span className="font-headline-lg text-2xl font-bold text-on-surface mt-1">7 Standard Clauses</span>
          <span className="text-[11px] text-primary font-medium mt-0.5">100% Source-Backed Citations</span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col">
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">
            Statutory Legal Mandates
          </span>
          <span className="font-headline-lg text-2xl font-bold text-on-surface mt-1">DGCA, IRCTC, MoRTH</span>
          <span className="text-[11px] text-secondary font-medium mt-0.5">Binding Gazette Acts</span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col">
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">
            Distance Tolerance Rules
          </span>
          <span className="font-headline-lg text-2xl font-bold text-on-surface mt-1">Configurable 5-25%</span>
          <span className="text-[11px] text-primary font-medium mt-0.5">With Contextual Traffic Feeds</span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col">
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">
            Cryptographic Integrity
          </span>
          <span className="font-headline-lg text-2xl font-bold text-on-surface mt-1">SHA-256 Hashed</span>
          <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">Zero Arbitrage Collisions</span>
        </div>
      </div>

      {/* INTERACTIVE SANDBOX */}
      {showSandbox && <PolicyVerifierSandbox />}

      {/* POLICY LIBRARY SECTION */}
      <section className="flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-xs border-b border-surface-container">
          <div>
            <h2 className="font-headline-sm text-xl font-bold text-on-surface">
              Organized Policy Library & Regulatory Codebook
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Every policy includes official source documents, effective dates, eligibility conditions, and calculation formulas.
            </p>
          </div>
          <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
            Showing {filteredPolicies.length} of {policies.length} Rules
          </span>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col md:flex-row items-center justify-between gap-space-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clause, operator, reason..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-space-sm flex-wrap w-full md:w-auto">
            {/* Transport Filter */}
            <select
              value={selectedTransport}
              onChange={(e) => setSelectedTransport(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Transport Modes</option>
              <option value="flight">Flights (Air)</option>
              <option value="train">Trains (Rail)</option>
              <option value="ride">Rides / Cabs</option>
              <option value="bus">Intercity Buses</option>
            </select>

            {/* Policy Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Legal Categories</option>
              <option value="legal_mandate">Statutory Legal Mandates</option>
              <option value="operator_contract">Operator Contractual Policies</option>
              <option value="internal_risk_rule">Internal Risk Rules</option>
            </select>
          </div>
        </div>

        {/* Policy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {filteredPolicies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onVerifyWithPolicy={(_p: PolicyRule) => {
                setShowSandbox(true);
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
export default PolicyIntelligencePage;
