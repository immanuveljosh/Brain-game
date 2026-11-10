import { create } from 'zustand';
import {
  ScreenId,
  GameCategory,
  UserProfile,
  CategoryScore,
  DailyChallengeTask,
  Achievement,
  LeaderboardUser,
  GameResult,
  AppSettings,
  FriendItem,
} from '../types';
import { CATEGORIES_DATA } from '../utils/gamesData';
import { sound } from '../utils/sound';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppState {
  // Navigation & View
  currentScreen: ScreenId;
  previousScreen: ScreenId;
  deviceMode: DeviceMode;
  selectedCategory: GameCategory | null;
  activeGameId: string | null;
  lastGameResult: GameResult | null;
  searchQuery: string;
  toast: ToastMessage | null;

  // User & Stats
  user: UserProfile;
  categories: CategoryScore[];
  dailyTasks: DailyChallengeTask[];
  achievements: Achievement[];
  leaderboardGlobal: LeaderboardUser[];
  leaderboardFriends: LeaderboardUser[];
  friends: FriendItem[];
  settings: AppSettings;
  history: GameResult[];

  // Actions
  setScreen: (screen: ScreenId) => void;
  goBack: () => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setSelectedCategory: (cat: GameCategory | null) => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;
  startPlayingGame: (gameId: string) => void;
  finishGame: (result: GameResult) => void;
  claimDailyReward: () => void;
  claimAchievement: (achievementId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  upgradeToPremium: () => void;
  resetDemoData: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_john_01',
  name: 'John',
  email: 'john@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  title: 'Mind Explorer',
  brainScore: 762,
  brainScoreChange: 12,
  level: 5,
  xp: 650,
  xpToNextLevel: 1000,
  streakDays: 12,
  coins: 1250,
  badgesCount: 8,
  isPremium: false,
  joinedDate: 'October 2026',
};

const DEFAULT_DAILY_TASKS: DailyChallengeTask[] = [
  {
    id: 'dt-1',
    gameId: 'memory-tiles',
    gameTitle: 'Memory Tiles',
    target: 'Score 400+ points',
    current: 1,
    total: 1,
    completed: true,
    rewardXp: 50,
    rewardCoins: 25,
    icon: 'Grid',
  },
  {
    id: 'dt-2',
    gameId: 'math-sprint',
    gameTitle: 'Math Sprint',
    target: 'Answer 10 equations',
    current: 1,
    total: 1,
    completed: true,
    rewardXp: 50,
    rewardCoins: 25,
    icon: 'Calculator',
  },
  {
    id: 'dt-3',
    gameId: 'pattern-master',
    gameTitle: 'Pattern Master',
    target: 'Complete 5 sequences',
    current: 0,
    total: 1,
    completed: false,
    rewardXp: 75,
    rewardCoins: 40,
    icon: 'Shapes',
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Mind Spark Starter',
    description: 'Complete your first brain training game',
    category: 'General',
    icon: 'Sparkles',
    unlocked: true,
    unlockedAt: 'Nov 1, 2026',
    progress: 1,
    maxProgress: 1,
    rewardCoins: 50,
    rarity: 'Common',
  },
  {
    id: 'ach-2',
    title: 'Streak Novice',
    description: 'Maintain a 7-day daily brain training streak',
    category: 'Streak',
    icon: 'Flame',
    unlocked: true,
    unlockedAt: 'Nov 3, 2026',
    progress: 12,
    maxProgress: 7,
    rewardCoins: 100,
    rarity: 'Rare',
  },
  {
    id: 'ach-3',
    title: 'Math Prodigy',
    description: 'Answer 50 math questions without error in Math Sprint',
    category: 'Math',
    icon: 'Calculator',
    unlocked: true,
    unlockedAt: 'Nov 5, 2026',
    progress: 50,
    maxProgress: 50,
    rewardCoins: 150,
    rarity: 'Epic',
  },
  {
    id: 'ach-4',
    title: 'Iron Memory',
    description: 'Complete Memory Tiles level 5 in under 30 seconds',
    category: 'Memory',
    icon: 'Brain',
    unlocked: false,
    progress: 14,
    maxProgress: 20,
    rewardCoins: 200,
    rarity: 'Epic',
  },
  {
    id: 'ach-5',
    title: 'Lightning Reflexes',
    description: 'Record reaction time under 200ms in Reaction Test',
    category: 'Focus',
    icon: 'Zap',
    unlocked: false,
    progress: 215,
    maxProgress: 200,
    rewardCoins: 250,
    rarity: 'Legendary',
  },
  {
    id: 'ach-6',
    title: 'Grandmaster 1000',
    description: 'Reach a total Brain Score of 1000',
    category: 'Mastery',
    icon: 'Trophy',
    unlocked: false,
    progress: 762,
    maxProgress: 1000,
    rewardCoins: 500,
    rarity: 'Legendary',
  },
];

const DEFAULT_GLOBAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'l-1',
    name: 'Sarah K.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    score: 1245,
    streak: 38,
    change: 'same',
  },
  {
    rank: 2,
    id: 'l-2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    score: 1180,
    streak: 29,
    change: 'up',
  },
  {
    rank: 3,
    id: 'l-3',
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    score: 1102,
    streak: 21,
    change: 'down',
  },
  {
    rank: 4,
    id: 'l-4',
    name: 'Daniel Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    score: 1045,
    streak: 19,
    change: 'same',
  },
  {
    rank: 5,
    id: 'usr_john_01',
    name: 'You (John)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    score: 762,
    streak: 12,
    isCurrentUser: true,
    change: 'up',
  },
  {
    rank: 6,
    id: 'l-6',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    score: 698,
    streak: 9,
    change: 'down',
  },
  {
    rank: 7,
    id: 'l-7',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    score: 642,
    streak: 7,
    change: 'same',
  },
  {
    rank: 8,
    id: 'l-8',
    name: 'Sophia Mueller',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    score: 598,
    streak: 6,
    change: 'same',
  },
];

