import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useDeviceLayout } from "../../hooks/useOrientation";
import { useNavigate } from "react-router-dom";
import { calculateMaxScore, calculateStars } from "./utils/scoreCalculator";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

interface HighScoreEntry {
  score: number;
  time: number;
  created_at: string;
}

interface PopupProps {
  open: boolean;
  onClose: () => void;
  showNext?: boolean;
  children: React.ReactNode;
  showNavigation?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  continueText?: string;
  backText?: string;
}

export const Popup: React.FC<PopupProps> = ({
  open,
  onClose,
  showNext,
  children,
  showNavigation,
  onBack,
  onContinue,
  continueText = "Start Investigation",
  backText = "Back"
}) => {
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;
  
  const handleBack = () => {
    if (onBack) onBack();
  };
  
  const handleContinue = () => {
    if (onContinue) onContinue();
  };
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={`relative bg-white/20 backdrop-blur-2xl rounded-2xl p-3 shadow-2xl border-4 border-cyan-200/60 w-full flex flex-col ${isMobileHorizontal ? 'max-w-xs' : 'max-w-md'}`}
            style={
              isMobileHorizontal
                ? {
                    borderRadius: '0.75rem',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.16) 60%, rgba(200,240,255,0.08) 100%)',
                    backdropFilter: 'blur(64px)',
                    WebkitBackdropFilter: 'blur(64px)',
                    maxWidth: '90vw',
                    width: '95vw',
                    minHeight: '120px',
                    maxHeight: 'calc(90vh - 40px)',
                    display: 'flex',
                    flexDirection: 'column'
                  }
                : {
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.16) 60%, rgba(200,240,255,0.08) 100%)',
                    backdropFilter: 'blur(64px)',
                    WebkitBackdropFilter: 'blur(64px)',
                    maxHeight: 'calc(90vh - 40px)',
                    display: 'flex',
                    flexDirection: 'column'
                  }
            }
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.4,
            }}
          >
            {/* Background Glow */}
            <div
              className="absolute -inset-1 pointer-events-none z-0 rounded-2xl"
              style={{
                boxShadow:
                  "0 0 16px 4px rgba(34,211,238,0.07), 0 0 32px 8px rgba(59,130,246,0.04), 0 0 48px 12px rgba(16,185,129,0.03)",
                filter: "blur(0.8px)",
              }}
            />
            {showNext && (
              <button
                onClick={onClose}
                className={`absolute ${
                  isMobileHorizontal
                    ? "top-1.5 right-1.5 p-0.5"
                    : "top-2 right-2 p-1"
                } z-10 rounded-full transition-all duration-200 bg-gradient-to-br from-cyan-200 via-blue-200 to-teal-100 hover:from-pink-200 hover:to-yellow-100 shadow-lg border-2 border-cyan-300/70 hover:border-pink-400/70 focus:outline-none group`}
                aria-label="Close"
                style={isMobileHorizontal ? { width: 28, height: 28 } : {}}
              >
                <span className="relative flex items-center justify-center">
                  {/* Animated ring */}
                  <span
                    className={`absolute ${
                      isMobileHorizontal ? "w-6 h-6" : "w-9 h-9"
                    } rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-300/20 to-yellow-200/10 blur-md animate-pulse-slow z-0`}
                  ></span>
                  {/* Main icon with pop and shine */}
                  <span className="relative z-10 animate-pop-scale">
                    <Icon
                      icon="mdi:close-circle"
                      className={`${
                        isMobileHorizontal ? "w-4 h-4" : "w-7 h-7"
                      } text-cyan-700 group-hover:text-pink-500 drop-shadow-glow`}
                      style={{
                        filter:
                          "drop-shadow(0 0 8px #22d3ee) drop-shadow(0 0 16px #f472b6)",
                      }}
                    />
                  </span>
                  {/* Sparkle */}
                  <span className="absolute -top-1 -right-1 text-yellow-300 text-xs animate-bounce select-none pointer-events-none">
                    ✦
                  </span>
                </span>
              </button>
            )}
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              {children}
            </div>
            
            {/* Navigation section */}
            {showNavigation && (
              <>
                <button 
                  onClick={handleBack} 
                  className="absolute top-16 left-4 rounded-lg px-2 py-0.5 font-bold text-cyan-400 z-50 sm:top-16 sm:left-4 flex flex-row items-center bg-black/30 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-900/60 transition-all duration-300"
                >
                  <Icon 
                    icon="mdi:chevron-left" 
                    className="w-4 h-4 md:w-[0.7vw] md:h-[0.7vw] min-w-3 min-h-3 mr-1" 
                  />
                  <span>{backText}</span>
                </button>
                <div className="flex-shrink-0 flex flex-row items-center justify-end w-full px-4 py-3 border-t border-cyan-400/30 bg-black/40">
                  <button 
                    onClick={handleContinue} 
                    className="rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-cyan-400 z-50 sm:px-4 sm:py-2 sm:text-sm lg:text-lg flex flex-row items-center bg-black/40 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-900/60 transition-all duration-300"
                  >
                    <span>{continueText}</span>
                    <Icon 
                      icon="mdi:chevron-right" 
                      className="w-4 h-4 md:w-[0.7vw] md:h-[0.7vw] min-w-3 min-h-3 ml-1" 
                    />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface VictoryPopupProps {
open: boolean;
onClose: () => void;
score: number;
showNext?: boolean;
showGoToModules?: boolean;
moduleId?: string;
}

export const VictoryPopup: React.FC<VictoryPopupProps> = ({
  open,
  onClose,
  score,
  showNext = false,
  showGoToModules = true,
  moduleId,
}) => {
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;
  const navigate = useNavigate();

  // Calculate dynamic max score and stars based on module
  const moduleNumber = moduleId ? parseInt(moduleId, 10) : 1;
  const maxScore = calculateMaxScore(moduleNumber);
  const stars = calculateStars(score, moduleNumber);

  // Handler for Go to Levels
  const handleGoToLevels = useCallback(() => {
    let id = moduleId;
    // Always fallback to '1' if id is falsy (empty string, undefined, null, etc)
    if (!id || id === '/modules' || id === 'modules') {
      // Try to extract moduleId from current URL, fallback to '1'
      const match = window.location.pathname.match(/modules\/(\w+)/);
      id = match && match[1] ? match[1] : '1';
    }
    // If id is still not a valid number, fallback to '1'
    if (!id || isNaN(Number(id))) id = '1';
    // Go to the module root page (not levels list)
    navigate(`/modules/${id}`);
  }, [moduleId, navigate]);

  // Handler for Next
  const handleNext = useCallback(() => {
    onClose(); // Parent handles scenario change
  }, [onClose]);

  return (
    <Popup open={open} onClose={onClose} showNext={showNext}>
      <motion.div
        className={`flex flex-col items-center mx-auto justify-center text-center text-gray-900${
          isMobileHorizontal ? " scale-90 max-w-[320px] px-1" : ""
        }`}
        style={
          isMobileHorizontal
            ? {
                fontSize: "0.92rem",
                padding: "0.5rem",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
                gap: "0.4rem",
              }
            : { gap: "0.7rem" }
        }
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 22,
          duration: 0.5,
        }}
      >
        {/* ⭐ Stars */}
        <motion.div
          className={`relative flex items-center justify-center w-full ${
            isMobileHorizontal
              ? " w-[260px] h-8 mb-1 justify-center"
              : " h-14 mb-2"
          }`}
          style={
            isMobileHorizontal
              ? { marginLeft: 0, justifyContent: "center" }
              : { margin: "0 auto", justifyContent: "center" }
          }
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 180,
            damping: 18,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => {
            // Arc math: angle from 120deg to 60deg (flatter upside-down arc)
            const angle = -(120 - i * 15) * (Math.PI / 180); // 120, 105, 90, 75, 60
            const radius = isMobileHorizontal ? 140 : 200;
            const centerX = isMobileHorizontal ? 130 : 300;
            const centerY = isMobileHorizontal ? 160 : 240;
            const x =
              centerX +
              radius * Math.cos(angle) -
              (isMobileHorizontal ? 12 : 20);
            const y =
              centerY +
              radius * Math.sin(angle) -
              (isMobileHorizontal ? 12 : 20);
            // Show filled star if i < stars, else gray
            return (
              <motion.span
                key={i}
                className={`absolute ${i < stars ? "text-yellow-400" : "text-gray-300"}${isMobileHorizontal ? " text-2xl" : "text-xl"}`}
                style={{
                  left: isMobileHorizontal
                    ? `${x}px`
                    : `calc(50% + ${x - 300}px)`,
                  top: `${y}px`,
                  filter: i < stars
                    ? "drop-shadow(0 0 3px #fde68a) drop-shadow(0 0 6px #fbbf24)"
                    : undefined,
                }}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2 + i * 0.07,
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                }}
              >
                ⭐
              </motion.span>
            );
          })}
        </motion.div>
        {/* 🎉 Message */}
        <motion.h2
          className={`text-3xl font-extrabold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] mb-1 mt-4${
            isMobileHorizontal ? " text-xl mb-0 w-full" : ""
          }`}
          style={
            isMobileHorizontal
              ? { textAlign: "center", width: "100%", marginBottom: 0 }
              : { marginBottom: "0.2rem" }
          }
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.45,
            type: "spring",
            stiffness: 200,
            damping: 18,
          }}
        >
          Well Done!
        </motion.h2>
        
        {/* Score Display Only */}
        <motion.div 
          className={`flex justify-center ${isMobileHorizontal ? "gap-2 mb-1" : "gap-6 mb-3"}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.55,
            type: "spring",
            stiffness: 200,
            damping: 18,
          }}
        >
          <div className="flex flex-col items-center">
            <span className={`${isMobileHorizontal ? "text-sm" : "text-lg"} font-bold text-blue-700`}>Score</span>
            <span className={`${isMobileHorizontal ? "text-lg" : "text-2xl"} font-extrabold text-green-600`}>
              {score} / {maxScore}
            </span>
          </div>
        </motion.div>
        
        {/* 🧑‍🔬 Character */}
        <motion.div
          className={`relative w-full flex justify-center items-center mb-2 py-3${
            isMobileHorizontal ? " py-1 mb-0 justify-center" : ""
          }`}
          style={isMobileHorizontal ? { justifyContent: "center" } : {}}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.6,
            type: "spring",
            stiffness: 180,
            damping: 18,
          }}
        >
          <motion.img
            src="/characters/worker.webp"
            alt="Worker Character"
            className={`object-contain${
              isMobileHorizontal ? " w-[180px]" : " w-[200px]"
            }`}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.7,
              type: "spring",
              stiffness: 200,
              damping: 18,
            }}
          />
        </motion.div>
        {/* Removed duplicate Score/Combo/Health display since it's already shown above */}
        {/* 🔘 Buttons */}
        <motion.div
          className={`flex justify-center gap-3 w-full mt-1${
            isMobileHorizontal ? " gap-1 mt-0 justify-center" : ""
          }`}
          style={isMobileHorizontal ? { justifyContent: "center" } : {}}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 1.0,
            type: "spring",
            stiffness: 180,
            damping: 18,
          }}
        >
          {showGoToModules && (
            <button
              className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 py-2 text-white font-black text-sm sm:text-base lg:text-lg rounded-lg shadow-lg pixel-text"
              onClick={handleGoToLevels}
              aria-label="Back to Levels"
              type="button"
            >
              <Icon
                icon="mdi:map-marker-path"
                className="w-4 h-4 md:w-[0.7vw] md:h-[0.7vw] min-w-3 min-h-3 mr-1"
              />
              <span>Back to Modules</span>
            </button>
          )}
          {showNext && (
            <button
              className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 py-2 text-white font-black text-sm sm:text-base lg:text-lg rounded-lg shadow-lg pixel-text"
              onClick={handleNext}
              aria-label="Next Case"
              type="button"
            >
              <Icon
                icon="mdi:arrow-right-bold"
                className="w-4 h-4 md:w-[0.7vw] md:h-[0.7vw] min-w-3 min-h-3 mr-1"
              />
              <span>Next Case</span>
            </button>
          )}
        </motion.div>
      </motion.div>
    </Popup>
  );
};

// FeedbackPopup component matching the provided design
interface FeedbackPopupProps {
  open: boolean;
  onClose: () => void;
  onNext?: () => void; // Made optional since we're using our own navigation
  onBackToLevels: () => void;
  onPlayAgain: () => void; // NEW: callback to reset to login
  score: number;
  time: string;
  moduleId?: number; // NEW: optional module ID to override URL detection
}

export const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  open,
  onClose,
  onBackToLevels,
  onPlayAgain, // NEW
  score,
  time,
  moduleId, // NEW: optional module ID
  // onNext is not used as we're handling navigation directly
}) => {
  console.log('🚀 UPDATED FeedbackPopup loaded! moduleId:', moduleId);

  // State for high scores
  const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const { user } = useAuth();
  // Calculate stars: 0-5 based on score (maxScore depends on number of cases)
  // Use passed moduleId first, then try to get from URL if not passed
  let moduleIdNum: number | undefined = moduleId;

  if (!moduleIdNum && typeof window !== 'undefined') {
    // Try multiple regex patterns to catch different URL structures
    let match = window.location.pathname.match(/modules\/(\d+)/);
    if (!match) {
      // Try alternative patterns
      match = window.location.pathname.match(/module\/(\d+)/);
    }
    if (!match) {
      // Try to find any number in the path that could be a module ID
      match = window.location.pathname.match(/\/(\d+)/);
    }

    if (match && match[1]) moduleIdNum = Number(match[1]);


  }
  // Fallback to prop if available
  if (!moduleIdNum && typeof (window as any).moduleId !== 'undefined') {
    moduleIdNum = Number((window as any).moduleId);
  }
  // Default to 1 if not found
  if (!moduleIdNum) {
    moduleIdNum = 1;
  }

  // Use utility functions for dynamic calculation
  const maxScore = calculateMaxScore(moduleIdNum);
  const stars = calculateStars(score, moduleIdNum);

  // Utility function to format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Utility function to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Fetch high scores when popup opens
  useEffect(() => {
    const fetchHighScores = async () => {
      if (!open || !user || !moduleIdNum) return;

      setLoadingScores(true);
      try {
        const { data, error } = await supabase
          .from('level_4')
          .select('score, time, created_at')
          .eq('user_id', user.id)
          .eq('module', moduleIdNum)
          .eq('is_completed', true)
          .order('score', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching high scores:', error);
          return;
        }

        setHighScores(data || []);
      } catch (error) {
        console.error('Error fetching high scores:', error);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchHighScores();
  }, [open, user, moduleIdNum]);

  // Temporary debug logging
  console.log('🔍 FeedbackPopup Final Values:', {
    passedModuleId: moduleId,
    finalModuleIdNum: moduleIdNum,
    calculatedMaxScore: maxScore,
    score: score,
    stars: stars
  });
  const isMobile = window.innerWidth <= 600;
  const popupHeight = isMobile ? 'auto' : 'auto';
  const popupMaxHeight = isMobile ? '80vh' : '90vh';
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={`relative bg-white/20 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl border-4 border-cyan-200/60 w-full overflow-visible ${isMobile ? 'max-w-xs p-2' : 'max-w-md lg:p-6'}`}
            style={
              isMobile
                ? {
                    borderRadius: '0.75rem',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.16) 60%, rgba(200,240,255,0.08) 100%)',
                    backdropFilter: 'blur(64px)',
                    WebkitBackdropFilter: 'blur(64px)',
                    padding: '0.5rem',
                    maxWidth: '95vw',
                    width: '98vw',
                    minHeight: '120px',
                    height: popupHeight,
                    maxHeight: popupMaxHeight,
                    overflowY: 'auto',
                  }
                : {
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.16) 60%, rgba(200,240,255,0.08) 100%)',
                    backdropFilter: 'blur(64px)',
                    WebkitBackdropFilter: 'blur(64px)',
                    maxHeight: popupMaxHeight,
                  }
            }
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.4,
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 rounded-full transition-all duration-200 bg-gradient-to-br from-cyan-200 via-blue-200 to-teal-100 hover:from-pink-200 hover:to-yellow-100 shadow-lg border-2 border-cyan-300/70 hover:border-pink-400/70 focus:outline-none group"
              aria-label="Close"
              style={{ width: 36, height: 36 }}
            >
              <span className="relative flex items-center justify-center">
                <span className="absolute w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-300/20 to-yellow-200/10 blur-md animate-pulse-slow z-0"></span>
                <span className="relative z-10 animate-pop-scale">
                  <Icon
                    icon="mdi:close-circle"
                    className="w-7 h-7 text-cyan-700 group-hover:text-pink-500 drop-shadow-glow"
                    style={{
                      filter:
                        "drop-shadow(0 0 8px #22d3ee) drop-shadow(0 0 16px #f472b6)",
                    }}
                  />
                </span>
                <span className="absolute -top-1 -right-1 text-yellow-300 text-xs animate-bounce select-none pointer-events-none">
                  ✦
                </span>
              </span>
            </button>
            {/* ⭐ Stars */}
            <motion.div
              className={`relative flex items-center justify-center w-full ${isMobile ? "w-[120px] h-4 mb-0.5 justify-center" : "h-14 mb-2"}`}
              style={
                isMobile
                  ? { marginLeft: 0, justifyContent: "center" }
                  : { margin: "0 auto", justifyContent: "center" }
              }
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 180,
                damping: 18,
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => {
                // Arc math: angle from 120deg to 60deg (flatter upside-down arc)
                const angle = -(120 - i * 15) * (Math.PI / 180); // 120, 105, 90, 75, 60
                const radius = isMobile ? 60 : 200;
                const centerX = isMobile ? 60 : 300;
                const centerY = isMobile ? 80 : 240;
                const x =
                  centerX +
                  radius * Math.cos(angle) -
                  (isMobile ? 6 : 20);
                const y =
                  centerY +
                  radius * Math.sin(angle) -
                  (isMobile ? 6 : 20);
                // Show filled star if i < stars, else gray
                return (
                  <motion.span
                    key={i}
                    className={`absolute ${i < stars ? "text-yellow-400" : "text-gray-300"}${isMobile ? " text-sm" : " text-xl"}`}
                    style={{
                      left: isMobile
                        ? `${x}px`
                        : `calc(50% + ${x - 300}px)`,
                      top: `${y}px`,
                      filter: i < stars
                        ? "drop-shadow(0 0 3px #fde68a) drop-shadow(0 0 6px #fbbf24)"
                        : undefined,
                    }}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.2 + i * 0.07,
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                  >
                    ⭐
                  </motion.span>
                );
              })}
            </motion.div>
            {/* Well Done! */}
            <h2 className="text-md lg:text-3xl font-extrabold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] lg:mb-2 mt-6 text-center">
              Well Done!
            </h2>
           

            {/* High Scores Section */}
            {highScores.length > 0 && (
              <div className="lg:mt-4 lg:p-3 p-1 bg-black/30 backdrop-blur-md rounded-lg border border-cyan-400/30 w-full">
                <h3 className="text-sm lg:text-lg font-bold text-cyan-400 lg:mb-3 text-center">🏆 Your Top Scores</h3>
                <div className="space-y-2">
                  {highScores.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs lg:text-sm">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {index + 1}.
                        </span>
                        <span className="text-white font-semibold">{entry.score} pts</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <span>{formatTime(entry.time)}</span>
                        <span className="text-xs">{formatDate(entry.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {loadingScores && (
                  <div className="text-center text-cyan-400 text-xs">Loading scores...</div>
                )}
              </div>
            )}


             {/* Score and Time + Character */}
            <div className="flex items-center justify-center gap-4 lg:mb-4 w-full">
              {/* Left: Score and Time content */}
              <div className="flex flex-col items-start justify-center">
                <div className="mb-2">
                  <span className="text-sm lg:text-lg font-bold text-blue-700">Current Score</span>
                  <span className="block text-sm lg:text-2xl font-extrabold text-green-600">{score} / {maxScore} </span>
                </div>
                <div>
                  <span className="text-sm lg:text-lg font-bold text-blue-700">Time</span>
                  <span className="block text-sm lg:text-2xl  font-extrabold text-yellow-600">{time}</span>
                </div>
              </div>
              {/* Right: Character image */}
              <div className="flex-shrink-0">
                <img
                  src="/Level4/chara1.webp"
                  alt="Character"
                  className="object-contain w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] rounded-lg  "
                />
              </div>
            </div>
            {/* Character and background */}
            {/* <div className="flex justify-center items-center mb-4">
              <img
                src="/characters/worker.webp"
                alt="Character"
                className="object-contain w-[120px] h-[120px] rounded-lg bg-white/40 border border-gray-200 shadow"
              />
              <img
                src="/backgrounds/BingoBg3.jpg"
                alt="Background"
                className="absolute w-full h-full object-cover opacity-10 pointer-events-none select-none"
                style={{ zIndex: -1, top: 0, left: 0 }}
              />
            </div> */}
            {/* Buttons */}
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center ${isMobile ? 'gap-2' : 'gap-4'} mt-1 lg:mt-4 w-full px-2`}>
              <button
                className={`pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 ${isMobile ? 'py-1.5 text-sm' : 'py-2'} text-white font-black rounded-lg shadow-lg pixel-text ${isMobile ? 'w-full' : ''}`}
                onClick={onBackToLevels}
                aria-label="Back to Levels"
                type="button"
              >
                <Icon icon="mdi:map-marker-path" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                Back to Modules
              </button>
              <button
                className={`pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 ${isMobile ? 'py-1.5 text-sm' : 'py-2'} text-white font-black rounded-lg shadow-lg pixel-text ${isMobile ? 'w-full' : ''}`}
                onClick={onPlayAgain}
                aria-label="Play Again"
                type="button"
              >
                <Icon icon="mdi:arrow-right-bold" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                Play Again
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
