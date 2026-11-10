import React from 'react';
import {
  Calendar,
  Gift,
  CheckCircle2,
  Play,
  ArrowRight,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const DailyChallengeScreen: React.FC = () => {
  const {
    user,
    dailyTasks,
    claimDailyReward,
    startPlayingGame,
    setScreen,
  } = useAppStore();

  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const totalCount = dailyTasks.length;
  const isAllComplete = completedCount === totalCount;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-4 max-w-md md:max-w-4xl mx-auto space-y-4">
      {/* Date Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-950/[0.08]">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Daily Challenge</span>
            <span className="p-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/80">
              <Flame className="w-4 h-4 fill-amber-500" />
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 tabular-nums font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user.streakDays}-Day Active Streak</span>
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs tabular-nums">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>+100 Bonus Coins</span>
        </div>
      </div>

      {/* Main Goal Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/50 border border-emerald-200/80 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.07)] relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-400/15 blur-2xl" />

        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Today&apos;s Objective
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1 tracking-tight">
              Complete 3 cognitive games today
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Finish all three exercises to earn your daily bonus chest and extend your streak.
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-200/80 bg-white shrink-0 shadow-sm">
            <img
              src="/images/daily-trophy.jpg"
              alt="Daily Challenge Trophy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="mt-5 relative z-10">
          <div className="flex justify-between text-xs font-semibold mb-1.5 tabular-nums">
            <span className="text-slate-500">Completion Progress</span>
            <span className="text-emerald-800 font-bold">
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          </div>

          <div className="h-2 w-full bg-emerald-100/70 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {isAllComplete && (
          <button
            type="button"
            onClick={claimDailyReward}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-[0_4px_14px_rgba(5,150,105,0.25)] flex items-center justify-center gap-1.5 transition-all"
          >
            <Gift className="w-4 h-4" />
            <span>Claim +100 Bonus Coins &amp; +150 XP</span>
          </button>
        )}
      </div>

      {/* Today's Games List */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 tracking-tight">Assigned Exercises</h3>

        <div className="space-y-2.5">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 border ${
                    task.completed
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200/80'
                      : 'bg-teal-50 text-teal-700 border-teal-200/80'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Zap className="w-5 h-5 text-teal-600" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="truncate">{task.gameTitle}</span>
                    {task.completed && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{task.target}</div>
                </div>
              </div>

              {/* Action */}
              {task.completed ? (
                <div className="text-right shrink-0 tabular-nums">
                  <span className="text-xs font-bold text-emerald-700">+{task.rewardXp} XP</span>
                  <div className="text-[11px] text-amber-600 font-semibold">+{task.rewardCoins} coins</div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startPlayingGame(task.gameId)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-[0_4px_12px_rgba(5,150,105,0.22)] flex items-center gap-1.5 active:scale-95 shrink-0 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer link to all games */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setScreen('game-library')}
          className="w-full py-3 rounded-xl bg-white hover:bg-emerald-50/40 border border-emerald-200/80 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
        >
          <span>Explore Full Game Library</span>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    </div>
  );
};
