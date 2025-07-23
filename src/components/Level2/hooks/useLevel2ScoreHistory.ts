import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Level2GameService } from '../services/level2GameService';
import { Level2ScoreHistory, Level2GameDataWithHistory } from '../../../types/Level2/types';

interface UseLevel2ScoreHistoryOptions {
  moduleId: string;
  gameModeId: string;
  autoLoad?: boolean;
}

interface UseLevel2ScoreHistoryReturn {
  isLoading: boolean;
  scoreHistory: Level2ScoreHistory | null;
  gameDataWithHistory: Level2GameDataWithHistory | null;
  error: string | null;
  refreshHistory: () => Promise<void>;
  testHistoryFunction: () => Promise<{ success: boolean; message: string }>;
}

export const useLevel2ScoreHistory = ({ 
  moduleId, 
  gameModeId, 
  autoLoad = true 
}: UseLevel2ScoreHistoryOptions): UseLevel2ScoreHistoryReturn => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<Level2ScoreHistory | null>(null);
  const [gameDataWithHistory, setGameDataWithHistory] = useState<Level2GameDataWithHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHistoryData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load aggregated score history (no longer needs specific gameModeId)
      const { data: historyData, error: historyError } = await Level2GameService.getPastThreeScores(moduleId, gameModeId);
      if (historyError) {
        console.warn('Failed to load aggregated score history:', historyError);
      } else {
        setScoreHistory(historyData);
      }

      // Load game data with aggregated history arrays
      const { data: gameHistoryData, error: gameHistoryError } = await Level2GameService.getUserGameDataWithHistory(moduleId, gameModeId);
      if (gameHistoryError) {
        console.warn('Failed to load game data with aggregated history:', gameHistoryError);
      } else {
        setGameDataWithHistory(gameHistoryData);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load aggregated score history';
      setError(errorMessage);
      console.error('Error loading aggregated score history:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, moduleId, gameModeId]);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadHistoryData();
    }
  }, [autoLoad, loadHistoryData]);

  const refreshHistory = useCallback(async () => {
    await loadHistoryData();
  }, [loadHistoryData]);

  const testHistoryFunction = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // Test the aggregated history UPSERT functionality
      const result = await Level2GameService.testUpsertWithHistory(moduleId, gameModeId);
      
      // Refresh data after test
      if (result.success) {
        await refreshHistory();
      }
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Test failed with unknown error';
      return { success: false, message };
    }
  }, [user, moduleId, gameModeId, refreshHistory]);

  return {
    isLoading,
    scoreHistory,
    gameDataWithHistory,
    error,
    refreshHistory,
    testHistoryFunction,
  };
};

export default useLevel2ScoreHistory;
