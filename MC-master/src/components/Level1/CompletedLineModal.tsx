import React from 'react';

interface CompletedLineModalProps {
  isVisible: boolean;
  onClose: () => void;
  timer: number;
  rowsSolved: number;
  score: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const CompletedLineModal: React.FC<CompletedLineModalProps> = ({ isVisible, onClose, timer, rowsSolved, score }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-2">
      <div className={`pixel-border-thick bg-gradient-to-br from-yellow-50 via-blue-100 to-purple-100 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center animate-scale-in transition-all duration-300 ${
        window.innerWidth > window.innerHeight ? 'p-1 max-w-[200px] min-h-[120px]' : 'p-6'
      }`}>
        <div className="flex flex-col items-center mb-2">
          <span className="text-xl font-extrabold text-yellow-500 mb-1 pixel-text drop-shadow">Bingo!</span>
          <span className="text-base font-bold text-blue-700 pixel-text drop-shadow">You completed a line!</span>
        </div>
        <div className="flex flex-col gap-1 w-full mb-2">
          <div className="flex justify-between w-full">
            <span className="font-bold text-blue-700 pixel-text text-xs">Timer:</span>
            <span className="font-mono text-blue-600 pixel-text text-xs">{formatTime(timer)}</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="font-bold text-green-700 pixel-text text-xs">Rows Matched:</span>
            <span className="font-mono text-green-600 pixel-text text-xs">{rowsSolved}</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="font-bold text-purple-700 pixel-text text-xs">Score:</span>
            <span className="font-mono text-purple-600 pixel-text text-xs">{score}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-1 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold pixel-border shadow hover:from-blue-600 hover:to-blue-800 transition-all pixel-text text-xs"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CompletedLineModal;
