import React, { useEffect } from 'react';
import { GameBoard2D } from '../GameBoard2D';
import {
  getLevel4Progress,
  createLevel4Progress,
  updateCaseProgress,
  completeLevel4,
  Level4Progress
} from '../services/level4';
import { useAuth } from '../../../contexts/AuthContext';
import Level4LoadingScreen from '../Level4LoadingScreen';


/**
 * This component wraps the GameBoard2D component and handles
 * the integration with Supabase for data persistence
 */
const GameBoard2DWithSupabase: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [gameProgress, setGameProgress] = React.useState<Level4Progress | null>(null);
  const { user } = useAuth();
  
  // Load or create game progress when component mounts
  useEffect(() => {
    const loadGameProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Try to load existing progress
        let progress = await getLevel4Progress();
        
        if (!progress) {
          // Create new progress if none exists
          progress = await createLevel4Progress();
        }
        
        setGameProgress(progress);
      } catch (error) {
        console.error("Failed to load game progress:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGameProgress();
  }, [user]);
  
  // Don't render game until we have user and progress data
  if (loading) {
    return <Level4LoadingScreen />;
  }
  
  // If no user, we can't save progress
  if (!user) {
    return <div>Please log in to play this game.</div>;
  }
  
  return (
    <GameBoardWrapper gameProgress={gameProgress} />
  );
};

// Separate wrapper component to avoid re-rendering issues
const GameBoardWrapper: React.FC<{ gameProgress: Level4Progress | null }> = ({ gameProgress }) => {
  // Handlers for game events that need to be persisted
  const handleCaseComplete = async (
    caseId: number,
    answers: {
      violation: number | null;
      rootCause: number | null;
      impact: number | null;
    },
    isCorrect: boolean,
    attempts: number,
    timeSpent: number
  ) => {
    if (gameProgress?.id) {
      await updateCaseProgress(
        gameProgress.id,
        caseId,
        answers,
        isCorrect,
        attempts,
        timeSpent
      );
    }
  };
  
  const handleGameComplete = async (finalTime: number) => {
    if (gameProgress?.id) {
      await completeLevel4(gameProgress.id, finalTime);
    }
  };
  
  return (
    <>
      {/* Pass the handlers to the GameBoard2D component */}
      <GameBoard2D
        initialGameState={gameProgress ? {
          currentCase: gameProgress.cases.currentCase,
          score: gameProgress.score,
          timer: gameProgress.time,
          // Any other state you need to restore
        } : undefined}
        onCaseComplete={handleCaseComplete}
        onGameComplete={handleGameComplete}
      />
    </>
  );
};

export default GameBoard2DWithSupabase;
