import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { getGameModesByModuleAndType } from '../data/gameModes';

interface ContinueButtonProps {
  onContinue: () => void;
  nextType: number;
  moduleId: number;
  isMobile?: boolean;
  disabled?: boolean;
  className?: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  onContinue,
  nextType,
  moduleId,
  isMobile = false,
  disabled = false,
  className = ''
}) => {
  const getNextTypeLabel = (moduleId: number, type: number): string => {
    // Get game modes for the specific module and type combination
    const gameModes = getGameModesByModuleAndType(moduleId, type);

    // If we found a game mode, extract the title and clean it up
    if (gameModes.length > 0) {
      const title = gameModes[0].title;
      // Remove emoji and extra formatting from the title
      return title.replace(/^[^\w\s]+\s*/, '').trim();
    }

    // Fallback to generic label if no game mode found
    return `Type ${type}`;
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 ${className}`}>
      <div className={`pixel-border-thick bg-gray-800 relative overflow-hidden ${
        isMobile
          ? 'w-11/12 max-w-md p-4'
          : 'p-6 max-w-lg w-full'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
        
        <div className="relative z-10 text-center">
          {/* Mission Complete Header */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm font-bold mb-2 pixel-text">MISSION COMPLETE</div>
            <div className="text-2xl font-black text-green-400 mb-2 pixel-text">
              🎯 EXCELLENT WORK!
            </div>
            <div className="text-gray-300 text-base pixel-text">
              Ready for the next challenge?
            </div>
          </div>

          {/* Next Activity Info */}
          <div className="mb-6 p-4 bg-gray-900 bg-opacity-50 pixel-border">
            <div className="text-gray-400 text-xs font-bold mb-2 pixel-text">NEXT ACTIVITY</div>
            <div className="text-yellow-400 text-lg font-black pixel-text">
              {getNextTypeLabel(moduleId, nextType)}
            </div>
            <div className="text-gray-300 text-sm pixel-text mt-1">
              Type {nextType} Classification Challenge
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            disabled={disabled}
            className={`w-full pixel-border-thick bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-black text-lg pixel-text transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              isMobile ? 'px-4 py-3' : 'px-6 py-4'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>CONTINUE TO NEXT</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>

          {/* Progress Indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="text-gray-400 text-xs pixel-text">PROGRESS:</div>
            <div className="flex space-x-1">
              {[1, 2, 3].map((type) => (
                <div
                  key={type}
                  className={`w-3 h-3 pixel-border ${
                    type < nextType
                      ? 'bg-green-400'
                      : type === nextType
                      ? 'bg-yellow-400'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueButton;
