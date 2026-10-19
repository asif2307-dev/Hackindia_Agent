import React, { createContext, useContext, useState, useEffect } from 'react';
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
  rejectRecommendation: (id: string, reason: string) => void;
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

  // Load backend refunds on mount and merge with in-memory cases
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        let res: Response | null = null;
        try {
          res = await fetch('/api/refunds');
        } catch {
          res = await fetch('http://localhost:5001/api/refunds');
        }
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data.refunds) && data.refunds.length > 0) {
            setCases((prev) => {
              const incomingMap = new Map(data.refunds.map((r: any) => [r.id.toLowerCase(), r]));
              // Update existing cases with latest backend data
              const updated = prev.map((c) => incomingMap.get(c.id.toLowerCase()) || c);
              // Prepend any new refunds not yet in state
              const existingIds = new Set(prev.map((c) => c.id.toLowerCase()));
              const brandNew = data.refunds.filter((r: any) => !existingIds.has(r.id.toLowerCase()));
              return [...brandNew, ...updated];
            });
          }
        }
      } catch {}
    };
    fetchRefunds();
  }, []);

  const selectedCase =
    cases.find(
      (c) =>
        c.id.toLowerCase() === selectedCaseId.toLowerCase() ||
        c.caseRef.toLowerCase().replace('#', '') === selectedCaseId.toLowerCase().replace('#', '') ||
        c.pnr.toLowerCase() === selectedCaseId.toLowerCase() ||
        (c.bookingId && c.bookingId.toLowerCase() === selectedCaseId.toLowerCase())
    ) ||
    cases[0] ||
    primaryCaseAT9842;

  const selectCaseById = (id: string) => {
    setSelectedCaseId(id);
  };

  const postDecisionToBackend = async (id: string, decision: string, note?: string) => {
    try {
      await fetch(`/api/refunds/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reviewerComment: note || 'Decision recorded by Lead Auditor',
          reviewerId: 'Julian Hayes (Lead Auditor)',
        }),
      });
    } catch {
      try {
        await fetch(`http://localhost:5001/api/refunds/${id}/decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            decision,
            reviewerComment: note || 'Decision recorded by Lead Auditor',
            reviewerId: 'Julian Hayes (Lead Auditor)',
          }),
        });
      } catch {}
    }
  };

  const approveRefund = (id: string, comment?: string) => {
    postDecisionToBackend(id, 'APPROVE', comment);
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...c,
            decisionStatus: 'Approved',
            finalDecision: 'Approved by Lead Auditor Julian Hayes',
            reviewerComment: comment || 'Refund authorized following full evidence verification.',
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: `Refund Authorized: ${c.claimAmountFormatted}`,
                description: `Signed off by Julian Hayes. Ledger record #REF-APPROVED-${id} emitted.`,
                dotColor: 'bg-primary-container',
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
    postDecisionToBackend(id, 'REQUEST_INFO', comment);
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...c,
            decisionStatus: 'Under Human Review',
            finalDecision: 'Escalated to 2nd-Level Carrier Review Desk',
            reviewerComment: comment || 'Dispatched for manual airline carrier liaison verification.',
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: 'Case Escalated to Carrier Review Desk',
                description: 'Flagged for manual investigation of carrier liaison records.',
                dotColor: 'bg-secondary',
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
    postDecisionToBackend(id, 'REJECT', reason);
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...c,
            decisionStatus: 'Rejected',
            finalDecision: 'Recommendation Rejected by Auditor',
            reviewerComment: reason,
            auditLog: [
              {
                id: `log-${Date.now()}`,
                time: now,
                title: 'AI Recommendation Overridden / Rejected',
                description: `Reason: ${reason}`,
                dotColor: 'bg-error',
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
        rejectRecommendation,
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
