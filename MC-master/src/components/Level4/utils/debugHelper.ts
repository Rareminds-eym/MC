/**
 * Debug Helper for Level 4 Game
 * 
 * This utility helps debug common issues with the Level 4 game,
 * particularly around game state validation and Supabase integration.
 */

import { GameState } from '../types';
import { casesByModule } from '../data/cases';

/**
 * Validate game state structure and log detailed information
 */
export const validateGameState = (gameState: GameState, context: string = 'Unknown') => {
  console.group(`🔍 [DEBUG] Validating GameState - ${context}`);
  
  try {
    // Basic structure validation
    console.log('GameState:', gameState);
    
    if (!gameState) {
      console.error('❌ GameState is null or undefined');
      console.groupEnd();
      return false;
    }

    // Check required properties
    const requiredProps = ['currentCase', 'moduleNumber', 'answers', 'score'];
    const missingProps = requiredProps.filter(prop => !(prop in gameState));
    
    if (missingProps.length > 0) {
      console.error('❌ Missing required properties:', missingProps);
      console.groupEnd();
      return false;
    }

    // Validate module number
    const moduleNumber = gameState.moduleNumber || 1;
    console.log('📁 Module Number:', moduleNumber);
    
    const availableModules = Object.keys(casesByModule);
    console.log('📁 Available Modules:', availableModules);
    
    if (!casesByModule[moduleNumber]) {
      console.error(`❌ Module ${moduleNumber} not found in casesByModule`);
      console.groupEnd();
      return false;
    }

    // Validate current case
    const moduleCases = casesByModule[moduleNumber];
    console.log('📋 Module Cases Count:', moduleCases.length);
    console.log('🎯 Current Case Index:', gameState.currentCase);
    
    if (gameState.currentCase < 0 || gameState.currentCase >= moduleCases.length) {
      console.error(`❌ Invalid currentCase ${gameState.currentCase}. Valid range: 0-${moduleCases.length - 1}`);
      console.groupEnd();
      return false;
    }

    // Validate current case data
    const currentCaseData = moduleCases[gameState.currentCase];
    console.log('📄 Current Case Data:', currentCaseData);
    
    if (!currentCaseData || !currentCaseData.questions) {
      console.error('❌ Current case data or questions missing');
      console.groupEnd();
      return false;
    }

    // Validate answers structure
    console.log('💭 Answers:', gameState.answers);
    
    if (!gameState.answers) {
      console.error('❌ Answers object missing');
      console.groupEnd();
      return false;
    }

    // Validate question structure
    const { violation, rootCause, impact } = currentCaseData.questions;
    console.log('❓ Questions Structure:', {
      violation: violation ? 'OK' : 'MISSING',
      rootCause: rootCause ? 'OK' : 'MISSING',
      impact: impact ? 'OK' : 'MISSING'
    });

    if (!violation || !rootCause || !impact) {
      console.error('❌ Question structure incomplete');
      console.groupEnd();
      return false;
    }

    // Show correct answers
    console.log('✅ Correct Answers:', {
      violation: violation.correct,
      rootCause: rootCause.correct,
      impact: impact.correct
    });

    // Show user answers
    console.log('👤 User Answers:', {
      violation: gameState.answers.violation,
      rootCause: gameState.answers.rootCause,
      impact: gameState.answers.impact
    });

    // Check if answers are correct
    const isCorrect = (
      gameState.answers.violation === violation.correct &&
      gameState.answers.rootCause === rootCause.correct &&
      gameState.answers.impact === impact.correct
    );

    console.log(`🎯 All Answers Correct: ${isCorrect ? '✅ YES' : '❌ NO'}`);

    console.log('✅ GameState validation passed');
    console.groupEnd();
    return true;

  } catch (error) {
    console.error('💥 Error during validation:', error);
    console.groupEnd();
    return false;
  }
};

/**
 * Debug the Submit button click
 */
export const debugSubmitClick = (gameState: GameState, timer: number, moduleCases: any[]) => {
  console.group('🚀 [DEBUG] Submit Button Click');
  
  console.log('⏱️ Timer:', timer);
  console.log('📊 Score:', gameState.score);
  console.log('🎮 Game Complete:', gameState.gameComplete);
  console.log('📋 Module Cases:', moduleCases);
  
  // Validate game state
  const isValid = validateGameState(gameState, 'Submit Click');
  
  if (!isValid) {
    console.error('❌ GameState validation failed - Submit may fail');
  } else {
    console.log('✅ GameState is valid - Submit should work');
  }
  
  console.groupEnd();
  return isValid;
};

/**
 * Debug Supabase sync issues
 */
export const debugSupabaseSync = (gameState: GameState, timer: number, error?: any) => {
  console.group('🔄 [DEBUG] Supabase Sync');
  
  if (error) {
    console.error('💥 Sync Error:', error);
    console.error('📍 Error Stack:', error.stack);
  }
  
  validateGameState(gameState, 'Supabase Sync');
  
  console.log('⏱️ Timer Value:', timer, typeof timer);
  console.log('📊 Score Value:', gameState.score, typeof gameState.score);
  
  // Check for common issues
  if (typeof timer !== 'number' || isNaN(timer)) {
    console.error('❌ Timer is not a valid number');
  }
  
  if (typeof gameState.score !== 'number' || isNaN(gameState.score)) {
    console.error('❌ Score is not a valid number');
  }
  
  console.groupEnd();
};

/**
 * Make debug functions available globally for browser console debugging
 */
if (typeof window !== 'undefined') {
  (window as any).debugLevel4 = {
    validateGameState,
    debugSubmitClick,
    debugSupabaseSync,
    casesByModule
  };
  
  console.log('🛠️ Level 4 debug tools available at window.debugLevel4');
}

export default {
  validateGameState,
  debugSubmitClick,
  debugSupabaseSync
};
