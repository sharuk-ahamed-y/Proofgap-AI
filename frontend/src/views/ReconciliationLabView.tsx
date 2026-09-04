import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Eye,
  Sliders,
  Database,
  RefreshCw,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { BatchAnalysisSummary, ReconciliationResult, DecisionType } from '../types';
import { Badge } from '../components/common/Badge';

interface ReconciliationLabViewProps {
  summary: BatchAnalysisSummary;
  onRunReconciliation: () => void;
  onGenerateDataset: (count: number, difficulty: string) => void;
  onFileUpload: (file: File) => void;
  onSelectRecord: (record: ReconciliationResult) => void;
  isAnalyzing: boolean;
}

export const ReconciliationLabView: React.FC<ReconciliationLabViewProps> = ({
  summary,
  onRunReconciliation,
  onGenerateDataset,
  onFileUpload,
  onSelectRecord,
  isAnalyzing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | DecisionType>('ALL');
  const [selectedDatasetSize, setSelectedDatasetSize] = useState<number>(250);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [sortField, setSortField] = useState<'amount' | 'match_probability' | 'evidence_sufficiency'>('match_probability');
  const [sortAsc, setSortAsc] = useState(false);

  // File drag & drop state
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  // Filter & Search records
  const filteredRecords = useMemo(() => {
    let list = summary.records;

    if (selectedFilter !== 'ALL') {
      list = list.filter(r => r.decision === selectedFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.txn_id.toLowerCase().includes(q) ||
        r.record_id.toLowerCase().includes(q) ||
        r.merchant.toLowerCase().includes(q) ||
        (r.order_id && r.order_id.toLowerCase().includes(q)) ||
        r.amount.toString().includes(q)
      );
    }

    return list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [summary.records, selectedFilter, searchQuery, sortField, sortAsc]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Top Header & Data Generator Controls */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Source Ledger Ingestion</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Reconciliation Lab & Evidence Engine
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Cross-reconcile Razorpay payments, bank settlements, orders, and refund ledgers.
            </p>
          </div>

          {/* Quick Dataset Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Size Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
              <span className="px-2.5 text-slate-400 font-medium">Size:</span>
              {[100, 250, 500, 1000].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedDatasetSize(size);
                    onGenerateDataset(size, selectedDifficulty);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedDatasetSize === size
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
              <span className="px-2.5 text-slate-400 font-medium">Difficulty:</span>
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    onGenerateDataset(selectedDatasetSize, diff);
                  }}
                  className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Reload Demo Dataset Button */}
            <button
              onClick={() => onGenerateDataset(selectedDatasetSize, selectedDifficulty)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>⚡ Reload Dataset</span>
            </button>
          </div>
        </div>

        {/* Upload Dropzone & Main Action CTA Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 pt-6 border-t border-white/10 items-center">
          {/* File Upload Area (7 Cols) */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`lg:col-span-7 border-2 border-dashed rounded-2xl p-4 flex items-center justify-between gap-4 transition-all ${
              isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 text-violet-400 border border-slate-700">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Upload Custom Financial Records (CSV / JSON)
                </span>
                <span className="text-[11px] text-slate-400">
                  Supports Razorpay statements, ERP ledgers, and bank CSVs
                </span>
              </div>
            </div>

            <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex-shrink-0">
              <span>Browse Files</span>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Main Reconciliation CTA (5 Cols) */}
          <div className="lg:col-span-5 flex items-center justify-end">
            <button
              onClick={onRunReconciliation}
              disabled={isAnalyzing}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-black text-sm tracking-wide shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>✨ Analyze Evidence & Reconcile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Record ID, TXN-1025, Merchant, Amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'ALL'
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-dark-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span>All Records</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {summary.total_records}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('SAFE_AUTO_RESOLVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'SAFE_AUTO_RESOLVE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-dark-900 text-slate-400 border border-slate-800 hover:text-emerald-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>🟢 Safe</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950/60 text-emerald-300 font-mono">
              {summary.safe_count}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('EVIDENCE_INSUFFICIENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'EVIDENCE_INSUFFICIENT'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-dark-900 text-slate-400 border border-slate-800 hover:text-amber-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>🟡 Review</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/60 text-amber-300 font-mono">
              {summary.review_count}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('CONTRADICTORY_EVIDENCE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'CONTRADICTORY_EVIDENCE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-dark-900 text-slate-400 border border-slate-800 hover:text-rose-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>🔴 Exception</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-950/60 text-rose-300 font-mono">
              {summary.exception_count}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Data Table */}
      <div className="glass-panel rounded-3xl border border-white/10 bg-dark-900/90 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Record ID</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th
                  onClick={() => { setSortField('amount'); setSortAsc(!sortAsc); }}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Merchant Entity</th>
                <th className="py-3.5 px-4">Source</th>
                <th
                  onClick={() => { setSortField('match_probability'); setSortAsc(!sortAsc); }}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Match Prob</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => { setSortField('evidence_sufficiency'); setSortAsc(!sortAsc); }}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Evidence Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Decision</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs text-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    No matching records found. Try adjusting your search query or filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isLandmark1024 = rec.txn_id === 'TXN-1024';
                  const isLandmark1025 = rec.txn_id === 'TXN-1025';
                  const isLandmark1026 = rec.txn_id === 'TXN-1026';

                  return (
                    <tr
                      key={rec.record_id}
                      onClick={() => onSelectRecord(rec)}
                      className={`hover:bg-white/[0.04] transition-colors cursor-pointer group ${
                        isLandmark1025 ? 'bg-amber-500/5 hover:bg-amber-500/10' : ''
                      }`}
                    >
                      {/* Record ID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                        <div className="flex items-center gap-2">
                          <span>{rec.record_id}</span>
                          {isLandmark1024 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              Demo 1
                            </span>
                          )}
                          {isLandmark1025 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold animate-pulse">
                              Killer Demo 2
                            </span>
                          )}
                          {isLandmark1026 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                              Demo 3
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Txn ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {rec.txn_id}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-bold text-white font-sans">
                        ₹{rec.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Merchant */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{rec.merchant}</span>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-medium">
                          {rec.source}
                        </span>
                      </td>

                      {/* Match Probability */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            rec.match_probability >= 90 ? 'text-emerald-400' : rec.match_probability >= 70 ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            {rec.match_probability.toFixed(0)}%
                          </span>
                        </div>
                      </td>

                      {/* Evidence Sufficiency Score */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                rec.evidence_sufficiency >= 80 ? 'bg-emerald-400' : rec.evidence_sufficiency >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                              }`}
                              style={{ width: `${rec.evidence_sufficiency}%` }}
                            />
                          </div>
                          <span className={`font-bold ${
                            rec.evidence_sufficiency >= 80 ? 'text-emerald-400' : rec.evidence_sufficiency >= 50 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {rec.evidence_sufficiency.toFixed(0)}%
                          </span>
                        </div>
                      </td>

                      {/* Decision Badge */}
                      <td className="py-3.5 px-4">
                        <Badge decision={rec.decision} text={rec.decision_badge} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(rec);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-violet-600 text-slate-400 group-hover:text-white transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredRecords.length} of {summary.total_records} records</span>
          <span className="text-violet-400 font-medium">Click any row to inspect full Evidence Intelligence Breakdown</span>
        </div>
      </div>
    </div>
  );
};
