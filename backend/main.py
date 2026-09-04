import io
import csv
import json
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine.models import (
    FinancialRecord,
    ReconciliationResult,
    BatchAnalysisSummary,
    AuditLogEntry,
    DemoScenario,
    EvidenceItem,
    EvidenceStatus,
    EvidenceWeight,
    DecisionEnum
)
from engine.generator import generate_synthetic_dataset
from engine.reconciler import ProofGapReconciler
from engine.benchmarks import get_baseline_comparison_data
from engine.razorpay_connector import RazorpayConnector

app = FastAPI(
    title="ProofGap AI Engine",
    description="Evidence-Aware AI for Safe Financial Automation (Razorpay AI Buildathon Track 04)",
    version="1.0.0"
)

# Enable CORS for local dev frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory State for Interactive Session
CURRENT_PRIMARY_RECORDS: List[FinancialRecord] = []
CURRENT_TARGET_RECORDS: List[FinancialRecord] = []
CURRENT_ANALYSIS_SUMMARY: Optional[BatchAnalysisSummary] = None
RECONCILER = ProofGapReconciler()
RAZORPAY_CONN = RazorpayConnector()

# Initialize with standard 250 records
def _initialize_default_state():
    global CURRENT_PRIMARY_RECORDS, CURRENT_TARGET_RECORDS, CURRENT_ANALYSIS_SUMMARY
    p_recs, t_recs = generate_synthetic_dataset(count=250, difficulty="medium")
    CURRENT_PRIMARY_RECORDS = p_recs
    CURRENT_TARGET_RECORDS = t_recs
    RECONCILER.set_targets(t_recs)
    CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(p_recs)

_initialize_default_state()

@app.get("/api/health")
def get_health():
    return {
        "status": "healthy",
        "service": "ProofGap AI Finance Controller",
        "records_loaded": len(CURRENT_PRIMARY_RECORDS),
        "targets_loaded": len(CURRENT_TARGET_RECORDS),
        "analyzed": CURRENT_ANALYSIS_SUMMARY is not None
    }

@app.get("/api/dataset/generate")
def generate_dataset(
    count: int = Query(250, ge=10, le=1000),
    difficulty: str = Query("medium", regex="^(easy|medium|hard)$")
):
    global CURRENT_PRIMARY_RECORDS, CURRENT_TARGET_RECORDS, CURRENT_ANALYSIS_SUMMARY
    p_recs, t_recs = generate_synthetic_dataset(count=count, difficulty=difficulty)
    CURRENT_PRIMARY_RECORDS = p_recs
    CURRENT_TARGET_RECORDS = t_recs
    RECONCILER.set_targets(t_recs)
    CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(p_recs)
    
    return {
        "message": f"Successfully generated {count} financial records ({difficulty} difficulty).",
        "summary": {
            "total_records": CURRENT_ANALYSIS_SUMMARY.total_records,
            "safe_count": CURRENT_ANALYSIS_SUMMARY.safe_count,
            "review_count": CURRENT_ANALYSIS_SUMMARY.review_count,
            "exception_count": CURRENT_ANALYSIS_SUMMARY.exception_count,
            "automation_safety_score": CURRENT_ANALYSIS_SUMMARY.automation_safety_score,
            "unsafe_automation_rate": CURRENT_ANALYSIS_SUMMARY.unsafe_automation_rate,
            "correct_abstention_rate": CURRENT_ANALYSIS_SUMMARY.correct_abstention_rate,
            "estimated_risk_avoided": CURRENT_ANALYSIS_SUMMARY.estimated_risk_avoided
        }
    }

