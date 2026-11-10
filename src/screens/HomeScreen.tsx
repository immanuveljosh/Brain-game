import React, { useState } from 'react';
import { BrainScoreCard } from '../components/dashboard/BrainScoreCard';
import { QuickStatsRow } from '../components/dashboard/QuickStatsRow';
import { DailyChallengeCard } from '../components/dashboard/DailyChallengeCard';
import { RecommendedGames } from '../components/dashboard/RecommendedGames';
import { CategoryPerformanceWidget } from '../components/dashboard/CategoryPerformanceWidget';
import { PromoBanner } from '../components/common/PromoBanner';
import { Users, Bell, Flame, Coins, Zap, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const HomeScreen: React.FC = () => {
  const { user, setScreen } = useAppStore();
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  return (
    <div className="p-4 space-y-4 max-w-md md:max-w-5xl mx-auto">
      {/* User Greeting & Stats Header */}
      <div className="flex items-center justify-between pb-1">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setScreen('profile')}
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400/80 group-hover:border-emerald-600 transition-colors shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Good Morning,</div>
            <div className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5 tracking-tight">
              <span>{user.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xs tabular-nums">
                Lv.{user.level}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScreen('daily-challenge')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50/90 border border-orange-200/90 text-orange-800 text-xs font-extrabold cursor-pointer hover:border-orange-300 transition-colors shadow-2xs tabular-nums"
            title={`${user.streakDays} day training streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{user.streakDays}d</span>
          </button>

          <button
            type="button"
            onClick={() => setScreen('achievements')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-emerald-200/80 text-slate-800 text-xs font-bold cursor-pointer hover:border-emerald-300 transition-colors shadow-2xs tabular-nums"
            title={`${user.coins} coins`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user.coins.toLocaleString()}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="relative p-2 rounded-xl bg-white border border-emerald-950/[0.08] text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/40 transition-colors shadow-2xs"
            aria-label="Notifications"
            aria-expanded={showNotificationToast}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Inline Notification Banner */}
      {showNotificationToast && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/80 border border-emerald-200 shadow-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-emerald-800 font-bold">Daily Goal Reminder: </span>
              <span className="text-slate-700">Only 1 exercise remaining to claim today&apos;s +100 Coin bonus.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowNotificationToast(false);
              setScreen('daily-challenge');
            }}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold ml-3 whitespace-nowrap transition-colors shadow-xs"
          >
            Complete Now
          </button>
        </div>
      )}

      {/* Top Overview Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 space-y-3">
          {/* 1. Main Brain Score Card */}
          <BrainScoreCard />
          {/* 2. Quick Stats Row */}
          <QuickStatsRow />
        </div>

        <div className="lg:col-span-5 space-y-3">
          {/* 3. Daily Challenge Action Card */}
          <DailyChallengeCard />

          {/* Quick Launch Cards Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setScreen('leaderboard')}
              className="p-3.5 rounded-2xl bg-gradient-to-b from-white via-white to-amber-50/55 border border-amber-200/80 hover:border-amber-300 shadow-[0_4px_16px_-4px_rgba(245,158,11,0.08)] cursor-pointer transition-all flex flex-col justify-between gap-2.5 group text-left"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-200/90 bg-amber-50 flex items-center justify-center shadow-2xs">
                  <img
                    src="/images/daily-trophy.jpg"
                    alt="Leaderboard Trophy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs tabular-nums">
                  Rank #5
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Leaderboard
                  </div>
                  <div className="text-[11px] text-amber-700 font-semibold">Global Cohort</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScreen('multiplayer')}
              className="p-3.5 rounded-2xl bg-gradient-to-b from-white via-white to-violet-50/55 border border-violet-200/80 hover:border-violet-300 shadow-[0_4px_16px_-4px_rgba(139,92,246,0.08)] cursor-pointer transition-all flex flex-col justify-between gap-2.5 group text-left"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_3px_10px_rgba(124,58,237,0.3)]">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex -space-x-1.5">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                    alt=""
                    className="w-5 h-5 rounded-full object-cover ring-2 ring-white"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                    alt=""
                    className="w-5 h-5 rounded-full object-cover ring-2 ring-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-violet-700 transition-colors">
                    1v1 Live Arena
                  </div>
                  <div className="text-[11px] text-violet-700 font-semibold">2 Friends Online</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recommended Games Section */}
      <RecommendedGames />

      {/* 5. Category Performance Bars */}
      <CategoryPerformanceWidget />

      {/* 6. Promotional Banner & Store Badges */}
      <PromoBanner />
    </div>
  );
};
