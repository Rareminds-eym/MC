# Level 4 High Score Implementation

This document explains how the high score system is implemented in Level 4 of the GMP game.

## Overview

The system ensures that:

1. Each user's highest combined score across all cases for Module 1, Level 4 is preserved in the database
2. The score is accumulated as the user progresses through cases (Case 1 + Case 2 = Combined Score)
3. Lower score records are automatically deleted
4. Users see a notification when they achieve a new high score
5. Only one record per user is maintained to prevent duplicate entries

## Implementation Details

### 1. Database Storage

- All user progress is saved to the `level_4` table in Supabase
- Only the highest score is kept long-term, duplicate records are aggressively removed
- The system automatically cleans up lower score records and prevents race conditions

### 2. When High Score Cleanup Occurs

High score cleanup is performed at multiple key moments:

1. **During Initialization**: When loading the game, cleanup runs first to eliminate duplicates
2. **On Game Completion**: When a user finishes the game, ensuring only highest score remains
3. **During Sync Operations**: When game state is synced to Supabase
4. **Random Periodic Cleanup**: 20% chance on regular syncs to check for and remove duplicates
5. **Final Verification**: After any critical operation, to ensure database integrity
6. **Cross-User Check**: The system now checks for duplicate records across different user IDs

### 3. How Scores are Accumulated and Compared

- Scores are accumulated as the user progresses through multiple cases
- The total combined score across all cases (Case 1 + Case 2) is what gets stored in the database
- Example: 10 points in Case 1 + 15 points in Case 2 = 25 points total combined score
- Scores are ordered in descending order (highest first) with `.order('score', { ascending: false })`
- The database always stores the highest accumulated score achieved

### 4. Anti-Duplication Measures

The system uses multiple strategies to prevent duplicate records:

1. **Transaction-based operations**: Ensuring atomicity of database operations
2. **Verification before creation**: Multiple checks before creating new records
3. **Aggressive cleanup**: Even after operations, verification ensures only one record exists
4. **Throttling**: Syncs are throttled (3 seconds minimum between syncs) to prevent race conditions
5. **Referential state tracking**: Game component tracks what has already been synced to avoid duplicate syncs

### 5. User Feedback

- A high score notification appears when a user completes the game with a new personal best
- The notification shows the combined score achieved across all cases
- It automatically disappears after a few seconds

## Key Functions

### `keepHighestScoreOnly`

This function:
1. Fetches all records for a user in level_4 table
2. Removes any empty, invalid, or corrupt records
3. Orders remaining records by score (highest first)
4. Keeps only the highest score record and deletes all others
5. Performs a final verification to ensure only one record exists
6. Returns the ID of the kept record for further operations

### `syncGameState`

This function:
1. Throttles sync operations to prevent race conditions
2. Verifies record existence before updating
3. Updates case progress and accumulates score
4. Performs periodic cleanup to catch any duplicate records

### `completeGame`

This function:
1. Performs aggressive cleanup first to ensure clean state
2. Updates the existing record with completion status and final score
3. Creates a new record only if necessary
4. Performs final verification to ensure only one record exists

## Score Display

The UI displays:
- The current accumulated game score across all cases
- A high score notification when a new personal best is achieved

## Technical Implementation

The high score system is implemented in:

1. `useSupabaseSync.ts` - Main synchronization and high score logic with duplicate prevention
2. `GameBoard2D.tsx` - UI integration with throttled state syncing
3. `HighScoreAlert.tsx` - Component for displaying high score notifications

## Troubleshooting

If duplicate records are detected despite the preventive measures:

1. **Run the Emergency Cleanup**: Use the browser console to run `window.cleanupLevel4Records()`
2. **Check for Multiple User IDs**: The emergency cleanup function now checks for duplicate records across different user IDs
3. **Monitor the Console**: Check browser console logs for detailed debug information

1. The system logs detailed diagnostics to the console
2. Final verification should catch and clean up any duplicates
3. Periodic random cleanups will eventually resolve any issues
