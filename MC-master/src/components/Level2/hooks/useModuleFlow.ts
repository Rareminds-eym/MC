import { useState, useEffect, useCallback } from 'react';
import {
  getModuleFlowConfig, 
  getNextTypeInSequence, 
  isLastTypeInSequence,
  getFirstTypeInSequence,
  moduleRequiresContinueButton,
  getGameModesByModuleAndType
} from '../data/gameModes';
import { GameMode } from '../../../types/Level2/types';

export interface FlowState {
  currentType: number;
  isLastType: boolean;
  requiresContinueButton: boolean;
  showContinueButton: boolean;
  canProceedToResults: boolean;
  typeCompleted: boolean;
}

export interface UseModuleFlowReturn {
  flowState: FlowState;
  currentGameMode: GameMode | null;
  advanceToNextType: () => void;
  markCurrentTypeCompleted: () => void;
  resetFlow: () => void;
  isFlowComplete: boolean;
}

export const useModuleFlow = (moduleId: number): UseModuleFlowReturn => {
  const [currentType, setCurrentType] = useState<number>(1);
  const [typeCompleted, setTypeCompleted] = useState<boolean>(false);
  const [currentGameMode, setCurrentGameMode] = useState<GameMode | null>(null);

  const flowConfig = getModuleFlowConfig(moduleId);

  // Initialize with the first type in the sequence
  useEffect(() => {
    const firstType = getFirstTypeInSequence(moduleId);
    if (firstType !== null) {
      setCurrentType(firstType);
      setTypeCompleted(false);
    }
  }, [moduleId]);

  // Update current game mode when type changes
  useEffect(() => {
    const gameModes = getGameModesByModuleAndType(moduleId, currentType);
    if (gameModes.length > 0) {
      setCurrentGameMode(gameModes[0]);
    } else {
      setCurrentGameMode(null);
    }
  }, [moduleId, currentType]);

  const isLastType = isLastTypeInSequence(moduleId, currentType);
  const requiresContinueButton = moduleRequiresContinueButton(moduleId);

  // Show continue button only if:
  // 1. Module requires continue buttons
  // 2. Current type is completed
  // 3. It's not the last type in sequence
  const showContinueButton = requiresContinueButton && typeCompleted && !isLastType;

  // Can proceed to results if:
  // 1. Current type is completed AND
  // 2. It's the last type in sequence OR module doesn't require continue buttons
  const canProceedToResults = typeCompleted && (isLastType || !requiresContinueButton);

  const flowState: FlowState = {
    currentType,
    isLastType,
    requiresContinueButton,
    showContinueButton,
    canProceedToResults,
    typeCompleted
  };

  const advanceToNextType = useCallback(() => {
    const nextType = getNextTypeInSequence(moduleId, currentType);
    if (nextType !== null) {
      setCurrentType(nextType);
      setTypeCompleted(false); // Reset completion status for new type
    }
  }, [moduleId, currentType]);

  const markCurrentTypeCompleted = useCallback(() => {
    setTypeCompleted(true);
  }, []);

  const resetFlow = useCallback(() => {
    const firstType = getFirstTypeInSequence(moduleId);
    if (firstType !== null) {
      setCurrentType(firstType);
      setTypeCompleted(false);
    }
  }, [moduleId]);

  const isFlowComplete = typeCompleted && isLastType;

  return {
    flowState,
    currentGameMode,
    advanceToNextType,
    markCurrentTypeCompleted,
    resetFlow,
    isFlowComplete
  };
};
