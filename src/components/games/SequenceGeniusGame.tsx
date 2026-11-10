import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Eye, Zap } from 'lucide-react';
import { sound } from '../../utils/sound';
import { GameResult } from '../../types';

interface SequenceGeniusGameProps {
  onFinish: (result: GameResult) => void;
  onExit: () => void;
}

const PAD_CONFIG = [
  { id: 0, label: '1', activeClass: 'bg-emerald-500 border-emerald-500 text-white shadow-lg', freq: 440 },
  { id: 1, label: '2', activeClass: 'bg-blue-600 border-blue-600 text-white shadow-lg', freq: 554.37 },
  { id: 2, label: '3', activeClass: 'bg-orange-500 border-orange-500 text-white shadow-lg', freq: 659.25 },
  { id: 3, label: '4', activeClass: 'bg-violet-600 border-violet-600 text-white shadow-lg', freq: 880 },
];

export const SequenceGeniusGame: React.FC<SequenceGeniusGameProps> = ({
  onFinish,
  onExit,
}) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(true);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [, setMistakes] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const maxLevel = 7;

  const startNewLevel = (_lvl: number, existingSeq: number[] = []) => {
    setIsPlayingSeq(true);
    setPlayerInput([]);

    const nextPad = Math.floor(Math.random() * 4);
    const newSeq = [...existingSeq, nextPad];
    setSequence(newSeq);

    let i = 0;
    const playInterval = setInterval(() => {
      if (i < newSeq.length) {
        const padIdx = newSeq[i];
        flashPad(padIdx);
        i++;
      } else {
        clearInterval(playInterval);
        setIsPlayingSeq(false);
      }
    }, 650);
  };

  const flashPad = (padIdx: number) => {
    setActivePad(padIdx);
    sound.playTone(PAD_CONFIG[padIdx].freq, 0.25);
    setTimeout(() => {
      setActivePad(null);
    }, 350);
  };

  useEffect(() => {
    startNewLevel(1, []);
  }, []);

  const handlePadClick = (padIdx: number) => {
    if (isPlayingSeq || isGameOver) return;

    flashPad(padIdx);

    const nextInput = [...playerInput, padIdx];
    setPlayerInput(nextInput);

    const stepIndex = nextInput.length - 1;

    if (padIdx !== sequence[stepIndex]) {
      sound.wrong();
      setMistakes((m) => m + 1);
      setTimeout(() => {
        handleGameOver(score, level);
      }, 500);
      return;
    }

    setScore((s) => s + 30);

    if (nextInput.length === sequence.length) {
      sound.correct();
      const newScore = score + level * 50;
      setScore(newScore);

      if (level < maxLevel) {
        setLevel((l) => l + 1);
        setTimeout(() => {
          startNewLevel(level + 1, sequence);
        }, 800);
      } else {
        setTimeout(() => {
          handleGameOver(newScore + 200, maxLevel);
        }, 500);
      }
    }
  };

  const handleGameOver = (finalScore: number, finalLevel: number) => {
    setIsGameOver(true);
    sound.victory();
    const accuracy = Math.round((finalLevel / maxLevel) * 100);

    onFinish({
      gameId: 'sequence-genius',
      gameTitle: 'Sequence Genius',
      score: finalScore,
      accuracy,
      durationSeconds: finalLevel * 7,
      correctCount: finalLevel,
      totalCount: maxLevel,
      xpEarned: 80,
      coinsEarned: 30,
      isNewHighScore: finalScore > 400,
      timestamp: new Date().toISOString(),
    });
  };

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
          <h2 className="text-sm font-bold text-slate-900">Sequence Genius</h2>
          <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">
            Chain Length: {sequence.length} • Level {level}
          </span>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-bold text-xs flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Span</span>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="flex-1 flex flex-col items-center justify-center my-5">
        {/* State Banner */}
        <div className="mb-6 px-4 py-1.5 rounded-full bg-white border border-emerald-200/80 shadow-2xs text-xs font-semibold flex items-center gap-2">
          {isPlayingSeq ? (
            <>
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-slate-700">Observe the Sequence...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Your Turn — Repeat the Pattern</span>
            </>
          )}
        </div>

        {/* 2x2 Interactive Pads */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[310px] aspect-square tabular-nums">
          {PAD_CONFIG.map((pad) => {
            const isLit = activePad === pad.id;
            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => handlePadClick(pad.id)}
                disabled={isPlayingSeq || isGameOver}
                className={`relative rounded-2xl border-2 font-black text-3xl transition-all duration-150 aspect-square flex items-center justify-center active:scale-95 ${
                  isLit
                    ? `${pad.activeClass} scale-[1.03]`
                    : 'bg-gradient-to-b from-white to-emerald-50/25 border-emerald-950/[0.1] text-slate-800 hover:border-emerald-400 shadow-[0_4px_14px_-2px_rgba(6,78,59,0.06)]'
                }`}
              >
                <span>{pad.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input progression dots */}
        <div className="flex items-center gap-2 mt-6">
          {sequence.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                idx < playerInput.length
                  ? 'bg-emerald-600'
                  : 'bg-emerald-200/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Live Stats */}
      <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] text-center tabular-nums">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">{score}</div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level</span>
          <div className="text-base font-extrabold text-teal-700 mt-0.5">
            {level} / {maxLevel}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phase</span>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">
            {isPlayingSeq ? 'Watch' : 'Input'}
          </div>
        </div>
      </div>
    </div>
  );
};
