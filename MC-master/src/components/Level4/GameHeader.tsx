import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface GameHeaderProps {
  currentCase: number;
  totalCases: number;
  score: number;
  totalQuestions: number;
  onBack?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ currentCase, totalCases, score, totalQuestions, onBack }) => {
  return (
    <header className="game-header flex flex-col  items-center justify-center py-1 text-center w-full">
      {onBack && (
        <div className="w-full flex justify-start mb-2">
          <button
            onClick={onBack}
            className="px-1 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold flex items-center space-x-1 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      )}
      <div className="flex flex-col items-center w-full ">
        {/* <h2 className="text-xl md:text-2xl font-black text-cyan-300 pixel-text mb-1 text-center w-full">Deviation Investigation Game</h2> */}
        <div className="flex flex-row items-center justify-center gap-3 mt-2 w-full">
          <span className="pixel-border bg-blue-900 px-3 py-1.5 text-blue-300 font-bold text-xs md:text-base text-center shadow-md pixel-text">Case <span className="text-white font-black">{currentCase}</span> / {totalCases}</span>
          <span className="pixel-border bg-orange-600 px-3 py-1.5 text-orange-100 font-bold text-xs md:text-base text-center shadow-md pixel-text">Score <span className="text-white font-black">{score}</span></span>
          <span className="pixel-border bg-yellow-500 px-3 py-1.5 text-yellow-100 font-bold text-xs md:text-base text-center shadow-md pixel-text">Questions <span className="text-white font-black">{totalQuestions}</span></span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
export { GameHeader };