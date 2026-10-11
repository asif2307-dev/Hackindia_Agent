import React, { useState } from 'react';
import { PolicyRule } from '../../types';

interface PolicyCardProps {
  policy: PolicyRule;
  onVerifyWithPolicy?: (policy: PolicyRule) => void;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onVerifyWithPolicy }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBadgeStyle = (type: PolicyRule['policyType']) => {
    switch (type) {
      case 'legal_mandate':
        return 'bg-secondary-fixed text-on-secondary-fixed border-secondary/30';
      case 'operator_contract':
        return 'bg-primary-fixed text-on-primary-fixed-variant border-primary-container/40';
      case 'internal_risk_rule':
        return 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/30';
      default:
        return 'bg-surface-container text-on-surface border-surface-container-high';
    }
  };

  const getBadgeLabel = (type: PolicyRule['policyType']) => {
    switch (type) {
      case 'legal_mandate':
        return 'Statutory Legal Mandate';
      case 'operator_contract':
        return 'Operator Contractual Policy';
      case 'internal_risk_rule':
        return 'Internal Risk Governance Rule';
      default:
        return 'Policy Directive';
    }
  };

  const getTransportIcon = (type: PolicyRule['transportType']) => {
    switch (type) {
      case 'flight':
        return 'flight';
      case 'train':
        return 'train';
      case 'bus':
        return 'directions_bus';
      case 'ride':
        return 'local_taxi';
      default:
        return 'hub';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-sm border border-surface-container hover:border-outline-variant transition-all flex flex-col justify-between gap-space-md group">
      <div className="flex flex-col gap-space-sm">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(
                policy.policyType
              )}`}
            >
              {getBadgeLabel(policy.policyType)}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-[11px] capitalize">
              <span className="material-symbols-outlined text-[13px]">
                {getTransportIcon(policy.transportType)}
              </span>
              <span>{policy.transportType}</span>
            </span>
            {policy.verified && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-container font-label-sm text-[11px] font-bold">
                <span className="material-symbols-outlined text-[12px]">verified</span> Verified
              </span>
            )}
          </div>
          <span className="font-code-sm text-xs text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
            v{policy.version}
          </span>
        </div>

        {/* Title & Operator */}
        <div>
          <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
            {policy.title}
          </h3>
          <p className="font-label-sm text-xs text-primary font-semibold mt-0.5">
            {policy.clauseRef}
          </p>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1 line-clamp-1">
            <strong>Applicable Operator:</strong> {policy.operatorOrPlatform}
          </p>
        </div>

        {/* Summary */}
        <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant/90 leading-relaxed bg-surface-container-low p-space-sm rounded-xl border border-surface-container/60">
          {policy.summary}
        </p>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="flex flex-col gap-space-sm pt-space-xs border-t border-surface-container animate-fade-in text-xs">
            {/* Conditions */}
            <div>
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
                Eligibility Conditions
              </span>
              <ul className="list-disc pl-4 mt-1 text-on-surface-variant space-y-1">
                {policy.conditions.map((cond, i) => (
                  <li key={i}>{cond}</li>
                ))}
              </ul>
            </div>

            {/* Exceptions */}
            {policy.exceptions.length > 0 && (
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-error font-bold">
                  Applicable Exceptions
                </span>
                <ul className="list-disc pl-4 mt-1 text-on-surface-variant space-y-1">
                  {policy.exceptions.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Calculation Formula */}
            <div className="p-2.5 rounded-lg bg-surface-container font-code-sm text-[11px] text-on-surface border border-surface-container-high">
              <span className="font-bold text-primary block mb-0.5">Calculation Formula:</span>
              {policy.calculationFormula}
            </div>

            {/* Source Reference */}
            <div className="text-[11px] text-on-surface-variant flex flex-col gap-0.5">
              <span>
                <strong>Official Document:</strong> {policy.sourceUrlOrDocument}
              </span>
              <span className="text-outline">
                Effective: {policy.effectiveDate} • Last Verified: {policy.lastVerifiedDate}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-space-xs border-t border-surface-container">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Full Clause & Exceptions'}</span>
          <span className="material-symbols-outlined text-[16px]">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {onVerifyWithPolicy && (
          <button
            type="button"
            onClick={() => onVerifyWithPolicy(policy)}
            className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-xs font-bold hover:bg-primary-fixed-dim transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Test in Sandbox</span>
          </button>
        )}
      </div>
    </div>
  );
};
