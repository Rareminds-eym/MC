import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameBoard2D } from '../GameBoard2D';
import { useSupabaseIntegration } from '../hooks/useSupabaseIntegration';
import Level4LoadingScreen from '../Level4LoadingScreen';

/**
 * This component wraps the GameBoard2D component to provide
 * Supabase integration without modifying the original component.
 */
const SupabaseGameBoard: React.FC = () => {
  const navigate = useNavigate();
  const { loading, syncWithSupabase, getInitialState, user } = useSupabaseIntegration();
  
  // Intercept GameBoard2D state changes using localStorage
  // This approach allows us to track state without modifying GameBoard2D
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'level4_gameState') {
        try {
          // Parse the game state from storage
          const gameState = JSON.parse(event.newValue || '{}');
          
          // Check for completion conditions
          const isComplete = gameState.gameComplete === true;
          const isCorrect = gameState.showFeedback === true && gameState.correctAnswers === 3;
          const timer = parseInt(localStorage.getItem('level4_timer') || '0', 10);
          
          // Sync with Supabase
          syncWithSupabase(gameState, isCorrect, isComplete, timer);
        } catch (error) {
          console.error('Error processing game state change:', error);
        }
      }
    };
    
    // Use local storage event to detect changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [syncWithSupabase]);
  
  // Don't render game until we have user data
  if (loading) {
    return <Level4LoadingScreen />;
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

  // Get initial state if available
  const initialState = getInitialState();
  
  // Render the original GameBoard2D
  return <GameBoard2D />;
};

export default SupabaseGameBoard;
