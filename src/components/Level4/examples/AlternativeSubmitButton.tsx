/**
 * Alternative Submit Button Implementation
 * 
 * This shows how to implement the Submit button with direct Level4Service usage
 * instead of using the useSupabaseSync hook. This gives you more control over
 * the data saving process and error handling.
 */

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { saveGameCompletion, checkHighScore } from '../utils/gameDataSaver';
import type { GameState } from '../types';

interface AlternativeSubmitButtonProps {
  gameState: GameState;
  timer: number;
  moduleCases: any[];
  allAnswersProvided: boolean;
  allAnswersCorrect: boolean;
  currentPhase: string;
  onSubmitSuccess: () => void;
  onSubmitError: (error: string) => void;
}

const AlternativeSubmitButton: React.FC<AlternativeSubmitButtonProps> = ({
  gameState,
  timer,
  moduleCases,
  allAnswersProvided,
  allAnswersCorrect,
  currentPhase,
  onSubmitSuccess,
  onSubmitError
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      onSubmitError('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Check if this is a new high score
      const highScoreResult = await checkHighScore(user.id, gameState.moduleNumber, gameState.score);
      
      if (highScoreResult.isHighScore) {
        console.log('🏆 New high score achieved!', {
          newScore: gameState.score,
          previousScore: highScoreResult.previousScore
        });
      }

      // Step 2: Save the game completion data
      const saveResult = await saveGameCompletion(
        user.id,
        gameState,
        timer,
        moduleCases
      );

      if (saveResult.success) {
        console.log('✅ Game data saved successfully:', saveResult.recordId);
        
        // Step 3: Show success feedback
        if (highScoreResult.isHighScore) {
          // You can trigger a high score animation here
          console.log('Triggering high score celebration!');
        }
        
        // Call the success callback
        onSubmitSuccess();
        
      } else {
        throw new Error(saveResult.error || 'Failed to save game data');
      }

    } catch (error) {
      console.error('❌ Submit failed:', error);
      onSubmitError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show submit button when conditions are met
  if (!(currentPhase === 'feedback' && 
        gameState.currentCase === moduleCases.length - 1 && 
        allAnswersProvided && 
        allAnswersCorrect)) {
    return null;
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={isSubmitting}
      className={`w-full pixel-border-thick bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-3 font-black text-base sm:text-lg rounded-lg shadow-lg pixel-text transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 ${
        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      <span>{isSubmitting ? 'Saving...' : 'Submit'}</span>
      {!isSubmitting && (
        <ChevronRight className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
      )}
      {isSubmitting && (
        <div className="w-5 h-5 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
    </button>
  );
};

export default AlternativeSubmitButton;

/**
 * Usage Example in GameBoard2D.tsx:
 * 
 * import AlternativeSubmitButton from './examples/AlternativeSubmitButton';
 * 
 * // Replace the existing submit button with:
 * <AlternativeSubmitButton
 *   gameState={gameState}
 *   timer={timer}
 *   moduleCases={moduleCases}
 *   allAnswersProvided={allAnswersProvided}
 *   allAnswersCorrect={allAnswersCorrect}
 *   currentPhase={currentPhase}
 *   onSubmitSuccess={() => {
 *     setPopupOpen(true);
 *     // Any other success actions
 *   }}
 *   onSubmitError={(error) => {
 *     console.error('Submit error:', error);
 *     // Show error message to user
 *     alert(`Failed to save game: ${error}`);
 *   }}
 * />
 */
