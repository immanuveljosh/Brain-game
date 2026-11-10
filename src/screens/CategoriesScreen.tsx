import React from 'react';
import {
  Brain,
  Puzzle,
  Calculator,
  Zap,
  Eye,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { GameCategory } from '../types';

export const CategoriesScreen: React.FC = () => {
  const { categories, setSelectedCategory, setScreen } = useAppStore();

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Brain,
    Puzzle,
    Calculator,
    Zap,
    Eye,
    BookOpen,
  };

  const categoryThemeMap: Record<
    string,
    {
      art: string;
      imgFilter: string;
      badge: string;
      icon: string;
      bar: string;
      border: string;
      percentText: string;
    }
  > = {
    memory: {
      art: '/images/memory-art.jpg',
      imgFilter: '',
      badge: 'bg-orange-500 text-white',
      icon: 'bg-white/95 text-orange-600 border-orange-200/80',
      bar: 'bg-gradient-to-r from-orange-500 to-rose-500',
      border: 'border-orange-200/70 hover:border-orange-300',
      percentText: 'text-orange-600',
    },
    logic: {
      art: '/images/logic-art.jpg',
      imgFilter: '',
      badge: 'bg-blue-600 text-white',
      icon: 'bg-white/95 text-blue-600 border-blue-200/80',
      bar: 'bg-gradient-to-r from-blue-600 to-cyan-500',
      border: 'border-blue-200/70 hover:border-blue-300',
      percentText: 'text-blue-600',
    },
    math: {
      art: '/images/math-art.jpg',
      imgFilter: '',
      badge: 'bg-emerald-600 text-white',
      icon: 'bg-white/95 text-emerald-600 border-emerald-200/80',
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      border: 'border-emerald-200/80 hover:border-emerald-300',
      percentText: 'text-emerald-700',
    },
    focus: {
      art: '/images/focus-art.jpg',
      imgFilter: 'hue-rotate-[110deg] saturate-150',
      badge: 'bg-violet-600 text-white',
      icon: 'bg-white/95 text-violet-600 border-violet-200/80',
      bar: 'bg-gradient-to-r from-violet-600 to-fuchsia-500',
      border: 'border-violet-200/70 hover:border-violet-300',
      percentText: 'text-violet-600',
    },
    visual: {
      art: '/images/visual-art.jpg',
      imgFilter: '',
      badge: 'bg-pink-500 text-white',
      icon: 'bg-white/95 text-pink-600 border-pink-200/80',
      bar: 'bg-gradient-to-r from-pink-500 to-rose-500',
      border: 'border-pink-200/70 hover:border-pink-300',
      percentText: 'text-pink-600',
    },
    language: {
      art: '/images/language-art.jpg',
      imgFilter: 'hue-rotate-[-95deg] saturate-150',
      badge: 'bg-amber-500 text-white',
      icon: 'bg-white/95 text-amber-600 border-amber-200/80',
      bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
      border: 'border-amber-200/70 hover:border-amber-300',
      percentText: 'text-amber-600',
    },
  };

  const handleSelect = (cat: GameCategory) => {
    setSelectedCategory(cat);
    setScreen('game-library');
  };

  return (
    <div className="p-4 max-w-md md:max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="pb-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Cognitive Domains</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Select a specialized neural training category to begin
        </p>
      </div>

      {/* Responsive 2-Col (Mobile) / 3-Col (Desktop) Colorful 3D Artwork Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {categories.map((c) => {
          const Icon = iconMap[c.icon] || Brain;
          const theme = categoryThemeMap[c.category] || categoryThemeMap.math;

          return (
            <button
              key={c.category}
              type="button"
              onClick={() => handleSelect(c.category)}
              className={`relative rounded-2xl p-2.5 text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] overflow-hidden group bg-white border ${theme.border} shadow-[0_6px_20px_-4px_rgba(6,78,59,0.06)] hover:shadow-[0_12px_28px_-4px_rgba(5,150,105,0.14)] flex flex-col justify-between`}
            >
              {/* Top 3D Artwork Banner */}
              <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <img
                  src={theme.art}
                  alt={c.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${theme.imgFilter}`}
                />
                <span className={`absolute top-2 right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${theme.badge} shadow-xs tabular-nums`}>
                  {c.gamesCount} games
                </span>
                <div
                  className={`absolute bottom-2 left-2 w-8 h-8 rounded-lg flex items-center justify-center border shadow-xs backdrop-blur-xs ${theme.icon}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom: Title & Progress Bar */}
              <div className="px-1 pt-2.5 pb-1">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight truncate">
                  {c.name}
                </h3>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1.5 tabular-nums">
                  <span>Domain Mastery</span>
                  <span className={`font-extrabold ${theme.percentText}`}>{c.percentage}%</span>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Full Library Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/50 border border-emerald-200/80 shadow-[0_6px_20px_-4px_rgba(6,78,59,0.06)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Complete 26-Game Catalog</div>
            <div className="text-[11px] text-slate-500">
              Filter by difficulty, skill target, or cognitive speed
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedCategory(null);
            setScreen('game-library');
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-[0_4px_12px_rgba(5,150,105,0.22)] flex items-center gap-1.5 shrink-0 transition-all"
        >
          <span>Browse All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
