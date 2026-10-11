import React, { useState } from 'react';
import { FareDistanceAudit, TransportType } from '../../types';

interface FareDistanceModuleProps {
  audit?: FareDistanceAudit;
  caseId: string;
  carrierType: TransportType;
  carrierRoute: string;
  onUpdateTolerance?: (newTolerance: number) => void;
}

export const FareDistanceModule: React.FC<FareDistanceModuleProps> = ({
  audit,
  caseId: _caseId,
  carrierType,
  carrierRoute,
  onUpdateTolerance,
}) => {
  const [sliderTolerance, setSliderTolerance] = useState<number>(audit?.tolerancePct || 10);

  if (!audit || !audit.isApplicable) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col gap-space-sm text-left">
        <div className="flex items-center gap-2 pb-space-xs border-b border-surface-container">
          <span className="material-symbols-outlined text-secondary text-[22px]">route</span>
          <div>
            <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
              Fare & Route Audit
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Fixed Corridor Route Analysis • {carrierType === 'flight' ? 'Commercial Aviation' : 'Rail Transit'}
            </p>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container flex items-start gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
            verified
          </span>
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-on-surface">
              Fixed-Corridor Operating Route: {carrierRoute}
            </span>
            <p className="text-on-surface-variant leading-relaxed">
              Distance-based road detour recalculations are not applicable for scheduled fixed-track rail or commercial aviation corridors.
              Dispute arbitration operates under statutory cancellation and delay compensation policies (DGCA CAR Series M / IRCTC TDR Rules)
              rather than road distance tolerance algorithms.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleToleranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderTolerance(val);
    onUpdateTolerance?.(val);
  };

  const isToleranceExceeded = audit.distanceDeviationPct > sliderTolerance;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col gap-space-md text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs border-b border-surface-container">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">alt_route</span>
          <div>
            <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
              Transparent Fare & Distance Verification
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Telemetry distance comparison, tolerance arbitration, and itemized fare recalculation
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
            isToleranceExceeded
              ? 'bg-primary-fixed text-on-primary-container'
              : 'bg-surface-container-high text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {isToleranceExceeded ? 'trending_up' : 'check'}
          </span>
          <span>{isToleranceExceeded ? 'Tolerance Exceeded (>10%)' : 'Within Normal Tolerance'}</span>
        </span>
      </div>

      {/* Visual Route Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Expected Route */}
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
              Standard Expected Route
            </span>
            <span className="material-symbols-outlined text-primary text-[16px]">navigation</span>
          </div>
          <div>
            <div className="font-headline-lg text-2xl font-bold text-on-surface">
              {audit.expectedDistanceKm.toFixed(1)} km
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              {audit.expectedRouteDescription}
            </p>
          </div>
          <span className="font-code-sm text-[11px] text-outline">Geodesic Navigational Baseline</span>
        </div>

        {/* Actual GPS Route */}
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
              Recorded GPS Telemetry
            </span>
            <span className="material-symbols-outlined text-secondary text-[16px]">satellite_alt</span>
          </div>
          <div>
            <div className="font-headline-lg text-2xl font-bold text-on-surface">
              {audit.actualDistanceKm.toFixed(1)} km
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              {audit.actualRouteDescription || 'Actual recorded vehicle trajectory'}
            </p>
          </div>
          <span className="font-code-sm text-[11px] text-primary">GPS Integrity: {audit.gpsIntegrityStatus}</span>
        </div>

        {/* Deviation & Tolerance Slider */}
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
              Distance Deviation
            </span>
            <span className="material-symbols-outlined text-error text-[16px]">speed</span>
          </div>
          <div>
            <div className="font-headline-lg text-2xl font-bold text-error">
              +{audit.distanceDeviationKm.toFixed(1)} km{' '}
              <span className="text-sm font-semibold">({audit.distanceDeviationPct > 0 ? `+${audit.distanceDeviationPct.toFixed(1)}%` : '0%'})</span>
            </div>
            {/* Interactive Tolerance Slider */}
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
                <span>Configurable Tolerance:</span>
                <span className="font-bold text-on-surface">{sliderTolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="5"
                value={sliderTolerance}
                onChange={handleToleranceChange}
                className="w-full accent-primary h-1.5 cursor-pointer"
              />
            </div>
          </div>
          <span className="font-code-sm text-[11px] text-on-surface-variant">
            {isToleranceExceeded ? 'Exceeds allowable detour limit' : 'Within allowed traffic variance'}
          </span>
        </div>
      </div>

      {/* Itemized Fare Recalculation Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-container">
        <table className="w-full text-left text-xs font-body-sm">
          <thead className="bg-surface-container-high/80 text-on-surface font-label-sm text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Fare Component</th>
              <th className="py-2.5 px-3">Charged on Bill</th>
              <th className="py-2.5 px-3">Verified Legit Rate</th>
              <th className="py-2.5 px-3">Recalculated Due</th>
              <th className="py-2.5 px-3 text-right">Disputed Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container bg-surface-container-lowest">
            <tr>
              <td className="py-2.5 px-3 font-semibold text-on-surface">Base Fare</td>
              <td className="py-2.5 px-3 font-code-sm">₹{audit.baseFare}</td>
              <td className="py-2.5 px-3 text-on-surface-variant">Standard platform flagfall</td>
              <td className="py-2.5 px-3 font-code-sm">₹{audit.baseFare}</td>
              <td className="py-2.5 px-3 text-right font-code-sm text-outline">₹0</td>
            </tr>
            {audit.ratePerKm > 0 && (
              <tr>
                <td className="py-2.5 px-3 font-semibold text-on-surface">
                  Mileage Charge (₹{audit.ratePerKm}/km)
                </td>
                <td className="py-2.5 px-3 font-code-sm">
                  ₹{Math.round(audit.actualDistanceKm * audit.ratePerKm)} ({audit.actualDistanceKm} km)
                </td>
                <td className="py-2.5 px-3 text-on-surface-variant">
                  Recalculated on expected {audit.expectedDistanceKm} km
                </td>
                <td className="py-2.5 px-3 font-code-sm">
                  ₹{Math.round(audit.expectedDistanceKm * audit.ratePerKm)}
                </td>
                <td className="py-2.5 px-3 text-right font-code-sm text-error font-bold">
                  +₹{Math.round((audit.actualDistanceKm - audit.expectedDistanceKm) * audit.ratePerKm)}
                </td>
              </tr>
            )}
            {audit.waitingCharges > 0 && (
              <tr>
                <td className="py-2.5 px-3 font-semibold text-on-surface">Traffic & Waiting Charges</td>
                <td className="py-2.5 px-3 font-code-sm">₹{audit.waitingCharges}</td>
                <td className="py-2.5 px-3 text-on-surface-variant">Civic traffic delay verified</td>
                <td className="py-2.5 px-3 font-code-sm">₹{audit.waitingCharges}</td>
                <td className="py-2.5 px-3 text-right font-code-sm text-outline">₹0</td>
              </tr>
            )}
            {audit.surcharges.map((surcharge, idx) => (
              <tr key={idx} className={surcharge.disputed ? 'bg-error-container/10' : ''}>
                <td className="py-2.5 px-3 font-semibold text-on-surface">
                  {surcharge.name}
                  {surcharge.note && (
                    <span className="block text-[11px] font-normal text-on-surface-variant">
                      {surcharge.note}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 font-code-sm">₹{surcharge.amount}</td>
                <td className="py-2.5 px-3 text-on-surface-variant">
                  {surcharge.disputed ? 'Unauthorized / Surcharge Overbilling' : 'Authorized standard toll'}
                </td>
                <td className="py-2.5 px-3 font-code-sm">
                  {surcharge.disputed ? '₹0' : `₹${surcharge.amount}`}
                </td>
                <td className="py-2.5 px-3 text-right font-code-sm font-bold text-error">
                  {surcharge.disputed ? `+₹${surcharge.amount}` : '₹0'}
                </td>
              </tr>
            ))}
            <tr className="bg-surface-container-low font-bold text-sm">
              <td className="py-3 px-3 text-on-surface">Total Calculation</td>
              <td className="py-3 px-3 font-code-sm">₹{audit.fareCharged}</td>
              <td className="py-3 px-3 text-xs text-on-surface-variant font-normal">
                Net Recalculated Legitimate Total
              </td>
              <td className="py-3 px-3 font-code-sm text-primary">₹{audit.recalculatedFare}</td>
              <td className="py-3 px-3 text-right font-code-sm text-error text-base">
                ₹{audit.potentialDifference} Disputed Overcharge
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Non-Punitive Contextual Assessment Banner */}
      <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">handshake</span>
          <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface font-bold">
            Non-Punitive AI Contextual Assessment
          </span>
        </div>
        <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {audit.nonPunitiveDriverFinding}
        </p>
        <p className="font-body-sm text-xs text-outline italic">
          {audit.deviationExplanation}
        </p>
      </div>
    </div>
  );
};
