import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameState } from '../types';
import type { Module, Level, UserScore } from '../../types';
import { GMP_MODULES } from '../../data/gmpModules';

const initialState: GameState = {
  modules: GMP_MODULES,
  completedLevels: new Set(),
  userScores: {},
  isLoading: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = undefined;
    },
    
    completeLevel: (state, action: PayloadAction<{
      moduleId: number;
      levelId: number;
      score: number;
      stars: number;
    }>) => {
      const { moduleId, levelId, score, stars } = action.payload;
      const levelKey = `${moduleId}-${levelId}`;
      
      // Add to completed levels
      state.completedLevels.add(levelKey);
      
      // Update user scores
      state.userScores[levelKey] = {
        moduleId,
        levelId,
        score,
        stars,
        completedAt: new Date().toISOString()
      };
    },
    
    setCurrentModule: (state, action: PayloadAction<Module>) => {
      state.currentModule = action.payload;
    },
    
    setCurrentLevel: (state, action: PayloadAction<Level>) => {
      state.currentLevel = action.payload;
    },
    
    loadProgress: (state, action: PayloadAction<{
      completedLevels: string[];
      userScores: Record<string, UserScore>;
    }>) => {
      const { completedLevels, userScores } = action.payload;
      state.completedLevels = new Set(completedLevels);
      state.userScores = userScores;
    },
    
    clearProgress: (state) => {
      state.completedLevels = new Set();
      state.userScores = {};
      state.currentModule = undefined;
      state.currentLevel = undefined;
    },
    
    updateModuleData: (state, action: PayloadAction<Module[]>) => {
      state.modules = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  completeLevel,
  setCurrentModule,
  setCurrentLevel,
  loadProgress,
  clearProgress,
  updateModuleData,
} = gameSlice.actions;

export default gameSlice.reducer;
