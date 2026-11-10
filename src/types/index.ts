export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'categories'
  | 'game-library'
  | 'game-play'
  | 'game-results'
  | 'daily-challenge'
  | 'brain-score'
  | 'analytics'
  | 'leaderboard'
  | 'achievements'
  | 'daily-missions'
  | 'training-plan'
  | 'multiplayer'
  | 'settings'
  | 'premium'
  | 'profile';

export type GameCategory =
  | 'memory'
  | 'logic'
  | 'math'
  | 'focus'
  | 'visual'
  | 'language';

export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface GameInfo {
  id: string;
  title: string;
  subtitle: string;
  category: GameCategory;
  categoryName: string;
  difficulty: GameDifficulty;
  durationSeconds: number;
  iconName: string;
  gradient: string;
  accentColor: string;
  description: string;
  benefits: string[];
  isPlayable: boolean;
  highScore: number;
  timesPlayed: number;
  level: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  brainScore: number;
  brainScoreChange: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  coins: number;
  badgesCount: number;
  isPremium: boolean;
  joinedDate: string;
  emailVerified?: boolean;
  authProvider?: 'google' | 'email';
}

export interface CategoryScore {
  category: GameCategory;
  name: string;
  score: number;
  percentage: number;
  color: string;
  gradient: string;
  icon: string;
  gamesCount: number;
}

export interface DailyChallengeTask {
  id: string;
  gameId: string;
  gameTitle: string;
  target: string;
  current: number;
  total: number;
  completed: boolean;
  rewardXp: number;
  rewardCoins: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rewardCoins: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  isCurrentUser?: boolean;
  change?: 'up' | 'down' | 'same';
}

export interface GameResult {
  gameId: string;
  gameTitle: string;
  score: number;
  accuracy: number;
  durationSeconds: number;
  moves?: number;
  correctCount?: number;
  totalCount?: number;
  xpEarned: number;
  coinsEarned: number;
  isNewHighScore: boolean;
  timestamp: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticFeedback: boolean;
  notifications: boolean;
  theme: 'dark' | 'midnight' | 'neon';
  language: string;
  offlineMode: boolean;
  difficultyPreference: 'Adaptive' | 'Casual' | 'Hardcore';
}

export interface FriendItem {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-game';
  brainScore: number;
  lastActive: string;
}

