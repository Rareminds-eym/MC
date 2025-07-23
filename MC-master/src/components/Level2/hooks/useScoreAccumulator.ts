import { useState, useCallback } from 'react';
import { Term } from '../../../types/Level2/types';

export interface GameTypeResult {
  gameTypeId: number;
  gameModeId: string;
  score: number;
  currentScore: number;
  totalCorrect: number;
  terms: Term[];
  scoreHistory: number[];
  timeHistory: number[];
  time: number;
  totalTerms: number;
  placedTerms: Term[];
  isCompleted: boolean;
  completedAt: string;
}

export interface UseScoreAccumulatorReturn {
  accumulatedResults: GameTypeResult[];
  addGameTypeResult: (result: GameTypeResult) => void;
  clearAccumulatedResults: () => void;
  getResultsForGameType: (gameTypeId: number) => GameTypeResult | undefined;
  getAllResults: () => GameTypeResult[];
  hasResults: boolean;
  getTotalScore: () => number;
  getTotalTime: () => number;
  getAverageScore: () => number;
}

export const useScoreAccumulator = (): UseScoreAccumulatorReturn => {
  const [accumulatedResults, setAccumulatedResults] = useState<GameTypeResult[]>([]);

  const addGameTypeResult = useCallback((result: GameTypeResult) => {
    setAccumulatedResults(prev => {
      // Remove any existing result for the same game type to avoid duplicates
      const filtered = prev.filter(r => r.gameTypeId !== result.gameTypeId);
      return [...filtered, result];
    });
  }, []);

  const clearAccumulatedResults = useCallback(() => {
    setAccumulatedResults([]);
  }, []);

  const getResultsForGameType = useCallback((gameTypeId: number): GameTypeResult | undefined => {
    return accumulatedResults.find(result => result.gameTypeId === gameTypeId);
  }, [accumulatedResults]);

  const getAllResults = useCallback((): GameTypeResult[] => {
    return [...accumulatedResults];
  }, [accumulatedResults]);

  const getTotalScore = useCallback((): number => {
    return accumulatedResults.reduce((total, result) => total + result.currentScore, 0);
  }, [accumulatedResults]);

  const getTotalTime = useCallback((): number => {
    return accumulatedResults.reduce((total, result) => total + result.time, 0);
  }, [accumulatedResults]);

  const getAverageScore = useCallback((): number => {
    if (accumulatedResults.length === 0) return 0;
    return Math.round(getTotalScore() / accumulatedResults.length);
  }, [accumulatedResults, getTotalScore]);

  const hasResults = accumulatedResults.length > 0;

  return {
    accumulatedResults,
    addGameTypeResult,
    clearAccumulatedResults,
    getResultsForGameType,
    getAllResults,
    hasResults,
    getTotalScore,
    getTotalTime,
    getAverageScore
  };
};
