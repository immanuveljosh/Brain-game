import React from 'react';
import { Home, Gamepad2, TrendingUp, Trophy, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ScreenId } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, setScreen } = useAppStore();

  const navItems: { label: string; screen: ScreenId; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Home', screen: 'home', icon: Home },
    { label: 'Games', screen: 'categories', icon: Gamepad2 },
    { label: 'Progress', screen: 'analytics', icon: TrendingUp },
    { label: 'Rewards', screen: 'achievements', icon: Trophy },
    { label: 'Profile', screen: 'profile', icon: User },
  ];

  const isCurrentActive = (itemScreen: ScreenId) => {
    if (itemScreen === 'home') {
      return currentScreen === 'home' || currentScreen === 'brain-score' || currentScreen === 'daily-challenge';
    }
    if (itemScreen === 'categories') {
      return (
        currentScreen === 'categories' ||
        currentScreen === 'game-library' ||
        currentScreen === 'game-play' ||
        currentScreen === 'game-results'
      );
    }
    if (itemScreen === 'analytics') {
      return currentScreen === 'analytics' || currentScreen === 'leaderboard';
    }
    if (itemScreen === 'achievements') {
      return currentScreen === 'achievements' || currentScreen === 'daily-missions';
    }
    if (itemScreen === 'profile') {
      return (
        currentScreen === 'profile' ||
        currentScreen === 'settings' ||
        currentScreen === 'premium' ||
        currentScreen === 'multiplayer' ||
        currentScreen === 'training-plan'
      );
    }
    return false;
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-emerald-950/[0.08] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,8px))] shadow-[0_-6px_24px_rgba(6,78,59,0.06)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isCurrentActive(item.screen);

          return (
            <button
              key={item.label}
              onClick={() => setScreen(item.screen)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={`relative min-h-[48px] min-w-[62px] flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 select-none ${
                active
                  ? 'text-emerald-700'
                  : 'text-slate-400 hover:text-slate-700 active:scale-95'
              }`}
            >
              {active && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/95 to-teal-50/70 rounded-xl border border-emerald-200/80 shadow-2xs" />
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-emerald-600" />
                </>
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'text-emerald-600 scale-105' : ''
                  }`}
                />
                <span
                  className={`text-[11px] mt-1 tracking-tight transition-colors ${
                    active ? 'text-emerald-800 font-bold' : 'text-slate-500 font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