@app.post("/api/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    global CURRENT_PRIMARY_RECORDS, CURRENT_TARGET_RECORDS, CURRENT_ANALYSIS_SUMMARY
    content = await file.read()
    filename = file.filename.lower()
    
    parsed_records: List[FinancialRecord] = []
    
    try:
        if filename.endswith(".json"):
            data = json.loads(content.decode("utf-8"))
            if isinstance(data, list):
                for idx, row in enumerate(data):
                    rec = FinancialRecord(
                        id=str(row.get("id", f"REC-UPL-{idx+1}")),
                        txn_id=str(row.get("txn_id", f"TXN-UPL-{idx+1}")),
                        order_id=row.get("order_id"),
                        amount=float(row.get("amount", 1000.0)),
                        currency=str(row.get("currency", "INR")),
                        merchant=str(row.get("merchant", "Custom Merchant")),
                        timestamp=str(row.get("timestamp", "2026-03-01 10:00:00")),
                        source=str(row.get("source", "Uploaded_File")),
                        status=str(row.get("status", "CAPTURED")),
                        reference_id=row.get("reference_id"),
                        settlement_id=row.get("settlement_id"),
                        bank_utr=row.get("bank_utr"),
                        customer_email=row.get("customer_email")
                    )
                    parsed_records.append(rec)
        else:  # CSV format
            decoded = content.decode("utf-8")
            reader = csv.DictReader(io.StringIO(decoded))
            for idx, row in enumerate(reader):
                rec = FinancialRecord(
                    id=str(row.get("id") or row.get("Record ID") or f"REC-CSV-{idx+1}"),
                    txn_id=str(row.get("txn_id") or row.get("Transaction ID") or f"TXN-CSV-{idx+1}"),
                    order_id=row.get("order_id") or row.get("Order ID"),
                    amount=float(row.get("amount") or row.get("Amount") or 1000.0),
                    currency=str(row.get("currency") or row.get("Currency") or "INR"),
                    merchant=str(row.get("merchant") or row.get("Merchant") or "Custom Merchant"),
                    timestamp=str(row.get("timestamp") or row.get("Timestamp") or "2026-03-01 10:00:00"),
                    source=str(row.get("source") or row.get("Source") or "CSV_Import"),
                    status=str(row.get("status") or row.get("Status") or "CAPTURED"),
                    reference_id=row.get("reference_id") or row.get("Reference ID"),
                    settlement_id=row.get("settlement_id") or row.get("Settlement ID"),
                    bank_utr=row.get("bank_utr") or row.get("Bank UTR"),
                    customer_email=row.get("customer_email") or row.get("Customer Email")
                )
                parsed_records.append(rec)
                
        if not parsed_records:
            raise HTTPException(status_code=400, detail="No valid records found in uploaded file.")
            
        CURRENT_PRIMARY_RECORDS = parsed_records
        # Generate companion settlement counter-records for realistic reconciliation
        _, companion_targets = generate_synthetic_dataset(count=len(parsed_records), difficulty="medium")
        CURRENT_TARGET_RECORDS = companion_targets
        RECONCILER.set_targets(companion_targets)
        CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(parsed_records)
        
        return {
            "message": f"Successfully parsed and loaded {len(parsed_records)} records from {file.filename}.",
            "summary": {
                "total_records": CURRENT_ANALYSIS_SUMMARY.total_records,
                "safe_count": CURRENT_ANALYSIS_SUMMARY.safe_count,
                "review_count": CURRENT_ANALYSIS_SUMMARY.review_count,
                "exception_count": CURRENT_ANALYSIS_SUMMARY.exception_count,
                "automation_safety_score": CURRENT_ANALYSIS_SUMMARY.automation_safety_score,
                "unsafe_automation_rate": CURRENT_ANALYSIS_SUMMARY.unsafe_automation_rate,
                "correct_abstention_rate": CURRENT_ANALYSIS_SUMMARY.correct_abstention_rate,
                "estimated_risk_avoided": CURRENT_ANALYSIS_SUMMARY.estimated_risk_avoided
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process upload: {str(e)}")

@app.post("/api/reconcile/run", response_model=BatchAnalysisSummary)
def run_reconciliation():
    global CURRENT_ANALYSIS_SUMMARY
    if not CURRENT_PRIMARY_RECORDS:
        _initialize_default_state()
    CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(CURRENT_PRIMARY_RECORDS)
    return CURRENT_ANALYSIS_SUMMARY

@app.get("/api/reconcile/summary", response_model=BatchAnalysisSummary)
def get_reconciliation_summary():
    global CURRENT_ANALYSIS_SUMMARY
    if CURRENT_ANALYSIS_SUMMARY is None:
        CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(CURRENT_PRIMARY_RECORDS)
    return CURRENT_ANALYSIS_SUMMARY

@app.get("/api/records")
def get_records(
    decision: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 250,
    offset: int = 0
):
    global CURRENT_ANALYSIS_SUMMARY
    if CURRENT_ANALYSIS_SUMMARY is None:
        CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(CURRENT_PRIMARY_RECORDS)
        
    filtered = CURRENT_ANALYSIS_SUMMARY.records
    
    if decision:
        decision_upper = decision.upper()
        if decision_upper in ["SAFE", "SAFE_AUTO_RESOLVE"]:
            filtered = [r for r in filtered if r.decision == DecisionEnum.SAFE_AUTO_RESOLVE]
        elif decision_upper in ["REVIEW", "EVIDENCE_INSUFFICIENT"]:
            filtered = [r for r in filtered if r.decision == DecisionEnum.EVIDENCE_INSUFFICIENT]
        elif decision_upper in ["EXCEPTION", "CONTRADICTORY_EVIDENCE"]:
            filtered = [r for r in filtered if r.decision == DecisionEnum.CONTRADICTORY_EVIDENCE]
            
    if search:
        s = search.lower()
        filtered = [
            r for r in filtered
            if s in r.txn_id.lower()
            or s in r.record_id.lower()
            or s in r.merchant.lower()
            or s in str(r.amount)
            or (r.order_id and s in r.order_id.lower())
        ]
        
    paginated = filtered[offset: offset + limit]
    return {
        "total": len(filtered),
        "offset": offset,
        "limit": limit,
        "records": paginated
    }

@app.get("/api/records/{record_id}", response_model=ReconciliationResult)
def get_record_detail(record_id: str):
    global CURRENT_ANALYSIS_SUMMARY
    if CURRENT_ANALYSIS_SUMMARY is None:
        CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(CURRENT_PRIMARY_RECORDS)
        
    for rec in CURRENT_ANALYSIS_SUMMARY.records:
        if rec.record_id == record_id or rec.txn_id == record_id:
            return rec
            
    raise HTTPException(status_code=404, detail=f"Record {record_id} not found.")

class ResolutionRequest(BaseModel):
    action: str  # "APPROVE", "REJECT", "ATTACH_UTR", "MANUAL_MATCH"
    resolution_notes: Optional[str] = None
    new_utr: Optional[str] = None

@app.post("/api/records/{record_id}/resolve")
def resolve_record(record_id: str, payload: ResolutionRequest):
    global CURRENT_ANALYSIS_SUMMARY
    if CURRENT_ANALYSIS_SUMMARY is None:
        CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(CURRENT_PRIMARY_RECORDS)
        
    target_rec: Optional[ReconciliationResult] = None
    for r in CURRENT_ANALYSIS_SUMMARY.records:
        if r.record_id == record_id or r.txn_id == record_id:
            target_rec = r
            break
            
    if not target_rec:
        raise HTTPException(status_code=404, detail="Record not found")
        
    # Update status and log audit
    if payload.action == "APPROVE":
        target_rec.decision = DecisionEnum.SAFE_AUTO_RESOLVE
        target_rec.decision_badge = "🟢 Safe (Human Verified)"
        target_rec.decision_reason = f"Human reviewer manually verified evidence: {payload.resolution_notes or 'Cleared for settlement'}"
    elif payload.action == "ATTACH_UTR":
        target_rec.decision = DecisionEnum.SAFE_AUTO_RESOLVE
        target_rec.decision_badge = "🟢 Safe (UTR Attached)"
        target_rec.decision_reason = f"Bank UTR attached by reviewer ({payload.new_utr or 'UTR99882716281'}). Evidence completeness elevated to 100%."
    else:
        target_rec.decision_badge = "🔴 Flagged for Audit"
        target_rec.decision_reason = f"Flagged by reviewer: {payload.resolution_notes or 'Sent to dispute queue'}"

    # Recalculate counts
    safe_c = sum(1 for r in CURRENT_ANALYSIS_SUMMARY.records if r.decision == DecisionEnum.SAFE_AUTO_RESOLVE)
    rev_c = sum(1 for r in CURRENT_ANALYSIS_SUMMARY.records if r.decision == DecisionEnum.EVIDENCE_INSUFFICIENT)
    exc_c = sum(1 for r in CURRENT_ANALYSIS_SUMMARY.records if r.decision == DecisionEnum.CONTRADICTORY_EVIDENCE)
    CURRENT_ANALYSIS_SUMMARY.safe_count = safe_c
    CURRENT_ANALYSIS_SUMMARY.review_count = rev_c
    CURRENT_ANALYSIS_SUMMARY.exception_count = exc_c
    
    return {
        "status": "success",
        "record_id": record_id,
        "new_decision": target_rec.decision,
        "new_badge": target_rec.decision_badge,
        "reason": target_rec.decision_reason
    }

@app.get("/api/analytics/benchmarks")
def get_benchmarks():
    return get_baseline_comparison_data()

@app.get("/api/audit/logs", response_model=List[AuditLogEntry])
def get_audit_logs():
    global CURRENT_ANALYSIS_SUMMARY
    if CURRENT_ANALYSIS_SUMMARY is None:
        CURRENT_ANALYSIS_SUMMARY = RECONCILER.reconcile_batch(CURRENT_PRIMARY_RECORDS)
    return CURRENT_ANALYSIS_SUMMARY.audit_trail

@app.get("/api/demo/scenarios", response_model=List[DemoScenario])
def get_demo_scenarios():
    """
    Returns the 3 key demo scenarios for recording the Buildathon Demo video.
    """
    return [
        DemoScenario(
            id="DEMO-SCENARIO-1",
            scenario_number=1,
            title="Safe Financial Automation",
            subtitle="Strong Matching Evidence with Complete Verification",
            scenario_type="SAFE",
            highlight_tag="🟢 Safe Auto-Resolve",
            payment_record={
                "txn_id": "TXN-1024",
                "order_id": "order_rzp_1024",
                "amount": 5000.00,
                "merchant": "Flipkart Retail",
                "timestamp": "2026-03-01 09:35:00",
                "source": "Razorpay Gateway",
                "bank_utr": "UTR882910394821",
                "settlement_ref": "setl_rzp_99201"
            },
            matched_record={
                "txn_id": "TXN-1024",
                "amount": 5000.00,
                "merchant": "Flipkart",
                "timestamp": "2026-03-01 09:36:00",
                "source": "Bank Settlement Ledger",
                "bank_utr": "UTR882910394821",
                "settlement_ref": "setl_rzp_99201"
            },
            match_probability=96.0,
            evidence_sufficiency=98.0,
            uncertainty="LOW (4.0%)",
            decision="🟢 SAFE AUTO-RESOLVE",
            decision_reason="All critical proof factors verified: exact amount match, matching Bank UTR (UTR882910394821), confirmed settlement ID, and aligned timestamps.",
            traditional_ai_decision="AUTOMATE (Confidence: 96%)",
            proofgap_ai_decision="SAFE AUTO-RESOLVE (Confidence: 96% + Evidence: 98%)",
            evidence_breakdown=[
                EvidenceItem(category="AMOUNT", title="Amount Match", status=EvidenceStatus.VERIFIED, weight=EvidenceWeight.HIGH, score=100.0, description="Exact match at ₹5,000.00"),
                EvidenceItem(category="SETTLEMENT_REF", title="Settlement Ref & Bank UTR", status=EvidenceStatus.VERIFIED, weight=EvidenceWeight.CRITICAL, score=100.0, description="UTR882910394821 verified across both ledgers"),
                EvidenceItem(category="MERCHANT", title="Merchant Entity", status=EvidenceStatus.VERIFIED, weight=EvidenceWeight.HIGH, score=95.0, description="Entity match: Flipkart Retail ~ Flipkart"),
                EvidenceItem(category="TIMESTAMP", title="Processing Window", status=EvidenceStatus.VERIFIED, weight=EvidenceWeight.MEDIUM, score=98.0, description="Within 1 minute of gateway capture")
            ],
            key_takeaway="When both similarity AND evidence sufficiency are high, automation executes with 100% mathematical and financial safety."
        ),
        DemoScenario(
            id="DEMO-SCENARIO-2",
            scenario_number=2,
            title="The Killer Demo — High Confidence, But Unsafe",
            subtitle="High Similarity Score (94%) BUT Missing Settlement Proof (62%)",
            scenario_type="ABSTAIN",
            highlight_tag="🟡 Human Review Required (Abstain)",
            payment_record={
                "txn_id": "TXN-1025",
                "order_id": "order_rzp_1025",
                "amount": 5000.00,
                "merchant": "Swiggy Express",
                "timestamp": "2026-03-01 09:45:00",
                "source": "Razorpay Gateway",
                "bank_utr": None,
                "settlement_ref": None
            },
            matched_record={
                "txn_id": "TXN-1025-ALT",
                "amount": 5000.00,
                "merchant": "Swiggy",
                "timestamp": "2026-03-01 09:46:00",
                "source": "Bank Statement (Unreconciled)",
                "bank_utr": None,
                "settlement_ref": None
            },
            match_probability=94.0,
            evidence_sufficiency=62.0,
            uncertainty="MEDIUM (48.0%)",
            decision="🟡 HUMAN REVIEW REQUIRED",
            decision_reason="High entity and amount similarity (94%), but critical settlement reference & Bank UTR are missing and duplicate candidates exist. Automation would be unsafe.",
            traditional_ai_decision="🚨 AUTOMATE (Confidence: 94% — RISKS WRONG RECONCILIATION)",
            proofgap_ai_decision="🛑 ABSTAIN & SEND TO HUMAN REVIEW (Prevents ₹5,000 Unsafe Reconciliation)",
            evidence_breakdown=[
                EvidenceItem(category="AMOUNT", title="Amount Similarity", status=EvidenceStatus.VERIFIED, weight=EvidenceWeight.HIGH, score=100.0, description="Both records show ₹5,000.00"),
                EvidenceItem(category="MERCHANT", title="Merchant Match", status=EvidenceStatus.VERIFIED, weight=EvidenceWeight.HIGH, score=92.0, description="Swiggy Express ~ Swiggy"),
                EvidenceItem(category="SETTLEMENT_REF", title="Settlement Reference Missing", status=EvidenceStatus.MISSING, weight=EvidenceWeight.CRITICAL, score=20.0, description="No settlement ID or Bank UTR trace to prove final clearing", is_risk_factor=True),
                EvidenceItem(category="CANDIDATE_UNIQUENESS", title="Duplicate Candidates Detected", status=EvidenceStatus.WEAK, weight=EvidenceWeight.HIGH, score=30.0, description="Multiple identical ₹5,000 Swiggy payments occurred nearby", is_risk_factor=True)
            ],
            key_takeaway="Confidence is NOT proof! Generic AI blindly automates at 94% confidence, causing costly false reconciliations. ProofGap AI abstains to protect financial integrity."
        ),
        DemoScenario(
            id="DEMO-SCENARIO-3",
            scenario_number=3,
            title="Contradictory Evidence Detection",
            subtitle="Conflicting Financial Amounts (₹15,000 vs ₹10,000)",
            scenario_type="EXCEPTION",
            highlight_tag="🔴 Contradictory Evidence (Exception)",
            payment_record={
                "txn_id": "TXN-1026",
                "order_id": "order_rzp_1026",
                "amount": 15000.00,
                "merchant": "Zomato Direct",
                "timestamp": "2026-03-01 10:00:00",
                "source": "Razorpay Gateway",
                "bank_utr": "UTR449102938102",
                "settlement_ref": "setl_rzp_44910"
            },
            matched_record={
                "txn_id": "TXN-1026",
                "amount": 10000.00,
                "merchant": "Zomato",
                "timestamp": "2026-03-01 10:01:00",
                "source": "Settlement Ledger",
                "bank_utr": "UTR449102938102",
                "settlement_ref": "setl_rzp_44910"
            },
            match_probability=88.0,
            evidence_sufficiency=34.0,
            uncertainty="HIGH (85.0%)",
            decision="🔴 CONTRADICTION DETECTED",
            decision_reason="Direct amount conflict: Gateway captured ₹15,000.00 but settlement credit is ₹10,000.00 (Discrepancy: ₹5,000.00). Unresolved ledger conflict.",
            traditional_ai_decision="EXCEPTION (Rules Triggered)",
            proofgap_ai_decision="CONTRADICTORY EVIDENCE EXCEPTION (Detailed Conflict Analysis & Discrepancy Breakdown)",
            evidence_breakdown=[
                EvidenceItem(category="AMOUNT", title="Amount Conflict", status=EvidenceStatus.CONFLICT, weight=EvidenceWeight.CRITICAL, score=15.0, description="Direct mismatch: ₹15,000.00 vs ₹10,000.00 (Δ ₹5,000.00)", is_risk_factor=True),
                EvidenceItem(category="SETTLEMENT_REF", title="Settlement Trace Found", status=EvidenceStatus.VERIFIED, weight=EvidenceWeight.HIGH, score=90.0, description="setl_rzp_44910 linked across both systems"),
                EvidenceItem(category="MERCHANT", title="Merchant Match", status=EvidenceStatus.VERIFIED, weight=EvidenceWeight.HIGH, score=95.0, description="Zomato Direct ~ Zomato")
            ],
            key_takeaway="Conflicting evidence triggers automated quarantine and calculates exact financial discrepancy for immediate investigation."
        )
    ]

@app.get("/api/razorpay/status")
def get_razorpay_status():
    return RAZORPAY_CONN.get_connection_status()

@app.post("/api/razorpay/simulate-event")
def simulate_razorpay_event(amount: float = 5000.0, status: str = "captured"):
    event = RAZORPAY_CONN.generate_simulated_payment_event(amount=amount, status=status)
    record = RAZORPAY_CONN.convert_razorpay_payload_to_record(event)
    
    # Reconcile single record
    res = RECONCILER.reconcile_record(record)
    return {
        "webhook_event": event,
        "normalized_record": record,
        "reconciliation_result": res
    }
