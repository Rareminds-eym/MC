import { createClient, SupabaseClient } from '@supabase/supabase-js';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface Level4GameData {
  id?: string;
  user_id: string;
  module: number;
  level: number;
  score: number;
  time: number;
  time_history: number[];
  score_history: number[];
  cases: Record<string, any>;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Level4ScoreHistory {
  current_score: number;
  previous_score: number;
  past_previous_score: number;
  current_time_value: number;
  previous_time: number;
  past_previous_time: number;
}

export interface Level4Stats {
  total_games: number;
  completed_games: number;
  average_score: number;
  highest_score: number;
  total_modules: number;
  completion_rate: number;
}

export interface Level4Analytics {
  total_modules: number;
  completed_modules: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  total_playtime: number;
  improvement_rate: number;
  completion_rate: number;
}

export interface Level4LeaderboardEntry {
  user_id: string;
  total_score: number;
  average_score: number;
  games_played: number;
  games_completed: number;
  highest_score: number;
  modules_played: number;
  completion_rate: number;
}

export interface Level4ProgressSummary {
  game_data: Level4GameData[];
  statistics: Level4Stats;
  completed_modules: number[];
  progress_summary: {
    modules_attempted: number;
    modules_completed: number;
    best_performance: Level4GameData;
  };
}

// Update interfaces
export interface Level4UpdateData {
  score?: number;
  isCompleted?: boolean;
  time?: number;
  cases?: Record<string, any>;
  updateHistory?: boolean;
}

// =====================================================
// MAIN SERVICE CLASS
// =====================================================

export class Level4Service {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Store score and time for a user and module (creates or updates)
   */
// ...existing code...
// Move the closing brace to the end of the class
// =====================================================
  // READ OPERATIONS
  // =====================================================

  /**
   * Get all level 4 game data for a user
   */
  async getUserGameData(userId: string): Promise<Level4GameData[]> {
    const { data, error } = await this.supabase
      .from('level_4')
      .select('*')
      .eq('user_id', userId)
      .order('module', { ascending: true });

    if (error) {
      throw new Error(`Error fetching user game data: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get specific module data for a user
   */
  async getUserModuleData(userId: string, module: number): Promise<Level4GameData | null> {
    const { data, error } = await this.supabase
      .from('level_4')
      .select('*')
      .eq('user_id', userId)
      .eq('module', module)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching module data: ${error.message}`);
    }

    return data || null;
  }

  /**
   * Get past three scores for a user and module
   */
  async getPastThreeScores(userId: string, module: number): Promise<Level4ScoreHistory> {
    const { data, error } = await this.supabase
      .rpc('get_level4_past_three_scores', {
        p_user_id: userId,
        p_module: module
      });

    if (error) {
      throw new Error(`Error fetching past three scores: ${error.message}`);
    }

    return data && data.length > 0 ? data[0] : {
      current_score: 0,
      previous_score: 0,
      past_previous_score: 0,
      current_time_value: 0,
      previous_time: 0,
      past_previous_time: 0
    };
  }

  /**
   * Get user statistics for level 4
   */
  async getUserStats(userId: string): Promise<Level4Stats> {
    const { data, error } = await this.supabase
      .from('level_4')
      .select('score, is_completed, module')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error fetching user stats: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        total_games: 0,
        completed_games: 0,
        average_score: 0,
        highest_score: 0,
        total_modules: 0,
        completion_rate: 0
      };
    }

    const totalGames = data.length;
    const completedGames = data.filter(game => game.is_completed).length;
    const scores = data.map(game => game.score);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const totalModules = new Set(data.map(game => game.module)).size;
    const completionRate = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;

    return {
      total_games: totalGames,
      completed_games: completedGames,
      average_score: Math.round(averageScore * 100) / 100,
      highest_score: highestScore,
      total_modules: totalModules,
      completion_rate: Math.round(completionRate * 100) / 100
    };
  }

  /**
   * Get advanced user analytics
   */
  async getUserAnalytics(userId: string): Promise<Level4Analytics> {
    const { data, error } = await this.supabase
      .rpc('get_level4_user_analytics', {
        p_user_id: userId
      });

    if (error) {
      throw new Error(`Error fetching user analytics: ${error.message}`);
    }

    return data && data.length > 0 ? data[0] : {
      total_modules: 0,
      completed_modules: 0,
      average_score: 0,
      highest_score: 0,
      lowest_score: 0,
      total_playtime: 0,
      improvement_rate: 0,
      completion_rate: 0
    };
  }

  /**
   * Get completed modules for a user
   */
  async getCompletedModules(userId: string): Promise<number[]> {
    const { data, error } = await this.supabase
      .from('level_4')
      .select('module')
      .eq('user_id', userId)
      .eq('is_completed', true);

    if (error) {
      throw new Error(`Error fetching completed modules: ${error.message}`);
    }

    return data?.map(item => item.module) || [];
  }

  /**
   * Get user progress summary
   */
  async getUserProgress(userId: string): Promise<Level4ProgressSummary> {
    const gameData = await this.getUserGameData(userId);
    const stats = await this.getUserStats(userId);
    const completedModules = await this.getCompletedModules(userId);

    const bestPerformance = gameData.length > 0 
      ? gameData.reduce((best, current) => 
          current.score > best.score ? current : best, 
          gameData[0]
        )
      : { score: 0, module: 0 } as Level4GameData;

    return {
      game_data: gameData,
      statistics: stats,
      completed_modules: completedModules,
      progress_summary: {
        modules_attempted: gameData.length,
        modules_completed: completedModules.length,
        best_performance: bestPerformance
      }
    };
  }

  // =====================================================
  // CREATE/UPSERT OPERATIONS
  // =====================================================

  /**
   * Insert or update game data using the enhanced upsert function
   */
  async upsertGameDataWithHistory(
    userId: string,
    module: number,
    score: number,
    isCompleted: boolean,
    time: number,
    cases: Record<string, any>
  ): Promise<string> {
    const { data, error } = await this.supabase
      .rpc('upsert_level4_game_data_with_history', {
        p_user_id: userId,
        p_module: module,
        p_new_score: score,
        p_is_completed: isCompleted,
        p_new_time: time, // Send as single integer
        p_cases: cases
      });

    if (error) {
      throw new Error(`Error upserting game data: ${error.message}`);
    }

    return data as string;
  }

  /**
   * Insert or update game data using the simple upsert function
   */
  async upsertGameData(
    userId: string,
    module: number,
    score: number,
    isCompleted: boolean,
    time: number,
    cases: Record<string, any>
  ): Promise<string> {
    const { data, error } = await this.supabase
      .rpc('upsert_level4_game_data', {
        p_user_id: userId,
        p_module: module,
        p_new_score: score,
        p_is_completed: isCompleted,
        p_new_time: time, // Send as single integer
        p_cases: cases
      });

    if (error) {
      throw new Error(`Error upserting game data: ${error.message}`);
    }

    return data as string;
  }

  // =====================================================
  // UPDATE OPERATIONS
  // =====================================================

  /**
   * Update specific fields of existing game data
   */
  async updateGameData(
    userId: string,
    module: number,
    updates: {
      score?: number;
      isCompleted?: boolean;
      time?: number;
      cases?: Record<string, any>;
    }
  ): Promise<string> {
    const { data, error } = await this.supabase
      .rpc('update_level4_game_data', {
        p_user_id: userId,
        p_module: module,
        p_score: updates.score || null,
        p_is_completed: updates.isCompleted ?? null,
        p_time: updates.time !== undefined ? updates.time : null, // Send as single integer if present
        p_cases: updates.cases || null
      });

    if (error) {
      throw new Error(`Error updating game data: ${error.message}`);
    }

    return data as string;
  }

  /**
   * Update game data with score history management
   */
  async updateGameDataWithHistory(
    userId: string,
    module: number,
    updates: Level4UpdateData
  ): Promise<string> {
    const { data, error } = await this.supabase
      .rpc('update_level4_game_data_with_history', {
        p_user_id: userId,
        p_module: module,
        p_new_score: updates.score || null,
        p_is_completed: updates.isCompleted ?? null,
        p_new_time: updates.time !== undefined ? updates.time : null, // Send as single integer if present
        p_cases: updates.cases || null,
        p_update_history: updates.updateHistory ?? true
      });

    if (error) {
      throw new Error(`Error updating game data with history: ${error.message}`);
    }

    return data as string;
  }

  /**
   * Update only completion status
   */
  async updateCompletionStatus(
    userId: string,
    module: number,
    isCompleted: boolean
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .rpc('update_level4_completion_status', {
        p_user_id: userId,
        p_module: module,
        p_is_completed: isCompleted
      });

    if (error) {
      throw new Error(`Error updating completion status: ${error.message}`);
    }

    return data as boolean;
  }

  /**
   * Update only cases data
   */
  async updateCases(
    userId: string,
    module: number,
    cases: Record<string, any>
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .rpc('update_level4_cases', {
        p_user_id: userId,
        p_module: module,
        p_cases: cases
      });

    if (error) {
      throw new Error(`Error updating cases: ${error.message}`);
    }

    return data as boolean;
  }

  /**
   * Bulk update completion status for multiple modules
   */
  async bulkUpdateCompletion(
    userId: string,
    modules: number[],
    isCompleted: boolean
  ): Promise<number> {
    const { data, error } = await this.supabase
      .rpc('bulk_update_level4_completion', {
        p_user_id: userId,
        p_modules: modules,
        p_is_completed: isCompleted
      });

    if (error) {
      throw new Error(`Error bulk updating completion: ${error.message}`);
    }

    return data as number;
  }

  /**
   * Update using direct Supabase update (alternative approach)
   */
  async directUpdate(
    userId: string,
    module: number,
    updates: Partial<Level4GameData>
  ): Promise<Level4GameData> {
    const { data, error } = await this.supabase
      .from('level_4')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('module', module)
      .select()
      .single();

    if (error) {
      throw new Error(`Error in direct update: ${error.message}`);
    }

    return data;
  }
  async incrementScore(
    userId: string,
    module: number,
    scoreIncrement: number
  ): Promise<Level4GameData> {
    const currentData = await this.getUserModuleData(userId, module);
    if (!currentData) {
      throw new Error(`No game data found for user ${userId} and module ${module}`);
    }
    const newScore = currentData.score + scoreIncrement;
    await this.updateGameDataWithHistory(userId, module, {
      score: newScore,
      updateHistory: true
    });
    return await this.getUserModuleData(userId, module) as Level4GameData;
  }

  /**
   * Reset score history (keep only current score)
   */
  async resetScoreHistory(userId: string, module: number): Promise<boolean> {
    const currentData = await this.getUserModuleData(userId, module);
    
    if (!currentData) {
      throw new Error(`No game data found for user ${userId} and module ${module}`);
    }

    const { error } = await this.supabase
      .from('level_4')
      .update({
        score_history: [currentData.score],
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('module', module);

    if (error) {
      throw new Error(`Error resetting score history: ${error.message}`);
    }

    return true;
  }

  /**
   * Update multiple fields atomically
   */
  async atomicUpdate(
    userId: string,
    module: number,
    updates: {
      score?: number;
      isCompleted?: boolean;
      time?: number;
      cases?: Record<string, any>;
      scoreHistory?: number[];
    }
  ): Promise<Level4GameData> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.score !== undefined) updateData.score = updates.score;
    if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted;
    if (updates.time !== undefined) updateData.time = updates.time;
    if (updates.cases !== undefined) updateData.cases = updates.cases;
    if (updates.scoreHistory !== undefined) updateData.score_history = updates.scoreHistory;

    const { data, error } = await this.supabase
      .from('level_4')
      .update(updateData)
      .eq('user_id', userId)
      .eq('module', module)
      .select()
      .single();

    if (error) {
      throw new Error(`Error in atomic update: ${error.message}`);
    }

    return data;
  }

  // =====================================================
  // LEADERBOARD OPERATIONS
  // =====================================================

  /**
   * Get leaderboard for a specific module
   */
  async getModuleLeaderboard(module: number, limit: number = 10): Promise<Level4GameData[]> {
    const { data, error } = await this.supabase
      .from('level_4')
      .select('*')
      .eq('module', module)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error fetching module leaderboard: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get overall leaderboard across all modules
   */
  async getOverallLeaderboard(limit: number = 10): Promise<Level4LeaderboardEntry[]> {
    const { data, error } = await this.supabase
      .from('level_4')
      .select('user_id, score, module, is_completed')
      .order('score', { ascending: false })
      .limit(limit * 3);

    if (error) {
      throw new Error(`Error fetching overall leaderboard: ${error.message}`);
    }

    if (!data) return [];

    const userStats = data.reduce((acc, game) => {
      if (!acc[game.user_id]) {
        acc[game.user_id] = {
          user_id: game.user_id,
          total_score: 0,
          games_played: 0,
          games_completed: 0,
          highest_score: 0,
          modules: new Set()
        };
      }

      acc[game.user_id].total_score += game.score;
      acc[game.user_id].games_played++;
      acc[game.user_id].modules.add(game.module);
      
      if (game.is_completed) {
        acc[game.user_id].games_completed++;
      }
      
      if (game.score > acc[game.user_id].highest_score) {
        acc[game.user_id].highest_score = game.score;
      }

      return acc;
    }, {} as Record<string, any>);

    return Object.values(userStats)
      .map((user: any) => ({
        user_id: user.user_id,
        total_score: user.total_score,
        average_score: user.games_played > 0 ? Math.round((user.total_score / user.games_played) * 100) / 100 : 0,
        games_played: user.games_played,
        games_completed: user.games_completed,
        highest_score: user.highest_score,
        modules_played: user.modules.size,
        completion_rate: user.games_played > 0 ? Math.round((user.games_completed / user.games_played) * 100) : 0
      }))
      .sort((a, b) => b.highest_score - a.highest_score)
      .slice(0, limit);
  }

  // =====================================================
  // DELETE OPERATIONS
  // =====================================================

  /**
   * Delete user's game data for a specific module
   */
  async deleteModuleData(userId: string, module: number): Promise<void> {
    const { error } = await this.supabase
      .from('level_4')
      .delete()
      .eq('user_id', userId)
      .eq('module', module);

    if (error) {
      throw new Error(`Error deleting module data: ${error.message}`);
    }
  }

  /**
   * Delete all user's level 4 game data
   */
  async deleteAllUserData(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('level_4')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error deleting user data: ${error.message}`);
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Check if user has completed a specific module
   */
  async isModuleCompleted(userId: string, module: number): Promise<boolean> {
    const data = await this.getUserModuleData(userId, module);
    return data ? data.is_completed : false;
  }

  /**
   * Get user's best score for a module
   */
  async getBestScore(userId: string, module: number): Promise<number> {
    const data = await this.getUserModuleData(userId, module);
    return data ? data.score : 0;
  }

  /**
   * Get user's completion percentage across all modules
   */
  async getOverallCompletionRate(userId: string): Promise<number> {
    const stats = await this.getUserStats(userId);
    return stats.completion_rate;
  }

  /**
   * Get modules that user has not attempted yet
   */
  async getUnattemptedModules(userId: string, totalModules: number): Promise<number[]> {
    const gameData = await this.getUserGameData(userId);
    const attemptedModules = new Set(gameData.map(data => data.module));
    
    const unattempted: number[] = [];
    for (let i = 1; i <= totalModules; i++) {
      if (!attemptedModules.has(i)) {
        unattempted.push(i);
      }
    }
    
    return unattempted;
  }

  /**
   * Get recent activity for a user
   */
  async getRecentActivity(userId: string, limit: number = 5): Promise<Level4GameData[]> {
    const { data, error } = await this.supabase
      .from('level_4')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error fetching recent activity: ${error.message}`);
    }

    return data || [];
  }
}
// =====================================================


// =====================================================