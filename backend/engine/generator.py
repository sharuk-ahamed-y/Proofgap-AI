import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from .models import FinancialRecord

MERCHANTS = [
    {"name": "Swiggy Express", "variants": ["Swiggy", "Swiggy Delivery", "Bundl Tech Pvt Ltd"]},
    {"name": "Zomato Direct", "variants": ["Zomato", "Zomato Media Pvt Ltd", "ZOMATO_IN"]},
    {"name": "Flipkart Retail", "variants": ["Flipkart", "Flipkart Internet Pvt Ltd", "FK_PAYMENTS"]},
    {"name": "Uber Mobility", "variants": ["Uber India", "Uber Technologies Inc", "UBER_RIDE"]},
    {"name": "Myntra Fashion", "variants": ["Myntra Designs", "Myntra Online", "MYNTRA_RETAIL"]},
    {"name": "Tata Neu Digital", "variants": ["Tata Digital Ltd", "Tata CliQ", "TATA_NEU"]},
    {"name": "Nykaa Lifestyle", "variants": ["FSN E-Commerce", "Nykaa Cosmetics", "NYKAA_DIRECT"]},
    {"name": "Blinkit Quick", "variants": ["Blinkit Commerce", "Grofers India", "BLINKIT_PAY"]},
    {"name": "BookMyShow Movies", "variants": ["Bigtree Entertainment", "BookMyShow App", "BMS_TICKETS"]},
    {"name": "Zepto Delivery", "variants": ["Kiranakart Tech", "Zepto Now", "ZEPTO_QUICK"]}
]

PAYMENT_METHODS = ["UPI", "CREDIT_CARD", "NETBANKING", "DEBIT_CARD", "WALLET"]
SOURCES = ["Razorpay", "ERP_Order", "Settlement_Ledger", "Bank_Statement", "Refund_Log"]

