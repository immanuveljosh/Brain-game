import React, { useState, useRef } from 'react';
import { ArrowLeft, Zap, Award, ThumbsUp, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/sound';
import { GameResult } from '../../types';

interface ReactionTestGameProps {
  onFinish: (result: GameResult) => void;
  onExit: () => void;
}

type Stage = 'idle' | 'waiting' | 'ready' | 'too-early' | 'round-result';

export const ReactionTestGame: React.FC<ReactionTestGameProps> = ({
  onFinish,
  onExit,
}) => {
  const [stage, setStage] = useState<Stage>('idle');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const totalRounds = 3;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRound = () => {
    setStage('waiting');
    sound.click();

    const delay = Math.floor(Math.random() * 2500) + 1500;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setStage('ready');
      sound.playTone(880, 0.1);
    }, delay);
  };

  const handleBoxClick = () => {
    if (stage === 'idle') {
      startRound();
    } else if (stage === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      sound.wrong();
      setStage('too-early');
    } else if (stage === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      sound.correct();
      const updatedTimes = [...reactionTimes, elapsed];
      setReactionTimes(updatedTimes);

      if (currentRound < totalRounds) {
        setStage('round-result');
      } else {
        finishTest(updatedTimes);
      }
    } else if (stage === 'too-early') {
      startRound();
    } else if (stage === 'round-result') {
      setCurrentRound((r) => r + 1);
      startRound();
    }
  };

  const finishTest = (times: number[]) => {
    const best = Math.min(...times);
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const calculatedScore = Math.max(100, Math.round(1000 - avg * 1.5));
    const accuracy = best < 250 ? 98 : best < 320 ? 90 : 80;

    onFinish({
      gameId: 'reaction-test',
      gameTitle: 'Reaction Test',
      score: calculatedScore,
      accuracy,
      durationSeconds: 15,
      correctCount: times.length,
      totalCount: times.length,
      xpEarned: 75,
      coinsEarned: 30,
      isNewHighScore: best < 230,
      timestamp: new Date().toISOString(),
    });
  };

  const bestSoFar = reactionTimes.length > 0 ? Math.min(...reactionTimes) : null;
  const lastTime = reactionTimes[reactionTimes.length - 1];

  return (
    <div className="flex flex-col h-full select-none p-4 max-w-md mx-auto w-full">
      {/* Top HUD */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-950/[0.08]">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit game"
          className="p-2 rounded-xl bg-white border border-emerald-950/[0.08] text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/40 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">Reaction Test</h2>
          <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">
            Round {currentRound} of {totalRounds}
          </span>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-bold text-xs flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Reflex</span>
        </div>
      </div>

      {/* Main Interactive Touch Area */}
      <div className="flex-1 flex flex-col items-center justify-center my-5">
        <div
          onClick={handleBoxClick}
          className={`w-full aspect-[4/5] max-h-[440px] rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center p-6 text-center transition-all duration-150 select-none ${
            stage === 'idle'
              ? 'bg-gradient-to-br from-white via-white to-emerald-50/45 border-emerald-200/90 hover:border-emerald-400 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.08)]'
              : stage === 'waiting'
              ? 'bg-amber-500 border-amber-600 text-white shadow-md'
              : stage === 'ready'
              ? 'bg-emerald-600 border-emerald-700 text-white scale-[1.01] shadow-lg'
              : stage === 'too-early'
              ? 'bg-rose-50 border-rose-300 text-slate-900'
              : 'bg-gradient-to-br from-white via-white to-emerald-50/45 border-emerald-200/90 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.08)]'
          }`}
        >
          {stage === 'idle' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-4 text-emerald-600 shadow-2xs">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tap to Begin</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-[230px] leading-relaxed font-medium">
                Wait for the surface to turn <span className="text-emerald-600 font-bold">EMERALD GREEN</span>, then tap immediately.
              </p>
            </div>
          )}

          {stage === 'waiting' && (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-4 text-white">
                <span className="text-xl font-extrabold tracking-widest">•••</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Wait for Green</h3>
              <p className="text-xs text-amber-50 mt-1.5 font-medium">Hold steady — do not tap yet</p>
            </div>
          )}

          {stage === 'ready' && (
            <div className="flex flex-col items-center text-white">
              <Zap className="w-14 h-14 mb-2 fill-white" />
              <h3 className="text-4xl font-black tracking-tight">TAP NOW!</h3>
            </div>
          )}

          {stage === 'too-early' && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-extrabold text-rose-600">Too Early</h3>
              <p className="text-xs text-slate-600 mt-1 mb-4 font-medium">
                You tapped before the visual signal appeared.
              </p>
              <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm">
                Tap to Retry Round
              </span>
            </div>
          )}

          {stage === 'round-result' && (
            <div className="flex flex-col items-center tabular-nums">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 mb-3">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Psychomotor Latency
              </span>
              <div className="text-4xl font-extrabold text-slate-900 mt-1 mb-1">
                {lastTime} <span className="text-xl text-emerald-600">ms</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-5">
                {lastTime < 220 ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Extraordinary Reflex!</span>
                  </>
                ) : lastTime < 300 ? (
                  <>
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>High-Speed Response</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-3.5 h-3.5 text-teal-700" />
                    <span>Solid Baseline</span>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBoxClick();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <span>Next Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Best Score & Past Rounds */}
      <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] text-center tabular-nums">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Round</span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {currentRound} / {totalRounds}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last</span>
          <div className="text-base font-extrabold text-teal-700 mt-0.5">
            {lastTime ? `${lastTime}ms` : '--'}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Best</span>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">
            {bestSoFar ? `${bestSoFar}ms` : '--'}
          </div>
        </div>
      </div>
    </div>
  );
};
