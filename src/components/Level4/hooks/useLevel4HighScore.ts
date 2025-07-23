import { useCallback, useEffect, useState } from 'react';
import { 
  getLevel4Progress, 
  updateHighScore,
  resetLevel4Progress,
  Level4Progress 
} from '../services/level4';

/**
 * Custom hook for managing high scores and game persistence
 * This hook ensures that high scores are properly saved and that
 * replaying the game won't lose the user's highest score
 */
export const useLevel4HighScore = () => {
  const [progress, setProgress] = useState<Level4Progress | null>(null);
  const [highScore, setHighScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      try {
        const data = await getLevel4Progress();
        if (data) {
          setProgress(data);
          setHighScore(data.score || 0);
        }
      } catch (error) {
        console.error('Error loading level 4 progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  // Function to update high score
  const updateScore = useCallback(async (newScore: number) => {
    if (!progress?.id) return;
    
    // Only update if the new score is higher
    if (newScore > highScore) {
      const updated = await updateHighScore(progress.id, newScore);
      if (updated) {
        setHighScore(newScore);
        setProgress(updated);
      }
    }
  }, [progress, highScore]);

  // Function to reset progress but keep high score
  const resetGame = useCallback(async () => {
    if (!progress?.id) return;
    
    console.log(`Resetting game in hook: Current high score = ${highScore}`);
    
    const reset = await resetLevel4Progress(progress.id);
    if (reset) {
      console.log(`Game reset successful. Score in reset data: ${reset.score}`);
      // Ensure we set the progress with the proper high score
      setProgress(reset);
      
      // Make sure the UI highScore state is consistent with the database
      if (reset.score !== highScore) {
        console.log(`Updating local highScore from ${highScore} to ${reset.score}`);
        setHighScore(reset.score);
      }
    }
  }, [progress, highScore]);

  return {
    progress,
    highScore,
    loading,
    updateScore,
    resetGame
  };
};
