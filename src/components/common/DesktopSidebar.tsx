import React from 'react';
import {
  Home,
  Gamepad2,
  TrendingUp,
  Trophy,
  User,
  Settings,
  Crown,
  Calendar,
  Users,
  Target,
  Sparkles,
  Brain,
  CheckSquare,
  Flame,
} from 'lucide-react';
import { BrainLogo } from './BrainLogo';
import { useAppStore } from '../../store/useAppStore';
import { ScreenId } from '../../types';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const DesktopSidebar: React.FC = () => {
  const { currentScreen, setScreen, user, dailyTasks } = useAppStore();
  const completedDaily = dailyTasks.filter((t) => t.completed).length;

  const navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'daily-challenge', label: 'Daily Challenge', icon: Calendar, badge: `${completedDaily}/${dailyTasks.length}` },
        { id: 'training-plan', label: 'Training Plan', icon: Target },
      ],
    },
    {
      title: 'Cognitive Training',
      items: [
        { id: 'categories', label: 'Categories', icon: Gamepad2, badge: '6' },
        { id: 'game-library', label: 'Game Library', icon: Sparkles, badge: '26' },
        { id: 'daily-missions', label: 'Daily Quests', icon: CheckSquare },
      ],
    },
    {
      title: 'Analytics & Social',
      items: [
        { id: 'brain-score', label: 'Brain Index', icon: Brain },
        { id: 'analytics', label: 'Performance', icon: TrendingUp },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: '#5' },
        { id: 'achievements', label: 'Achievements', icon: Sparkles, badge: `${user.badgesCount}` },
        { id: 'multiplayer', label: 'Live Arena 1v1', icon: Users, badge: 'LIVE' },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-xl border-r border-emerald-950/[0.08] flex flex-col justify-between h-[calc(100vh-37px)] sticky top-[37px] p-4 text-slate-700 select-none z-30 overflow-y-auto no-scrollbar">
      <div>
        {/* Brand Header */}
        <div
          onClick={() => setScreen('home')}
          className="flex items-center justify-between px-2 py-1.5 mb-4 cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <BrainLogo size="sm" showText={false} />
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900">
                Mind<span className="text-emerald-600">Spark</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Cognitive Suite</div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-[10px] font-bold tabular-nums">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{user.streakDays}d</span>
          </div>
        </div>

        {/* User Profile Card */}
        <button
          onClick={() => setScreen('profile')}
          className="w-full mb-5 p-2.5 rounded-xl bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 border border-emerald-200/70 hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-3 text-left shadow-2xs"
        >
          <div className="relative shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-emerald-300"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-bold tabular-nums">
                Lv.{user.level}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5 tabular-nums">
              BSI Score: <span className="font-bold text-emerald-700">{user.brainScore}</span>
            </div>
          </div>
        </button>

        {/* Grouped Navigation */}
        <nav className="space-y-4" aria-label="Main Sidebar Navigation">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setScreen(item.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`relative w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-emerald-50/90 text-emerald-800 font-semibold border border-emerald-200/80 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-600" />
                      )}
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums ${
                            active
                              ? 'bg-white text-emerald-700 border border-emerald-200/80'
                              : item.badge === 'LIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Upgrade Banner Bottom Card (Premium Emerald & White) */}
      <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 border border-emerald-200/80 relative overflow-hidden shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-700 border border-emerald-200">
            <Crown className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900">
            {user.isPremium ? 'MindSpark Pro Active' : 'MindSpark Pro'}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
          {user.isPremium
            ? 'All 26 cognitive games and neural diagnostics unlocked.'
            : 'Unlock all 26 brain games & full clinical analytics.'}
        </p>
        {!user.isPremium && (
          <button
            onClick={() => setScreen('premium')}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(5,150,105,0.22)]"
          >
            Upgrade Workspace
          </button>
        )}
      </div>
    </aside>
  );
};
