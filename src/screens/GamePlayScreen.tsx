import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { MemoryTilesGame } from '../components/games/MemoryTilesGame';
import { MathSprintGame } from '../components/games/MathSprintGame';
import { ReactionTestGame } from '../components/games/ReactionTestGame';
import { PatternMasterGame } from '../components/games/PatternMasterGame';
import { SequenceGeniusGame } from '../components/games/SequenceGeniusGame';
import { ColorConfusionGame } from '../components/games/ColorConfusionGame';
import { GameResult } from '../types';

export const GamePlayScreen: React.FC = () => {
  const { activeGameId, finishGame, goBack } = useAppStore();

  const handleFinish = (result: GameResult) => {
    finishGame(result);
  };

  const handleExit = () => {
    goBack();
  };

  switch (activeGameId) {
    case 'memory-tiles':
      return <MemoryTilesGame onFinish={handleFinish} onExit={handleExit} />;
    case 'math-sprint':
      return <MathSprintGame onFinish={handleFinish} onExit={handleExit} />;
    case 'reaction-test':
      return <ReactionTestGame onFinish={handleFinish} onExit={handleExit} />;
    case 'pattern-master':
      return <PatternMasterGame onFinish={handleFinish} onExit={handleExit} />;
    case 'sequence-genius':
      return <SequenceGeniusGame onFinish={handleFinish} onExit={handleExit} />;
    case 'color-confusion':
      return <ColorConfusionGame onFinish={handleFinish} onExit={handleExit} />;
    default:
      return <MemoryTilesGame onFinish={handleFinish} onExit={handleExit} />;
  }
};

