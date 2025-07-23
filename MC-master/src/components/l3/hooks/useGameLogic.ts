import { useCallback, useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { GameProgress, PlacedPiecesState } from "../types/gameTypes";
import type { PuzzlePiece } from "../../../data/level3Scenarios";

export const useGameLogic = (
  user: any,
  moduleId: string,
  scenarioIndex: number,
  scenarios: any[]
) => {
  // Game state
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [combo, setCombo] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiecesState>({
    violations: [],
    actions: [],
  });
  const [feedback, setFeedback] = useState("");

  // Current scenario
  const scenario = scenarios[scenarioIndex];

  // Calculate correct pieces
  const correctViolations = scenario?.pieces.filter(
    (p: PuzzlePiece) => p.category === "violation" && p.isCorrect
  ) ?? [];
  
  const correctActions = scenario?.pieces.filter(
    (p: PuzzlePiece) => p.category === "action" && p.isCorrect
  ) ?? [];

  // Available pieces (those not yet placed)
  const availablePieces = scenario?.pieces.filter(
    (piece: PuzzlePiece) =>
      !placedPieces.violations.some((p) => p.id === piece.id) &&
      !placedPieces.actions.some((p) => p.id === piece.id)
  ) ?? [];

  // Handle piece drop on containers
  const handleDrop = useCallback(
    (containerType: "violations" | "actions", piece: PuzzlePiece) => {
      setInitialized(true);

      // Validate if the piece is being dropped in the right container type
      const isCorrectCategory =
        (containerType === "violations" && piece.category === "violation") ||
        (containerType === "actions" && piece.category === "action");

      if (!isCorrectCategory) {
        setFeedback("⚠️ WRONG CATEGORY! Try the other container, Agent!");
        setHealth((prev) => Math.max(0, prev - 10));
        setCombo(0);
        return { success: false };
      }

      // Check if the piece is already placed somewhere
      const isAlreadyPlaced =
        placedPieces.violations.some((p) => p.id === piece.id) ||
        placedPieces.actions.some((p) => p.id === piece.id);

      if (isAlreadyPlaced) {
        setFeedback("⚠️ Already placed! Try another piece!");
        return { success: false };
      }

      // Update state based on whether the piece is correct
      if (piece.isCorrect) {
        setPlacedPieces((prev) => ({
          ...prev,
          [containerType]: [...prev[containerType], piece],
        }));
        setFeedback("🎯 CRITICAL HIT! Perfect placement!");
        setScore((prev) => prev + 100 + combo * 10);
        setCombo((prev) => prev + 1);
        return { success: true };
      } else {
        setFeedback("💥 MISS! Analyze the scenario more carefully!");
        setHealth((prev) => Math.max(0, prev - 15));
        setCombo(0);
        return { success: false };
      }
    },
    [placedPieces, combo]
  );

  // Handle victory popup close and scenario transition
  const handleVictoryClose = useCallback(() => {
    if (scenarioIndex < scenarios.length - 1) {
      // Move to next scenario
      return {
        goToNextScenario: true
      };
    } else {
      // Game completed
      setIsComplete(false);
      return {
        goToNextScenario: false
      };
    }
  }, [scenarioIndex, scenarios.length]);

  // Save game progress to database using Supabase RPC for history tracking
  const saveGameProgress = useCallback(async () => {
    if (!user?.id) return;

    // Try to get level_number and time_taken from scenario or props, fallback to 1 and 0
    const levelNumber = scenario?.level_number || 1;
    const timeTaken = scenario?.time_taken || 0;

    // Debug log to verify parameters
    console.log('Saving progress to Supabase:', {
      p_user_id: user.id,
      p_module_id: moduleId,
      p_level_number: levelNumber,
      p_scenario_index: scenarioIndex,
      p_score: score,
      p_health: health,
      p_combo: combo,
      p_placed_pieces: placedPieces,
      p_is_completed: isComplete,
      p_time_taken: timeTaken
    });

    try {
      const { error } = await supabase.rpc('upsert_level3_progress_with_history', {
        p_user_id: user.id,
        p_module_id: moduleId,
        p_level_number: levelNumber,
        p_scenario_index: scenarioIndex,
        p_score: score,
        p_health: health,
        p_combo: combo,
        p_placed_pieces: placedPieces,
        p_is_completed: isComplete,
        p_time_taken: timeTaken
      });

      if (error) {
        console.error("Error saving progress:", error);
      }
    } catch (error) {
      console.error("Unexpected error saving progress:", error);
    }
  }, [
    user?.id,
    moduleId,
    scenarioIndex,
    score,
    health,
    combo,
    placedPieces,
    isComplete,
    scenario
  ]);

  // Check for game completion
  useEffect(() => {
    const totalCorrect = correctViolations.length + correctActions.length;
    const placedCorrect =
      placedPieces.violations.length + placedPieces.actions.length;

    if (placedCorrect === totalCorrect && totalCorrect > 0) {
      setIsComplete(true);
      setScore((prev) => prev + 1000 + combo * 100);
      setFeedback("");
    }
  }, [placedPieces, combo, correctViolations.length, correctActions.length]);

  // Auto-dismiss feedback after timeout
  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(""), 2500);
    return () => clearTimeout(timeout);
  }, [feedback]);

  // Save game progress when game state changes
  useEffect(() => {
    if (initialized) saveGameProgress();
  }, [
    initialized,
    saveGameProgress,
  ]);

  return {
    // Game state
    score,
    setScore,
    health,
    setHealth,
    combo,
    setCombo,
    isComplete,
    setIsComplete,
    feedback,
    setFeedback,
    placedPieces,
    setPlacedPieces,
    initialized,
    
    // Derived state
    correctViolations,
    correctActions,
    availablePieces,
    
    // Handlers
    handleDrop,
    handleVictoryClose,
    saveGameProgress,
    
    // Reset functions
    resetState: () => {
      setPlacedPieces({ violations: [], actions: [] });
      setIsComplete(false);
      setCombo(0);
      setHealth(100);
    }
  };
};
