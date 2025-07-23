import React from 'react';
import { X, ArrowRight, Lightbulb, Target, CheckCircle } from 'lucide-react';
import { useDeviceLayout } from '../../hooks/useOrientation';

interface TutorialStep {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'center';
  highlight?: string;
}

interface TutorialToastProps {
  step: TutorialStep | null;
  onNext: () => void;
  onSkip: () => void;
  isVisible: boolean;
}

const TutorialToast: React.FC<TutorialToastProps> = ({ step, onNext, onSkip, isVisible }) => {
  const { isHorizontal, isMobile } = useDeviceLayout();
  const isMobileLandscape = isMobile && isHorizontal;
  if (!step || !isVisible) return null;

  // Move modal to avoid covering highlighted elements
  const getPositionClasses = () => {
    if (!step) return '';
    // Step 2: highlight instructions (top left), so show modal bottom right and overlap content
    if (step.id === 2) return isMobileLandscape ? 'bottom-4 right-4 left-auto top-auto transform-none z-[60]' : 'bottom-8 right-8 left-auto top-auto transform-none z-[60]';
    // Step 3: highlight grid (center), so show modal left bottom
    if (step.id === 3) return isMobileLandscape ? 'bottom-4 left-4 right-auto top-auto transform-none' : 'bottom-8 left-8 right-auto top-auto transform-none';
    // Step 4: highlight menu (right), so show modal right (top right)
    if (step.id === 4) return isMobileLandscape ? 'top-16 right-4 left-auto bottom-auto transform-none' : 'top-24 right-8 left-auto bottom-auto transform-none';
    // Default: center
    switch (step.position) {
      case 'top':
        return isMobileLandscape ? 'top-8 left-1/2 transform -translate-x-1/2' : 'top-16 sm:top-20 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return isMobileLandscape ? 'bottom-8 left-1/2 transform -translate-x-1/2' : 'bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2';
      case 'center':
      default:
        return isMobileLandscape ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <>
      {/* Tutorial Toast */}
      <div className={`fixed ${getPositionClasses()} z-50 animate-slide-up px-2 sm:px-4`}>
        <div
          className={`pixel-border-thick bg-gray-900 shadow-xl w-full transform transition-all duration-300
            ${isMobileLandscape ? (step.id === 3 ? 'max-w-[260px] p-2' : 'max-w-[320px] p-2') : 'p-3 sm:p-6'}
            ${!isMobileLandscape && step.id === 3 ? 'max-w-xs sm:max-w-xs' : (!isMobileLandscape ? 'max-w-xs sm:max-w-md' : '')}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between ${isMobileLandscape ? 'mb-2' : 'mb-3 sm:mb-4'}`}>
            <div className={`flex items-center ${isMobileLandscape ? 'space-x-1' : 'space-x-2 sm:space-x-3'}`}>
              <div className={`${isMobileLandscape ? 'w-7 h-7' : 'w-8 h-8 sm:w-10 sm:h-10'} bg-gradient-to-r from-blue-500 to-blue-700 pixel-border flex items-center justify-center`}>
                {step.icon}
              </div>
              <h3 className={`${isMobileLandscape ? 'text-base' : 'text-base sm:text-lg'} font-bold text-white pixel-text drop-shadow`}>{step.title}</h3>
            </div>
            <button
              onClick={onSkip}
              className={`text-blue-300 hover:text-white transition-colors p-1 pixel-border bg-blue-900`}
              style={{ borderRadius: 4 }}
            >
              <X className={`${isMobileLandscape ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
            </button>
          </div>

          {/* Message */}
          <div className={`${isMobileLandscape ? 'mb-2' : 'mb-4 sm:mb-6'}`}>
            <p className={`text-blue-100 leading-relaxed font-semibold pixel-text ${isMobileLandscape ? 'text-xs' : 'text-sm sm:text-base'}`}>{step.message}</p>
            {step.highlight && (
              <div className={`${isMobileLandscape ? 'mt-2 p-1' : 'mt-3 p-2 sm:p-3'} bg-blue-800/60 border-l-4 border-blue-400 pixel-border`}> 
                <p className={`text-blue-200 ${isMobileLandscape ? 'text-xs' : 'text-xs sm:text-sm'} font-bold pixel-text`}>{step.highlight}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className={`flex ${isMobileLandscape ? 'space-x-1' : 'space-x-1 sm:space-x-2'}`}>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors pixel-border ${index < step.id ? 'bg-blue-400' : 'bg-gray-700'}`}
                />
              ))}
            </div>
            <div className={`flex ${isMobileLandscape ? 'space-x-1' : 'space-x-2 sm:space-x-3'}`}>
              <button
                onClick={onSkip}
                className={`font-bold pixel-text transition-colors pixel-border bg-gray-700 text-blue-200 hover:bg-gray-600 hover:text-white ${isMobileLandscape ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm'}`}
              >
                Skip Tutorial
              </button>
              <button
                onClick={onNext}
                className={`flex items-center font-bold pixel-text bg-gradient-to-r from-blue-500 to-blue-700 text-white pixel-border transition-all duration-200 transform hover:scale-105 hover:from-blue-600 hover:to-blue-800 ${isMobileLandscape ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm'} space-x-1 sm:space-x-2`}
              >
                <span>{step.id === 5 ? 'Start Playing!' : 'Next'}</span>
                {step.id !== 5 && <ArrowRight className={`${isMobileLandscape ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Elements */}
      {step.highlight && (
        <style>{`
          .tutorial-highlight {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 3px rgba(252, 242, 89, 0.7), 0 0 15px rgba(252, 242, 89, 0.5);
            border-radius: 4px;
            animation: pulse-highlight-small 2s infinite;
          }
          .tutorial-highlight-large {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 3px rgba(252, 242, 89, 0.7), 0 0 15px rgba(252, 242, 89, 0.5);
            border-radius: 4px;
            animation: pulse-highlight-small 2s infinite;
          }
          .tutorial-highlight-navbar-stats {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 3px rgba(252, 242, 89, 0.7), 0 0 15px rgba(252, 242, 89, 0.5);
            border-radius: 4px;
            animation: pulse-highlight-small 2s infinite;
          }
          @keyframes pulse-highlight-small {
            0%, 100% { box-shadow: 0 0 0 3px rgba(252, 242, 89, 0.6), 0 0 15px rgba(252, 242, 89, 0.5); }
            50% { box-shadow: 0 0 0 7px rgba(252, 242, 89, 0.9), 0 0 22px rgba(252, 242, 89, 0.5); }
          }
        `}</style>
      )}
    </>
  );
};

export default TutorialToast;