import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GameInterface from '../../components/Level2/GameInterface';
import ResultsModal from '../../components/Level2/GameInterface/ResultsModal';
import ContinueButton from '../../components/Level2/GameInterface/ContinueButton';
import { getNextTypeInSequence } from '../../components/Level2/data/gameModes';
import { useModuleFlow } from '../../components/Level2/hooks/useModuleFlow';
import { useLevel2Game } from '../../components/Level2/hooks/useLevel2Game';
import { GameTypeResult } from '../../components/Level2/hooks/useScoreAccumulator';
import { ScoreProvider, useScoreContext } from '../../components/Level2/contexts/ScoreContext';
import '../../components/Level2/index.css';

const Level2GameNavigatorInner: React.FC = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Legacy state for backward compatibility (will be replaced by accumulated data)
  const [gameScore, setGameScore] = useState(0);
  const [gameCurrentScore, setGameCurrentScore] = useState(0);
  const [gameTotalCorrect, setGameTotalCorrect] = useState(0);
  const [gameTerms, setGameTerms] = useState<any[]>([]);
  const [gameScoreHistory, setGameScoreHistory] = useState<number[]>([]);
  const [gameTimeHistory, setGameTimeHistory] = useState<number[]>([]);

  const moduleIdNum = parseInt(moduleId || '1');
  const {
    flowState,
    currentGameMode,
    advanceToNextType,
    markCurrentTypeCompleted,
    resetFlow,
    isFlowComplete
  } = useModuleFlow(moduleIdNum);

  // Score accumulator for collecting all game type results
  const {
    addGameTypeResult,
    clearAccumulatedResults,
    getAllResults
  } = useScoreContext();

  // Use Level2Game hook to get access to game mode progression tracking
  // We use a default game mode ID since we only need the tracking function
  const { trackGameModeProgression } = useLevel2Game({
    moduleId: moduleId || '1',
    gameModeId: currentGameMode?.id || 'default'
  });

  // Show results modal when flow is complete
  useEffect(() => {
    if (isFlowComplete) {
      setShowResultsModal(true);
    }
  }, [isFlowComplete]);

  const handleGameComplete = async (score: number, currentScore: number, totalCorrect: number, terms: any[], scoreHistory: number[], timeHistory: number[]) => {
    // Store game results for the results modal (legacy - for backward compatibility)
    setGameScore(score);
    setGameCurrentScore(currentScore);
    setGameTotalCorrect(totalCorrect);
    setGameTerms(terms);
    setGameScoreHistory(scoreHistory || []);
    setGameTimeHistory(timeHistory || []);

    // Add the current game type result to the accumulator
    if (currentGameMode) {
      const gameTypeResult: GameTypeResult = {
        gameTypeId: flowState.currentType,
        gameModeId: currentGameMode.id,
        score,
        currentScore,
        totalCorrect,
        terms,
        scoreHistory: scoreHistory || [],
        timeHistory: timeHistory || [],
        time: timeHistory?.[0] || 0, // Use the most recent time
        totalTerms: terms.length,
        placedTerms: terms,
        isCompleted: true,
        completedAt: new Date().toISOString()
      };

      addGameTypeResult(gameTypeResult);

      // Track game mode progression immediately when game mode is completed
      // This ensures the game mode ID is saved to the database right away
      console.log(`Tracking progression for completed game mode: ${currentGameMode.id}`);
      try {
        await trackGameModeProgression();
        console.log(`Successfully tracked game mode progression: ${currentGameMode.id}`);
      } catch (error) {
        console.error('Failed to track game mode progression:', error);
        // Don't block the flow if tracking fails
      }
    }

    // Mark current type as completed
    markCurrentTypeCompleted();
  };

  const handleContinueToNext = () => {
    // Advance to the next type in the sequence
    // The game_mode_ids will be automatically updated when the next game type is played
    // and its data is saved through the saveGameData method
    advanceToNextType();
  };

  const handleBackToHome = () => {
    navigate(`/modules/${moduleId}/levels/2`);
  };

  const handleResultsClose = () => {
    setShowResultsModal(false);
    navigate(`/modules/${moduleId}/levels/2`);
  };

  const handleResultsContinue = () => {
    // Instead of navigating away and losing state, just close the modal
    // This keeps the user in the GameNavigator with all accumulated data intact
    setShowResultsModal(false);
    // Navigate back to the level selection page since the flow is complete
    navigate(`/modules/${moduleId}/levels/2`);
  };

  const handleResultsReset = () => {
    // Reset to the beginning of the game flow
    setShowResultsModal(false);
    clearAccumulatedResults(); // Clear all accumulated game type results
    resetFlow();
  };

  // Show continue button if needed
  if (flowState.showContinueButton) {
    const nextType = getNextTypeInSequence(moduleIdNum, flowState.currentType);
    return (
      <ContinueButton
        onContinue={handleContinueToNext}
        nextType={nextType || 1}
        moduleId={moduleIdNum}
        isMobile={false}
      />
    );
  }

  // Show results modal when flow is complete
  if (showResultsModal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 bg-[url('/Level2/level3bg.webp')] bg-cover bg-center bg-no-repeat relative overflow-hidden">
        <ResultsModal
          showResults={true}
          score={gameScore}
          currentScore={gameCurrentScore}
          totalCorrect={gameTotalCorrect}
          terms={gameTerms}
          isMobile={false}
          onNextLevel={handleResultsContinue}
          onReset={handleResultsReset}
          onClose={handleResultsClose}
          moduleId={moduleIdNum}
          levelId={2}
          scoreHistory={gameScoreHistory}
          timeHistory={gameTimeHistory}
          currentType={flowState.currentType}
          gameModeId={currentGameMode?.id}
          accumulatedResults={getAllResults()}
        />
      </div>
    );
  }

  // If we have a current game mode, show the game interface
  if (currentGameMode) {
    return (
      <GameInterface
        gameMode={currentGameMode}
        moduleId={moduleId || '1'}
        onBack={handleBackToHome}
        onNextLevel={handleGameComplete}
      />
    );
  }

  // Loading state or no game modes available
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 bg-[url('/Level2/level3bg.webp')] bg-cover bg-center bg-no-repeat relative overflow-hidden flex items-center justify-center">
      <div className="text-white text-xl">Loading game...</div>
    </div>
  );
};

const Level2GameNavigator: React.FC = () => {
  return (
    <ScoreProvider>
      <Level2GameNavigatorInner />
    </ScoreProvider>
  );
};

export default Level2GameNavigator;
