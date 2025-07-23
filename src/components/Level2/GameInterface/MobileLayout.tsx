import React from 'react';
import { Term, Category } from '../../../types/Level2/types';
import GameHeader from './GameHeader';
import CommandCenter from './CommandCenter';
import CategoryGrid from './CategoryGrid';

interface MobileLayoutProps {
  gameTitle: string;
  onBack: () => void;
  onReset: () => void;
  currentScore: number;
  correctCount: number;
  timeElapsed: number;
  moves: number;
  unassignedTerms: Term[];
  progress: number;
  hasExecuted: boolean;
  categories: Category[];
  getTermsInCategory: (categoryId: string) => Term[];
  correctTerms: Set<string>;
  incorrectTerms: Set<string>;
  moduleId: number;
  type: number;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  gameTitle,
  onBack,
  onReset,
  currentScore,
  correctCount,
  timeElapsed,
  moves,
  unassignedTerms,
  progress,
  hasExecuted,
  categories,
  getTermsInCategory,
  correctTerms,
  incorrectTerms,
  moduleId,
  type,
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Top Header */}
      <GameHeader
        gameTitle={gameTitle}
        onBack={onBack}
        onReset={onReset}
        currentScore={currentScore}
        correctCount={correctCount}
        timeElapsed={timeElapsed}
        moves={moves}
        isMobile={true}
      />

      {/* Main Game Area - Items Left, Categories Right */}
      <div className="flex-1 flex space-x-1 min-h-0">
        {/* Left Side - Items Panel */}
        <CommandCenter
          unassignedTerms={unassignedTerms}
          currentScore={currentScore}
          progress={progress}
          hasExecuted={hasExecuted}
          isMobile={true}
          moduleId={moduleId}
          type={type}
        />

        {/* Right Side - Drop Zones - HORIZONTAL LAYOUT */}
        <CategoryGrid
          categories={categories}
          getTermsInCategory={getTermsInCategory}
          correctTerms={correctTerms}
          incorrectTerms={incorrectTerms}
          isMobile={true}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
