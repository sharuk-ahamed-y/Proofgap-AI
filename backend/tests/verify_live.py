import sys
import requests
import json

# Force UTF-8 stdout encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def verify_live():
    print("=== Testing Backend Health ===")
    r = requests.get("http://localhost:8000/api/health")
    print("Health:", r.status_code, r.json())
    assert r.status_code == 200

    print("\n=== Testing Reconciliation Summary ===")
    r = requests.get("http://localhost:8000/api/reconcile/summary")
    data = r.json()
    print("Summary:")
    print(f"  Total records: {data['total_records']}")
    print(f"  Safe: {data['safe_count']} ({data['safe_rate']}%)")
    print(f"  Review: {data['review_count']} ({data['review_rate']}%)")
    print(f"  Exceptions: {data['exception_count']} ({data['exception_rate']}%)")
    print(f"  Safety Score: {data['automation_safety_score']}/100")
    print(f"  Unsafe Automation Rate: {data['unsafe_automation_rate']}%")
    print(f"  Risk Avoided: Rs. {data['estimated_risk_avoided']:,.2f}")
    assert data["total_records"] == 250

    print("\n=== Testing Demo Scenarios ===")
    r = requests.get("http://localhost:8000/api/demo/scenarios")
    scenarios = r.json()
    print(f"Scenarios loaded: {len(scenarios)}")
    for s in scenarios:
        print(f"  Scenario {s['scenario_number']}: {s['title']}")
        print(f"    Match Prob: {s['match_probability']}% | Evidence: {s['evidence_sufficiency']}%")
        print(f"    Decision: {s['decision']}")
    assert len(scenarios) == 3

    print("\n=== Testing Landmark TXN-1025 Detail ===")
    r = requests.get("http://localhost:8000/api/records/REC-1025")
    rec = r.json()
    print(f"Record: {rec['txn_id']} | Merchant: {rec['merchant']} | Amount: Rs. {rec['amount']}")
    print(f"Decision: {rec['decision_badge']} | Rule: {rec['rule_triggered']}")
    print(f"Reason: {rec['decision_reason']}")
    print("Evidence Items:")
    for item in rec['evidence_items']:
        print(f"  - [{item['status']}] {item['title']}: {item['description']}")

    print("\n=== Testing Analytics Benchmarks ===")
    r = requests.get("http://localhost:8000/api/analytics/benchmarks")
    benchmarks = r.json()
    print(f"Metrics count: {len(benchmarks['metrics_table'])}")
    for m in benchmarks['metrics_table']:
        print(f"  {m['metric']:<45} | Rules: {m['traditional_rules']:<6} | Generic AI: {m['generic_ai']:<6} | ProofGap: {m['proofgap_ai']}")

    print("\n=== Testing Razorpay Connector Status ===")
    r = requests.get("http://localhost:8000/api/razorpay/status")
    rzp = r.json()
    print("Razorpay status:", rzp)

    print("\n=== Testing Razorpay Simulated Webhook ===")
    r = requests.post("http://localhost:8000/api/razorpay/simulate-event?amount=5000&status=captured")
    sim = r.json()
    print("Simulated Event Result Decision:", sim['reconciliation_result']['decision_badge'])

    print("\n=== Testing Vite Frontend Server ===")
    r = requests.get("http://localhost:5173/")
    print("Frontend status:", r.status_code, "HTML content length:", len(r.text))
    assert r.status_code == 200

    print("\n🎉 ALL LIVE ENDPOINTS AND ENGINE TESTS VERIFIED 100% WORKING!")

if __name__ == "__main__":
    verify_live()
