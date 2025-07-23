import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LevelProgressService, ModuleProgress, UserProgressSummary } from '../services/levelProgressService';

interface UseLevelProgressReturn {
  moduleProgress: ModuleProgress[];
  userProgressSummary: UserProgressSummary[];
  isLoading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  isLevelCompleted: (moduleId: number, levelId: number) => boolean;
  isLevelUnlocked: (moduleId: number, levelId: number) => boolean;
  isLevelUnlockedDB: (moduleId: number, levelId: number) => Promise<boolean>;
  completeLevel: (moduleId: number, levelId: number) => Promise<boolean>;
}

export const useLevelProgress = (moduleId?: number): UseLevelProgressReturn => {
  const { user } = useAuth();
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [userProgressSummary, setUserProgressSummary] = useState<UserProgressSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProgress = useCallback(async () => {
    if (!user) {
      setModuleProgress([]);
      setUserProgressSummary([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch module progress if moduleId is provided
      if (moduleId !== undefined) {
        const { data: moduleData, error: moduleError } = await LevelProgressService.getModuleProgress(
          user.id,
          moduleId
        );

        if (moduleError) {
          throw new Error(`Failed to fetch module progress: ${moduleError.message}`);
        }

        console.log('useLevelProgress: Module progress data received:', {
          moduleId,
          moduleData,
          dataLength: moduleData?.length || 0
        });

        setModuleProgress(moduleData || []);
      }

      // Fetch overall user progress summary
      const { data: summaryData, error: summaryError } = await LevelProgressService.getUserProgressSummary(
        user.id
      );

      if (summaryError) {
        throw new Error(`Failed to fetch user progress summary: ${summaryError.message}`);
      }

      setUserProgressSummary(summaryData || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch progress data';
      setError(errorMessage);
      console.error('Error fetching progress:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, moduleId]);

  // Load progress when component mounts or dependencies change
  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  // Helper function to check if a level is completed
  const isLevelCompleted = useCallback((checkModuleId: number, levelId: number): boolean => {
    if (checkModuleId === moduleId && moduleProgress.length > 0) {
      // Use module progress data if available for the current module
      const levelProgress = moduleProgress.find(progress => progress.level_id === levelId);
      return levelProgress?.is_completed || false;
    } else {
      // Fallback to user progress summary for other modules
      // This is a simplified check - in a real scenario, you might need more detailed data
      return false; // We don't have level-specific data in the summary
    }
  }, [moduleId, moduleProgress, userProgressSummary]);

  // Helper function to check if a level is unlocked (synchronous)
  const isLevelUnlocked = useCallback((checkModuleId: number, levelId: number): boolean => {
    console.log('useLevelProgress: Checking if level is unlocked', {
      checkModuleId,
      levelId,
      currentModuleId: moduleId,
      moduleProgressLength: moduleProgress.length,
      moduleProgress,
      isLoading
    });

    // Level 1 is always unlocked
    if (levelId === 1) {
      console.log('useLevelProgress: Level 1 is always unlocked');
      return true;
    }

    // If we have module progress data for the current module, use it
    if (checkModuleId === moduleId && moduleProgress.length > 0) {
      // Check if previous level is completed
      const previousLevelProgress = moduleProgress.find(progress => progress.level_id === levelId - 1);
      const isUnlocked = previousLevelProgress?.is_completed || false;

      console.log('useLevelProgress: Level unlock result from module progress', {
        checkModuleId,
        levelId,
        previousLevel: levelId - 1,
        previousLevelProgress,
        isUnlocked
      });

      return isUnlocked;
    }

    // For other modules or when moduleProgress is not loaded,
    // return false for levels > 1 to be safe, but allow level 1 for other modules
    const isUnlocked = levelId === 1;
    console.log('useLevelProgress: Fallback unlock logic', {
      checkModuleId,
      levelId,
      isUnlocked,
      reason: 'Module progress not loaded or different module - only level 1 unlocked',
      isLoading,
      moduleProgressLength: moduleProgress.length
    });
    return isUnlocked;
  }, [moduleId, moduleProgress]);

  // Helper function to check if a level is unlocked using database function
  const isLevelUnlockedDB = useCallback(async (checkModuleId: number, levelId: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await LevelProgressService.isLevelUnlocked(user.id, checkModuleId, levelId);
      if (error) {
        console.error('Error checking level unlock status:', error);
        // Fallback to local logic if database call fails
        return isLevelUnlocked(checkModuleId, levelId);
      }
      return data || false;
    } catch (error) {
      console.error('Error in isLevelUnlockedDB:', error);
      // Fallback to local logic if database call fails
      return isLevelUnlocked(checkModuleId, levelId);
    }
  }, [user, isLevelUnlocked]);

  // Function to complete a level
  const completeLevel = useCallback(async (completeModuleId: number, levelId: number): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: completeError } = await LevelProgressService.completeLevel(
        user.id,
        completeModuleId,
        levelId
      );

      if (completeError) {
        throw new Error(`Failed to complete level: ${completeError.message}`);
      }

      // Refresh progress after completing a level
      await refreshProgress();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete level';
      setError(errorMessage);
      console.error('Error completing level:', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, refreshProgress]);

  return {
    moduleProgress,
    userProgressSummary,
    isLoading,
    error,
    refreshProgress,
    isLevelCompleted,
    isLevelUnlocked,
    isLevelUnlockedDB,
    completeLevel,
  };
};
