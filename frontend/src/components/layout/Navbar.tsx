import React from 'react';
import { Play, Sparkles, Database, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { TabType } from './Sidebar';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onRunReconciliation: () => void;
  onReloadDataset: () => void;
  isAnalyzing: boolean;
  totalRecords?: number;
  safetyScore?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onRunReconciliation,
  onReloadDataset,
  isAnalyzing,
  totalRecords = 250,
  safetyScore = 94.7
}) => {
  return (
    <header className="h-16 bg-dark-900/80 border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-xl">
      {/* Left Title / Context */}
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>Financial Intelligence Center</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-mono">Live Demo State</span>
          </div>
          <h1 className="text-sm font-bold text-white tracking-tight">
            {currentTab === 'landing' && 'Product Overview & Safety Philosophy'}
            {currentTab === 'dashboard' && 'Autonomous Reconciliation Intelligence'}
            {currentTab === 'reconciliation' && 'Financial Records Reconciliation Lab'}
            {currentTab === 'evidence' && 'Evidence Intelligence & Decision Explainability'}
            {currentTab === 'exceptions' && 'Exception & Human Review Triage Queue'}
            {currentTab === 'analytics' && 'Safety Metrics & Baseline Comparisons'}
            {currentTab === 'audit' && 'Cryptographic & Policy Audit Ledger'}
            {currentTab === 'demo' && 'Buildathon Live Demo Scenario Player'}
            {currentTab === 'settings' && 'Razorpay Connector & Threshold Settings'}
          </h1>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Razorpay Connector status pill */}
        <button
          onClick={() => onSelectTab('settings')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300 hover:bg-violet-500/20 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Razorpay Connected (Sandbox)</span>
        </button>

        {/* Safety Score Quick Metric */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safety Score: <strong className="text-emerald-300 font-mono">{safetyScore}/100</strong></span>
        </div>

        {/* Quick Reload Demo Dataset Button */}
        <button
          onClick={onReloadDataset}
          title="Reload 250 Demo Records"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Run Reconciliation Analysis Primary CTA */}
        <button
          onClick={onRunReconciliation}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>▶ Run Reconciliation Analysis</span>
        </button>
      </div>
    </header>
  );
};
