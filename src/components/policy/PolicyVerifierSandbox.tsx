import React, { useState } from 'react';
import { TransportType } from '../../types';
import {
  verifyPolicyForClaim,
  PolicyVerificationInput,
  PolicyVerificationOutput,
} from '../../data/policyLibrary';

export const PolicyVerifierSandbox: React.FC = () => {
  const [operator, setOperator] = useState('Air India');
  const [transportType, setTransportType] = useState<TransportType>('flight');
  const [issueReason, setIssueReason] = useState('Carrier Cancellation without Alternate Offer');
  const [ticketAmount, setTicketAmount] = useState<number>(9450);
  const [delayHours, setDelayHours] = useState<number>(3.5);
  const [expectedDistanceKm, setExpectedDistanceKm] = useState<number>(24.2);
  const [actualDistanceKm, setActualDistanceKm] = useState<number>(39.8);
  const [tolerancePct, setTolerancePct] = useState<number>(10);
  const [hasMedicalCertificate, setHasMedicalCertificate] = useState<boolean>(false);
  const [hasCarrierCancellationAdvisory, setHasCarrierCancellationAdvisory] = useState<boolean>(true);
  const [isDuplicateDetected, setIsDuplicateDetected] = useState<boolean>(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisOutput, setAnalysisOutput] = useState<PolicyVerificationOutput | null>(null);

  // Quick Presets
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'flight_cancellation':
        setOperator('Air India');
        setTransportType('flight');
        setIssueReason('Carrier Cancellation without Alternate Offer');
        setTicketAmount(9450);
        setHasCarrierCancellationAdvisory(true);
        setIsDuplicateDetected(false);
        break;
      case 'train_delay':
        setOperator('Indian Railways (IRCTC)');
        setTransportType('train');
        setIssueReason('Major Train Delay (>3 Hours at Origin/Boarding Station)');
        setTicketAmount(4120);
        setDelayHours(3.7);
        setIsDuplicateDetected(false);
        break;
      case 'ride_detour':
        setOperator('Airport Cab Exec / Mobility Platform');
        setTransportType('ride');
        setIssueReason('Unjustified Route & Distance Deviation / Fare Overcharge');
        setTicketAmount(1580);
        setExpectedDistanceKm(24.2);
        setActualDistanceKm(39.8);
        setTolerancePct(10);
        setIsDuplicateDetected(false);
        break;
      case 'duplicate_fraud':
        setOperator('IndiGo Airlines');
        setTransportType('flight');
        setIssueReason('Duplicate Refund Request Across Multiple Portals / Double Dipping');
        setTicketAmount(45000);
        setIsDuplicateDetected(true);
        break;
      case 'medical_missing':
        setOperator('Vistara Airlines');
        setTransportType('flight');
        setIssueReason('Medical Emergency Inability to Fly (Passenger or Immediate Family)');
        setTicketAmount(52400);
        setHasMedicalCertificate(false);
        setIsDuplicateDetected(false);
        break;
    }
  };

  const handleRunVerification = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const input: PolicyVerificationInput = {
        operator,
        transportType,
        issueReason,
        ticketAmount,
        delayHours,
        expectedDistanceKm,
        actualDistanceKm,
        tolerancePct,
        hasMedicalCertificate,
        hasCarrierCancellationAdvisory,
        isDuplicateDetected,
      };
      const result = verifyPolicyForClaim(input);
      setAnalysisOutput(result);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-space-lg sm:p-space-xl shadow-md border border-surface-container flex flex-col gap-space-lg">
      {/* Title & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-md border-b border-surface-container">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Interactive Policy Verification Sandbox
            </h2>
          </div>
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1">
            Test and verify any travel refund scenario against verified statutory mandates, operator contracts, and distance tolerances.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-label-sm text-xs text-outline font-semibold mr-1">Load Scenario:</span>
          <button
            type="button"
            onClick={() => applyPreset('flight_cancellation')}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            ✈️ Flight Cancellation
          </button>
          <button
            type="button"
            onClick={() => applyPreset('train_delay')}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            🚆 Train &gt;3h Delay
          </button>
          <button
            type="button"
            onClick={() => applyPreset('ride_detour')}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            🚕 Ride Detour (+64%)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('duplicate_fraud')}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            ⚠️ Duplicate Hash
          </button>
          <button
            type="button"
            onClick={() => applyPreset('medical_missing')}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            🏥 Medical Waiver
          </button>
        </div>
      </div>

      {/* Input Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Operator Selection */}
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-xs text-on-surface font-semibold">
            Operator / Platform
          </label>
          <input
            type="text"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
            placeholder="e.g. Air India, IRCTC, Uber"
          />
        </div>

        {/* Transport Type */}
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-xs text-on-surface font-semibold">
            Transport Type
          </label>
          <select
            value={transportType}
            onChange={(e) => setTransportType(e.target.value as TransportType)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="flight">Flight (Air Transport)</option>
            <option value="train">Train (Rail Network)</option>
            <option value="ride">Ride / Cab (Aggregator)</option>
            <option value="bus">Intercity Bus</option>
          </select>
        </div>

        {/* Claim / Disruption Issue */}
        <div className="flex flex-col gap-1 lg:col-span-2">
          <label className="font-label-sm text-xs text-on-surface font-semibold">
            Disruption Reason / Claim Ground
          </label>
          <select
            value={issueReason}
            onChange={(e) => setIssueReason(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="Carrier Cancellation without Alternate Offer">
              Carrier Cancellation without Alternate Offer (DGCA CAR M2)
            </option>
            <option value="Major Train Delay (>3 Hours at Origin/Boarding Station)">
              Major Train Delay (&gt;3 Hours) - IRCTC TDR Rule 18
            </option>
            <option value="Unjustified Route & Distance Deviation / Fare Overcharge">
              Unjustified Route Deviation & Fare Overcharge (MoRTH Aggregator)
            </option>
            <option value="Undeclared Surcharges & Boarding Overcharges">
              Undeclared Surcharges / On-Board Fee Extraction
            </option>
            <option value="Medical Emergency Inability to Fly (Passenger or Immediate Family)">
              Medical Emergency Inability to Travel (Compassionate Waiver)
            </option>
            <option value="Duplicate Refund Request Across Multiple Portals / Double Dipping">
              Duplicate Submission / Multi-Portal Arbitrage (Anti-Fraud)
            </option>
          </select>
        </div>

        {/* Ticket Amount */}
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-xs text-on-surface font-semibold">
            Claim Amount Charged (₹)
          </label>
          <input
            type="number"
            value={ticketAmount}
            onChange={(e) => setTicketAmount(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        {/* Conditional Fields based on Transport */}
        {transportType === 'train' && (
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-xs text-on-surface font-semibold">
              Delay at Boarding (Hours)
            </label>
            <input
              type="number"
              step="0.1"
              value={delayHours}
              onChange={(e) => setDelayHours(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
        )}

        {transportType === 'ride' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface font-semibold">
                Expected Route Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={expectedDistanceKm}
                onChange={(e) => setExpectedDistanceKm(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface font-semibold">
                Actual Recorded GPS Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={actualDistanceKm}
                onChange={(e) => setActualDistanceKm(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface font-semibold">
                Operator Tolerance: {tolerancePct}%
              </label>
              <input
                type="range"
                min="5"
                max="25"
                step="5"
                value={tolerancePct}
                onChange={(e) => setTolerancePct(Number(e.target.value))}
                className="accent-primary h-2 mt-2"
              />
            </div>
          </>
        )}

        {/* Checkbox Options */}
        <div className="flex flex-col justify-end gap-2 lg:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer font-body-sm text-xs text-on-surface">
            <input
              type="checkbox"
              checked={hasCarrierCancellationAdvisory}
              onChange={(e) => setHasCarrierCancellationAdvisory(e.target.checked)}
              className="rounded accent-primary w-4 h-4"
            />
            <span>Carrier advisory / dispatch notice available</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-body-sm text-xs text-on-surface">
            <input
              type="checkbox"
              checked={hasMedicalCertificate}
              onChange={(e) => setHasMedicalCertificate(e.target.checked)}
              className="rounded accent-primary w-4 h-4"
            />
            <span>Certified hospital admission certificate attached</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-body-sm text-xs text-on-surface">
            <input
              type="checkbox"
              checked={isDuplicateDetected}
              onChange={(e) => setIsDuplicateDetected(e.target.checked)}
              className="rounded accent-error w-4 h-4"
            />
            <span className="text-error font-medium">
              Simulate duplicate SHA-256 evidence collision
            </span>
          </label>
        </div>
      </div>

      {/* Verification Execution Button */}
      <div className="flex items-center justify-between pt-space-xs border-t border-surface-container">
        <span className="text-xs text-on-surface-variant font-code-sm">
          Policy Intelligence Engine • Deterministic rule arbitration
        </span>
        <button
          type="button"
          onClick={handleRunVerification}
          disabled={isAnalyzing}
          className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-sm font-bold shadow-md hover:bg-primary-fixed-dim transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[18px] ${isAnalyzing ? 'animate-spin' : ''}`}>
            {isAnalyzing ? 'sync' : 'gavel'}
          </span>
          <span>{isAnalyzing ? 'Executing Verification...' : 'Run Policy Verification'}</span>
        </button>
      </div>

      {/* Output Results Dossier */}
      {analysisOutput && (
        <div className="mt-space-md p-space-lg rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col gap-space-md animate-fade-in">
          {/* Status Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                Verification Determination:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  analysisOutput.eligibilityStatus === 'Eligible for Full Refund'
                    ? 'bg-primary-container text-on-primary-container'
                    : analysisOutput.eligibilityStatus === 'Eligible for Partial Refund'
                    ? 'bg-primary-fixed text-on-primary-container'
                    : analysisOutput.eligibilityStatus === 'More Evidence Required'
                    ? 'bg-surface-container-high text-on-surface'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                {analysisOutput.eligibilityStatus}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-label-sm text-xs">
                <span className="text-outline">Risk Evaluation:</span>
                <span className="font-bold text-on-surface">{analysisOutput.riskEvaluation.riskLevel}</span>
              </div>
              <div className="flex items-center gap-1 font-headline-sm text-base sm:text-lg font-bold text-primary">
                <span>Eligible: ₹{analysisOutput.calculatedAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Exact Citation & Legal Basis */}
          <div className="p-space-sm rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
                Applicable Policy Clause & Jurisdiction
              </span>
              <span className="font-code-sm text-xs text-primary font-semibold">
                {analysisOutput.matchedRule?.clauseRef}
              </span>
            </div>
            <p className="font-headline-sm text-sm font-bold text-on-surface">
              {analysisOutput.matchedRule?.title}
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant">
              <strong>Source:</strong> {analysisOutput.matchedRule?.sourceUrlOrDocument}
            </p>
          </div>

          {/* Transparent Calculation Explanation */}
          <div className="p-space-sm rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-1">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
              Transparent Calculation & Rule Explanation
            </span>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface leading-relaxed">
              {analysisOutput.calculationExplanation}
            </p>
          </div>

          {/* Conditions Checked Table */}
          <div>
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold block mb-1.5">
              Policy Conditions Checked ({analysisOutput.conditionsChecked.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {analysisOutput.conditionsChecked.map((chk, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container flex items-start gap-2 text-xs"
                >
                  <span
                    className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${
                      chk.met ? 'text-primary' : 'text-error'
                    }`}
                  >
                    {chk.met ? 'check_circle' : 'cancel'}
                  </span>
                  <div>
                    <span className="font-semibold text-on-surface block">{chk.condition}</span>
                    <span className="text-on-surface-variant text-[11px]">{chk.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Evidence Alerts */}
          {analysisOutput.missingEvidence.length > 0 && (
            <div className="p-space-sm rounded-xl bg-surface-container-highest/60 border border-outline-variant flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-1.5 text-on-surface font-bold">
                <span className="material-symbols-outlined text-outline text-[16px]">info</span>
                <span>Missing Information Required Before Final Approval:</span>
              </div>
              <ul className="list-disc pl-5 text-on-surface-variant space-y-0.5">
                {analysisOutput.missingEvidence.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
