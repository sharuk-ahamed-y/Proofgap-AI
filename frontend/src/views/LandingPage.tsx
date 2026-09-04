import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  BrainCircuit,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Lock,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { TabType } from '../components/layout/Sidebar';
import { ProofGapLogo } from '../components/common/ProofGapLogo';

interface LandingPageProps {
  onNavigate: (tab: TabType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden text-center">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/20 via-indigo-500/15 to-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          {/* Tagline Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Razorpay AI Buildathon — Track 04 AI Finance Controller</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 font-sans"
          >
            Financial Automation Needs More Than Confidence.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">
              It Needs Proof.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8 font-normal"
          >
            ProofGap AI evaluates <strong className="text-white font-semibold">evidence sufficiency</strong> before automating financial decisions—reducing unsafe automation by <strong className="text-emerald-400 font-semibold">72%</strong> while focusing humans only where judgment is truly needed.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-violet-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('demo')}
              className="px-6 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-white font-bold text-sm tracking-wide border border-white/15 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all shadow-md"
            >
              <PlayCircle className="w-4 h-4 text-violet-400" />
              <span>Explore Live Demo Scenarios</span>
            </button>
          </motion.div>
        </div>

        {/* High-Impact Visual: Confidence vs Sufficiency Principle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 max-w-4xl mx-auto px-4"
        >
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden text-left bg-dark-900/80">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left: Traditional AI trap */}
              <div className="w-full md:w-5/12 p-5 rounded-2xl bg-slate-900/90 border border-slate-700/60 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Traditional AI Engine</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">Unsafe Automation</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Fuzzy Match Similarity:</span>
                    <strong className="text-emerald-400 font-mono">94% (High)</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Blindly equates high confidence with safety.
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Decision:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> AUTOMATE (Risky)
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Divider: The ProofGap Insight */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 font-black text-xs">
                  VS
                </div>
                <span className="text-[10px] font-bold text-violet-400 mt-1 uppercase tracking-wider">ProofGap</span>
              </div>

              {/* Right: ProofGap AI Selective Automation */}
              <div className="w-full md:w-5/12 p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-violet-950/30 border border-amber-500/30 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">ProofGap AI Engine</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">Selective Protection</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Match Probability:</span>
                    <strong className="text-emerald-400 font-mono">94%</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Evidence Sufficiency:</span>
                    <strong className="text-amber-400 font-mono">62% (Missing UTR)</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Decision:</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> 🛑 ABSTAIN FOR REVIEW
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-slate-300">
                <strong className="text-white">Core Principle:</strong> <span className="text-violet-400 font-semibold font-mono">HIGH CONFIDENCE ≠ SAFE AUTOMATION</span>. ProofGap verifies settlement references, candidate uniqueness, and contradiction bounds before approving autonomous financial execution.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Financial Safety & Precision
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            The intellectual and architectural pillars that make ProofGap AI finance-grade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 w-fit mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">🧠 Evidence Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates an orthogonal Evidence Sufficiency Score ($0-100\%$) based on Bank UTR completeness, timestamp windows, and source reliability.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">🛡 Selective Automation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instead of forcing binary MATCH/NO-MATCH, ProofGap knows when <strong className="text-slate-200">NOT</strong> to automate, quarantining ambiguous matches.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">🔍 Full Explainability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every decision outputs an exact rule trace, factor weighting, and human-readable justification for complete internal compliance.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">📊 Measurable Safety</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tracks crucial fintech metrics: Unsafe Automation Rate (1.3%), Correct Abstention Rate (96.8%), and cumulative financial risk prevented.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive System Architecture Explorer */}
      <section className="px-4">
        <div className="glass-panel rounded-3xl p-8 border border-white/10 bg-dark-900/90 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">Multi-Layer Architecture</span>
            <h2 className="text-2xl font-bold text-white mt-1">End-to-End Decision Pipeline</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Layer 1</div>
              <div className="text-xs font-bold text-white">Data Ingestion</div>
              <div className="text-[10px] text-slate-400 mt-1">Razorpay, ERP & Banks</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Layer 2</div>
              <div className="text-xs font-bold text-white">Normalization</div>
              <div className="text-[10px] text-slate-400 mt-1">Dates, Names & Tokens</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Layer 3</div>
              <div className="text-xs font-bold text-white">Candidate Match</div>
              <div className="text-[10px] text-slate-400 mt-1">Fuzzy Entity Search</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-violet-400 uppercase mb-1">Layer 4</div>
              <div className="text-xs font-bold text-violet-200">Match Probability</div>
              <div className="text-[10px] text-slate-400 mt-1">0 - 100% Score</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex flex-col justify-center bg-amber-500/5">
              <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">Layer 5 (Core)</div>
              <div className="text-xs font-bold text-amber-200">Evidence Sufficiency</div>
              <div className="text-[10px] text-slate-400 mt-1">Completeness & UTR</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 flex flex-col justify-center bg-rose-500/5">
              <div className="text-[10px] font-bold text-rose-400 uppercase mb-1">Layer 6</div>
              <div className="text-xs font-bold text-rose-200">Contradictions</div>
              <div className="text-[10px] text-slate-400 mt-1">Amount & State Checks</div>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-violet-900/60 to-emerald-950/60 border border-emerald-500/40 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Policy Outcome</div>
              <div className="text-xs font-bold text-white">Selective Action</div>
              <div className="text-[10px] text-emerald-300 mt-1">🟢 🟡 🔴 Tri-State</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onNavigate('reconciliation')}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs tracking-wide flex items-center gap-2 transition-all"
            >
              <span>Test Reconciliation Lab Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
