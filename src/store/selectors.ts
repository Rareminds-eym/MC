import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './types';

// Base selectors with defensive checks
export const selectGame = (state: RootState) => state.game || {
  modules: [],
  completedLevels: new Set(),
  userScores: {},
  isLoading: false,
};

export const selectAudio = (state: RootState) => state.audio || {
  isEnabled: true,
  volume: 0.7,
  isMuted: false,
  currentTrack: undefined,
};

export const selectUI = (state: RootState) => state.ui || {
  sidebarOpen: false,
  theme: 'light' as const,
  notifications: [],
  modals: {
    isSettingsOpen: false,
    isHelpOpen: false,
    isConfirmationOpen: false,
  },
};

export const selectProgress = (state: RootState) => state.progress || {
  totalProgress: 0,
  moduleProgress: {},
  achievements: [],
  streaks: {
    current: 0,
    longest: 0,
  },
};

// Game selectors with defensive checks
export const selectModules = createSelector(
  [selectGame],
  (game) => game?.modules || []
);

export const selectCompletedLevels = createSelector(
  [selectGame],
  (game) => game?.completedLevels || new Set()
);

export const selectUserScores = createSelector(
  [selectGame],
  (game) => game?.userScores || {}
);

export const selectCurrentModule = createSelector(
  [selectGame],
  (game) => game?.currentModule
);

export const selectCurrentLevel = createSelector(
  [selectGame],
  (game) => game?.currentLevel
);

export const selectIsLoading = createSelector(
  [selectGame],
  (game) => game?.isLoading || false
);

export const selectError = createSelector(
  [selectGame],
  (game) => game?.error
);

// Level completion selectors
export const selectIsLevelCompleted = createSelector(
  [selectCompletedLevels, (state: RootState, moduleId: number, levelId: number) => `${moduleId}-${levelId}`],
  (completedLevels, levelKey) => completedLevels.has(levelKey)
);

export const selectLevelScore = createSelector(
  [selectUserScores, (state: RootState, moduleId: number, levelId: number) => `${moduleId}-${levelId}`],
  (userScores, levelKey) => userScores[levelKey]
);

// Module progress selectors
export const selectModuleProgress = createSelector(
  [selectModules, selectCompletedLevels, (state: RootState, moduleId: number) => moduleId],
  (modules, completedLevels, moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return { completed: 0, total: 0, percentage: 0 };

    const completedCount = module.levels.filter(level => 
      completedLevels.has(`${moduleId}-${level.id}`)
    ).length;

    return {
      completed: completedCount,
      total: module.levels.length,
      percentage: Math.round((completedCount / module.levels.length) * 100)
    };
  }
);

// Audio selectors with defensive checks
export const selectAudioEnabled = createSelector(
  [selectAudio],
  (audio) => audio?.isEnabled ?? true
);

export const selectVolume = createSelector(
  [selectAudio],
  (audio) => audio?.volume ?? 0.7
);

export const selectIsMuted = createSelector(
  [selectAudio],
  (audio) => audio?.isMuted ?? false
);

export const selectCurrentTrack = createSelector(
  [selectAudio],
  (audio) => audio?.currentTrack
);

// UI selectors with defensive checks
export const selectSidebarOpen = createSelector(
  [selectUI],
  (ui) => ui?.sidebarOpen ?? false
);

export const selectTheme = createSelector(
  [selectUI],
  (ui) => ui?.theme ?? 'light'
);

export const selectNotifications = createSelector(
  [selectUI],
  (ui) => ui?.notifications || []
);

export const selectModals = createSelector(
  [selectUI],
  (ui) => ui?.modals || {
    isSettingsOpen: false,
    isHelpOpen: false,
    isConfirmationOpen: false,
  }
);

// Progress selectors with defensive checks
export const selectTotalProgress = createSelector(
  [selectProgress],
  (progress) => progress?.totalProgress ?? 0
);

export const selectAchievements = createSelector(
  [selectProgress],
  (progress) => progress?.achievements || []
);

export const selectUnlockedAchievements = createSelector(
  [selectAchievements],
  (achievements) => (achievements || []).filter(a => a.unlockedAt)
);

export const selectStreaks = createSelector(
  [selectProgress],
  (progress) => progress?.streaks || { current: 0, longest: 0 }
);

// Complex selectors
export const selectOverallProgress = createSelector(
  [selectModules, selectCompletedLevels],
  (modules, completedLevels) => {
    const totalLevels = modules.reduce((sum, module) => sum + module.levels.length, 0);
    const completedCount = completedLevels.size;
    
    return {
      completed: completedCount,
      total: totalLevels,
      percentage: totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0
    };
  }
);

export const selectModuleById = createSelector(
  [selectModules, (state: RootState, moduleId: number) => moduleId],
  (modules, moduleId) => modules.find(m => m.id === moduleId)
);

export const selectLevelsByModuleId = createSelector(
  [selectModuleById],
  (module) => module?.levels || []
);