const DEFAULT_FRIENDS_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'f-1',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    score: 1180,
    streak: 29,
  },
  {
    rank: 2,
    id: 'usr_john_01',
    name: 'You (John)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    score: 762,
    streak: 12,
    isCurrentUser: true,
  },
  {
    rank: 3,
    id: 'f-2',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    score: 642,
    streak: 7,
  },
  {
    rank: 4,
    id: 'f-3',
    name: 'Lucas Silva',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    score: 512,
    streak: 4,
  },
];

const DEFAULT_FRIENDS: FriendItem[] = [
  {
    id: 'f-1',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'online',
    brainScore: 1180,
    lastActive: 'Active now',
  },
  {
    id: 'f-2',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    status: 'in-game',
    brainScore: 642,
    lastActive: 'Playing Math Sprint',
  },
  {
    id: 'f-3',
    name: 'Lucas Silva',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    status: 'offline',
    brainScore: 512,
    lastActive: '2 hours ago',
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticFeedback: true,
  notifications: true,
  theme: 'dark',
  language: 'English',
  offlineMode: true,
  difficultyPreference: 'Adaptive',
};

const STORAGE_KEY = 'mindspark_state_v1';

const loadPersistedState = (): Partial<AppState> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }
  return {};
};

const saveState = (state: AppState) => {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      user: state.user,
      categories: state.categories,
      dailyTasks: state.dailyTasks,
      achievements: state.achievements,
      settings: state.settings,
      history: state.history.slice(-20),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
};

