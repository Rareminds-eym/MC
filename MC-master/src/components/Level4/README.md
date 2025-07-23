# Level 4 - Supabase Integration

This folder contains the Level 4 game components integrated with Supabase for data persistence.

## Architecture

The integration follows a wrapper pattern to avoid modifying the original GameBoard2D component:

1. `GameBoard2D.tsx` - The original game component that's left mostly unchanged
2. `containers/SupabaseGameBoard.tsx` - Wrapper component that manages Supabase integration
3. `hooks/useSupabaseIntegration.ts` - Custom hook for Supabase data operations
4. `services/supabaseService.ts` - Service layer for Supabase API calls

## Data Flow

1. Game state is saved to localStorage by GameBoard2D
2. The wrapper listens for state changes via storage events
3. When changes occur, the wrapper syncs data with Supabase
4. Initial state is loaded from Supabase when the game starts

## Database Structure

The Supabase table `level_4` stores:

- User progress across cases
- Score and completion time
- Case-specific answers and attempts
- Completion status

## Usage

To use the Supabase-integrated version in your app:

```tsx
import SupabaseGameBoard from '../../components/Level4';

const YourComponent = () => {
  return <SupabaseGameBoard />;
};
```

For testing without Supabase:

```tsx
import { GameBoard2D } from '../../components/Level4/GameBoard2D';

const YourComponent = () => {
  return <GameBoard2D />;
};
```

## Database Schema

The SQL schema for the Supabase table can be found in:
`/src/lib/supabase/level4_table.sql`
