// Game storage utility for managing scores and progress
export interface GameStats {
  highScore: number;
  totalGamesPlayed: number;
  bestTime: number;
  lastPlayedDate: string;
  perfectGames: number;
}

export class GameStorage {
  private static readonly STORAGE_KEY = 'gmp-quest-stats';

  public static getStats(): GameStats {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error loading game stats:', error);
    }

    // Return default stats
    return {
      highScore: 0,
      totalGamesPlayed: 0,
      bestTime: 0,
      lastPlayedDate: '',
      perfectGames: 0
    };
  }

  public static saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.warn('Error saving game stats:', error);
    }
  }

  public static updateScore(newScore: number, timeElapsed: number, isPerfect: boolean = false): GameStats {
    const currentStats = this.getStats();
    
    const updatedStats: GameStats = {
      highScore: Math.max(currentStats.highScore, newScore),
      totalGamesPlayed: currentStats.totalGamesPlayed + 1,
      bestTime: currentStats.bestTime === 0 ? timeElapsed : Math.min(currentStats.bestTime, timeElapsed),
      lastPlayedDate: new Date().toISOString(),
      perfectGames: currentStats.perfectGames + (isPerfect ? 1 : 0)
    };

    this.saveStats(updatedStats);
    return updatedStats;
  }

  public static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}