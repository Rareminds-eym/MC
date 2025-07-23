import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  getLevel4Progress, 
  createLevel4Progress,
  updateCaseProgress, 
  completeLevel4,
  Level4Progress 
} from '../services/level4';
import { GameState } from '../types';
import { casesByModule } from '../data/cases';

/**
 * Custom hook to integrate GameBoard2D with Supabase
 */
export const useSupabaseIntegration = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gameProgress, setGameProgress] = useState<Level4Progress | null>(null);
  const [attemptsByCase, setAttemptsByCase] = useState<Record<number, number>>({});
  const caseStartTimeRef = useRef<number>(Date.now());
  const [initialized, setInitialized] = useState(false);
  
  // Load or create game progress when hook is initialized
  useEffect(() => {
    const loadGameProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Try to load existing progress
        let progress = await getLevel4Progress();
        
        if (!progress) {
          // Create new progress if none exists
          progress = await createLevel4Progress();
          caseStartTimeRef.current = Date.now();
        } else {
          // If we have existing progress, setup attempts tracking
          const attempts: Record<number, number> = {};
          progress.cases.caseProgress.forEach(caseProgress => {
            attempts[caseProgress.id] = caseProgress.attempts;
          });
          setAttemptsByCase(attempts);
        }
        
        setGameProgress(progress);
        setInitialized(true);
      } catch (error) {
        console.error("Failed to load game progress:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGameProgress();
  }, [user]);
  
  // Sync GameState with Supabase
  const syncWithSupabase = useCallback(async (
    gameState: GameState,
    isCorrect: boolean = false,
    isCompleted: boolean = false,
    timer: number = 0
  ) => {
    if (!gameProgress?.id || !user) return;
    
    const currentCase = casesByModule.module1[gameState.currentCase];
    if (!currentCase) return;
    
    // Track attempts for this case
    const caseId = currentCase.id;
    const currentAttempts = attemptsByCase[caseId] || 0;
    const newAttempts = isCorrect ? currentAttempts + 1 : currentAttempts;
    
    if (isCorrect) {
      setAttemptsByCase(prev => ({
        ...prev,
        [caseId]: newAttempts
      }));
    }
    
    // Calculate time spent on this case
    const timeSpent = Math.floor((Date.now() - caseStartTimeRef.current) / 1000);
    
    // Reset case start time for next case
    caseStartTimeRef.current = Date.now();
    
    // Only update if we have answers
    if (gameState.answers.violation !== null || 
        gameState.answers.rootCause !== null || 
        gameState.answers.impact !== null) {
      
      await updateCaseProgress(
        gameProgress.id,
        caseId,
        gameState.answers,
        isCorrect,
        newAttempts,
        timeSpent
      );
    }
    
    // If game is completed
    if (isCompleted) {
      await completeLevel4(gameProgress.id, timer);
    }
    
    // Update our local copy of the game progress
    const updatedProgress = await getLevel4Progress();
    if (updatedProgress) {
      setGameProgress(updatedProgress);
    }
  }, [gameProgress, user, attemptsByCase]);
  
  // Get initial state from Supabase
  const getInitialState = useCallback((): Partial<GameState> | null => {
    if (!gameProgress || !initialized) return null;
    
    // Find the most recent case progress
    const latestCaseId = gameProgress.cases.currentCase;
    const caseIndex = cases.findIndex(c => c.id === latestCaseId);
    
    // If we have a valid case
    if (caseIndex >= 0) {
      return {
        currentCase: caseIndex,
        score: gameProgress.score,
        // Other state to restore from gameProgress if needed
      };
    }
    
    return null;
  }, [gameProgress, initialized]);
  
  return {
    loading,
    syncWithSupabase,
    getInitialState,
    user
  };
};

export default useSupabaseIntegration;
