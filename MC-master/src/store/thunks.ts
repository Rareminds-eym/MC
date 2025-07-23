import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

// Load game progress from localStorage
export const loadGameProgress = createAsyncThunk(
  'game/loadProgress',
  async (_, { rejectWithValue }) => {
    try {
      const defaultProgress = { completedLevels: [], userScores: {} };
      const progressData = loadFromStorage(STORAGE_KEYS.GAME_PROGRESS, defaultProgress);
      
      return {
        completedLevels: progressData.completedLevels || [],
        userScores: progressData.userScores || {}
      };
    } catch (error) {
      return rejectWithValue('Failed to load game progress');
    }
  }
);

// Save game progress to localStorage
export const saveGameProgress = createAsyncThunk(
  'game/saveProgress',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const progressData = {
        completedLevels: Array.from(state.game.completedLevels),
        userScores: state.game.userScores,
        timestamp: new Date().toISOString()
      };
      
      saveToStorage(STORAGE_KEYS.GAME_PROGRESS, progressData);
      return progressData;
    } catch (error) {
      return rejectWithValue('Failed to save game progress');
    }
  }
);

// Calculate and update progress
export const calculateProgress = createAsyncThunk(
  'progress/calculate',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { modules, completedLevels } = state.game;
      
      // Calculate total progress
      const totalLevels = modules.reduce((sum, module) => sum + module.levels.length, 0);
      const totalProgress = totalLevels > 0 ? 
        Math.round((completedLevels.size / totalLevels) * 100) : 0;
      
      // Calculate module progress
      const moduleProgress: Record<number, { completed: number; total: number; percentage: number }> = {};
      
      modules.forEach(module => {
        const completedCount = module.levels.filter(level => 
          completedLevels.has(`${module.id}-${level.id}`)
        ).length;
        
        moduleProgress[module.id] = {
          completed: completedCount,
          total: module.levels.length,
          percentage: Math.round((completedCount / module.levels.length) * 100)
        };
      });
      
      return {
        totalProgress,
        moduleProgress
      };
    } catch (error) {
      return rejectWithValue('Failed to calculate progress');
    }
  }
);
