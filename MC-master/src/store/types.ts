import type { Module, Level, UserScore } from '../types';

// Game State Interface
export interface GameState {
  modules: Module[];
  completedLevels: Set<string>;
  userScores: Record<string, UserScore>;
  currentModule?: Module;
  currentLevel?: Level;
  isLoading: boolean;
  error?: string;
}

// Audio State Interface
export interface AudioState {
  isEnabled: boolean;
  volume: number;
  isMuted: boolean;
  currentTrack?: string;
}

// UI State Interface
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  modals: {
    isSettingsOpen: boolean;
    isHelpOpen: boolean;
    isConfirmationOpen: boolean;
  };
}

// Notification Interface
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  autoClose?: boolean;
  duration?: number;
}

// Progress State Interface
export interface ProgressState {
  totalProgress: number;
  moduleProgress: Record<number, {
    completed: number;
    total: number;
    percentage: number;
  }>;
  achievements: Achievement[];
  streaks: {
    current: number;
    longest: number;
  };
}

// Achievement Interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Root State Interface
import type { Level3State } from './slices/level3Slice';

export interface RootState {
  game: GameState;
  audio: AudioState;
  ui: UIState;
  progress: ProgressState;
  level3: Level3State;
}
