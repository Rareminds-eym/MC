/**
 * Game Data Saver Utility
 * 
 * This utility provides functions to save Level 4 game data to Supabase
 * using the Level4Service. It can be used as an alternative to the useSupabaseSync hook
 * for more granular control over data saving.
 */

import level4Service from '../services';
import type { GameState } from '../types';

/**
 * Save game completion data to Supabase
 */
export const saveGameCompletion = async (
  userId: string,
  gameState: GameState,
  timer: number,
  moduleCases: any[]
): Promise<{ success: boolean; recordId?: string; error?: string }> => {
  try {
    // Prepare cases data in the format expected by the database
    const casesData = {
      currentCase: gameState.currentCase,
      caseProgress: moduleCases.map((caseItem, index) => ({
        id: caseItem.id,
        answers: {
          violation: gameState.answers.violation,
          rootCause: gameState.answers.rootCause,
          impact: gameState.answers.impact
        },
        isCorrect: index <= gameState.currentCase ? true : false, // Mark completed cases as correct
        attempts: 1, // You can track this if needed
        timeSpent: timer // Total time for now, can be per-case if tracked
      })),
      scoredQuestions: {
        [gameState.currentCase]: ["violation", "rootCause", "impact"]
      }
    };

    // Determine if game is completed (all cases finished)
    const isCompleted = gameState.currentCase >= moduleCases.length - 1 && gameState.gameComplete;

    // Save using the enhanced upsert function with history management
    const recordId = await level4Service.upsertGameDataWithHistory(
      userId,
      gameState.moduleNumber,
      gameState.score,
      isCompleted,
      timer,
      casesData
    );

    console.log('✅ Game data saved successfully:', {
      recordId,
      userId,
      module: gameState.moduleNumber,
      score: gameState.score,
      isCompleted,
      timer
    });

    return { success: true, recordId };

  } catch (error) {
    console.error('❌ Failed to save game data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Save game progress (for intermediate saves during gameplay)
 */
export const saveGameProgress = async (
  userId: string,
  gameState: GameState,
  timer: number,
  moduleCases: any[]
): Promise<{ success: boolean; recordId?: string; error?: string }> => {
  try {
    // Prepare cases data for progress save
    const casesData = {
      currentCase: gameState.currentCase,
      caseProgress: moduleCases.slice(0, gameState.currentCase + 1).map((caseItem, index) => ({
        id: caseItem.id,
        answers: {
          violation: index === gameState.currentCase ? gameState.answers.violation : null,
          rootCause: index === gameState.currentCase ? gameState.answers.rootCause : null,
          impact: index === gameState.currentCase ? gameState.answers.impact : null
        },
        isCorrect: index < gameState.currentCase,
        attempts: 1,
        timeSpent: index === gameState.currentCase ? timer : 0
      })),
      scoredQuestions: {}
    };

    // Save progress (not completed yet)
    const recordId = await level4Service.upsertGameDataWithHistory(
      userId,
      gameState.moduleNumber,
      gameState.score,
      false, // Not completed yet
      timer,
      casesData
    );

    console.log('💾 Game progress saved:', {
      recordId,
      userId,
      module: gameState.moduleNumber,
      currentCase: gameState.currentCase,
      score: gameState.score
    });

    return { success: true, recordId };

  } catch (error) {
    console.error('❌ Failed to save game progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Load game progress from Supabase
 */
export const loadGameProgress = async (
  userId: string,
  moduleNumber: number
): Promise<{ success: boolean; gameData?: any; error?: string }> => {
  try {
    const gameData = await level4Service.getUserModuleData(userId, moduleNumber);
    
    if (gameData) {
      console.log('📖 Game progress loaded:', gameData);
      return { success: true, gameData };
    } else {
      console.log('📝 No existing progress found for module', moduleNumber);
      return { success: true, gameData: null };
    }

  } catch (error) {
    console.error('❌ Failed to load game progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Get user's Level 4 statistics
 */
export const getUserStats = async (userId: string) => {
  try {
    const stats = await level4Service.getUserStats(userId);
    console.log('📊 User stats loaded:', stats);
    return { success: true, stats };
  } catch (error) {
    console.error('❌ Failed to load user stats:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Check if user achieved a new high score
 */
export const checkHighScore = async (userId: string, moduleNumber: number, newScore: number) => {
  try {
    const existingData = await level4Service.getUserModuleData(userId, moduleNumber);
    
    if (!existingData || newScore > existingData.score) {
      console.log('🏆 New high score achieved!', { newScore, previousScore: existingData?.score || 0 });
      return { isHighScore: true, previousScore: existingData?.score || 0 };
    }
    
    return { isHighScore: false, previousScore: existingData.score };
  } catch (error) {
    console.error('❌ Failed to check high score:', error);
    return { isHighScore: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Example usage in a React component:
 * 
 * import { saveGameCompletion } from './utils/gameDataSaver';
 * import { useAuth } from '../../../contexts/AuthContext';
 * 
 * const MyGameComponent = () => {
 *   const { user } = useAuth();
 *   
 *   const handleSubmit = async () => {
 *     if (!user) return;
 *     
 *     const result = await saveGameCompletion(
 *       user.id,
 *       gameState,
 *       timer,
 *       moduleCases
 *     );
 *     
 *     if (result.success) {
 *       console.log('Game saved with ID:', result.recordId);
 *       setPopupOpen(true);
 *     } else {
 *       console.error('Save failed:', result.error);
 *     }
 *   };
 * };
 */
