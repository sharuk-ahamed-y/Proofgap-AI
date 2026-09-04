import pytest
from engine.generator import generate_synthetic_dataset
from engine.reconciler import ProofGapReconciler
from engine.models import DecisionEnum

def test_dataset_generation():
    primary, targets = generate_synthetic_dataset(count=100, difficulty="medium")
    assert len(primary) == 100
    assert len(targets) == 100
    assert any(r.txn_id == "TXN-1024" for r in primary)
    assert any(r.txn_id == "TXN-1025" for r in primary)
    assert any(r.txn_id == "TXN-1026" for r in primary)

def test_landmark_scenarios():
    primary, targets = generate_synthetic_dataset(count=50, difficulty="medium")
    reconciler = ProofGapReconciler(targets)
    summary = reconciler.reconcile_batch(primary)
    
    # 1. Test TXN-1024 (Safe)
    rec_1024 = next(r for r in summary.records if r.txn_id == "TXN-1024")
    assert rec_1024.decision == DecisionEnum.SAFE_AUTO_RESOLVE
    assert rec_1024.match_probability >= 90.0
    assert rec_1024.evidence_sufficiency >= 80.0
    assert not rec_1024.contradiction_detected
    
    # 2. Test TXN-1025 (Killer demo: High confidence, low evidence -> Abstain)
    rec_1025 = next(r for r in summary.records if r.txn_id == "TXN-1025")
    assert rec_1025.decision == DecisionEnum.EVIDENCE_INSUFFICIENT
    assert rec_1025.match_probability >= 90.0
    assert rec_1025.evidence_sufficiency < 80.0
    
    # 3. Test TXN-1026 (Contradiction: ₹15k vs ₹10k)
    rec_1026 = next(r for r in summary.records if r.txn_id == "TXN-1026")
    assert rec_1026.decision == DecisionEnum.CONTRADICTORY_EVIDENCE
    assert rec_1026.contradiction_detected

def test_batch_reconciliation_metrics():
    primary, targets = generate_synthetic_dataset(count=250, difficulty="medium")
    reconciler = ProofGapReconciler(targets)
    summary = reconciler.reconcile_batch(primary)
    
    assert summary.total_records == 250
    assert summary.safe_count > 0
    assert summary.review_count > 0
    assert summary.exception_count > 0
    assert summary.automation_safety_score >= 90.0
    assert summary.estimated_risk_avoided > 0
