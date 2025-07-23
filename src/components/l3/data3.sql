-- ==========================================
-- ✅ LEVEL 3 PROGRESS - COMPLETE MIGRATION SCRIPT
-- ==========================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Conditionally add missing columns
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level3_progress' AND column_name = 'level_number'
    ) THEN
        ALTER TABLE level3_progress ADD COLUMN level_number INTEGER NOT NULL DEFAULT 1;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level3_progress' AND column_name = 'scenario_index'
    ) THEN
        ALTER TABLE level3_progress ADD COLUMN scenario_index INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level3_progress' AND column_name = 'current_score'
    ) THEN
        ALTER TABLE level3_progress ADD COLUMN current_score INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level3_progress' AND column_name = 'current_health'
    ) THEN
        ALTER TABLE level3_progress ADD COLUMN current_health INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level3_progress' AND column_name = 'current_combo'
    ) THEN
        ALTER TABLE level3_progress ADD COLUMN current_combo INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level3_progress' AND column_name = 'time_taken'
    ) THEN
        ALTER TABLE level3_progress ADD COLUMN time_taken INTEGER;
    END IF;
END $$;

-- 3. Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS level3_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  scenario_index INTEGER NOT NULL,
  score INTEGER[] NOT NULL DEFAULT '{}',
  health INTEGER[] NOT NULL DEFAULT '{}',
  combo INTEGER[] NOT NULL DEFAULT '{}',
  placed_pieces JSONB,
  is_completed BOOLEAN DEFAULT FALSE,
  current_score INTEGER DEFAULT 0,
  current_health INTEGER DEFAULT 0,
  current_combo INTEGER DEFAULT 0,
  time_taken INTEGER,
  total_attempts INTEGER DEFAULT 0,
  score_history INTEGER[] DEFAULT '{}',
  health_history INTEGER[] DEFAULT '{}',
  combo_history INTEGER[] DEFAULT '{}',
  time_history INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_level3_progress_user_id ON level3_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_level3_progress_module_level_scenario ON level3_progress(module_id, level_number, scenario_index);
CREATE INDEX IF NOT EXISTS idx_level3_progress_is_completed ON level3_progress(is_completed);
CREATE INDEX IF NOT EXISTS idx_level3_progress_current_score ON level3_progress(current_score);

-- 5. Enable Row Level Security
ALTER TABLE level3_progress ENABLE ROW LEVEL SECURITY;

-- 6. Policies
DROP POLICY IF EXISTS "Users can view own progress data" ON level3_progress;
CREATE POLICY "Users can view own progress data" ON level3_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress data" ON level3_progress;
CREATE POLICY "Users can insert own progress data" ON level3_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress data" ON level3_progress;
CREATE POLICY "Users can update own progress data" ON level3_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own progress data" ON level3_progress;
CREATE POLICY "Users can delete own progress data" ON level3_progress
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Unique constraint
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'level3_progress' AND constraint_name = 'unique_user_module_level_scenario'
    ) THEN
        ALTER TABLE level3_progress DROP CONSTRAINT unique_user_module_level_scenario;
    END IF;

    ALTER TABLE level3_progress ADD CONSTRAINT unique_user_module_level_scenario 
        UNIQUE (user_id, module_id, level_number, scenario_index);
EXCEPTION
    WHEN duplicate_table THEN NULL;
END $$;

-- 8. updated_at trigger
CREATE OR REPLACE FUNCTION update_level3_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_level3_progress_updated_at ON level3_progress;
CREATE TRIGGER update_level3_progress_updated_at
  BEFORE UPDATE ON level3_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_level3_updated_at_column();

