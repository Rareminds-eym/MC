import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Level2GameService } from '../services/level2GameService';

interface UseCompletedGameModesOptions {
  moduleId: string;
}

interface UseCompletedGameModesReturn {
  completedGameModeIds: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isGameModeCompleted: (gameModeId: string) => boolean;
}

export const useCompletedGameModes = ({ moduleId }: UseCompletedGameModesOptions): UseCompletedGameModesReturn => {
  const { user } = useAuth();
  const [completedGameModeIds, setCompletedGameModeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletedGameModes = useCallback(async () => {
    if (!user) {
      setCompletedGameModeIds([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await Level2GameService.getCompletedGameModeIds(moduleId);
      
      if (fetchError) {
        throw new Error(`Failed to fetch completed game modes: ${fetchError.message}`);
      }

      setCompletedGameModeIds(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch completed game modes';
      setError(errorMessage);
      console.error('Error fetching completed game modes:', errorMessage);
      setCompletedGameModeIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, moduleId]);

  // Load completed game modes when component mounts or dependencies change
  useEffect(() => {
    fetchCompletedGameModes();
  }, [fetchCompletedGameModes]);

  // Helper function to check if a specific game mode is completed
  const isGameModeCompleted = useCallback((gameModeId: string): boolean => {
    return completedGameModeIds.includes(gameModeId);
  }, [completedGameModeIds]);

  return {
    completedGameModeIds,
    isLoading,
    error,
    refetch: fetchCompletedGameModes,
    isGameModeCompleted,
  };
};
