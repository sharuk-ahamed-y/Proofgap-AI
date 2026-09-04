import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  FileSearch,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Link2,
  Coins
} from 'lucide-react';
import { BatchAnalysisSummary, ReconciliationResult, DecisionType } from '../types';
import { Badge } from '../components/common/Badge';

interface ExceptionsViewProps {
  summary: BatchAnalysisSummary;
  onSelectRecord: (record: ReconciliationResult) => void;
  onResolveRecord: (recordId: string, action: string, notes?: string, newUtr?: string) => void;
}

export const ExceptionsView: React.FC<ExceptionsViewProps> = ({
  summary,
  onSelectRecord,
  onResolveRecord
}) => {
  const [activeTab, setActiveTab] = useState<'REVIEW' | 'EXCEPTION' | 'SAFE'>('REVIEW');
  const [investigatingRecord, setInvestigatingRecord] = useState<ReconciliationResult | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [utrInput, setUtrInput] = useState('');

  const reviewRecords = summary.records.filter(r => r.decision === 'EVIDENCE_INSUFFICIENT');
  const exceptionRecords = summary.records.filter(r => r.decision === 'CONTRADICTORY_EVIDENCE');
  const safeRecords = summary.records.filter(r => r.decision === 'SAFE_AUTO_RESOLVE');

  const displayedList = 
    activeTab === 'REVIEW' ? reviewRecords :
    activeTab === 'EXCEPTION' ? exceptionRecords : safeRecords;

  const handleOpenInvestigation = (rec: ReconciliationResult) => {
    setInvestigatingRecord(rec);
    setResolutionNotes('');
    setUtrInput(rec.bank_utr || 'UTR882910394821');
  };

  const handleApplyResolution = (action: string) => {
    if (!investigatingRecord) return;
    onResolveRecord(investigatingRecord.record_id, action, resolutionNotes, utrInput);
    setInvestigatingRecord(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Exception Triage & Human Review Queue</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Selective Exception Management
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Human review focused exclusively on genuinely ambiguous cases and true ledger contradictions.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl p-1.5 text-xs">
            <button
              onClick={() => setActiveTab('REVIEW')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'REVIEW'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>🟡 Evidence Insufficient ({reviewRecords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('EXCEPTION')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'EXCEPTION'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>🔴 Contradictory ({exceptionRecords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('SAFE')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'SAFE'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>🟢 Safe Auto ({safeRecords.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exception Queue Cards */}
      <div className="space-y-4">
        {displayedList.map((rec) => {
          const isConflict = rec.decision === 'CONTRADICTORY_EVIDENCE';
          const isReview = rec.decision === 'EVIDENCE_INSUFFICIENT';

          return (
            <div
              key={rec.record_id}
              className={`glass-panel rounded-2xl p-5 border transition-all ${
                isConflict
                  ? 'border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50'
                  : isReview
                  ? 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50'
                  : 'border-white/10 bg-dark-900/80 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-white font-mono">{rec.txn_id}</span>
                    <span className="text-xs text-slate-400">• {rec.merchant}</span>
                    <span className="text-sm font-black text-white font-sans">
                      ₹{rec.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                      Priority: {rec.amount >= 10000 ? 'HIGH' : 'MEDIUM'}
                    </span>
                    <Badge decision={rec.decision} text={rec.decision_badge} size="sm" />
                  </div>

                  {/* AI Explanation & Missing Evidence */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="text-slate-300 font-medium mb-1">
                      <strong className="text-violet-400 font-mono">AI Assessment:</strong> {rec.decision_reason}
                    </div>

                    {isConflict && rec.contradiction_details.length > 0 && (
                      <div className="text-rose-300 font-semibold flex items-center gap-1.5 mt-1.5">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>{rec.contradiction_details[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => onSelectRecord(rec)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <FileSearch className="w-3.5 h-3.5" />
                    <span>Inspect Evidence</span>
                  </button>

                  <button
                    onClick={() => handleOpenInvestigation(rec)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <span>Open Investigation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investigation Modal */}
      {investigatingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel bg-dark-900 border border-violet-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                  Financial Review Desk
                </span>
                <h2 className="text-lg font-bold text-white">
                  Investigate {investigatingRecord.txn_id} (₹{investigatingRecord.amount.toLocaleString('en-IN')})
                </h2>
              </div>
              <button
                onClick={() => setInvestigatingRecord(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400">Merchant: <strong className="text-white">{investigatingRecord.merchant}</strong></div>
                <div className="text-slate-400">Match Probability: <strong className="text-emerald-400">{investigatingRecord.match_probability}%</strong></div>
                <div className="text-slate-400">Evidence Sufficiency: <strong className="text-amber-400">{investigatingRecord.evidence_sufficiency}%</strong></div>
                <div className="text-slate-400">Reason: <span className="text-slate-200">{investigatingRecord.decision_reason}</span></div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Attach Verified Bank UTR (Optional)
                </label>
                <input
                  type="text"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. UTR882910394821"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Auditor Resolution Notes
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Explain why this decision is approved or flagged..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => handleApplyResolution('FLAG_DISPUTE')}
                className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs transition-all"
              >
                Send to Dispute
              </button>

              <button
                onClick={() => handleApplyResolution('APPROVE')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
              >
                Approve & Clear Reconciliation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
