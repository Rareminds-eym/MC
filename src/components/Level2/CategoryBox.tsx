import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Category, Term } from '../../types/Level2/types';
import { useDeviceLayout } from '../../hooks/useOrientation';
import DraggableTerm from './DraggableTerm';
import { Target, Sparkles, Crosshair, ArrowDown, Smartphone } from 'lucide-react';
import './index.css';

interface CategoryBoxProps {
  category: Category;
  terms: Term[];
  showResults?: boolean;
  correctTerms?: Set<string>;
  incorrectTerms?: Set<string>;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  category,
  terms,
  showResults,
  correctTerms,
  incorrectTerms
}) => {
  const { isMobile } = useDeviceLayout();

  const {
    isOver,
    setNodeRef
  } = useDroppable({
    id: category.id,
  });

  // Trigger haptic feedback when item is over drop zone
  React.useEffect(() => {
    if (isOver && isMobile && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [isOver, isMobile]);

  const getCorrectCount = () => {
    return terms.filter(term => correctTerms?.has(term.id)).length;
  };

  const getIncorrectCount = () => {
    return terms.filter(term => incorrectTerms?.has(term.id)).length;
  };

  const getCategoryColor = () => {
    switch (category.id) {
      case 'gmp-requirement':
        return 'from-green-500 to-green-700';
      case 'not-gmp-related':
        return 'from-gray-500 to-gray-700';
      default:
        return 'from-blue-500 to-blue-700';
    }
  };

  const getCategoryName = () => {
    switch (category.id) {
      case 'gmp-requirement':
        return 'GMP';
      case 'not-gmp-related':
        return 'NON-GMP';
      default:
        return category.name.toUpperCase();
    }
  };

  const getCategorySubtitle = () => {
    switch (category.id) {
      case 'gmp-requirement':
        return 'Requirements';
      case 'not-gmp-related':
        return 'Not Related';
      default:
        return category.description;
    }
  };

  const getBoxStyles = () => {
    if (isMobile) {
      let baseStyles = `bg-gradient-to-br ${getCategoryColor()} h-full relative overflow-hidden transition-all duration-300 flex flex-col rounded-lg shadow-lg border-2 touch-manipulation`;

      if (isOver) {
        baseStyles += ' border-cyan-400 transform  shadow-2xl mobile-drop-zone-active';
      } else {
        baseStyles += ' border-slate-600 hover:border-slate-500';
      }

      return baseStyles;
    } else {
      let baseStyles = `pixel-border-thick bg-gradient-to-br ${getCategoryColor()} h-full relative overflow-hidden transition-all duration-300 rounded-lg flex flex-col`;

      if (isOver) {
        baseStyles += ' game-zone-active transform scale-105 shadow-2xl';
      } else {
        baseStyles += ' game-zone-idle hover:transform hover:scale-102';
      }

      return baseStyles;
    }
  };

  return (
    <div ref={setNodeRef} className={getBoxStyles()}>
      {/* Mobile Layout */}
      {isMobile ? (
        <>
          {/* Enhanced Mobile Drop Zone Effects with Better Indicators */}
          {isOver && (
            <div className="absolute inset-0">
              <div className="absolute inset-1 border-2 border-dashed border-cyan-300 animate-pulse rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-3 border-yellow-400 rounded-full opacity-60 animate-ping"></div>
              
              {/* Enhanced Mobile Drop Arrows */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                <ArrowDown className="w-6 h-6 text-yellow-300 animate-bounce" />
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 rotate-180">
                <ArrowDown className="w-6 h-6 text-yellow-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              
              {/* Mobile Drop Zone Pulse Effect */}
              <div className="absolute inset-2 bg-cyan-400 opacity-20 animate-pulse rounded-lg"></div>
              
              {/* Mobile Drop Indicator Text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black animate-bounce">
                DROP HERE!
              </div>
            </div>
          )}


          {/* Header - Much smaller */}
          <div className="relative z-10 p-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                {/* Zone Title */}
                <div>
                  <h3 className={`text-mobile2 font-semibold  text-white transition-all duration-300 ${
                    isOver ? 'animate-pulse text-yellow-300' : ''
                  }`}>
                    {getCategoryName()}
                  </h3>
                  <div className={`text-white/80 text-mobile1  transition-all duration-300 ${
                    isOver ? 'text-yellow-200' : ''
                  }`}>
                    {getCategorySubtitle()}
                  </div>
                </div>
              </div>

              {/* Results Counters - Smaller */}
              <div className="flex items-center space-x-1">
                {showResults && getCorrectCount() > 0 && (
                  <div className="bg-green-500 rounded-md px-2 py-1 flex items-center space-x-1 animate-bounce shadow-md">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-white text-xs font-black">{getCorrectCount()}</span>
                  </div>
                )}
                {showResults && getIncorrectCount() > 0 && (
                  <div className="bg-red-500 rounded-md px-2 py-1 flex items-center space-x-1 animate-pulse shadow-md">
                    <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                    <span className="text-white text-xs font-black">{getIncorrectCount()}</span>
                  </div>
                )}
                {!showResults && (
                  <div className="bg-white/20 rounded-md px-2 py-1 flex items-center space-x-1 shadow-md">
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    <span className="text-white text-xs font-black">{terms.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          <div className="px-2 pb-2 space-y-2 flex-1 min-h-0 overflow-y-auto relative z-10">
            {terms.length === 0 ? (
              <div className="text-center py-6">
                {isOver ? (
                  <div className="animate-bounce">
                    <div className="w-16 h-16 bg-yellow-400 mx-auto mb-3 flex items-center justify-center animate-spin rounded-full shadow-lg">
                      <Sparkles className="w-8 h-8 text-yellow-800" />
                    </div>
                    <p className="text-yellow-300 font-black text-base">DROP HERE!</p>
                    <p className="text-white text-sm mt-1 animate-pulse font-bold">Release to sort item</p>
                    
                    {/* Mobile Drop Zone Visual Feedback */}
                    <div className="mt-3 flex justify-center space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 200}ms` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-white/60">
                    <div className="w-12 h-12 bg-white/20 mx-auto mb-2 flex items-center justify-center opacity-50 rounded-lg shadow-md">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm">Drag {getCategoryName()} items here</p>
                    <p className="text-xs mt-1 opacity-75">Touch and hold to drag</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {terms.map((term, index) => (
                  <div
                    key={term.id}
                    className="animate-slideIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <DraggableTerm
                      term={term}
                      isCorrect={showResults && correctTerms?.has(term.id)}
                      isIncorrect={showResults && incorrectTerms?.has(term.id)}
                      showResults={showResults}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Zone Status Indicator */}
          <div className="absolute bottom-2 right-2">
            <div className={`w-4 h-4 rounded-full transition-all duration-300 shadow-md ${
              isOver 
                ? 'bg-yellow-400 animate-ping scale-150' 
                : terms.length > 0 
                  ? 'bg-green-400 animate-pulse' 
                  : 'bg-white/30'
            }`}></div>
          </div>

          {/* Enhanced Mobile Drop Zone Highlight */}
          {isOver && (
            <div className="absolute inset-1 border-3 border-yellow-400 border-dashed animate-pulse rounded-lg pointer-events-none">
              {/* Corner indicators */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
            </div>
          )}
        </>
      ) : (
        /* Desktop Layout - Keep Original with minor enhancements */
        <>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-pixel-pattern opacity-20"></div>
          <div className="absolute inset-0 bg-scan-lines opacity-30"></div>

          {/* Enhanced Desktop Drop Zone Effects */}
          {isOver && (
            <div className="absolute inset-0">
              <div className="absolute inset-4 pixel-border bg-cyan-400 opacity-40 animate-pulse rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 pixel-border bg-yellow-400 opacity-60 animate-ping rounded-full"></div>
              <div className="absolute inset-3 border-4 border-dashed border-white/80 animate-pulse rounded-lg"></div>
              
              {/* Desktop Drop Arrows */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <ArrowDown className="w-8 h-8 text-yellow-300 animate-bounce" />
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rotate-180">
                <ArrowDown className="w-8 h-8 text-yellow-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}


          {/* Compact Header for Horizontal Layout */}
          <div className="relative z-10 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {/* Zone Icon */}
                <div className={`w-10 h-10 pixel-border flex items-center justify-center transition-all duration-300 ${
                  isOver ? 'bg-cyan-300 animate-spin' : 'bg-white'
                }`}>
                  {isOver ? (
                    <Crosshair className="w-6 h-6 text-cyan-800" />
                  ) : (
                    <Target className="w-6 h-6 text-gray-800" />
                  )}
                </div>

                {/* Zone Title */}
                <div>
                  <h3 className={`text-lg font-black pixel-text tracking-wide transition-all duration-300 ${
                    isOver ? 'text-yellow-300 animate-pulse' : 'text-white'
                  }`}>
                    {getCategoryName()}
                  </h3>
                  <div className={`text-xs font-bold transition-all duration-300 ${
                    isOver ? 'text-yellow-200 animate-pulse' : 'text-gray-300'
                  }`}>
                    {getCategorySubtitle()}
                  </div>
                </div>
              </div>

              {/* Results Counter */}
              <div className="flex items-center space-x-2">
                {showResults && getCorrectCount() > 0 && (
                  <div className="pixel-border bg-green-500 px-2 py-1 flex items-center space-x-1 animate-bounce">
                    <div className="w-3 h-3 pixel-dot bg-green-300"></div>
                    <span className="text-white text-sm font-black">{getCorrectCount()}</span>
                  </div>
                )}
                {showResults && getIncorrectCount() > 0 && (
                  <div className="pixel-border bg-red-500 px-2 py-1 flex items-center space-x-1 animate-pulse">
                    <div className="w-3 h-3 pixel-dot bg-red-300"></div>
                    <span className="text-white text-sm font-black">{getIncorrectCount()}</span>
                  </div>
                )}
                {!showResults && (
                  <div className="pixel-border bg-white/20 px-2 py-1 flex items-center space-x-1">
                    <div className="w-3 h-3 pixel-dot bg-white/60"></div>
                    <span className="text-white text-sm font-black">{terms.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Description */}
            <p className={`text-sm leading-relaxed mb-3 font-medium transition-all duration-300 ${
              isOver ? 'text-yellow-100' : 'text-gray-200'
            }`}>
              {category.description}
            </p>
          </div>

          {/* Compact Drop Zone */}
          <div className="px-4 pb-4 space-y-3 flex-1 min-h-0 overflow-y-auto relative z-10">
            {terms.length === 0 ? (
              <div className="text-center py-8">
                {isOver ? (
                  <div className="animate-bounce">
                    <div className="w-16 h-16 pixel-border bg-yellow-400 mx-auto mb-3 flex items-center justify-center animate-spin rounded-full">
                      <Sparkles className="w-8 h-8 text-yellow-800" />
                    </div>
                    <p className="text-cyan-300 font-black text-lg pixel-text">DROP HERE!</p>
                    <p className="text-yellow-300 text-sm mt-1 animate-pulse font-bold">Release to sort item</p>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <div className="w-12 h-12 pixel-border bg-gray-600 mx-auto mb-3 flex items-center justify-center opacity-50 rounded-lg">
                      <Target className="w-6 h-6" />
                    </div>
                    <p className="font-bold pixel-text text-sm">EMPTY ZONE</p>
                    <p className="text-xs mt-1">Drag items here to sort</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {terms.map((term, index) => (
                  <div
                    key={term.id}
                    className="animate-slideIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <DraggableTerm
                      term={term}
                      isCorrect={showResults && correctTerms?.has(term.id)}
                      isIncorrect={showResults && incorrectTerms?.has(term.id)}
                      showResults={showResults}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Zone Status Indicator */}
          <div className="absolute bottom-3 right-3">
            <div className={`w-4 h-4 pixel-dot transition-all duration-300 rounded-full ${
              isOver
                ? 'bg-yellow-400 animate-ping scale-150'
                : terms.length > 0
                  ? 'bg-green-400 animate-pulse'
                  : 'bg-gray-500'
            }`}></div>
          </div>

          {/* Desktop Drop Zone Highlight */}
          {isOver && (
            <div className="absolute inset-2 border-3 border-yellow-400 border-dashed animate-pulse rounded-lg pointer-events-none"></div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryBox;