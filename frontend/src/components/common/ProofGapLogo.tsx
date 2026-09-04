import React from 'react';

interface ProofGapLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showTagline?: boolean;
}

export const ProofGapLogo: React.FC<ProofGapLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Geometric Shield Logo with Evidence Bridge */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-indigo-500/20 to-emerald-500/30 rounded-xl blur-[6px]" />
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          {/* Outer Shield Path */}
          <path
            d="M20 4L33 10V20C33 28.5 27.5 35.2 20 37C12.5 35.2 7 28.5 7 20V10L20 4Z"
            stroke="url(#shieldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#0c111d"
          />
          {/* Inner Broken Gap */}
          <path
            d="M13 19L18 24"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Evidence Bridge / Verified Checkmark completing the gap */}
          <path
            d="M18 24L28 14"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central AI Node Dot */}
          <circle cx="20" cy="20" r="1.5" fill="#8b5cf6" className="animate-ping" style={{ transformOrigin: '20px 20px', animationDuration: '3s' }} />
          <circle cx="20" cy="20" r="1.5" fill="#c4b5fd" />
          
          <defs>
            <linearGradient id="shieldGrad" x1="7" y1="4" x2="33" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="0.5" stopColor="#6366f1" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-white font-sans text-lg">ProofGap</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-md tracking-wider">AI</span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Evidence-Aware Financial Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
