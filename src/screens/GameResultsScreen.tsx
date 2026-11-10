import React from 'react';
import { GameResultModal } from '../components/games/GameResultModal';
import { useAppStore } from '../store/useAppStore';

export const GameResultsScreen: React.FC = () => {
  const { activeGameId, startPlayingGame, setScreen } = useAppStore();

  const handleReplay = () => {
    if (activeGameId) {
      startPlayingGame(activeGameId);
    } else {
      setScreen('game-library');
    }
  };

  const handleNextChallenge = () => {
    setScreen('daily-challenge');
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <GameResultModal
        onReplay={handleReplay}
        onNextChallenge={handleNextChallenge}
      />
    </div>
  );
};

