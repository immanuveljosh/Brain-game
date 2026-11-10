import React from 'react';
import {
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  Zap,
  Target,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const TrainingPlanScreen: React.FC = () => {
  const { startPlayingGame } = useAppStore();

  const routineSteps = [
    {
      step: 1,
      name: 'Warmup Reflexes',
      game: 'Reaction Test',
      gameId: 'reaction-test',
      duration: '2 mins',
      focus: 'Psychomotor arousal',
      completed: true,
    },
    {
      step: 2,
      name: 'High-Speed Arithmetic',
      game: 'Math Sprint',
      gameId: 'math-sprint',
      duration: '4 mins',
      focus: 'Numerical agility & speed',
      completed: true,
    },
    {
      step: 3,
      name: 'Deep Spatial Recall',
      game: 'Memory Tiles',
      gameId: 'memory-tiles',
      duration: '4 mins',
      focus: 'Working memory capacity',
      completed: false,
    },
    {
      step: 4,
      name: 'Inductive Logic Cooldown',
      game: 'Pattern Master',
      gameId: 'pattern-master',
      duration: '2 mins',
      focus: 'Pattern recognition',
      completed: false,
    },
  ];

  const days = [
    { day: 'Mon', status: 'completed' },
    { day: 'Tue', status: 'completed' },
    { day: 'Wed', status: 'completed' },
    { day: 'Thu', status: 'completed' },
    { day: 'Fri', status: 'completed' },
    { day: 'Sat', status: 'today' },
    { day: 'Sun', status: 'upcoming' },
  ];

  return (
    <div className="p-4 max-w-md md:max-w-4xl mx-auto space-y-4">
      {/* Editorial Botanical Workout Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-emerald-200/80 shadow-[0_8px_26px_-6px_rgba(6,78,59,0.08)]">
        <div className="relative h-36 sm:h-44 w-full overflow-hidden">
          <img
            src="/images/wellness-banner.jpg"
            alt="Daily cognitive workout environment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/25 to-transparent" />
          <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 fill-white" />
                <span>Personalized Regimen</span>
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-1">
                12-Minute Daily Neuro-Workout
              </h2>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/95 text-emerald-800 shrink-0 tabular-nums shadow-xs">
              Step 3 of 4
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Days */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/40 border border-emerald-200/80 shadow-[0_6px_22px_-4px_rgba(6,78,59,0.06)]">
        <div className="flex items-center justify-between text-xs mb-3.5">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Weekly Training Consistency</span>
          </span>
          <span className="text-emerald-700 font-bold tabular-nums">6 / 7 Days Complete</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((d) => (
            <div
              key={d.day}
              className={`p-2.5 rounded-xl flex flex-col items-center justify-center border transition-all ${
                d.status === 'completed'
                  ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-800'
                  : d.status === 'today'
                  ? 'bg-gradient-to-b from-emerald-600 to-teal-600 border-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.25)]'
                  : 'bg-white border-slate-200/70 text-slate-400'
              }`}
            >
              <span className="text-[10px] font-semibold">{d.day}</span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center mt-1">
                {d.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : d.status === 'today' ? (
                  <Zap className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routine Steps List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 tracking-tight">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Today&apos;s 4-Step Regimen</span>
          </h3>
          <span className="text-xs text-slate-500 flex items-center gap-1 tabular-nums">
            <Clock className="w-3.5 h-3.5 text-emerald-600" /> 12 mins total
          </span>
        </div>

        <div className="space-y-2.5">
          {routineSteps.map((st) => (
            <div
              key={st.step}
              className="p-4 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border tabular-nums ${
                    st.completed
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200/80'
                      : 'bg-teal-50 text-teal-700 border-teal-200/80'
                  }`}
                >
                  {st.completed ? <CheckCircle2 className="w-4 h-4" /> : st.step}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{st.name}</h4>
                    <span className="text-[10px] text-slate-400 tabular-nums">({st.duration})</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    <span className="text-emerald-700 font-semibold">{st.game}</span> • {st.focus}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                {st.completed ? (
                  <span className="text-[11px] font-semibold text-emerald-700 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Done</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => startPlayingGame(st.gameId)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-[0_4px_12px_rgba(5,150,105,0.22)] flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Full Workout Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => startPlayingGame('memory-tiles')}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-[0_6px_18px_rgba(5,150,105,0.26)] flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Continue Step 3: Deep Spatial Recall</span>
        </button>
      </div>
    </div>
  );
};
