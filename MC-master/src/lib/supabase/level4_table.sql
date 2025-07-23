-- Create Level 4 Game Progress Table
CREATE TABLE level_4 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module INTEGER NOT NULL,
  level INTEGER NOT NULL DEFAULT 4,
  score INTEGER NOT NULL DEFAULT 0,
  time INTEGER NOT NULL DEFAULT 0, -- Time in seconds
  cases JSONB NOT NULL, -- Store case progress as JSON
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE level_4 ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to only see and modify their own data
CREATE POLICY "Users can view their own data" ON level_4
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON level_4
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON level_4
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX level_4_user_id_index ON level_4 (user_id);
CREATE INDEX level_4_module_index ON level_4 (module);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_level_4_updated_at
  BEFORE UPDATE ON level_4
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Comments for better documentation
COMMENT ON TABLE level_4 IS 'Stores user progress for Level 4 manufacturing game';
COMMENT ON COLUMN level_4.user_id IS 'Foreign key to auth.users';
COMMENT ON COLUMN level_4.module IS 'Module number/ID';
COMMENT ON COLUMN level_4.level IS 'Game level (always 4 for this table)';
COMMENT ON COLUMN level_4.score IS 'User score for the level';
COMMENT ON COLUMN level_4.time IS 'Time taken to complete in seconds';
COMMENT ON COLUMN level_4.cases IS 'JSON structure storing case progress, answers, and correctness';
COMMENT ON COLUMN level_4.is_completed IS 'Whether the user has completed this level';

-- Sample data (use only in development, replace 'your-user-id' with an actual user ID from auth.users)
INSERT INTO level_4 (
  user_id,
  module,
  level,
  score,
  time,
  cases,
  is_completed
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user_id from auth.users
  1, -- Module 1
  4, -- Level 4
  6, -- Score (2 cases × 3 points each)
  325, -- Time in seconds (5 minutes, 25 seconds)
  '{
    "currentCase": 2,
    "caseProgress": [
      {
        "id": 1,
        "answers": {
          "violation": 1,
          "rootCause": 1,
          "impact": 0
        },
        "isCorrect": true,
        "attempts": 1,
        "timeSpent": 180
      },
      {
        "id": 2,
        "answers": {
          "violation": 0,
          "rootCause": 0,
          "impact": 0
        },
        "isCorrect": true,
        "attempts": 2,
        "timeSpent": 145
      }
    ],
    "scoredQuestions": {
      "0": ["violation", "rootCause", "impact"],
      "1": ["violation", "rootCause", "impact"]
    }
  }'::jsonb,
  true -- Completed
);

-- Sample data for in-progress game
INSERT INTO level_4 (
  user_id,
  module,
  level,
  score,
  time,
  cases,
  is_completed
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user_id
  1, -- Module 1
  4, -- Level 4
  3, -- Score (1 case × 3 points)
  210, -- Time in seconds
  '{
    "currentCase": 1,
    "caseProgress": [
      {
        "id": 1,
        "answers": {
          "violation": 1,
          "rootCause": 1,
          "impact": 0
        },
        "isCorrect": true,
        "attempts": 1,
        "timeSpent": 210
      }
    ],
    "scoredQuestions": {
      "0": ["violation", "rootCause", "impact"]
    }
  }'::jsonb,
  false -- Not completed yet
);

-- Note: In production, you would get the actual user_id from your authentication system
-- and build the JSON dynamically from your application logic
