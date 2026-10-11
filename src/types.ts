export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Insufficient Evidence';

export type InvestigationStatus = 
  | 'Ready for Payout'
  | 'Approved'
  | 'Disbursed'
  | 'Under Human Review'
  | 'Awaiting Carrier Evidence'
  | 'Audit In Progress'
  | 'Auto-Filed TDR'
  | 'Flagged'
  | 'Rejected'
  | 'Pending Human Approval';

export type InvestigationOutcome =
  | 'Eligible for Full Refund'
  | 'Eligible for Partial Refund'
  | 'Not Eligible under Verified Policy'
  | 'More Evidence Required'
  | 'Human Review Required';

export type TransportType = 'flight' | 'train' | 'bus' | 'ride';

export type PolicyType = 'legal_mandate' | 'operator_contract' | 'internal_risk_rule';

export interface PolicyRule {
  id: string;
  operatorOrPlatform: string;
  transportType: TransportType | 'all';
  reason: string;
  policyType: PolicyType;
  clauseRef: string;
  title: string;
  summary: string;
  conditions: string[];
  exceptions: string[];
  calculationFormula: string;
  effectiveDate: string;
  expiryDate: string;
  sourceUrlOrDocument: string;
  version: string;
  lastVerifiedDate: string;
  verified: boolean;
}

export interface FareDistanceAudit {
  isApplicable: boolean;
  expectedRouteDescription: string;
  actualRouteDescription?: string;
  expectedDistanceKm: number;
  actualDistanceKm: number;
  distanceDeviationKm: number;
  distanceDeviationPct: number;
  tolerancePct: number;
  toleranceExceeded: boolean;
  baseFare: number;
  ratePerKm: number;
  waitingCharges: number;
  surcharges: { name: string; amount: number; disputed: boolean; note?: string }[];
  fareCharged: number;
  recalculatedFare: number;
  potentialDifference: number;
  eligibleAdjustment: number;
  deviationExplanation: string;
  trafficCongestionChecked: boolean;
  roadClosureReported: boolean;
  gpsIntegrityStatus: 'High Precision' | 'Moderate Multipath' | 'Unreliable';
  nonPunitiveDriverFinding: string;
}

export interface InvestigationStep {
  stepNumber: string;
  codeName: string;
  title: string;
  summary: string;
  status: 'Complete' | 'In Progress' | 'Pending' | 'Action Needed' | 'Flagged';
  statusLabel?: string;
  evidenceChecked?: string[];
  findings?: string;
  applicablePolicy?: string;
  confidenceOrLimitations?: string;
  explanation?: string;
}

export interface EvidenceArtifact {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  verified: boolean;
  content: string;
  source: string;
  timestamp: string;
  isFullWidth?: boolean;
  fileHash?: string;
  integrityVerified?: boolean;
  duplicateDetection?: {
    isDuplicate: boolean;
    matchedCaseId?: string;
    message?: string;
  };
  piiMasked?: boolean;
}

export interface AuditLogItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  dotColor: string;
  actorRole?: string;
  integrityHash?: string;
}

export interface InvestigationCase {
  id: string;
  caseRef: string;
  pnr: string;
  traveler: {
    name: string;
    initials: string;
    tier: string;
    color: string;
  };
  carrier: {
    name: string;
    code: string;
    type: TransportType;
    route: string;
    seat?: string;
    fareClass?: string;
  };
  journeyDate: string;
  claimAmount: number;
  claimAmountFormatted: string;
  riskLevel: RiskLevel;
  riskScore: number;
  aiConfidence: number;
  evidenceStrength: string;
  evidenceCount: string;
  recommendedAction: string;
  recommendedActionLabel: string;
  finalDecision: string;
  decisionStatus: InvestigationStatus;
  reasonSummary: string;
  synthesis: string;
  isHighImpact?: boolean;
  humanReviewRequired: boolean;
  assignedAuditor: string;
  reviewerComment?: string;
  steps: InvestigationStep[];
  artifacts: EvidenceArtifact[];
  auditLog: AuditLogItem[];

  // Rich AI Investigation extensions
  outcome?: InvestigationOutcome;
  customerIssue?: string;
  policyCitation?: {
    policyId: string;
    clauseRef: string;
    title: string;
    source: string;
    effectiveDate: string;
    policyType: PolicyType;
    verified: boolean;
  };
  fareDistanceAudit?: FareDistanceAudit;
  missingEvidence?: string[];
  appealNotes?: string;
  integrityHash?: string;
  scenarioKey?: string;
}

export interface AnalyticsSummary {
  totalInvestigations: number;
  totalApprovedValueFormatted: string;
  approvalRateFormatted: string;
  highRiskCasesCount: number;
  avgTurnaround: string;
}

export interface SystemSettings {
  orgName: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  policies: {
    fullRefund: boolean;
    partialRefund: boolean;
    policyEvidenceRequired: boolean;
    customerHistoryCheck: boolean;
    cancellationEvidenceCheck: boolean;
  };
  riskRules: {
    highRiskThreshold: number;
    humanReviewRequired: boolean;
    highValueThreshold: number;
    insufficientEvidenceReview: boolean;
    paymentRiskReview: boolean;
  };
  notifications: {
    newHumanReview: boolean;
    highRiskDetected: boolean;
    investigationCompleted: boolean;
    refundDecisionUpdated: boolean;
  };
  aiPreferences: {
    aiInvestigation: boolean;
    aiRecommendations: boolean;
    evidenceBasedReasoning: boolean;
    humanApprovalSignificant: boolean;
  };
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  pnr: string;
  bookingDate: string;
  journeyDate: string;
  traveler: {
    name: string;
    initials: string;
    tier: string;
    color: string;
  };
  carrier: {
    name: string;
    code: string;
    type: TransportType;
    route: string;
    seat: string;
    fareClass: string;
  };
  amount: number;
  amountFormatted: string;
  status:
    | 'Cancelled by Carrier'
    | 'Major Delay (>3h)'
    | 'Confirmed / On Time'
    | 'Runway Grounded'
    | 'Missed Connection'
    | 'Schedule Altered'
    | 'Route Deviation / Overcharge'
    | 'Fare Surcharge Dispute';
  refundStatus:
    | 'Full Refund Eligible'
    | 'Disbursed'
    | 'Under Investigation'
    | 'TDR Auto-Filed'
    | 'In Review'
    | 'Not Claimed'
    | 'Partial Refund Eligible'
    | 'Evidence Required';
  relatedInvestigationId?: string;
}
