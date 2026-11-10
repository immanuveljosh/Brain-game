import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const DailyChallengeCard: React.FC = () => {
  const { dailyTasks, setScreen } = useAppStore();

  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const totalCount = dailyTasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      onClick={() => setScreen('daily-challenge')}
      className="relative overflow-hidden my-3 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/55 border border-emerald-200/80 p-4 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all duration-200 group shadow-[0_6px_22px_-4px_rgba(6,78,59,0.06)]"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 w-24 h-24 rounded-full bg-emerald-400/12 blur-xl" />

      <div className="flex-1 pr-3 min-w-0 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Daily Challenge
          </span>
        </div>

        <div className="text-sm font-bold text-slate-900 mt-0.5 tracking-tight">
          Complete {totalCount} cognitive games today
        </div>

        {/* Progress bar */}
        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="flex-1 h-2 bg-emerald-100/70 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-emerald-800 tabular-nums">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* 3D Emerald Trophy Artwork + Action button */}
      <div className="flex items-center gap-2.5 shrink-0 relative z-10">
        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-200/80 bg-white group-hover:scale-105 transition-transform shadow-sm">
          <img
            src="/images/daily-trophy.jpg"
            alt="Daily Challenge Trophy"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setScreen('daily-challenge');
          }}
          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-[0_4px_12px_rgba(5,150,105,0.24)] flex items-center gap-1 transition-all active:scale-95"
        >
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
