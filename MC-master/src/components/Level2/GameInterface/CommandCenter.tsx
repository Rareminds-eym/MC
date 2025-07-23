import React from 'react';
import { Gamepad2, Crown, CheckCircle } from 'lucide-react';
import { Term } from '../../../types/Level2/types';
import DraggableTerm from '../DraggableTerm';

interface CommandCenterProps {
  unassignedTerms: Term[];
  currentScore: number;
  progress: number;
  hasExecuted: boolean;
  isMobile: boolean;
  moduleId: number;
  type: number;
}

const CommandCenter: React.FC<CommandCenterProps> = ({
  unassignedTerms,
  currentScore,
  progress,
  hasExecuted,
  isMobile,
  moduleId,
  type,
}) => {
  if (isMobile) {
    return (
      <div className="w-482 bg-slate-800 rounded-lg p-2 flex flex-col shadow-lg border border-slate-600">
        {/* Items Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-black text-cyan-300 pixel-text">Items</h3>
          <div className="text-slate-400 text-mobile2 font-bold">
            {unassignedTerms.length} remaining
          </div>
        </div>
        <div className="text-cyan-400 text-[10px] font-bold mb-1">Drag to Categories</div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 text-mobile1 font-bold">PROGRESS</span>
            <span className="text-white text-mobile2  font-black">{Math.round(progress)}%</span>
          </div>
          <div className="bg-slate-700 rounded-full h-1.5 overflow-hidden shadow-inner border border-slate-600">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-500 ease-out "
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            {unassignedTerms.map((term) => (
              <div key={term.id}>
                <DraggableTerm
                  term={term}
                  showResults={false}
                />
              </div>
            ))}
            {unassignedTerms.length === 0 && !hasExecuted && (
              <div className="text-center py-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg mx-auto mb-1 flex items-center justify-center animate-bounce shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <p className="text-green-400 font-black pixel-text text-xs">ALL DEPLOYED!</p>
                <p className="text-slate-400 text-xs">Auto-executing...</p>
              </div>
            )}
            {unassignedTerms.length === 0 && hasExecuted && (
              <div className="text-center py-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto mb-1 flex items-center justify-center animate-pulse shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-blue-400 font-black pixel-text text-xs">MISSION COMPLETE!</p>
                <p className="text-slate-400 text-xs">Ready for review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 flex-shrink-0 md:h-[40em]">
      <div className="pixel-border-thick bg-gray-800 p-4 h-full overflow-hidden flex flex-col">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Command Center Header */}
          <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
            <div className="w-6 h-6 bg-cyan-500 pixel-border flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-cyan-900" />
            </div>
            <div>
              <h2 className="text-sm font-black text-cyan-300 pixel-text">COMMAND CENTER</h2>
              <div className="text-xs text-gray-400 font-bold">
                MODULE: {moduleId} | TYPE: {type} | ITEMS: {unassignedTerms.length}
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="mb-3 pixel-border bg-gradient-to-r from-yellow-600 to-orange-600 p-2 flex-shrink-0">
            <div className="text-center">
              <div className="text-yellow-100 text-xs font-bold mb-1">CURRENT SCORE</div>
              <div className="text-white text-lg font-black pixel-text">{currentScore.toString().padStart(2, '0')}/40</div>
              <div className="text-yellow-200 text-xs font-bold">+5 per correct item</div>
            </div>
          </div>

          {/* Items Pool - Flexible Height */}
          <div className="flex-1 overflow-y-auto mb-3">
            <div className="space-y-2">
              {unassignedTerms.map((term, index) => (
                <div
                  key={term.id}
                  className="animate-slideIn "
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DraggableTerm
                    term={term}
                    showResults={false}
                  />
                </div>
              ))}
              {unassignedTerms.length === 0 && !hasExecuted && (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-500 pixel-border mx-auto mb-2 flex items-center justify-center animate-bounce">
                    <Crown className="w-6 h-6 text-green-900" />
                  </div>
                  <p className="text-green-300 font-black pixel-text text-xs">ALL DEPLOYED!</p>
                  <p className="text-xs text-gray-400">Auto-executing mission...</p>
                </div>
              )}
              {unassignedTerms.length === 0 && hasExecuted && (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-blue-500 pixel-border mx-auto mb-2 flex items-center justify-center animate-pulse">
                    <CheckCircle className="w-6 h-6 text-blue-900" />
                  </div>
                  <p className="text-blue-300 font-black pixel-text text-xs">MISSION COMPLETE!</p>
                  <p className="text-xs text-gray-400">Ready for review</p>
                </div>
              )}
            </div>
          </div>

          {/* Mission Progress */}
          <div className="flex-shrink-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-cyan-300 text-xs font-bold pixel-text">PROGRESS</span>
              <span className="text-white text-xs font-black">{Math.round(progress)}%</span>
            </div>
            <div className="pixel-border bg-gray-900 h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out pixel-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
