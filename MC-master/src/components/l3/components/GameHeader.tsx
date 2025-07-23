import React from "react";
import { 
  ArrowLeftCircle, 
  Menu, 
  X,
  FileText 
} from "lucide-react";
import { PlacedPiecesState } from "../types/gameTypes";
import { GameMenu } from "./GameMenu";

interface GameHeaderProps {
  isComplete: boolean;
  placedPieces: PlacedPiecesState;
  correctViolations: any[];
  correctActions: any[];
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  displayName: string;
  score: number;
  health: number;
  combo: number;
  setShowScenario: (show: boolean) => void;
  onResetProgress?: () => void;
  isMobile: boolean;
  isHorizontal: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  isComplete,
  placedPieces,
  correctViolations,
  correctActions,
  isMenuOpen,
  setIsMenuOpen,
  displayName,
  score,
  health,
  combo,
  setShowScenario,
  onResetProgress,
  isMobile,
  isHorizontal
}) => {
  return (
    <header className="relative w-full flex flex-row items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-900/90 to-blue-900/90 rounded-xl border border-cyan-500/50 shadow-lg backdrop-blur-sm z-50">
      {/* Left: Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 bg-gradient-to-r from-purple-700 to-indigo-900 text-white rounded-lg font-bold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg border-2 border-cyan-400/50 flex items-center justify-center focus:outline-none transform hover:scale-105 active:scale-95"
          aria-label="Back"
          style={{
            boxShadow: "0 0 10px rgba(6, 182, 212, 0.5)",
            textShadow: "0 0 5px rgba(255, 255, 255, 0.5)"
          }}
        >
          <ArrowLeftCircle className="w-5 h-5 animate-pulse" />
        </button>
      </div>

      {/* Center: Mission Title & Progress */}
      <div className="flex flex-col items-center flex-1 px-4">
        <h1 className="text-xl font-extrabold text-white game-font tracking-wide mb-1 flex items-center gap-2">
          <span className="text-white">LEVEL 3: FIX THE VIOLATION</span>
        </h1>

        {/* Progress Bar */}
        <div className="w-full max-w-xs h-1.5 bg-gray-800 rounded-full overflow-hidden border border-cyan-400/50">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-500"
            style={{
              width: isComplete
                ? "100%"
                : `${Math.min(
                    100,
                    ((placedPieces.violations.length +
                      placedPieces.actions.length) /
                      (correctViolations.length +
                        correctActions.length)) *
                      100
                  )}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Right: Mission Brief and Menu Buttons */}
      <div className="relative z-[900] flex items-center gap-2">
        {/* Mission Brief Button */}
        <div className="group relative">
          <button
            onClick={() => {
              setShowScenario(true);
            }}
            className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-bold hover:brightness-110 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border-2 border-yellow-300/50 flex items-center justify-center focus:outline-none game-font"
            aria-label="Mission Brief"
            style={{
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)',
            }}
          >
            <FileText className="w-5 h-5 animate-pulse" />
          </button>
          {/* Tooltip */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-xs text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-yellow-400/30 pointer-events-none">
            MISSION BRIEF
          </div>
        </div>

        {/* Menu Button */}
        <div className="group relative">
          <button
            onClick={() => {
              const newMenuState = !isMenuOpen;
              console.log("Menu button clicked, isMenuOpen:", isMenuOpen, "-> new state:", newMenuState);
              setIsMenuOpen(newMenuState);
            }}
            className={`p-2 ${isMenuOpen ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} text-white rounded-lg font-bold hover:brightness-110 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg border-2 border-cyan-300/50 flex items-center justify-center focus:outline-none game-font`}
            aria-label="Menu"
            style={{
              boxShadow: `0 0 15px ${isMenuOpen ? 'rgba(239, 68, 68, 0.6)' : 'rgba(6, 182, 212, 0.6)'}`,
            }}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 animate-pulse" />
            ) : (
              <Menu className="w-5 h-5 animate-pulse" />
            )}
          </button>
          {/* Tooltip */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-xs text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-cyan-400/30 pointer-events-none">
            {isMenuOpen ? 'CLOSE MENU' : 'GAME MENU'}
          </div>
        </div>
        
        {/* Menu Dropdown */}
        <GameMenu 
          displayName={displayName}
          score={score}
          health={health}
          combo={combo}
          isMobile={isMobile}
          isHorizontal={isHorizontal}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onResetProgress={onResetProgress}
        />
      </div>
    </header>
  );
};
