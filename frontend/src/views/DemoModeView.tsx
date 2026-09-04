import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DemoScenario } from '../types';
import { apiClient } from '../services/api';
import { Badge } from '../components/common/Badge';

export const DemoModeView: React.FC = () => {
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);
  const [isPlayingFullDemo, setIsPlayingFullDemo] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);

  useEffect(() => {
    apiClient.getDemoScenarios().then(setScenarios);
  }, []);

  // Automated Full Demo Runner with video pacing
  useEffect(() => {
    let interval: any;
    if (isPlayingFullDemo && scenarios.length > 0) {
      interval = setInterval(() => {
        setDemoProgress(prev => {
          if (prev >= 100) {
            setActiveScenarioIndex(curr => {
              const next = (curr + 1) % scenarios.length;
              if (next === 0) confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
              return next;
            });
            return 0;
          }
          return prev + 5;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlayingFullDemo, scenarios.length]);

  if (scenarios.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        Loading Demo Scenarios...
      </div>
    );
  }

  const currentScenario = scenarios[activeScenarioIndex];

  const handleSelectScenario = (index: number) => {
    setActiveScenarioIndex(index);
    setDemoProgress(0);
    setIsPlayingFullDemo(false);
    if (scenarios[index].scenario_type === 'SAFE') {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Header & Controller */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Razorpay Buildathon Showcase</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight font-sans">
              🎬 ProofGap AI — Live Demo
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Interactive 3-stage demonstration proving the difference between confidence and evidence safety.
            </p>
          </div>

          {/* Demo Controls */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                setIsPlayingFullDemo(!isPlayingFullDemo);
                setDemoProgress(0);
              }}
              className={`px-6 py-3.5 rounded-2xl font-bold text-xs tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 ${
                isPlayingFullDemo
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/25'
                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white shadow-violet-500/25'
              }`}
            >
              {isPlayingFullDemo ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Demo Player</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>▶ Run Full ProofGap Demo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Scenario Stage Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          {scenarios.map((sc, idx) => {
            const isActive = activeScenarioIndex === idx;
            const isSafe = sc.scenario_type === 'SAFE';
            const isAbstain = sc.scenario_type === 'ABSTAIN';

            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(idx)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isActive
                    ? isSafe
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-glow-green'
                      : isAbstain
                      ? 'bg-amber-950/40 border-amber-500/50 shadow-glow-amber'
                      : 'bg-rose-950/40 border-rose-500/50 shadow-glow-rose'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Active Progress Line */}
                {isActive && isPlayingFullDemo && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-emerald-400 transition-all duration-300"
                      style={{ width: `${demoProgress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Scenario 0{sc.scenario_number}
                  </span>
                  <Badge
                    decision={
                      isSafe ? 'SAFE_AUTO_RESOLVE' : isAbstain ? 'EVIDENCE_INSUFFICIENT' : 'CONTRADICTORY_EVIDENCE'
                    }
                    text={sc.highlight_tag}
                    size="sm"
                  />
                </div>

                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-violet-200 transition-colors">
                  {sc.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {sc.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Scenario Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScenario.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Top Banner: Traditional vs ProofGap Decision */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Traditional AI Outcome (5 Cols) */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-700 bg-slate-900/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Traditional AI / Rule Automation
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                    Confidence-Only
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-4">
                  Evaluates Similarity Score
                </h3>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Fuzzy Match Similarity:</span>
                    <strong className="text-emerald-400 font-mono">{currentScenario.match_probability}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Evidence Verification:</span>
                    <span className="text-slate-500 italic">Ignored (Not checked)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Autonomous Action:</span>
                    <span className={`font-bold ${
                      currentScenario.scenario_type === 'ABSTAIN' ? 'text-rose-400' : 'text-slate-200'
                    }`}>
                      {currentScenario.traditional_ai_decision}
                    </span>
                  </div>
                </div>
              </div>

              {currentScenario.scenario_type === 'ABSTAIN' && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-medium">
                  ⚠ Risks executing ₹5,000 false match without Bank UTR confirmation.
                </div>
              )}
            </div>

            {/* Right: ProofGap Selective Outcome (7 Cols) */}
            <div className={`lg:col-span-7 glass-panel rounded-3xl p-6 border ${
              currentScenario.scenario_type === 'SAFE'
                ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-dark-900 to-slate-900 shadow-glow-green'
                : currentScenario.scenario_type === 'ABSTAIN'
                ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-dark-900 to-slate-900 shadow-glow-amber'
                : 'border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-dark-900 to-slate-900 shadow-glow-rose'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>ProofGap Selective Decision</span>
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  {currentScenario.decision}
                </span>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight mb-4">
                {currentScenario.title}
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Match Prob</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {currentScenario.match_probability}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Evidence Proof</span>
                  <span className={`text-lg font-black font-mono ${
                    currentScenario.evidence_sufficiency >= 80 ? 'text-emerald-400' : currentScenario.evidence_sufficiency >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {currentScenario.evidence_sufficiency}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Uncertainty</span>
                  <span className="text-xs font-black text-slate-200 block mt-1 font-mono">
                    {currentScenario.uncertainty}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-950/90 border border-white/10 text-xs text-slate-200 leading-relaxed font-medium">
                {currentScenario.decision_reason}
              </div>
            </div>
          </div>

          {/* Evidence Factor Comparison Ledger */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <span>Evidence Factor Breakdown for {currentScenario.payment_record.txn_id}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentScenario.evidence_breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    item.status === 'VERIFIED'
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : item.status === 'MISSING'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {item.weight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Takeaway Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-500/30 flex items-start gap-3">
              <Award className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-violet-300 block uppercase tracking-wider">
                  Judge Takeaway
                </span>
                <p className="text-xs text-slate-200 mt-0.5 font-medium leading-relaxed">
                  {currentScenario.key_takeaway}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
