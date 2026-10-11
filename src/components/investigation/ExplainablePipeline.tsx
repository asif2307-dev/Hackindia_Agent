import React, { useState } from 'react';
import { InvestigationStep } from '../../types';

interface ExplainablePipelineProps {
  steps: InvestigationStep[];
}

export const ExplainablePipeline: React.FC<ExplainablePipelineProps> = ({ steps }) => {
  const [expandedSteps, setExpandedSteps] = useState<{ [key: string]: boolean }>({
    '01': true,
    '03': true,
    '06': true,
    '08': true,
  });

  const toggleStep = (stepNumber: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const expandAll = () => {
    const all: { [key: string]: boolean } = {};
    steps.forEach((s) => (all[s.stepNumber] = true));
    setExpandedSteps(all);
  };

  const collapseAll = () => {
    setExpandedSteps({});
  };

  const getStatusBadge = (status: InvestigationStep['status']) => {
    switch (status) {
      case 'Complete':
        return 'bg-primary-container text-on-primary-container';
      case 'Action Needed':
        return 'bg-secondary-fixed text-on-secondary-fixed';
      case 'Flagged':
        return 'bg-error-container text-on-error-container';
      case 'In Progress':
        return 'bg-surface-container-high text-on-surface';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  const getStepIcon = (idx: number, status: InvestigationStep['status']) => {
    if (status === 'Flagged') return 'warning';
    if (status === 'Action Needed') return 'help';
    if (idx === steps.length - 1) return 'stars';
    return 'check';
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl shadow-sm border border-surface-container flex flex-col gap-space-md text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-xs border-b border-surface-container gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">account_tree</span>
          <div>
            <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
              Explainable AI Investigation Pipeline
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              8-Stage autonomous arbitration with complete evidence provenance and policy clause attribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-outline-variant">•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-semibold text-on-surface-variant hover:underline cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 8-Step Timeline */}
      <div className="relative flex flex-col gap-space-md pt-space-xs">
        {/* Continuous Track Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-surface-container-high"></div>

        {steps.map((step, idx) => {
          const isExpanded = !!expandedSteps[step.stepNumber];
          const isFinal = idx === steps.length - 1;
          const isFlagged = step.status === 'Flagged' || step.status === 'Action Needed';

          return (
            <div key={step.stepNumber} className="relative flex items-start gap-space-md group">
              {/* Step Circle Indicator */}
              <div
                onClick={() => toggleStep(step.stepNumber)}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-body-sm shadow-sm shrink-0 cursor-pointer transition-transform group-hover:scale-105 ${
                  isFlagged
                    ? 'bg-error-container text-on-error-container'
                    : isFinal
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-primary-container text-on-primary-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {getStepIcon(idx, step.status)}
                </span>
              </div>

              {/* Step Card Container */}
              <div
                className={`flex-1 p-space-md rounded-xl flex flex-col gap-space-xs border transition-all ${
                  isFlagged
                    ? 'bg-error-container/10 border-error/30'
                    : isFinal
                    ? 'bg-primary-fixed/20 border-primary-container/40 shadow-xs'
                    : 'bg-surface-container-low border-surface-container'
                }`}
              >
                {/* Header Row */}
                <div
                  className="flex items-center justify-between flex-wrap gap-2 cursor-pointer select-none"
                  onClick={() => toggleStep(step.stepNumber)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-label-sm text-xs text-primary font-bold uppercase tracking-wider">
                      Step {step.stepNumber}
                    </span>
                    <span className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
                      {step.title}
                    </span>
                    <span className="font-code-sm text-[11px] text-outline">
                      ({step.codeName})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${getStatusBadge(
                        step.status
                      )}`}
                    >
                      {step.statusLabel || step.status}
                    </span>
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {/* High-Level Summary */}
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {step.summary}
                </p>

                {/* Expanded Explainability Details */}
                {isExpanded && (
                  <div className="mt-space-xs pt-space-xs border-t border-surface-container flex flex-col gap-space-xs text-xs animate-fade-in">
                    {/* Findings */}
                    {step.findings && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-on-surface shrink-0 min-w-[120px]">
                          Key Finding:
                        </span>
                        <span className="text-on-surface-variant flex-1">{step.findings}</span>
                      </div>
                    )}

                    {/* Evidence Checked */}
                    {step.evidenceChecked && step.evidenceChecked.length > 0 && (
                      <div className="flex items-start gap-2 flex-wrap sm:flex-nowrap">
                        <span className="font-semibold text-on-surface shrink-0 min-w-[120px]">
                          Evidence Checked:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap flex-1">
                          {step.evidenceChecked.map((ev, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-surface-container font-code-sm text-[11px] text-on-surface"
                            >
                              {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Applicable Policy */}
                    {step.applicablePolicy && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-primary shrink-0 min-w-[120px]">
                          Applicable Policy:
                        </span>
                        <span className="font-medium text-on-surface flex-1">
                          {step.applicablePolicy}
                        </span>
                      </div>
                    )}

                    {/* Confidence or Limitations */}
                    {step.confidenceOrLimitations && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-outline shrink-0 min-w-[120px]">
                          Confidence / Limits:
                        </span>
                        <span className="text-on-surface-variant flex-1 italic">
                          {step.confidenceOrLimitations}
                        </span>
                      </div>
                    )}

                    {/* In-Depth Explanation */}
                    {step.explanation && (
                      <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface block mb-0.5">Explanation:</strong>
                        {step.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
