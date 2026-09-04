export type DecisionType = 'SAFE_AUTO_RESOLVE' | 'EVIDENCE_INSUFFICIENT' | 'CONTRADICTORY_EVIDENCE';
export type EvidenceStatus = 'VERIFIED' | 'MISSING' | 'CONFLICT' | 'WEAK';
export type EvidenceWeight = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type UncertaintyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface EvidenceItem {
  category: string;
  title: string;
  status: EvidenceStatus;
  weight: EvidenceWeight;
  score: number;
  description: string;
  is_risk_factor?: boolean;
}

export interface CandidateMatch {
  candidate_id: string;
  candidate_txn_id: string;
  candidate_source: string;
  amount: number;
  merchant: string;
  timestamp: string;
  similarity_score: number;
  amount_match: boolean;
  ref_match: boolean;
}

export interface FinancialRecord {
  id: string;
  txn_id: string;
  order_id?: string;
  amount: number;
  currency: string;
  merchant: string;
  timestamp: string;
  source: string;
  status: string;
  reference_id?: string;
  settlement_id?: string;
  bank_utr?: string;
  customer_email?: string;
  payment_method?: string;
  ground_truth_class?: string;
}

export interface ReconciliationResult {
  record_id: string;
  txn_id: string;
  order_id?: string;
  merchant: string;
  amount: number;
  currency: string;
  source: string;
  timestamp: string;
  status: string;
  bank_utr?: string;
  reference_id?: string;
  settlement_id?: string;
  
  match_probability: number;
  evidence_sufficiency: number;
  uncertainty_score: number;
  uncertainty_level: UncertaintyLevel;
  contradiction_detected: boolean;
  contradiction_details: string[];
  
  decision: DecisionType;
  decision_badge: string;
  decision_reason: string;
  rule_triggered: string;
  
  evidence_items: EvidenceItem[];
  candidates: CandidateMatch[];
  best_candidate_id?: string;
  candidate_margin: number;
  
  estimated_risk_avoided: number;
  ground_truth_class?: string;
  traditional_decision: string;
  generic_ai_decision: string;
}

export interface AuditLogEntry {
  timestamp: string;
  phase: string;
  action: string;
  detail: string;
  evidence_context?: string;
  status: 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO';
}

export interface BatchAnalysisSummary {
  total_records: number;
  safe_count: number;
  review_count: number;
  exception_count: number;
  safe_rate: number;
  review_rate: number;
  exception_rate: number;
  automation_safety_score: number;
  unsafe_automation_rate: number;
  correct_abstention_rate: number;
  false_match_rate: number;
  review_efficiency: number;
  estimated_risk_avoided: number;
  records: ReconciliationResult[];
  audit_trail: AuditLogEntry[];
}

export interface DemoScenario {
  id: string;
  scenario_number: number;
  title: string;
  subtitle: string;
  scenario_type: 'SAFE' | 'ABSTAIN' | 'EXCEPTION';
  highlight_tag: string;
  payment_record: Record<string, any>;
  matched_record: Record<string, any>;
  match_probability: number;
  evidence_sufficiency: number;
  uncertainty: string;
  decision: string;
  decision_reason: string;
  traditional_ai_decision: string;
  proofgap_ai_decision: string;
  evidence_breakdown: EvidenceItem[];
  key_takeaway: string;
}

export interface BenchmarkMetric {
  metric: string;
  traditional_rules: string;
  generic_ai: string;
  proofgap_ai: string;
  advantage: string;
  is_highlight: boolean;
}

export interface BenchmarkData {
  disclaimer: string;
  summary: string;
  metrics_table: BenchmarkMetric[];
  evidence_quality_trend: {
    day: string;
    strong_evidence: number;
    incomplete_evidence: number;
    contradictory: number;
  }[];
}

export interface RazorpayConnectionStatus {
  mode: string;
  key_id_masked: string;
  connected: boolean;
  webhook_endpoint: string;
  supported_events: string[];
  disclaimer: string;
}
