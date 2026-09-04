import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  FileSearch,
  ArrowRight,
  Sparkles,
  Link2,
  Lock,
  Zap,
  Info,
  Layers,
  Search
} from 'lucide-react';
import { ReconciliationResult, BatchAnalysisSummary } from '../types';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { Badge } from '../components/common/Badge';

interface EvidenceIntelligenceViewProps {
  summary: BatchAnalysisSummary;
  selectedRecord: ReconciliationResult | null;
  onSelectRecord: (record: ReconciliationResult) => void;
  onResolveRecord: (recordId: string, action: string, notes?: string, newUtr?: string) => void;
}

export const EvidenceIntelligenceView: React.FC<EvidenceIntelligenceViewProps> = ({
  summary,
  selectedRecord,
  onSelectRecord,
  onResolveRecord
}) => {
  // Default to landmark TXN-1025 if none selected
  const activeRecord = selectedRecord || summary.records.find(r => r.txn_id === 'TXN-1025') || summary.records[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [utrInput, setUtrInput] = useState('');
  const [showAttachModal, setShowAttachModal] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Title & Concept Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
              <BrainCircuit className="w-4 h-4" />
              <span>Core Decision Explainability</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Why Did the AI Make This Decision?
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Multi-factor evidence decomposition proving when automation is mathematically safe vs when to abstain.
            </p>
          </div>

          {/* Landmark Quick Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Landmark Cases:</span>
            <button
              onClick={() => {
                const r = summary.records.find(x => x.txn_id === 'TXN-1024');
                if (r) onSelectRecord(r);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeRecord.txn_id === 'TXN-1024'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              🟢 TXN-1024 (Safe)
            </button>

            <button
              onClick={() => {
                const r = summary.records.find(x => x.txn_id === 'TXN-1025');
                if (r) onSelectRecord(r);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeRecord.txn_id === 'TXN-1025'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              🟡 TXN-1025 (Killer Demo)
            </button>

            <button
              onClick={() => {
                const r = summary.records.find(x => x.txn_id === 'TXN-1026');
                if (r) onSelectRecord(r);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeRecord.txn_id === 'TXN-1026'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              🔴 TXN-1026 (Conflict)
            </button>
          </div>
        </div>
      </div>

      {/* Main Evidence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3 Large Circular Gauges & Key Metrics (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction Case</span>
                <h2 className="text-lg font-bold text-white">{activeRecord.txn_id}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">{activeRecord.merchant}</span>
                <span className="text-base font-black text-white font-sans">
                  ₹{activeRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Circular Gauges */}
            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                <ScoreGauge
                  score={activeRecord.match_probability}
                  size={120}
                  strokeWidth={9}
                  title="Match Prob"
                  subtitle="Similarity model"
                  colorScheme="auto"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                <ScoreGauge
                  score={activeRecord.evidence_sufficiency}
                  size={120}
                  strokeWidth={9}
                  title="Evidence Proof"
                  subtitle="Verification factor"
                  colorScheme="auto"
                />
              </div>
            </div>

            {/* Uncertainty & Candidate Margin metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 text-center">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Decision Uncertainty</span>
                <span className={`text-sm font-bold ${
                  activeRecord.uncertainty_level === 'LOW' ? 'text-emerald-400' : activeRecord.uncertainty_level === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {activeRecord.uncertainty_level} ({activeRecord.uncertainty_score}%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate Separation</span>
                <span className="text-sm font-bold text-slate-200">
                  Δ {activeRecord.candidate_margin.toFixed(1)}% Margin
                </span>
              </div>
            </div>
          </div>

          {/* Prominent Intellectual Callout: CONFIDENCE != SAFETY */}
          <div className="glass-panel rounded-3xl p-6 border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-dark-900 to-indigo-950/40">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Core Fintech Insight</span>
            </div>

            <h3 className="text-base font-black text-white tracking-tight mb-2 font-sans">
              CONFIDENCE ≠ SAFETY
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              A high similarity score means records look similar. But without settlement references or candidate uniqueness, autonomous reconciliation creates false matches. ProofGap requires proven evidence before authorizing automated accounting writes.
            </p>
          </div>
        </div>

        {/* Right: Detailed Evidence Breakdown & Action Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Evidence Category Items */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Evidence Factors Breakdown</span>
              </h2>
              <span className="text-xs text-slate-400">
                {activeRecord.evidence_items.length} Factors Evaluated
              </span>
            </div>

            <div className="space-y-3">
              {activeRecord.evidence_items.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.status === 'VERIFIED'
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : item.status === 'MISSING'
                      ? 'bg-amber-500/10 border-amber-500/30 shadow-sm'
                      : item.status === 'CONFLICT'
                      ? 'bg-rose-500/10 border-rose-500/30 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {item.status === 'VERIFIED' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      {item.status === 'MISSING' && <XCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                      {item.status === 'CONFLICT' && <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                      {item.status === 'WEAK' && <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        Weight: {item.weight}
                      </span>
                      <span className={`text-xs font-mono font-bold ${
                        item.score >= 80 ? 'text-emerald-400' : item.score >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {item.score.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Policy Decision & Action Card */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/90 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Automated Policy Decision
              </span>
              <Badge decision={activeRecord.decision} text={activeRecord.decision_badge} size="md" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-4">
              <div className="text-[10px] font-bold text-violet-400 font-mono mb-1">
                RULE: {activeRecord.rule_triggered}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeRecord.decision_reason}
              </p>
            </div>

            {/* Resolution Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {activeRecord.decision === 'EVIDENCE_INSUFFICIENT' && (
                <>
                  <button
                    onClick={() => onResolveRecord(activeRecord.record_id, 'APPROVE', 'Manually verified via bank portal')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Manual Override</span>
                  </button>

                  <button
                    onClick={() => {
                      const utr = prompt('Enter verified Bank UTR reference:', 'UTR882910394821');
                      if (utr) onResolveRecord(activeRecord.record_id, 'ATTACH_UTR', 'Bank UTR attached', utr);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Attach Bank UTR & Clear</span>
                  </button>
                </>
              )}

              {activeRecord.decision === 'CONTRADICTORY_EVIDENCE' && (
                <button
                  onClick={() => onResolveRecord(activeRecord.record_id, 'FLAG_DISPUTE', 'Dispatched to merchant dispute desk')}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Route to Financial Dispute Desk</span>
                </button>
              )}

              {activeRecord.decision === 'SAFE_AUTO_RESOLVE' && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Autonomous reconciliation complete. Reconciled in general ledger.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
