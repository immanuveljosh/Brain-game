import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Check, X } from 'lucide-react';
import { sound } from '../../utils/sound';
import { GameResult } from '../../types';

interface MathSprintGameProps {
  onFinish: (result: GameResult) => void;
  onExit: () => void;
}

interface Question {
  prompt: string;
  correctAnswer: number;
  options: number[];
}

export const MathSprintGame: React.FC<MathSprintGameProps> = ({
  onFinish,
  onExit,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalAttempted, setTotalAttempted] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const generateQuestion = (): Question => {
    const operators = ['+', '-', '×'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let a = 0;
    let b = 0;
    let ans = 0;

    if (op === '+') {
      a = Math.floor(Math.random() * 25) + 5;
      b = Math.floor(Math.random() * 25) + 3;
      ans = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 40) + 15;
      b = Math.floor(Math.random() * a) + 2;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 10) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      ans = a * b;
    }

    const prompt = `${a} ${op} ${b} = ?`;

    const optionsSet = new Set<number>();
    optionsSet.add(ans);

    while (optionsSet.size < 4) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
      const fake = Math.max(1, ans + offset);
      optionsSet.add(fake);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return { prompt, correctAnswer: ans, options };
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
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
  }, [isGameOver, correctCount, totalAttempted, score]);

  const handleOptionClick = (chosen: number) => {
    if (selectedAnswer !== null || isGameOver || !currentQuestion) return;

    setSelectedAnswer(chosen);
    setTotalAttempted((prev) => prev + 1);

    const isCorrect = chosen === currentQuestion.correctAnswer;

    if (isCorrect) {
      sound.correct();
      const streakBonus = streak * 15;
      const points = 50 + streakBonus;
      setScore((s) => s + points);
      setCorrectCount((c) => c + 1);
      setStreak((st) => st + 1);
    } else {
      sound.wrong();
      setStreak(0);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentQuestion(generateQuestion());
    }, 500);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    sound.victory();
    const duration = 30;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

    onFinish({
      gameId: 'math-sprint',
      gameTitle: 'Math Sprint',
      score,
      accuracy,
      durationSeconds: duration,
      correctCount,
      totalCount: totalAttempted,
      xpEarned: Math.round(score / 5) + 30,
      coinsEarned: Math.round(correctCount * 3) + 10,
      isNewHighScore: score > 500,
      timestamp: new Date().toISOString(),
    });
  };

  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 100;

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
          <h2 className="text-sm font-bold text-slate-900">Math Sprint</h2>
          <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">
            Level 3 • Medium {streak > 1 ? `• Streak ×${streak}` : ''}
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

      {/* Main Arithmetic Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center my-5">
        <div className="w-full p-8 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/50 border border-emerald-200/80 shadow-[0_8px_28px_-6px_rgba(6,78,59,0.07)] text-center relative overflow-hidden">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">
            Mental Arithmetic
          </span>

          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight my-4 tabular-nums">
            {currentQuestion?.prompt || '...'}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Select the correct solution
          </div>
        </div>

        {/* 2x2 Answer Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mt-5 tabular-nums">
          {currentQuestion?.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showFeedback = selectedAnswer !== null;

            let btnStyle =
              'bg-white border-emerald-950/[0.1] text-slate-900 hover:border-emerald-400 hover:bg-emerald-50/30 shadow-[0_4px_12px_-2px_rgba(6,78,59,0.05)]';

            if (showFeedback) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]';
              } else if (isSelected) {
                btnStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionClick(option)}
                disabled={selectedAnswer !== null}
                className={`py-5 px-4 rounded-2xl border text-2xl font-extrabold transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 ${btnStyle}`}
              >
                <span>{option}</span>
                {showFeedback && isCorrect && isSelected && <Check className="w-5 h-5 text-white" />}
                {showFeedback && !isCorrect && isSelected && <X className="w-5 h-5 text-white" />}
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
            {correctCount}/{totalAttempted}
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
