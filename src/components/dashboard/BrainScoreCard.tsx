import React from 'react';
import { TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const BrainScoreCard: React.FC = () => {
  const { user, setScreen } = useAppStore();

  const maxScore = 1000;
  const percentage = Math.round((user.brainScore / maxScore) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const xpPercentage = Math.round((user.xp / user.xpToNextLevel) * 100);

  return (
    <div
      onClick={() => setScreen('brain-score')}
      className="relative rounded-3xl bg-gradient-to-br from-white via-white to-emerald-50/70 border border-emerald-200/90 p-5 shadow-[0_10px_30px_-6px_rgba(6,78,59,0.09),0_2px_6px_rgba(15,23,42,0.03)] cursor-pointer group hover:border-emerald-300 hover:shadow-[0_14px_36px_-6px_rgba(5,150,105,0.16)] transition-all duration-200 overflow-hidden"
    >
      {/* Subtle 3D Emerald Brain Hero Artwork Watermark */}
      <img
        src="/images/hero-brain.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 w-40 h-40 object-cover rounded-full opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500 mix-blend-multiply"
      />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-teal-400/10 blur-2xl" />

      <div className="flex items-center gap-4 sm:gap-5 relative z-10">
        {/* Circular Progress Gauge with 3D Brain Center */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 transform -rotate-90" aria-hidden="true">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="text-emerald-100/90"
              strokeWidth="7.5"
              stroke="currentColor"
              fill="transparent"
            />
            <defs>
              <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="55%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="url(#scoreGaugeGrad)"
              strokeWidth="7.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-2.5 rounded-full overflow-hidden bg-white shadow-inner flex flex-col items-center justify-center text-center border border-emerald-100">
            <img
              src="/images/hero-brain.jpg"
              alt="3D Emerald Brain"
              className="w-11 h-11 object-cover rounded-full -mt-1"
            />
            <span className="text-[10px] font-black text-emerald-800 -mt-1 tabular-nums bg-white/90 px-1.5 rounded-full">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Score & Tier Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[10px] font-extrabold text-emerald-800/80 uppercase tracking-wider whitespace-nowrap">
              Brain Spark Index
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1 tabular-nums">
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                {user.brainScore}
              </span>
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">/ 1,000</span>
            </div>

            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/90 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              +{user.brainScoreChange}%
            </span>
          </div>

          <div className="flex items-center justify-between text-xs mt-1.5 text-slate-600 font-semibold">
            <span className="truncate">
              Level {user.level} • <span className="text-emerald-700 font-bold">{user.title}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-all shrink-0" />
          </div>

          {/* XP Progress Bar */}
          <div className="mt-2.5">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-semibold tabular-nums">
              <span>Level Progression</span>
              <span className="text-emerald-700 font-bold">
                {user.xp} / {user.xpToNextLevel} XP
              </span>
            </div>
            <div className="h-2.5 w-full bg-emerald-100/80 rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
