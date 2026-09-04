import os
import time
from datetime import datetime
from typing import Dict, Any, List, Optional
from .models import FinancialRecord

class RazorpayConnector:
    """
    Razorpay Integration & Simulation Layer for ProofGap AI Finance Controller.
    Supports live Test Mode credentials (via env vars) as well as a Razorpay-Compatible
    Demo Data Connector generating realistic Razorpay v1 API payloads and webhooks.
    """
    def __init__(self):
        self.key_id = os.getenv("RAZORPAY_KEY_ID", "rzp_test_demo_key_99182")
        self.key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
        self.is_live_test_mode = bool(self.key_secret and self.key_secret != "")
        
    def get_connection_status(self) -> Dict[str, Any]:
        return {
            "mode": "Razorpay Test Mode" if self.is_live_test_mode else "Razorpay-Compatible Sandbox Connector",
            "key_id_masked": f"{self.key_id[:8]}...{self.key_id[-4:]}" if len(self.key_id) > 12 else self.key_id,
            "connected": True,
            "webhook_endpoint": "/api/razorpay/webhook",
            "supported_events": [
                "payment.captured",
                "payment.failed",
                "order.paid",
                "settlement.processed",
                "refund.processed"
            ],
            "disclaimer": "Demo sandbox environment with authentic Razorpay API schema compliance."
        }

    def generate_simulated_payment_event(self, amount: float = 5000.0, status: str = "captured") -> Dict[str, Any]:
        """Generates a standard Razorpay webhook event payload."""
        pay_id = f"pay_test_{int(time.time())}"
        ord_id = f"order_test_{int(time.time() + 1)}"
        amount_in_paise = int(amount * 100)
        
        return {
            "entity": "event",
            "account_id": "acc_demo_proofgap",
            "event": "payment.captured" if status == "captured" else "payment.failed",
            "contains": ["payment"],
            "payload": {
                "payment": {
                    "entity": {
                        "id": pay_id,
                        "entity": "payment",
                        "amount": amount_in_paise,
                        "currency": "INR",
                        "status": status,
                        "order_id": ord_id,
                        "invoice_id": None,
                        "international": False,
                        "method": "upi",
                        "amount_refunded": 0,
                        "refund_status": None,
                        "captured": True if status == "captured" else False,
                        "description": "ProofGap Demo Transaction",
                        "card_id": None,
                        "bank": None,
                        "wallet": None,
                        "vpa": "customer@okhdfcbank",
                        "email": "demo.user@proofgap.ai",
                        "contact": "+919876543210",
                        "fee": int(amount_in_paise * 0.02),
                        "tax": int(amount_in_paise * 0.02 * 0.18),
                        "error_code": None,
                        "error_description": None,
                        "created_at": int(time.time())
                    }
                }
            },
            "created_at": int(time.time())
        }

    def convert_razorpay_payload_to_record(self, payload: Dict[str, Any]) -> FinancialRecord:
        """Converts incoming Razorpay payment payload into ProofGap FinancialRecord."""
        pay_entity = payload.get("payload", {}).get("payment", {}).get("entity", payload)
        amt = float(pay_entity.get("amount", 500000)) / 100.0
        
        return FinancialRecord(
            id=f"REC-{pay_entity.get('id', 'pay_sample')}",
            txn_id=pay_entity.get("id", f"pay_{int(time.time())}"),
            order_id=pay_entity.get("order_id", f"order_{int(time.time())}"),
            amount=amt,
            currency=pay_entity.get("currency", "INR"),
            merchant="Razorpay Direct Merchant",
            timestamp=datetime.fromtimestamp(pay_entity.get("created_at", int(time.time()))).strftime("%Y-%m-%d %H:%M:%S"),
            source="Razorpay",
            status=pay_entity.get("status", "captured").upper(),
            reference_id=f"REF-RZP-{pay_entity.get('id', '12345')[-5:]}",
            settlement_id=f"setl_{pay_entity.get('id', '12345')[-5:]}",
            bank_utr=f"UTR{int(time.time())}",
            customer_email=pay_entity.get("email", "merchant@domain.com"),
            payment_method=pay_entity.get("method", "upi").upper(),
            ground_truth_class="PERFECT_MATCH"
        )
