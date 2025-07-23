import React from 'react';
import { Case } from '../types';
import { CheckCircle, XCircle, Target, TrendingUp, BookOpen, Award, RotateCcw, ArrowRight, ChevronLeft } from 'lucide-react';

interface FeedbackPanelProps {
  case: Case;
  answers: {
    violation: number | null;
    rootCause: number | null;
    impact: number | null;
  };
  score: number;
  onNextCase: () => void;
  onRestart: () => void;
  isLastCase: boolean;
  onBack?: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  case: currentCase,
  answers,
  score,
  onNextCase,
  onRestart,
  isLastCase,
  onBack
}) => {
  // Calculate total questions based on what exists
  const totalQuestions = (currentCase.questions.violation ? 1 : 0) + 1 + 1; // violation (optional) + rootCause + impact
  const correctAnswers = [
    ...(currentCase.questions.violation ? [answers.violation === currentCase.questions.violation.correct] : []),
    answers.rootCause === currentCase.questions.rootCause.correct,
    answers.impact === currentCase.questions.impact.correct
  ];
  const caseScore = correctAnswers.filter(Boolean).length;
  const accuracy = Math.round((caseScore / totalQuestions) * 100);

  const getPerformanceConfig = (accuracy: number) => {
    if (accuracy >= 80) {
      return {
        color: 'green',
        gradient: 'from-green-500 to-emerald-600',
        bgGradient: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        emoji: '🏆',
        title: 'Excellent Performance!'
      };
    } else if (accuracy >= 60) {
      return {
        color: 'yellow',
        gradient: 'from-yellow-500 to-amber-600',
        bgGradient: 'from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-300',
        emoji: '👍',
        title: 'Good Performance!'
      };
    } else {
      return {
        color: 'red',
        gradient: 'from-red-500 to-pink-600',
        bgGradient: 'from-red-50 to-pink-50',
        borderColor: 'border-red-300',
        emoji: '📚',
        title: 'Needs Improvement'
      };
    }
  };

  const performanceConfig = getPerformanceConfig(accuracy);

  return (
    <div className="relative h-full w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Neon Animated SVG Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Floating Triangles, Circles, Squares, Lines, Dots (same as GameBoard2D) */}
          <polygon points="100,50 150,150 50,150" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" className="floating-shape animate-pulse" style={{ transformOrigin: '100px 116px', animation: 'float 8s ease-in-out infinite, rotate 20s linear infinite' }} />
          <polygon points="1700,200 1750,100 1800,200" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '1750px 150px', animation: 'float 6s ease-in-out infinite reverse, rotate 15s linear infinite reverse' }} />
          <polygon points="300,800 250,700 350,700" fill="none" stroke="#00d4ff" strokeWidth="3" filter="url(#strongGlow)" className="floating-shape" style={{ transformOrigin: '300px 750px', animation: 'float 10s ease-in-out infinite, rotate 25s linear infinite' }} />
          <circle cx="800" cy="150" r="40" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ animation: 'float 7s ease-in-out infinite, pulse 3s ease-in-out infinite' }} />
          <circle cx="1500" cy="600" r="25" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ animation: 'float 9s ease-in-out infinite reverse, pulse 4s ease-in-out infinite' }} />
          <circle cx="200" cy="400" r="60" fill="none" stroke="#00d4ff" strokeWidth="3" filter="url(#strongGlow)" className="floating-shape" style={{ animation: 'float 5s ease-in-out infinite, pulse 2s ease-in-out infinite' }} />
          <rect x="1200" y="300" width="80" height="80" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '1240px 340px', animation: 'float 8s ease-in-out infinite, rotate 18s linear infinite' }} />
          <rect x="600" y="700" width="50" height="50" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '625px 725px', animation: 'float 6s ease-in-out infinite reverse, rotate 22s linear infinite reverse' }} />
          <line x1="900" y1="500" x2="1100" y2="600" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '1000px 550px', animation: 'float 7s ease-in-out infinite, rotate 30s linear infinite' }} />
          <line x1="400" y1="200" x2="500" y2="150" stroke="#3b82f6" strokeWidth="3" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '450px 175px', animation: 'float 9s ease-in-out infinite reverse, rotate 25s linear infinite' }} />
          <line x1="1400" y1="800" x2="1600" y2="750" stroke="#00d4ff" strokeWidth="2" filter="url(#strongGlow)" className="floating-shape" style={{ transformOrigin: '1500px 775px', animation: 'float 5s ease-in-out infinite, rotate 35s linear infinite reverse' }} />
          <polygon points="1000,900 1050,950 1000,1000 950,950" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '1000px 950px', animation: 'float 8s ease-in-out infinite, rotate 20s linear infinite' }} />
          <circle cx="50" cy="50" r="2" fill="#00d4ff" opacity="0.3" className="animate-pulse"/>
          <circle cx="150" cy="50" r="2" fill="#3b82f6" opacity="0.3" className="animate-pulse" style={{ animationDelay: '1s' }}/>
          <circle cx="250" cy="50" r="2" fill="#00d4ff" opacity="0.3" className="animate-pulse" style={{ animationDelay: '2s' }}/>
          <circle cx="1820" cy="50" r="2" fill="#3b82f6" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.5s' }}/>
          <circle cx="1820" cy="150" r="2" fill="#00d4ff" opacity="0.3" className="animate-pulse" style={{ animationDelay: '1.5s' }}/>
          <circle cx="50" cy="1000" r="2" fill="#3b82f6" opacity="0.3" className="animate-pulse" style={{ animationDelay: '2.5s' }}/>
          <circle cx="150" cy="1000" r="2" fill="#00d4ff" opacity="0.3" className="animate-pulse" style={{ animationDelay: '3s' }}/>
        </svg>
      </div>
      {/* Main content overlay */}
      <div
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-200 text-[7px] sm:text-[8px] md:text-[9px] flex flex-col z-50"
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          width: '340px',
          height: '420px',
          minWidth: 0,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '2px',
        }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${performanceConfig.gradient} px-0.5 py-0.5 border-b-2 ${performanceConfig.borderColor} overflow-visible`} style={{padding: '2px'}}>
          <div className="flex items-center space-x-0.5 overflow-visible" style={{padding: '0'}}>
            <div>
              <h3 className="text-[8px] font-bold text-white flex items-center space-x-0.5">
                <span>{performanceConfig.emoji}</span>
                <span>{performanceConfig.title}</span>
              </h3>
              <p className="text-white/80 text-[7px] font-medium">
                Case analysis complete - Review your results
              </p>
            </div>
          </div>
        </div>
        <div className="px-0.5 py-0.5 sm:px-0.5 sm:py-0.5 overflow-visible" style={{padding: '2px'}}>
          {/* Score Summary */}
          <div className={`flex items-center justify-between mb-0.5 p-0.5 bg-gradient-to-r ${performanceConfig.bgGradient} rounded-xl border ${performanceConfig.borderColor} shadow-lg text-[7px] overflow-visible`} style={{padding: '2px'}}>
            <div className="flex items-center space-x-0.5 overflow-visible" style={{padding: '0'}}>
              <div className={`w-3 h-3 bg-gradient-to-br ${performanceConfig.gradient} rounded-xl flex items-center justify-center shadow-lg overflow-visible`}>
                <Award className="w-1 h-1 text-white" />
              </div>
              <div className="overflow-visible">
                <h4 className="text-[8px] font-bold text-gray-900">
                  {caseScore}/{totalQuestions} Correct
                </h4>
                <p className="text-gray-600 font-medium text-[7px]">
                  Case Accuracy: {accuracy}%
                </p>
              </div>
            </div>
            <div className="text-right overflow-visible">
              <div className={`text-[8px] font-bold ${performanceConfig.color === 'green' ? 'text-green-600' : performanceConfig.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>{accuracy}%</div>
              <div className="text-[7px] text-gray-500 font-medium">Performance</div>
            </div>
          </div>
          {/* Detailed Feedback */}
          <div className="space-y-0.5 mb-0.5 text-[7px] overflow-visible" style={{padding: '2px'}}>
            <h5 className="text-[8px] font-bold text-gray-900 flex items-center space-x-0.5">
              <Target className="w-1.5 h-1.5 text-blue-500" />
              <span>Detailed Analysis</span>
            </h5>
            {/* Violation Question - only show if it exists */}
            {currentCase.questions.violation && (
              <div className={`flex items-start space-x-0.5 p-0.5 rounded-lg border ${correctAnswers[0] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} text-[7px]`}>
                <div className="flex-shrink-0">
                  {correctAnswers[0] ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-1 h-1 text-white" />
                    </div>
                  ) : (
                    <div className="w-2 h-2 bg-red-500 rounded-full flex items-center justify-center">
                      <XCircle className="w-1 h-1 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h6 className="font-bold text-gray-900 mb-0.5 text-[7px]">🔍 Violation Identification</h6>
                  <p className="text-[7px] text-gray-700 font-medium mb-0.5">
                    <strong>Correct:</strong> {currentCase.questions.violation.options[currentCase.questions.violation.correct]}
                  </p>
                  {!correctAnswers[0] && answers.violation !== null && (
                    <p className="text-[7px] text-red-700 font-medium">
                      <strong>Your answer:</strong> {currentCase.questions.violation.options[answers.violation]}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* Root Cause Question */}
            <div className={`flex items-start space-x-0.5 p-0.5 rounded-lg border ${correctAnswers[currentCase.questions.violation ? 1 : 0] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} text-[7px]`}>
              <div className="flex-shrink-0">
                {correctAnswers[currentCase.questions.violation ? 1 : 0] ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-1 h-1 text-white" />
                  </div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-1 h-1 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h6 className="font-bold text-gray-900 mb-0.5 text-[7px]">🎯 Root Cause Analysis</h6>
                <p className="text-[7px] text-gray-700 font-medium mb-0.5">
                  <strong>Correct:</strong> {currentCase.questions.rootCause.options[currentCase.questions.rootCause.correct]}
                </p>
                {!correctAnswers[currentCase.questions.violation ? 1 : 0] && answers.rootCause !== null && (
                  <p className="text-[7px] text-red-700 font-medium">
                    <strong>Your answer:</strong> {currentCase.questions.rootCause.options[answers.rootCause]}
                  </p>
                )}
              </div>
            </div>
            {/* Impact Question */}
            <div className={`flex items-start space-x-0.5 p-0.5 rounded-lg border ${correctAnswers[currentCase.questions.violation ? 2 : 1] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} text-[7px]`}>
              <div className="flex-shrink-0">
                {correctAnswers[currentCase.questions.violation ? 2 : 1] ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-1 h-1 text-white" />
                  </div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-1 h-1 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h6 className="font-bold text-gray-900 mb-0.5 text-[7px]">⚡ Impact Assessment</h6>
                <p className="text-[7px] text-gray-700 font-medium mb-0.5">
                  <strong>Correct:</strong> {currentCase.questions.impact.options[currentCase.questions.impact.correct]}
                </p>
                {!correctAnswers[currentCase.questions.violation ? 2 : 1] && answers.impact !== null && (
                  <p className="text-[7px] text-red-700 font-medium">
                    <strong>Your answer:</strong> {currentCase.questions.impact.options[answers.impact]}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Educational Insight */}
          <div className="p-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-0.5 shadow-lg text-[7px] overflow-visible" style={{padding: '2px'}}>
            <div className="flex items-start space-x-0.5">
              <div>
                <h5 className="text-[8px] font-bold text-blue-900 mb-0.5 flex items-center space-x-0.5">
                  <span>💡 Learning Insight</span>
                </h5>
                <p className="text-blue-800 font-medium leading-relaxed text-[7px]">
                  {caseScore === 3 
                    ? "🎉 Outstanding work! You've demonstrated excellent understanding of GMP principles, root cause analysis, and risk assessment."
                    : caseScore === 2
                      ? "👏 Good analysis! You correctly identified most aspects of this deviation. Focus on the areas you missed to strengthen your investigation methodology."
                      : caseScore === 1
                        ? "📖 Partial understanding demonstrated. Consider reviewing GMP documentation requirements, systematic root cause analysis techniques."
                        : "📚 This case highlights areas for improvement. Focus on understanding the interconnections between GMP violations and their underlying causes."
                  }
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-0.5 mt-0.5 text-[7px] overflow-visible" style={{padding: '2px'}}>
            {/* Removed Back button */}
            <div className="flex-1"></div>
            {isLastCase ? (
              <button
                onClick={onRestart}
                className="group px-0.5 py-0.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold text-[7px] flex items-center space-x-0.5 shadow-lg hover:shadow-xl transform hover:scale-105 order-3"
              >
                <RotateCcw className="w-1 h-1 group-hover:rotate-180 transition-transform duration-500" />
                <span>Start New Training</span>
              </button>
            ) : (
              <button
                onClick={onNextCase}
                disabled={caseScore !== 3}
                className={`px-1.5 py-0.5 text-[10px] sm:px-4 sm:py-2 sm:text-lg min-px-4 min-py-2 rounded-xl font-bold flex items-center space-x-2 shadow-lg border border-cyan-400/30 transition-all duration-300 order-3
    ${caseScore === 3
      ? 'bg-gradient-to-r from-green-400 via-cyan-500 to-blue-700 text-white hover:from-green-500 hover:to-blue-800'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
  `}
              >
                <span>Next Case</span>
                <ArrowRight className="w-[1vw] h-[1vw] min-w-4 min-h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
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
        .triangle-shape {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        .square-shape {
          border-radius: 2px;
        }
        .floating-shape {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default FeedbackPanel;