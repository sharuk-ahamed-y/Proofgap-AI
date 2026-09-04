import React from 'react';
import { DecisionType, EvidenceStatus } from '../../types';

interface BadgeProps {
  decision?: DecisionType | string;
  status?: EvidenceStatus | string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'outline' | 'solid';
}

export const Badge: React.FC<BadgeProps> = ({
  decision,
  status,
  size = 'md',
  text,
  variant = 'solid'
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold'
  };

  // Decision based styling
  if (decision) {
    if (decision === 'SAFE_AUTO_RESOLVE' || decision.includes('Safe')) {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]} shadow-sm`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {text || '🟢 Safe Auto-Resolve'}
        </span>
      );
    }
    if (decision === 'EVIDENCE_INSUFFICIENT' || decision.includes('Review')) {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ${sizeClasses[size]} shadow-sm`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {text || '🟡 Human Review'}
        </span>
      );
    }
    if (decision === 'CONTRADICTORY_EVIDENCE' || decision.includes('Exception') || decision.includes('Conflict')) {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 ${sizeClasses[size]} shadow-sm`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          {text || '🔴 Contradiction'}
        </span>
      );
    }
  }

  // Evidence Status based styling
  if (status) {
    if (status === 'VERIFIED') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 ${sizeClasses[size]}`}>
          ✓ Verified
        </span>
      );
    }
    if (status === 'MISSING') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 ${sizeClasses[size]}`}>
          ✕ Missing Proof
        </span>
      );
    }
    if (status === 'CONFLICT') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 ${sizeClasses[size]}`}>
          ⚠ Conflict
        </span>
      );
    }
    if (status === 'WEAK') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-md bg-slate-500/20 text-slate-300 border border-slate-500/30 ${sizeClasses[size]}`}>
          ~ Weak Match
        </span>
      );
    }
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses[size]}`}>
      {text || 'Status'}
    </span>
  );
};
