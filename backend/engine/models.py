from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class DecisionEnum(str, Enum):
    SAFE_AUTO_RESOLVE = "SAFE_AUTO_RESOLVE"
    EVIDENCE_INSUFFICIENT = "EVIDENCE_INSUFFICIENT"
    CONTRADICTORY_EVIDENCE = "CONTRADICTORY_EVIDENCE"

class EvidenceStatus(str, Enum):
    VERIFIED = "VERIFIED"
    MISSING = "MISSING"
    CONFLICT = "CONFLICT"
    WEAK = "WEAK"

class EvidenceWeight(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class FinancialRecord(BaseModel):
    id: str
    txn_id: str
    order_id: Optional[str] = None
    amount: float
    currency: str = "INR"
    merchant: str
    timestamp: str
    source: str = "Razorpay"  # Razorpay, ERP, Settlement, Bank_Statement, Refund
    status: str = "CAPTURED"
    reference_id: Optional[str] = None
    settlement_id: Optional[str] = None
    bank_utr: Optional[str] = None
    customer_email: Optional[str] = None
    payment_method: str = "UPI"
    target_match_id: Optional[str] = None
    ground_truth_class: Optional[str] = None  # "PERFECT_MATCH", "MISSING_SETTLEMENT", "AMOUNT_CONFLICT", etc.

class EvidenceItem(BaseModel):
    category: str
    title: str
    status: EvidenceStatus
    weight: EvidenceWeight
    score: float  # 0 to 100
    description: str
    is_risk_factor: bool = False

class CandidateMatch(BaseModel):
    candidate_id: str
    candidate_txn_id: str
    candidate_source: str
    amount: float
    merchant: str
    timestamp: str
    similarity_score: float
    amount_match: bool
    ref_match: bool

class ReconciliationResult(BaseModel):
    record_id: str
    txn_id: str
    order_id: Optional[str] = None
    merchant: str
    amount: float
    currency: str = "INR"
    source: str
    timestamp: str
    status: str
    
    # Core ProofGap AI Metrics
    match_probability: float  # 0.0 - 100.0
    evidence_sufficiency: float  # 0.0 - 100.0
    uncertainty_score: float  # 0.0 - 100.0
    uncertainty_level: str  # LOW, MEDIUM, HIGH
    contradiction_detected: bool
    contradiction_details: List[str] = []
    
    # Selective Automation Decision
    decision: DecisionEnum
    decision_badge: str  # 🟢 Safe, 🟡 Review, 🔴 Exception
    decision_reason: str
    rule_triggered: str
    
    # Detailed Evidence Breakdown
    evidence_items: List[EvidenceItem] = []
    candidates: List[CandidateMatch] = []
    best_candidate_id: Optional[str] = None
    candidate_margin: float = 0.0
    
    # Financial Impact & Ground Truth
    estimated_risk_avoided: float = 0.0
    ground_truth_class: Optional[str] = None
    traditional_decision: str = "AUTOMATE"
    generic_ai_decision: str = "AUTOMATE"

class AuditLogEntry(BaseModel):
    timestamp: str
    phase: str
    action: str
    detail: str
    evidence_context: Optional[str] = None
    status: str  # SUCCESS, WARNING, DANGER, INFO

class BatchAnalysisSummary(BaseModel):
    total_records: int
    safe_count: int
    review_count: int
    exception_count: int
    safe_rate: float
    review_rate: float
    exception_rate: float
    automation_safety_score: float
    unsafe_automation_rate: float
    correct_abstention_rate: float
    false_match_rate: float
    review_efficiency: float
    estimated_risk_avoided: float
    records: List[ReconciliationResult]
    audit_trail: List[AuditLogEntry]

class DemoScenario(BaseModel):
    id: str
    scenario_number: int
    title: str
    subtitle: str
    scenario_type: str  # SAFE, ABSTAIN, EXCEPTION
    highlight_tag: str
    payment_record: Dict[str, Any]
    matched_record: Dict[str, Any]
    match_probability: float
    evidence_sufficiency: float
    uncertainty: str
    decision: str
    decision_reason: str
    traditional_ai_decision: str
    proofgap_ai_decision: str
    evidence_breakdown: List[EvidenceItem]
    key_takeaway: str
