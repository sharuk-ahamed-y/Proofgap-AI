import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface AnalysisAnimationModalProps {
  isOpen: boolean;
  onComplete: () => void;
  recordCount?: number;
}

const PIPELINE_STEPS = [
  { id: 1, text: "Normalizing financial records across ledgers", delay: 400 },
  { id: 2, text: "Detecting candidate matches & fuzzy entities", delay: 700 },
  { id: 3, text: "Calculating entity similarity & match probability", delay: 1000 },
  { id: 4, text: "Verifying evidence completeness & Bank UTR traces", delay: 1400 },
  { id: 5, text: "Detecting contradictory fields & amount conflicts", delay: 1800 },
  { id: 6, text: "Estimating decision uncertainty & margin ambiguity", delay: 2200 },
  { id: 7, text: "Applying selective financial automation policy", delay: 2600 }
];

export const AnalysisAnimationModal: React.FC<AnalysisAnimationModalProps> = ({
  isOpen,
  onComplete,
  recordCount = 250
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      return;
    }

    const timeouts: any[] = [];
    PIPELINE_STEPS.forEach((step, index) => {
      const t = setTimeout(() => {
        setCurrentStepIndex(index + 1);
        if (index === PIPELINE_STEPS.length - 1) {
          setTimeout(() => {
            setIsFinished(true);
          }, 600);
        }
      }, step.delay);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl glass-panel bg-dark-900/95 border border-violet-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight font-sans">
                  ProofGap AI Reconciliation Pipeline
                </h2>
                <p className="text-xs text-slate-400">
                  Executing 6-layer evidence verification on {recordCount} records
                </p>
              </div>
            </div>
            
            <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              Live Engine
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 mb-6 overflow-hidden p-0.5 border border-slate-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-400 to-emerald-400 rounded-full"
              initial={{ width: '5%' }}
              animate={{ width: `${Math.min(100, ((currentStepIndex) / PIPELINE_STEPS.length) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Pipeline Steps Checklist */}
          <div className="space-y-3 mb-8">
            {PIPELINE_STEPS.map((step, idx) => {
              const isDone = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-3.5 p-2.5 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                      : isCurrent
                      ? 'bg-violet-500/10 border-violet-500/40 text-white shadow-sm'
                      : 'bg-transparent border-transparent text-slate-500'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-600">
                        {step.id}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'font-semibold text-violet-200' : ''}`}>
                    {step.text}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Completion state button */}
          <div className="flex justify-end">
            {isFinished ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onComplete}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Analysis Complete — View Reconciled Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <div className="w-full py-3 text-center text-xs text-slate-400 font-medium animate-pulse flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                <span>Running neural & rule-based evidence verification...</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
