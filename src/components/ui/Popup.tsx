import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useDeviceLayout } from "../../hooks/useOrientation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LevelProgressService } from "../../services/levelProgressService";
import { useLevelProgress } from "../../hooks/useLevelProgress";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  hideClose?: boolean;
  children: React.ReactNode;
}

export const Popup: React.FC<PopupProps> = ({
  open,
  onClose,
  hideClose = false,
  children,
}) => {
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className={`pixel-border-thick bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl flex flex-col items-stretch relative ${
              isMobileHorizontal
                ? "w-[95vw] max-w-[360px] min-h-[120px] p-2"
                : "w-[420px] max-w-[96vw] p-6"
            }`}
            style={{
              borderRadius: 0,
              maxWidth: isMobileHorizontal ? "95vw" : "420px",
              minHeight: isMobileHorizontal ? "120px" : undefined,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
            }}
          >
            {/* Close button, always top right, never overlaps content */}
            {!hideClose && (
              <button
                onClick={onClose}
                className="absolute top-2 right-2 z-10 pixel-border bg-red-700 hover:bg-red-600 text-white font-bold px-2 py-1 pixel-text text-xs transition-all duration-150 active:scale-95"
                aria-label="Close"
                style={{ borderRadius: 0 }}
              >
                <Icon icon="mdi:close" className="w-4 h-4" />
              </button>
            )}
            {/* Main content, with consistent padding and spacing */}
            <div className="flex flex-col items-center w-full px-2 py-1 sm:px-4 sm:py-2">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface VictoryPopupProps {
  open: boolean;
  onClose: () => void;
  score: number;
  combo: number;
  health: number;
  highScore?: number; // Add high score property
  showNext?: boolean;
  isLevelCompleted?: boolean;
  showGoToModules?: boolean;
  showReset?: boolean;
  onReset?: () => void;
  moduleId?: string;
}

export const VictoryPopup: React.FC<VictoryPopupProps> = ({
  open,
  onClose,
  score,
  combo,
  health,
  highScore,
  showNext = false,
  isLevelCompleted = false,
  showGoToModules = true,
  showReset = false,
  onReset,
  moduleId,
}) => {
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const { refreshProgress } = useLevelProgress(moduleId ? parseInt(moduleId) : undefined);

  // Navigation handlers
  const handleGoToLevels = useCallback(() => {
    let id = moduleId;
    if (!id) {
      const match = window.location.pathname.match(/modules\/(\w+)/);
      id = match ? match[1] : "";
    }
    if (id) {
      navigate(`/modules/${id}`);
    } else {
      navigate("/modules");
    }
  }, [moduleId, navigate]);
  const handleNext = useCallback(() => { onClose(); }, [onClose]);
  const handleReset = useCallback(() => { if (onReset) onReset(); }, [onReset]);

  // Progress update effect
  useEffect(() => {
    const updateLevelProgress = async () => {
      if (!open || !user || !isLevelCompleted || !moduleId || isUpdatingProgress) return;
      setIsUpdatingProgress(true);
      try {
        const { error } = await LevelProgressService.completeLevel(user.id, parseInt(moduleId), 3);
        if (!error) await refreshProgress();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating level progress:', error);
      } finally {
        setIsUpdatingProgress(false);
      }
    };
    updateLevelProgress();
  }, [open, user, isLevelCompleted, moduleId, isUpdatingProgress, refreshProgress]);
  useEffect(() => { if (!open) setIsUpdatingProgress(false); }, [open]);

  // --- Horizontal Layout ---
  return (
    <Popup open={open} onClose={onClose} hideClose={showReset}>
      <div
        className={`flex flex-row items-center justify-center mx-auto text-white w-full ${isMobileHorizontal ? "scale-95 max-w-[370px] min-w-[320px] px-1" : "max-w-[600px] min-w-[420px] px-4"}`}
        style={isMobileHorizontal ? { fontSize: "0.95rem", gap: "0.5rem" } : { gap: "1.5rem" }}
      >
        {/* Left: Character and Stars */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 py-2 px-2 min-w-[120px] max-w-[160px] h-full">
          {/* Banner above character */}
          <div className="relative flex flex-col items-center mb-2 w-full">
            <span className="pixel-border-thick bg-gradient-to-r from-yellow-400 to-pink-400 text-yellow-900 font-black px-4 py-1 rounded-md shadow-lg text-lg sm:text-xl tracking-wider animate-bounce-slow select-none">
              {isLevelCompleted ? "LEVEL UP!" : "VICTORY!"}
            </span>
            <span className="absolute -top-7 left-1/2 -translate-x-1/2">
              <Icon icon="mdi:trophy-variant-outline" className="text-yellow-400 drop-shadow-lg" width={isMobileHorizontal ? 28 : 36} height={isMobileHorizontal ? 28 : 36} />
            </span>
          </div>
          {/* Pixel stars */}
          <div className="flex flex-row items-end justify-center gap-1 w-full mb-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`inline-block pixel-dot ${i === 1 ? "bg-yellow-400" : "bg-blue-400"} rounded-sm shadow-lg`}
                style={{ width: i === 1 ? 18 : 12, height: i === 1 ? 18 : 12, margin: 2 }}
              />
            ))}
          </div>
          <img
            src="/characters/chara.webp"
            alt="Worker Character"
            className={`object-contain mx-auto pixel-border mt-1 ${isMobileHorizontal ? "w-[70px] h-[54px]" : "w-[100px] h-[80px]"}`}
            style={{ borderRadius: "10px", background: "#232323" }}
          />
        </div>

        {/* Right: Stats, Message, Buttons */}
        <div className="flex flex-col flex-1 items-center justify-center text-center py-2 px-2 gap-3 min-w-0">
          {/* Stats Section */}
          <div className="flex flex-row items-end justify-center gap-6 w-full">
            <div className="flex flex-col items-center min-w-[70px]">
              <span className="pixel-dot bg-yellow-400 w-4 h-4 inline-block rounded-sm mb-1" />
              <span className="font-black text-yellow-200 pixel-text text-base">Score</span>
              <span className="font-black text-yellow-100 text-lg pixel-border bg-gray-900 px-3 py-1 rounded-md mt-1">{score}</span>
            </div>
            <div className="flex flex-col items-center min-w-[70px]">
              <span className="pixel-dot bg-blue-400 w-4 h-4 inline-block rounded-sm mb-1" />
              <span className="font-black text-blue-200 pixel-text text-base">Combo</span>
              <span className="font-black text-blue-100 text-lg pixel-border bg-gray-900 px-3 py-1 rounded-md mt-1">{combo}</span>
            </div>
            <div className="flex flex-col items-center min-w-[70px]">
              <span className="pixel-dot bg-pink-400 w-4 h-4 inline-block rounded-sm mb-1" />
              <span className="font-black text-pink-200 pixel-text text-base">Health</span>
              <span className="font-black text-pink-100 text-lg pixel-border bg-gray-900 px-3 py-1 rounded-md mt-1">{health}</span>
            </div>
          </div>



          {/* Action Buttons */}
          <div className="flex flex-row flex-wrap justify-center gap-3 w-full">
            {showGoToModules && (
              <button
                className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 text-white font-black rounded flex items-center gap-2 px-5 py-2 pixel-text hover:from-green-400 hover:to-blue-500 transition-all duration-200 active:translate-y-[2px] shadow-lg"
                onClick={handleGoToLevels}
                aria-label="Back to Levels"
                type="button"
                style={{ fontSize: isMobileHorizontal ? 15 : 17 }}
              >
                <Icon icon="mdi:home-map-marker" className="w-5 h-5" />
                Back to Levels
              </button>
            )}
            {!isLevelCompleted && (
              <button
                className="pixel-border-thick bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 font-black rounded flex items-center gap-2 px-5 py-2 pixel-text hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 active:translate-y-[2px] shadow-lg"
                onClick={handleNext}
                aria-label="Next"
                type="button"
                style={{ fontSize: isMobileHorizontal ? 15 : 17 }}
              >
                Next
                <Icon icon="mdi:arrow-right-bold" className="w-5 h-5" />
              </button>
            )}
            {showReset && onReset && (
              <button
                className="pixel-border-thick bg-gradient-to-r from-red-500 to-pink-500 text-white font-black rounded flex items-center gap-2 px-5 py-2 pixel-text hover:from-red-400 hover:to-pink-400 transition-all duration-200 active:translate-y-[2px] shadow-lg"
                onClick={handleReset}
                aria-label="Reset Level"
                type="button"
                style={{ fontSize: isMobileHorizontal ? 15 : 17 }}
              >
                <Icon icon="mdi:refresh" className="w-5 h-5" />
                Reset Level
              </button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}
