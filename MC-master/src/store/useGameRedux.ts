import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './hooks';
import {
  completeLevel,
  setCurrentModule,
  setCurrentLevel,
  loadProgress,
  clearProgress,
  setLoading,
  setError,
  clearError,
} from './slices/gameSlice';
import {
  selectModules,
  selectCompletedLevels,
  selectUserScores,
  selectCurrentModule,
  selectCurrentLevel,
  selectIsLoading,
  selectError,
  selectOverallProgress,
} from './selectors';
import { saveGameProgress, loadGameProgress, calculateProgress } from './thunks';
import type { Module, Level, UserScore } from '../types';

/**
 * Custom hook that provides game state and actions
 * This replaces the GameContext functionality
 */
export const useGameRedux = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const modules = useAppSelector(selectModules);
  const completedLevels = useAppSelector(selectCompletedLevels);
  const userScores = useAppSelector(selectUserScores);
  const currentModule = useAppSelector(selectCurrentModule);
  const currentLevel = useAppSelector(selectCurrentLevel);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const overallProgress = useAppSelector(selectOverallProgress);

  // Actions
  const completeLevelAction = useCallback((
    moduleId: number,
    levelId: number,
    score: number,
    stars: number
  ) => {
    dispatch(completeLevel({ moduleId, levelId, score, stars }));
    // Auto-save after completing a level
    dispatch(saveGameProgress());
    // Recalculate progress
    dispatch(calculateProgress());
  }, [dispatch]);

  const setCurrentModuleAction = useCallback((module: Module) => {
    dispatch(setCurrentModule(module));
  }, [dispatch]);

  const setCurrentLevelAction = useCallback((level: Level) => {
    dispatch(setCurrentLevel(level));
  }, [dispatch]);

  const loadProgressAction = useCallback(() => {
    dispatch(loadGameProgress());
  }, [dispatch]);

  const saveProgressAction = useCallback(() => {
    dispatch(saveGameProgress());
  }, [dispatch]);

  const clearProgressAction = useCallback(() => {
    dispatch(clearProgress());
  }, [dispatch]);

  const setLoadingAction = useCallback((loading: boolean) => {
    dispatch(setLoading(loading));
  }, [dispatch]);

  const setErrorAction = useCallback((errorMessage: string) => {
    dispatch(setError(errorMessage));
  }, [dispatch]);

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper functions
  const isLevelCompleted = useCallback((moduleId: number, levelId: number) => {
    return completedLevels.has(`${moduleId}-${levelId}`);
  }, [completedLevels]);

  const getLevelScore = useCallback((moduleId: number, levelId: number): UserScore | undefined => {
    return userScores ? userScores[`${moduleId}-${levelId}`] : undefined;
  }, [userScores]);

  const getModuleProgress = useCallback((moduleId: number) => {
    const module = modules.find((m: Module) => m.id === moduleId);
    if (!module) return { completed: 0, total: 0, percentage: 0 };

    const completedCount = module.levels.filter((level: Level) => 
      completedLevels.has(`${moduleId}-${level.id}`)
    ).length;

    return {
      completed: completedCount,
      total: module.levels.length,
      percentage: Math.round((completedCount / module.levels.length) * 100)
    };
  }, [modules, completedLevels]);

  return {
    // State
    modules,
    completedLevels,
    userScores,
    currentModule,
    currentLevel,
    isLoading,
    error,
    overallProgress,

    // Actions
    completeLevel: completeLevelAction,
    setCurrentModule: setCurrentModuleAction,
    setCurrentLevel: setCurrentLevelAction,
    loadProgress: loadProgressAction,
    saveProgress: saveProgressAction,
    clearProgress: clearProgressAction,
    setLoading: setLoadingAction,
    setError: setErrorAction,
    clearError: clearErrorAction,

    // Helper functions
    isLevelCompleted,
    getLevelScore,
    getModuleProgress,
  };
};
