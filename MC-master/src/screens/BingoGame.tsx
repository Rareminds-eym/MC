import React, { useRef, useState } from 'react';
import { useBingoGame } from '../components/Level1/Hooks/useBingoGame';
import { useTutorial } from '../components/Level1/Hooks/useTutorial';
import { useDeviceLayout } from '../hooks/useOrientation';
import Navbar from '../components/Level1/Navbar';
import BingoGrid from '../components/Level1/BingoGrid';
import GameInstructions from '../components/Level1/GameInstructions';
import GameCompleteModal from '../components/Level1/GameCompleteModal';
import AnswerModal from '../components/Level1/AnswerModal';
import TutorialToast from '../components/Level1/TutorialToast';
import { Clock } from 'lucide-react';
import LoaderScreen from './LoaderScreen';
import { motion, AnimatePresence } from 'framer-motion';
import CompletedLineModal from '../components/Level1/CompletedLineModal';

const BingoGame: React.FC = () => {
  const {
    cells,
    completedLines,
    score,
    selectedDefinition,
    answerFeedback,
    rowsSolved,
    gameComplete,
    toggleCell,
    closeAnswerModal,
    isInCompletedLine,
    timer,
    completedLineModal,
    closeCompletedLineModal,
    startTimer,
    stopTimer,
    playAgain,
  } = useBingoGame();

  const {
    isActive: tutorialActive,
    currentStep,
    nextStep,
    skipTutorial,
    onUserInteraction,
    resetTutorial,
    waitingForInteraction
  } = useTutorial();


  // Timer state for this component
  const [tutorialDone, setTutorialDone] = React.useState(false);
  const [instructionsStep, setInstructionsStep] = React.useState<number | undefined>(undefined); // For skipping to definitions

  // Add a resetCount state to force re-mounting GameInstructions
  const [resetCount, setResetCount] = React.useState(0);

  // Track if answering is allowed (from GameInstructions)
  const [answeringAllowed, setAnsweringAllowed] = React.useState(false);

  // Auto-skip tutorial if game is restored
  React.useEffect(() => {
    if ((cells && cells.some(cell => cell.selected)) || (selectedDefinition && selectedDefinition.length > 0)) {
      setTutorialDone(true);
    }
  }, [cells, selectedDefinition]);

  // Ensure timer resumes if tutorial is skipped
  const handleSkipTutorial = () => {
    skipTutorial();
    setTutorialDone(true);
    onUserInteraction();
    // Jump to definitions step (conversation.length)
    setInstructionsStep(conversationLength);
  };
// Helper: conversation length for instructions step
const conversationLength = 8; // Update if conversation array changes in GameInstructions

  const handleBackClick = () => {
    console.log('Back button clicked');
    // Add navigation logic here
  };

  const handleHomeClick = () => {
    console.log('Home button clicked');
    // Add navigation logic here
  };

  const handleCellClick = (id: number) => {
    toggleCell(id);
    if (waitingForInteraction) {
      onUserInteraction();
    }
  };

  const layout = useDeviceLayout();

  // Responsive styles based on device layout
  const isMobile = layout.isMobile;
  const isHorizontal = layout.isHorizontal;

  // Adjusted styles for mobile/landscape
  const rootStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(rgba(0,0,0,0.69), rgba(0,0,0,0.55)), url("/backgrounds/BingoBg3.jpg") center center / cover no-repeat',
    display: 'flex',
    flexDirection: 'column',
    ...(isMobile && isHorizontal
      ? { padding: '0rem', minHeight: '100dvh' }
      : {}),
  };
  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '0.3rem 3.5rem 1rem 3.5rem' : '1rem', // top/right/left: 3rem, bottom: 1rem for mobile
  };
  const gridStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isMobile ? (isHorizontal ? '100vw' : '98vw') : '36rem',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '0.5rem' : '1rem',
    height: '100%',
    position: 'relative',
    minHeight: isMobile ? (isHorizontal ? '60dvh' : '40dvh') : '32rem', // reduced height
    background: isMobile ? 'rgba(255,255,255,0.01)' : undefined,
  };
  const colStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const colInnerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isMobile ? (isHorizontal ? '98vw' : '98vw') : '48rem',
  };
  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: isMobile ? '0.5rem 0' : '1rem 0',
    color: 'white',
    fontSize: isMobile
      ? (isHorizontal ? '0.7rem' : '1rem')
      : '1.2rem',
    opacity: 0.75,
  };

  // Timer formatting (copied from Navbar)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Background music state and ref
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState('/sounds/bgm.mp3');
  const [isEnabled] = useState(true); // You can control this with a mute button if needed
  const effectiveVolume = 0.25;

  React.useEffect(() => {
    // Play sound when BingoGame mounts or settings change
    const audio = audioRef.current;
    if (audio && isEnabled) {
      audio.volume = effectiveVolume;
      setCurrentTrack('/bgm.mp3');
      // Try to play on user interaction for autoplay policy
      const playAudio = () => {
        audio.play().catch(() => {});
        window.removeEventListener('pointerdown', playAudio);
        window.removeEventListener('keydown', playAudio);
      };
      window.addEventListener('pointerdown', playAudio);
      window.addEventListener('keydown', playAudio);
      // Try to play immediately
      audio.play().catch(() => {});
      return () => {
        audio.pause();
        audio.currentTime = 0;
        window.removeEventListener('pointerdown', playAudio);
        window.removeEventListener('keydown', playAudio);
      };
    }
  }, [isEnabled, effectiveVolume, setCurrentTrack]);

  // Loader state
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Simulate loading for 1s, or replace with real loading logic
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Pause timer whenever tutorial is active (TutorialToast or intro modal is visible)
  React.useEffect(() => {
    if (tutorialActive) {
      stopTimer();
    }
  }, [tutorialActive, stopTimer]);

  // Prevent timer from starting if either tutorialActive is true OR instructions are not at definitions
  const handleDefinitionsStart = () => {
    setTutorialDone(true);
    // Only start timer if tutorial is NOT active
    if (!tutorialActive) {
      startTimer();
    }
    setInstructionsStep(undefined); // Reset for next time
  };


  // Handle step changes from GameInstructions to control the timer and answeringAllowed
  const handleInstructionsStepChange = (step: number, atDefinitions?: boolean) => {
    const allowed = !!atDefinitions;
    setAnsweringAllowed(allowed);
    if (allowed && !tutorialActive) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  // Custom play again handler to reset game and instructions
  const handlePlayAgain = () => {
    playAgain(); // Call the hook's playAgain to reset game and log
    setInstructionsStep(undefined); // Start from the beginning of instructions
    setTutorialDone(false); // Show instructions/conversation again
    setResetCount(c => c + 1); // Force re-mount GameInstructions
  };

  if (loading) {
    return <LoaderScreen />;
  }

  return (
    <>
      <motion.div
        style={rootStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar
          score={score}
          rowsSolved={rowsSolved}
          onBackClick={handleBackClick}
          onHomeClick={handleHomeClick}
          onResetTutorial={resetTutorial}
          timer={timer}
          onPlayAgain={handlePlayAgain} // Use custom handler
          tutorialStep={currentStep?.id} // Pass tutorial step to Navbar
        />
        <motion.div
          style={mainStyle}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Mobile: instructions left, grid right, no images/timer */}
          {isMobile ? (
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                maxWidth: '100vw',
                gap: '2rem',
                minHeight: isHorizontal ? '28dvh' : '18dvh',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingRight: '0.25rem',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.div style={{ width: '100%' }}>
                  {/* Show Bingo logo above instructions in landscape mode */}
                  {isHorizontal && (
                    <motion.img
                      src="/logos/Bingo.png"
                      alt="Bingo Logo"
                      style={{
                        display: 'block',
                        height: '80px',
                        padding: '0.6rem 0 1rem 0',
                        marginLeft: '4rem',
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.18 }}
                    />
                  )}
                  <GameInstructions 
                    key={resetCount} // Force re-mount on reset
                    selectedDefinition={selectedDefinition} 
                    onDefinitionsStart={handleDefinitionsStart}
                    tutorialStep={currentStep?.id} 
                    forceStep={instructionsStep}
                    onStepChange={handleInstructionsStepChange}
                  />
                </motion.div>
              </motion.div>
              <motion.div
                style={{
                  flex: 2,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <motion.div style={{ width: '100%' }}>
                  <BingoGrid
                    cells={cells}
                    completedLines={completedLines}
                    gameComplete={gameComplete}
                    onCellClick={handleCellClick}
                    isInCompletedLine={isInCompletedLine}
                    // Only allow answering if tutorial is done, not waiting, and answeringAllowed is true
                    disabled={!tutorialDone || waitingForInteraction || !answeringAllowed}
                    tutorialStep={currentStep?.id}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              style={gridStyle}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Trainer character image on the left */}
              {!isMobile && (
                <>
                  <motion.img
                    src="/characters/trainer.png"
                    alt="Trainer Character"
                    style={{
                      height: '320px',
                      position: 'absolute',
                      left: '-360px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                  <motion.img
                    src="/logos/Bingo.png"
                    alt="Bingo Logo"
                    style={{
                      height: '180px',
                      position: 'absolute',
                      left: '-340px',
                      top: '10%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                  />
                </>
              )}
              {/* Timer clock above intern character */}
              {!isMobile && (
                <motion.div
                  style={{
                    position: 'absolute',
                    right: '-280px',
                    top: '10%',
                    transform: 'translateY(-100%)',
                    zIndex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div
                    className="pixel-border bg-blue-900 px-4 py-2 flex flex-col items-center text-xs sm:text-sm shadow-lg"
                    style={{
                      fontWeight: 700,
                      color: '#38bdf8',
                      minWidth: '90px',
                    }}
                  >
                    <div className="flex items-center gap-2 mt-1">
                      <Clock style={{ width: 28, height: 28, color: '#ffffff' }} />
                      <span className="text-white font-black pixel-text text-lg">{formatTime(timer)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* Mobile: show timer and logo above grid */}
              {isMobile && (
                <motion.div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: isHorizontal ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isHorizontal ? '1rem' : '0.5rem',
                    marginBottom: isHorizontal ? '0.5rem' : '0.5rem',
                    marginTop: isHorizontal ? '0.5rem' : '0.5rem',
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <motion.img
                    src="/logos/Bingo.png"
                    alt="Bingo Logo"
                    style={{
                      height: isHorizontal ? '90px' : '60px',
                      marginRight: isHorizontal ? '1rem' : 0,
                      marginBottom: isHorizontal ? 0 : '0.25rem',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.18 }}
                  />
                  <motion.div
                    className="pixel-border bg-blue-900 px-4 py-2 flex flex-col items-center text-xs sm:text-sm shadow-lg"
                    style={{
                      borderRadius: '1.5rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      minWidth: '90px',
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <span className="text-blue-300 font-bold pixel-text">TIME</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock style={{ width: 24, height: 24, color: '#ffffff' }} />
                      <span className="text-white font-black pixel-text text-base">{formatTime(timer)}</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              {/* Top - Instructions */}
              <motion.div
                style={colStyle}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <motion.div style={colInnerStyle}>
                  <GameInstructions 
                    selectedDefinition={selectedDefinition} 
                    onDefinitionsStart={handleDefinitionsStart}
                    tutorialStep={currentStep?.id} 
                    forceStep={instructionsStep}
                    onStepChange={handleInstructionsStepChange}
                  />
                </motion.div>
              </motion.div>
              {/* Bottom - Bingo Grid with intern character on the right */}
              <motion.div
                style={{
                  ...colStyle,
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: isMobile ? (isHorizontal ? '28dvh' : '18dvh') : '24rem',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div style={colInnerStyle}>
                  <BingoGrid
                    cells={cells}
                    completedLines={completedLines}
                    gameComplete={gameComplete}
                    onCellClick={handleCellClick}
                    isInCompletedLine={isInCompletedLine}
                    // Only allow answering if tutorial is done, not waiting, and answeringAllowed is true
                    disabled={!tutorialDone || waitingForInteraction || !answeringAllowed}
                    tutorialStep={currentStep?.id}
                  />
                </motion.div>
                {/* Intern character image on the right */}
                {!isMobile && (
                  <motion.img
                    src="/characters/intern.png"
                    alt="Intern Character"
                    style={{
                      height: '320px',
                      position: 'absolute',
                      right: '-360px',
                      top: '36%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
        <motion.div
          style={footerStyle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Copyright © 2025 Rareminds.
        </motion.div>
        {/* Background music audio element */}
        <audio ref={audioRef} src={currentTrack} loop />
        <CompletedLineModal
          isVisible={completedLineModal}
          onClose={closeCompletedLineModal}
          timer={timer}
          rowsSolved={rowsSolved}
          score={score}
        />
      </motion.div>
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >

            <GameCompleteModal isVisible={gameComplete} onPlayAgain={handlePlayAgain} score={score} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {answerFeedback.isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AnswerModal
              isVisible={answerFeedback.isVisible}
              isCorrect={answerFeedback.isCorrect}
              selectedTerm={answerFeedback.selectedTerm}
              correctDefinition={answerFeedback.correctDefinition}
              onClose={closeAnswerModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Tutorial Toast */}
      <AnimatePresence>
        {tutorialActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <TutorialToast
              step={currentStep}
              onNext={nextStep}
              onSkip={handleSkipTutorial}
              isVisible={tutorialActive}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BingoGame;