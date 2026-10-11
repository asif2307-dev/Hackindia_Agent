import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransportType } from '../../types';
import { verifyPolicyForClaim, PolicyVerificationOutput } from '../../data/policyLibrary';
import { useInvestigation } from '../../context/InvestigationContext';

export const CustomerVerificationFlow: React.FC = () => {
  const navigate = useNavigate();
  const { selectCaseById } = useInvestigation();

  // Current Active Step in the Guided Flow (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [transportType, setTransportType] = useState<TransportType>('flight');
  const [bookingRef, setBookingRef] = useState<string>('482910');
  const [selectedDemoKey, setSelectedDemoKey] = useState<string>('AT-9842');
  const [issue, setIssue] = useState<string>('Carrier Cancellation without Alternate Offer');
  const [fareAmount, setFareAmount] = useState<number>(9450);
  const [journeyDate, setJourneyDate] = useState<string>('24 Oct 2026');
  const [hasCarrierNotice, setHasCarrierNotice] = useState<boolean>(true);
  const [hasPaymentReceipt, setHasPaymentReceipt] = useState<boolean>(true);
  const [hasMedicalCertificate, setHasMedicalCertificate] = useState<boolean>(false);
  const [simulatedDuplicate, setSimulatedDuplicate] = useState<boolean>(false);

  // Verification Processing State
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<PolicyVerificationOutput | null>(null);

  // Quick Demo Auto-Fill Presets
  const handleSelectDemoCase = (preset: string) => {
    setSelectedDemoKey(preset);
    if (preset === 'AT-9842') {
      setTransportType('flight');
      setBookingRef('482910');
      setIssue('Carrier Cancellation without Alternate Offer');
      setFareAmount(9450);
      setJourneyDate('24 Oct 2026');
      setHasCarrierNotice(true);
      setHasPaymentReceipt(true);
      setHasMedicalCertificate(false);
      setSimulatedDuplicate(false);
    } else if (preset === 'INV-9840') {
      setTransportType('train');
      setBookingRef('284192');
      setIssue('Major Train Delay (>3 Hours at Origin/Boarding Station)');
      setFareAmount(4120);
      setJourneyDate('25 Oct 2026');
      setHasCarrierNotice(true);
      setHasPaymentReceipt(true);
      setHasMedicalCertificate(false);
      setSimulatedDuplicate(false);
    } else if (preset === 'RD-4409') {
      setTransportType('ride');
      setBookingRef('UBR-90214');
      setIssue('Unjustified Route & Distance Deviation / Fare Overcharge');
      setFareAmount(1580);
      setJourneyDate('26 Oct 2026');
      setHasCarrierNotice(true);
      setHasPaymentReceipt(true);
      setHasMedicalCertificate(false);
      setSimulatedDuplicate(false);
    } else if (preset === 'BS-3021') {
      setTransportType('bus');
      setBookingRef('BUS-71049');
      setIssue('Undeclared Surcharges & Boarding Overcharges');
      setFareAmount(2700);
      setJourneyDate('26 Oct 2026');
      setHasCarrierNotice(true);
      setHasPaymentReceipt(true);
      setHasMedicalCertificate(false);
      setSimulatedDuplicate(false);
    } else if (preset === 'RF-1042') {
      setTransportType('flight');
      setBookingRef('921042');
      setIssue('Duplicate Refund Request Across Multiple Portals / Double Dipping');
      setFareAmount(45000);
      setJourneyDate('25 Oct 2026');
      setHasCarrierNotice(false);
      setHasPaymentReceipt(true);
      setSimulatedDuplicate(true);
    } else if (preset === 'RF-1088') {
      setTransportType('flight');
      setBookingRef('782199');
      setIssue('Medical Emergency Inability to Fly (Passenger or Immediate Family)');
      setFareAmount(52400);
      setJourneyDate('26 Oct 2026');
      setHasCarrierNotice(false);
      setHasPaymentReceipt(true);
      setHasMedicalCertificate(false);
      setSimulatedDuplicate(false);
    }
  };

  const handleRunVerification = () => {
    setIsVerifying(true);
    setCurrentStep(5);

    setTimeout(() => {
      const result = verifyPolicyForClaim({
        operator: transportType === 'flight' ? 'Air India' : transportType === 'train' ? 'Indian Railways (IRCTC)' : transportType === 'ride' ? 'Airport Cab Exec' : 'Intercity Bus',
        transportType,
        issueReason: issue,
        ticketAmount: fareAmount,
        delayHours: transportType === 'train' ? 3.7 : 0,
        expectedDistanceKm: transportType === 'ride' ? 24.2 : 0,
        actualDistanceKm: transportType === 'ride' ? 39.8 : 0,
        tolerancePct: 10,
        hasMedicalCertificate,
        hasCarrierCancellationAdvisory: hasCarrierNotice,
        isDuplicateDetected: simulatedDuplicate,
      });

      setVerificationResult(result);
      setIsVerifying(false);
      setCurrentStep(6);
    }, 900);
  };

  const handleProceedToWorkspace = () => {
    const targetCaseId = selectedDemoKey || 'AT-9842';
    selectCaseById(targetCaseId);
    navigate(`/refund-investigations/${targetCaseId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-surface-container-lowest rounded-3xl p-space-lg sm:p-space-xl shadow-xl border border-surface-container text-left flex flex-col gap-space-lg">
      {/* Header Explainer (Requirement 9) */}
      <div className="flex flex-col gap-1 pb-space-xs border-b border-surface-container">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">policy</span>
          </span>
          <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
            Guided Refund Eligibility Verification
          </h2>
        </div>
        <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant font-medium">
          Verify your travel refund eligibility using applicable policies, booking evidence, and transparent calculations.
        </p>
      </div>

      {/* 7-Step Progress Stepper Bar */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2 text-xs">
        {[
          { num: 1, label: 'Transport' },
          { num: 2, label: 'Booking' },
          { num: 3, label: 'Issue' },
          { num: 4, label: 'Evidence' },
          { num: 5, label: 'Verify' },
          { num: 6, label: 'Results' },
          { num: 7, label: 'Review' },
        ].map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (s.num <= 4 || (s.num >= 5 && verificationResult)) {
                  setCurrentStep(s.num);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-xs'
                  : isDone
                  ? 'bg-surface-container-high text-on-surface'
                  : 'bg-surface-container-low text-outline opacity-60'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-on-primary-container text-on-primary' : isDone ? 'bg-primary text-on-primary' : 'bg-outline-variant text-on-surface'
              }`}>
                {isDone ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: SELECT TRANSPORT TYPE */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-space-md animate-fade-in">
          <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
            Step 1 of 7: Select Transport Mode
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            {[
              { type: 'flight' as TransportType, label: 'Flight', icon: 'flight_takeoff', desc: 'Airlines & GDS' },
              { type: 'train' as TransportType, label: 'Train', icon: 'train', desc: 'Railways & TDR' },
              { type: 'bus' as TransportType, label: 'Bus', icon: 'directions_bus', desc: 'Intercity Sleeper' },
              { type: 'ride' as TransportType, label: 'Ride / Cab', icon: 'local_taxi', desc: 'Mobility & Airport' },
            ].map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => {
                  setTransportType(t.type);
                  setCurrentStep(2);
                }}
                className={`p-space-md rounded-2xl flex flex-col items-center text-center gap-2 border transition-all cursor-pointer ${
                  transportType === t.type
                    ? 'bg-primary-fixed/20 border-primary shadow-xs ring-2 ring-primary/20'
                    : 'bg-surface-container-low hover:bg-surface-container border-surface-container'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">{t.icon}</span>
                </div>
                <div>
                  <span className="font-headline-sm text-sm font-bold text-on-surface block">{t.label}</span>
                  <span className="text-[11px] text-on-surface-variant">{t.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-space-xs">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-bold hover:bg-primary-fixed-dim transition-all cursor-pointer"
            >
              Continue to Step 2 →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ENTER BOOKING OR PICK DEMO CASE */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-space-md animate-fade-in">
          <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
            Step 2 of 7: Enter Booking Reference or Select a Realistic Demo Case
          </span>

          {/* Quick Demo Selector */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-space-xs">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
              Quick-Fill from Fictional Demo Scenarios:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { key: 'AT-9842', title: '✈️ Air India Cancellation', sub: 'Eligible full refund (₹9,450)' },
                { key: 'INV-9840', title: '🚆 IRCTC Rajdhani >3h Delay', sub: 'Eligible TDR refund (₹4,120)' },
                { key: 'RD-4409', title: '🚕 Airport Cab Detour (+64%)', sub: 'Eligible partial adjustment (₹680)' },
                { key: 'BS-3021', title: '🚌 Intercity Bus Surcharge', sub: 'Eligible fee refund (₹850)' },
                { key: 'RF-1042', title: '⚠️ Duplicate Claim Attempt', sub: 'Fraud hash collision detected' },
                { key: 'RF-1088', title: '🏥 Medical Emergency Exemption', sub: 'More evidence required' },
              ].map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => handleSelectDemoCase(d.key)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                    selectedDemoKey === d.key
                      ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-xs'
                      : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-surface-container'
                  }`}
                >
                  <span className="block font-semibold">{d.title}</span>
                  <span className="text-[10px] opacity-80">{d.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface font-semibold">
                PNR or Ticket Reference Number
              </label>
              <input
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-code-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="e.g. 482910 or UBR-90214"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface font-semibold">
                Total Fare Paid (₹)
              </label>
              <input
                type="number"
                value={fareAmount}
                onChange={(e) => setFareAmount(Number(e.target.value))}
                className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-between pt-space-xs">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-bold hover:bg-primary-fixed-dim transition-all cursor-pointer"
            >
              Continue to Step 3 →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT THE ISSUE */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-space-md animate-fade-in">
          <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
            Step 3 of 7: Select the Disruption or Refund Ground
          </span>

          <div className="flex flex-col gap-2">
            {[
              {
                id: 'Carrier Cancellation without Alternate Offer',
                title: 'Carrier-Initiated Cancellation (No Acceptable Alternate)',
                desc: 'Flight/service was cancelled by operator without timely rerouting.',
              },
              {
                id: 'Major Train Delay (>3 Hours at Origin/Boarding Station)',
                title: 'Major Delay (>3 Hours at Boarding)',
                desc: 'Train or scheduled journey delayed past statutory thresholds.',
              },
              {
                id: 'Unjustified Route & Distance Deviation / Fare Overcharge',
                title: 'Significant Route Deviation & Meter Overcharge',
                desc: 'Vehicle GPS exceeded expected mileage past permitted tolerance.',
              },
              {
                id: 'Undeclared Surcharges & Boarding Overcharges',
                title: 'Unauthorized Surcharges Extracted En Route',
                desc: 'Demanded cash for luggage or AC already covered in prepaid ticket.',
              },
              {
                id: 'Medical Emergency Inability to Fly (Passenger or Immediate Family)',
                title: 'Medical Emergency Inability to Travel',
                desc: 'Acute illness or inpatient hospitalization prevented boarding.',
              },
              {
                id: 'Duplicate Refund Request Across Multiple Portals / Double Dipping',
                title: 'Duplicate Claim / Re-submitted Ticket',
                desc: 'Testing anti-fraud detection across multiple travel portals.',
              },
            ].map((iss) => (
              <div
                key={iss.id}
                onClick={() => setIssue(iss.id)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  issue === iss.id
                    ? 'bg-primary-fixed/20 border-primary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container border-surface-container'
                }`}
              >
                <input
                  type="radio"
                  name="issue"
                  checked={issue === iss.id}
                  onChange={() => setIssue(iss.id)}
                  className="mt-1 accent-primary"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-xs sm:text-sm text-on-surface">{iss.title}</span>
                  <span className="text-[11px] text-on-surface-variant">{iss.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-space-xs">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-bold hover:bg-primary-fixed-dim transition-all cursor-pointer"
            >
              Continue to Step 4 →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PROVIDE EVIDENCE & DETAILS */}
      {currentStep === 4 && (
        <div className="flex flex-col gap-space-md animate-fade-in">
          <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
            Step 4 of 7: Provide Booking Details & Supporting Evidence
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface font-semibold">
                Scheduled Journey Date
              </label>
              <input
                type="text"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface font-semibold">
                Carrier Name
              </label>
              <input
                type="text"
                value={
                  transportType === 'flight'
                    ? 'Air India / IndiGo'
                    : transportType === 'train'
                    ? 'Indian Railways (IRCTC)'
                    : transportType === 'ride'
                    ? 'Airport Cab Exec'
                    : 'Intercity Bus Express'
                }
                readOnly
                className="p-2.5 rounded-xl bg-surface-container border border-surface-container text-xs text-on-surface-variant cursor-not-allowed"
              />
            </div>
          </div>

          {/* Evidence Checklist */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-space-xs text-xs">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
              Available Evidence Checkpoints:
            </span>

            <label className="flex items-center gap-2 cursor-pointer py-1 text-on-surface">
              <input
                type="checkbox"
                checked={hasCarrierNotice}
                onChange={(e) => setHasCarrierNotice(e.target.checked)}
                className="accent-primary w-4 h-4 rounded"
              />
              <span>Official Carrier Advisory / Operational Notice Attached</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer py-1 text-on-surface">
              <input
                type="checkbox"
                checked={hasPaymentReceipt}
                onChange={(e) => setHasPaymentReceipt(e.target.checked)}
                className="accent-primary w-4 h-4 rounded"
              />
              <span>Original Payment Gateway Settlement / Card Slip Verified</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer py-1 text-on-surface">
              <input
                type="checkbox"
                checked={hasMedicalCertificate}
                onChange={(e) => setHasMedicalCertificate(e.target.checked)}
                className="accent-primary w-4 h-4 rounded"
              />
              <span>Authenticated Hospital Discharge Slip (NMC registered)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer py-1 text-on-surface">
              <input
                type="checkbox"
                checked={simulatedDuplicate}
                onChange={(e) => setSimulatedDuplicate(e.target.checked)}
                className="accent-error w-4 h-4 rounded"
              />
              <span className="text-error font-medium">
                Simulate Duplicate File Hash Flag (Audit collision test)
              </span>
            </label>
          </div>

          <div className="flex justify-between pt-space-xs">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleRunVerification}
              className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs sm:text-sm font-bold shadow-md hover:bg-primary-fixed-dim transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              <span>Run Policy Verification (Step 5) →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: VERIFYING IN PROGRESS */}
      {currentStep === 5 && isVerifying && (
        <div className="p-space-xl flex flex-col items-center justify-center text-center gap-space-md animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container animate-bounce">
            <span className="material-symbols-outlined text-[32px]">sync</span>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
              Policy Intelligence Engine Running...
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Reconciling booking PNR #{bookingRef} against statutory rulebooks, carrier contractual policies, and cryptographic integrity hashes.
            </p>
          </div>
        </div>
      )}

      {/* STEP 6: VIEW RESULTS & TRANSPARENT CALCULATION */}
      {currentStep === 6 && verificationResult && (
        <div className="flex flex-col gap-space-md animate-fade-in">
          <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
            Step 6 of 7: Investigation Findings & Policy Match
          </span>

          {/* Outcome Result Card */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-space-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-space-xs border-b border-surface-container">
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
                  Arbitration Determination
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      verificationResult.eligibilityStatus === 'Eligible for Full Refund'
                        ? 'bg-primary-container text-on-primary-container'
                        : verificationResult.eligibilityStatus === 'Eligible for Partial Refund'
                        ? 'bg-primary-fixed text-on-primary-fixed-variant'
                        : verificationResult.eligibilityStatus === 'More Evidence Required'
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {verificationResult.eligibilityStatus}
                  </span>
                  <span className="font-code-sm text-xs text-on-surface-variant">
                    Risk: {verificationResult.riskEvaluation.riskLevel}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold block">
                  Eligible / Disputed Amount
                </span>
                <span className="font-headline-lg text-2xl font-bold text-primary">
                  ₹{verificationResult.calculatedAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Exact Policy Citation */}
            <div className="p-space-sm rounded-xl bg-surface-container-lowest border border-surface-container text-xs flex flex-col gap-0.5">
              <span className="font-bold text-primary">
                Applicable Policy Clause: {verificationResult.matchedRule?.clauseRef}
              </span>
              <p className="font-medium text-on-surface">{verificationResult.matchedRule?.title}</p>
              <p className="text-[11px] text-on-surface-variant">
                <strong>Legal Source:</strong> {verificationResult.matchedRule?.sourceUrlOrDocument}
              </p>
            </div>

            {/* Transparent Calculation Explanation */}
            <div className="p-space-sm rounded-xl bg-surface-container-lowest border border-surface-container text-xs">
              <strong className="text-on-surface block mb-1 uppercase tracking-wider text-[11px]">
                Calculation & Rules Breakdown:
              </strong>
              <p className="text-on-surface-variant leading-relaxed">
                {verificationResult.calculationExplanation}
              </p>
            </div>

            {/* Conditions Checked */}
            <div>
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold block mb-1">
                Conditions Checked:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {verificationResult.conditionsChecked.map((chk, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-surface-container-lowest border border-surface-container flex items-center gap-2"
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        chk.met ? 'text-primary' : 'text-error'
                      }`}
                    >
                      {chk.met ? 'check_circle' : 'cancel'}
                    </span>
                    <div className="truncate">
                      <span className="font-semibold text-on-surface block truncate">{chk.condition}</span>
                      <span className="text-[10px] text-on-surface-variant">{chk.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-space-xs">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              ← Re-adjust Parameters
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(7)}
              className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-bold hover:bg-primary-fixed-dim transition-all cursor-pointer"
            >
              Request Human Review / View Case (Step 7) →
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: HUMAN REVIEW / AUDIT DISPATCH */}
      {currentStep === 7 && (
        <div className="flex flex-col gap-space-md animate-fade-in text-xs">
          <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
            Step 7 of 7: Human Review & Official Dispute Dispatch
          </span>

          <div className="p-space-lg rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-space-md">
            <div className="flex items-center gap-2 text-on-surface font-bold text-sm">
              <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
              <span>Human Auditor Verification Notice</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              In accordance with Agent Travel compliance principles, the AI system assists your investigation with policy citations and evidence verification, but does not independently release carrier funds. High-impact claims and edge cases are assigned to human auditors for final sign-off.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={handleProceedToWorkspace}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs sm:text-sm font-bold shadow-md hover:bg-primary-fixed-dim transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                <span>Open Full Investigation Dossier (#{selectedDemoKey})</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/reviews')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-semibold transition-all border border-surface-container cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">rate_review</span>
                <span>Review Desk Queue</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-surface-container text-[11px] text-outline leading-relaxed">
            <strong>Transparency Guarantee:</strong> Zero automatic penalties are levied on drivers or carriers. We consider civic diversions, weather force majeure, and GPS multipath before establishing conclusions.
          </div>
        </div>
      )}
    </div>
  );
};
