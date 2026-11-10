import React from 'react';
import { Header } from './components/common/Header';
import { DeviceFrame } from './components/common/DeviceFrame';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { GameLibraryScreen } from './screens/GameLibraryScreen';
import { GamePlayScreen } from './screens/GamePlayScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { BrainScoreDashboard } from './screens/BrainScoreDashboard';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { DailyMissionsScreen } from './screens/DailyMissionsScreen';
import { TrainingPlanScreen } from './screens/TrainingPlanScreen';
import { MultiplayerScreen } from './screens/MultiplayerScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { GameResultModal } from './components/games/GameResultModal';
import { useAppStore } from './store/useAppStore';

export function App() {
  const { currentScreen, setScreen, startPlayingGame, activeGameId } = useAppStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'auth':
        return <AuthScreen />;
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'game-library':
        return <GameLibraryScreen />;
      case 'game-play':
        return <GamePlayScreen />;
      case 'game-results':
        return (
          <GameResultModal
            onReplay={() => startPlayingGame(activeGameId || 'memory-tiles')}
            onNextChallenge={() => setScreen('game-library')}
          />
        );
      case 'daily-challenge':
        return <DailyChallengeScreen />;
      case 'brain-score':
        return <BrainScoreDashboard />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'daily-missions':
        return <DailyMissionsScreen />;
      case 'training-plan':
        return <TrainingPlanScreen />;
      case 'multiplayer':
        return <MultiplayerScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'premium':
        return <PremiumScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FBF8] text-slate-900 flex flex-col selection:bg-emerald-600 selection:text-white">
      <Header />
      <DeviceFrame>
        <div key={currentScreen} className="flex-1 flex flex-col">
          {renderScreen()}
        </div>
      </DeviceFrame>
    </div>
  );
}

export default App;
