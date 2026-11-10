import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  Sparkles,
  Moon,
  Sun,
  Flame,
  Zap,
  Gem,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { sound } from '../../utils/sound';
import { GameResult } from '../../types';

interface MemoryTilesGameProps {
  onFinish: (result: GameResult) => void;
  onExit: () => void;
}

interface Tile {
  id: number;
  symbolIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = [
  { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  { icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Moon, color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
  { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Gem, color: 'text-teal-600', bg: 'bg-teal-50' },
];

export const MemoryTilesGame: React.FC<MemoryTilesGameProps> = ({
  onFinish,
  onExit,
}) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const totalPairs = 8;

  const initGame = () => {
    const indices = [];
    for (let i = 0; i < totalPairs; i++) {
      indices.push(i, i);
    }
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const newTiles: Tile[] = indices.map((symbolIndex, id) => ({
      id,
      symbolIndex,
      isFlipped: false,
      isMatched: false,
    }));

    setTiles(newTiles);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setTimeLeft(45);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, moves, matchedPairs]);

  const handleTileClick = (index: number) => {
    if (isGameOver) return;
    if (flippedIndices.length === 2) return;
    if (tiles[index].isFlipped || tiles[index].isMatched) return;

    sound.flip();

    const newFlipped = [...flippedIndices, index];
    const updatedTiles = tiles.map((t, idx) =>
      idx === index ? { ...t, isFlipped: true } : t
    );
    setTiles(updatedTiles);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstTile = updatedTiles[firstIdx];
      const secondTile = updatedTiles[secondIdx];

      if (firstTile.symbolIndex === secondTile.symbolIndex) {
        setTimeout(() => {
          sound.correct();
          const matchedTiles = updatedTiles.map((t, idx) =>
            idx === firstIdx || idx === secondIdx ? { ...t, isMatched: true } : t
          );
          setTiles(matchedTiles);
          setFlippedIndices([]);
          const newMatchedCount = matchedPairs + 1;
          setMatchedPairs(newMatchedCount);

          if (newMatchedCount === totalPairs) {
            handleVictory(newMatchedCount, moves + 1);
          }
        }, 400);
      } else {
        setTimeout(() => {
          const resetTiles = updatedTiles.map((t, idx) =>
            idx === firstIdx || idx === secondIdx ? { ...t, isFlipped: false } : t
          );
          setTiles(resetTiles);
          setFlippedIndices([]);
        }, 850);
      }
    }
  };

  const handleVictory = (completedPairs: number, finalMoves: number) => {
    setIsGameOver(true);
    const duration = 45 - timeLeft;
    const accuracy = Math.round((totalPairs / Math.max(finalMoves, totalPairs)) * 100);
    const timeBonus = Math.max(0, timeLeft * 10);
    const score = Math.round(completedPairs * 50 + timeBonus);

    onFinish({
      gameId: 'memory-tiles',
      gameTitle: 'Memory Tiles',
      score,
      accuracy,
      durationSeconds: duration,
      moves: finalMoves,
      correctCount: completedPairs,
      totalCount: totalPairs,
      xpEarned: 80,
      coinsEarned: 25,
      isNewHighScore: score > 500,
      timestamp: new Date().toISOString(),
    });
  };

  const handleTimeUp = () => {
    setIsGameOver(true);
    sound.wrong();
    const duration = 45;
    const accuracy = moves > 0 ? Math.round((matchedPairs / moves) * 100) : 0;
    const score = matchedPairs * 40;

    onFinish({
      gameId: 'memory-tiles',
      gameTitle: 'Memory Tiles',
      score,
      accuracy,
      durationSeconds: duration,
      moves,
      correctCount: matchedPairs,
      totalCount: totalPairs,
      xpEarned: 35,
      coinsEarned: 10,
      isNewHighScore: false,
      timestamp: new Date().toISOString(),
    });
  };

  const currentAccuracy = moves > 0 ? Math.round((matchedPairs / moves) * 100) : 100;
  const currentScore = matchedPairs * 60;

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
          <h2 className="text-sm font-bold text-slate-900">Memory Tiles</h2>
          <span className="text-[11px] text-emerald-700 font-semibold">Level 2 • 4×4 Matrix</span>
        </div>

        {/* Timer */}
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

      {/* Grid of tiles (4x4) */}
      <div className="flex-1 flex items-center justify-center my-5">
        <div className="grid grid-cols-4 gap-2.5 w-full max-w-[340px] aspect-square">
          {tiles.map((tile, idx) => {
            const isRevealed = tile.isFlipped || tile.isMatched;
            const SymbolData = ICONS[tile.symbolIndex];
            const Icon = SymbolData.icon;

            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleTileClick(idx)}
                disabled={tile.isMatched}
                aria-label={`Memory tile ${idx + 1}`}
                className={`relative rounded-2xl transition-all duration-200 aspect-square flex items-center justify-center active:scale-95 ${
                  tile.isMatched
                    ? 'bg-emerald-50/80 border-2 border-emerald-300 opacity-80'
                    : isRevealed
                    ? 'bg-white border-2 border-emerald-600 shadow-md scale-[1.02]'
                    : 'bg-gradient-to-b from-white to-emerald-50/20 hover:to-emerald-50/50 border border-emerald-950/[0.1] hover:border-emerald-300 shadow-[0_4px_12px_-2px_rgba(6,78,59,0.06)]'
                }`}
              >
                {isRevealed ? (
                  <div className={`p-2 rounded-xl ${SymbolData.bg}`}>
                    <Icon className={`w-6 h-6 ${SymbolData.color}`} />
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-emerald-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Bottom Stats */}
      <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white border border-emerald-950/[0.08] shadow-[0_4px_16px_-4px_rgba(6,78,59,0.05)] text-center tabular-nums">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">{currentScore}</div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Moves</span>
          <div className="text-base font-extrabold text-teal-700 mt-0.5">{moves}</div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</span>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">{currentAccuracy}%</div>
        </div>
      </div>
    </div>
  );
};
