import React from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  BrainCircuit,
  AlertTriangle,
  BarChart3,
  History,
  PlayCircle,
  Sliders,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Home
} from 'lucide-react';
import { ProofGapLogo } from '../common/ProofGapLogo';

export type TabType = 
  | 'landing'
  | 'dashboard'
  | 'reconciliation'
  | 'evidence'
  | 'exceptions'
  | 'analytics'
  | 'audit'
  | 'demo'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  exceptionCount?: number;
  reviewCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  exceptionCount = 6,
  reviewCount = 18
}) => {
  const navItems = [
    { id: 'landing' as TabType, label: 'Overview & Landing', icon: Home },
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reconciliation' as TabType, label: 'Reconciliation Lab', icon: FlaskConical, badge: 'Main' },
    { id: 'evidence' as TabType, label: 'Evidence Intelligence', icon: BrainCircuit, badge: 'Core AI' },
    { id: 'exceptions' as TabType, label: 'Exceptions & Review', icon: AlertTriangle, count: reviewCount + exceptionCount },
    { id: 'analytics' as TabType, label: 'Analytics & Safety', icon: BarChart3 },
    { id: 'audit' as TabType, label: 'Audit Trail', icon: History },
    { id: 'demo' as TabType, label: 'Demo Mode', icon: PlayCircle, highlight: true },
    { id: 'settings' as TabType, label: 'Settings & Razorpay', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-dark-900/90 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-30 select-none backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <ProofGapLogo size="md" />
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Financial Intelligence
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-white/10 text-white shadow-sm border border-white/10'
                  : item.highlight
                  ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : item.highlight ? 'text-violet-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="tracking-tight">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                }`}>
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && item.count > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Buildathon Track Badge & Quick Status */}
      <div className="p-4 border-t border-white/10 bg-dark-950/60">
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-950/40 via-dark-900 to-emerald-950/30 border border-violet-500/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold tracking-wider uppercase text-violet-400">
              Razorpay Buildathon
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs font-semibold text-slate-200">
            Track 04 — AI Finance Controller
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Selective Automation</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
