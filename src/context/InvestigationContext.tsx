import React, { createContext, useContext, useState } from 'react';
import { InvestigationCase, SystemSettings } from '../types';
import { allMockInvestigations, defaultSettings, primaryCaseAT9842 } from '../data/mockData';

interface InvestigationContextType {
  cases: InvestigationCase[];
  selectedCase: InvestigationCase;
  settings: SystemSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectCaseById: (id: string) => void;
  approveRefund: (id: string, comment?: string) => void;
  requestManualReview: (id: string, comment?: string) => void;
  requestMoreEvidence: (id: string, comment?: string) => void;
  rejectRecommendation: (id: string, reason: string) => void;
  updateToleranceRule: (caseId: string, newTolerancePct: number) => void;
  fileAppeal: (caseId: string, appealText: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  timeframe: string;
  setTimeframe: (tf: string) => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<InvestigationCase[]>(allMockInvestigations);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('AT-9842');
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>('Last 30 Days');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || primaryCaseAT9842;

  const selectCaseById = (id: string) => {
    setSelectedCaseId(id);
  };

  const approveRefund = (id: string, comment?: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...c,
            decisionStatus: 'Approved',
            finalDecision: 'Approved by Lead Auditor Julian Hayes',
            reviewerComment: comment || 'Refund authorized following full evidence & policy verification.',
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: `Refund Authorized: ${c.claimAmountFormatted}`,
                description: `Signed off by Julian Hayes. Ledger record #REF-APPROVED-${id} emitted.`,
                dotColor: 'bg-primary-container',
                actorRole: 'Lead Auditor',
              },
              ...c.auditLog,
            ],
          };
        }
        return c;
      })
    );
  };

  const requestManualReview = (id: string, comment?: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...c,
            decisionStatus: 'Under Human Review',
            finalDecision: 'Escalated to 2nd-Level Carrier Review Desk',
            reviewerComment: comment || 'Dispatched for manual airline/operator liaison verification.',
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: 'Case Escalated to Carrier Review Desk',
                description: comment || 'Flagged for manual investigation of carrier liaison records.',
                dotColor: 'bg-secondary',
                actorRole: 'Auditor Desk',
              },
              ...c.auditLog,
            ],
          };
        }
        return c;
      })
    );
  };

  const requestMoreEvidence = (id: string, comment?: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...c,
            decisionStatus: 'Under Human Review',
            outcome: 'More Evidence Required',
            finalDecision: 'More Evidence Requested from Passenger',
            reviewerComment: comment || 'Passenger notified to submit authenticated hospital or operator certificates.',
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: 'Evidence Request Dispatched to Passenger',
                description: comment || 'Awaiting certified supporting documents before determination.',
                dotColor: 'bg-secondary',
                actorRole: 'Claims Officer',
              },
              ...c.auditLog,
            ],
          };
        }
        return c;
      })
    );
  };

  const rejectRecommendation = (id: string, reason: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...c,
            decisionStatus: 'Rejected',
            finalDecision: 'Recommendation Overridden / Claim Rejected',
            reviewerComment: reason,
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: 'AI Recommendation Overridden / Claim Rejected',
                description: `Reason: ${reason}`,
                dotColor: 'bg-error',
                actorRole: 'Lead Auditor',
              },
              ...c.auditLog,
            ],
          };
        }
        return c;
      })
    );
  };

  const updateToleranceRule = (caseId: string, newTolerancePct: number) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId && c.fareDistanceAudit?.isApplicable) {
          const audit = c.fareDistanceAudit;
          const deviationPct = audit.distanceDeviationPct;
          const toleranceExceeded = deviationPct > newTolerancePct;
          const eligibleAdjustment = toleranceExceeded ? audit.potentialDifference : 0;
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return {
            ...c,
            fareDistanceAudit: {
              ...audit,
              tolerancePct: newTolerancePct,
              toleranceExceeded,
              eligibleAdjustment,
            },
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: `Tolerance Threshold Updated to ${newTolerancePct}%`,
                description: `Fare recalculation updated. Exceeded: ${toleranceExceeded ? 'YES' : 'NO'}. Eligible: ₹${eligibleAdjustment}.`,
                dotColor: 'bg-secondary',
                actorRole: 'Auditor Policy Setting',
              },
              ...c.auditLog,
            ],
          };
        }
        return c;
      })
    );
  };

  const fileAppeal = (caseId: string, appealText: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...c,
            decisionStatus: 'Under Human Review',
            appealNotes: appealText,
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: 'Passenger Appeal Submitted',
                description: `Appeal note: "${appealText}"`,
                dotColor: 'bg-primary-container',
                actorRole: 'Passenger Appeal Portal',
              },
              ...c.auditLog,
            ],
          };
        }
        return c;
      })
    );
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <InvestigationContext.Provider
      value={{
        cases,
        selectedCase,
        settings,
        searchQuery,
        setSearchQuery,
        selectCaseById,
        approveRefund,
        requestManualReview,
        requestMoreEvidence,
        rejectRecommendation,
        updateToleranceRule,
        fileAppeal,
        updateSettings,
        isSearchModalOpen,
        setIsSearchModalOpen,
        timeframe,
        setTimeframe,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
