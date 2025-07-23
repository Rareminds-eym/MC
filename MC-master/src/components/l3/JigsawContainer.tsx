import React, { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Target, CheckCircle, Puzzle, Zap, Shield, Play, Sparkles } from "lucide-react";
import { useDeviceLayout } from "../../hooks/useOrientation";
import "../Level2/index.css";
interface PuzzlePiece {
  id: string;
  text: string;
  category: "violation" | "action";
  isCorrect: boolean;
}

interface JigsawContainerProps {
  type: "violations" | "actions";
  pieces: PuzzlePiece[];
  maxPieces: number;
}

export const JigsawContainer: React.FC<JigsawContainerProps> = ({ type, pieces, maxPieces }) => {
  const { isMobile, isHorizontal } = useDeviceLayout();
  const { setNodeRef, isOver } = useDroppable({ id: type, data: { type } });
  const isComplete = pieces.length === maxPieces;
  const [showDropAnimation, setShowDropAnimation] = useState(false);
  const [recentlyCompleted, setRecentlyCompleted] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setRecentlyCompleted(true);
      const timer = setTimeout(() => setRecentlyCompleted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  useEffect(() => {
    if (isOver) {
      setShowDropAnimation(true);
    } else {
      const timer = setTimeout(() => setShowDropAnimation(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOver]);

  const gameTheme = {
    violations: {
      name: "Security Vault",
      icon: <Shield className="w-5 h-5" />,
      baseColor: "rgb(239, 68, 68)",
      hoverColor: "rgb(248, 113, 113)",
      glowColor: "rgba(239, 68, 68, 0.6)",
      bgGradient:
        "radial-gradient(circle at top right, rgba(153, 27, 27, 0.4), rgba(15, 23, 42, 0.9))",
      emptySlotMessage: "Security breach needs cataloging!",
    },
    actions: {
      name: "Action Hub",
      icon: <Zap className="w-5 h-5" />,
      baseColor: "rgb(14, 165, 233)",
      hoverColor: "rgb(56, 189, 248)",
      glowColor: "rgba(14, 165, 233, 0.6)",
      bgGradient:
        "radial-gradient(circle at top right, rgba(30, 64, 175, 0.4), rgba(15, 23, 42, 0.9))",
      emptySlotMessage: "Action plan needs strategies!",
    },
  };
  const theme = gameTheme[type];
  const completionPercent = (pieces.length / maxPieces) * 100;
  const progressBarWidth = `${completionPercent}%`;

  // Pixel/retro card style for container, inspired by HomePage.tsx
  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <div className="pixel-border-thick bg-gray-800 p-4 relative overflow-x-hidden overflow-y-auto"
      style={{ height: isMobile ? 'calc(100vh - 70px)' : 'calc(100vh - 220px)' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-50"></div>
        <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500 opacity-10 pixel-corner"></div>

        {/* Header with icon and progress */}
        <div className="flex items-center justify-between lg:mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 pixel-border flex items-center justify-center">
              {theme.icon}
            </div>
            <span className="text-base font-black text-cyan-200 pixel-text tracking-wider">
              {theme.name}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-800 w-full lg:mb-2">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: progressBarWidth,
              background: isComplete
                ? "linear-gradient(to right, #10b981, #34d399)"
                : `linear-gradient(to right, ${theme.baseColor}, ${theme.hoverColor})`,
            }}
          />
        </div>

        {/* Drop zone game board */}
        <div className="lg:p-2">
          {/* Level indicator */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs opacity-80 font-medium text-white">
              {isComplete ? "COMPLETED!" : "DROP PIECES FROM ARSENAL..."}
            </div>
            <div
              className={`text-xs font-bold px-2 py-1 rounded-md flex items-center ${
                isComplete
                  ? "bg-green-500/30 text-green-400"
                  : type === "violations"
                  ? "bg-red-500/30 text-red-400"
                  : "bg-blue-500/30 text-blue-400"
              }`}
            >
              {isComplete && <CheckCircle className="w-3 h-3 mr-1" />}
              {pieces.length}/{maxPieces}
            </div>
          </div>

          {/* Game board */}
          <div
            ref={setNodeRef}
            className={`relative overflow-hidden border-2 rounded-lg transition-all duration-300 ${
              isComplete
                ? "border-green-500/70 bg-green-900/20"
                : type === "violations"
                ? "border-red-500/50 bg-gray-900/50"
                : "border-blue-500/50 bg-gray-900/50"
            } ${
              showDropAnimation ? "border-dashed animate-pulse" : "border-solid"
            }`}
            style={{
              backgroundImage: isOver
                ? "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
                : "none",
              backgroundBlendMode: "overlay",
            }}
          >
            {/* Glowing effect when dragging over */}
            {isOver && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background: `radial-gradient(circle at center, ${theme.glowColor}10 0%, transparent 70%)`,
                }}
              />
            )}

            {/* Success celebration overlay */}
            {recentlyCompleted && (
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <div className="absolute inset-0 animate-fade-out bg-green-500/10" />
              </div>
            )}

            {/* Pieces container */}
            <div className="p-2">
              {pieces.length > 0 ? (
                <div className="flex flex-col gap-3 items-center w-full">
                  {pieces.map((piece, index) => {
                    // --- DraggablePiece.tsx style ---
                    const borderColor = 'border-pink-400';
                    const bgGradient = 'from-fuchsia-900/90 via-indigo-900/80 to-blue-800/80';
                    const glassBg = 'bg-white/20 backdrop-blur-lg';
                    const iconBg = 'bg-gradient-to-br from-pink-500/80 to-fuchsia-400/80 shadow-lg';
                    let icon;
                    if (piece.category === 'violation') {
                      icon = <Zap className="w-4 h-4 text-pink-100 drop-shadow-glow animate-pulse" />;
                    } else if (piece.category === 'action') {
                      icon = <Target className="w-4 h-4 text-cyan-100 drop-shadow-glow animate-pulse" />;
                    } else {
                      icon = <Sparkles className="w-4 h-4 text-pink-100 drop-shadow-glow animate-pulse" />;
                    }
                    return (
                      <div
                        key={piece.id}
                        className={`group relative select-none flex flex-col items-center justify-center
                          bg-gradient-to-br ${bgGradient} text-white p-4 font-extrabold text-center pixel-text tracking-wider
                          shadow-[0_0_24px_4px_#f0f,0_2px_12px_0_#0008]
                          border-4 ${borderColor} pixel-border-thick overflow-hidden
                          ${glassBg}
                          ${isComplete ? 'opacity-80 saturate-150' : ''}
                          transition-all duration-300 ease-out hover:translate-y-[-2px] hover:scale-[1.02] ${index === pieces.length - 1 ? "animate-drop-in" : ""}`}
                        style={{
                          minHeight: '58px',
                          maxWidth: '260px',
                          width: '100%',
                          filter: isComplete ? 'brightness(1.1) grayscale(0.05)' : 'brightness(1.05)',
                          clipPath: 'polygon(0% 15%, 8% 15%, 12% 0%, 20% 0%, 25% 15%, 75% 15%, 80% 0%, 88% 0%, 92% 15%, 100% 15%, 100% 85%, 92% 85%, 88% 100%, 80% 100%, 75% 85%, 25% 85%, 20% 100%, 12% 100%, 8% 85%, 0% 85%)',
                          borderRadius: '12px',
                          boxShadow: isComplete
                            ? '0 0 0 4px #fff, 0 0 32px 8px #0f0, 0 0 12px 2px #fff, 0 0 0 2px #0f08'
                            : '0 2px 12px 0 #0008, 0 0 0 2px #fff4',
                        }}
                      >
                        {/* Neon Scanline/Glow Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 via-fuchsia-400/5 to-blue-400/5 pointer-events-none z-10 mix-blend-lighten" />
                        <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none z-20" />
                        <div className="absolute -inset-1 bg-pink-400/10 blur-2xl pointer-events-none z-0" />

                        {/* Category Icon */}
                        <div className="absolute top-2 left-2 opacity-90 z-30 drop-shadow-glow">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg} border-2 border-pink-200/40 shadow-lg`}>
                            {icon}
                          </div>
                        </div>

                        {/* Cyberpunk Sparkle/Retro Effect */}
                        <div className="absolute top-2 right-2 z-30 flex gap-1 items-center">
                          <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse group-hover:animate-spin drop-shadow-glow" />
                          <Zap className="w-4 h-4 text-pink-300 animate-pulse group-hover:animate-spin drop-shadow-glow" />
                        </div>

                        {/* Main Content */}
                        <div className="relative z-40 pointer-events-none h-full my-auto flex items-center justify-center text-center w-full">
                          <div className="w-full text-base leading-tight drop-shadow-glow flex items-center justify-center text-center px-1" style={{textShadow:'0 2px 8px #f0f8, 0 1px 0 #fff8'}}>
                            {piece.text}
                          </div>
                        </div>

                        {/* Pixel Connectors (Visual Enhancement) */}
                        <div className="absolute top-0 left-1/4 w-2 h-1 bg-pink-200/40 rounded-b-full shadow-pink-400/30" />
                        <div className="absolute top-0 right-1/4 w-2 h-1 bg-pink-200/40 rounded-b-full shadow-pink-400/30" />
                        <div className="absolute bottom-0 left-1/4 w-2 h-1 bg-pink-200/40 rounded-t-full shadow-pink-400/30" />
                        <div className="absolute bottom-0 right-1/4 w-2 h-1 bg-pink-200/40 rounded-t-full shadow-pink-400/30" />
                      </div>
                    );
                  })}
                  {/* Empty slots with game style */}
                  {Array.from({ length: maxPieces - pieces.length }, (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className={`p-3 min-h-[52px] flex items-center justify-center w-full transition-all duration-300 ${
                        isOver ? "bg-gray-800/60" : "bg-gray-900/30"
                      } ${isOver ? "animate-quick-pulse" : ""}`}
                      style={{
                        clipPath:
                          "polygon(0% 15%, 8% 15%, 12% 0%, 20% 0%, 25% 15%, 75% 15%, 80% 0%, 88% 0%, 92% 15%, 100% 15%, 100% 85%, 92% 85%, 88% 100%, 80% 100%, 75% 85%, 25% 85%, 20% 100%, 12% 100%, 8% 85%, 0% 85%)",
                        border: `2px dashed ${
                          type === "violations"
                            ? "rgba(239, 68, 68, 0.3)"
                            : "rgba(14, 165, 233, 0.3)"
                        }`,
                      }}
                    >
                      <Target
                        className={`w-4 h-4 ${
                          isOver ? "opacity-100" : "opacity-60"
                        } ${
                          type === "violations"
                            ? "text-red-400"
                            : "text-blue-400"
                        } ${isOver ? "animate-ping" : "animate-pulse"}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center py-8 px-2 transition-all duration-300 ${
                    isOver ? "bg-gray-800/50 scale-95" : ""
                  }`}
                  style={{
                    clipPath:
                      "polygon(0% 15%, 8% 15%, 12% 0%, 20% 0%, 25% 15%, 75% 15%, 80% 0%, 88% 0%, 92% 15%, 100% 15%, 100% 85%, 92% 85%, 88% 100%, 80% 100%, 75% 85%, 25% 85%, 20% 100%, 12% 100%, 8% 85%, 0% 85%)",
                    border: `2px dashed ${
                      type === "violations"
                        ? "rgba(239, 68, 68, 0.3)"
                        : "rgba(14, 165, 233, 0.3)"
                    }`,
                  }}
                >
                  <Puzzle
                    className={`w-10 h-10 mb-2 animate-pulse ${
                      type === "violations" ? "text-red-400" : "text-blue-400"
                    }`}
                  />
                  <p className="text-sm text-gray-400 text-center font-medium game-font">
                    {theme.emptySlotMessage}
                  </p>
                  <div className="mt-3">
                    <div
                      className={`px-3 py-1 rounded-md border ${
                        type === "violations"
                          ? "border-red-600/50 text-red-400"
                          : "border-blue-600/50 text-blue-400"
                      } text-xs animate-pulse`}
                    >
                      DROP HERE
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom display - like a game console */}
          {isComplete && !isMobile && (
            <div className="mt-4 flex justify-center">
              <div className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 p-2">
                <div className="flex items-center justify-center text-white font-black text-sm pixel-text">
                  <Play className="w-4 h-4 mr-2" />
                  ALL PLACED!
                </div>
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
