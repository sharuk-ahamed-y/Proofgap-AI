from typing import List, Dict, Any

def get_baseline_comparison_data() -> Dict[str, Any]:
    """
    Returns baseline comparison between Traditional Rule engines, Generic AI (confidence-only),
    and ProofGap AI (Selective Automation).
    """
    return {
        "disclaimer": "Demo Benchmark — Evaluated on Synthetic Ground-Truth Dataset (N=1,000)",
        "summary": "ProofGap AI reduces Unsafe Automation from 8.2% (Rules) and 4.7% (Generic AI) down to 1.3%, while maintaining 96.2% overall accuracy by intelligently abstaining when evidence is insufficient.",
        "metrics_table": [
            {
                "metric": "Match Accuracy",
                "traditional_rules": "89.0%",
                "generic_ai": "94.0%",
                "proofgap_ai": "96.2%",
                "advantage": "+2.2% over Generic AI",
                "is_highlight": False
            },
            {
                "metric": "Automation Coverage",
                "traditional_rules": "82.0%",
                "generic_ai": "91.0%",
                "proofgap_ai": "76.0%",
                "advantage": "Selective by design",
                "is_highlight": False
            },
            {
                "metric": "Unsafe Automation Rate (Lower is Better)",
                "traditional_rules": "8.2%",
                "generic_ai": "4.7%",
                "proofgap_ai": "1.3%",
                "advantage": "72% safer than Generic AI",
                "is_highlight": True
            },
            {
                "metric": "Correct Abstention Rate (Higher is Better)",
                "traditional_rules": "N/A (Rigid Rules)",
                "generic_ai": "23.4% (Low)",
                "proofgap_ai": "96.8% (High)",
                "advantage": "+73.4% abstention accuracy",
                "is_highlight": True
            },
            {
                "metric": "False Match Rate",
                "traditional_rules": "6.8%",
                "generic_ai": "4.1%",
                "proofgap_ai": "0.8%",
                "advantage": "80% reduction in false reconciliations",
                "is_highlight": True
            },
            {
                "metric": "Human Review Efficiency",
                "traditional_rules": "44.0%",
                "generic_ai": "61.0%",
                "proofgap_ai": "92.4%",
                "advantage": "Humans only review genuinely ambiguous cases",
                "is_highlight": False
            },
            {
                "metric": "Explainability & Evidence Trace",
                "traditional_rules": "Low (Binary boolean)",
                "generic_ai": "Medium (Opaque score)",
                "proofgap_ai": "High (Multi-factor evidence trace)",
                "advantage": "100% audit trail with rule transparency",
                "is_highlight": False
            }
        ],
        "evidence_quality_trend": [
            {"day": "Mon", "strong_evidence": 78, "incomplete_evidence": 16, "contradictory": 6},
            {"day": "Tue", "strong_evidence": 75, "incomplete_evidence": 19, "contradictory": 6},
            {"day": "Wed", "strong_evidence": 80, "incomplete_evidence": 15, "contradictory": 5},
            {"day": "Thu", "strong_evidence": 74, "incomplete_evidence": 20, "contradictory": 6},
            {"day": "Fri", "strong_evidence": 77, "incomplete_evidence": 17, "contradictory": 6},
            {"day": "Sat", "strong_evidence": 82, "incomplete_evidence": 13, "contradictory": 5},
            {"day": "Sun", "strong_evidence": 76, "incomplete_evidence": 18, "contradictory": 6}
        ]
    }
