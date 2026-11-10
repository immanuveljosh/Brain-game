import React from 'react';
import { ChevronRight, Grid, Calculator, Shapes, Zap, Play } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const RecommendedGames: React.FC = () => {
  const { setScreen, startPlayingGame } = useAppStore();

  const recommended = [
    {
      id: 'memory-tiles',
      title: 'Memory Tiles',
      category: 'Spatial Memory',
      icon: Grid,
      image: '/images/memory-art.jpg',
      imgFilter: '',
      badge: 'Level 2',
      badgeStyle: 'bg-orange-500 text-white',
      playBtn: 'bg-gradient-to-r from-orange-500 to-rose-500',
      iconBox: 'bg-orange-50 text-orange-600 border-orange-200/80',
      cardBorder: 'border-orange-200/70 hover:border-orange-300',
    },
    {
      id: 'math-sprint',
      title: 'Math Sprint',
      category: 'Numerical Speed',
      icon: Calculator,
      image: '/images/math-art.jpg',
      imgFilter: '',
      badge: 'Medium',
      badgeStyle: 'bg-emerald-600 text-white',
      playBtn: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      iconBox: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      cardBorder: 'border-emerald-200/80 hover:border-emerald-300',
    },
    {
      id: 'pattern-master',
      title: 'Pattern Master',
      category: 'Deductive Logic',
      icon: Shapes,
      image: '/images/logic-art.jpg',
      imgFilter: '',
      badge: 'Popular',
      badgeStyle: 'bg-blue-600 text-white',
      playBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      iconBox: 'bg-blue-50 text-blue-600 border-blue-200/80',
      cardBorder: 'border-blue-200/70 hover:border-blue-300',
    },
    {
      id: 'reaction-test',
      title: 'Reaction Test',
      category: 'Visual Reflex',
      icon: Zap,
      image: '/images/focus-art.jpg',
      imgFilter: 'hue-rotate-[110deg] saturate-150',
      badge: 'Reflex',
      badgeStyle: 'bg-violet-600 text-white',
      playBtn: 'bg-gradient-to-r from-violet-600 to-fuchsia-500',
      iconBox: 'bg-violet-50 text-violet-600 border-violet-200/80',
      cardBorder: 'border-violet-200/70 hover:border-violet-300',
    },
  ];

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Recommended Training</h3>
          <p className="text-[11px] text-slate-500 font-medium">Curated for your daily neural profile</p>
        </div>
        <button
          type="button"
          onClick={() => setScreen('game-library')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/70 flex items-center gap-0.5 group transition-colors"
        >
          <span>See All 26</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {recommended.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => startPlayingGame(g.id)}
              className={`p-2.5 rounded-2xl bg-white border ${g.cardBorder} shadow-[0_6px_20px_-4px_rgba(6,78,59,0.06)] hover:shadow-[0_12px_28px_-4px_rgba(5,150,105,0.14)] transition-all duration-200 cursor-pointer flex flex-col text-left group active:scale-[0.98]`}
            >
              {/* 3D Studio Artwork Cover */}
              <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <img
                  src={g.image}
                  alt={g.title}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${g.imgFilter}`}
                />
                <span className={`absolute top-1.5 left-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded-md ${g.badgeStyle} shadow-xs`}>
                  {g.badge}
                </span>
                <span className={`absolute bottom-1.5 right-1.5 w-6 h-6 rounded-lg ${g.playBtn} text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105`}>
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </span>
              </div>

              <div className="mt-2.5 px-1 flex items-center justify-between gap-1.5">
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {g.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    {g.category}
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg border shrink-0 ${g.iconBox}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
