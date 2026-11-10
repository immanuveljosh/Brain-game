import React, { useState } from 'react';
import {
  Settings as GearIcon,
  Lightbulb,
  Target,
  MessageSquare,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const OnboardingScreen: React.FC = () => {
  const { setScreen } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides = [
    {
      title: 'Sharpen Your Mind',
      description:
        'Clinically inspired cognitive exercises engineered to enhance working memory, focus, logic, and numerical agility.',
      highlight: 'Cognitive Boost',
      image: '/images/hero-brain.jpg',
    },
    {
      title: 'Track Your Progress',
      description:
        'Longitudinal telemetry and real-time percentile diagnostics to quantify your daily neural evolution.',
      highlight: 'Brain Spark Index',
      image: '/images/logic-art.jpg',
    },
    {
      title: 'Compete & Excel',
      description:
        'Challenge peers in 1v1 Live Arena duels, climb global leaderboards, and build lasting cognitive habits.',
      highlight: 'Daily Streaks',
      image: '/images/daily-trophy.jpg',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      setScreen('auth');
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[82vh] max-w-md mx-auto w-full p-6 text-center select-none relative overflow-hidden">
      {/* Top Bar with Skip */}
      <div className="flex justify-between items-center pt-2 z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 shadow-2xs">
          {slides[currentSlide].highlight}
        </span>
        <button
          type="button"
          onClick={() => setScreen('home')}
          className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors px-3 py-1 rounded-lg bg-white border border-emerald-950/[0.08] shadow-2xs"
        >
          Skip
        </button>
      </div>

      {/* Hero Visual: 3D Studio Artwork with Floating Cognitive Nodes */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="pointer-events-none absolute w-72 h-72 rounded-full bg-emerald-400/15 blur-2xl" />
        <div className="w-60 h-60 rounded-full bg-white border-2 border-emerald-200/90 shadow-[0_14px_40px_-6px_rgba(6,78,59,0.14)] flex items-center justify-center relative">
          <div className="w-52 h-52 rounded-full overflow-hidden border border-emerald-100">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {/* Node 1: Logic */}
          <div className="absolute top-2 left-5 p-2.5 rounded-xl bg-white border border-emerald-200/80 text-emerald-700 shadow-sm">
            <GearIcon className="w-4 h-4" />
          </div>

          {/* Node 2: Creativity */}
          <div className="absolute top-2 right-5 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 shadow-sm">
            <Lightbulb className="w-4 h-4" />
          </div>

          {/* Node 3: Focus */}
          <div className="absolute bottom-6 left-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 shadow-sm">
            <Target className="w-4 h-4" />
          </div>

          {/* Node 4: Language */}
          <div className="absolute bottom-7 right-4 p-2.5 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700 shadow-sm">
            <MessageSquare className="w-4 h-4" />
          </div>

          {/* Node 5: Vitality */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-white border border-emerald-300 text-emerald-600 shadow-sm">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Copy & Indicators */}
      <div className="z-10">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {slides[currentSlide].title}
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-2 max-w-xs mx-auto leading-relaxed">
          {slides[currentSlide].description}
        </p>

        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 my-6">
          {slides.map((s, idx) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-7 bg-gradient-to-r from-emerald-500 to-teal-600'
                  : 'w-2 bg-emerald-200'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="max-w-xs mx-auto">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-[0_6px_18px_rgba(5,150,105,0.25)] flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
