import React, { useState } from 'react';
import {
  TrendingUp,
  Trophy,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Flame,
  Crown,
  Edit2,
  Check,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const ProfileScreen: React.FC = () => {
  const { user, updateUserProfile, setScreen } = useAppStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(user.name);

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateUserProfile({ name: tempName.trim() });
    }
    setIsEditing(false);
  };

  const menuItems = [
    { label: 'Performance Analytics', icon: TrendingUp, screen: 'analytics' as const, isEmerald: true },
    {
      label: 'Achievements & Badges',
      icon: Trophy,
      screen: 'achievements' as const,
      isEmerald: true,
      highlight: true,
    },
    { label: 'Workspace Settings', icon: Settings, screen: 'settings' as const, isEmerald: false },
    { label: 'Help & Documentation', icon: HelpCircle, screen: 'settings' as const, isEmerald: false },
  ];

  return (
    <div className="p-4 max-w-md md:max-w-3xl mx-auto space-y-4">
      {/* Profile Header Card with Botanical Cover Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-emerald-50/55 border border-emerald-200/80 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.07)] flex flex-col items-center text-center pb-6">
        <div className="relative w-full h-28 overflow-hidden border-b border-emerald-100">
          <img
            src="/images/wellness-banner.jpg"
            alt="Profile cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative -mt-10 mb-2.5 z-10">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white ring-2 ring-emerald-500 shadow-[0_6px_20px_rgba(16,185,129,0.25)]"
          />
          {user.isPremium && (
            <span className="absolute -top-1 -right-1 p-1.5 bg-amber-400 text-slate-950 rounded-full shadow">
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
            </span>
          )}
        </div>

        {/* User Name & Level */}
        {isEditing ? (
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              aria-label="Edit display name"
              className="px-3 py-1 rounded-xl bg-white border border-emerald-500 text-sm font-bold text-slate-900 text-center focus:outline-none shadow-2xs"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveName}
              aria-label="Save name"
              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-0.5 relative z-10">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{user.name}</h2>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-emerald-700 p-1 rounded-lg hover:bg-emerald-50 transition-colors"
              title="Edit Display Name"
              aria-label="Edit display name"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 tabular-nums relative z-10">
          <span className="text-emerald-700 font-bold">Level {user.level}</span>
          <span>•</span>
          <span className="text-slate-700">{user.title}</span>
        </div>

        {/* Verified Gmail Badge / Action */}
        <button
          type="button"
          onClick={() => setScreen('auth')}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/90 text-xs font-bold text-emerald-800 transition-colors relative z-10 shadow-2xs"
        >
          <Mail className="w-3.5 h-3.5 text-emerald-600" />
          <span>{user.email}</span>
          {user.emailVerified ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase">
              <ShieldCheck className="w-2.5 h-2.5" />
              Verified
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold uppercase">
              Verify Gmail
            </span>
          )}
        </button>
      </div>

      {/* 3 Stat Badges Row */}
      <div className="grid grid-cols-3 gap-2.5 tabular-nums">
        <button
          type="button"
          onClick={() => setScreen('brain-score')}
          className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] hover:border-emerald-300 shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col items-center text-center cursor-pointer transition-all"
        >
          <span className="text-xl font-extrabold text-emerald-700">{user.brainScore}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">Brain Score</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen('daily-challenge')}
          className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] hover:border-emerald-300 shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col items-center text-center cursor-pointer transition-all"
        >
          <span className="text-xl font-extrabold text-amber-600 flex items-center gap-1">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            {user.streakDays}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">Day Streak</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen('achievements')}
          className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] hover:border-emerald-300 shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col items-center text-center cursor-pointer transition-all"
        >
          <span className="text-xl font-extrabold text-slate-900 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-emerald-600" />
            {user.badgesCount}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">Badges</span>
        </button>
      </div>

      {/* Profile Menu */}
      <div className="space-y-2 pt-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setScreen(item.screen)}
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                item.highlight
                  ? 'bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50 border border-emerald-200/90 shadow-xs text-slate-900'
                  : 'bg-white border border-emerald-950/[0.08] hover:border-emerald-300 text-slate-800 shadow-[0_2px_10px_-2px_rgba(6,78,59,0.04)]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`p-2 rounded-xl border ${
                    item.isEmerald
                      ? 'bg-emerald-50 border-emerald-200/80 text-emerald-600'
                      : 'bg-teal-50/70 border-teal-200/70 text-teal-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">{item.label}</span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          );
        })}

        {/* Log Out Button */}
        <button
          type="button"
          onClick={() => setScreen('auth')}
          className="w-full p-4 rounded-2xl bg-white border border-emerald-950/[0.08] hover:border-rose-300 flex items-center justify-between text-rose-600 transition-colors shadow-[0_2px_10px_-2px_rgba(6,78,59,0.04)]"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
