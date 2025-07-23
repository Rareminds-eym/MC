import React, { useEffect, useState } from 'react';

interface HighScoreAlertProps {
  score: number;
  isVisible: boolean;
  onClose?: () => void;
}

/**
 * A component to display an animated high score notification
 */
const HighScoreAlert: React.FC<HighScoreAlertProps> = ({ score, isVisible, onClose }) => {
  const [visible, setVisible] = useState(false);
  
  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      
      // Auto-hide after 5 seconds if no onClose is provided
      if (!onClose) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [isVisible, onClose]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div 
        className="animate-bounce-in bg-gradient-to-r from-yellow-500 to-amber-500 text-black p-4 rounded-lg shadow-2xl max-w-sm text-center pointer-events-auto"
      >
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold mb-1">🏆 NEW HIGH SCORE! 🏆</div>
          <div className="text-base mb-2">Your combined total across all cases:</div>
          <div className="text-xl font-bold bg-white/20 px-4 py-1 rounded-full mb-3">
            {score} points
          </div>
          <div className="text-sm mb-2">This is your new personal best combined score!</div>
          <div className="text-xs mb-2 opacity-75">(Total of all case scores)</div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors mt-2"
            >
              Awesome!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HighScoreAlert;
