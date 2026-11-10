import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Brain,
  Puzzle,
  Calculator,
  Zap,
  Eye,
  BookOpen,
  Calendar,
  Activity,
  Award,
  Clock,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const SCORE_HISTORY = [
  { date: 'Nov 1', score: 680, games: 3 },
  { date: 'Nov 2', score: 700, games: 4 },
  { date: 'Nov 3', score: 715, games: 5 },
  { date: 'Nov 4', score: 730, games: 4 },
  { date: 'Nov 5', score: 742, games: 6 },
  { date: 'Nov 6', score: 755, games: 5 },
  { date: 'Nov 7', score: 762, games: 7 },
];

const WEEKLY_MINUTES = [
  { day: 'Mon', minutes: 18 },
  { day: 'Tue', minutes: 22 },
  { day: 'Wed', minutes: 15 },
  { day: 'Thu', minutes: 28 },
  { day: 'Fri', minutes: 25 },
  { day: 'Sat', minutes: 35 },
  { day: 'Sun', minutes: 30 },
];

export const AnalyticsScreen: React.FC = () => {
  const { user, categories } = useAppStore();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Games' | 'Skills'>('Overview');

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Brain,
    Puzzle,
    Calculator,
    Zap,
    Eye,
    BookOpen,
  };

  return (
    <div className="p-4 max-w-md md:max-w-5xl mx-auto space-y-4">
      {/* Header & Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-emerald-950/[0.08]">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Performance Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Longitudinal cognitive telemetry &amp; domain mastery trends
          </p>
        </div>

        {/* Segmented Control */}
        <div
          role="tablist"
          className="flex bg-emerald-50/70 p-1 rounded-xl border border-emerald-200/70 sm:w-64"
        >
          {(['Overview', 'Games', 'Skills'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-3 gap-2.5 tabular-nums">
        <div className="p-3 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/80">
              <Activity className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">+2.8%</span>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-xl font-black text-slate-900 leading-tight whitespace-nowrap">91.4%</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-0.5 whitespace-nowrap">Accuracy</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200/80">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">25m/d</span>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-xl font-black text-slate-900 leading-tight whitespace-nowrap">173m</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-0.5 whitespace-nowrap">Time Trained</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/80">
              <Award className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">#5</span>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-xl font-black text-slate-900 leading-tight whitespace-nowrap">Top 16%</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-0.5 whitespace-nowrap">Percentile</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Brain Score Trajectory Card */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/35 border border-emerald-200/80 shadow-[0_6px_22px_-4px_rgba(6,78,59,0.06)]">
          <div className="flex items-center justify-between mb-3 tabular-nums">
            <div>
              <span className="text-[11px] font-bold text-emerald-800/70 uppercase tracking-wider">
                Brain Spark Trajectory
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user.brainScore}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  +{user.brainScoreChange}%
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-medium">7-Day Delta</span>
              <div className="text-xs font-bold text-emerald-700 mt-0.5">+82 BSI pts</div>
            </div>
          </div>

          <div className="w-full h-48 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SCORE_HISTORY} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D1FAE5" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[650, 800]}
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#A7F3D0',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#0F172A',
                    boxShadow: '0 8px 24px rgba(6,78,59,0.10)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreAreaGradient)"
                  dot={{ r: 3.5, fill: '#059669', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Training Time Bar Chart */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_6px_22px_-4px_rgba(6,78,59,0.05)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 tabular-nums">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Session Volume
              </span>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Daily Active Minutes</span>
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
              173m total
            </span>
          </div>

          <div className="w-full h-48 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_MINUTES} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(16,185,129,0.06)' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#A7F3D0',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#0F172A',
                    boxShadow: '0 8px 24px rgba(6,78,59,0.10)',
                  }}
                />
                <Bar dataKey="minutes" fill="#0D9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domain Proficiency Breakdown */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_20px_-4px_rgba(6,78,59,0.05)]">
        <h3 className="text-sm font-extrabold text-slate-900 mb-3.5 tracking-tight">Domain Proficiency Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
          {categories.map((c) => {
            const Icon = iconMap[c.icon] || Brain;
            const domainTheme: Record<string, { icon: string; bar: string; text: string }> = {
              memory: {
                icon: 'bg-orange-50 text-orange-600 border-orange-200/80',
                bar: 'bg-gradient-to-r from-orange-500 to-rose-500',
                text: 'text-orange-700',
              },
              logic: {
                icon: 'bg-blue-50 text-blue-600 border-blue-200/80',
                bar: 'bg-gradient-to-r from-blue-600 to-cyan-500',
                text: 'text-blue-700',
              },
              math: {
                icon: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
                bar: 'bg-gradient-to-r from-emerald-500 to-teal-600',
                text: 'text-emerald-700',
              },
              focus: {
                icon: 'bg-violet-50 text-violet-600 border-violet-200/80',
                bar: 'bg-gradient-to-r from-violet-600 to-fuchsia-500',
                text: 'text-violet-700',
              },
              visual: {
                icon: 'bg-pink-50 text-pink-600 border-pink-200/80',
                bar: 'bg-gradient-to-r from-pink-500 to-rose-500',
                text: 'text-pink-700',
              },
              language: {
                icon: 'bg-amber-50 text-amber-600 border-amber-200/80',
                bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
                text: 'text-amber-700',
              },
            };
            const theme = domainTheme[c.category] || domainTheme.math;

            return (
              <div key={c.category}>
                <div className="flex items-center justify-between text-xs mb-1.5 tabular-nums">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${theme.icon}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-700">{c.name}</span>
                  </div>
                  <span className={`font-extrabold ${theme.text}`}>{c.percentage}%</span>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                    style={{
                      width: `${c.percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
