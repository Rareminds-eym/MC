import React, { createContext, useContext, ReactNode } from 'react';
import { useScoreAccumulator, UseScoreAccumulatorReturn } from '../hooks/useScoreAccumulator';

interface ScoreContextType extends UseScoreAccumulatorReturn {}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

interface ScoreProviderProps {
  children: ReactNode;
}

export const ScoreProvider: React.FC<ScoreProviderProps> = ({ children }) => {
  const scoreAccumulator = useScoreAccumulator();

  return (
    <ScoreContext.Provider value={scoreAccumulator}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScoreContext = (): ScoreContextType => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScoreContext must be used within a ScoreProvider');
  }
  return context;
};
