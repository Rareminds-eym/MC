import React, { useRef, useState } from 'react';
import { Case } from './types';
import { CheckCircle, Circle, Target, AlertCircle, Zap, TrendingDown } from 'lucide-react';
import { DragDropZone } from './DragDropZone';

interface QuestionPanelProps {
  case: Case;
  currentQuestion: 'violation' | 'rootCause' | 'impact';
  selectedAnswers: {
    violation: number | null;
    rootCause: number | null;
    impact: number | null;
  };
  onAnswerSelect: (questionType: 'violation' | 'rootCause' | 'impact', answer: number) => void;
  showFeedback: boolean;
  onContinue?: () => void;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  case: currentCase,
  currentQuestion,
  selectedAnswers,
  onAnswerSelect,
  showFeedback,
  onContinue
}) => {
  const question = currentCase.questions[currentQuestion];

  // If violation question doesn't exist, skip it
  if (!question) {
    return null;
  }
  
  // Get animation class based on current question type
  const getAnimationClass = (questionType: string) => {
    switch (questionType) {
      case 'violation': return 'animate-slide-in-left';
      case 'rootCause': return 'animate-slide-in-option';
      case 'impact': return 'animate-slide-in-right';
      default: return 'animate-slide-in-up';
    }
  };
  
  const getQuestionConfig = (type: string) => {
    // Determine step numbers based on whether violation question exists
    const hasViolation = currentCase.questions.violation !== undefined;
    const stepNumbers = hasViolation
      ? { violation: 1, rootCause: 2, impact: 3 }
      : { rootCause: 1, impact: 2 };

    switch (type) {
      case 'violation':
        return {
          title: 'Step 1: Identify GMP Violation',
          icon: <AlertCircle className="w-6 h-6 text-red-500" />,
          gradient: 'from-red-500 to-red-600',
          bgGradient: 'from-red-50 to-pink-50',
          borderColor: 'border-red-300'
        };
      case 'rootCause':
        return {
          title: `Step ${stepNumbers.rootCause}: Root Cause Analysis`,
          icon: <Target className="w-6 h-6 text-amber-500" />,
          gradient: 'from-amber-500 to-orange-600',
          bgGradient: 'from-amber-50 to-orange-50',
          borderColor: 'border-amber-300'
        };
      case 'impact':
        return {
          title: `Step ${stepNumbers.impact}: Impact Assessment`,
          icon: <TrendingDown className="w-6 h-6 text-blue-500" />,
          gradient: 'from-blue-500 to-indigo-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-300'
        };
      default: 
        return {
          title: '',
          icon: null,
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-300'
        };
    }
  };

  const config = getQuestionConfig(currentQuestion);
  const isCorrect = (index: number) => question.correct === index;

  // Animation state for drag-and-drop
  const [animateDrop, setAnimateDrop] = useState(false);
  const dropTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handler for drag-and-drop answer selection
  const handleRootCauseDrop = (answer: number) => {
    onAnswerSelect('rootCause', answer);
    setAnimateDrop(true);
    if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current);
    dropTimeoutRef.current = setTimeout(() => setAnimateDrop(false), 700); // Animation duration
  };

  // Drag and drop handlers for the right drop area
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!animateDrop) setAnimateDrop(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setAnimateDrop(false);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setAnimateDrop(false);
    // Optionally, you can extract data from e.dataTransfer if you implement custom drag logic
    // For now, this just visually handles the drop area
  };

  return (
<div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 pixel-perfect relative overflow-hidden">
  {/* Panel background image, slightly visible */}
  <img
    src="/backgrounds/background.jpeg"
    alt="Panel Background"
    className="absolute inset-0 w-full h-full object-cover object-center opacity-10 pointer-events-none select-none z-0"
    aria-hidden="true"
  />
      <div className="bg-black/40 rounded-2xl shadow-xl flex flex-col w-full max-w-[98vw] lg:min-h-[70vh] mx-auto overflow-hidden  sm:text-xs sm:max-w-[400px] sm:min-h-0 lg:w-[900px] lg:max-w-[900px] xl:w-[1100px] xl:max-w-[1100px] transition-all duration-300 hover:scale-[1.01] pixel-border-thick">
        {/* QuestionPannelHeader */}
        <div className={`bg-gradient-to-r ${config.gradient} px-2 py-1 border-b-4 ${config.borderColor} landscape:px-2 landscape:py-2 sm:landscape:px-3 sm:landscape:py-2 
          flex items-center gap-3 rounded-t-2xl shadow-xl pixel-border-thick pixel-perfect relative overflow-hidden`}
          style={{ minHeight: '56px', position: 'relative', borderTop: '4px solid #fff', borderLeft: '4px solid #fff', borderRight: '4px solid #fff' }}
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white/50 shadow-lg pixel-border-thick">
              {config.icon}
            </div>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h3 className="text-xs font-black text-white drop-shadow-lg tracking-wide lg:text-lg xl:text-xl pixel-text">
              {config.title}
            </h3>
            <p className="text-white/80 text-xs font-medium landscape:text-[9px] sm:landscape:text-xs lg:text-base xl:text-lg pixel-text">
              Select the most appropriate answer
            </p>
          </div>
          {/* Decorative SVG or background for extra polish, optional */}
          <svg className="absolute right-0 top-0 h-full w-16 opacity-20 pointer-events-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="50" r="40" fill="white" fillOpacity="0.2" />
          </svg>
        </div>
        {/* Navigation button area - outside the step 1 div, right side */}
        {/* <div className="flex-shrink-0 flex flex-row items-center justify-end w-auto h-full text-[9px] md:text-sm landscape:text-[9px] mt-2 md:mt-0 landscape:leading-tight" style={{marginTop: '-40px', marginRight: '16px', alignSelf: 'flex-end', zIndex: 10, position: 'relative'}}>
          {selectedAnswers[currentQuestion] !== null && !showFeedback && (
            <button 
              onClick={() => {
                if (typeof onContinue === 'function') {
                  onContinue();
                } else if (selectedAnswers[currentQuestion] !== null) {
                  onAnswerSelect(currentQuestion, selectedAnswers[currentQuestion]!);
                }
              }}
              className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 py-2 text-white font-black text-sm sm:text-base lg:text-lg rounded-lg shadow-lg pixel-text"
            >
              <span>Continue</span>
              <CheckCircle className="w-4 h-4 md:w-[0.7vw] md:h-[0.7vw] min-w-3 min-h-3 ml-1" />
            </button>
          )}
          {showFeedback && (
            <button 
              disabled
              className="rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-gray-400 z-50 sm:px-4 sm:py-2 sm:text-sm lg:text-lg flex flex-row items-center bg-black/30 backdrop-blur-md border border-gray-500/30 transition-all duration-300"
            >
              <span>Next Step</span>
              <CheckCircle className="w-4 h-4 md:w-[0.7vw] md:h-[0.7vw] min-w-3 min-h-3 ml-1" />
            </button>
          )}
        </div> */}
        
        <div className="flex-1 flex flex-col  p-[1vw] pt-3 lg:pt-3 lg:p-4 xl:p-4 min-h-[60vh] sm:overflow-y-auto sm:max-h-[calc(100vh-220px)]">
          {/* Question */}
          <div className={`pixel-border-thick bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-xl rounded-xl border-4 ${config.borderColor} px-2 py-2 lg:px-4 lg:py-2 xl:px-6 xl:py-3 flex items-center gap-2 lg:mb-0`}> 
            <Zap className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
            <span className="ml-2 text-xs font-bold text-cyan-200 lg:text-lg xl:text-xl pixel-text break-words flex-1">{question.question}</span>
          </div>
          {/* Options */}
          {currentQuestion === 'rootCause' ? (
            <div className="flex flex-row gap-4 w-full items-start">
              {/* Only right-side DragDropZone for desktop */}
              <DragDropZone
                case={currentCase}
                selectedAnswer={selectedAnswers.rootCause}
                onAnswerSelect={handleRootCauseDrop}
                showFeedback={showFeedback}
                disabled={showFeedback}
                animateDrop={animateDrop}
              />
            </div>
          ) : (
            <div className="space-y-2 flex-1">
              {question.options.map((option: string, index: number) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                const optionLetter = String.fromCharCode(97 + index).toUpperCase();
                const animationClass = getAnimationClass(currentQuestion);
                // Highlight option if just dropped (rootCause step only)
                const highlightDrop = currentQuestion === 'rootCause' && isSelected && animateDrop;

                return (
                  <div
                    key={index}
                    className={`
                      group relative flex items-center rounded-lg border-4 lg:px-4 lg:py-2 xl:px-6 xl:py-3 min-w-0 w-full pixel-border-thick
                      ${animationClass}
                      ${isSelected 
                        ? showFeedback
                          ? isCorrect(index)
                            ? 'border-green-400 bg-white/50 shadow-lg shadow-green-200/50'
                            : 'border-red-400 bg-white/50 shadow-lg shadow-red-200/50'
                          : 'border-blue-400 bg-white/50 shadow-lg shadow-blue-200/50'
                        : showFeedback && isCorrect(index)
                          ? 'border-green-400 bg-white/50 shadow-lg shadow-green-200/50'
                          : 'border-gray-200 bg-white/60 hover:border-gray-300 hover:shadow-md hover:shadow-gray-200/50'
                      }
                      ${highlightDrop ? 'animate-drop-pulse border-[4px] ring-4 ring-yellow-400 ring-offset-2 ring-offset-yellow-100 bg-yellow-300/90 !text-black !font-extrabold' : ''}
                    `}
                    onClick={() => !showFeedback && onAnswerSelect(currentQuestion, index)}
                    style={{ 
                      minWidth: 0,
                      animationDelay: `${index * 0.1}s`,
                      zIndex: highlightDrop ? 10 : undefined
                    }}
                  >
                    {/* Option Letter Badge */}
                    <div className={`
                      flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold border-2 mr-3 pixel-border-thick
                      lg:w-8 lg:h-8 lg:text-lg xl:w-10 xl:h-10 xl:text-xl
                      ${isSelected
                        ? showFeedback
                          ? isCorrect(index)
                            ? 'bg-green-500 border-green-600 text-white'
                            : 'bg-red-500 border-red-600 text-white'
                          : 'bg-blue-500 border-blue-600 text-white'
                        : showFeedback && isCorrect(index)
                          ? 'bg-green-500 border-green-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-black group-hover:bg-gray-200'
                      }
                      ${highlightDrop ? 'animate-drop-pulse bg-yellow-400 border-yellow-700 text-black font-extrabold' : ''}
                    `}>
                      {optionLetter}
                    </div>

                    {/* Selection Icon */}
                    <div className="flex-shrink-0 mr-2">
                      {isSelected ? (
                        <CheckCircle className={`w-5 h-5 ${
                          showFeedback
                            ? isCorrect(index) ? 'text-green-600' : 'text-red-600'
                            : 'text-blue-600'
                        }`} />
                      ) : showFeedback && isCorrect(index) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-3 h-3  text-gray-400 group-hover:text-gray-500" />
                      )}
                    </div>

                    {/* Option Text */}
                    <span className={`flex-1 text-sm  lg:text-lg xl:text-xl break-words whitespace-normal font-normal min-w-0 ${
                      isSelected
                        ? showFeedback
                          ? isCorrect(index) ? 'text-green-900' : 'text-red-900'
                          : 'text-blue-900'
                        : showFeedback && isCorrect(index)
                          ? 'text-green-900'
                          : 'text-black group-hover:text-gray-900'
                    }`}>
                      {option}
                    </span>
                    
                    {/* Feedback Badges */}
                    {showFeedback && isCorrect(index) && (
                      <div className="ml-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                          ✓ Correct
                        </span>
                      </div>
                    )}
                    
                    {showFeedback && isSelected && !isCorrect(index) && (
                      <div className="ml-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                          ✗ Incorrect
                        </span>
                      </div>
                    )}

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Desktop only: Continue button at bottom of Step 1 panel */}
          {currentQuestion === 'violation' && selectedAnswers.violation !== null && !showFeedback && (
            <div className="hidden md:flex w-full justify-end mt-6">
              {/* <button
                onClick={onContinue}
                className="pixel-border-thick bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center px-4 py-2 text-white font-black text-xs md:text-sm rounded-lg shadow-lg"
                aria-label="Continue"
              >
                <span className="mr-2">Continue</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button> */}
            </div>
          )}
        </div>
        
        <style>{`
@keyframes drop-pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 #b45309; }
  50% { transform: scale(1.12); box-shadow: 0 0 32px 8px #b45309, 0 0 12px 2px #f59e42; background: #f59e42; }
  100% { transform: scale(1); box-shadow: 0 0 0 0 #b45309; }
}
.animate-drop-pulse {
  animation: drop-pulse 0.7s cubic-bezier(0.4,0,0.2,1);
  background: linear-gradient(90deg, #f59e42 60%, #b45309 100%) !important;
  border-color: #b45309 !important;
  color: #fff !important;
}
`}</style>
      </div>
    </div>
  );
};
; // Added missing semicolon