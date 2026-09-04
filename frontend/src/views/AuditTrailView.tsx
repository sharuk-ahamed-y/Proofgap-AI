import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import { AuditLogEntry, BatchAnalysisSummary } from '../types';

interface AuditTrailViewProps {
  summary: BatchAnalysisSummary;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ summary }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('ALL');

  const auditLogs = summary.audit_trail;

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.phase.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPhase = phaseFilter === 'ALL' || log.phase === phaseFilter;

    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <History className="w-4 h-4" />
              <span>Immutable Decision Ledger</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Audit Trail & Verification Timeline
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Full trace of every candidate match, evidence completeness check, and policy execution.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Policy Compliance Logged</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit actions, TXN-1025, policy reasons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'INGESTION & NORMALIZATION', 'CANDIDATE_MATCHING', 'EVIDENCE_VERIFICATION', 'POLICY_EXECUTION'].map((phase) => (
            <button
              key={phase}
              onClick={() => setPhaseFilter(phase)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                phaseFilter === phase
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-dark-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {phase === 'ALL' ? 'All Phases' : phase.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/90 shadow-xl">
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-white/10">
          {filteredLogs.map((entry, idx) => {
            const isSuccess = entry.status === 'SUCCESS';
            const isWarning = entry.status === 'WARNING';
            const isDanger = entry.status === 'DANGER';

            return (
              <div key={idx} className="relative flex items-start gap-4 group">
                {/* Timeline node */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 border transition-transform group-hover:scale-110 ${
                  isSuccess
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                    : isWarning
                    ? 'bg-amber-950/80 border-amber-500/40 text-amber-400'
                    : isDanger
                    ? 'bg-rose-950/80 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-slate-700 text-violet-400'
                }`}>
                  {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                  {isWarning && <AlertTriangle className="w-5 h-5" />}
                  {isDanger && <AlertOctagon className="w-5 h-5" />}
                  {!isSuccess && !isWarning && !isDanger && <Sparkles className="w-5 h-5" />}
                </div>

                {/* Event Card */}
                <div className="flex-1 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider font-mono">
                        {entry.phase}
                      </span>
                      <h3 className="text-xs font-bold text-white">{entry.action}</h3>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {entry.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {entry.detail}
                  </p>

                  {entry.evidence_context && (
                    <div className="mt-2 text-[11px] text-violet-300/90 font-mono bg-violet-950/30 p-2 rounded-lg border border-violet-500/20">
                      Proof Context: {entry.evidence_context}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
