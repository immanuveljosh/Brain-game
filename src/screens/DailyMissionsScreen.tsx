import React from 'react';
import { Target, Gift, Clock, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const DailyMissionsScreen: React.FC = () => {
  const { startPlayingGame, setScreen } = useAppStore();

  const missions = [
    {
      id: 'm1',
      title: 'Speed Specialist',
      desc: 'Play 3 Speed & Focus games',
      current: 3,
      total: 3,
      completed: true,
      rewardXp: 60,
      rewardCoins: 35,
      gameId: 'reaction-test',
    },
    {
      id: 'm2',
      title: 'Precision Master',
      desc: 'Achieve 90%+ accuracy in Math Sprint',
      current: 1,
      total: 1,
      completed: true,
      rewardXp: 80,
      rewardCoins: 50,
      gameId: 'math-sprint',
    },
    {
      id: 'm3',
      title: 'Daily Triple',
      desc: 'Complete all 3 games in Daily Challenge',
      current: 2,
      total: 3,
      completed: false,
      rewardXp: 100,
      rewardCoins: 75,
      gameId: 'pattern-master',
    },
    {
      id: 'm4',
      title: 'Social Challenger',
      desc: 'Send a 1v1 brain duel invite to a friend',
      current: 0,
      total: 1,
      completed: false,
      rewardXp: 50,
      rewardCoins: 25,
      isSocial: true,
    },
  ];

  return (
    <div className="p-4 max-w-md md:max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-950/[0.08]">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Daily Quests</span>
            <Target className="w-5 h-5 text-emerald-600" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 tabular-nums font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resets in 11h 42m</span>
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs tabular-nums">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>2 / 4 Completed</span>
        </div>
      </div>

      {/* Super Chest Reward Card */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/55 border border-emerald-200/80 flex items-center justify-between gap-4 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.07)]">
        <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-400/15 blur-2xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
            Milestone Chest
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-0.5 tracking-tight">
            Mystery Cognitive Chest
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete all 4 daily quests to unlock +200 Coins and an exclusive profile badge.
          </p>
        </div>
        <div className="relative z-10 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 shrink-0 shadow-2xs">
          <Gift className="w-7 h-7" />
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-2.5">
        {missions.map((m) => {
          const percent = Math.min(100, Math.round((m.current / m.total) * 100));

          return (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{m.title}</h4>
                  {m.completed && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                      Completed
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>

                {/* Progress bar */}
                <div className="mt-2.5 flex items-center gap-2.5">
                  <div className="flex-1 h-1.5 bg-emerald-100/70 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        m.completed
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 whitespace-nowrap tabular-nums">
                    {m.current}/{m.total}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 flex flex-col items-end gap-1.5 tabular-nums">
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-600">+{m.rewardCoins} coins</span>
                  <div className="text-[10px] text-emerald-700 font-semibold">+{m.rewardXp} XP</div>
                </div>

                {!m.completed && (
                  <button
                    type="button"
                    onClick={() => {
                      if (m.isSocial) {
                        setScreen('multiplayer');
                      } else if (m.gameId) {
                        startPlayingGame(m.gameId);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-[0_4px_12px_rgba(5,150,105,0.22)] active:scale-95 transition-all"
                  >
                    Start
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
