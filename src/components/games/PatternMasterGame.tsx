import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Check, X } from 'lucide-react';
import { sound } from '../../utils/sound';
import { GameResult } from '../../types';

interface PatternMasterGameProps {
  onFinish: (result: GameResult) => void;
  onExit: () => void;
}

interface PatternPuzzle {
  sequence: string[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

const PUZZLE_BANK: PatternPuzzle[] = [
  {
    sequence: ['▲', '■', '●', '▲', '■', '?'],
    options: ['●', '▲', '◆', '★'],
    correctIndex: 0,
    explanation: 'Alternating sequence: Triangle, Square, Circle repeats.',
  },
  {
    sequence: ['2', '4', '8', '16', '32', '?'],
    options: ['48', '64', '56', '72'],
    correctIndex: 1,
    explanation: 'Multiply by 2 at each step: 32 × 2 = 64.',
  },
  {
    sequence: ['★', '★★', '★★★', '★★★★', '?'],
    options: ['★★★★★', '★★★', '★★★★★★', '★'],
    correctIndex: 0,
    explanation: 'Increments by 1 star on each step.',
  },
  {
    sequence: ['1', '1', '2', '3', '5', '8', '?'],
    options: ['11', '12', '13', '15'],
    correctIndex: 2,
    explanation: 'Fibonacci sequence: 5 + 8 = 13.',
  },
  {
    sequence: ['◆', '◇', '◆', '◇', '◆', '?'],
    options: ['◇', '◆', '●', '■'],
    correctIndex: 0,
    explanation: 'Alternating filled and hollow diamond.',
  },
  {
    sequence: ['3', '6', '12', '24', '48', '?'],
    options: ['72', '84', '96', '108'],
    correctIndex: 2,
    explanation: 'Geometric progression: double previous value (48 × 2 = 96).',
  },
  {
    sequence: ['◐', '◓', '◑', '◒', '?'],
    options: ['◐', '◑', '◓', '●'],
    correctIndex: 0,
    explanation: 'Clockwise 90-degree shaded rotation completes a 360 loop.',
  },
  {
    sequence: ['100', '95', '85', '70', '50', '?'],
    options: ['25', '30', '35', '20'],
    correctIndex: 0,
    explanation: 'Subtract increments: -5, -10, -15, -20, then -25 (50 - 25 = 25).',
  },
];

export const PatternMasterGame: React.FC<PatternMasterGameProps> = ({
  onFinish,
  onExit,
}) => {
  const [round, setRound] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const totalRounds = 6;
  const currentPuzzle = PUZZLE_BANK[round % PUZZLE_BANK.length];

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, score, correctCount, round]);

  const handleSelectOption = (index: number) => {
    if (selectedIdx !== null || isGameOver) return;

    setSelectedIdx(index);
    const isCorrect = index === currentPuzzle.correctIndex;

    if (isCorrect) {
      sound.correct();
      setScore((s) => s + 80);
      setCorrectCount((c) => c + 1);
    } else {
      sound.wrong();
    }

    setTimeout(() => {
      if (round + 1 < totalRounds) {
        setRound((r) => r + 1);
        setSelectedIdx(null);
      } else {
        handleGameOver();
      }
    }, 550);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    sound.victory();
    const duration = 45 - timeLeft;
    const accuracy = Math.round((correctCount / totalRounds) * 100);

    onFinish({
      gameId: 'pattern-master',
      gameTitle: 'Pattern Master',
      score,
      accuracy,
      durationSeconds: duration,
      correctCount,
      totalCount: totalRounds,
      xpEarned: 85,
      coinsEarned: 35,
      isNewHighScore: score >= 400,
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
          <h2 className="text-sm font-bold text-slate-900">Pattern Master</h2>
          <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">
            Sequence {round + 1} of {totalRounds}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs tabular-nums ${
            timeLeft <= 10
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>00:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Main Pattern Display */}
      <div className="flex-1 flex flex-col items-center justify-center my-5">
        <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/50 border border-emerald-200/80 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.07)] text-center">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Inductive Sequence Reasoning
          </span>

          {/* Sequence Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 my-6 tabular-nums">
            {currentPuzzle.sequence.map((item, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg transition-all ${
                  item === '?'
                    ? 'bg-emerald-50 border-2 border-dashed border-emerald-500 text-emerald-700'
                    : 'bg-white border border-emerald-950/[0.1] text-slate-900 shadow-2xs'
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Select the element that completes the progression
          </p>
        </div>

        {/* 4 Answer Options */}
        <div className="grid grid-cols-2 gap-3 w-full mt-5 tabular-nums">
          {currentPuzzle.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === currentPuzzle.correctIndex;
            const showFeedback = selectedIdx !== null;

            let btnStyle =
              'bg-white border-emerald-950/[0.1] text-slate-900 hover:border-emerald-400 hover:bg-emerald-50/30 shadow-[0_4px_12px_-2px_rgba(6,78,59,0.05)]';

            if (showFeedback) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected) {
                btnStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={selectedIdx !== null}
                className={`py-4 px-3 rounded-2xl border text-xl font-bold transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 ${btnStyle}`}
              >
                <span>{opt}</span>
                {showFeedback && isCorrect && isSelected && <Check className="w-4 h-4 text-white" />}
                {showFeedback && !isCorrect && isSelected && <X className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Bottom Stats */}
      <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] text-center tabular-nums">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">{score}</div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Solved</span>
          <div className="text-base font-extrabold text-teal-700 mt-0.5">
            {correctCount}/{totalRounds}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</span>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">
            {round > 0 ? Math.round((correctCount / (round + 1)) * 100) : 100}%
          </div>
        </div>
      </div>
    </div>
  );
};