const initialPersisted = loadPersistedState();

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: initialPersisted.user?.emailVerified ? 'home' : 'auth',
  previousScreen: 'home',
  deviceMode: 'desktop',
  selectedCategory: null,
  activeGameId: 'memory-tiles',
  lastGameResult: null,
  searchQuery: '',
  toast: null,

  user: initialPersisted.user || DEFAULT_USER,
  categories: initialPersisted.categories || CATEGORIES_DATA,
  dailyTasks: initialPersisted.dailyTasks || DEFAULT_DAILY_TASKS,
  achievements: initialPersisted.achievements || DEFAULT_ACHIEVEMENTS,
  leaderboardGlobal: DEFAULT_GLOBAL_LEADERBOARD,
  leaderboardFriends: DEFAULT_FRIENDS_LEADERBOARD,
  friends: DEFAULT_FRIENDS,
  settings: initialPersisted.settings || DEFAULT_SETTINGS,
  history: initialPersisted.history || [],

  setScreen: (screen: ScreenId) => {
    sound.click();
    const curr = get().currentScreen;
    set({
      currentScreen: screen,
      previousScreen: curr,
    });
  },

  goBack: () => {
    sound.click();
    const { previousScreen, currentScreen } = get();
    if (currentScreen === 'game-play' || currentScreen === 'game-results') {
      set({ currentScreen: 'game-library', previousScreen: 'home' });
    } else if (previousScreen && previousScreen !== currentScreen) {
      set({ currentScreen: previousScreen, previousScreen: 'home' });
    } else {
      set({ currentScreen: 'home', previousScreen: 'home' });
    }
  },

  setDeviceMode: (mode: DeviceMode) => {
    sound.click();
    set({ deviceMode: mode });
  },

  setSelectedCategory: (cat: GameCategory | null) => {
    sound.click();
    set({ selectedCategory: cat });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  showToast: (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    set({ toast: { id, message, type } });
    setTimeout(() => {
      if (get().toast?.id === id) {
        set({ toast: null });
      }
    }, 3500);
  },

  hideToast: () => {
    set({ toast: null });
  },

  startPlayingGame: (gameId: string) => {
    sound.click();
    set({
      activeGameId: gameId,
      currentScreen: 'game-play',
    });
  },

  finishGame: (result: GameResult) => {
    sound.victory();
    const state = get();
    const newXp = state.user.xp + result.xpEarned;
    const levelUp = newXp >= state.user.xpToNextLevel;
    const updatedLevel = levelUp ? state.user.level + 1 : state.user.level;
    const updatedXp = levelUp ? newXp - state.user.xpToNextLevel : newXp;
    const scoreBonus = Math.floor(result.score / 50);
    const updatedBrainScore = Math.min(1000, state.user.brainScore + scoreBonus);

    // Update Daily tasks if applicable
    const updatedTasks = state.dailyTasks.map((t) => {
      if (t.gameId === result.gameId) {
        return { ...t, current: t.total, completed: true };
      }
      return t;
    });

    const updatedUser: UserProfile = {
      ...state.user,
      xp: updatedXp,
      level: updatedLevel,
      brainScore: updatedBrainScore,
      coins: state.user.coins + result.coinsEarned,
    };

    const newHistory = [result, ...state.history];

    const nextState = {
      ...state,
      user: updatedUser,
      dailyTasks: updatedTasks,
      history: newHistory,
      lastGameResult: result,
      currentScreen: 'game-results' as ScreenId,
    };

    set(nextState);
    saveState(nextState);
  },

  claimDailyReward: () => {
    sound.correct();
    const state = get();
    const bonusCoins = 100;
    const bonusXp = 150;
    const updatedUser: UserProfile = {
      ...state.user,
      coins: state.user.coins + bonusCoins,
      xp: state.user.xp + bonusXp,
    };
    const nextState = {
      ...state,
      user: updatedUser,
    };
    set(nextState);
    saveState(nextState);
    get().showToast(`Claimed +${bonusCoins} Coins & +${bonusXp} XP!`, 'success');
  },

  claimAchievement: (achievementId: string) => {
    sound.correct();
    const state = get();
    const ach = state.achievements.find((a) => a.id === achievementId);
    if (!ach || ach.unlocked) return;

    const updatedAchievements = state.achievements.map((a) =>
      a.id === achievementId ? { ...a, unlocked: true, unlockedAt: 'Just now' } : a
    );

    const updatedUser: UserProfile = {
      ...state.user,
      coins: state.user.coins + ach.rewardCoins,
      badgesCount: state.user.badgesCount + 1,
    };

    const nextState = {
      ...state,
      achievements: updatedAchievements,
      user: updatedUser,
    };
    set(nextState);
    saveState(nextState);
    get().showToast(`Achievement Unlocked: ${ach.title} (+${ach.rewardCoins} Coins)`, 'success');
  },

  updateSettings: (newSettings: Partial<AppSettings>) => {
    const current = get().settings;
    const updated = { ...current, ...newSettings };
    if (newSettings.soundEnabled !== undefined) {
      sound.setEnabled(newSettings.soundEnabled);
    }
    const nextState = {
      ...get(),
      settings: updated,
    };
    set({ settings: updated });
    saveState(nextState);
  },

  updateUserProfile: (data: Partial<UserProfile>) => {
    const updatedUser = { ...get().user, ...data };
    const nextState = { ...get(), user: updatedUser };
    set({ user: updatedUser });
    saveState(nextState);
    get().showToast('Profile settings updated successfully.', 'success');
  },

  upgradeToPremium: () => {
    sound.victory();
    const updatedUser = { ...get().user, isPremium: true };
    const nextState = { ...get(), user: updatedUser };
    set({ user: updatedUser });
    saveState(nextState);
    get().showToast('Welcome to MindSpark Pro! All cognitive features unlocked.', 'success');
  },

  resetDemoData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({
      user: DEFAULT_USER,
      categories: CATEGORIES_DATA,
      dailyTasks: DEFAULT_DAILY_TASKS,
      achievements: DEFAULT_ACHIEVEMENTS,
      settings: DEFAULT_SETTINGS,
      history: [],
      lastGameResult: null,
      currentScreen: 'home',
    });
    get().showToast('Demo data reset to default state.', 'info');
  },
}));

