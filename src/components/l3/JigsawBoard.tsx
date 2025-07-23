// External Library Imports
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Gamepad2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Internal Components and Hooks
import { JigsawContainer } from "./JigsawContainer";

import { ScenarioDialog } from "./ScenarioDialog";
import { VictoryPopup } from "../ui/Popup";
import { useDeviceLayout } from "../../hooks/useOrientation";
import { RootState } from "../../store/types";

// Extracted Components
import { Arsenal, DeviceRotationPrompt, DragPieceOverlay } from "./components";

// Utilities and Hooks
import { BACKGROUND_IMAGE_URL, preloadImage } from "./utils/gameUtils";

// Types
import type { PuzzlePiece } from "../../data/level3Scenarios";
import { getLevel3ScenariosByModule } from "../../data/level3Scenarios";
import { setScenarios } from "../../store/slices/level3Slice";

/**
 * JigsawBoard Component
 *
 * A gamified drag-and-drop puzzle interface where users identify violations
 * and place appropriate actions to fix them.
 */

export const JigsawBoard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ===== HOOKS & CONTEXT =====
  // Removed unused: user
  // State declarations (single set at top)
  const [showScenario, setShowScenario] = useState(true);
  const [showBriefing, setShowBriefing] = useState(false);
  const [activeDragPiece, setActiveDragPiece] = useState<PuzzlePiece | null>(
    null
  );
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [combo, setCombo] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [placedPieces, setPlacedPieces] = useState<{
    violations: PuzzlePiece[];
    actions: PuzzlePiece[];
  }>({
    violations: [],
    actions: [],
  });
  const { isMobile, isHorizontal } = useDeviceLayout();
  const arsenalRef = useRef<HTMLDivElement>(null);
  // ===== UI STATE =====
  // (all state declarations are below, do not redeclare)

  // Auto-close feedback after 2.5 seconds
  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => setFeedback(""), 2500);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  // Redux state (declare after state, so it's available for use)
  const scenarios = useSelector((state: RootState) => state.level3.scenarios);
  const currentModule = useSelector(
    (state: RootState) => state.game.currentModule
  );

  // Update scenarios when module changes
  useEffect(() => {
    let moduleId: number | undefined = undefined;
    if (
      typeof currentModule === "object" &&
      currentModule !== null &&
      "id" in currentModule
    ) {
      moduleId = currentModule.id;
    } else if (typeof currentModule === "number") {
      moduleId = currentModule;
    }
    if (moduleId === 1 || moduleId === 2) {
      dispatch(setScenarios(getLevel3ScenariosByModule(moduleId)));
    }
  }, [currentModule, dispatch]);

  // Auto-close feedback after 2.5 seconds
  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => setFeedback(""), 2500);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  // Auto-close feedback after 2.5 seconds
  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => setFeedback(""), 2500);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  // ===== DND KIT SETUP =====
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    })
  );

  // ===== UI STATE & GAME STATE =====
  // const [isMenuOpen, setIsMenuOpen] = useState(false); // Unused
  // (moved all state declarations to top for auto-close feedback)

  // ===== DERIVED STATE =====
  // Removed unused: moduleId, displayName
  const scenario = scenarios?.[scenarioIndex];

  const correctViolations = useMemo(
    () =>
      scenario?.pieces.filter(
        (p: PuzzlePiece) => p.category === "violation" && p.isCorrect
      ) ?? [],
    [scenario]
  );

  const correctActions = useMemo(
    () =>
      scenario?.pieces.filter(
        (p: PuzzlePiece) => p.category === "action" && p.isCorrect
      ) ?? [],
    [scenario]
  );

  const availablePieces = useMemo(
    () =>
      scenario?.pieces.filter(
        (piece: PuzzlePiece) =>
          !placedPieces.violations.some((p) => p.id === piece.id) &&
          !placedPieces.actions.some((p) => p.id === piece.id)
      ) ?? [],
    [scenario, placedPieces]
  );

  // ===== GAME LOGIC HANDLERS =====

  // (Removed unused isValidUUID helper)

  /**
   * Handle piece drop on containers
   */
  const handleDrop = useCallback(
    (containerType: "violations" | "actions", piece: PuzzlePiece) => {
      // Validate if the piece is being dropped in the right container type
      const isCorrectCategory =
        (containerType === "violations" && piece.category === "violation") ||
        (containerType === "actions" && piece.category === "action");

      if (!isCorrectCategory) {
        setFeedback("WRONG CATEGORY! Try the other container, Agent!");
        setHealth((prev) => Math.max(0, prev - 10));
        setCombo(0);
        return { success: false };
      }

      // Check if the piece is already placed somewhere
      const isAlreadyPlaced =
        placedPieces.violations.some((p) => p.id === piece.id) ||
        placedPieces.actions.some((p) => p.id === piece.id);

      if (isAlreadyPlaced) {
        setFeedback("Already placed! Try another piece!");
        return { success: false };
      }

      // Update state based on whether the piece is correct
      if (piece.isCorrect) {
        setPlacedPieces((prev) => {
          const updated = {
            ...prev,
            [containerType]: [...prev[containerType], piece],
          };
          // Check for completion
          const totalViolations = correctViolations.length;
          const totalActions = correctActions.length;
          if (
            updated.violations.length === totalViolations &&
            updated.actions.length === totalActions
          ) {
            setTimeout(() => setIsComplete(true), 400); // slight delay for UX
          }
          return updated;
        });
        setFeedback("CRITICAL HIT! Perfect placement!");

        // Calculate points per correct piece based on total correct pieces
        const totalCorrectPieces =
          correctViolations.length + correctActions.length;
        const pointsPerPiece = Math.floor(100 / totalCorrectPieces);

        // Update total score
        setScore((prevScore) => prevScore + pointsPerPiece);
        setCombo((prev) => prev + 1);
        return { success: true };
      } else {
        setFeedback("\uD83D\uDCA5 MISS! Analyze the scenario more carefully!");
        setHealth((prev) => Math.max(0, prev - 15));
        setCombo(0);
        return { success: false };
      }
    },
    [placedPieces, combo, correctViolations.length, correctActions.length]
  );

  /**
   * Handle victory popup close and scenario transition
   */
  const handleVictoryClose = useCallback(async () => {
    // Then proceed to next scenario or clear completion state
    if (scenarioIndex < scenarios?.length - 1) {
      setScenarioIndex((idx) => idx + 1);
      setPlacedPieces({ violations: [], actions: [] });
      setIsComplete(false);
      setCombo(0);
      setHealth(100);
      // Removed unused: setCurrentScenarioPoints(0); // Reset points for new scenario
      setScore(0); // Reset score for each scenario
      setShowScenario(true);
    } else {
      setIsComplete(false);
    }
  }, [
    scenarioIndex,
    scenarios?.length,
    isComplete,
    score,
    health,
    combo,
    placedPieces,
  ]);

  // ===== EFFECTS =====

  // Preload background image on mount
  useEffect(() => {
    preloadImage(BACKGROUND_IMAGE_URL);
  }, []);

  // ===== CONDITIONAL RENDERING =====

  // Force landscape mode
  if (!isHorizontal) {
    return <DeviceRotationPrompt />;
  }

  // Remove loading screen and isLoading logic
  // ===== MAIN RENDER - REDESIGNED =====
  // ===== MAIN RENDER - PIXEL/RETRO STYLE =====
  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => {
        const piece = availablePieces.find((p) => p.id === event.active.id);
        setActiveDragPiece(piece || null);
      }}
      onDragEnd={(event) => {
        setActiveDragPiece(null);
        if (event.over && event.active) {
          const containerType = event.over.id;
          const piece = availablePieces.find((p) => p.id === event.active.id);
          if (
            (containerType === "violations" || containerType === "actions") &&
            piece
          ) {
            handleDrop(containerType, piece);
          }
        }
      }}
      onDragCancel={() => setActiveDragPiece(null)}
      autoScroll={true}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      {/* DragPieceOverlay component */}
      <DragPieceOverlay activeDragPiece={activeDragPiece} isMobile={isMobile} />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src="/backgrounds/m1l3.webp"
          alt="Level 3 Background"
          className="w-full h-full object-cover object-center absolute inset-0 z-0"
          style={{ filter: "brightness(0.7) contrast(1.1)" }}
          draggable={false}
        />
        {/* Optional: dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none select-none z-20">
        <div className="grid-pattern"></div>
      </div>

      {/* Main Game Layout */}
      <div
        className={`relative z-10 h-screen flex flex-col items-center justify-center ${
          isMobile ? "p-2" : "p-6"
        }`}
      >
        {/* Navbar - Pixel/Retro style, extra compact on mobile horizontal */}
        <nav className="w-full mx-auto sticky top-0 z-10">
          <div
            className={`w-full flex flex-col md:flex-row items-center bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-900 pixel-border-thick
              ${isMobile && isHorizontal ? "p-1 mt-1 mb-2" : "p-2 mt-2 mb-4"}`}
          >
            <div className="flex w-full items-center justify-between">
              {/* Back Button */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  className={`pixel-border bg-gray-800 hover:bg-gray-700 text-cyan-100 flex items-center ${
                    isMobile && isHorizontal
                      ? "gap-0.5 px-1 py-0.5 text-xs"
                      : "gap-1 px-2 py-1"
                  } font-bold transition-all duration-150 active:scale-95`}
                  style={{ borderRadius: 4 }}
                  onClick={() => navigate(-1)}
                  aria-label="Back"
                >
                  <ArrowLeft
                    className={`${
                      isMobile && isHorizontal ? "w-4 h-4" : "w-5 h-5"
                    }`}
                  />
                  <span
                    className={`${
                      isMobile && isHorizontal ? "hidden" : "hidden sm:inline"
                    }`}
                  >
                    Back
                  </span>
                </button>
              </div>
              {/* Centered Game Title and Level Info - absolutely centered */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2">
                <div
                  className={`${
                    isMobile && isHorizontal ? "w-6 h-6" : "w-8 h-8"
                  } bg-indigo-700 pixel-border flex items-center justify-center`}
                >
                  <Crown
                    className={`${
                      isMobile && isHorizontal ? "w-3.5 h-3.5" : "w-4 h-4"
                    } text-yellow-300`}
                  />
                </div>
                <div className="text-center">
                  <h1
                    className={`pixel-text tracking-wider leading-none drop-shadow-glow font-black text-cyan-100 ${
                      isMobile && isHorizontal ? "text-base" : "text-lg"
                    }`}
                  >
                    GMP QUEST
                  </h1>
                  <div
                    className={`text-blue-200 font-bold tracking-widest leading-none ${
                      isMobile && isHorizontal ? "text-[10px]" : "text-xs"
                    }`}
                  >
                    LEVEL 3: JIGSAW
                  </div>
                </div>
                <div
                  className={`${
                    isMobile && isHorizontal ? "w-6 h-6" : "w-8 h-8"
                  } bg-blue-700 pixel-border flex items-center justify-center`}
                >
                  <Gamepad2
                    className={`${
                      isMobile && isHorizontal ? "w-3.5 h-3.5" : "w-4 h-4"
                    } text-cyan-200`}
                  />
                </div>
              </div>
              {/* Mission Briefing Button */}
              <div
                className={`flex-shrink-0 flex items-center ml-2 ${
                  !(isMobile && isHorizontal) && "hidden"
                }`}
              >
                <button
                  className={`pixel-border bg-yellow-700 hover:bg-yellow-600 text-black flex items-center font-bold transition-all duration-150 active:scale-95 ${
                    isMobile && isHorizontal
                      ? "gap-0.5 px-1 py-0.5 text-xs"
                      : "gap-1 px-2 py-1"
                  }`}
                  style={{ borderRadius: 4 }}
                  onClick={() => setShowBriefing(true)}
                  aria-label="Show Mission Briefing"
                >
                  <Icon
                    icon="mdi:message-bulleted"
                    className={`${
                      isMobile && isHorizontal ? "w-4 h-4" : "w-5 h-5"
                    } text-yellow-300`}
                  />
                  <span
                    className={`${
                      isMobile && isHorizontal ? "hidden" : "hidden sm:inline"
                    }`}
                  >
                    Mission Briefing
                  </span>
                </button>
              </div>
              {/* Stats HUD - right aligned */}
              <div className="flex-shrink-0 flex items-center ml-auto">
                <div
                  className={`flex flex-row justify-center items-center ${
                    isMobile && isHorizontal ? "gap-1" : "gap-2 md:gap-4"
                  }`}
                >
                  <div
                    className={`pixel-border bg-blue-800/80 flex flex-col items-center ${
                      isMobile && isHorizontal
                        ? "px-1 py-0.5 min-w-[38px]"
                        : "px-2 py-1 min-w-[60px]"
                    }`}
                  >
                    <span
                      className={`text-blue-200 font-bold leading-none ${
                        isMobile && isHorizontal ? "text-[8px]" : "text-[10px]"
                      }`}
                    >
                      SCORE
                    </span>
                    <span
                      className={`text-cyan-100 font-black leading-none ${
                        isMobile && isHorizontal ? "text-xs" : "text-base"
                      }`}
                    >
                      {score.toString().padStart(4, "0")}
                    </span>
                  </div>
                  <div
                    className={`pixel-border bg-fuchsia-900/80 flex flex-col items-center ${
                      isMobile && isHorizontal
                        ? "px-1 py-0.5 min-w-[38px]"
                        : "px-2 py-1 min-w-[60px]"
                    }`}
                  >
                    <span
                      className={`text-pink-200 font-bold leading-none ${
                        isMobile && isHorizontal ? "text-[8px]" : "text-[10px]"
                      }`}
                    >
                      HEALTH
                    </span>
                    <span
                      className={`text-pink-100 font-black leading-none ${
                        isMobile && isHorizontal ? "text-xs" : "text-base"
                      }`}
                    >
                      {health}
                    </span>
                  </div>
                  <div
                    className={`pixel-border bg-yellow-700/80 flex flex-col items-center ${
                      isMobile && isHorizontal
                        ? "px-1 py-0.5 min-w-[38px]"
                        : "px-2 py-1 min-w-[60px]"
                    }`}
                  >
                    <span
                      className={`text-yellow-200 font-bold leading-none ${
                        isMobile && isHorizontal ? "text-[8px]" : "text-[10px]"
                      }`}
                    >
                      COMBO
                    </span>
                    <span
                      className={`text-yellow-100 font-black leading-none ${
                        isMobile && isHorizontal ? "text-xs" : "text-base"
                      }`}
                    >
                      {combo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mission Briefing - Pixel/Retro style (dynamic) */}
        {/* Mission Briefing Popup */}
        <AnimatePresence>
          {showBriefing && scenario?.description && (
            <motion.div
              key="mission-briefing-popup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <div className="pixel-border-thick bg-gradient-to-r from-indigo-900 via-blue-900 to-fuchsia-900 text-cyan-100 px-6 py-6 text-base md:text-lg font-mono tracking-wide shadow-2xl text-center max-w-xl mx-auto relative">
                <span className="font-bold text-yellow-200 text-lg block mb-2">
                  MISSION BRIEFING
                </span>
                <div className="mb-4 text-cyan-100">{scenario.description}</div>
                <button
                  className="pixel-border bg-yellow-700 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded mt-2"
                  onClick={() => setShowBriefing(false)}
                  aria-label="Close Mission Briefing"
                >
                  Close
                </button>
                <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none z-0"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Game Area - Pixel/Retro style */}
        <main className="flex-1 flex flex-col h-full w-full max-w-6xl mx-auto relative z-10">
          {/* Scenario Dialog Overlay */}
          <AnimatePresence>
            {showScenario && (
              <motion.div
                key="scenario-dialog"
                initial={{ opacity: 0, scale: 1, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <ScenarioDialog
                  scenario={scenario}
                  onClose={() => setShowScenario(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mission Briefing - Pixel/Retro style (dynamic) */}
          {scenario?.description && (
            <div
              className={`w-full max-w-3xl mx-auto mb-2 md:mb-4 px-2 md:px-0${
                isMobile && isHorizontal ? " hidden" : ""
              }`}
            >
              <div className="pixel-border bg-gradient-to-r from-indigo-900 via-blue-900 to-fuchsia-900 text-cyan-100 px-3 py-2 md:py-3 text-xs md:text-sm font-mono tracking-wide shadow-lg text-center">
                <span className="font-bold text-yellow-200">
                  MISSION BRIEFING:
                </span>{" "}
                {scenario.description}
              </div>
            </div>
          )}

          {/* Main Game Area - Now using CSS Grid for layout, with pixel borders */}
          <div
            className="flex-1 flex flex-row gap-2 md:gap-4 items-stretch justify-center w-full"
            style={{
              maxHeight:
                isHorizontal && !isMobile ? "calc(100vh - 64px)" : "100vh",
              minHeight: 0,
            }}
          >
            {/* Violations Container */}
            <section className="flex-1 min-w-[180px] max-w-[400px] h-full flex flex-col items-center justify-start">
              <JigsawContainer
                type="violations"
                pieces={placedPieces.violations}
                maxPieces={correctViolations.length}
              />
              <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none"></div>
            </section>

            {/* Arsenal */}
            <section className="flex-1 min-w-[180px] max-w-[400px] h-full flex flex-col items-center justify-start">
              <Arsenal
                availablePieces={availablePieces}
                isMobile={isMobile}
                isHorizontal={isHorizontal}
                arsenalRef={arsenalRef}
              />
              <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none"></div>
            </section>

            {/* Actions Container */}
            <section className="flex-1 min-w-[180px] max-w-[400px] h-full flex flex-col items-center justify-start">
              <JigsawContainer
                type="actions"
                pieces={placedPieces.actions}
                maxPieces={correctActions.length}
              />
              <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none"></div>
            </section>
          </div>

          {/* Feedback Console - Pixel/Retro style */}
          {feedback && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
              <div className="pixel-border-thick bg-gradient-to-r from-cyan-700 via-blue-800 to-purple-800 shadow-2xl px-6 py-4 relative overflow-hidden min-w-[220px] max-w-[90vw] flex items-center justify-center animate-in fade-in slide-in-from-bottom-4">
                {/* Scan Lines */}
                <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none z-0"></div>
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-30 blur-lg pointer-events-none z-0"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Icon
                    icon="mdi:message-bulleted"
                    className="text-yellow-300 w-6 h-6 drop-shadow-glow animate-pulse"
                  />
                  <span className="text-white font-black text-base pixel-text tracking-wide drop-shadow-glow">
                    {feedback}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Victory Popup - Pixel/Retro style overlay */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                key="victory-popup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <VictoryPopup
                  onClose={handleVictoryClose}
                  score={score}
                  health={health}
                  combo={combo}
                  open={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </DndContext>
  );
};
