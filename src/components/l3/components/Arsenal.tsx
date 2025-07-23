import React, { RefObject } from "react";
import { Zap, Play } from "lucide-react";
import { DraggablePiece } from "../DraggablePiece";
import type { PuzzlePiece } from "../../../data/level3Scenarios";
import '../../Level2/index.css';

interface ArsenalProps {
  availablePieces: PuzzlePiece[];
  arsenalRef: RefObject<HTMLDivElement>;
  isMobile: boolean;
  isHorizontal: boolean;
}

export const Arsenal: React.FC<ArsenalProps> = ({
  availablePieces,
  arsenalRef,
  isMobile,
  isHorizontal
}) => {
  // Pixel/retro card style for arsenal, matching JigsawContainer.tsx
  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <div className="pixel-border-thick bg-gray-800 p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-50"></div>
        <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500 opacity-10 pixel-corner"></div>

        {/* Header with icon and title */}
        <div className="flex items-center justify-between lg:mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 pixel-border flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-300 animate-flicker" />
            </div>
            <span className="text-base font-black text-cyan-200 pixel-text tracking-wider">ARSENAL</span>
          </div>
        </div>

        {/* Pieces List */}
        <div
          ref={arsenalRef}
          className="overflow-y-auto flex-1 min-h-0 flex flex-col items-center custom-scrollbar relative z-10 w-full px-2 py-2 gap-3"
          style={{ maxHeight: isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 300px)' }}
        >
          {availablePieces.length > 0 ? (
            <div className="flex flex-col gap-3 items-center w-full">
              {availablePieces.map((piece: PuzzlePiece) => (
                <DraggablePiece key={piece.id} piece={piece} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-2 transition-all duration-300" style={{
              clipPath:
                "polygon(0% 15%, 8% 15%, 12% 0%, 20% 0%, 25% 15%, 75% 15%, 80% 0%, 88% 0%, 92% 15%, 100% 15%, 100% 85%, 92% 85%, 88% 100%, 80% 100%, 75% 85%, 25% 85%, 20% 100%, 12% 100%, 8% 85%, 0% 85%)",
              border: "2px dashed rgba(14, 165, 233, 0.3)",
            }}>
              <Zap className="w-10 h-10 mb-2 animate-pulse text-blue-400" />
              <p className="text-sm text-gray-400 text-center font-medium game-font">No pieces left!</p>
              <div className="mt-3">
                <div className="px-3 py-1 rounded-md border border-blue-600/50 text-blue-400 text-xs animate-pulse">ALL PLACED!</div>
              </div>
            </div>
          )}
        </div>

        {/* Scan Lines Effect */}
        <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none"></div>

        {/* Glow Effect on Hover (optional) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 hover:opacity-30 transition-opacity duration-300 pixel-glow"></div>
      </div>
    </div>
  );
};
