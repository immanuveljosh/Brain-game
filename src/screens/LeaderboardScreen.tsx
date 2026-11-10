import React, { useState } from 'react';
import { Crown, Trophy, Medal, Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const LeaderboardScreen: React.FC = () => {
  const { leaderboardGlobal, leaderboardFriends } = useAppStore();
  const [activeTab, setActiveTab] = useState<'Global' | 'Friends'>('Global');

  const list = activeTab === 'Global' ? leaderboardGlobal : leaderboardFriends;
  const top1 = list.find((u) => u.rank === 1);
  const top2 = list.find((u) => u.rank === 2);
  const top3 = list.find((u) => u.rank === 3);
  const runnersUp = list.filter((u) => u.rank > 3);

  return (
    <div className="p-4 max-w-md md:max-w-4xl mx-auto space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-emerald-950/[0.08]">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Leaderboard</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Weekly cognitive rankings by Brain Spark Index
          </p>
        </div>

        {/* Tabs [Global] [Friends] */}
        <div className="flex bg-emerald-50/70 p-1 rounded-xl border border-emerald-200/70 sm:w-56">
          <button
            type="button"
            onClick={() => setActiveTab('Global')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'Global'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Global
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Friends')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'Friends'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="pt-6 pb-2 px-2 flex items-end justify-center gap-3 sm:gap-6 tabular-nums">
        {/* Rank 2 (Silver) */}
        {top2 && (
          <div className="flex flex-col items-center flex-1 max-w-[115px]">
            <div className="relative mb-2">
              <img
                src={top2.avatar}
                alt={top2.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-300 shadow-sm"
              />
              <span className="absolute -bottom-1.5 -right-1 w-5 h-5 rounded-full bg-slate-200 text-slate-900 font-extrabold text-[11px] flex items-center justify-center border border-white">
                2
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate w-full text-center">
              {top2.name}
            </div>
            <div className="text-xs font-extrabold text-teal-700 mt-0.5">
              {top2.score.toLocaleString()}
            </div>
            <div className="w-full h-20 bg-gradient-to-b from-white to-slate-50 rounded-t-2xl border-t border-x border-slate-200/90 shadow-sm mt-2 flex items-center justify-center">
              <Medal className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        )}

        {/* Rank 1 (Champion) */}
        {top1 && (
          <div className="flex flex-col items-center flex-1 max-w-[125px] -mt-4">
            <Crown className="w-6 h-6 text-amber-500 fill-amber-400 mb-1.5" />
            <div className="relative mb-2">
              <img
                src={top1.avatar}
                alt={top1.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-emerald-500 shadow-[0_4px_16px_rgba(16,185,129,0.25)]"
              />
              <span className="absolute -bottom-1.5 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center border-2 border-white">
                1
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 truncate w-full text-center">
              {top1.name}
            </div>
            <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
              {top1.score.toLocaleString()}
            </div>
            <div className="w-full h-28 bg-gradient-to-b from-emerald-50/70 to-white rounded-t-2xl border-t-2 border-x border-emerald-300 shadow-sm mt-2 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-amber-500" />
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 && (
          <div className="flex flex-col items-center flex-1 max-w-[115px]">
            <div className="relative mb-2">
              <img
                src={top3.avatar}
                alt={top3.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-600/60 shadow-sm"
              />
              <span className="absolute -bottom-1.5 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white font-extrabold text-[11px] flex items-center justify-center border border-white">
                3
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate w-full text-center">
              {top3.name}
            </div>
            <div className="text-xs font-extrabold text-teal-700 mt-0.5">
              {top3.score.toLocaleString()}
            </div>
            <div className="w-full h-16 bg-gradient-to-b from-white to-amber-50/30 rounded-t-2xl border-t border-x border-slate-200/90 shadow-sm mt-2 flex items-center justify-center">
              <Medal className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        )}
      </div>

      {/* Ranked Table List */}
      <div className="space-y-2 tabular-nums">
        {runnersUp.map((u) => {
          const isMe = u.isCurrentUser;
          return (
            <div
              key={u.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                isMe
                  ? 'bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 border-emerald-300 shadow-sm'
                  : 'bg-white border-emerald-950/[0.08] hover:border-emerald-200 shadow-[0_2px_10px_-2px_rgba(6,78,59,0.04)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 text-center text-xs font-bold ${
                    isMe ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  #{u.rank}
                </span>

                <img
                  src={u.avatar}
                  alt={u.name}
                  className={`w-9 h-9 rounded-full object-cover border ${
                    isMe ? 'border-emerald-500' : 'border-slate-200'
                  }`}
                />

                <div>
                  <div
                    className={`text-xs font-bold ${
                      isMe ? 'text-slate-900 flex items-center gap-1.5' : 'text-slate-800'
                    }`}
                  >
                    <span>{u.name}</span>
                    {isMe && (
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{u.streak}d streak</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-extrabold ${
                    isMe ? 'text-emerald-700' : 'text-slate-900'
                  }`}
                >
                  {u.score.toLocaleString()}
                </div>
                {u.change && (
                  <div className="text-[10px] flex items-center justify-end gap-0.5 mt-0.5">
                    {u.change === 'up' && (
                      <span className="text-emerald-600 flex items-center font-semibold">
                        <ArrowUp className="w-2.5 h-2.5" /> +1
                      </span>
                    )}
                    {u.change === 'down' && (
                      <span className="text-rose-500 flex items-center font-semibold">
                        <ArrowDown className="w-2.5 h-2.5" /> -1
                      </span>
                    )}
                    {u.change === 'same' && (
                      <span className="text-slate-400 flex items-center">
                        <Minus className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
