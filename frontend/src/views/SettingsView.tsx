import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  Database,
  Key,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sparkles,
  RefreshCw,
  Server,
  Layers,
  Info
} from 'lucide-react';
import { RazorpayConnectionStatus } from '../types';
import { apiClient } from '../services/api';

export const SettingsView: React.FC = () => {
  const [razorpayStatus, setRazorpayStatus] = useState<RazorpayConnectionStatus | null>(null);
  const [matchThreshold, setMatchThreshold] = useState(90);
  const [evidenceThreshold, setEvidenceThreshold] = useState(80);
  const [uncertaintyThreshold, setUncertaintyThreshold] = useState(25);
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState<any>(null);

  useEffect(() => {
    apiClient.getRazorpayStatus().then(setRazorpayStatus);
  }, []);

  const handleSimulateWebhook = async () => {
    setSimulatingWebhook(true);
    try {
      const res = await apiClient.simulateRazorpayEvent(5000, 'captured');
      setWebhookResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulatingWebhook(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Controller Configuration</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Razorpay Connector & Policy Tuning
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Configure payment gateway connectors, webhook endpoints, and selective automation safety thresholds.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            Track 04 Integration Hub
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Razorpay Integration Card (6 Cols) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Razorpay Data Source</h2>
                <span className="text-xs text-slate-400">Gateway Ingestion & Webhooks</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>

          {razorpayStatus && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Connector Mode:</span>
                  <strong className="text-violet-400">{razorpayStatus.mode}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Key ID:</span>
                  <span className="font-mono text-slate-200">{razorpayStatus.key_id_masked}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Webhook Endpoint:</span>
                  <span className="font-mono text-emerald-400">{razorpayStatus.webhook_endpoint}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Supported Razorpay Events:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {razorpayStatus.supported_events.map(ev => (
                    <span key={ev} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                {razorpayStatus.disclaimer}
              </p>

              {/* Webhook test button */}
              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={handleSimulateWebhook}
                  disabled={simulatingWebhook}
                  className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  {simulatingWebhook ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>Simulate Incoming Razorpay Webhook Event</span>
                </button>
              </div>

              {webhookResult && (
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Event Received & Reconciled:
                  </div>
                  <div className="font-mono text-[10px] text-slate-300">
                    ID: {webhookResult.normalized_record.txn_id} | Amount: ₹{webhookResult.normalized_record.amount} | Decision: {webhookResult.reconciliation_result.decision_badge}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Policy Safety Thresholds (6 Cols) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-white/10 bg-dark-900/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Selective Automation Policy</h2>
                <span className="text-xs text-slate-400">Autonomous Execution Thresholds</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Match Probability Threshold */}
            <div>
              <div className="flex justify-between text-slate-200 font-semibold mb-1">
                <span>Minimum Match Probability for Safe Auto</span>
                <span className="text-emerald-400 font-mono">{matchThreshold}%</span>
              </div>
              <input
                type="range"
                min={75}
                max={99}
                value={matchThreshold}
                onChange={(e) => setMatchThreshold(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
              <span className="text-[10px] text-slate-400">Requires candidate similarity to be at or above this value.</span>
            </div>

            {/* Evidence Sufficiency Threshold */}
            <div>
              <div className="flex justify-between text-slate-200 font-semibold mb-1">
                <span>Minimum Evidence Sufficiency Score</span>
                <span className="text-amber-400 font-mono">{evidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={95}
                value={evidenceThreshold}
                onChange={(e) => setEvidenceThreshold(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-400">Requires Bank UTR and settlement traces before authorizing automated general ledger writes.</span>
            </div>

            {/* Uncertainty Threshold */}
            <div>
              <div className="flex justify-between text-slate-200 font-semibold mb-1">
                <span>Maximum Allowed Uncertainty Score</span>
                <span className="text-rose-400 font-mono">{uncertaintyThreshold}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                value={uncertaintyThreshold}
                onChange={(e) => setUncertaintyThreshold(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <span className="text-[10px] text-slate-400">Any candidate ambiguity or conflict beyond this score triggers human review.</span>
            </div>
          </div>

          {/* Architecture Summary */}
          <div className="pt-4 border-t border-white/10 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <span className="text-violet-400 font-bold block">Tech Stack:</span>
            <div>FastAPI + RapidFuzz + React 18 + TypeScript + Tailwind CSS + Framer Motion</div>
          </div>
        </div>
      </div>
    </div>
  );
};
