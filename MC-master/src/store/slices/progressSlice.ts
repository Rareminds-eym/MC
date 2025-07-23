import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProgressState, Achievement } from '../types';

const initialState: ProgressState = {
  totalProgress: 0,
  moduleProgress: {},
  achievements: [],
  streaks: {
    current: 0,
    longest: 0,
  },
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setTotalProgress: (state, action: PayloadAction<number>) => {
      state.totalProgress = Math.max(0, Math.min(100, action.payload)); // Clamp between 0 and 100
    },
    
    updateModuleProgress: (state, action: PayloadAction<{
      moduleId: number;
      completed: number;
      total: number;
      percentage: number;
    }>) => {
      const { moduleId, completed, total, percentage } = action.payload;
      state.moduleProgress[moduleId] = {
        completed,
        total,
        percentage: Math.max(0, Math.min(100, percentage)),
      };
    },
    
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      const existingIndex = state.achievements.findIndex(a => a.id === action.payload.id);
      if (existingIndex >= 0) {
        state.achievements[existingIndex] = action.payload;
      } else {
        state.achievements.push(action.payload);
      }
    },
    
    unlockAchievement: (state, action: PayloadAction<string>) => {
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
      }
    },
    
    updateAchievementProgress: (state, action: PayloadAction<{
      id: string;
      progress: number;
    }>) => {
      const { id, progress } = action.payload;
      const achievement = state.achievements.find(a => a.id === id);
      if (achievement) {
        achievement.progress = Math.max(0, progress);
        // Auto-unlock if progress reaches target
        if (achievement.target && progress >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date().toISOString();
        }
      }
    },
    
    updateStreak: (state, action: PayloadAction<number>) => {
      state.streaks.current = Math.max(0, action.payload);
      if (state.streaks.current > state.streaks.longest) {
        state.streaks.longest = state.streaks.current;
      }
    },
    
    resetStreak: (state) => {
      state.streaks.current = 0;
    },
    
    incrementStreak: (state) => {
      state.streaks.current += 1;
      if (state.streaks.current > state.streaks.longest) {
        state.streaks.longest = state.streaks.current;
      }
    },
    
    resetProgress: (state) => {
      state.totalProgress = 0;
      state.moduleProgress = {};
      state.achievements = [];
      state.streaks.current = 0;
      state.streaks.longest = 0;
    },
    
    loadProgressData: (state, action: PayloadAction<Partial<ProgressState>>) => {
      const { totalProgress, moduleProgress, achievements, streaks } = action.payload;
      
      if (totalProgress !== undefined) {
        state.totalProgress = Math.max(0, Math.min(100, totalProgress));
      }
      if (moduleProgress) {
        state.moduleProgress = moduleProgress;
      }
      if (achievements) {
        state.achievements = achievements;
      }
      if (streaks) {
        state.streaks = {
          current: Math.max(0, streaks.current || 0),
          longest: Math.max(0, streaks.longest || 0),
        };
      }
    },
  },
});

export const {
  setTotalProgress,
  updateModuleProgress,
  addAchievement,
  unlockAchievement,
  updateAchievementProgress,
  updateStreak,
  resetStreak,
  incrementStreak,
  resetProgress,
  loadProgressData,
} = progressSlice.actions;

export default progressSlice.reducer;
