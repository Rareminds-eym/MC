import { supabase } from '../lib/supabase';

export interface Level4CompletionData {
  userId: string;
  moduleId: number;
  score: number;
  time: number;
  violations: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface Level4UserSummary {
  id?: string;
  user_id: string;
  module: number;
  highest_score: number;
  best_time: number;
  total_violations: number;
  total_correct_answers: number;
  total_questions: number;
  completion_count: number;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Save Level 4 game completion data to the level_4_user_summary table
 */
export async function saveLevel4Completion(data: Level4CompletionData): Promise<{ 
  data: any; 
  error: any; 
}> {
  try {
    console.log('Level4GameService: Saving completion data:', data);

    // First, check if a record already exists for this user and module
    const { data: existingData, error: fetchError } = await supabase
      .from('level_4_user_summary')
      .select('*')
      .eq('user_id', data.userId)
      .eq('module', data.moduleId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for first-time users
      console.error('Error fetching existing data:', fetchError);
      return { data: null, error: fetchError };
    }

    let result;

    if (existingData) {
      // Update existing record
      const updatedData: Partial<Level4UserSummary> = {
        highest_score: Math.max(existingData.highest_score || 0, data.score),
        best_time: existingData.best_time ? Math.min(existingData.best_time, data.time) : data.time,
        total_violations: (existingData.total_violations || 0) + data.violations,
        total_correct_answers: (existingData.total_correct_answers || 0) + data.correctAnswers,
        total_questions: (existingData.total_questions || 0) + data.totalQuestions,
        completion_count: (existingData.completion_count || 0) + 1,
        is_completed: true,
        updated_at: new Date().toISOString()
      };

      result = await supabase
        .from('level_4_user_summary')
        .update(updatedData)
        .eq('user_id', data.userId)
        .eq('module', data.moduleId)
        .select()
        .single();

      console.log('Level4GameService: Updated existing record:', result);
    } else {
      // Insert new record
      const newData: Omit<Level4UserSummary, 'id' | 'created_at' | 'updated_at'> = {
        user_id: data.userId,
        module: data.moduleId,
        highest_score: data.score,
        best_time: data.time,
        total_violations: data.violations,
        total_correct_answers: data.correctAnswers,
        total_questions: data.totalQuestions,
        completion_count: 1,
        is_completed: true
      };

      result = await supabase
        .from('level_4_user_summary')
        .insert(newData)
        .select()
        .single();

      console.log('Level4GameService: Inserted new record:', result);
    }

    if (result.error) {
      console.error('Error saving Level 4 completion:', result.error);
      return { data: null, error: result.error };
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error in saveLevel4Completion:', error);
    return { data: null, error };
  }
}

/**
 * Get Level 4 user summary data
 */
export async function getLevel4UserSummary(
  userId: string, 
  moduleId: number
): Promise<{ data: Level4UserSummary | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('level_4_user_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('module', moduleId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching Level 4 summary:', error);
      return { data: null, error };
    }

    return { data: data || null, error: null };
  } catch (error) {
    console.error('Error in getLevel4UserSummary:', error);
    return { data: null, error };
  }
}

/**
 * Check if the given score is a new high score for the user
 */
export async function checkLevel4HighScore(
  userId: string, 
  moduleId: number, 
  score: number
): Promise<{ isHighScore: boolean; error: any }> {
  try {
    const { data, error } = await getLevel4UserSummary(userId, moduleId);
    
    if (error) {
      return { isHighScore: false, error };
    }

    // If no existing data, this is the first score so it's a high score
    if (!data) {
      return { isHighScore: true, error: null };
    }

    // Check if new score is higher than existing high score
    const isHighScore = score > (data.highest_score || 0);
    return { isHighScore, error: null };
  } catch (error) {
    console.error('Error in checkLevel4HighScore:', error);
    return { isHighScore: false, error };
  }
}
