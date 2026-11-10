import React from 'react';
import {
  Sparkles,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const BrainScoreDashboard: React.FC = () => {
  const { user, setScreen, goBack } = useAppStore();

  const cognitivePercentiles = [
    { title: 'Working Memory', percentile: 92, status: 'Top 8%', isPrimary: true },
    { title: 'Deductive Reasoning', percentile: 86, status: 'Top 14%', isPrimary: false },
    { title: 'Mental Arithmetic', percentile: 78, status: 'Top 22%', isPrimary: true },
    { title: 'Reaction Speed', percentile: 74, status: 'Top 26%', isPrimary: false },
    { title: 'Spatial Visualization', percentile: 69, status: 'Top 31%', isPrimary: false },
    { title: 'Verbal Fluency', percentile: 62, status: 'Top 38%', isPrimary: false },
  ];

  return (
    <div className="p-4 max-w-md md:max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-emerald-950/[0.08]">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="p-2 rounded-xl bg-white border border-emerald-950/[0.08] text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/40 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Brain Spark Index Diagnostics
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Clinical-grade cognitive capacity &amp; percentile breakdown
          </span>
        </div>
      </div>

      {/* Main Score Hero Card with 3D Emerald Brain Sculpture */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-white to-emerald-50/60 border border-emerald-200/80 shadow-[0_10px_30px_-6px_rgba(6,78,59,0.08)] relative overflow-hidden text-center">
        <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-teal-400/10 blur-2xl" />

        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-emerald-200 shadow-md bg-white relative z-10">
          <img
            src="/images/hero-brain.jpg"
            alt="3D Emerald Brain Sculpture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold mb-2 relative z-10 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Level {user.level} • {user.title}</span>
        </div>

        <div className="text-5xl font-extrabold text-slate-900 tracking-tight tabular-nums relative z-10">
          {user.brainScore}
          <span className="text-lg text-slate-400 font-semibold ml-1">/ 1,000</span>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2.5 tabular-nums relative z-10">
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            +{user.brainScoreChange}% this week
          </span>
          <span className="text-xs text-slate-500 font-medium">• Outperforming 84% of cohort</span>
        </div>

        {/* Estimated Brain Age Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 flex items-center justify-around text-xs tabular-nums relative z-10">
          <div>
            <div className="text-slate-500 font-medium">Estimated Neural Age</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">23 Years</div>
          </div>
          <div className="h-8 w-px bg-emerald-200/80" />
          <div>
            <div className="text-slate-500 font-medium">Cognitive Vitality</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">+7 yrs younger</div>
          </div>
        </div>
      </div>

      {/* Percentiles Breakdown */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_20px_-4px_rgba(6,78,59,0.05)]">
        <h3 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2 tracking-tight">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cognitive Dimension Percentiles</span>
        </h3>

        <div className="space-y-3">
          {cognitivePercentiles.map((dim) => (
            <div key={dim.title}>
              <div className="flex items-center justify-between text-xs mb-1.5 tabular-nums">
                <span className="font-semibold text-slate-700">{dim.title}</span>
                <span className={`font-bold ${dim.isPrimary ? 'text-emerald-700' : 'text-teal-700'}`}>
                  {dim.status}
                </span>
              </div>
              <div className="h-1.5 w-full bg-emerald-100/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    dim.isPrimary
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-700'
                  }`}
                  style={{ width: `${dim.percentile}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailored AI Recommendations */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 border border-emerald-200/80 shadow-[0_4px_20px_-4px_rgba(6,78,59,0.05)]">
        <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Targeted Training Recommendation</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your <strong className="text-slate-900">Working Memory</strong> and <strong className="text-slate-900">Deductive Reasoning</strong> rank in the top 15%. To reach the <strong className="text-emerald-700">850+ Grandmaster Tier</strong>, prioritize <strong className="text-slate-900">Color Confusion</strong> and <strong className="text-slate-900">Pattern Master</strong> sessions this week.
        </p>
        <button
          type="button"
          onClick={() => setScreen('training-plan')}
          className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
        >
          <span>Open Personalized Training Plan</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
