import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ShieldCheck,
  BrainCircuit,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BenchmarkData, BatchAnalysisSummary } from '../types';
import { apiClient } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';

interface AnalyticsViewProps {
  summary: BatchAnalysisSummary;
}

const COMPARISON_BAR_DATA = [
  { metric: 'Match Accuracy', Rules: 89.0, GenericAI: 94.0, ProofGap: 96.2 },
  { metric: 'Automation Coverage', Rules: 82.0, GenericAI: 91.0, ProofGap: 76.0 },
  { metric: 'Unsafe Auto Rate', Rules: 8.2, GenericAI: 4.7, ProofGap: 1.3 },
  { metric: 'Correct Abstention', Rules: 0.0, GenericAI: 23.4, ProofGap: 96.8 },
  { metric: 'Review Efficiency', Rules: 44.0, GenericAI: 61.0, ProofGap: 92.4 }
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ summary }) => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkData | null>(null);

  useEffect(() => {
    apiClient.getBenchmarks().then(setBenchmarks);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Fintech Safety Benchmarks</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Automation Performance & Safety Analytics
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Empirical evaluation comparing Traditional Rule engines, Generic Confidence-Only AI, and ProofGap Selective Automation.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            Controlled Ground-Truth Evaluation
          </div>
        </div>
      </div>

      {/* Unique ProofGap Metrics Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            ProofGap Unique Safety Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Unsafe Automation Rate"
            value="1.3%"
            subtitle="Percentage of incorrect decisions automatically approved (Lower is safer)"
            accent="green"
            highlightText="72% Lower Risk"
            icon={<ShieldCheck className="w-5 h-5" />}
          />

          <MetricCard
            title="Correct Abstention Rate"
            value="96.8%"
            subtitle="How often AI correctly refused to automate when evidence was weak"
            accent="violet"
            highlightText="High Precision"
            icon={<BrainCircuit className="w-5 h-5" />}
          />

          <MetricCard
            title="False Match Rate"
            value="0.8%"
            subtitle="Incorrect reconciliation match rate across target ledger"
            accent="blue"
            highlightText="0.8% vs 4.1%"
            icon={<TrendingDown className="w-5 h-5" />}
          />

          <MetricCard
            title="Human Review Efficiency"
            value="92.4%"
            subtitle="Percentage of human reviews focused on genuinely ambiguous cases"
            accent="amber"
            highlightText="+31.4% Efficiency"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Comparative Bar Chart Visualization */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Baseline Engine Comparison
            </h2>
            <p className="text-xs text-slate-400">
              Comparing Traditional Rules vs Generic AI vs ProofGap AI (%)
            </p>
          </div>
          <span className="text-[10px] text-slate-500 italic">Synthetic Demo Benchmark</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMPARISON_BAR_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f1420', borderColor: '#334168', borderRadius: '12px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Rules" fill="#64748b" name="Traditional Rules" radius={[4, 4, 0, 0]} />
              <Bar dataKey="GenericAI" fill="#f59e0b" name="Generic AI (Confidence-Only)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ProofGap" fill="#10b981" name="ProofGap AI (Selective)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Baseline Comparison Table */}
      {benchmarks && (
        <div className="glass-panel rounded-3xl border border-white/10 bg-dark-900/90 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Comprehensive Benchmark Matrix
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {benchmarks.disclaimer}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Evaluation Metric</th>
                  <th className="py-3 px-4">Traditional Rules</th>
                  <th className="py-3 px-4">Generic AI</th>
                  <th className="py-3 px-4 text-emerald-400">ProofGap AI</th>
                  <th className="py-3 px-4">Safety Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {benchmarks.metrics_table.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      row.is_highlight ? 'bg-emerald-500/5 font-semibold text-white' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                      {row.is_highlight && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{row.metric}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{row.traditional_rules}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.generic_ai}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{row.proofgap_ai}</td>
                    <td className="py-3.5 px-4 text-violet-300 font-medium">{row.advantage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/10 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Evaluated using controlled Ground Truth tags with synthetic Razorpay & ERP settlement datasets.</span>
            <span className="text-violet-400 font-semibold">Track 04 AI Finance Controller</span>
          </div>
        </div>
      )}
    </div>
  );
};
