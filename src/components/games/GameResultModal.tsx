import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, RotateCcw, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface GameResultModalProps {
  onReplay: () => void;
  onNextChallenge: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  onReplay,
  onNextChallenge,
}) => {
  const { lastGameResult, setScreen } = useAppStore();

  useEffect(() => {
    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#10B981', '#059669', '#0D9488', '#F59E0B', '#34D399'],
    });
  }, []);

  if (!lastGameResult) {
    return (
      <div className="p-6 text-center text-slate-600 max-w-md mx-auto">
        <p className="text-xs font-medium">No recent session completed.</p>
        <button
          type="button"
          onClick={() => setScreen('game-library')}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white text-xs font-semibold shadow-sm"
        >
          Return to Game Library
        </button>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto w-full flex flex-col items-center text-center">
      {/* Celebratory 3D Trophy Artwork */}
      <div className="relative my-3">
        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white border-2 border-amber-200/90 shadow-[0_10px_28px_rgba(16,185,129,0.16)]">
          <img
            src="/images/daily-trophy.jpg"
            alt="Session Complete Trophy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
        Session Complete
      </h2>
      <p className="text-xs text-slate-500 font-medium mt-1">
        Finished <span className="text-emerald-700 font-bold">{lastGameResult.gameTitle}</span>
      </p>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 w-full my-5 tabular-nums">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Score
          </span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1">
            {lastGameResult.score}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Accuracy
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1">
            {lastGameResult.accuracy}%
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/25 border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Duration
          </span>
          <span className="text-2xl font-extrabold text-teal-700 mt-1">
            {formatTime(lastGameResult.durationSeconds)}
          </span>
        </div>
      </div>

      {/* Rewards Earned Card */}
      <div className="w-full p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 border border-emerald-200/80 shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] flex items-center justify-around mb-5 tabular-nums">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700 border border-emerald-200">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 font-medium">XP Earned</div>
            <div className="text-sm font-bold text-emerald-800">+{lastGameResult.xpEarned} XP</div>
          </div>
        </div>

        <div className="h-8 w-px bg-emerald-200/80" />

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 font-medium">Coins Earned</div>
            <div className="text-sm font-bold text-amber-600">+{lastGameResult.coinsEarned}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-2.5">
        <button
          type="button"
          onClick={onNextChallenge}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-[0_6px_18px_rgba(5,150,105,0.25)] flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <span>Next Exercise</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onReplay}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-emerald-50/40 border border-emerald-950/[0.08] text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-2xs"
        >
          <RotateCcw className="w-4 h-4 text-emerald-600" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
};
