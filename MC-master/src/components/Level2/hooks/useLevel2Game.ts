import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Level2GameService } from '../services/level2GameService';
import { Level2GameData, Level2GameStats, Level2ScoreHistory, Level2GameDataWithHistory, Term } from '../../../types/Level2/types';
import { GameStorage } from '../../../utils/Level2/gameStorage';

interface UseLevel2GameOptions {
  moduleId: string;
  gameModeId: string;
}

interface UseLevel2GameReturn {
  isLoading: boolean;
  stats: Level2GameStats | null;
  scoreHistory: Level2ScoreHistory | null;
  gameDataWithHistory: Level2GameDataWithHistory | null;
  saveGameData: (gameData: {
    score: number;
    isCompleted: boolean;
    time: number;
    totalTerms: number;
    placedTerms: Term[];
  }) => Promise<boolean>;
  saveGameDataWithHistory: (gameData: {
    score: number;
    isCompleted: boolean;
    time: number;
    totalTerms: number;
    placedTerms: Term[];
  }) => Promise<{ success: boolean; freshData?: Level2GameDataWithHistory }>;
  loadBestScore: () => Promise<Level2GameData | null>;
  loadScoreHistory: () => Promise<Level2ScoreHistory | null>;
  loadGameDataWithHistory: () => Promise<Level2GameDataWithHistory | null>;
  markLevelCompleted: () => Promise<boolean>;
  trackGameModeProgression: () => Promise<boolean>;
  hasCompleted: boolean;
  completedGameModeIds: string[];
  isGameModeCompleted: (gameModeId: string) => boolean;
  refreshCompletedGameModes: () => Promise<void>;
  error: string | null;
}

