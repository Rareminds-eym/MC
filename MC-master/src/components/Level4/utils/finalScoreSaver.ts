/**
 * Final Score Saver Utility
 * 
 * This utility provides a clean way to save the final game score
 * without duplicate entries in the score history.
 */

import level4Service from '../services';
import type { GameState } from '../types';

/**
 * Save the final game score with clean score history
 * This ensures the score_history only contains the final score, not intermediate scores
 */
export const saveFinalScore = async (
  userId: string,
  gameState: GameState,
  timer: number,
  moduleCases: any[]
): Promise<{ success: boolean; recordId?: string; error?: string }> => {
  try {
    console.log('💾 Saving final score with clean history:', {
      userId,
      module: gameState.moduleNumber,
      finalScore: gameState.score,
      timer
    });

    // Prepare final cases data
    const casesData = {
      currentCase: gameState.currentCase,
      caseProgress: moduleCases.map((caseItem, index) => ({
        id: caseItem.id,
        answers: index <= gameState.currentCase ? gameState.answers : { violation: null, rootCause: null, impact: null },
        isCorrect: index <= gameState.currentCase,
        attempts: 1,
        timeSpent: index === gameState.currentCase ? timer : 0
      })),
      scoredQuestions: {
        [gameState.currentCase]: ["violation", "rootCause", "impact"]
      }
    };

    // Step 1: Use direct update to set the final score and clean score history
    const updateData = {
      score: gameState.score,
      time: timer, // Single integer as expected by new database schema
      time_history: [timer], // Time history array
      score_history: [gameState.score], // Clean history with only final score
      cases: casesData,
      is_completed: true,
      updated_at: new Date().toISOString()
    };

    // Try to update existing record first
    try {
      const updatedRecord = await level4Service.directUpdate(
        userId,
        gameState.moduleNumber || 1,
        updateData
      );
      
      console.log('✅ Final score saved with clean history (update):', {
        recordId: updatedRecord.id,
        score: updatedRecord.score,
        scoreHistory: updatedRecord.score_history
      });
      
      return { success: true, recordId: updatedRecord.id };
      
    } catch (updateError) {
      // If update fails (no existing record), create new one
      console.log('ℹ️ No existing record, creating new one');
      
      const recordId = await level4Service.upsertGameDataWithHistory(
        userId,
        gameState.moduleNumber || 1,
        gameState.score,
        true,
        timer,
        casesData
      );
      
      // Now fix the score history to only contain the final score
      await level4Service.atomicUpdate(
        userId,
        gameState.moduleNumber || 1,
        {
          scoreHistory: [gameState.score] // Clean history with only final score
        }
      );
      
      console.log('✅ Final score saved with clean history (new):', recordId);
      return { success: true, recordId };
    }

  } catch (error) {
    console.error('❌ Failed to save final score:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Save final score with proper top 3 score history management
 */
export const saveFinalScoreClean = async (
  userId: string,
  gameState: GameState,
  timer: number,
  moduleCases: any[]
): Promise<{ success: boolean; recordId?: string; error?: string }> => {
  try {
    console.log('🏆 Saving final score with top 3 score history management');

    // Prepare cases data
    const casesData = {
      currentCase: gameState.currentCase,
      caseProgress: moduleCases.map((caseItem, index) => ({
        id: caseItem.id,
        answers: index <= gameState.currentCase ? gameState.answers : { violation: null, rootCause: null, impact: null },
        isCorrect: index <= gameState.currentCase,
        attempts: 1,
        timeSpent: index === gameState.currentCase ? timer : 0
      })),
      scoredQuestions: {
        [gameState.currentCase]: ["violation", "rootCause", "impact"]
      }
    };

    const { supabase } = await import('../../../lib/supabase');

    // Get existing data to manage score history
    const { data: existingData } = await supabase
      .from('level_4')
      .select('*')
      .eq('user_id', userId)
      .eq('module', gameState.moduleNumber || 1)
      .single();

    // Calculate new score history (top 3 scores) and corresponding time history
    let newScoreHistory: number[] = [];
    let newTimeHistory: number[] = [];

    if (existingData && existingData.score_history) {
      // Add new score to existing history
      const currentHistory = Array.isArray(existingData.score_history)
        ? existingData.score_history
        : [];
      const currentTimeHistory = Array.isArray(existingData.time_history)
        ? existingData.time_history
        : [];

      // Add the new score and time
      const allScores = [...currentHistory, gameState.score];
      const allTimes = [...currentTimeHistory, timer];

      // Create score-time pairs and sort by score descending
      const scorePairs = allScores.map((score, index) => ({
        score,
        time: allTimes[index] || timer
      }));

      // Remove duplicate scores and sort by score descending
      const uniquePairs = scorePairs
        .filter((pair, index, arr) =>
          arr.findIndex(p => p.score === pair.score) === index
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Keep only top 3

      newScoreHistory = uniquePairs.map(p => p.score);
      newTimeHistory = uniquePairs.map(p => p.time);
    } else {
      // First time playing this module
      newScoreHistory = [gameState.score];
      newTimeHistory = [timer];
    }

    // The main score should be the highest score from history
    const highestScore = Math.max(...newScoreHistory);
    const highestScoreTime = newTimeHistory[newScoreHistory.indexOf(highestScore)];

    const updateData = {
      score: highestScore, // Always the highest score from history
      time: highestScoreTime, // Time corresponding to highest score
      time_history: newTimeHistory, // Aligned time history
      score_history: newScoreHistory, // Top 3 unique scores
      cases: casesData,
      is_completed: true,
      updated_at: new Date().toISOString()
    };

    console.log('📊 Score-Time history calculation:', {
      newScore: gameState.score,
      newTime: timer,
      existingScoreHistory: existingData?.score_history || [],
      existingTimeHistory: existingData?.time_history || [],
      newScoreHistory: newScoreHistory,
      newTimeHistory: newTimeHistory,
      highestScore,
      highestScoreTime
    });

    let result;
    if (existingData) {
      // Update existing record
      result = await supabase
        .from('level_4')
        .update(updateData)
        .eq('user_id', userId)
        .eq('module', gameState.moduleNumber || 1)
        .select()
        .single();
    } else {
      // Insert new record
      result = await supabase
        .from('level_4')
        .insert([{
          user_id: userId,
          module: gameState.moduleNumber || 1,
          level: 4,
          ...updateData
        }])
        .select()
        .single();
    }

    if (result.error) {
      throw new Error(`Database operation failed: ${result.error.message}`);
    }

    console.log('✅ Final score saved with aligned score-time history:', {
      recordId: result.data.id,
      mainScore: result.data.score,
      mainTime: result.data.time,
      scoreHistory: result.data.score_history,
      timeHistory: result.data.time_history,
      isNewHighScore: gameState.score === highestScore
    });

    return {
      success: true,
      recordId: result.data.id,
      isNewHighScore: gameState.score === highestScore
    };

  } catch (error) {
    console.error('❌ Failed to save final score with top 3 history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Clean up duplicate score history entries
 */
export const cleanupScoreHistory = async (
  userId: string,
  moduleNumber: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🧹 Cleaning up duplicate score history entries');

    const { supabase } = await import('../../../lib/supabase');

    // Get current data
    const { data: currentData, error: fetchError } = await supabase
      .from('level_4')
      .select('*')
      .eq('user_id', userId)
      .eq('module', moduleNumber)
      .single();

    if (fetchError || !currentData) {
      return { success: false, error: 'No data found to clean' };
    }

    // Clean the score history - keep only the highest score
    const cleanHistory = currentData.score_history && currentData.score_history.length > 0
      ? [Math.max(...currentData.score_history)]
      : [currentData.score];

    // Update with clean history
    const { error: updateError } = await supabase
      .from('level_4')
      .update({
        score_history: cleanHistory,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('module', moduleNumber);

    if (updateError) {
      throw new Error(`Failed to clean history: ${updateError.message}`);
    }

    console.log('✅ Score history cleaned:', {
      oldHistory: currentData.score_history,
      newHistory: cleanHistory
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Failed to clean score history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Verify the saved score and history (top 3 scores logic)
 */
export const verifyFinalScore = async (
  userId: string,
  moduleNumber: number,
  expectedHighestScore?: number
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const savedData = await level4Service.getUserModuleData(userId, moduleNumber);

    if (!savedData) {
      return { success: false, error: 'No data found' };
    }

    // Verify top 3 scores logic
    const scoreHistory = savedData.score_history || [];
    const mainScore = savedData.score;

    // Check if score history is properly sorted (descending)
    const isSorted = scoreHistory.every((score, index) =>
      index === 0 || scoreHistory[index - 1] >= score
    );

    // Check if main score equals the highest score in history
    const highestInHistory = scoreHistory.length > 0 ? Math.max(...scoreHistory) : mainScore;
    const mainScoreCorrect = mainScore === highestInHistory;

    // Check if history has at most 3 entries
    const historyLengthCorrect = scoreHistory.length <= 3;

    // Check if no duplicates in history
    const noDuplicates = scoreHistory.length === new Set(scoreHistory).size;

    const isCorrect = isSorted && mainScoreCorrect && historyLengthCorrect && noDuplicates;

    console.log('🔍 Top 3 Score verification:', {
      mainScore,
      scoreHistory,
      highestInHistory,
      isSorted,
      mainScoreCorrect,
      historyLengthCorrect,
      noDuplicates,
      isCorrect,
      expectedHighestScore
    });

    return {
      success: isCorrect,
      data: {
        score: savedData.score,
        scoreHistory: savedData.score_history,
        isCompleted: savedData.is_completed,
        time: savedData.time,
        analysis: {
          isSorted,
          mainScoreCorrect,
          historyLengthCorrect,
          noDuplicates,
          highestInHistory
        }
      },
      error: isCorrect ? undefined : 'Score history validation failed'
    };

  } catch (error) {
    console.error('❌ Failed to verify score:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
