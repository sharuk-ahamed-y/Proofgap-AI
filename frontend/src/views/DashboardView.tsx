import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Coins,
  FileCheck
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { BatchAnalysisSummary } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { TabType } from '../components/layout/Sidebar';

interface DashboardViewProps {
  summary: BatchAnalysisSummary;
  onRunReconciliation: () => void;
  onNavigate: (tab: TabType) => void;
  isAnalyzing: boolean;
}

const TREND_DATA = [
  { day: 'Mon', strong: 78, incomplete: 16, contradictory: 6 },
  { day: 'Tue', strong: 75, incomplete: 19, contradictory: 6 },
  { day: 'Wed', strong: 80, incomplete: 15, contradictory: 5 },
  { day: 'Thu', strong: 74, incomplete: 20, contradictory: 6 },
  { day: 'Fri', strong: 77, incomplete: 17, contradictory: 6 },
  { day: 'Sat', strong: 82, incomplete: 13, contradictory: 5 },
  { day: 'Sun', strong: 76, incomplete: 18, contradictory: 6 },
];

const DONUT_COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  onRunReconciliation,
  onNavigate,
  isAnalyzing
}) => {
  const pieData = [
    { name: 'Safe Auto-Resolved', value: summary.safe_count, percentage: summary.safe_rate },
    { name: 'Human Review Required', value: summary.review_count, percentage: summary.review_rate },
    { name: 'True Exceptions', value: summary.exception_count, percentage: summary.exception_rate },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Hero Header */}
      <div className="glass-panel rounded-3xl p-8 border border-white/10 bg-dark-900/80 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-gradient-to-bl from-violet-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Good morning • Financial Intelligence Center</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight font-sans mb-3">
              Financial Automation,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-emerald-400">
                With Proof.
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              ProofGap AI evaluates not only whether records match, but whether there is enough verified evidence to automate the financial decision safely.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onRunReconciliation}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>▶ Run Reconciliation Analysis</span>
            </button>

            <button
              onClick={() => onNavigate('demo')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-white font-semibold text-sm border border-white/15 flex items-center justify-center gap-2 transition-all"
            >
              <span>View 3 Demo Scenarios</span>
              <ArrowRight className="w-4 h-4 text-violet-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Safe Auto-Resolved"
          value={summary.safe_count}
          subtitle="Evidence verified • 100% clearing proof"
          accent="green"
          highlightText={`${summary.safe_rate}%`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          delay={0.1}
        />

        <MetricCard
          title="Human Review Required"
          value={summary.review_count}
          subtitle="Evidence insufficient • Abstains for safety"
          accent="amber"
          highlightText={`${summary.review_rate}%`}
          icon={<AlertTriangle className="w-5 h-5" />}
          delay={0.2}
        />

        <MetricCard
          title="True Exceptions"
          value={summary.exception_count}
          subtitle="Contradictory evidence • Conflict detected"
          accent="rose"
          highlightText={`${summary.exception_rate}%`}
          icon={<AlertOctagon className="w-5 h-5" />}
          delay={0.3}
        />

        <MetricCard
          title="Unsafe Automation Rate"
          value={`${summary.unsafe_automation_rate}%`}
          subtitle="Lower is safer (Generic AI is 4.7%)"
          accent="violet"
          highlightText="72% Safer"
          icon={<ShieldCheck className="w-5 h-5" />}
          delay={0.4}
        />
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Donut & Safety Score (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Selective Automation Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Categorization across {summary.total_records} financial ledger records
              </p>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              Live Engine Evaluation
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
            {/* Donut Chart */}
            <div className="md:col-span-6 h-56 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f1420', borderColor: '#334168', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Donut center stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white font-sans">{summary.safe_rate}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Automated</span>
              </div>
            </div>

            {/* Automation Safety Score Card */}
            <div className="md:col-span-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-violet-950/20 border border-emerald-500/30 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Automation Safety Score</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-white font-sans tracking-tight">
                  {summary.automation_safety_score}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>

              <p className="text-xs text-emerald-300 font-medium leading-relaxed bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                🛡 ProofGap prevented <strong className="text-white">{summary.review_count}</strong> potentially unsafe automated decisions.
              </p>
            </div>
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <span className="text-[11px] font-semibold text-emerald-400 block">🟢 {summary.safe_rate}% Safe</span>
              <span className="text-[10px] text-slate-400">{summary.safe_count} Records</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <span className="text-[11px] font-semibold text-amber-400 block">🟡 {summary.review_rate}% Review</span>
              <span className="text-[10px] text-slate-400">{summary.review_count} Records</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/15">
              <span className="text-[11px] font-semibold text-rose-400 block">🔴 {summary.exception_rate}% Exceptions</span>
              <span className="text-[10px] text-slate-400">{summary.exception_count} Records</span>
            </div>
          </div>
        </div>

        {/* Secondary: Evidence Quality Over Time Chart (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white tracking-tight">
                Evidence Quality Over Time
              </h2>
              <span className="text-[11px] text-slate-400">7-Day Trend</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Distribution of strong vs incomplete proof in incoming streams
            </p>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStrong" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIncomplete" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f1420', borderColor: '#334168', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="strong" name="Strong Evidence" stroke="#10b981" fillOpacity={1} fill="url(#colorStrong)" />
                  <Area type="monotone" dataKey="incomplete" name="Incomplete Proof" stroke="#f59e0b" fillOpacity={1} fill="url(#colorIncomplete)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Strong (76%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Incomplete (18%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Conflicting (6%)
            </span>
          </div>
        </div>
      </div>

      {/* AI Insight Panel & Estimated Risk Avoided */}
      <div className="glass-panel rounded-3xl p-6 border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-dark-900 to-indigo-950/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-white">🤖 ProofGap Intelligence Insight</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  AI Controller
                </span>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                "18 records had high similarity scores (&gt; 90%) but insufficient evidence for safe automation. A traditional reconciliation engine or generic AI would have automatically matched these records, resulting in potential reconciliation discrepancies."
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950/80 border border-white/10 flex flex-col items-start md:items-end min-w-[200px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Estimated Risk Avoided
            </span>
            <span className="text-2xl font-black text-emerald-400 font-sans mt-0.5">
              ₹{summary.estimated_risk_avoided.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 italic mt-0.5">
              Estimated using demo benchmark
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
