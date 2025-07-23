/**
 * Level 4 Database Service Connection
 * 
 * This file provides easy access to the Level4Service with proper Supabase connection.
 * It uses the shared Supabase client from your existing configuration.
 */

import { level4Service, Level4Service, createLevel4Service } from './level4services';

// Export the default service instance (recommended for most use cases)
export { level4Service as default };

// Export the service class and factory function for advanced use cases
export { Level4Service, createLevel4Service };

// Export all types for TypeScript support
export type {
  Level4GameData,
  Level4ScoreHistory,
  Level4Stats,
  Level4Analytics,
  Level4LeaderboardEntry,
  Level4ProgressSummary,
  Level4UpdateData
} from './level4services';

/**
 * Example usage:
 * 
 * // Basic usage with default service instance:
 * import level4Service from './services';
 * 
 * const gameData = await level4Service.getUserGameData(userId);
 * 
 * // Advanced usage with custom service instance:
 * import { Level4Service } from './services';
 * 
 * const customService = new Level4Service(customSupabaseClient);
 * const gameData = await customService.getUserGameData(userId);
 */
