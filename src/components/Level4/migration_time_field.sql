-- =====================================================
-- LEVEL 4 TIME FIELD MIGRATION SCRIPT
-- Migrates from time integer[] to time integer + time_history integer[]
--
-- IMPORTANT: This migration ensures score_history and time_history are aligned:
-- - score_history[1] corresponds to time_history[1] (highest score + its time)
-- - score_history[2] corresponds to time_history[2] (2nd highest score + its time)
-- - score_history[3] corresponds to time_history[3] (3rd highest score + its time)
-- =====================================================

-- Step 1: Add the new time_history column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level_4' AND column_name = 'time_history'
    ) THEN
        ALTER TABLE level_4 ADD COLUMN time_history integer[] NOT NULL DEFAULT '{}'::integer[];
    END IF;
END $$;

-- Step 2: Migrate existing data
-- If time is currently an array, move it to time_history and set time to the first element
DO $$
DECLARE
    rec RECORD;
    current_time_value integer;
BEGIN
    -- Check if time column is currently an array type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level_4' 
        AND column_name = 'time' 
        AND data_type = 'ARRAY'
    ) THEN
        -- Migrate data from time array to new structure
        FOR rec IN SELECT id, time FROM level_4 WHERE time IS NOT NULL LOOP
            -- Get the first element of the time array as the current time
            IF array_length(rec.time, 1) > 0 THEN
                current_time_value := rec.time[1];
                -- Update the record with new structure
                UPDATE level_4 
                SET time_history = rec.time
                WHERE id = rec.id;
            ELSE
                current_time_value := 0;
            END IF;
        END LOOP;
        
        -- Step 3: Change the time column from array to integer
        ALTER TABLE level_4 ALTER COLUMN time TYPE integer USING 
            CASE 
                WHEN array_length(time, 1) > 0 THEN time[1]
                ELSE 0
            END;
        
        -- Set default value for time column
        ALTER TABLE level_4 ALTER COLUMN time SET DEFAULT 0;
    END IF;
END $$;

-- Step 4: Update indexes
-- Drop old GIN index on time if it exists
DROP INDEX IF EXISTS idx_level_4_time;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_level_4_time ON public.level_4 (time);
CREATE INDEX IF NOT EXISTS idx_level_4_time_history ON public.level_4 USING GIN (time_history);

-- Step 5: Update the database functions to handle the new schema
-- (The functions are already updated in Level4.sql, so we just need to ensure they're applied)

-- Verification query to check the migration
DO $$
DECLARE
    time_type text;
    time_history_exists boolean;
BEGIN
    -- Check time column type
    SELECT data_type INTO time_type
    FROM information_schema.columns 
    WHERE table_name = 'level_4' AND column_name = 'time';
    
    -- Check if time_history column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'level_4' AND column_name = 'time_history'
    ) INTO time_history_exists;
    
    -- Report results
    RAISE NOTICE 'Migration Status:';
    RAISE NOTICE '- time column type: %', time_type;
    RAISE NOTICE '- time_history column exists: %', time_history_exists;
    
    IF time_type = 'integer' AND time_history_exists THEN
        RAISE NOTICE '✅ Migration completed successfully!';
    ELSE
        RAISE NOTICE '❌ Migration may have issues. Please check manually.';
    END IF;
END $$;
