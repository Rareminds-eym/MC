import React, { useState, useEffect, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { GameMode, Term } from '../../../types/Level2/types';
import { useDeviceLayout } from '../../../hooks/useOrientation';
import { useLevel2Game } from '../hooks/useLevel2Game';
import DndProvider from '../DndProvider';
import { soundManager, playDragSound, playCorrectSound, playIncorrectSound, playScoreSound } from '../../../utils/Level2/sounds';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';

import '../index.css';

interface GameInterfaceProps {
  gameMode: GameMode;
  moduleId: string;
  onBack: () => void;
  onNextLevel?: (score: number, currentScore: number, totalCorrect: number, terms: Term[], scoreHistory: number[], timeHistory: number[]) => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ gameMode, moduleId, onBack, onNextLevel }) => {
  const { isMobile } = useDeviceLayout();
  const {
    isLoading: isGameLoading,
    gameDataWithHistory
  } = useLevel2Game({ moduleId, gameModeId: gameMode.id });
  
  const [terms, setTerms] = useState<Term[]>(() =>
    gameMode.terms.map(term => ({ ...term, currentCategory: undefined }))
  );

  // Update terms when gameMode changes (when moduleId and type change)
  useEffect(() => {
    setTerms(gameMode.terms.map(term => ({ ...term, currentCategory: undefined })));
    // Reset game state when gameMode changes
    setTimeElapsed(0);
    setGameStarted(false);
    setMoves(0);
    setCurrentScore(0);
    setHasExecuted(false);
  }, [gameMode]);


  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [hasExecuted, setHasExecuted] = useState(false);

  // Initialize sounds on component mount
  useEffect(() => {
    soundManager.initSounds();
    
    // Resume audio context on first user interaction
    const handleFirstInteraction = () => {
      soundManager.resumeContext();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !hasExecuted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, hasExecuted]);

  // Start game on first move
  useEffect(() => {
    if (moves > 0 && !gameStarted) {
      setGameStarted(true);
    }
  }, [moves, gameStarted]);

  const checkAnswers = useCallback(async () => {
    // Prevent duplicate executions
    if (hasExecuted || isGameLoading) {
      return;
    }
    
    // Set hasExecuted immediately to prevent race conditions
    setHasExecuted(true);
    
    let correct = 0;

    terms.forEach(term => {
      if (term.currentCategory === term.correctCategory) {
        correct++;
      }
    });

    // Calculate percentage score based on correct items
    const percentageScore = Math.round((correct / terms.length) * 100);

    // Update current score to reflect total points earned (5 points per correct item)
    const totalPointsEarned = correct * 5;
    setCurrentScore(totalPointsEarned);

    // NOTE: Database saving is now deferred to the ResultsModal for batch processing
    // This allows all game types to be completed before any database operations occur

    // Use existing data for history, since we're not saving to database yet
    const updatedScoreHistory = gameDataWithHistory?.score_history || [];
    const updatedTimeHistory = gameDataWithHistory?.time_history || [];

    // Add current score and time to the history arrays for display purposes
    const currentScoreHistory = [totalPointsEarned, ...updatedScoreHistory.slice(0, 2)];
    const currentTimeHistory = [timeElapsed, ...updatedTimeHistory.slice(0, 2)];

    // Instead of showing results modal directly, call the next level handler
    // This will be handled by the GameNavigator based on the flow state
    if (onNextLevel) {
      onNextLevel(
        percentageScore,
        totalPointsEarned,
        correct,
        terms,
        currentScoreHistory,
        currentTimeHistory
      );
    }
  }, [terms, timeElapsed, hasExecuted, isGameLoading, gameDataWithHistory, onNextLevel]);

  // Auto-execute when all items are placed (only if not already executed)
  useEffect(() => {
    const unassignedTerms = terms.filter(term => !term.currentCategory);
    if (unassignedTerms.length === 0 && terms.length > 0 && !hasExecuted && !isGameLoading) {
      // Small delay to allow the last drop animation to complete
      const timeoutId = setTimeout(() => {
        // Double-check conditions before executing
        const currentUnassigned = terms.filter(term => !term.currentCategory);
        if (currentUnassigned.length === 0 && !hasExecuted && !isGameLoading) {
          checkAnswers();
        }
      }, 500);

      // Cleanup timeout if component unmounts or dependencies change
      return () => clearTimeout(timeoutId);
    }
  }, [terms, hasExecuted, checkAnswers, isGameLoading]);

  const handleDragStart = () => {
    playDragSound();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const termId = active.id as string;
    const categoryId = over.id as string;
    
    // Only process if dropping on a category
    if (gameMode.categories.some(cat => cat.id === categoryId)) {
      const term = terms.find(t => t.id === termId);
      if (term) {
        const isCorrect = term.correctCategory === categoryId;
        
        // Play sound based on correctness
        if (isCorrect) {
          playCorrectSound();
          // Add 5 points for correct placement
          setCurrentScore(prev => {
            const newScore = prev + 5;
            playScoreSound();
            return newScore;
          });
        } else {
          playIncorrectSound();
        }
      }
      
      setTerms(prevTerms =>
        prevTerms.map(term =>
          term.id === termId
            ? { ...term, currentCategory: categoryId }
            : term
        )
      );

      setMoves(prev => prev + 1);
      
      // Reset hasExecuted when user makes a new move after seeing results
      if (hasExecuted) {
        setHasExecuted(false);
      }
    }
  };

  const resetGame = () => {
    setTerms(gameMode.terms.map(term => ({ ...term, currentCategory: undefined })));
    setTimeElapsed(0);
    setGameStarted(false);
    setMoves(0);
    setCurrentScore(0);
    setHasExecuted(false);
  };



  const getTermsInCategory = (categoryId: string) => {
    return terms.filter(term => term.currentCategory === categoryId);
  };

  const getUnassignedTerms = () => {
    return terms.filter(term => !term.currentCategory);
  };

  // Real-time feedback functions - check correctness immediately
  const getCorrectTerms = () => {
    const correct = new Set<string>();
    terms.forEach(term => {
      if (term.currentCategory && term.currentCategory === term.correctCategory) {
        correct.add(term.id);
      }
    });
    return correct;
  };

  const getIncorrectTerms = () => {
    const incorrect = new Set<string>();
    terms.forEach(term => {
      if (term.currentCategory && term.currentCategory !== term.correctCategory) {
        incorrect.add(term.id);
      }
    });
    return incorrect;
  };

  const progress = ((terms.length - getUnassignedTerms().length) / terms.length) * 100;

  const layoutProps = {
    gameTitle: gameMode.title,
    onBack,
    onReset: resetGame,
    currentScore,
    correctCount: getCorrectTerms().size,
    timeElapsed,
    moves,
    unassignedTerms: getUnassignedTerms(),
    progress,
    hasExecuted,
    categories: gameMode.categories,
    getTermsInCategory,
    correctTerms: getCorrectTerms(),
    incorrectTerms: getIncorrectTerms(),
    moduleId: gameMode.moduleId,
    type: gameMode.type,
  };

  return (
    <DndProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={`min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 bg-cover bg-center bg-no-repeat relative overflow-hidden pixel-perfect ${isMobile ? 'p-2' : 'p-6'}`}
        style={{ backgroundImage: 'url("/Level2/level3bg.webp")' }}>
        {/* Gamified Overlay - matches Level2 HomePage */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Slightly darkened base overlay for gamified look */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-transparent opacity-80 pixel-glow"></div>
          {/* Scan Lines Overlay */}
          <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
          {/* Glow Overlay */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-30 blur-lg"></div>
        </div>
        {isGameLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-white text-xl">Saving progress...</div>
          </div>
        )}
        <div className={`relative z-10 ${isMobile ? 'h-screen flex flex-col p-1' : 'max-w-7xl mx-auto p-3 md:p-6'}`}>
          {isMobile ? (
            <MobileLayout {...layoutProps} />
          ) : (
            <DesktopLayout {...layoutProps} />
          )}

          {/* ResultsModal is now handled by GameNavigator based on flow state */}
        </div>
      </div>
    </DndProvider>
  );
};

export default GameInterface;