def generate_synthetic_dataset(count: int = 250, difficulty: str = "medium") -> Tuple[List[FinancialRecord], List[FinancialRecord]]:
    """
    Generates realistic synthetic financial records with ground-truth target pairs.
    Returns:
        (primary_records, target_counterpart_records)
    """
    random.seed(42)  # Deterministic seed for reproducible demo data
    
    primary_records: List[FinancialRecord] = []
    target_records: List[FinancialRecord] = []
    
    base_time = datetime(2026, 3, 1, 9, 30, 0)
    
    # Difficulty adjustment ratios
    if difficulty == "easy":
        ratios = {"SAFE": 0.85, "REVIEW": 0.10, "EXCEPTION": 0.05}
    elif difficulty == "hard":
        ratios = {"SAFE": 0.60, "REVIEW": 0.28, "EXCEPTION": 0.12}
    else:  # medium (default)
        ratios = {"SAFE": 0.76, "REVIEW": 0.18, "EXCEPTION": 0.06}
        
    safe_target = int(count * ratios["SAFE"])
    review_target = int(count * ratios["REVIEW"])
    exception_target = count - safe_target - review_target

    # Inject Landmark Demo Scenarios at specific IDs
    # TXN-1024 -> Safe auto-resolve
    # TXN-1025 -> Killer scenario: 94% similarity, 62% evidence, Missing Settlement Ref -> Review
    # TXN-1026 -> Contradiction: ₹15,000 vs ₹10,000 -> Exception
    
    # 1. Landmark Safe (TXN-1024)
    rec_1024_p = FinancialRecord(
        id="REC-1024",
        txn_id="TXN-1024",
        order_id="order_rzp_1024",
        amount=5000.00,
        currency="INR",
        merchant="Flipkart Retail",
        timestamp=(base_time + timedelta(minutes=5)).strftime("%Y-%m-%d %H:%M:%S"),
        source="Razorpay",
        status="CAPTURED",
        reference_id="REF-FK-99201",
        settlement_id="setl_rzp_99201",
        bank_utr="UTR882910394821",
        customer_email="anand.v@gmail.com",
        payment_method="UPI",
        target_match_id="REC-1024-TGT",
        ground_truth_class="PERFECT_MATCH"
    )
    rec_1024_t = FinancialRecord(
        id="REC-1024-TGT",
        txn_id="TXN-1024",
        order_id="order_rzp_1024",
        amount=5000.00,
        currency="INR",
        merchant="Flipkart",
        timestamp=(base_time + timedelta(minutes=6)).strftime("%Y-%m-%d %H:%M:%S"),
        source="Settlement_Ledger",
        status="SETTLED",
        reference_id="REF-FK-99201",
        settlement_id="setl_rzp_99201",
        bank_utr="UTR882910394821",
        customer_email="anand.v@gmail.com",
        payment_method="UPI",
        target_match_id="REC-1024",
        ground_truth_class="PERFECT_MATCH"
    )
    primary_records.append(rec_1024_p)
    target_records.append(rec_1024_t)
    
    # 2. Landmark Review (TXN-1025) — KILLER DEMO SCENARIO
    rec_1025_p = FinancialRecord(
        id="REC-1025",
        txn_id="TXN-1025",
        order_id="order_rzp_1025",
        amount=5000.00,
        currency="INR",
        merchant="Swiggy Express",
        timestamp=(base_time + timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S"),
        source="Razorpay",
        status="CAPTURED",
        reference_id=None,  # Missing reference
        settlement_id=None,  # Missing settlement reference
        bank_utr=None,  # Missing UTR
        customer_email="priya.sharma@outlook.com",
        payment_method="UPI",
        target_match_id="REC-1025-TGT",
        ground_truth_class="MISSING_SETTLEMENT_REF"
    )
    rec_1025_t = FinancialRecord(
        id="REC-1025-TGT",
        txn_id="TXN-1025-ALT",
        order_id="order_rzp_1025",
        amount=5000.00,
        currency="INR",
        merchant="Swiggy",
        timestamp=(base_time + timedelta(minutes=16)).strftime("%Y-%m-%d %H:%M:%S"),
        source="Settlement_Ledger",
        status="SETTLED",
        reference_id=None,
        settlement_id=None,
        bank_utr=None,
        customer_email="priya.sharma@outlook.com",
        payment_method="UPI",
        target_match_id="REC-1025",
        ground_truth_class="MISSING_SETTLEMENT_REF"
    )
    primary_records.append(rec_1025_p)
    target_records.append(rec_1025_t)

    # 3. Landmark Contradiction (TXN-1026)
    rec_1026_p = FinancialRecord(
        id="REC-1026",
        txn_id="TXN-1026",
        order_id="order_rzp_1026",
        amount=15000.00,
        currency="INR",
        merchant="Zomato Direct",
        timestamp=(base_time + timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S"),
        source="Razorpay",
        status="CAPTURED",
        reference_id="REF-ZM-44910",
        settlement_id="setl_rzp_44910",
        bank_utr="UTR449102938102",
        customer_email="rahul.kapoor@company.com",
        payment_method="NETBANKING",
        target_match_id="REC-1026-TGT",
        ground_truth_class="AMOUNT_CONTRADICTION"
    )
    rec_1026_t = FinancialRecord(
        id="REC-1026-TGT",
        txn_id="TXN-1026",
        order_id="order_rzp_1026",
        amount=10000.00,  # Explicit amount contradiction: 15k vs 10k
        currency="INR",
        merchant="Zomato",
        timestamp=(base_time + timedelta(minutes=31)).strftime("%Y-%m-%d %H:%M:%S"),
        source="Settlement_Ledger",
        status="SETTLED",
        reference_id="REF-ZM-44910",
        settlement_id="setl_rzp_44910",
        bank_utr="UTR449102938102",
        customer_email="rahul.kapoor@company.com",
        payment_method="NETBANKING",
        target_match_id="REC-1026",
        ground_truth_class="AMOUNT_CONTRADICTION"
    )
    primary_records.append(rec_1026_p)
    target_records.append(rec_1026_t)

    # Generate remaining records according to quota
    curr_safe = 1
    curr_review = 1
    curr_exception = 1
    
    current_index = 1027
    while len(primary_records) < count:
        scenario_choice = random.choices(
            ["SAFE", "REVIEW", "EXCEPTION"],
            weights=[
                max(0, safe_target - curr_safe),
                max(0, review_target - curr_review),
                max(0, exception_target - curr_exception)
            ]
        )[0]
        
        m_info = random.choice(MERCHANTS)
        m_primary = m_info["name"]
        m_target = random.choice(m_info["variants"])
        
        base_amt = round(random.choice([199, 499, 750, 1299, 2499, 3999, 5000, 7500, 12000, 18500, 24000, 48000]), 2)
        txn_time = base_time + timedelta(minutes=random.randint(40, 1440 * 7))
        time_str_p = txn_time.strftime("%Y-%m-%d %H:%M:%S")
        
        t_id = f"REC-{current_index}"
        t_id_tgt = f"REC-{current_index}-TGT"
        txn_code = f"TXN-{current_index}"
        ord_code = f"order_rzp_{current_index}"
        ref_code = f"REF-{m_primary[:2].upper()}-{random.randint(10000, 99999)}"
        utr_code = f"UTR{random.randint(100000000000, 999999999999)}"
        setl_code = f"setl_rzp_{random.randint(10000, 99999)}"
        email = f"user_{current_index}@demo.domain"
        method = random.choice(PAYMENT_METHODS)
        
        if scenario_choice == "SAFE":
            curr_safe += 1
            # Scenario A: Perfect or minor time drift with full verified evidence
            time_str_t = (txn_time + timedelta(minutes=random.randint(1, 15))).strftime("%Y-%m-%d %H:%M:%S")
            
            p_rec = FinancialRecord(
                id=t_id,
                txn_id=txn_code,
                order_id=ord_code,
                amount=base_amt,
                currency="INR",
                merchant=m_primary,
                timestamp=time_str_p,
                source="Razorpay",
                status="CAPTURED",
                reference_id=ref_code,
                settlement_id=setl_code,
                bank_utr=utr_code,
                customer_email=email,
                payment_method=method,
                target_match_id=t_id_tgt,
                ground_truth_class="PERFECT_MATCH"
            )
            t_rec = FinancialRecord(
                id=t_id_tgt,
                txn_id=txn_code,
                order_id=ord_code,
                amount=base_amt,
                currency="INR",
                merchant=m_target,
                timestamp=time_str_t,
                source="Settlement_Ledger",
                status="SETTLED",
                reference_id=ref_code,
                settlement_id=setl_code,
                bank_utr=utr_code,
                customer_email=email,
                payment_method=method,
                target_match_id=t_id,
                ground_truth_class="PERFECT_MATCH"
            )
            
        elif scenario_choice == "REVIEW":
            curr_review += 1
            # Scenarios: Missing settlement reference, duplicate candidates, ambiguous merchant
            sub_type = random.choice(["MISSING_SETTLEMENT_REF", "DUPLICATE_CANDIDATE", "AMBIGUOUS_MERCHANT"])
            time_str_t = (txn_time + timedelta(hours=random.randint(2, 48))).strftime("%Y-%m-%d %H:%M:%S")
            
            p_rec = FinancialRecord(
                id=t_id,
                txn_id=txn_code,
                order_id=ord_code,
                amount=base_amt,
                currency="INR",
                merchant=m_primary,
                timestamp=time_str_p,
                source="Razorpay",
                status="CAPTURED",
                reference_id=ref_code if sub_type != "MISSING_SETTLEMENT_REF" else None,
                settlement_id=None,  # Missing settlement
                bank_utr=None,  # Missing UTR
                customer_email=email,
                payment_method=method,
                target_match_id=t_id_tgt,
                ground_truth_class=sub_type
            )
            t_rec = FinancialRecord(
                id=t_id_tgt,
                txn_id=f"{txn_code}-ALT",
                order_id=ord_code if sub_type != "AMBIGUOUS_MERCHANT" else f"{ord_code}_diff",
                amount=base_amt,
                currency="INR",
                merchant=m_target,
                timestamp=time_str_t,
                source="Bank_Statement",
                status="PROCESSED",
                reference_id=None,
                settlement_id=None,
                bank_utr=None,
                customer_email=email,
                payment_method=method,
                target_match_id=t_id,
                ground_truth_class=sub_type
            )
            
        else:  # EXCEPTION
            curr_exception += 1
            # Scenarios: Amount Conflict, Status Mismatch, Unresolved Chargeback
            sub_type = random.choice(["AMOUNT_CONTRADICTION", "STATUS_CONFLICT", "SPLIT_FEE_MISMATCH"])
            time_str_t = (txn_time + timedelta(minutes=random.randint(1, 30))).strftime("%Y-%m-%d %H:%M:%S")
            
            target_amount = base_amt
            if sub_type == "AMOUNT_CONTRADICTION":
                # Significant difference (e.g. ₹15,000 vs ₹10,000 or ₹5,000 vs ₹3,500)
                target_amount = round(base_amt * random.choice([0.65, 0.75, 1.25, 1.5]), 2)
            elif sub_type == "SPLIT_FEE_MISMATCH":
                target_amount = round(base_amt - 450.0, 2)
                
            p_rec = FinancialRecord(
                id=t_id,
                txn_id=txn_code,
                order_id=ord_code,
                amount=base_amt,
                currency="INR",
                merchant=m_primary,
                timestamp=time_str_p,
                source="Razorpay",
                status="CAPTURED",
                reference_id=ref_code,
                settlement_id=setl_code,
                bank_utr=utr_code,
                customer_email=email,
                payment_method=method,
                target_match_id=t_id_tgt,
                ground_truth_class=sub_type
            )
            t_rec = FinancialRecord(
                id=t_id_tgt,
                txn_id=txn_code,
                order_id=ord_code,
                amount=target_amount,
                currency="INR",
                merchant=m_target,
                timestamp=time_str_t,
                source="Settlement_Ledger",
                status="FAILED" if sub_type == "STATUS_CONFLICT" else "SETTLED",
                reference_id=ref_code,
                settlement_id=setl_code,
                bank_utr=utr_code,
                customer_email=email,
                payment_method=method,
                target_match_id=t_id,
                ground_truth_class=sub_type
            )
            
        primary_records.append(p_rec)
        target_records.append(t_rec)
        current_index += 1

    return primary_records, target_records
