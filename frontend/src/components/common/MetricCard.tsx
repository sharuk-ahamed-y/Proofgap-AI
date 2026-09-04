import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: React.ReactNode;
  accent?: 'green' | 'amber' | 'rose' | 'violet' | 'blue';
  highlightText?: string;
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accent = 'violet',
  highlightText,
  delay = 0
}) => {
  const accentStyles = {
    green: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      glow: 'shadow-glow-green',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      dot: 'bg-emerald-400'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      glow: 'shadow-glow-amber',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      dot: 'bg-amber-400'
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      glow: 'shadow-glow-rose',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      dot: 'bg-rose-400'
    },
    violet: {
      border: 'border-violet-500/20 hover:border-violet-500/40',
      glow: 'shadow-glow-violet',
      iconBg: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      badge: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      dot: 'bg-violet-400'
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      glow: '',
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      dot: 'bg-blue-400'
    }
  };

  const style = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glass-panel glass-panel-hover rounded-2xl p-5 border ${style.border} relative overflow-hidden group`}
    >
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-28 h-28 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</h3>
        </div>
        {icon && (
          <div className={`p-2 rounded-xl ${style.iconBg} transition-transform group-hover:scale-110 duration-200`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
          {value}
        </span>
        {highlightText && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {highlightText}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 font-medium">
        {subtitle}
      </p>
    </motion.div>
  );
};
