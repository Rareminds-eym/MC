// Dynamically change module
  const setModule = (num: number) => {
    setGameState(prev => ({ ...prev, moduleNumber: num }));
  };
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GameState } from './types';
import { casesByModule } from './data/cases';
import { Product2D } from './Product2D';
import { QuestionPanel } from './QuestionPanel';
import { GameHeader } from './GameHeader';
import Animation_manufacture from './animated_manufacture'
import level4Service from './services';
import { saveFinalScoreClean } from './utils/finalScoreSaver';
import { 
  ChevronRight, 
  AlertTriangle, 
  ChevronLeft
} from 'lucide-react';

// Additional imports can be added here as needed
import { FeedbackPopup } from './Popup';
import HighScoreAlert from './HighScoreAlert';
import Level4ScoreBoard from './Level4ScoreBoard';
import { saveLevel4Completion } from '../../services/level4GameService';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui';
import { Crown, Gamepad2 } from 'lucide-react';
// ...existing code...

type GamePhase = 'login' | 'reportView' | 'step1' | 'step2' | 'step3' | 'feedback';
type GamePhaseExtended = GamePhase | 'productShowcase';


export const GameBoard2D: React.FC = () => {
  // Debug: log useParams output to diagnose routing issues
  const params = useParams();
  // console.log("useParams output:", params);
  // All state hooks need to be at the top level of the component
  const module = params.moduleId ?? params.module;
  const level = params.level;
  const { user } = useAuth();
  const initialModuleNumber = module ? Number(module) : 1;
  const levelNumber = level ? Number(level) : 4;
  const [gameState, setGameState] = useState<GameState>({
    currentCase: 0,
    moduleNumber: initialModuleNumber,
    answers: {
      violation: null,
      rootCause: null,
      impact: null
    },
    score: 0,
    totalQuestions: 0,
    showFeedback: false,
    gameComplete: false
  });

  // Update gameState.moduleNumber whenever the module param changes
  useEffect(() => {
    if (module) {
      setGameState(prev => ({
        ...prev,
        moduleNumber: Number(module),
        currentCase: 0,
        answers: { violation: null, rootCause: null, impact: null },
        score: 0,
        totalQuestions: 0,
        showFeedback: false,
        gameComplete: false
      }));
    }
  }, [module]);

  // Track all component state at the top level
  // High score state is handled elsewhere now
  const [, setIsHighScore] = useState(false); // Keep setter for future use
  // Add new phase for ProductShowcase
  const [currentPhase, setCurrentPhase] = useState<GamePhaseExtended>('productShowcase');
  const [canContinue, setCanContinue] = useState(true); // Login phase always allows continue
  const [timer, setTimer] = useState<number>(0); // Start from 0
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [scoredQuestions, setScoredQuestions] = useState<Record<number, Set<'violation' | 'rootCause' | 'impact'>>>({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [showHighScorePopup, setShowHighScorePopup] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [step2InstructionDismissed, setStep2InstructionDismissed] = useState(false);
  const [showCorrectionMessage, setShowCorrectionMessage] = useState(false);
  // allAnswersCorrectAtFeedback will be declared later
  
  // All refs need to be at the top level too
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track last synced state to prevent duplicate syncs
  const lastSyncedRef = useRef({
    score: -1,
    violation: null as number | null,
    rootCause: null as number | null,
    impact: null as number | null,
    showFeedback: false
  });

  // Derived state
  // Dynamically select module number, always prefer URL param if available
  const moduleNumber = module ? Number(module) : (gameState.moduleNumber || 1);
  // Support both string and number keys in casesByModule (type assertion for TS)
  // Only include cases with a valid questions object
  const moduleCases = ((casesByModule as any)[moduleNumber] || (casesByModule as any)[String(moduleNumber)] || []).filter((c: any) => c && c.questions);
  // console.log("👉 Selected moduleNumber:", moduleNumber);
  const currentCase = moduleCases[gameState.currentCase];
  // console.log("Params:", module, moduleNumber, (casesByModule as any)[moduleNumber], (casesByModule as any)[String(moduleNumber)]);
  // Add Supabase integration using Level4Service
  const syncGameState = async (gameState: GameState, timer: number) => {
    if (!user) return;

    try {
      // Prepare cases data for the current game state
      const casesData = {
        currentCase: gameState.currentCase,
        caseProgress: [{
          id: gameState.currentCase + 1,
          answers: gameState.answers,
          isCorrect: false, // Will be determined by the service
          attempts: 1,
          timeSpent: timer
        }],
        scoredQuestions: {}
      };

      // IMPORTANT: Use simple upsert for progress saves to avoid adding to score history
      // Only the final completion should manage score history
      await level4Service.upsertGameData(
        user.id,
        gameState.moduleNumber || 1,
        gameState.score,
        false, // Not completed yet
        timer,
        casesData
      );

      console.log('🔄 Game progress synced to Supabase (no history update)');
    } catch (error) {
      console.error('❌ Failed to sync game state:', error);
    }
  };

  const completeGame = async (gameState: GameState, timer: number, isSubmitButton: boolean = false) => {
    if (!user) return;

    try {
      // Prepare final cases data
      const casesData = {
        currentCase: gameState.currentCase,
        caseProgress: moduleCases.map((caseItem, index) => ({
          id: caseItem.id,
          answers: index <= gameState.currentCase ? gameState.answers : { violation: null, rootCause: null, impact: null },
          isCorrect: index <= gameState.currentCase,
          attempts: 1,
          timeSpent: index === gameState.currentCase ? timer : 0
        })),
        scoredQuestions: {
          [gameState.currentCase]: ["violation", "rootCause", "impact"]
        }
      };

      let recordId;

      if (isSubmitButton) {
        // For Submit button, we need to ensure clean score history
        // First, delete any existing data for this module to start fresh
        try {
          await level4Service.deleteModuleData(user.id, gameState.moduleNumber || 1);
          console.log('🧹 Cleared existing data for clean score history');
        } catch (error) {
          console.log('ℹ️ No existing data to clear (this is normal for first play)');
        }

        // Now save the final score with history management
        recordId = await level4Service.upsertGameDataWithHistory(
          user.id,
          gameState.moduleNumber || 1,
          gameState.score,
          true, // Game completed
          timer,
          casesData
        );
        console.log('✅ Final game data saved via Submit button with clean history:', recordId);
      } else {
        // For automatic completion, use simple upsert to avoid duplicate history entries
        recordId = await level4Service.upsertGameData(
          user.id,
          gameState.moduleNumber || 1,
          gameState.score,
          true, // Game completed
          timer,
          casesData
        );
        console.log('✅ Game completed and saved to Supabase (no history):', recordId);
      }

    } catch (error) {
      console.error('❌ Failed to complete game:', error);
      throw error; // Re-throw so the UI can handle it
    }
  };

  const checkHighScore = async (newScore: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const existingData = await level4Service.getUserModuleData(user.id, gameState.moduleNumber || 1);
      const isHighScore = !existingData || newScore > existingData.score;

      if (isHighScore) {
        console.log('🏆 New high score achieved!', { newScore, previousScore: existingData?.score || 0 });
      }

      return isHighScore;
    } catch (error) {
      console.error('❌ Failed to check high score:', error);
      return false;
    }
  };

  // Save game state to localStorage for Supabase integration
  useEffect(() => {
    // Save the game state
    localStorage.setItem('level4_gameState', JSON.stringify({
      ...gameState,
      correctAnswers: getCorrectAnswers() // Add correct answers count for the wrapper
    }));
    
    // Trigger storage event for our wrapper
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'level4_gameState',
      newValue: localStorage.getItem('level4_gameState')
    }));
  }, [gameState]);
  
  // Save timer to localStorage
  useEffect(() => {
    localStorage.setItem('level4_timer', timer.toString());
  }, [timer]);

  // Improved sync game state with Supabase only on meaningful changes
  useEffect(() => {
    // Sync on significant state changes only, not on every render
    const shouldSync = 
      // We have at least one answer
      (gameState.answers.violation !== null || 
       gameState.answers.rootCause !== null || 
       gameState.answers.impact !== null) &&
      // And we've actually made progress (not just initial state)
      (gameState.score > 0 || gameState.totalQuestions > 0 || gameState.showFeedback) &&
      // And something has changed since last sync
      (gameState.score !== lastSyncedRef.current.score || 
       gameState.answers.violation !== lastSyncedRef.current.violation ||
       gameState.answers.rootCause !== lastSyncedRef.current.rootCause ||
       gameState.answers.impact !== lastSyncedRef.current.impact ||
       gameState.showFeedback !== lastSyncedRef.current.showFeedback);
      
    if (shouldSync) {
      // Add a longer delay to batch rapid changes - this helps prevent duplicate records
      const syncTimeout = setTimeout(() => {
        console.log(`[GameBoard] Syncing state: score=${gameState.score}, answers=${Object.values(gameState.answers).filter(Boolean).length}/3`);
        syncGameState(gameState, timer);
        
        // Update last synced state
        lastSyncedRef.current = {
          score: gameState.score,
          violation: gameState.answers.violation,
          rootCause: gameState.answers.rootCause,
          impact: gameState.answers.impact,
          showFeedback: gameState.showFeedback
        };
      }, 500);
      return () => clearTimeout(syncTimeout);
    }
  }, [gameState.answers, gameState.score, gameState.showFeedback, gameState.totalQuestions, timer, user]);

  // Handle game completion separately
  useEffect(() => {
    // Only trigger on actual completion state change
    if (gameState.gameComplete) {
      completeGame(gameState, timer);
    }
  }, [gameState.gameComplete, gameState, timer, user]);

  // Force animation refresh when phase changes
  useEffect(() => {
    if (['reportView', 'step1', 'step2', 'step3'].includes(currentPhase)) {
      setAnimationKey(prev => prev + 1);
    }
  }, [currentPhase]);

  // Start timer when entering investigation phases
  useEffect(() => {
    if (["reportView", "step1", "step2", "step3"].includes(currentPhase) && !timerActive) {
      setTimerActive(true);
    }
    // Stop timer when leaving investigation phases
    if (!["reportView", "step1", "step2", "step3"].includes(currentPhase)) {
      setTimerActive(false);
    }
  }, [currentPhase]);

  // Timer count up effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setTimeout(() => setTimer(timer + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerActive, timer]);

  // Reset timer only if game is fully restarted (login, first case, and score is 0)
  useEffect(() => {
    if (currentPhase === 'login' && gameState.currentCase === 0 && gameState.score === 0) {
      setTimer(0);
    }
  }, [currentPhase, gameState.currentCase, gameState.score]);

  const handleAnswerSelect = (questionType: 'violation' | 'rootCause' | 'impact', answer: number) => {
    setGameState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionType]: answer,
        // Add a dummy value to force state update if needed
        _lastSelected: Math.random()
      }
    }));
    setCanContinue(true); // Always enable continue, even if already selected
  };

  const handleContinue = async () => {
    // Show loading only when transitioning between major phases
    if (currentPhase === 'login' || currentPhase === 'feedback') {
      // Remove loading logic
    }
    
    switch (currentPhase) {
      case 'productShowcase':
        setCurrentPhase('login');
        setCanContinue(true);
        break;
      case 'login':
        setCurrentPhase('reportView');
        setCanContinue(true);
        break;
      case 'reportView':
        // Skip step1 if violation question doesn't exist
        if (!currentCase.questions.violation) {
          setCurrentPhase('step2');
        } else {
          setCurrentPhase('step1');
        }
        setCanContinue(false);
        break;
      case 'step1':
        if (gameState.answers.violation !== null) {
          setCurrentPhase('step2');
          setCanContinue(gameState.answers.rootCause !== null);
        }
        break;
      case 'step2':
        if (gameState.answers.rootCause !== null) {
          setCurrentPhase('step3');
          setCanContinue(gameState.answers.impact !== null);
        }
        break;
      case 'step3':
        if (gameState.answers.impact !== null) {
          // Ensure state is updated before switching to feedback
          // IMPROVED: Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            setCurrentPhase('feedback');
            calculateResults();
          });
        }
        break;
      case 'feedback':
        const correctAnswers = getCorrectAnswers();
        const totalQuestions = (currentCase.questions.violation ? 1 : 0) + 1 + 1; // violation (optional) + rootCause + impact
        if (correctAnswers === totalQuestions) {
          // Only continue if all answers are correct
          // Use moduleCases.length to determine if there are more cases
          if (gameState.currentCase < moduleCases.length - 1) {
            // Move to next case - maintain the accumulated score
            const nextGameState = {
              ...gameState,
              currentCase: gameState.currentCase + 1,
              answers: { violation: null, rootCause: null, impact: null },
              showFeedback: false,
            };
            console.log(`[Game] Moving to case ${nextGameState.currentCase + 1} of ${moduleCases.length} with accumulated score ${nextGameState.score}`);
            await syncGameState(nextGameState, timer);
            setGameState(nextGameState);
            setCurrentPhase('login');
            setCanContinue(true);
          } else {
            // Game complete - mark as complete but keep the accumulated total score
            const completedGameState = { ...gameState, gameComplete: true };
            console.log(`[Game] Game complete with final COMBINED score: ${completedGameState.score}`);
            const isNewHighScore = await checkHighScore(gameState.score);
            await completeGame(completedGameState, timer);
            const correctAnswers = getCorrectAnswers();
            if (user) {
              try {
                await saveLevel4Completion({
                  userId: user.id,
                  moduleId: moduleNumber,
                  score: gameState.score,
                  time: timer,
                  violations: gameState.currentCase + 1,
                  correctAnswers: correctAnswers,
                  totalQuestions: 3
                });
                console.log("[Game] Successfully saved to level_4_user_summary table");
              } catch (err) {
                console.error("[Game] Error saving to level_4_user_summary:", err);
              }
            } else {
              console.error("[Game] Cannot save summary - user is not authenticated");
            }
            setGameState(completedGameState);
            setIsHighScore(isNewHighScore);
            if (isNewHighScore) {
              setShowHighScorePopup(true);
              setTimeout(() => {
                setShowHighScorePopup(false);
              }, 5000);
            }
          }
        } else {
          // Allow retry: reset answers but keep accumulated score
          const resetGameState = {
            ...gameState,
            answers: { violation: null, rootCause: null, impact: null },
            showFeedback: false
            // score is maintained
            // totalQuestions is maintained
          };
          setGameState(resetGameState);
          setCurrentPhase('step1');
          setCanContinue(true);
          
          // Sync the retry to Supabase with current score
          syncGameState(resetGameState, timer);
        }
        break;
    }
    // Remove loading logic
  };

  const handleBack = () => {
    try {
      // Simple navigation logic for back button
      const getCurrentModuleId = () => {
        // 1. Use module param if available and valid
        if (module && !isNaN(Number(module))) return module;
        // 2. Use gameState.moduleNumber if available and valid
        if (gameState.moduleNumber && !isNaN(Number(gameState.moduleNumber))) return String(gameState.moduleNumber);
        // 3. Try to extract from URL as fallback
        const match = window.location.pathname.match(/modules\/(\d+)/);
        if (match && match[1]) return match[1];
        // 4. Default fallback
        return '1';
      };

      const resolvedModuleId = getCurrentModuleId();

      if (currentPhase === 'login' || currentPhase === 'productShowcase') {
        // Navigate back to the level listing page of the module
        const backUrl = `/modules/${resolvedModuleId}`;
        window.location.href = backUrl;
        return;
      }

      // Handle other phases
      if (currentPhase === 'reportView') {
        setCurrentPhase('login');
        setCanContinue(true);
      } else if (currentPhase === 'step1') {
        setCurrentPhase('reportView');
        setCanContinue(true);
      } else if (currentPhase === 'step2') {
        if (currentCase?.questions?.violation) {
          setCurrentPhase('step1');
          setCanContinue(gameState.answers.violation !== null);
        } else {
          setCurrentPhase('reportView');
          setCanContinue(true);
        }
      } else if (currentPhase === 'step3') {
        setCurrentPhase('step2');
        setCanContinue(gameState.answers.rootCause !== null);
      } else if (currentPhase === 'feedback') {
        setCurrentPhase('step3');
        setCanContinue(gameState.answers.impact !== null);
      } else {
        setCurrentPhase('login');
        setCanContinue(true);
      }

    } catch (error) {
      console.error('[handleBack] Error in handleBack function:', error);
      // Fallback navigation
      try {
        window.location.href = '/modules/1';
      } catch (fallbackError) {
        console.error('[handleBack] Fallback navigation failed:', fallbackError);
      }
    }
  };

  const [allAnswersCorrectAtFeedback, setAllAnswersCorrectAtFeedback] = useState(false);

  const calculateResults = () => {
    const caseIdx = gameState.currentCase;
    const currentScored = scoredQuestions[caseIdx] || new Set<'violation' | 'rootCause' | 'impact'>();
    let newScore = 0;
    let newQuestions = 0;
    const newScored = new Set(currentScored);
    
    // Prepare question list with correct types, only include questions that exist
    const questionList: Array<['violation' | 'rootCause' | 'impact', number | null, number]> = [];

    if (currentCase.questions.violation) {
      questionList.push(['violation', gameState.answers.violation, currentCase.questions.violation.correct]);
    }
    questionList.push(['rootCause', gameState.answers.rootCause, currentCase.questions.rootCause.correct]);
    questionList.push(['impact', gameState.answers.impact, currentCase.questions.impact.correct]);
    
    questionList.forEach(([type, userAns, correctAns]) => {
      if (!currentScored.has(type) && userAns !== null) {
        newQuestions++;
        if (userAns === correctAns) {
          newScore += 5;
        }
        newScored.add(type);
      }
    });
    
    // Check if all answers are correct at feedback time
    const allCorrect =
      (!currentCase.questions.violation || gameState.answers.violation === currentCase.questions.violation.correct) &&
      gameState.answers.rootCause === currentCase.questions.rootCause.correct &&
      gameState.answers.impact === currentCase.questions.impact.correct;
    
    setAllAnswersCorrectAtFeedback(allCorrect);
    
    // ENHANCED LOGGING: Clearly show the accumulated score calculation
    console.log(`[Game] Calculating results for case ${caseIdx + 1}:`);
    console.log(`[Game] - Previous accumulated score: ${gameState.score}`);
    console.log(`[Game] - New points from this case: +${newScore}`);
    console.log(`[Game] - New accumulated total: ${gameState.score + newScore}`);
    
    // Update the game state with new scores - this updates the ACCUMULATED total
    const updatedGameState = {
      ...gameState,
      score: gameState.score + newScore, // Add to the accumulated score
      totalQuestions: gameState.totalQuestions + newQuestions,
      showFeedback: true
    };
    
    // Update local state
    setGameState(updatedGameState);
    setScoredQuestions(prev => ({ ...prev, [caseIdx]: newScored }));
    
    // We don't need to force an immediate sync here
    // The useEffect hook will detect the state change and sync automatically
    // This prevents possible duplicate sync operations
    
    // Log for debugging
    console.log(`[Game] Calculated results: +${newScore} points, ${newQuestions} new questions scored, all correct: ${allCorrect}`);
    console.log(`[Game] ACCUMULATED TOTAL SCORE NOW: ${updatedGameState.score}`);
  };

  const getCorrectAnswers = () => {
    let correct = 0;
    if (currentCase.questions.violation && gameState.answers.violation !== null && gameState.answers.violation === currentCase.questions.violation.correct) correct++;
    if (gameState.answers.rootCause !== null && gameState.answers.rootCause === currentCase.questions.rootCause.correct) correct++;
    if (gameState.answers.impact !== null && gameState.answers.impact === currentCase.questions.impact.correct) correct++;
    return correct;
  };

  // Character rendering is now handled by the CharacterRotator component
  // Phase 1: Login
  const renderLogin = () => {
    // Filter for special cases with negative indices
    const specialCases = moduleCases.filter((c: any, idx: number) => idx === -1 || idx === -2);
    // Determine played and current cases for highlighting (vertical stack)
    const caseCards = moduleCases.map((c: any, idx: number) => {
      let brightness = '';
      if (gameState.currentCase === idx) {
        brightness = 'brightness-125 border-yellow-400 shadow-lg';
      } else if (gameState.currentCase > idx) {
        brightness = 'brightness-100 border-cyan-400';
      } else {
        brightness = 'brightness-50 border-gray-400';
      }
      return (
        <div
          key={idx}
          className={`flex flex-col items-center justify-center px-2 py-2 my-1 rounded-xl border-2 pixel-border transition-all duration-300 cursor-pointer ${brightness}`}
          style={{ minWidth: 80, minHeight: 60 }}
        >
          <span className="font-bold text-md lg:text-lg text-white">Case {idx + 1}</span>
          {/* <span className="text-xs text-cyan-200 mt-1">{c?.title || ''}</span> */}
        </div>
      );
    });
    return (
      <div className="fixed inset-0 h-screen w-screen p-0 m-0 flex flex-col text-xs md:text-sm lg:text-base z-50 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        {/* Neon Animated SVG Background - only one layer */}
<img
  src="/backgrounds/background.jpeg"
  alt="Background"
  className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25 object-cover object-center"
/>
         {/* <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25">
          <Animation_manufacture />
        </div> */}
       
        {/* Main content with gradient overlay */}

        <div className="relative z-10 h-full w-full flex flex-col text-xs md:text-sm lg:text-base">
          {/* Case cards column below back button, left-aligned */}
          <div className="absolute left-2 top-16 z-40 flex flex-col items-center justify-start">
            {caseCards}
          </div>
          {/* Header */}
          <div className="flex flex-col items-center justify-center w-full z-10 landscape:relative landscape:z-20 landscape:bg-transparent landscape:pt-2 ">
            <div className="pixel-border-thick bg-gradient-to-r from-yellow-400 to-orange-500 p-1 lg:p-4 relative">
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="w-8 h-18 lg:w-16 lg:h-16 bg-yellow-300 pixel-border flex items-center justify-center">
                  <Crown className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-800" />
                </div>
                <div className="text-left">
                  <h1 className="text-lg lg:text-4xl font-black text-white pixel-text tracking-wider">
                    DEVIATION REPORT
                  </h1>
                  <div className="text-yellow-200 text-xs sm:text-sm font-bold tracking-widest">
                    Quality deviation detected - Investigation required
                  </div>
                </div>
                <div className="w-8 h-8 lg:w-16 lg:h-16 bg-orange-300 pixel-border flex items-center justify-center">
<Gamepad2 className="w-5 h-5 sm:w-8 sm:h-8 text-orange-800 drop-shadow-glow animate-bounce-slow" />

                </div>
              </div>
            </div>
          </div>

          {/* Special Cases Display */}
          {specialCases.length > 0 && (
            <div className="flex flex-col items-center justify-center w-full mt-4">
              <h3 className="text-cyan-300 font-bold text-lg mb-2">Special Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {specialCases.map((c: any, idx: number) => (
                  <div key={idx} className="pixel-border bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900 p-4 rounded-xl shadow-lg flex flex-col items-center">
                    <h4 className="text-yellow-300 font-bold text-base mb-1">{c.title || `Case ${idx - 2}`}</h4>
                    <p className="text-white text-xs mb-2">{c.scenario}</p>
                    <div className="w-full flex flex-col items-center justify-center">
                      <Product2D
                        productName={c.productName}
                        batchNumber={c.batchNumber}
                        hasDeviation={true}
                        imageSrc={c.imageSrc}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responsive layout: flex-row for mobile landscape, grid for desktop */}
          <div className="flex flex-col items-center justify-center flex-1 w-full h-auto lg:h-full mb-4 md:mb-0 lg:mt-2">
<div
  className="pixel-border-thick bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-xl flex flex-col mx-auto w-[96vw] sm:w-[90vw] md:w-[80vw] lg:w-auto max-w-md lg:max-w-2xl xl:max-w-3xl min-h-[3 40px] lg:max-h-[calc(100vh-120px)] lg:p-4 rounded-2xl border-2 border-cyan-400/40 relative overflow-hidden"
>
  {/* Card background image, slightly visible */}
  <img
    src="/backgrounds/background.jpeg"
    alt="Card Background"
    className="absolute inset-0 w-full h-full object-cover object-center opacity-10 pointer-events-none select-none z-0"
    aria-hidden="true"
  />
              {/* Header */}
              {/* <div className="flex flex-col items-center justify-center w-full mb-4">
                <h1 className="text-xl md:text-2xl lg:text-4xl font-black text-cyan-300 tracking-wide">DEVIATION REPORT</h1>
                <p className="text-cyan-400 text-xs lg:text-lg font-semibold text-center">
                  Quality deviation detected - Investigation required
                </p>
              </div> */}
              {/* Score/Case Info */}
              {/* <div className="flex flex-row justify-center items-center gap-4 mb-4">
                <div className="pixel-border bg-green-600 px-3 py-2 rounded-lg flex flex-col items-center mb-1">
                  <span className="text-green-100 text-xs font-bold">CASE</span>
                  <span className="text-white text-lg font-black">{gameState.currentCase + 1}</span>
                </div>
                <div className="pixel-border bg-blue-600 px-3 py-2 rounded-lg flex flex-col items-center mb-1">
                  <span className="text-blue-100 text-xs font-bold">SCORE</span>
                  <span className="text-white text-lg font-black">{gameState.score}</span>
                </div>
                <div className="pixel-border bg-yellow-600 px-3 py-2 rounded-lg flex flex-col items-center">
                  <span className="text-yellow-100 text-xs font-bold">TOTAL</span>
                  <span className="text-white text-lg font-black">{gameState.totalQuestions}</span>
                </div>
              </div> */}
              {/* Main Content */}
              <div className="flex-1 flex flex-col items-center justify-start lg:justify-center px-4 py-2 w-full">
                <h2 className="text-xs md:text-xl lg:text-2xl xl:text-3xl font-bold text-cyan-400 text-center mb-1 lg:mb-4">
                  Product Under Investigation
                </h2>
                <div className="w-full flex flex-col items-center justify-center">
                  <Product2D
                    productName={currentCase.productName}
                    batchNumber={currentCase.batchNumber}
                    hasDeviation={true}
                    imageSrc={currentCase.imageSrc}
                  />
                </div>
              </div>
              {/* Navigation footer */}
              <div className="flex-shrink-0 flex flex-row items-center justify-center w-full lg:px-4 py-3">
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center lg:px-6 py-1 lg:py-2 text-white font-black text-sm lg:text-lg rounded-lg shadow-lg"
                  style={{ minWidth: 180 }}
                  aria-label="Start Investigation"
                >
                  <ChevronRight className="w-5 h-5 mr-2" />
                  START INVESTIGATION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Phase 2: Report View
  const renderReportView = () => {
    return (
      <div 
        key={`reportView-${animationKey}`}
        className="fixed inset-0 h-[auto] w-screen z-40 p-[1vw] flex flex-col text-xs md:text-sm"
      >
        {/* Animated background layer */}
        {/* <div className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 opacity-25">
          <Animation_manufacture />
        </div> */}

<img
src="/backgrounds/background.jpeg"
alt="Background"
className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25 object-cover object-center"
/>

        <div className="w-[100%] h-[100%] flex-1 flex flex-col relative z-10">
          {/* Header */}
          {/* <div className="text-center mb-[1vw] w-[100%]">
            <h1 className="text-xl md:text-2xl font-bold text-cyan-400  ">Deviation Investigation Game</h1>
            <p className="text-[10px] lg:text-2xl text-white  ">Case Report Review</p>
          </div> */}
          {/* Responsive layout: flex-row for mobile landscape, grid for desktop */}
          <div className="flex flex-col items-center justify-center flex-1 w-full h-full lg:mb-4 lg:md:mb-0 mt-2">
<div
  className="pixel-border-thick bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-xl flex flex-col mx-auto w-[96vw] sm:w-[90vw] md:w-[80vw] lg:w-auto max-w-lg lg:max-w-lg  lg:h-[60%] h-[100%] xl:max-w-3xl lg:min-h-[auto]  max-h-[calc(100vh-80px)] p-4 rounded-2xl border-2 border-cyan-400/40 relative overflow-hidden"
>
  {/* Card background image, slightly visible */}
  <img
    src="/backgrounds/background.jpeg"
    alt="Card Background"
    className="absolute inset-0 w-full h-full object-cover object-center opacity-10 pointer-events-none select-none z-0"
    aria-hidden="true"
  />
              {/* Header */}
              <div className="flex flex-col items-center justify-center w-full lg:mb-4">
                <h1 className="text-xl md:text-2xl lg:text-4xl font-black text-cyan-300 tracking-wide">DEVIATION REPORT</h1>
                <p className="text-cyan-400 text-xs lg:text-lg font-semibold text-center">
                  Quality deviation detected - Investigation required
                </p>
              </div>
              {/* Score/Case Info */}
              {/* <div className="flex flex-row justify-center items-center gap-4 mb-4">
                <div className="pixel-border bg-green-600 px-3 py-2 rounded-lg flex flex-col items-center mb-1">
                  <span className="text-green-100 text-xs font-bold">CASE</span>
                  <span className="text-white text-lg font-black">{gameState.currentCase + 1}</span>
                </div>
                <div className="pixel-border bg-blue-600 px-3 py-2 rounded-lg flex flex-col items-center mb-1">
                  <span className="text-blue-100 text-xs font-bold">SCORE</span>
                  <span className="text-white text-lg font-black">{gameState.score}</span>
                </div>
                <div className="pixel-border bg-yellow-600 px-3 py-2 rounded-lg flex flex-col items-center">
                  <span className="text-yellow-100 text-xs font-bold">TOTAL</span>
                  <span className="text-white text-lg font-black">{gameState.totalQuestions}</span>
                </div>
              </div> */}
              {/* Main Content - Case Report */}
              <div className="flex-1 overflow-y-auto px-4 py-2 w-full">
                {/* Paper styling */}
                <div className="mt-[1vw] w-full text-[10px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl break-words">
                  <div className="text-center mb-2 w-full">
                    {/* <h2 className="text-xs md:text-sm lg:text-2xl xl:text-3xl font-bold text-red-600 mb-1">DEVIATION REPORT</h2> */}
                    <div className="w-full h-[auto] bg-gray-300 mb-1"></div>
                  </div>
                  <div className="space-y-1 text-[10px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl text-cyan-400">
                    <div className="animate-report-field text-white" style={{ animationDelay: '0.2s' }}>
                      <span className="font-bold text-cyan-400">Case ID:</span> DEV-{String(gameState.currentCase + 1).padStart(3, '0')}
                    </div>
                    <div className="animate-report-field text-white" style={{ animationDelay: '0.4s' }}>
                      <span className="font-bold text-cyan-400">Date:</span> {new Date().toLocaleDateString()}
                    </div>
                    <div className="animate-report-field text-white" style={{ animationDelay: '0.6s' }}>
                      <span className="font-bold text-cyan-400">Title:</span> <span className="break-words text-[10px] lg:text-lg">{currentCase.title}</span>
                    </div>
                    <div className="animate-report-field text-white" style={{ animationDelay: '0.8s' }}>
                      <span className="font-bold text-cyan-400">Description:</span>
                      <p className="mt-1 leading-relaxed text-[10px] lg:text-lg break-words">{currentCase.scenario}</p>
                    </div>
                    <div className="animate-report-field text-white" style={{ animationDelay: '1.0s' }}>
                      <span className="font-bold text-[10px] lg:text-lg text-cyan-400">Product:</span> <span className="text-[10px] lg:text-lg">Pharmaceutical Tablet</span>
                    </div>
                    <div className="animate-report-field text-white" style={{ animationDelay: '1.2s' }}>
                      <span className="font-bold text-[10px] lg:text-lg text-cyan-400">Batch:</span> <span className="text-[10px] lg:text-lg">A2024-{String(gameState.currentCase + 1).padStart(3, '0')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1 w-full animate-report-field" style={{ animationDelay: '1.4s' }}>
                      <div className="flex flex-col items-center justify-center bg-red-50 p-0.5 rounded border-l-4 border-red-500 min-w-0 w-full">
                        <div className="font-bold text-red-800 text-[10px] lg:text-lg leading-tight truncate">Priority</div>
                        <div className="text-red-600 text-[10px] lg:text-lg leading-tight truncate">HIGH</div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-yellow-50 p-0.5 rounded border-l-4 border-yellow-500 min-w-0 w-full">
                        <div className="font-bold text-yellow-800 text-[10px] lg:text-lg leading-tight truncate">Status</div>
                        <div className="text-yellow-600 text-[10px] lg:text-lg leading-tight truncate">OPEN</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation button inside container */}
              <div className="flex-shrink-0 flex flex-row items-center justify-center w-full p-2 lg:px-4 lg:py-3">
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center lg:px-6 py-1 lg:py-2 text-white font-black text-sm lg:text-lg p-1  rounded-lg shadow-lg"
                  style={{ minWidth: 180 }}
                  aria-label="Start Investigation"
                >
                  <ChevronRight className="w-5 h-5 mr-2" />
                  START INVESTIGATION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Phase 3-5: Investigation Steps
  const renderInvestigationStep = () => {
    // Dynamic step titles based on whether violation question exists
    const hasViolation = currentCase.questions.violation !== undefined;
    const stepTitles = hasViolation
      ? {
          'step1': 'Step 1: Identify GMP Violation',
          'step2': 'Step 2: Root Cause Analysis',
          'step3': 'Step 3: Impact Assessment'
        }
      : {
          'step1': 'Step 1: Root Cause Analysis', // This won't be used since step1 is skipped
          'step2': 'Step 1: Root Cause Analysis',
          'step3': 'Step 2: Impact Assessment'
        };

    return (
      <div 
        key={`step-${currentPhase}-${animationKey}`}
        className="fixed inset-0 h-screen w-screen z-40 p-[1vw] flex flex-col text-xs md:text-sm"
        aria-hidden="true"
      >
        <img
src="/backgrounds/background.jpeg"
alt="Background"
className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25 object-cover object-center"
/>
        {/* <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25">
          <Animation_manufacture />
        </div> */}
        <div className="relative w-[100%] h-[100%] flex-1 flex flex-col z-10">
          {/* Header */}
          {/* <div className="text-center mb-[1vw] w-[100%] animate-fade-in-down">
             <h1 className="text-lg md:text-xl font-bold text-cyan-400 mb-1 ">{stepTitles[currentPhase as keyof typeof stepTitles]}</h1>
            <p className="text-lg md:text-xl font-bold text-cyan-400 mb-1">Deviation Investigation Game</p>
          </div> */}
          {/* Responsive layout: flex-row for mobile landscape, grid for desktop */}
          <div className={`flex items-center justify-center flex-1 w-[100%] min-h-0 overflow-visible mb-[10px] lg:mb-0 lg:gap-[2vw] lg:px-2 lg:py-6 lg:h-full h-auto mt-4 lg:mt-0${currentPhase === 'step2' && step2InstructionDismissed ? ' lg:justify-center' : ''}`}>
            {/* Centered: Question Panel - only show in step2 after OK is clicked, or always for other steps */}
            {((currentPhase !== 'step2') || (currentPhase === 'step2' && step2InstructionDismissed)) && (
              <div className="flex flex-row w-full h-auto items-start">
                <div className="flex flex-row w-full h-auto items-start relative">
                  <div className={`rounded-2xl shadow-xl p-[1vw] flex flex-col items-center justify-center w-full h-auto overflow-visible  sm:text-xs lg:w-auto lg:min-w-[600px] lg:max-w-2xl lg:p-8 xl:p-12 mx-auto animate-fade-slide-up${currentPhase === 'step2' && step2InstructionDismissed ? ' mx-auto' : ''}`}> 
                    <div className="w-auto h-full text-[9px] md:text-sm landscape:text-[9px] mt-2 md:mt-0 landscape:leading-tight">
                      <QuestionPanel
                        key={`question-${currentPhase}-${animationKey}`}
                        case={currentCase}
                        currentQuestion={
                          currentPhase === 'step1'
                            ? 'violation'
                            : currentPhase === 'step2'
                            ? 'rootCause'
                            : 'impact'
                        }
                        selectedAnswers={gameState.answers}
                        onAnswerSelect={handleAnswerSelect}
                        showFeedback={false}
                        onContinue={currentPhase === 'step1' ? handleContinue : undefined}
                      />
                      {/* Desktop only: Continue button for step1, step2, and step3, inside the panel, below options */}
                      {((currentPhase === 'step1' && currentCase.questions.violation && gameState.answers.violation !== null) ||
                        (currentPhase === 'step2' && gameState.answers.rootCause !== null) ||
                        (currentPhase === 'step3' && gameState.answers.impact !== null)) && (
                        <div className="hidden md:flex w-full justify-end mt-4">
                          <button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 py-2 text-white font-black text-xs md:text-sm rounded-lg shadow-lg"
                            aria-label="Continue"
                          >
                            <span className="mr-2">Continue</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Mobile: absolutely bottom right button */}
                  {((currentPhase === 'step1' && currentCase.questions.violation && gameState.answers.violation !== null) ||
                    (currentPhase === 'step2' && gameState.answers.rootCause !== null) ||
                    (currentPhase === 'step3' && gameState.answers.impact !== null)) && (
                    <>
                      {/* Mobile only */}
                      <div className="absolute right-2 bottom-2 z-20 md:hidden">
                        <button
                          onClick={handleContinue}
                          disabled={!canContinue}
                          className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 py-2 text-white font-black text-xs rounded-lg shadow-lg"
                          aria-label="Continue"
                        >
                          <span className="mr-2">Continue</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                      {/* Desktop only: previous column-aligned button */}
                      {/* <div className="hidden md:flex flex-col w-[40%] h-full min-h-[120px] md:w-[120px] relative justify-end items-center">
                        <div className="flex-1 flex items-end justify-center w-full">
                          <button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 py-2 text-white font-black text-xs md:text-sm rounded-lg shadow-lg"
                            aria-label="Continue"
                          >
                            <span className="mr-2">Continue</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </div>
                      </div> */}
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Gamified message - only show in step2 (Root Cause Analysis) - visible on all screens */}
            {currentPhase === 'step2' && !step2InstructionDismissed && (
              <div
                className=" pixel-border-thick bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-xl flex flex-col items-center justify-center rounded-2xl border-2 border-cyan-400/40 px-3 py-3 lg:px-6 lg:py-6 w-full max-w-xs lg:w-[340px] animate-bounce-in relative overflow-visible mt-4 lg:mt-0 mx-auto"
                style={{ minWidth: '0', maxWidth: '360px' }}
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-5xl select-none gamify-shake"
                  style={{
                    animation: 'gamify-shake 1.5s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                    filter: '',
                    color: '',
                    textShadow: '0 0 24px #06b6d4, 0 0 8px #fff',
                    fontWeight: 900
                  }}
                >🖐️</span>
                <span className="text-xl font-extrabold text-cyan-200 drop-shadow-lg mb-2 animate-pulse-text pixel-text" style={{ letterSpacing: '1px' }}>
                  Drag & Drop!
                </span>
                <span className="text-base font-bold text-cyan-100 text-center animate-slide-in-up pixel-text">
                  Drag the most suitable answer<br />
                  into the container<br />
                  to solve the root cause
                </span>
                <button
                  className="mt-6 lg:px-6 lg:py-2 px-3 py-1 rounded-lg font-bold text-lg bg-cyan-700/80 text-white transition-all duration-300 hover:bg-cyan-500/90 pixel-border-thick"
                  disabled={false}
                  onClick={() => {
                    setStep2InstructionDismissed(true);
                    setCanContinue(true);
                  }}
                >
                  OK
                </button>
                <style>{`
                  @keyframes gamify-shake {
                    0% { transform: translate(-50%, 0) rotate(-8deg) scale(1); }
                    10% { transform: translate(-60%, 0) rotate(-18deg) scale(1.08); }
                    20% { transform: translate(-40%, 0) rotate(12deg) scale(1.12); }
                    30% { transform: translate(-60%, 0) rotate(-18deg) scale(1.08); }
                    40% { transform: translate(-40%, 0) rotate(12deg) scale(1.12); }
                    50% { transform: translate(-50%, 0) rotate(-8deg) scale(1); }
                    100% { transform: translate(-50%, 0) rotate(-8deg) scale(1); }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  // Phase 6: Feedback
  const renderFeedback = () => {
    const correctAnswers = getCorrectAnswers();
    const isAllCorrect = allAnswersCorrectAtFeedback;
    const totalQuestions = (currentCase.questions.violation ? 1 : 0) + 1 + 1; // violation (optional) + rootCause + impact
    const caseAccuracy = Math.round((correctAnswers / totalQuestions) * 100);
    // Calculate performance for this case only based on score (out of 15)
    const caseIdx = gameState.currentCase;
    // Calculate score for current case: check which questions were scored for this case
    // Use a typed array for question types, only include questions that exist
    const questionTypes: Array<'violation' | 'rootCause' | 'impact'> = [];
    if (currentCase.questions.violation) questionTypes.push('violation');
    questionTypes.push('rootCause', 'impact');

    let caseScore = 0;
    if (scoredQuestions[caseIdx]) {
      questionTypes.forEach(type => {
        if (
          scoredQuestions[caseIdx].has(type) &&
          currentCase.questions[type] &&
          gameState.answers[type] === currentCase.questions[type].correct
        ) {
          caseScore += 5;
        }
      });
    }
    const maxCaseScore = questionTypes.length * 5;
    const performance = Math.round((caseScore / maxCaseScore) * 100);

    // Get correct and user answers for each question (only if they exist)
    const violationCorrect = currentCase.questions.violation ? currentCase.questions.violation.options[currentCase.questions.violation.correct] : null;
    const violationUser = currentCase.questions.violation && gameState.answers.violation !== null ? currentCase.questions.violation.options[gameState.answers.violation] : null;
    const violationIsCorrect = currentCase.questions.violation ? gameState.answers.violation === currentCase.questions.violation.correct : true;

    const rootCauseCorrect = currentCase.questions.rootCause.options[currentCase.questions.rootCause.correct];
    const rootCauseUser = gameState.answers.rootCause !== null ? currentCase.questions.rootCause.options[gameState.answers.rootCause] : null;
    const rootCauseIsCorrect = gameState.answers.rootCause === currentCase.questions.rootCause.correct;

    const impactCorrect = currentCase.questions.impact.options[currentCase.questions.impact.correct];
    const impactUser = gameState.answers.impact !== null ? currentCase.questions.impact.options[gameState.answers.impact] : null;
    const impactIsCorrect = gameState.answers.impact === currentCase.questions.impact.correct;

    // Only show Submit in feedback phase of case 2 if all answers are provided and all are correct
    const allAnswersProvided =
      (!currentCase.questions.violation || gameState.answers.violation !== null) &&
      gameState.answers.rootCause !== null &&
      gameState.answers.impact !== null;
    const allAnswersCorrect =
      (!currentCase.questions.violation || gameState.answers.violation === currentCase.questions.violation.correct) &&
      gameState.answers.rootCause === currentCase.questions.rootCause.correct &&
      gameState.answers.impact === currentCase.questions.impact.correct;

    return (
      <div className="fixed inset-0 h-screen w-screen z-40 p-[1vw] flex flex-col text-xs md:text-sm overflow-hidden"
      
      >

        <img
src="/backgrounds/background.jpeg"
alt="Background"
className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25 object-cover object-center"
/>
        {/* <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-25">
          <Animation_manufacture />
        </div> */}
        <div className="relative z-10 w-full h-full flex-1 flex flex-col overflow-hidden">
          <GameHeader
            currentCase={gameState.currentCase + 1}
            totalCases={moduleCases.length}
            score={gameState.score}
            totalQuestions={gameState.totalQuestions}
          />
          {/* Correction message above feedback panel */}
          {showCorrectionMessage && !allAnswersCorrectAtFeedback && (
            <div className="fixed inset-0 flex items-center justify-center z-50" style={{ pointerEvents: 'none' }}>
              <div className="p-3 bg-yellow-200 border-l-4 border-yellow-600 rounded shadow text-yellow-900 font-bold text-center animate-fade-in flex flex-col items-center max-w-lg w-full mx-auto" style={{ pointerEvents: 'auto' }}>
                <span className="mb-2">Please go back and correct the answer to proceed.</span>
                <div className="flex gap-3 mt-2">
                  <button
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-bold shadow hover:bg-yellow-700 transition-colors"
                    onClick={() => {
                      setShowCorrectionMessage(false);
                      // Go to step1 if violation exists, otherwise step2
                      setCurrentPhase(currentCase.questions.violation ? 'step1' : 'step2');
                      setCanContinue(true);
                      setGameState(prev => ({
                        ...prev,
                        answers: { ...prev.answers, violation: null, rootCause: null, impact: null },
                        showFeedback: false
                      }));
                    }}
                  >
                    OK
                  </button>
                  <button
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-bold shadow hover:bg-cyan-700 transition-colors"
                    onClick={() => setShowCorrectionMessage(false)}
                  >
                    Read feedback
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Responsive layout: flex-row for mobile landscape, grid for desktop */}
          <div className="flex flex-row gap-2 items-start flex-1 w-full min-h-0 px-4 pb-[70px] sm:pb-0">
            {/* Left: Character */}
            {/* <div className="flex justify-center items-center flex-shrink-0 p-2" style={{ minWidth: 0 }}>
               <CharacterRotator />
            </div> */}
            {/* Right: Feedback Panel - make this scrollable if content overflows */}
            <div
              className={
                `pixel-border-thick bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-xl rounded-2xl border-2 border-cyan-400/40 p-4 flex flex-col gap-2 items-stretch flex-1 min-w-0 min-h-0 h-full text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg max-h-[80vh]   lg:max-w-5xl w-[95%] sm:w-[90%] md:w-[80%] lg:w-[80%] mx-auto transition-all duration-300 ${showCorrectionMessage && !allAnswersCorrectAtFeedback ? 'overflow-y-hidden' : 'overflow-y-auto'}`
              }
              style={{ minHeight: 0 }}
            >
              {/* Card background image, slightly visible */}
              <img
                src="/backgrounds/background.jpeg"
                alt="Card Background"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-10 pointer-events-none select-none z-0"
                aria-hidden="true"
              />
              {/* Feedback Header */}
              <div className="flex flex-col items-start mb-1 sm:mb-2">
                <span className="text-yellow-400 font-bold text-sm lg:text-xl xl:text-2xl leading-tight drop-shadow-sm">{isAllCorrect ? 'Excellent!' : 'Needs Improvement'}</span>
                <span className="text-cyan-300 text-xs sm:text-sm lg:text-lg xl:text-xl font-semibold leading-tight mt-1">Case analysis complete - Review your results</span>
              </div>
              {/* Score summary */}
              <div className="flex flex-row items-center gap-2 sm:gap-3 mt-1">
                <div className="pixel-border bg-black/30 rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex flex-col items-center justify-center">
                  <span className="text-red-700 font-bold text-sm lg:text-lg xl:text-xl leading-tight">{correctAnswers}/3 Correct</span>
                  <span className="text-slate-400 text-xs lg:text-base xl:text-lg leading-tight font-medium">Case Accuracy: {caseAccuracy}%</span>
                </div>
                <div className="pixel-border bg-black/30 rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex flex-col items-center justify-center">
                  <span className="text-cyan-400 font-bold text-sm lg:text-lg xl:text-xl leading-tight">{Math.min(performance, 100)}%</span>
                  <span className="text-slate-400 text-xs lg:text-base xl:text-lg leading-tight font-medium">Performance</span>
                </div>
              </div>
              {/* Detailed Analysis */}
              <div className="mt-1 lg:mt-2">
                <span className="font-bold text-sm sm:text-base lg:text-lg xl:text-xl text-cyan-300 leading-tight drop-shadow-sm">Detailed Analysis</span>
                <div className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-3">
                  {/* Violation - only show if violation question exists */}
                  {currentCase.questions.violation && (
                    <div className="pixel-border bg-gradient-to-r from-yellow-100 via-yellow-50 to-white/90 border-l-4 border-yellow-400 rounded-lg p-2 sm:p-3 shadow-lg flex flex-col gap-1">
                      <span className="font-bold text-yellow-700 text-base lg:text-lg xl:text-xl flex items-center gap-2">🔍 GMP Violation</span>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full text-xs sm:text-sm lg:text-base xl:text-lg gap-1 sm:gap-2">
                        <span className="text-slate-700">Correct: <span className="text-green-700 font-semibold">{violationCorrect}</span></span>
                        <span className={`font-semibold ${violationIsCorrect ? 'text-green-600' : 'text-red-600'}`}>Your answer: <span className="font-bold">{violationUser || 'Not answered'}</span></span>
                      </div>
                    </div>
                  )}
                  {/* Root Cause */}
                  <div className="pixel-border bg-gradient-to-r from-yellow-100 via-yellow-50 to-white/90 border-l-4 border-yellow-400 rounded-lg p-2 sm:p-3 shadow-lg flex flex-col gap-1">
                    <span className="font-bold text-yellow-700 text-base lg:text-lg xl:text-xl flex items-center gap-2">🎯 Root Cause</span>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full text-xs sm:text-sm lg:text-base xl:text-lg gap-1 sm:gap-2">
                      <span className="text-slate-700">Correct: <span className="text-green-700 font-semibold">{rootCauseCorrect}</span></span>
                      <span className={`font-semibold ${rootCauseIsCorrect ? 'text-green-600' : 'text-red-600'}`}>Your answer: <span className="font-bold">{rootCauseUser || 'Not answered'}</span></span>
                    </div>
                  </div>
                  {/* Impact */}
                  <div className="pixel-border bg-gradient-to-r from-yellow-100 via-yellow-50 to-white/90 border-l-4 border-yellow-400 rounded-lg p-2 sm:p-3 shadow-lg flex flex-col gap-1">
                    <span className="font-bold text-yellow-700 text-base lg:text-lg xl:text-xl flex items-center gap-2">⚡ Impact</span>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full text-xs sm:text-sm lg:text-base xl:text-lg gap-1 sm:gap-2">
                      <span className="text-slate-700">Correct: <span className="text-green-700 font-semibold">{impactCorrect}</span></span>
                      <span className={`font-semibold ${impactIsCorrect ? 'text-green-600' : 'text-red-600'}`}>Your answer: <span className="font-bold">{impactUser || 'Not answered'}</span></span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Learning Insight */}
              <div className="mt-2 sm:mt-3 pixel-border bg-gradient-to-r from-blue-50 via-white to-blue-100 border-l-4 border-blue-400 rounded-lg p-2 sm:p-3 flex flex-col shadow-lg">
                <span className="font-bold text-blue-700 text-base lg:text-lg xl:text-xl flex items-center gap-2">💡 Learning Insight</span>
                <span className="text-slate-700 text-xs sm:text-sm lg:text-base xl:text-lg flex items-start mt-2 leading-relaxed">
                  <span className="mr-2 text-base" role="img" aria-label="book">📚</span>
                  <span className="font-medium">This case highlights areas for improvement. Focus on understanding the interconnections between GMP violations and their underlying causes.</span>
                </span>
              </div>
              {/* Summary message at the bottom */}
              {(!isAllCorrect) && (
                <div className="flex flex-col items-start justify-center pixel-border bg-gradient-to-r from-yellow-50 via-white to-yellow-100 border-l-4 border-yellow-500 p-2 sm:p-3 w-full rounded-lg mt-2 sm:mt-3 shadow-lg">
                  <div className="flex items-center min-h-[20px] py-1">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 flex-shrink-0" />
                    <span className="text-yellow-700 font-semibold text-xs sm:text-sm lg:text-base xl:text-lg leading-tight">Needs Improvement - You must get all answers correct to continue</span>
                    <span className="ml-2 text-sm sm:text-base" role="img" aria-label="book">📚</span>
                  </div>
                  <div className="text-slate-700 text-xs sm:text-sm lg:text-base xl:text-lg font-medium text-start mt-2 w-full bg-transparent leading-relaxed">Case analysis complete - Review your results and try again</div>
                </div>
              )}
            </div>
          </div>
          {/* Navigation - fixed at bottom, full width, justify-between */}
          <div className="flex flex-row items-center justify-end w-full px-2 t-20 pb-1 pt-1  sm:px-4 sm:pt-2 fixed bottom-0 left-0 z-50 shadow-lg">
            <div className="flex w-auto justify-end">
              {/* Show 'Submit' only on last case, 'Next Case' on all others */}
              {currentPhase === 'feedback' && gameState.currentCase === moduleCases.length - 1 && allAnswersProvided && allAnswersCorrect && (
                <button
                  onClick={async () => {
                    // Debug the submit click
                    console.log('🚀 Submit button clicked', {
                      gameState,
                      timer,
                      moduleNumber: gameState.moduleNumber,
                      currentCase: gameState.currentCase,
                      moduleCasesLength: moduleCases.length,
                      finalScore: gameState.score
                    });

                    // Check existing data before saving
                    if (user) {
                      try {
                        const existingData = await level4Service.getUserModuleData(user.id, gameState.moduleNumber || 1);
                        console.log('📊 Existing data before save:', existingData);
                      } catch (error) {
                        console.log('📊 No existing data found (this is normal for first play)');
                      }
                    }

                    // Save game data to Supabase before showing popup
                    try {
                      if (!user) {
                        throw new Error('User not authenticated');
                      }

                      // Use clean save approach to ensure correct score history
                      const result = await saveFinalScoreClean(
                        user.id,
                        { ...gameState, gameComplete: true },
                        timer,
                        moduleCases
                      );

                      if (result.success) {
                        console.log('✅ Game data saved to Supabase successfully with clean score history');
                      } else {
                        throw new Error(result.error || 'Failed to save final score');
                      }

                      // Check data after saving to verify
                      if (user) {
                        const savedData = await level4Service.getUserModuleData(user.id, gameState.moduleNumber || 1);
                        console.log('📊 Data after save:', {
                          mainScore: savedData?.score,
                          scoreHistory: savedData?.score_history,
                          timeArray: savedData?.time,
                          isCompleted: savedData?.is_completed
                        });
                      }
                    } catch (error) {
                      console.error('❌ Failed to save game data to Supabase:', error);
                      console.error('Error details:', {
                        error,
                        gameState,
                        timer,
                        stack: error instanceof Error ? error.stack : 'No stack trace'
                      });
                    }
                    // Show the popup after saving
                    setPopupOpen(true);
                  }}
                  className="w-full pixel-border-thick bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-3 font-black text-base sm:text-lg rounded-lg shadow-lg pixel-text transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Submit</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </button>
              )}
              {isAllCorrect && gameState.currentCase < moduleCases.length - 1 && (
                <button
                  onClick={handleContinue}
                  className="pixel-border-thick bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-2 py-2 font-black text-xs pixel-text transition-all duration-300 flex items-center justify-center space-x-1"
                >
                  <span>Next Case</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          {/* Feedback Popup - only for case2 feedback phase */}
          {currentPhase === 'feedback' && gameState.currentCase === moduleCases.length - 1 && (
            <>
              {console.log('🎮 GameBoard2D passing to FeedbackPopup:', {
                moduleNumber: gameState.moduleNumber,
                score: gameState.score,
                currentCase: gameState.currentCase,
                moduleCasesLength: moduleCases.length
              })}
              <FeedbackPopup
                open={popupOpen}
                onClose={() => setPopupOpen(false)}
                onNext={handleContinue}
                onBackToLevels={() => {
                  const getCurrentModuleId = () => {
                    if (module && !isNaN(Number(module))) return module;
                    if (gameState.moduleNumber && !isNaN(Number(gameState.moduleNumber))) return String(gameState.moduleNumber);
                    const match = window.location.pathname.match(/modules\/(\d+)/);
                    if (match && match[1]) return match[1];
                    return '1';
                  };
                  const resolvedModuleId = getCurrentModuleId();
                  window.location.assign(`/modules/${resolvedModuleId}`);
                }}
                onPlayAgain={handlePlayAgain}
                score={gameState.score}
                time={formatTimer(timer)}
                moduleId={gameState.moduleNumber}
              />
            </>
          )}
          
          {/* Game Complete - Show score board on final feedback screen */}
          {gameState.gameComplete && user && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[70]">
              <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl p-6 max-w-2xl w-full mx-4">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Game Complete!</h2>
                <div className="mb-4">
                  <p className="text-white">Final Score: <span className="text-yellow-400 font-bold">{gameState.score}</span></p>
                  <p className="text-white">Time: <span className="text-green-400 font-bold">{formatTimer(timer)}</span></p>
                </div>
                
                <div className="border-t border-cyan-400/30 my-4 pt-4">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Your Level 4 Performance</h3>
                  <Level4ScoreBoard moduleId={moduleNumber} />
                </div>
                
                <div className="flex justify-end mt-6 space-x-4">
                  <button 
                    onClick={handlePlayAgain}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => {
                      const getCurrentModuleId = () => {
                        if (module && !isNaN(Number(module))) return module;
                        if (gameState.moduleNumber && !isNaN(Number(gameState.moduleNumber))) return String(gameState.moduleNumber);
                        const match = window.location.pathname.match(/modules\/(\d+)/);
                        if (match && match[1]) return match[1];
                        return '1';
                      };
                      const resolvedModuleId = getCurrentModuleId();
                      window.location.assign(`/modules/${resolvedModuleId}`);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Back to Levels
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handler to reset game to login phase with proper Supabase integration
  const handlePlayAgain = () => {
    // Clear localStorage to ensure a fresh start
    localStorage.removeItem('level4_gameState');
    localStorage.removeItem('level4_timer');
    
    console.log('[PlayAgain] Resetting game for a new attempt');
    
    // Reset game state completely
    setGameState({
      currentCase: 0,
      moduleNumber: module ? Number(module) : 1,
      answers: {
        violation: null,
        rootCause: null,
        impact: null
      },
      score: 0, // Start with zero score for this attempt
      totalQuestions: 0,
      showFeedback: false,
      gameComplete: false
    });
    
    // Reset all other related state
    setCurrentPhase('login');
    setTimer(0);
    setScoredQuestions({}); // Reset scored questions tracking
    setCanContinue(true);   // Ensure continue button is enabled
    setTimerActive(false);  // Ensure timer is stopped
    setPopupOpen(false);    // Close any open popups
    setStep2InstructionDismissed(false); // Reset step 2 instruction dismissal
    
    // Force reset the animation
    setAnimationKey(prev => prev + 1);

    // This is key: Trigger a Supabase sync after reset
    // This will ensure the database state is updated with a clean slate
    // while preserving the high score
    const resetSync = setTimeout(() => {
      // This is just to trigger the useEffect sync
      setGameState(state => ({ ...state }));
    }, 500);
    
    return () => clearTimeout(resetSync);
  };

  // Format timer as MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Show timer and score in all investigation and feedback phases (not just when timerActive is true)
  const showTimer = ["reportView", "step1", "step2", "step3", "feedback"].includes(currentPhase) && !gameState.gameComplete;

  // Add this useEffect to ensure results are calculated when entering feedback phase
  React.useEffect(() => {
    if (currentPhase === 'feedback' && !gameState.showFeedback) {
      calculateResults();
    }
  }, [currentPhase]);

  // Profile modal state
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => {
    if (profileOpen) {
      const timer = setTimeout(() => setProfileOpen(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [profileOpen]);

  // Add this effect at the top level, after showCorrectionMessage state
  useEffect(() => {
    if (
      currentPhase === 'feedback' &&
      gameState.showFeedback &&
      !allAnswersCorrectAtFeedback
    ) {
      setShowCorrectionMessage(false);
      const timer = setTimeout(() => {
        setShowCorrectionMessage(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowCorrectionMessage(false);
    }
  }, [currentPhase, gameState.showFeedback, allAnswersCorrectAtFeedback]);

  // Avatar selection state, default to Intern 1, load from localStorage if available
  const [avatar, setAvatar] = useState<string>(
    () => localStorage.getItem("selectedAvatar") || "/characters/Intern1.png"
  );
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("selectedAvatar", avatar);
  }, [avatar]);

  // Main render logic
  return (
    <div className="relative h-full w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* High Score Alert */}
      <HighScoreAlert 
        score={gameState.score} 
        isVisible={showHighScorePopup} 
        onClose={() => setShowHighScorePopup(false)}
      />
      {/* Neon Animated SVG Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none"></div>
      {/* Back button always top left, above timer/case label */}
      <button
        onClick={handleBack}
        className="absolute top-2 left-2 lg:left-4 bg-red-600 hover:bg-red-700 text-white px-1 py-1 lg:px-3 lg:py-2 pixel-border flex items-center space-x-2 font-bold shadow-lg transition-all duration-200 text-sm z-[9999] hover:shadow-xl"
        style={{
          minWidth: 64,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          pointerEvents: 'auto'
        }}
      >
        <ChevronLeft className="w-4 h-4 md:w-[0.7vw] md:h-[0.7vw] min-w-3 min-h-3 mr-1" />
        <span>BACK</span>
      </button>
      {/* Case label and Timer/Score always top, horizontal center */}
      {currentPhase !== 'feedback' && (
        <div className="flex flex-row items-center justify-center w-full mb-[1vw] mt-2 px-2">
          <div className="flex flex-row items-center gap-2">
            <span className="pixel-border bg-green-600 px-2 py-1 rounded-lg text-white font-bold text-xs md:text-sm">CASE: {gameState.currentCase + 1}</span>
            <span className="pixel-border bg-blue-600 px-2 py-1 rounded-lg text-white font-bold text-xs md:text-sm">TIME: {formatTimer(timer)}</span>
            <span className="pixel-border bg-yellow-600 px-2 py-1 rounded-lg text-white font-bold text-xs md:text-sm">SCORE: {gameState.score}</span>
          </div>
        </div>
      )}
      {/* Profile/User info at top right */}
      {user && (
        <div className="absolute top-2 right-1 lg:right-4 z-[60] flex items-center gap-2">
          <div
            className="pixel-border-thick bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 shadow-xl flex items-center lg:gap-2 rounded-xl px-3 py-1 border-2 border-cyan-400/40 min-w-[48px] max-w-xs cursor-pointer hover:bg-cyan-900/60 transition relative"
            onClick={() => setProfileOpen((v) => !v)}
            tabIndex={0}
            role="button"
            aria-label="Show profile"
          >
            <img
              src={avatar}
              alt="Player Avatar"
              className="w-8 h-8 rounded-full border-2 border-cyan-400 object-cover bg-cyan-700"
            />
            {/* Only show email on large screens */}
            <span className="hidden lg:inline text-cyan-200 font-bold text-xs md:text-sm truncate max-w-[80px] pixel-text">{user.email || 'User'}</span>
            {/* Profile Popover */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl p-4 z-[200] border-2 border-cyan-400/40 flex flex-col items-center animate-fade-in-scale bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900" style={{top: '100%', overflow: 'hidden', wordBreak: 'break-word'}}>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-cyan-400 text-xl font-black"
                  onClick={e => { e.stopPropagation(); setProfileOpen(false); }}
                  aria-label="Close profile"
                  tabIndex={0}
                >
                  ×
                </button>
                <img
                  src={avatar}
                  alt="Player Avatar Large"
                  className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover bg-cyan-700 mb-3"
                />
                <div className="text-center w-full">
                  <div className="text-lg font-black text-cyan-200 mb-1 break-all truncate whitespace-normal max-w-full pixel-text">{user.email}</div>
                </div>
                {/* <button
                  className="mt-4 px-4 py-2 rounded-lg font-bold text-base bg-cyan-700/80 text-white transition-all duration-300 hover:bg-cyan-500/90 pixel-border-thick"
                  onClick={() => setShowAvatarModal(true)}
                >
                  Change Avatar
                </button> */}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative">
            <h2 className="font-bold mb-6 text-white drop-shadow text-2xl">Choose Your Avatar</h2>
            <div className="grid grid-cols-4 gap-6 w-full mb-2">
              {AVATAR_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all bg-white/80 hover:bg-white p-4 ${
                    avatar === option.src ? "border-blue-500 ring-2 ring-blue-300" : "border-transparent"
                  }`}
                  onClick={() => {
                    setAvatar(option.src);
                    setShowAvatarModal(false);
                  }}
                  type="button"
                >
                  <img
                    src={option.src}
                    alt={option.label}
                    className="w-12 h-12 rounded-full object-cover mb-1"
                  />
                  <span className="text-xs font-bold text-cyan-900">{option.label}</span>
                </button>
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 rounded-lg font-bold text-base bg-cyan-700/80 text-white transition-all duration-300 hover:bg-cyan-500/90 pixel-border-thick"
              onClick={() => setShowAvatarModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Phase rendering */}
      <div className="relative z-10">
        {(() => {
          switch (currentPhase) {
            case 'productShowcase':
              return renderLogin();
            case 'login':
              return renderLogin();
            case 'reportView':
              return renderReportView();
            case 'step1':
            case 'step2':
            case 'step3':
              return renderInvestigationStep();
            case 'feedback':
              return renderFeedback();
            default:
              return renderLogin();
          }
        })()}
      </div>
      {/* Custom CSS for floating shapes and neon theme */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-slide-up {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-slide-up {
          animation: fade-slide-up 0.6s ease-out forwards;
        }
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.4s ease-out forwards;
        }
        @keyframes slide-in-option {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-slide-in-option {
          animation: slide-in-option 0.5s ease-out forwards;
        }
        @keyframes pulse-text {
          0%, 100% {
            color: rgba(255, 255, 255, 0.8);
            text-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
          50% {
            color: rgba(59, 130, 246, 0.9);
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
          }
        }
        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
        }
        @keyframes slide-in-option-left {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slide-in-option-right {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slide-in-option-up {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-option-left 0.5s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-option-right 0.5s ease-out forwards;
        }
        .animate-slide-in-up {
          animation: slide-in-option-up 0.5s ease-out forwards;
        }
        @keyframes typing {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes blink {
          0%, 50% {
            border-color: transparent;
          }
          51%, 100% {
            border-color: #06b6d4;
          }
        }
        .animate-typing {
          width: 0;
          animation: typing 2s steps(25, end) forwards, blink 0.75s step-end infinite;
          white-space: nowrap;
        }
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          opacity: 0;
          animation: fade-in-scale 0.6s ease-out forwards;
        }
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.5s ease-out forwards;
        }
        .animate-bounce-in {
          opacity: 0;
          animation: bounce-in 0.8s ease-out forwards;
        }
        .triangle-shape {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        .square-shape {
          border-radius: 2px;
        }
        .floating-shape {
          will-change: transform;
        }
        @keyframes report-field-fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-report-field {
          opacity: 0;
          animation: report-field-fade-in 0.5s ease-out forwards;
        }
        .glow-cyan {
          text-shadow: 0 0 8px #22d3ee, 0 0 16px #38bdf8, 0 0 24px #0ea5e9;
        }
        .glow-green {
          text-shadow: 0 0 8px #4ade80, 0 0 16px #22c55e;
        }
        .glow-yellow {
          text-shadow: 0 0 8px #fde68a, 0 0 16px #facc15;
        }
        .neon-glow {
          box-shadow: 0 0 24px 6px #06b6d4, 0 0 8px 2px #06b6d4;
          border: 2.5px solid #06b6d4;
        }
      `}</style>
    </div>
  );
};

function setGameState(arg0: (prev: any) => any) {
  throw new Error('Function not implemented.');
}
