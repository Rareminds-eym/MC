import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { GameState } from '../types';
import { casesByModule } from '../data/cases';
import { saveLevel4Completion } from '../../../services/level4GameService';

// Enable debug logging
const DEBUG = true;
const logDebug = (...args: any[]) => {
  if (DEBUG) {
    console.log('[Supabase Sync]', ...args);
  }
};

// Function to determine if the game state has correct answers
export const isGameStateCorrect = (gameState: GameState): boolean => {
  const currentCase = casesByModule.module1[gameState.currentCase];
  if (!currentCase) return false;

  const correctAnswers = 
    (gameState.answers.violation === currentCase.correctAnswers.violation) &&
    (gameState.answers.rootCause === currentCase.correctAnswers.rootCause) &&
    (gameState.answers.impact === currentCase.correctAnswers.impact);
    
  return correctAnswers;
};

// Hook for syncing game state with Supabase
export const useSupabaseSync = () => {
  const { user } = useAuth();
  const [progressId, setProgressId] = useState<string | null>(null);
  const [isHighScore, setIsHighScore] = useState<boolean>(false);

  // Original completeGame function, modified to use our new score tracking system
  const completeGame = useCallback(async (gameState: GameState, timer: number) => {
    if (!user) {
      logDebug('[COMPLETE] Cannot complete game: missing user');
      return;
    }

    try {
      const completeId = Math.floor(Math.random() * 1000); // For tracking in logs
      logDebug(`[COMPLETE-${completeId}] Completing game for user ${user.id}, score: ${gameState.score}, time: ${timer}`);
      
      // Original logic for handling the level_4 table
      // (Keep the existing logic from useSupabaseSync.ts)
      
      // ADDITIONAL STEP: Save to our new summary table using the service
      // This will either use a database trigger or update the summary directly
      const correctAnswersCount = Object.values(gameState.answers).filter(
        answer => answer !== null
      ).length;
      
      // Save completion data using our new service
      await saveLevel4Completion({
        userId: user.id,
        moduleId: 1, // Assuming module 1 for Level 4
        score: gameState.score,
        time: timer,
        violations: gameState.currentCase + 1, // Number of violations identified
        correctAnswers: correctAnswersCount,
        totalQuestions: 3 // violation, rootCause, impact
      });
      
      logDebug(`[COMPLETE-${completeId}] Updated level_4_user_summary for user ${user.id}`);
      
      // Rest of the original function...
      
    } catch (error) {
      console.error('Error in completeGame:', error);
    }
  }, [user]);

  // Keep the rest of the original hook's code...
  
  // Check if the current score is a new high score
  const checkHighScore = useCallback(async (score: number): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Get the user's current summary data
      const { data, error } = await supabase
        .from('level_4_user_summary')
        .select('highest_score')
        .eq('user_id', user.id)
        .eq('module', 1)
        .single();
      
      if (error) {
        // If there's an error or no record exists, this is the first score
        return true;
      }
      
      // Check if the new score is higher than the previous high score
      const isNewHighScore = score > (data?.highest_score || 0);
      setIsHighScore(isNewHighScore);
      return isNewHighScore;
    } catch (error) {
      console.error('Error checking high score:', error);
      return false;
    }
  }, [user]);

  return {
    // Return functions and state
    syncGameState: () => {}, // Implement as needed
    completeGame,
    checkHighScore,
    progressId,
    isHighScore
  };
};
