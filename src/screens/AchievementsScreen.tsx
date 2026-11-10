import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Flame,
  Calculator,
  Brain,
  Zap,
  Lock,
  Coins,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const AchievementsScreen: React.FC = () => {
  const { achievements, claimAchievement, user } = useAppStore();
  const [filter, setFilter] = useState<'All' | 'Unlocked' | 'Locked'>('All');

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Sparkles,
    Flame,
    Calculator,
    Brain,
    Zap,
    Trophy,
  };

  const filtered = achievements.filter((a) => {
    if (filter === 'Unlocked') return a.unlocked;
    if (filter === 'Locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="p-4 max-w-md md:max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-950/[0.08]">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Achievements</h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums font-medium">
            {unlockedCount} of {achievements.length} Cognitive Milestones Unlocked
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs tabular-nums">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>{user.badgesCount} Badges</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-emerald-50/70 p-1 rounded-xl border border-emerald-200/70 max-w-xs">
        {(['All', 'Unlocked', 'Locked'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((ach) => {
          const Icon = iconMap[ach.icon] || Trophy;
          const progressPercent = Math.min(
            100,
            Math.round((ach.progress / ach.maxProgress) * 100)
          );
          const isClaimable = !ach.unlocked && ach.progress >= ach.maxProgress;

          const rarityColor =
            ach.rarity === 'Legendary'
              ? 'text-amber-700 border-amber-200 bg-amber-50'
              : ach.rarity === 'Epic'
              ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
              : ach.rarity === 'Rare'
              ? 'text-teal-700 border-teal-200 bg-teal-50'
              : 'text-slate-600 border-slate-200 bg-slate-50';

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-white via-white to-emerald-50/45 border-emerald-200/80 shadow-[0_6px_20px_-4px_rgba(6,78,59,0.06)]'
                  : 'bg-white/85 border-slate-200/80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Icon Container */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    ach.unlocked
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-xs'
                      : 'bg-slate-100 text-slate-400 border-slate-200/80'
                  }`}
                >
                  {ach.unlocked ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {ach.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${rarityColor}`}>
                      {ach.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  {/* Progress & Reward */}
                  <div className="mt-3 tabular-nums">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-slate-500 font-medium">
                        {ach.unlocked
                          ? `Unlocked ${ach.unlockedAt || ''}`
                          : `Progress: ${ach.progress} / ${ach.maxProgress}`}
                      </span>
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-500" />
                        +{ach.rewardCoins} coins
                      </span>
                    </div>

                    {!ach.unlocked && (
                      <div className="h-1.5 w-full bg-emerald-100/70 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {isClaimable && (
                    <button
                      type="button"
                      onClick={() => claimAchievement(ach.id)}
                      className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Claim +{ach.rewardCoins} Coins
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
