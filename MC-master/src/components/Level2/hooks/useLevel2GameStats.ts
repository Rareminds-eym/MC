import { useState, useEffect } from 'react';
import { Level2GameService } from '../services/level2GameService';
import { Level2GameStats } from '../../../types/Level2/types';
import { GameStorage, GameStats } from '../../../utils/Level2/gameStorage';
import { useAuth } from '../../../contexts/AuthContext';

interface UseLevel2GameStatsResult {
  stats: Level2GameStats | GameStats;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

/**
 * Custom hook to fetch Level 2 game statistics
 * Falls back to localStorage if user is not authenticated
 */
export const useLevel2GameStats = (moduleId: string = '1', gameModeId: string = 'gmp-vs-non-gmp'): UseLevel2GameStatsResult => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Level2GameStats | GameStats>(GameStorage.getStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (authLoading) return;

      setLoading(true);
      setError(null);

      try {
        if (user) {
          // User is authenticated, fetch from database
          const { data, error: dbError } = await Level2GameService.getGameStats(moduleId, gameModeId);
          
          if (dbError) {
            console.warn('Error fetching database stats, falling back to localStorage:', dbError);
            setStats(GameStorage.getStats());
            setError('Failed to fetch online stats, showing local data');
          } else if (data) {
            setStats(data);
          } else {
            // No data in database yet, use localStorage
            setStats(GameStorage.getStats());
          }
        } else {
          // User not authenticated, use localStorage
          setStats(GameStorage.getStats());
        }
      } catch (err) {
        console.error('Error in useLevel2GameStats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStats(GameStorage.getStats());
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, authLoading, moduleId, gameModeId]);

  const refreshStats = async () => {
    if (authLoading) return;

    setLoading(true);
    setError(null);

    try {
      if (user) {
        // User is authenticated, fetch from database
        const { data, error: dbError } = await Level2GameService.getGameStats(moduleId, gameModeId);
        
        if (dbError) {
          console.warn('Error fetching database stats, falling back to localStorage:', dbError);
          setStats(GameStorage.getStats());
          setError('Failed to fetch online stats, showing local data');
        } else if (data) {
          setStats(data);
        } else {
          // No data in database yet, use localStorage
          setStats(GameStorage.getStats());
        }
      } else {
        // User not authenticated, use localStorage
        setStats(GameStorage.getStats());
      }
    } catch (err) {
      console.error('Error in useLevel2GameStats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStats(GameStorage.getStats());
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats
  };
};
