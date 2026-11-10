import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BrainLogo } from '../components/common/BrainLogo';
import { useAppStore } from '../store/useAppStore';

export const SplashScreen: React.FC = () => {
  const { setScreen } = useAppStore();
  const [progress, setProgress] = useState<number>(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      onClick={() => setScreen('onboarding')}
      className="flex flex-col items-center justify-between min-h-[82vh] max-w-md mx-auto w-full p-8 text-center cursor-pointer select-none relative overflow-hidden"
    >
      {/* Top spacer */}
      <div className="h-8" />

      {/* Center Logo */}
      <div className="flex flex-col items-center z-10">
        <BrainLogo size="xl" showText={true} tagline="Train Your Mind • Build a Better You" />
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="w-full max-w-xs z-10 mb-6">
        <div className="h-2 w-full bg-emerald-100/80 rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-3 px-1 tabular-nums">
          <span className="text-[11px]">Initializing workspace...</span>
          <span className="text-[11px] text-emerald-700 font-bold">{progress}%</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setScreen('onboarding');
          }}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold transition-colors"
        >
          <span>Continue to Onboarding</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