export const useLevel2Game = ({ moduleId, gameModeId }: UseLevel2GameOptions): UseLevel2GameReturn => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<Level2GameStats | null>(null);
  const [scoreHistory, setScoreHistory] = useState<Level2ScoreHistory | null>(null);
  const [gameDataWithHistory, setGameDataWithHistory] = useState<Level2GameDataWithHistory | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [completedGameModeIds, setCompletedGameModeIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load initial data when component mounts or dependencies change
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);
      
      try {
        // Load user stats
        const { data: statsData, error: statsError } = await Level2GameService.getGameStats(moduleId, gameModeId);
        if (statsError) {
          throw new Error('Failed to load game statistics');
        }
        setStats(statsData);

        // Check completion status
        const { data: completionData, error: completionError } = await Level2GameService.hasCompletedLevel(moduleId, gameModeId);
        if (completionError) {
          throw new Error('Failed to check completion status');
        }
        setHasCompleted(completionData);

        // Load score history
        const { data: historyData, error: historyError } = await Level2GameService.getPastThreeScores(moduleId, gameModeId);
        if (!historyError && historyData) {
          setScoreHistory(historyData);
        }

        // Load game data with history
        const { data: gameHistoryData, error: gameHistoryError } = await Level2GameService.getUserGameDataWithHistory(moduleId, gameModeId);
        if (!gameHistoryError && gameHistoryData) {
          setGameDataWithHistory(gameHistoryData);
        }

        // Load completed game mode IDs
        const { data: completedIds, error: completedError } = await Level2GameService.getCompletedGameModeIds(moduleId);
        if (!completedError && completedIds) {
          setCompletedGameModeIds(completedIds);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error loading Level2 game data:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [user, moduleId, gameModeId]);

  const saveGameData = useCallback(async (gameData: {
    score: number;
    isCompleted: boolean;
    time: number;
    totalTerms: number;
    placedTerms: Term[];
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Always save to localStorage for offline support
      GameStorage.updateScore(gameData.score, gameData.time, gameData.isCompleted);

      // Save to database if user is authenticated
      if (user) {
        const dbGameData = {
          module_id: moduleId,
          level_number: 2,
          game_mode_id: gameModeId,
          score: gameData.score,
          is_completed: gameData.isCompleted,
          time: gameData.time,
          total_terms: gameData.totalTerms,
          placed_terms: gameData.placedTerms,
        };

        const { data: savedData, error: saveError } = await Level2GameService.saveGameData(dbGameData);
        if (saveError) {
          // If it's a duplicate save prevention, don't treat it as an error
          if (saveError.message === 'Duplicate save prevented') {
            console.log('Duplicate save prevented - this is expected behavior');
          } else {
            console.error('Failed to save game data to database:', saveError);
            throw new Error('Failed to save game data to database');
          }
        } else if (savedData) {
          console.log('Game data saved successfully:', {
            id: savedData.id,
            score: savedData.score,
            isCompleted: savedData.is_completed,
            isUpdate: !!savedData.updated_at && savedData.updated_at !== savedData.created_at
          });
        }

        // Update local state
        if (gameData.isCompleted) {
          setHasCompleted(true);
        }

        // Refresh stats
        const { data: updatedStats, error: statsError } = await Level2GameService.getGameStats(moduleId, gameModeId);
        if (!statsError && updatedStats) {
          setStats(updatedStats);
        }
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save game data';
      setError(errorMessage);
      console.error('Error saving game data:', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, moduleId, gameModeId]);

  const loadBestScore = useCallback(async (): Promise<Level2GameData | null> => {
    if (!user) return null;

    try {
      const { data, error } = await Level2GameService.getBestScore(moduleId, gameModeId);
      if (error) {
        throw new Error('Failed to load best score');
      }
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load best score';
      setError(errorMessage);
      console.error('Error loading best score:', errorMessage);
      return null;
    }
  }, [user, moduleId, gameModeId]);

  const markLevelCompleted = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await Level2GameService.markLevelCompleted(moduleId, gameModeId);
      if (error) {
        throw new Error('Failed to mark level as completed');
      }

      // Update local state
      setHasCompleted(true);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark level as completed';
      setError(errorMessage);
      console.error('Error marking level as completed:', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, moduleId, gameModeId]);

  const trackGameModeProgression = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await Level2GameService.trackGameModeProgression(moduleId, gameModeId);
      if (error) {
        throw new Error('Failed to track game mode progression');
      }

      console.log(`Successfully tracked progression for game mode: ${gameModeId}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track game mode progression';
      setError(errorMessage);
      console.error('Error tracking game mode progression:', errorMessage);
      return false;
    }
  }, [user, moduleId, gameModeId]);

  const saveGameDataWithHistory = useCallback(async (gameData: {
    score: number;
    isCompleted: boolean;
    time: number;
    totalTerms: number;
    placedTerms: Term[];
  }): Promise<{ success: boolean; freshData?: Level2GameDataWithHistory }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Always save to localStorage for offline support
      GameStorage.updateScore(gameData.score, gameData.time, gameData.isCompleted);

      // Save to database with history if user is authenticated
      if (user) {
        const dbGameData = {
          module_id: moduleId,
          level_number: 2,
          game_mode_id: gameModeId,
          score: gameData.score,
          is_completed: gameData.isCompleted,
          time: gameData.time,
          total_terms: gameData.totalTerms,
          placed_terms: gameData.placedTerms,
        };

        const { data: savedData, error: saveError } = await Level2GameService.saveGameDataWithHistory(dbGameData);
        if (saveError) {
          // If it's a duplicate save prevention, don't treat it as an error
          if (saveError.message === 'Duplicate save prevented') {
            console.log('Duplicate save prevented - this is expected behavior');
          } else {
            console.error('Failed to save game data with history to database:', saveError);
            throw new Error('Failed to save game data with history to database');
          }
        } else if (savedData) {
          console.log('Game data with history saved successfully:', {
            id: savedData.id,
            score: savedData.score,
            isCompleted: savedData.is_completed,
            scoreHistory: savedData.score_history,
            timeHistory: savedData.time_history
          });
        }

        // Update local state
        if (gameData.isCompleted) {
          setHasCompleted(true);
        }

        // Refresh stats and history
        const { data: updatedStats, error: statsError } = await Level2GameService.getGameStats(moduleId, gameModeId);
        if (!statsError && updatedStats) {
          setStats(updatedStats);
        }

        const { data: updatedHistory, error: historyError } = await Level2GameService.getPastThreeScores(moduleId, gameModeId);
        if (!historyError && updatedHistory) {
          setScoreHistory(updatedHistory);
        }

        const { data: updatedGameHistory, error: gameHistoryError } = await Level2GameService.getUserGameDataWithHistory(moduleId, gameModeId);
        if (!gameHistoryError && updatedGameHistory) {
          setGameDataWithHistory(updatedGameHistory);
          return { success: true, freshData: updatedGameHistory };
        }
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save game data with history';
      setError(errorMessage);
      console.error('Error saving game data with history:', errorMessage);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [user, moduleId, gameModeId]);

  const loadScoreHistory = useCallback(async (): Promise<Level2ScoreHistory | null> => {
    if (!user) return null;

    try {
      const { data, error } = await Level2GameService.getPastThreeScores(moduleId, gameModeId);
      if (error) {
        throw new Error('Failed to load aggregated score history');
      }
      if (data) {
        setScoreHistory(data);
      }
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load score history';
      setError(errorMessage);
      console.error('Error loading score history:', errorMessage);
      return null;
    }
  }, [user, moduleId, gameModeId]);

  const loadGameDataWithHistory = useCallback(async (): Promise<Level2GameDataWithHistory | null> => {
    if (!user) return null;

    try {
      const { data, error } = await Level2GameService.getUserGameDataWithHistory(moduleId, gameModeId);
      if (error) {
        throw new Error('Failed to load game data with history');
      }
      if (data) {
        setGameDataWithHistory(data);
      }
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game data with history';
      setError(errorMessage);
      console.error('Error loading game data with history:', errorMessage);
      return null;
    }
  }, [user, moduleId, gameModeId]);

  // Helper function to refresh completed game modes
  const refreshCompletedGameModes = useCallback(async (): Promise<void> => {
    if (!user) {
      setCompletedGameModeIds([]);
      return;
    }

    try {
      const { data: completedIds, error: completedError } = await Level2GameService.getCompletedGameModeIds(moduleId);
      if (!completedError && completedIds) {
        setCompletedGameModeIds(completedIds);
      }
    } catch (err) {
      console.error('Error refreshing completed game modes:', err);
    }
  }, [user, moduleId]);

  // Helper function to check if a specific game mode is completed
  const isGameModeCompleted = useCallback((gameModeId: string): boolean => {
    return completedGameModeIds.includes(gameModeId);
  }, [completedGameModeIds]);

  return {
    isLoading,
    stats,
    scoreHistory,
    gameDataWithHistory,
    saveGameData,
    saveGameDataWithHistory,
    loadBestScore,
    loadScoreHistory,
    loadGameDataWithHistory,
    markLevelCompleted,
    trackGameModeProgression,
    hasCompleted,
    completedGameModeIds,
    isGameModeCompleted,
    refreshCompletedGameModes,
    error,
  };
};
