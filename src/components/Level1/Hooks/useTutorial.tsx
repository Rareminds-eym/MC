import React, { useState, useEffect } from 'react';
import { Lightbulb, Target, CheckCircle, Trophy, Sparkles } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'center';
  highlight?: string;
  trigger?: 'auto' | 'interaction';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to GMP Bingo!',
    message: 'Learn Good Manufacturing Practice terms while having fun! This interactive tutorial will guide you through your first game.',
    icon: React.createElement(Sparkles, { className: "h-5 w-5 text-white" }),
    position: 'center',
    trigger: 'auto'
  },
  {
    id: 2,
    title: 'Definition Panel',
    message: 'Read the definition shown in the panel after the countdown, then click the matching term on the Bingo grid. Complete all grids to proceed to Level2!',
    icon: React.createElement(Lightbulb, { className: "h-5 w-5 text-white" }),
    position: 'top',
    highlight: 'Look for the definition in the highlighted container',
    trigger: 'auto'
  },
  {
    id: 3,
    title: 'The Bingo Panel',
    message: 'Select the correct term that matches the definition best. ',
    icon: React.createElement(Target, { className: "h-5 w-5 text-white" }),
    position: 'top',
    highlight: 'Hover any term on the Bingo Panel and see how it pops out!',
    trigger: 'interaction'
  },
  {
    id: 4,
    title: 'Track Your Progress',
    message: 'Check your stats in the menu bar to see your timer, score, and rows completed. The navbar shows your current level.',
    icon: React.createElement(Trophy, { className: "h-5 w-5 text-white" }),
    position: 'top',
    highlight: '5 cell completion = 1 row(line) = 10m points', // Updated highlight text
    trigger: 'auto'
  },
  {
    id: 5,
    title: 'Ready to Play!',
    message: 'You\'re all set! Complete horizontal, vertical, or diagonal lines to win. Good luck learning Good Manufacturing Practices terms!',
    icon: React.createElement(CheckCircle, { className: "h-5 w-5 text-white" }),
    position: 'center',
    trigger: 'auto'
  }
];

interface TutorialState {
  isFirstTime: boolean;
  hasCompletedTutorial: boolean;
  currentStepIndex: number;
  isActive: boolean;
  waitingForInteraction: boolean;
}

const TUTORIAL_STORAGE_KEY = 'qualityBingoTutorialState';

export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isFirstTime: true,
    hasCompletedTutorial: false,
    currentStepIndex: 0,
    isActive: false,
    waitingForInteraction: false
  });

  // Initialize tutorial state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setTutorialState(prev => ({
          ...prev,
          isFirstTime: false,
          hasCompletedTutorial: parsedState.hasCompletedTutorial || false
        }));
      } catch (error) {
        console.warn('Failed to parse tutorial state from localStorage:', error);
      }
    }
  }, []);

  // Auto-start tutorial for first-time users
  useEffect(() => {
    if (tutorialState.isFirstTime && !tutorialState.hasCompletedTutorial && !tutorialState.isActive) {
      // Small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        startTutorial();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [tutorialState.isFirstTime, tutorialState.hasCompletedTutorial, tutorialState.isActive]);

  const startTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 0,
      waitingForInteraction: false
    }));
  };

  const nextStep = () => {
    const nextIndex = tutorialState.currentStepIndex + 1;
    
    if (nextIndex < tutorialSteps.length) {
      const nextStep = tutorialSteps[nextIndex];
      
      setTutorialState(prev => ({
        ...prev,
        currentStepIndex: nextIndex,
        waitingForInteraction: nextStep.trigger === 'interaction'
      }));
    } else {
      completeTutorial();
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    const newState = {
      isFirstTime: false,
      hasCompletedTutorial: true,
      currentStepIndex: 0,
      isActive: false,
      waitingForInteraction: false
    };

    setTutorialState(newState);
    
    // Save completion state to localStorage
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify({
      hasCompletedTutorial: true
    }));
  };

  const onUserInteraction = () => {
    if (tutorialState.waitingForInteraction && tutorialState.currentStepIndex === 2) {
      setTutorialState(prev => ({
        ...prev,
        waitingForInteraction: false
      }));
      // Do NOT auto-advance after user interaction; wait for user to press Next
    }
  };

  const resetTutorial = () => {
    // Clear localStorage
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    
    // Reset state and start tutorial
    setTutorialState({
      isFirstTime: true,
      hasCompletedTutorial: false,
      currentStepIndex: 0,
      isActive: false,
      waitingForInteraction: false
    });
    
    // Start tutorial after state reset
    setTimeout(() => {
      startTutorial();
    }, 100);
  };

  const getCurrentStep = () => {
    if (!tutorialState.isActive || tutorialState.currentStepIndex >= tutorialSteps.length) {
      return null;
    }
    return tutorialSteps[tutorialState.currentStepIndex];
  };

  return {
    isActive: tutorialState.isActive,
    currentStep: getCurrentStep(),
    nextStep,
    skipTutorial,
    onUserInteraction,
    resetTutorial,
    hasStarted: tutorialState.isActive,
    waitingForInteraction: tutorialState.waitingForInteraction,
    isFirstTime: tutorialState.isFirstTime,
    hasCompletedTutorial: tutorialState.hasCompletedTutorial
  };
};