import { supabase } from '../../../lib/supabase';
import { Level2GameData, Level2GameStats, Level2ScoreHistory, Level2GameDataWithHistory } from '../../../types/Level2/types';

/**
 * Level2GameService - Handles all database operations for Level 2 game data
 * 
 * Key Features:
 * - UPSERT functionality: If user data exists for a module/game mode, it updates; otherwise inserts
 * - Duplicate save prevention with debouncing
 * - Comprehensive error handling
 * - Statistics calculation and completion tracking
 * 
 * The service uses the upsert_level2_game_data database function to ensure
 * that only one record exists per user, module, level, and game mode combination.
 */
export class Level2GameService {
  private static readonly LEVEL_NUMBER = 2;
  private static lastSaveTimestamp: Map<string, number> = new Map();
  private static readonly SAVE_DEBOUNCE_MS = 1000; // Prevent saves within 1 second of each other

  /**
   * Save game progress to the database (UPSERT: insert or update if exists)
   */
  static async saveGameData(gameData: Omit<Level2GameData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ data: Level2GameData | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Create a unique key for this save operation
      const saveKey = `${userData.user.id}-${gameData.module_id}-${gameData.game_mode_id}`;
      const now = Date.now();
      const lastSave = this.lastSaveTimestamp.get(saveKey) || 0;

      // Check if we're trying to save too quickly (potential duplicate)
      if (now - lastSave < this.SAVE_DEBOUNCE_MS) {
        console.warn('Duplicate save attempt detected, skipping save');
        return { data: null, error: new Error('Duplicate save prevented') };
      }

      // Update the timestamp
      this.lastSaveTimestamp.set(saveKey, now);

      console.log(`Saving game data with game_mode_id: ${gameData.game_mode_id}`);

      // Use the new UPSERT function that merges game_mode_ids arrays
      const { data, error } = await supabase.rpc('upsert_level2_game_data_with_merge', {
        p_user_id: userData.user.id,
        p_module_id: gameData.module_id,
        p_level_number: gameData.level_number || this.LEVEL_NUMBER,
        p_game_mode_ids: [gameData.game_mode_id], // Pass as single-item array, DB function will merge
        p_score: gameData.score,
        p_is_completed: gameData.is_completed,
        p_time: gameData.time,
        p_total_terms: gameData.total_terms,
        p_placed_terms: gameData.placed_terms
      });

      if (error) {
        return { data: null, error };
      }

      // Fetch the updated/inserted record to return full data
      const { data: fullData, error: fetchError2 } = await supabase
        .from('level2_game_data')
        .select('*')
        .eq('id', data)
        .single();

      return { data: fullData, error: fetchError2 };
    } catch (error) {
      console.error('Error saving Level2 game data:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update existing game progress
   * WARNING: This method bypasses the UPSERT functions and should be used carefully.
   * It will NOT merge game_mode_ids arrays - use saveGameData() or upsertGameData() instead.
   */
  static async updateGameData(id: string, gameData: Partial<Level2GameData>): Promise<{ data: Level2GameData | null; error: Error | null }> {
    try {
      // Prevent accidental overwriting of game_mode_ids array
      if (gameData.game_mode_ids) {
        console.warn('WARNING: updateGameData() does not merge game_mode_ids arrays. Use saveGameData() or upsertGameData() instead.');
        console.warn('Removing game_mode_ids from update to prevent data loss.');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { game_mode_ids, ...safeGameData } = gameData;
        gameData = safeGameData;
      }

      const { data, error } = await supabase
        .from('level2_game_data')
        .update(gameData)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating Level2 game data:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Upsert game data using the database function (more reliable for concurrent access)
   * This method uses the new upsert_level2_game_data_with_merge database function
   */
  static async upsertGameData(gameData: Omit<Level2GameData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ data: Level2GameData | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Use the new database UPSERT function that merges arrays
      const { data: recordId, error } = await supabase.rpc('upsert_level2_game_data_with_merge', {
        p_user_id: userData.user.id,
        p_module_id: gameData.module_id,
        p_level_number: gameData.level_number || this.LEVEL_NUMBER,
        p_game_mode_ids: [gameData.game_mode_id], // Convert to array, DB function will merge
        p_score: gameData.score,
        p_is_completed: gameData.is_completed,
        p_time: gameData.time,
        p_total_terms: gameData.total_terms,
        p_placed_terms: gameData.placed_terms
      });

      if (error) {
        return { data: null, error };
      }

      // Fetch the complete record
      const { data: fullData, error: fetchError } = await supabase
        .from('level2_game_data')
        .select('*')
        .eq('id', recordId)
        .single();

      return { data: fullData, error: fetchError };
    } catch (error) {
      console.error('Error upserting Level2 game data:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get user's game progress for a specific module and game mode
   */
  static async getUserGameData(moduleId: string, gameModeId: string): Promise<{ data: Level2GameData[] | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('level2_game_data')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('module_id', moduleId)
        .eq('level_number', this.LEVEL_NUMBER)
        .contains('game_mode_ids', [gameModeId]) // Use contains for array field
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching Level2 game data:', error);
      return { data: null, error: error as Error };
    }
  }



  /**
   * Get user's best score for a specific module and game mode
   */
  static async getBestScore(moduleId: string, gameModeId: string): Promise<{ data: Level2GameData | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('level2_game_data')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('module_id', moduleId)
        .eq('level_number', this.LEVEL_NUMBER)
        .contains('game_mode_ids', [gameModeId]) // Use contains for array field
        .order('score', { ascending: false })
        .limit(1)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error fetching best score:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get comprehensive game statistics for the user
   */
  static async getGameStats(moduleId: string, gameModeId: string): Promise<{ data: Level2GameStats | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data: games, error } = await supabase
        .from('level2_game_data')
        .select('score, time, is_completed, created_at')
        .eq('user_id', userData.user.id)
        .eq('module_id', moduleId)
        .eq('level_number', this.LEVEL_NUMBER)
        .contains('game_mode_ids', [gameModeId]); // Use contains for array field

      if (error || !games || games.length === 0) {
        return {
          data: {
            highScore: 0,
            totalGamesPlayed: 0,
            bestTime: 0,
            lastPlayedDate: '',
            perfectGames: 0,
            averageScore: 0,
          },
          error,
        };
      }

      const stats: Level2GameStats = {
        highScore: Math.max(...games.map(g => g.score)),
        totalGamesPlayed: games.length,
        bestTime: Math.min(...games.filter(g => g.time).map(g => g.time!)),
        lastPlayedDate: games[0].created_at || '',
        perfectGames: games.filter(g => g.score === 100).length,
        averageScore: Math.round(games.reduce((sum, g) => sum + g.score, 0) / games.length),
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error calculating game stats:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Check if user has completed this level for a specific module and game mode
   */
  static async hasCompletedLevel(moduleId: string, gameModeId: string): Promise<{ data: boolean; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('level2_game_data')
        .select('id')
        .eq('user_id', userData.user.id)
        .eq('module_id', moduleId)
        .eq('level_number', this.LEVEL_NUMBER)
        .contains('game_mode_ids', [gameModeId]) // Use contains for array field
        .eq('is_completed', true)
        .limit(1);

      return { data: !!(data && data.length > 0), error };
    } catch (error) {
      console.error('Error checking completion status:', error);
      return { data: false, error: error as Error };
    }
  }

  /**
   * Delete all game data for a user (for testing or reset purposes)
   */
  static async deleteUserGameData(moduleId?: string, gameModeId?: string): Promise<{ error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('level2_game_data')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('level_number', this.LEVEL_NUMBER);

      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }

      if (gameModeId) {
        query = query.contains('game_mode_ids', [gameModeId]); // Use contains for array field
      }

      const { error } = await query;
      return { error };
    } catch (error) {
      console.error('Error deleting game data:', error);
      return { error: error as Error };
    }
  }

  /**
   * Mark a level as completed for a specific module and game mode
   */
  static async markLevelCompleted(moduleId: string, gameModeId: string): Promise<{ error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Update all game records for this user, module, and game mode to mark as completed
      const { error } = await supabase
        .from('level2_game_data')
        .update({ is_completed: true })
        .eq('user_id', userData.user.id)
        .eq('module_id', moduleId)
        .eq('level_number', this.LEVEL_NUMBER)
        .contains('game_mode_ids', [gameModeId]); // Use contains for array field

      return { error };
    } catch (error) {
      console.error('Error marking level as completed:', error);
      return { error: error as Error };
    }
  }

  /**
   * Track game mode progression by saving only the game mode ID to the database
   * This is called when a user completes a game mode and clicks "Continue To Next"
   * It ensures all completed game mode IDs are tracked in the database array
   * This method is careful to preserve existing score/time data while only adding the game mode ID
   */
  static async trackGameModeProgression(moduleId: string, gameModeId: string): Promise<{ error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      console.log(`Tracking game mode progression: ${gameModeId} for module ${moduleId}`);

      // First, check if a record already exists for this user/module/level
      const { data: existingData, error: fetchError } = await supabase
        .from('level2_game_data')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('module_id', moduleId)
        .eq('level_number', this.LEVEL_NUMBER)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching existing data:', fetchError);
        return { error: fetchError };
      }

      if (existingData) {
        // Record exists - just add the game mode ID to the array if not already present
        const currentGameModeIds = existingData.game_mode_ids || [];
        if (!currentGameModeIds.includes(gameModeId)) {
          const updatedGameModeIds = [...currentGameModeIds, gameModeId];

          const { error: updateError } = await supabase
            .from('level2_game_data')
            .update({
              game_mode_ids: updatedGameModeIds,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingData.id);

          if (updateError) {
            console.error('Error updating game mode IDs:', updateError);
            return { error: updateError };
          }

          console.log(`Successfully added ${gameModeId} to existing record. Game mode IDs: [${updatedGameModeIds.join(', ')}]`);
        } else {
          console.log(`Game mode ${gameModeId} already tracked in existing record`);
        }
      } else {
        // No record exists - create a new one with minimal data
        const { error: insertError } = await supabase.rpc('upsert_level2_game_data_with_merge', {
          p_user_id: userData.user.id,
          p_module_id: moduleId,
          p_level_number: this.LEVEL_NUMBER,
          p_game_mode_ids: [gameModeId], // This will be merged with existing IDs
          p_score: 0, // Placeholder score - actual scores are saved later in batch
          p_is_completed: false, // Not fully completed until all game modes are done
          p_time: 0, // Placeholder time
          p_total_terms: 0, // Placeholder
          p_placed_terms: []
        });

        if (insertError) {
          console.error('Error creating new record for game mode progression:', insertError);
          return { error: insertError };
        }

        console.log(`Successfully created new record with game mode progression: ${gameModeId}`);
      }

      return { error: null };
    } catch (error) {
      console.error('Error in trackGameModeProgression:', error);
      return { error: error as Error };
    }
  }

  /**
   * Save game data with aggregated score history management using the enhanced UPSERT function
   * This method uses the upsert_level2_game_data_with_history function that aggregates scores
   * across all game modes and manages score arrays with combined totals
   */
  static async saveGameDataWithHistory(gameData: Omit<Level2GameData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ data: Level2GameData | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Create a unique key for this save operation
      const saveKey = `${userData.user.id}-${gameData.module_id}-${gameData.game_mode_id}`;
      const now = Date.now();
      const lastSave = this.lastSaveTimestamp.get(saveKey) || 0;

      // Check if we're trying to save too quickly (potential duplicate)
      if (now - lastSave < this.SAVE_DEBOUNCE_MS) {
        console.warn('Duplicate save attempt detected, skipping save');
        return { data: null, error: new Error('Duplicate save prevented') };
      }

      // Update the timestamp
      this.lastSaveTimestamp.set(saveKey, now);

      // Use the enhanced UPSERT function with history management
      const { data, error } = await supabase.rpc('upsert_level2_game_data_with_history', {
        p_user_id: userData.user.id,
        p_module_id: gameData.module_id,
        p_level_number: gameData.level_number || this.LEVEL_NUMBER,
        p_game_mode_ids: [gameData.game_mode_id], // Convert to array as expected by database function
        p_score: gameData.score,
        p_is_completed: gameData.is_completed,
        p_time: gameData.time || 0,
        p_total_terms: gameData.total_terms,
        p_placed_terms: gameData.placed_terms
      });

      if (error) {
        return { data: null, error };
      }

      // Fetch the updated/inserted record to return full data
      const { data: fullData, error: fetchError } = await supabase
        .from('level2_game_data')
        .select('*')
        .eq('id', data)
        .single();

      return { data: fullData, error: fetchError };
    } catch (error) {
      console.error('Error saving Level2 game data with history:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get the past three aggregated scores for a user, module, and level
   * Uses the get_level2_past_three_scores database function which now returns
   * aggregated scores across all game modes instead of individual game mode scores
   */
  static async getPastThreeScores(moduleId: string, gameModeId: string): Promise<{ data: Level2ScoreHistory | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('get_level2_past_three_scores', {
        p_user_id: userData.user.id,
        p_module_id: moduleId,
        p_level_number: this.LEVEL_NUMBER,
        p_game_mode_id: gameModeId
      });

      if (error) {
        return { data: null, error };
      }

      // The function returns an array, but we expect only one result
      const scoreHistory = data && data.length > 0 ? data[0] : null;
      return { data: scoreHistory, error: null };
    } catch (error) {
      console.error('Error fetching past three scores:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get user's game data with aggregated score history arrays
   * Returns data with score_history and time_history containing aggregated totals across all game modes
   */
  static async getUserGameDataWithHistory(moduleId: string, gameModeId?: string): Promise<{ data: Level2GameDataWithHistory | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('level2_game_data')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('module_id', moduleId)
        .eq('level_number', this.LEVEL_NUMBER)
        // Removed game_mode_id filter since we now store aggregated data across all game modes
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error fetching Level2 game data with history:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all completed game mode IDs for a user in a specific module
   * Returns an array of game mode IDs that the user has completed
   */
  static async getCompletedGameModeIds(moduleId: string): Promise<{ data: string[] | null; error: Error | null }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('level2_game_data')
        .select('game_mode_ids')
        .eq('user_id', userData.user.id)
        .eq('module_id', moduleId)
        .eq('level_number', this.LEVEL_NUMBER)
        .eq('is_completed', true);

      if (error) {
        return { data: null, error };
      }

      // Flatten all game_mode_ids arrays into a single array of unique IDs
      const completedGameModeIds = new Set<string>();
      if (data && data.length > 0) {
        data.forEach(record => {
          if (record.game_mode_ids && Array.isArray(record.game_mode_ids)) {
            record.game_mode_ids.forEach(id => completedGameModeIds.add(id));
          }
        });
      }

      return { data: Array.from(completedGameModeIds), error: null };
    } catch (error) {
      console.error('Error fetching completed game mode IDs:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Clear save debounce cache (useful for testing or when starting a new game session)
   */
  static clearSaveCache(): void {
    this.lastSaveTimestamp.clear();
  }

  /**
   * Test the UPSERT functionality (for development/testing purposes)
   */
  static async testUpsert(moduleId: string, gameModeId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { success: false, message: 'User not authenticated' };
      }

      // First save
      const gameData1 = {
        module_id: moduleId,
        level_number: this.LEVEL_NUMBER,
        game_mode_id: gameModeId,
        score: 50,
        is_completed: false,
        time: 120,
        total_terms: 10,
        placed_terms: []
      };

      const { error: error1 } = await this.saveGameData(gameData1);
      if (error1) {
        return { success: false, message: `First save failed: ${error1.message}` };
      }

      // Second save (should update, not create new record)
      const gameData2 = {
        ...gameData1,
        score: 85,
        is_completed: true,
        time: 90
      };

      const { error: error2 } = await this.saveGameData(gameData2);
      if (error2) {
        return { success: false, message: `Second save failed: ${error2.message}` };
      }

      // Verify only one record exists
      const { data: allRecords, error: fetchError } = await this.getUserGameData(moduleId, gameModeId);
      if (fetchError) {
        return { success: false, message: `Fetch verification failed: ${fetchError.message}` };
      }

      if (!allRecords || allRecords.length !== 1) {
        return { success: false, message: `Expected 1 record, found ${allRecords?.length || 0}` };
      }

      const record = allRecords[0];
      if (record.score !== 85 || !record.is_completed) {
        return { success: false, message: 'Record was not updated correctly' };
      }

      return {
        success: true,
        message: `UPSERT test passed! Record ID: ${record.id}, Score updated from 50 to 85`
      };
    } catch (error) {
      return { success: false, message: `Test failed with error: ${error}` };
    }
  }

  /**
   * Test the UPSERT with aggregated history functionality (for development/testing purposes)
   * Tests that scores from different game modes are properly aggregated
   */
  static async testUpsertWithHistory(moduleId: string, gameModeId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { success: false, message: 'User not authenticated' };
      }

      // Clear any existing data for clean test
      await this.deleteUserGameData(moduleId, gameModeId);

      // First save - score 50 (will be the initial total)
      const gameData1 = {
        module_id: moduleId,
        level_number: this.LEVEL_NUMBER,
        game_mode_id: gameModeId,
        score: 50,
        is_completed: false,
        time: 120,
        total_terms: 10,
        placed_terms: []
      };

      const { error: error1 } = await this.saveGameDataWithHistory(gameData1);
      if (error1) {
        return { success: false, message: `First save failed: ${error1.message}` };
      }

      // Second save - score 75 (will aggregate: 50 + 75 = 125)
      const gameData2 = {
        ...gameData1,
        score: 75,
        time: 100
      };

      const { error: error2 } = await this.saveGameDataWithHistory(gameData2);
      if (error2) {
        return { success: false, message: `Second save failed: ${error2.message}` };
      }

      // Third save - score 90 (will aggregate: 125 + 90 = 215)
      const gameData3 = {
        ...gameData1,
        score: 90,
        is_completed: true,
        time: 80
      };

      const { error: error3 } = await this.saveGameDataWithHistory(gameData3);
      if (error3) {
        return { success: false, message: `Third save failed: ${error3.message}` };
      }

      // Test the score history retrieval
      const { data: scoreHistory, error: historyError } = await this.getPastThreeScores(moduleId, gameModeId);
      if (historyError) {
        return { success: false, message: `Score history fetch failed: ${historyError.message}` };
      }

      if (!scoreHistory) {
        return { success: false, message: 'No score history returned' };
      }

      // Verify the aggregated scores are in descending order (highest first)
      const expectedScores = [215, 125, 50]; // Should be aggregated totals sorted by score DESC
      const actualScores = [
        scoreHistory.current_score,
        scoreHistory.previous_score,
        scoreHistory.past_previous_score
      ].filter(score => score !== null && score !== undefined);

      if (actualScores.length !== 3) {
        return { success: false, message: `Expected 3 scores in history, got ${actualScores.length}` };
      }

      const scoresMatch = actualScores.every((score, index) => score === expectedScores[index]);
      if (!scoresMatch) {
        return {
          success: false,
          message: `Score history mismatch. Expected: [${expectedScores.join(', ')}], Got: [${actualScores.join(', ')}]`
        };
      }

      return {
        success: true,
        message: `Aggregated history UPSERT test passed! Aggregated score history: [${actualScores.join(', ')}]`
      };
    } catch (error) {
      return { success: false, message: `History test failed with error: ${error}` };
    }
  }

}
