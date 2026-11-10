import React from 'react';
import { Brain, Puzzle, Calculator, Zap, Eye, BookOpen, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GameCategory } from '../../types';

export const CategoryPerformanceWidget: React.FC = () => {
  const { categories, setScreen, setSelectedCategory } = useAppStore();

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Brain,
    Puzzle,
    Calculator,
    Zap,
    Eye,
    BookOpen,
  };

  const handleCategoryClick = (cat: GameCategory) => {
    setSelectedCategory(cat);
    setScreen('game-library');
  };

  const domainTheme: Record<string, { icon: string; bar: string; text: string }> = {
    memory: {
      icon: 'bg-orange-50 text-orange-600 border-orange-200/80',
      bar: 'bg-gradient-to-r from-orange-500 to-rose-500',
      text: 'text-orange-700',
    },
    logic: {
      icon: 'bg-blue-50 text-blue-600 border-blue-200/80',
      bar: 'bg-gradient-to-r from-blue-600 to-cyan-500',
      text: 'text-blue-700',
    },
    math: {
      icon: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      text: 'text-emerald-700',
    },
    focus: {
      icon: 'bg-violet-50 text-violet-600 border-violet-200/80',
      bar: 'bg-gradient-to-r from-violet-600 to-fuchsia-500',
      text: 'text-violet-700',
    },
    visual: {
      icon: 'bg-pink-50 text-pink-600 border-pink-200/80',
      bar: 'bg-gradient-to-r from-pink-500 to-rose-500',
      text: 'text-pink-700',
    },
    language: {
      icon: 'bg-amber-50 text-amber-600 border-amber-200/80',
      bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
      text: 'text-amber-700',
    },
  };

  return (
    <div className="my-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/15 border border-emerald-950/[0.08] shadow-[0_4px_20px_-4px_rgba(6,78,59,0.05)]">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Cognitive Domain Index</h3>
        <button
          type="button"
          onClick={() => setScreen('analytics')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/70 flex items-center gap-0.5"
        >
          <span>Full Report</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((c) => {
          const Icon = iconMap[c.icon] || Brain;
          const theme = domainTheme[c.category] || domainTheme.math;
          return (
            <div
              key={c.category}
              onClick={() => handleCategoryClick(c.category)}
              className="cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${theme.icon}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {c.name}
                  </span>
                </div>
                <span className={`font-extrabold ${theme.text} tabular-nums`}>
                  {c.percentage}%
                </span>
              </div>

              {/* Progress track */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                  style={{
                    width: `${c.percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
