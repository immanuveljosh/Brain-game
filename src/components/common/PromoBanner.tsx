import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PromoBanner: React.FC = () => {
  const { setScreen, showToast } = useAppStore();

  return (
    <div className="space-y-3 my-4">
      {/* Banner 1: Editorial Botanical Wellness Card with Real Photography */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-emerald-200/80 shadow-[0_8px_26px_-6px_rgba(6,78,59,0.08)] flex flex-col sm:flex-row items-stretch">
        <div className="relative sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden">
          <img
            src="/images/wellness-banner.jpg"
            alt="Botanical cognitive wellness workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/25 via-transparent to-transparent" />
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-emerald-800 border border-emerald-200/80 flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>12-Min Regimen</span>
          </span>
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 bg-gradient-to-br from-white via-white to-emerald-50/40">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
              Daily Neuroplasticity Habit
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug">
              Small steps every day lead to measurable cognitive gains.
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Train 12 minutes daily to strengthen working memory retention and executive focus.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setScreen('training-plan')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-[0_4px_12px_rgba(5,150,105,0.22)] flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <span>Start Daily Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Banner 2: Store Download Badges */}
      <div className="p-4 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
            <span className="font-extrabold text-slate-900">
              Mind<span className="text-emerald-600">Spark</span>
            </span>
            <span className="text-slate-400">• Cross-Platform Sync</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Real-time progress synchronization across Android, iOS, and Web
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Google Play badge */}
          <button
            type="button"
            onClick={() => showToast('MindSpark Android build is active on this device.', 'info')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-colors flex items-center gap-2 text-left"
          >
            <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.6 2.3c-.3.3-.4.8-.4 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.6 2.3z" fill="#00E676" />
              <path d="M16.2 15.3l-3.1-3.1v-.4l3.1-3.1.1.1 3.6 2.1c1 .6 1 1.5 0 2.1l-3.7 2.3z" fill="#FFD54F" />
              <path d="M13.1 12.2l-9.5 9.5c.3.3.8.4 1.4.1l11.2-6.5-3.1-3.1z" fill="#FF1744" />
              <path d="M13.1 11.8l3.1-3.1-11.2-6.5c-.6-.3-1.1-.2-1.4.1l9.5 9.5z" fill="#00E5FF" />
            </svg>
            <div>
              <div className="text-[8px] text-slate-300 leading-none uppercase">Get it on</div>
              <div className="text-[10px] font-bold text-white leading-none mt-0.5">Google Play</div>
            </div>
          </button>

          {/* App Store badge */}
          <button
            type="button"
            onClick={() => showToast('MindSpark iOS build is synced with your account.', 'info')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-colors flex items-center gap-2 text-left"
          >
            <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 170 170" aria-hidden="true">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.83-11.96-14.39-7.84-12.08-13.6-26.04-17.29-41.87-3.69-15.84-3.69-30.08 0-42.72 4.14-14.15 11.33-25.04 21.57-32.66 10.23-7.62 21.73-11.51 34.5-11.66 4.9 0 10.45 1.34 16.65 4.02 6.2 2.68 10.15 4.07 11.86 4.17 1.48-.1 5.72-1.61 12.72-4.52 7-2.92 13.06-4.14 18.18-3.67 13.43 1.15 24.41 6.38 32.93 15.68-11.75 7.15-17.5 17.07-17.25 29.77.25 10.02 4.15 18.52 11.72 25.49 7.57 6.97 16.59 10.96 27.06 11.97-2.22 6.78-4.99 13.62-8.32 20.52zM119.22 33.15c0-7.05 2.58-13.78 7.74-20.19 5.16-6.41 11.62-10.73 19.38-12.96.22 1.45.33 2.79.33 4.02 0 6.94-2.69 13.73-8.07 20.37-5.38 6.64-11.83 10.66-19.38 12.06v-3.3z" />
            </svg>
            <div>
              <div className="text-[8px] text-slate-300 leading-none">Download on the</div>
              <div className="text-[10px] font-bold text-white leading-none mt-0.5">App Store</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
