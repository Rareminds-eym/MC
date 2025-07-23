# Level 4 Database Connection Guide

## Overview

Your Level 4 database is now fully connected and ready to use! The `Level4Service` provides a comprehensive interface to interact with your Supabase database using the SQL schema you've already created.

## Quick Start

### 1. Import the Service

```typescript
// Use the default service instance (recommended)
import level4Service from './services';

// Or import the class for custom instances
import { Level4Service } from './services';
```

### 2. Basic Usage

```typescript
import { useAuth } from '../../../contexts/AuthContext';
import level4Service from './services';

const MyComponent = () => {
  const { user } = useAuth();

  // Get user's game data
  const gameData = await level4Service.getUserGameData(user.id);
  
  // Save game progress
  await level4Service.upsertGameDataWithHistory(
    user.id,
    1, // module
    85, // score
    true, // isCompleted
    300, // time in seconds
    casesData // game cases object
  );
};
```

## Available Methods

### Read Operations

- `getUserGameData(userId)` - Get all game data for a user
- `getUserModuleData(userId, module)` - Get specific module data
- `getPastThreeScores(userId, module)` - Get score history
- `getUserStats(userId)` - Get user statistics
- `getUserAnalytics(userId)` - Get advanced analytics
- `getCompletedModules(userId)` - Get list of completed modules

### Write Operations

- `upsertGameDataWithHistory()` - Save/update with score history management
- `upsertGameData()` - Simple save/update
- `updateGameData()` - Update specific fields
- `updateCompletionStatus()` - Update only completion status
- `updateCases()` - Update only cases data

### Utility Methods

- `isModuleCompleted(userId, module)` - Check if module is completed
- `getBestScore(userId, module)` - Get user's best score for module
- `getOverallCompletionRate(userId)` - Get completion percentage

## Database Schema

Your database uses the following structure:

```sql
CREATE TABLE level_4 (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  module integer NOT NULL,
  level integer DEFAULT 4,
  score integer NOT NULL,
  time integer NOT NULL DEFAULT 0,
  time_history integer[] DEFAULT '{}',
  score_history integer[] DEFAULT '{}',
  cases jsonb NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

## Key Features

### 1. Automatic Score History Management
The service automatically maintains the top 3 scores for each user/module combination.

### 2. Upsert Functionality
Prevents duplicate records by updating existing data or inserting new records as needed.

### 3. Row Level Security (RLS)
Users can only access their own data thanks to the RLS policies in your SQL schema.

### 4. Comprehensive Error Handling
All methods include proper error handling and meaningful error messages.

## Example: Complete Game Flow

```typescript
import { useAuth } from '../../../contexts/AuthContext';
import level4Service from './services';

const GameComponent = () => {
  const { user } = useAuth();

  // Load existing progress
  const loadProgress = async () => {
    try {
      const moduleData = await level4Service.getUserModuleData(user.id, 1);
      if (moduleData) {
        // Resume from saved state
        setGameState(moduleData.cases);
        setScore(moduleData.score);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  // Save progress during game
  const saveProgress = async (currentScore, currentCases, isComplete) => {
    try {
      await level4Service.upsertGameDataWithHistory(
        user.id,
        1, // module number
        currentScore,
        isComplete,
        gameTimeInSeconds,
        currentCases
      );
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Get user statistics
  const getStats = async () => {
    try {
      const stats = await level4Service.getUserStats(user.id);
      console.log('User stats:', stats);
    } catch (error) {
      console.error('Failed to get stats:', error);
    }
  };
};
```

## Environment Setup

Make sure your `.env` file contains:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Connection

Use the provided example component to test your database connection:

```typescript
import DatabaseUsageExample from './examples/DatabaseUsageExample';

// Add this component to your app to test the connection
<DatabaseUsageExample />
```

## Troubleshooting

1. **Connection Issues**: Verify your Supabase environment variables
2. **Permission Errors**: Ensure RLS policies are properly set up
3. **Function Not Found**: Make sure all SQL functions from Level4.sql are executed in Supabase

## Next Steps

1. Test the connection using the example component
2. Integrate the service into your existing Level 4 components
3. Use the comprehensive methods for game state management
4. Monitor performance using the analytics functions

## Submit Button Integration

### ✅ Automatic Saving
Your Submit button is now connected to save data to Supabase! When players click Submit:

1. **Game data is automatically saved** to the `level_4` table
2. **Score history is managed** (top 3 scores are kept)
3. **Completion status is updated**
4. **Error handling** ensures data integrity

### Current Implementation
The Submit button in `GameBoard2D.tsx` now calls:
```typescript
onClick={async () => {
  try {
    await completeGame(gameState, timer);
    console.log('Game data saved to Supabase successfully');
  } catch (error) {
    console.error('Failed to save game data to Supabase:', error);
  }
  setPopupOpen(true);
}}
```

### Alternative Implementations
For more control, you can use:

1. **Direct Level4Service** (`utils/gameDataSaver.ts`):
```typescript
import { saveGameCompletion } from './utils/gameDataSaver';

const result = await saveGameCompletion(user.id, gameState, timer, moduleCases);
```

2. **Custom Submit Button** (`examples/AlternativeSubmitButton.tsx`):
- Loading states
- Error handling
- High score detection
- Custom success callbacks

## Testing Your Connection

### 1. Database Test Component
Use the test component to verify everything works:
```typescript
import DatabaseConnectionTest from './tests/DatabaseConnectionTest';
<DatabaseConnectionTest />
```

### 2. Manual Testing
1. Play through a Level 4 game
2. Click Submit when you complete all cases
3. Check browser console for success messages
4. Verify data in your Supabase dashboard

Your Level 4 database is now fully connected and ready for production use!
