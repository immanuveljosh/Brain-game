import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Check, X } from 'lucide-react';
import { sound } from '../../utils/sound';
import { GameResult } from '../../types';

interface ColorConfusionGameProps {
  onFinish: (result: GameResult) => void;
  onExit: () => void;
}

interface ColorDef {
  name: string;
  hex: string;
  textColorClass: string;
}

const COLOR_PALETTE: ColorDef[] = [
  { name: 'GREEN', hex: '#059669', textColorClass: 'text-emerald-600' },
  { name: 'BLUE', hex: '#2563EB', textColorClass: 'text-blue-600' },
  { name: 'RED', hex: '#DC2626', textColorClass: 'text-red-600' },
  { name: 'AMBER', hex: '#D97706', textColorClass: 'text-amber-600' },
  { name: 'PURPLE', hex: '#7C3AED', textColorClass: 'text-purple-600' },
];

export const ColorConfusionGame: React.FC<ColorConfusionGameProps> = ({
  onFinish,
  onExit,
}) => {
  const [word, setWord] = useState<string>('');
  const [inkColor, setInkColor] = useState<ColorDef>(COLOR_PALETTE[0]);
  const [options, setOptions] = useState<ColorDef[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const nextChallenge = () => {
    const wordIdx = Math.floor(Math.random() * COLOR_PALETTE.length);
    let inkIdx = Math.floor(Math.random() * COLOR_PALETTE.length);
    if (Math.random() > 0.25 && inkIdx === wordIdx) {
      inkIdx = (inkIdx + 1) % COLOR_PALETTE.length;
    }

    const chosenWord = COLOR_PALETTE[wordIdx].name;
    const chosenInk = COLOR_PALETTE[inkIdx];

    setWord(chosenWord);
    setInkColor(chosenInk);

    const otherColors = COLOR_PALETTE.filter((c) => c.name !== chosenInk.name);
    const shuffledOthers = [...otherColors].sort(() => Math.random() - 0.5).slice(0, 3);
    const allFour = [chosenInk, ...shuffledOthers].sort(() => Math.random() - 0.5);

    setOptions(allFour);
    setSelectedName(null);
  };

  useEffect(() => {
    nextChallenge();
  }, []);

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
  }, [isGameOver, correctCount, totalAttempts, score]);

  const handleOptionClick = (pickedColor: ColorDef) => {
    if (selectedName !== null || isGameOver) return;

    setSelectedName(pickedColor.name);
    setTotalAttempts((a) => a + 1);

    const isCorrect = pickedColor.name === inkColor.name;

    if (isCorrect) {
      sound.correct();
      const streakBonus = streak * 15;
      setScore((s) => s + 50 + streakBonus);
      setCorrectCount((c) => c + 1);
      setStreak((st) => st + 1);
    } else {
      sound.wrong();
      setStreak(0);
    }

    setTimeout(() => {
      nextChallenge();
    }, 450);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    sound.victory();
    const duration = 30;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

    onFinish({
      gameId: 'color-confusion',
      gameTitle: 'Color Confusion',
      score,
      accuracy,
      durationSeconds: duration,
      correctCount,
      totalCount: totalAttempts,
      xpEarned: 85,
      coinsEarned: 30,
      isNewHighScore: score > 450,
      timestamp: new Date().toISOString(),
    });
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;

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
          <h2 className="text-sm font-bold text-slate-900">Color Confusion</h2>
          <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">
            Stroop Inhibition {streak > 1 ? `• Streak ×${streak}` : ''}
          </span>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs tabular-nums ${
            timeLeft <= 8
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>00:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Main Stroop Card */}
      <div className="flex-1 flex flex-col items-center justify-center my-5">
        <div className="w-full p-8 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/50 border border-emerald-200/80 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.07)] text-center relative overflow-hidden">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">
            Select the INK COLOR, not the word
          </span>

          {/* Big Colored Word */}
          <div
            className="text-5xl font-black tracking-widest my-6 transition-all duration-150 select-none"
            style={{ color: inkColor.hex }}
          >
            {word}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Which font color is displayed above?
          </div>
        </div>

        {/* 4 Color Options Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mt-5">
          {options.map((opt) => {
            const isSelected = selectedName === opt.name;
            const isCorrect = opt.name === inkColor.name;
            const showFeedback = selectedName !== null;

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
                key={opt.name}
                type="button"
                onClick={() => handleOptionClick(opt)}
                disabled={selectedName !== null}
                className={`py-4 px-3 rounded-2xl border font-extrabold text-sm tracking-wider transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 ${btnStyle}`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: opt.hex }}
                />
                <span>{opt.name}</span>
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
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Correct</span>
          <div className="text-base font-extrabold text-teal-700 mt-0.5">
            {correctCount}/{totalAttempts}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</span>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">{accuracy}%</div>
        </div>
      </div>
    </div>
  );
};