-- 9. Get past 3 attempts
CREATE OR REPLACE FUNCTION get_level3_past_three_attempts(
    p_user_id UUID,
    p_module_id TEXT,
    p_level_number INTEGER,
    p_scenario_index INTEGER
)
RETURNS TABLE(
    current_score INTEGER,
    previous_score INTEGER,
    past_previous_score INTEGER,
    current_health INTEGER,
    previous_health INTEGER,
    past_previous_health INTEGER,
    current_combo INTEGER,
    previous_combo INTEGER,
    past_previous_combo INTEGER,
    current_time_value INTEGER,
    previous_time INTEGER,
    past_previous_time INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        score_history[1], score_history[2], score_history[3],
        health_history[1], health_history[2], health_history[3],
        combo_history[1], combo_history[2], combo_history[3],
        time_history[1], time_history[2], time_history[3]
    FROM level3_progress
    WHERE user_id = p_user_id
      AND module_id = p_module_id
      AND level_number = p_level_number
      AND scenario_index = p_scenario_index;
END;
$$ LANGUAGE plpgsql;

-- 10. Leaderboard function
CREATE OR REPLACE FUNCTION get_level3_leaderboard(
    p_module_id TEXT,
    p_level_number INTEGER,
    p_scenario_index INTEGER,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    user_id UUID,
    best_score INTEGER,
    best_health INTEGER,
    best_combo INTEGER,
    best_time INTEGER,
    total_attempts INTEGER,
    last_played TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        user_id, current_score, current_health, current_combo,
        time_taken, total_attempts, updated_at
    FROM level3_progress
    WHERE module_id = p_module_id
      AND level_number = p_level_number
      AND scenario_index = p_scenario_index
      AND is_completed = TRUE
    ORDER BY current_score DESC, current_combo DESC, time_taken ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- B. Enhanced UPSERT with score history tracking
CREATE OR REPLACE FUNCTION upsert_level3_progress_with_history(
    p_user_id UUID,
    p_module_id TEXT,
    p_level_number INTEGER,
    p_scenario_index INTEGER,
    p_score INTEGER,
    p_health INTEGER,
    p_combo INTEGER,
    p_placed_pieces JSONB,
    p_is_completed BOOLEAN,
    p_time_taken INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    result_id UUID;
    existing_scores INTEGER[];
    existing_health INTEGER[];
    existing_combo INTEGER[];
    existing_times INTEGER[];
    combined_scores INTEGER[];
    combined_health INTEGER[];
    combined_combo INTEGER[];
    combined_times INTEGER[];
    new_score_history INTEGER[];
    new_health_history INTEGER[];
    new_combo_history INTEGER[];
    new_time_history INTEGER[];
    current_attempts INTEGER := 0;
BEGIN
    SELECT score_history, health_history, combo_history, time_history, total_attempts
    INTO existing_scores, existing_health, existing_combo, existing_times, current_attempts
    FROM level3_progress
    WHERE user_id = p_user_id
      AND module_id = p_module_id
      AND level_number = p_level_number
      AND scenario_index = p_scenario_index;

    IF existing_scores IS NULL THEN
        existing_scores := '{}';
        existing_health := '{}';
        existing_combo := '{}';
        existing_times := '{}';
        current_attempts := 0;
    END IF;

    combined_scores := existing_scores || ARRAY[p_score];
    combined_health := existing_health || ARRAY[p_health];
    combined_combo := existing_combo || ARRAY[p_combo];
    combined_times := existing_times || ARRAY[COALESCE(p_time_taken, 0)];

    WITH attempt_data AS (
        SELECT unnest(combined_scores) as score,
               unnest(combined_health) as health,
               unnest(combined_combo) as combo,
               unnest(combined_times) as time,
               row_number() OVER () as original_order
    ),
    top_attempts AS (
        SELECT score, health, combo, time
        FROM attempt_data
        ORDER BY score DESC, combo DESC, original_order ASC
        LIMIT 3
    )
    SELECT
        array_agg(score ORDER BY score DESC, combo DESC),
        array_agg(health ORDER BY score DESC, combo DESC),
        array_agg(combo ORDER BY score DESC, combo DESC),
        array_agg(time ORDER BY score DESC, combo DESC)
    INTO new_score_history, new_health_history, new_combo_history, new_time_history
    FROM top_attempts;

    INSERT INTO level3_progress (
        user_id, module_id, level_number, scenario_index,
        score, health, combo, placed_pieces, is_completed,
        current_score, current_health, current_combo, time_taken,
        total_attempts,
        score_history, health_history, combo_history, time_history
    )
    VALUES (
        p_user_id, p_module_id, p_level_number, p_scenario_index,
        ARRAY[p_score], ARRAY[p_health], ARRAY[p_combo], p_placed_pieces, p_is_completed,
        p_score, p_health, p_combo, p_time_taken,
        1,
        new_score_history, new_health_history, new_combo_history, new_time_history
    )
    ON CONFLICT (user_id, module_id, level_number, scenario_index)
    DO UPDATE SET
        score = level3_progress.score || ARRAY[p_score],
        health = level3_progress.health || ARRAY[p_health],
        combo = level3_progress.combo || ARRAY[p_combo],
        current_score = GREATEST(level3_progress.current_score, p_score),
        current_health = CASE WHEN p_score > level3_progress.current_score THEN p_health ELSE level3_progress.current_health END,
        current_combo = CASE WHEN p_score > level3_progress.current_score THEN p_combo ELSE level3_progress.current_combo END,
        time_taken = CASE WHEN p_score > level3_progress.current_score THEN p_time_taken ELSE level3_progress.time_taken END,
        placed_pieces = CASE WHEN p_score > level3_progress.current_score THEN p_placed_pieces ELSE level3_progress.placed_pieces END,
        is_completed = level3_progress.is_completed OR EXCLUDED.is_completed,
        total_attempts = level3_progress.total_attempts + 1,
        score_history = EXCLUDED.score_history,
        health_history = EXCLUDED.health_history,
        combo_history = EXCLUDED.combo_history,
        time_history = EXCLUDED.time_history,
        updated_at = NOW()
    RETURNING id INTO result_id;

    RETURN result_id;
END;
$$ LANGUAGE plpgsql;

-- C. Get user’s best performance
CREATE OR REPLACE FUNCTION get_level3_best_performance(
    p_user_id UUID,
    p_module_id TEXT,
    p_level_number INTEGER,
    p_scenario_index INTEGER
)
RETURNS TABLE(
    best_score INTEGER,
    best_health INTEGER,
    best_combo INTEGER,
    best_time INTEGER,
    total_attempts INTEGER,
    is_completed BOOLEAN,
    placed_pieces JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        current_score, current_health, current_combo,
        time_taken, total_attempts, is_completed, placed_pieces
    FROM level3_progress
    WHERE user_id = p_user_id
      AND module_id = p_module_id
      AND level_number = p_level_number
      AND scenario_index = p_scenario_index;
END;
$$ LANGUAGE plpgsql;

-- D. Get user progress summary per level
CREATE OR REPLACE FUNCTION get_level3_level_summary(
    p_user_id UUID,
    p_module_id TEXT,
    p_level_number INTEGER
)
RETURNS TABLE(
    scenario_index INTEGER,
    best_score INTEGER,
    best_health INTEGER,
    best_combo INTEGER,
    total_attempts INTEGER,
    is_completed BOOLEAN,
    last_played TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        scenario_index, current_score, current_health, current_combo,
        total_attempts, is_completed, updated_at
    FROM level3_progress
    WHERE user_id = p_user_id
      AND module_id = p_module_id
      AND level_number = p_level_number
    ORDER BY scenario_index;
END;
$$ LANGUAGE plpgsql;

-- E. Leaderboard
CREATE OR REPLACE FUNCTION get_level3_leaderboard(
    p_module_id TEXT,
    p_level_number INTEGER,
    p_scenario_index INTEGER,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    user_id UUID,
    best_score INTEGER,
    best_health INTEGER,
    best_combo INTEGER,
    best_time INTEGER,
    total_attempts INTEGER,
    last_played TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        user_id, current_score, current_health, current_combo,
        time_taken, total_attempts, updated_at
    FROM level3_progress
    WHERE module_id = p_module_id
      AND level_number = p_level_number
      AND scenario_index = p_scenario_index
      AND is_completed = TRUE
    ORDER BY current_score DESC, current_combo DESC, time_taken ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
