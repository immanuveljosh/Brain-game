import React from 'react';
import { Flame, Coins, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const QuickStatsRow: React.FC = () => {
  const { user, setScreen } = useAppStore();

  const stats = [
    {
      label: 'Daily Streak',
      value: `${user.streakDays} Days`,
      icon: Flame,
      iconBg: 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-[0_4px_10px_rgba(249,115,22,0.3)]',
      cardBg: 'from-white via-white to-orange-50/45 border-orange-200/70 hover:border-orange-300',
      valueColor: 'text-orange-600',
      screen: 'daily-challenge' as const,
    },
    {
      label: 'Total Coins',
      value: user.coins.toLocaleString(),
      icon: Coins,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)]',
      cardBg: 'from-white via-white to-emerald-50/50 border-emerald-200/80 hover:border-emerald-300',
      valueColor: 'text-emerald-700',
      screen: 'achievements' as const,
    },
    {
      label: 'Badges',
      value: `${user.badgesCount} Won`,
      icon: Trophy,
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-[0_4px_10px_rgba(139,92,246,0.3)]',
      cardBg: 'from-white via-white to-violet-50/45 border-violet-200/70 hover:border-violet-300',
      valueColor: 'text-violet-700',
      screen: 'achievements' as const,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 my-3">
      {stats.map((st) => {
        const Icon = st.icon;
        return (
          <button
            key={st.label}
            type="button"
            onClick={() => setScreen(st.screen)}
            className={`p-3.5 rounded-2xl bg-gradient-to-b ${st.cardBg} border shadow-[0_4px_16px_-4px_rgba(6,78,59,0.06)] hover:shadow-[0_8px_20px_-4px_rgba(5,150,105,0.12)] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-[0.98]`}
          >
            <div className={`p-2 rounded-xl ${st.iconBg} mb-1.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">{st.label}</div>
            <div className={`text-sm font-black ${st.valueColor} mt-0.5 tabular-nums whitespace-nowrap`}>{st.value}</div>
          </button>
        );
      })}
    </div>
  );
};
