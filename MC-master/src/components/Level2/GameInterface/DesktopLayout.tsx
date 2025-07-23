import React from 'react';
import { Term, Category } from '../../../types/Level2/types';
import GameHeader from './GameHeader';
import CommandCenter from './CommandCenter';
import CategoryGrid from './CategoryGrid';

interface DesktopLayoutProps {
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

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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
    <div className="h-screen flex flex-col">
      {/* Desktop Header */}
      <GameHeader
        gameTitle={gameTitle}
        onBack={onBack}
        onReset={onReset}
        currentScore={currentScore}
        correctCount={correctCount}
        timeElapsed={timeElapsed}
        moves={moves}
        isMobile={false}
      />

      {/* Main Game Grid - Flex Layout for Single Screen */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Command Center / Terms Pool */}
        <CommandCenter
          unassignedTerms={unassignedTerms}
          currentScore={currentScore}
          progress={progress}
          hasExecuted={hasExecuted}
          isMobile={false}
          moduleId={moduleId}
          type={type}
        />

        {/* Target Zones - Horizontal Layout for Single Screen */}
        <CategoryGrid
          categories={categories}
          getTermsInCategory={getTermsInCategory}
          correctTerms={correctTerms}
          incorrectTerms={incorrectTerms}
          isMobile={false}
        />
      </div>
    </div>
  );
};

export default DesktopLayout;
