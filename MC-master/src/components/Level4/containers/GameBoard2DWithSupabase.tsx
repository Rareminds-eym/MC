import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getLevel4Progress, 
  createLevel4Progress,
  Level4Progress,
  cleanupDuplicateLevel4Records
} from '../services/level4';
import { useAuth } from '../../../contexts/AuthContext';
import { useLevel4HighScore } from '../hooks/useLevel4HighScore';
import { VictoryPopup } from '../../../components/ui/Popup';

// Expose cleanup function to window for developer use
if (typeof window !== 'undefined') {
  (window as any).cleanupLevel4Records = cleanupDuplicateLevel4Records;
}

// Import the original GameBoard2D component and rename it
import { GameBoard2D as OriginalGameBoard2D } from '../GameBoard2D';

/**
 * Enhanced GameBoard2D component with Supabase integration
 */
const GameBoard2DWithSupabase: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gameProgress, setGameProgress] = useState<Level4Progress | null>(null);
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);
  
  // Use our high score hook
  const { highScore, updateScore, resetGame } = useLevel4HighScore();
  
  // Listen for game completion events from the GameBoard2D component
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'level4_gameState') {
        try {
          const state = JSON.parse(e.newValue || '{}');
          // Check if game is complete
          if (state.gameComplete) {
            // Update high score if needed
            if (state.score > highScore) {
              updateScore(state.score);
            }
            
            // Show victory popup
            setShowVictoryPopup(true);
          }
        } catch (error) {
          console.error('Error parsing game state:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [highScore, updateScore]);
  
  // Load or create game progress when component mounts
  useEffect(() => {
    const loadGameProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Try to clean up any duplicate records first (silent operation)
        await cleanupDuplicateLevel4Records().catch(console.error);
        
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
  
  // Function to reset progress for replaying the game
  const handleResetProgress = async () => {
    await resetGame();
    setShowVictoryPopup(false);
  };
  
  // Handle closing the victory popup
  const handleCloseVictoryPopup = () => {
    setShowVictoryPopup(false);
  };

  // Don't render game until we have user and progress data
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading your progress...</div>;
  }
  
  // If no user, we can't save progress
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">Please log in to play this game.</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate('/auth')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <OriginalGameBoard2D />
      
      {/* Victory popup showing current and high score */}
      <VictoryPopup
        open={showVictoryPopup}
        onClose={handleCloseVictoryPopup}
        score={gameProgress?.score || 0}
        combo={0} // These values aren't in Level4Progress, set defaults
        health={100} // These values aren't in Level4Progress, set defaults
        highScore={highScore}
        showReset={true}
        onReset={handleResetProgress}
      />
    </>
  );
};

export default GameBoard2DWithSupabase;
