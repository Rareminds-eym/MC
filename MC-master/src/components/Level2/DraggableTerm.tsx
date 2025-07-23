import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Term } from '../../types/Level2/types';
import { GripVertical, CheckCircle, XCircle, Move, Sparkles } from 'lucide-react';
import { playHoverSound } from '../../utils/Level2/sounds';
import { useDeviceLayout } from '../../hooks/useOrientation';
import './index.css';

interface DraggableTermProps {
  term: Term;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  showResults?: boolean;
  isDragOverlay?: boolean;
}

const DraggableTerm: React.FC<DraggableTermProps> = ({
  term,
  isCorrect,
  isIncorrect,
  showResults,
  isDragOverlay = false
}) => {
  const { isMobile } = useDeviceLayout();
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Ultra-simple useDraggable setup for mobile
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: term.id,           // Unique identifier for the draggable item
    data: term,            // Data to pass when dragging
    disabled: showResults  // Disable dragging when showing results
  });

  // Transform the element position during drag + force mobile touch settings
  const style = {
    ...(transform && {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }),
    ...(isMobile && {
      touchAction: 'none',
      WebkitTouchAction: 'none',
      msTouchAction: 'none',
    }),
  };

  // Ultra-simple event handlers for mobile
  const handleTouchStart = () => {
    if (isMobile) {
      setIsTouching(true);
      // Strong haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      setIsTouching(false);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && !showResults && !isDragging) {
      setIsHovered(true);
      playHoverSound();
    }
  };

  // Simple listeners - prioritize mobile touch
  const enhancedListeners = isMobile ? {
    ...listeners,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  } : {
    ...listeners,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: () => setIsHovered(false),
  };

  // Check if this term is placed in wrong category (real-time feedback)
  const isPlacedIncorrectly = term.currentCategory && term.currentCategory !== term.correctCategory;
  const isPlacedCorrectly = term.currentCategory && term.currentCategory === term.correctCategory;

  const getCardStyles = () => {
    // Real-time feedback - show red immediately when placed incorrectly
    if (isPlacedIncorrectly && !showResults) {
      return 'pixel-border-thick bg-gradient-to-r from-red-500 to-red-700 text-white border-red-400 shadow-red-500/50 animate-pulse';
    }
    
    // Real-time feedback - show green immediately when placed correctly
    if (isPlacedCorrectly && !showResults) {
      return 'pixel-border-thick bg-gradient-to-r from-green-500 to-green-700 text-white border-green-400 shadow-green-500/50';
    }
    
    // Final results display
    if (showResults) {
      if (isCorrect) return 'pixel-border-thick bg-gradient-to-r from-green-500 to-green-700 text-white game-item-success border-green-400';
      if (isIncorrect) return 'pixel-border-thick bg-gradient-to-r from-red-500 to-red-700 text-white game-item-error border-red-400 shadow-red-500/50';
    }
    
    if (isDragging || isDragOverlay) return 'pixel-border-thick bg-gradient-to-r from-cyan-400 to-blue-600 text-white game-item-dragging shadow-2xl border-cyan-300';
    
    // Enhanced mobile touch state
    if (isMobile && isTouching) return 'pixel-border-thick bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl transform scale-105 border-yellow-300';
    
    return 'pixel-border bg-gradient-to-r from-gray-200 to-gray-300 hover:from-cyan-100 hover:to-blue-100 game-item-idle border-gray-400';
  };

  const getIconStyles = () => {
    if (isPlacedIncorrectly || isPlacedCorrectly || showResults) {
      return 'text-white';
    }
    if (isDragging || isDragOverlay) return 'text-white';
    if (isMobile && isTouching) return 'text-white';
    return isHovered ? 'text-cyan-600' : 'text-gray-600';
  };

  const getMobileStyles = () => {
    if (isMobile) {
      return 'min-h-[40px] p-2 text-xs font-bold'; // Much smaller for mobile
    }
    return 'min-h-[60px] p-4 text-base'; // Keep desktop size unchanged
  };

  return (
    <div
      ref={setNodeRef}           // Required: Attach the ref to the draggable element
      style={style}              // Required: Apply transform styles during drag
      {...attributes}            // Required: Accessibility attributes
      {...enhancedListeners}     // Required: Event listeners for drag functionality
      className={`
        ${getCardStyles()}
        ${isMobile ? 'cursor-grab' : 'cursor-move'} transition-all duration-200
        flex items-center ${isMobile ? 'space-x-1' : 'space-x-3'} relative overflow-hidden
        ${isDragging ? 'opacity-90 z-50' : 'z-10'}
        ${isHovered && !showResults && !isDragging && !isMobile ? 'transform -translate-y-1' : ''}
        ${isDragOverlay ? 'border-4 border-cyan-300 shadow-2xl' : ''}
        ${(isPlacedIncorrectly || (showResults && isIncorrect)) ? 'shadow-lg shadow-red-500/30' : ''}
        ${isMobile && isTouching ? 'shadow-2xl shadow-blue-500/60 scale-110' : ''}
        touch-manipulation select-none
        ${getMobileStyles()} rounded-xl
        ${isMobile ? 'active:scale-110 border-4 border-blue-400' : ''}
      `}
    >
      {/* Enhanced Red Background Pattern for Incorrect Items - Real-time */}
      {(isPlacedIncorrectly || (showResults && isIncorrect)) && (
        <div className="absolute inset-0 bg-red-600 opacity-90 rounded-lg"></div>
      )}
      
      {/* Enhanced Green Background Pattern for Correct Items - Real-time */}
      {(isPlacedCorrectly || (showResults && isCorrect)) && (
        <div className="absolute inset-0 bg-green-600 opacity-90 rounded-lg"></div>
      )}
      
      {/* Simple Mobile Touch Feedback Background */}
      {isMobile && isTouching && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-80 rounded-lg"></div>
      )}
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
      
      {/* Scan Lines */}
      {(isHovered || isDragging || isTouching) && !showResults && (
        <div className="absolute inset-0 bg-scan-lines opacity-30"></div>
      )}

      {/* Border Glow Effects - Reduced animations on mobile */}
      {(isHovered || isDragging || isTouching) && !showResults && (
        <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-50 rounded-lg ${!isMobile ? 'animate-pulse' : ''}`}></div>
      )}

      {/* Red Glow for Incorrect Items */}
      {(isPlacedIncorrectly || (showResults && isIncorrect)) && (
        <div className={`absolute -inset-1 bg-red-500 opacity-60 rounded-lg ${!isMobile ? 'animate-pulse' : ''}`}></div>
      )}

      {/* Green Glow for Correct Items */}
      {(isPlacedCorrectly || (showResults && isCorrect)) && (
        <div className={`absolute -inset-1 bg-green-500 opacity-60 rounded-lg ${!isMobile ? 'animate-pulse' : ''}`}></div>
      )}

      {/* Mobile Touch Glow - Static for performance */}
      {isMobile && isTouching && (
        <div className="absolute -inset-1 bg-yellow-400 opacity-50 rounded-lg"></div>
      )}

      {/* Drag Handle with Game Icon - Hidden for mobile */}
      {!isMobile && (
        <div className="relative z-10 flex-shrink-0">
          {(isPlacedCorrectly || isPlacedIncorrectly || showResults) ? (
            <div className="w-12 h-12 pixel-border flex items-center justify-center rounded">
              {(isPlacedCorrectly || (showResults && isCorrect)) ? (
                <div className="w-10 h-10 pixel-border bg-green-300 flex items-center justify-center animate-bounce rounded">
                  <CheckCircle className="w-6 h-6 text-green-800" />
                </div>
              ) : (isPlacedIncorrectly || (showResults && isIncorrect)) ? (
                <div className="w-10 h-10 pixel-border bg-red-300 flex items-center justify-center animate-pulse rounded">
                  <XCircle className="w-6 h-6 text-red-800" />
                </div>
              ) : (
                <div className="w-10 h-10 pixel-border bg-gray-300 flex items-center justify-center rounded">
                  <GripVertical className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="w-12 h-12 pixel-border bg-gray-600 flex items-center justify-center rounded transition-all duration-200">
                {isDragging || isDragOverlay ? (
                  <Move className={`w-6 h-6 ${getIconStyles()} transition-colors duration-200 animate-pulse`} />
                ) : (
                  <GripVertical className={`w-6 h-6 ${getIconStyles()} transition-colors duration-200`} />
                )}
              </div>

              {/* Desktop hover indicator */}
              {(isHovered || isDragging) && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 pixel-dot animate-ping rounded-full">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Term Text - Enhanced visibility */}
      <div className="flex-1 relative z-10">
        <span className={`font-bold pixel-text transition-all duration-200 leading-tight ${
          isMobile ? 'text-xs' : 'text-base'
        } ${
          (isPlacedIncorrectly || isPlacedCorrectly || showResults)
            ? (isPlacedIncorrectly || (showResults && isIncorrect))
              ? 'text-white font-black drop-shadow-lg' 
              : 'text-white font-black drop-shadow-lg' 
            : (isDragging || isDragOverlay || (isMobile && isTouching))
              ? 'text-white font-bold drop-shadow-md' 
              : isHovered 
                ? 'text-cyan-700' 
                : 'text-gray-800'
        }`}>
          {term.text}
        </span>
      </div>

      {/* Touch Indicator */}
      {!showResults && !isDragging && !isPlacedCorrectly && !isPlacedIncorrectly && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} pixel-dot transition-all duration-300 rounded-full ${
            isHovered || isTouching ? `bg-yellow-400 ${!isMobile ? 'animate-ping scale-125' : 'scale-125'}` : 'bg-gray-400 opacity-50'
          }`}></div>
        </div>
      )}

      {/* Success/Error Particle Effects - Enhanced for real-time feedback */}
      {(isPlacedCorrectly || (showResults && isCorrect)) && !isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-300 pixel-dot animate-bounce rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 150}ms`
              }}
            ></div>
          ))}
        </div>
      )}

      {(isPlacedIncorrectly || (showResults && isIncorrect)) && !isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Enhanced red particles for incorrect items */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-300 pixel-dot animate-pulse rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 100}ms`
              }}
            ></div>
          ))}
          {/* Additional red warning indicators */}
          <div className="absolute top-1 right-1">
            <XCircle className="w-4 h-4 text-red-200 animate-pulse" />
          </div>
        </div>
      )}



      {/* Dragging Trail Effect - Desktop only */}
      {(isDragging || isDragOverlay) && !isMobile && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-40 transform -skew-x-12 animate-pulse"></div>
      )}

      {/* Enhanced Drag Feedback - Desktop only */}
      {isDragging && !isMobile && (
        <div className={`absolute inset-0 border-3 border-dashed border-cyan-300 animate-pulse rounded-lg`}>
          {/* Corner indicators for better visibility */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-300 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
        </div>
      )}

      {/* Mobile Touch Feedback - Simple and reliable */}
      {isMobile && isTouching && !isDragging && (
        <div className="absolute inset-0 border-2 border-solid border-yellow-400 rounded-lg bg-yellow-400/10"></div>
      )}
    </div>
  );
};

export default DraggableTerm;