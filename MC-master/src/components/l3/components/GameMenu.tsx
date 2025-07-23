import React, { useState } from "react";
import { User, Trophy, Heart, Zap, RefreshCw } from "lucide-react";

interface GameMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  displayName: string;
  score: number;
  health: number;
  combo: number;
  onResetProgress?: () => void;
  isMobile: boolean;
  isHorizontal: boolean;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  displayName,
  score,
  health,
  combo,
  onResetProgress,
  isMobile,
  isHorizontal
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  if (!isMenuOpen) return null;

    return (
    <>
      {/* Overlay to close menu when clicking outside */}
      <div
        className="fixed inset-0 bg-transparent z-[40]"
        onMouseDown={() => setIsMenuOpen(false)}
      />

      {/* Menu Content */}
      <div
        className={`absolute right-0 top-full mt-2 bg-gradient-to-br from-gray-900/98 to-blue-900/98 rounded-xl border border-cyan-500/50 shadow-2xl backdrop-blur-md z-[999] overflow-auto pointer-events-auto${
          isMobile && isHorizontal
            ? " compact-dropdown-mobile-horizontal"
            : " w-72"
        }`}
        style={{
          minWidth: isMobile && isHorizontal ? "12rem" : "18rem",
          maxWidth: isMobile && isHorizontal ? "90vw" : "22rem",
          width: isMobile && isHorizontal ? "90vw" : "22rem",
          height: "min-content",
          maxHeight: isMobile && isHorizontal ? "70vh" : "80vh",
          padding:
            isMobile && isHorizontal
              ? "0.5rem 0.5rem"
              : "1rem 1.2rem",
          boxSizing: "border-box",
          overflowX: "hidden",
          overflowY: "auto",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Menu Header */}
        <div
          className={`border-b border-cyan-500/30${
            isMobile && isHorizontal ? " px-2 py-1" : " px-4 py-3"
          }`}
        >
          <h3
            className={`text-sm font-bold text-cyan-300 flex items-center gap-2${
              isMobile && isHorizontal ? " text-xs" : ""
            }`}
          >
            <User
              className={`w-4 h-4${
                isMobile && isHorizontal ? " w-3 h-3" : ""
              }`}
            />
            AGENT STATUS
          </h3>
        </div>

        {/* Agent Info */}
        <div
          className={`space-y-2${
            isMobile && isHorizontal ? " p-2" : " p-4 space-y-3"
          }`}
        >
          {/* Agent Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border border-yellow-300 shadow${
                  isMobile && isHorizontal
                    ? " w-6 h-6 text-base"
                    : " w-8 h-8 text-lg"
                }`}
              >
                <span className="font-bold text-black">🕵️‍♂️</span>
              </span>
              <div>
                <div
                  className={`text-cyan-200 font-bold${
                    isMobile && isHorizontal
                      ? " text-xs"
                      : " text-sm"
                  }`}
                >
                  {displayName}
                </div>
                <div
                  className={`text-xs text-cyan-400${
                    isMobile && isHorizontal ? " leading-tight" : ""
                  }`}
                >
                  Level 3 Operative
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            className={`grid grid-cols-2 gap-2${
              isMobile && isHorizontal ? "" : " gap-3"
            }`}
          >
            {/* Score Box */}
            <div
              className={`bg-black/30 rounded-lg border border-green-400/50${
                isMobile && isHorizontal ? " p-2" : " p-3"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Trophy
                  className={`w-4 h-4 text-green-400${
                    isMobile && isHorizontal ? " w-3 h-3" : ""
                  }`}
                />
                <span className="text-xs font-bold text-green-300">
                  SCORE
                </span>
              </div>
              <div
                className={`font-bold text-green-200${
                  isMobile && isHorizontal
                    ? " text-base"
                    : " text-lg"
                }`}
              >
                {score}
              </div>
              <div className="text-xs text-green-400">
                XP Points
              </div>
            </div>

            {/* Health Box */}
            <div
              className={`bg-black/30 rounded-lg border border-red-400/50${
                isMobile && isHorizontal ? " p-2" : " p-3"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Heart
                  className={`w-4 h-4 text-red-400${
                    isMobile && isHorizontal ? " w-3 h-3" : ""
                  }`}
                />
                <span className="text-xs font-bold text-red-300">
                  HEALTH
                </span>
              </div>
              <div
                className={`font-bold text-red-200${
                  isMobile && isHorizontal
                    ? " text-base"
                    : " text-lg"
                }`}
              >
                {health}%
              </div>
              <div
                className={`w-full${
                  isMobile && isHorizontal ? " h-1" : " h-1.5"
                } bg-gray-700 rounded-full overflow-hidden mt-1`}
              >
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-green-400 transition-all duration-300"
                  style={{ width: `${health}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Combo Counter (conditionally shown) */}
          {combo > 0 && (
            <div
              className={`bg-black/30 rounded-lg border border-yellow-400/50${
                isMobile && isHorizontal ? " p-2" : " p-3"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap
                  className={`w-4 h-4 text-yellow-400${
                    isMobile && isHorizontal ? " w-3 h-3" : ""
                  }`}
                />
                <span className="text-xs font-bold text-yellow-300">
                  COMBO
                </span>
              </div>
              <div
                className={`font-bold text-yellow-200${
                  isMobile && isHorizontal
                    ? " text-base"
                    : " text-lg"
                }`}
              >
                {combo}x
              </div>
              <div className="text-xs text-yellow-400">
                Streak Multiplier
              </div>
            </div>
          )}

          {/* Mission Brief moved to header */}

          {/* Reset Progress Button (conditionally shown) */}
          {onResetProgress && (
            <>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className={`w-full rounded-lg font-bold flex items-center justify-center gap-2 transition-all border border-red-300/50 bg-gradient-to-r from-red-500/70 to-orange-500/70 text-white hover:from-red-500 hover:to-orange-500${
                    isMobile && isHorizontal
                      ? " px-2 py-2 text-xs mt-2"
                      : " px-4 py-2 mt-3"
                  }`}
                >
                  <RefreshCw
                    className={`w-4 h-4${
                      isMobile && isHorizontal ? " w-3 h-3" : ""
                    }`}
                  />
                  RESET PROGRESS
                </button>
              ) : (
                <div className={`rounded-lg border border-red-300/50 bg-red-900/30 p-3 mt-3`}>
                  <p className="text-white text-xs mb-2">Are you sure you want to reset your progress? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onResetProgress();
                        setShowResetConfirm(false);
                        setIsMenuOpen(false);
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded py-1 text-xs font-bold"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded py-1 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
