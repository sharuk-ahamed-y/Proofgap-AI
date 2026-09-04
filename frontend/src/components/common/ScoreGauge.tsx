import React from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  title: string;
  subtitle?: string;
  colorScheme?: 'green' | 'amber' | 'rose' | 'violet' | 'auto';
  showPercent?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  title,
  subtitle,
  colorScheme = 'auto',
  showPercent = true
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Auto color selection based on financial safety thresholds
  let activeColor = '#8b5cf6'; // default violet
  if (colorScheme === 'green' || (colorScheme === 'auto' && clampedScore >= 80)) {
    activeColor = '#10b981'; // emerald
  } else if (colorScheme === 'amber' || (colorScheme === 'auto' && clampedScore >= 50)) {
    activeColor = '#f59e0b'; // amber
  } else if (colorScheme === 'rose' || (colorScheme === 'auto' && clampedScore < 50)) {
    activeColor = '#f43f5e'; // rose
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-black text-white font-sans tracking-tight"
          >
            {clampedScore.toFixed(0)}{showPercent && '%'}
          </motion.span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {title}
          </span>
        </div>
      </div>

      {subtitle && (
        <span className="text-xs text-slate-400 mt-2 font-medium max-w-[140px]">
          {subtitle}
        </span>
      )}
    </div>
  );
};
