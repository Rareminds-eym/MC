import React, { useState } from 'react';
import { Case } from '../types';

interface DragDropZoneProps {
  case: Case;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
  showFeedback: boolean;
  disabled: boolean;
  animateDrop?: boolean; // <-- add this prop
}

const DragDropZone: React.FC<DragDropZoneProps> = ({
  case: currentCase,
  selectedAnswer,
  onAnswerSelect,
  showFeedback,
  disabled,
  animateDrop = false // <-- default to false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const onDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (draggedIdx !== null) {
      onAnswerSelect(draggedIdx);
      setDraggedIdx(null);
    }
  };

  return (
    //{Drag and drop Answer selection for root cause analysis}
    <div className=" shadow-xl rounded-xl w-full max-w-full mx-auto flex flex-col flex-nowrap p-2 sm:p-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 lg:text-base xl:text-lg transition-all duration-300" style={{ minHeight: '0', minWidth: 0, width: '100%' }}>
      {/* <h3 className="text-[10px] sm:text-xs  font-bold mb-0.5 sm:mb-1 lg:text-lg xl:text-xl">Step 2: Root Cause Analysis</h3> */}
      {/* <p className="mb-0.5 sm:mb-1 text-[8px] sm:text-xs lg:text-base xl:text-lg">{currentCase.questions.rootCause.question}</p> */}
      <div className="flex flex-row gap-0.5 sm:gap-1 min-h-0 w-full items-start flex-wrap lg:flex-col lg:items-stretch" style={{ minHeight: '0', minWidth: 0, width: '100%' }}>
        <div className="flex-1 flex flex-col gap-0.5 sm:gap-1 min-h-0" style={{ minHeight: '0', minWidth: 0, width: '100%' }}>
          {currentCase.questions.rootCause.options.map((option, idx) => (
            <div
              key={idx}
              className={`
                group relative flex items-center rounded-lg border-4 lg:px-4 lg:py-2 xl:px-6 xl:py-3 min-w-0 w-full pixel-border-thick
                ${selectedAnswer === idx 
                  ? showFeedback
                    ? currentCase.questions.rootCause.correct === idx
                      ? 'border-green-400 bg-white/50 shadow-lg shadow-green-200/50'
                      : 'border-red-400 bg-white/50 shadow-lg shadow-red-200/50'
                    : 'border-blue-400 bg-white/50 shadow-lg shadow-blue-200/50'
                  : showFeedback && currentCase.questions.rootCause.correct === idx
                    ? 'border-green-400 bg-white/50 shadow-lg shadow-green-200/50'
                    : 'border-gray-200 bg-white/60 hover:border-gray-300 hover:shadow-md hover:shadow-gray-200/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-move'}
                ${animateDrop && selectedAnswer === idx ? 'animate-drop-pulse border-[4px] ring-4 ring-yellow-400 ring-offset-2 ring-offset-yellow-100 bg-yellow-300/90 !text-black !font-extrabold' : ''}
              `}
              style={{ minWidth: 0, width: '100%' }}
              draggable={!disabled}
              onDragStart={() => onDragStart(idx)}
            >
              {/* Option Letter Badge */}
              <div className={`
                flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold border-2 mr-3 pixel-border-thick
                lg:w-8 lg:h-8 lg:text-lg xl:w-10 xl:h-10 xl:text-xl
                ${selectedAnswer === idx
                  ? showFeedback
                    ? currentCase.questions.rootCause.correct === idx
                      ? 'bg-green-500 border-green-600 text-white'
                      : 'bg-red-500 border-red-600 text-white'
                    : 'bg-blue-500 border-blue-600 text-white'
                  : showFeedback && currentCase.questions.rootCause.correct === idx
                    ? 'bg-green-500 border-green-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-black group-hover:bg-gray-200'
                }
                ${animateDrop && selectedAnswer === idx ? 'animate-drop-pulse bg-yellow-400 border-yellow-700 text-black font-extrabold' : ''}
              `}>
                {String.fromCharCode(65 + idx)}
              </div>
              {/* Option Text */}
              <span className={`flex-1 text-sm lg:text-lg xl:text-xl break-words whitespace-normal font-normal min-w-0 ${
                selectedAnswer === idx
                  ? showFeedback
                    ? currentCase.questions.rootCause.correct === idx ? 'text-green-900' : 'text-red-900'
                    : 'text-blue-900'
                  : showFeedback && currentCase.questions.rootCause.correct === idx
                    ? 'text-green-900'
                    : 'text-black group-hover:text-gray-900'
              }`}>
                {option}
              </span>
              {/* Feedback Badges */}
              {showFeedback && currentCase.questions.rootCause.correct === idx && (
                <div className="ml-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                    ✓ Correct
                  </span>
                </div>
              )}
              {showFeedback && selectedAnswer === idx && currentCase.questions.rootCause.correct !== idx && (
                <div className="ml-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                    ✗ Incorrect
                  </span>
                </div>
              )}
              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
          {/* Drop zone below options on desktop */}
          <div
            className={`hidden lg:flex flex-shrink-0 mt-4 p-3 pixel-border-thick border-yellow-400 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 shadow-lg rounded-xl border-4 text-center transition-colors duration-200 text-base xl:text-lg flex-col justify-end items-center min-h-[70px] lg:w-[180px] xl:w-[220px] mx-auto ${animateDrop ? 'animate-drop-pulse' : ''}`}
            style={{ minWidth: 0, width: '90%', maxWidth: '260px' }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {selectedAnswer === null ? (
              <span className="w-full text-cyan-200 font-bold pixel-text">Drop root cause here.</span>
            ) : (
              <span className="w-full text-blue-300 font-bold pixel-text">Selected: {currentCase.questions.rootCause.options[selectedAnswer]}</span>
            )}
          </div>
        </div>
        {/* Drop zone to the right for mobile/tablet */}
        <div
          className={`flex-shrink-0 ml-0.5 sm:ml-1 p-1 sm:p-2 border-2 border-dashed border-orange-400 rounded-lg text-center transition-colors duration-200 text-[8px] sm:text-xs mt-0.5 sm:mt-1 align-top lg:hidden flex flex-col justify-end items-center min-h-[60px] bg-white/40 ${animateDrop ? 'animate-drop-pulse' : ''}`}
          style={{ minWidth: 0, width: '80px', maxWidth: '30vw' }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {selectedAnswer === null ? (
            <span className="w-full">Drop root cause here.</span>
          ) : (
            <span className="w-full block text-left" style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>Selected: {currentCase.questions.rootCause.options[selectedAnswer]}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragDropZone;
export { DragDropZone };
