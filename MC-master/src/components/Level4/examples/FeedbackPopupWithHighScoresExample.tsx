/**
 * Example: FeedbackPopup with High Scores
 * 
 * This example demonstrates how to use the enhanced FeedbackPopup component
 * that displays the user's top 3 highest scores with timestamps.
 */

import React, { useState } from 'react';
import { FeedbackPopup } from '../Popup';

const FeedbackPopupWithHighScoresExample: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  // Example game data
  const exampleScore = 85;
  const exampleTime = "3:45";
  const exampleModuleId = 1;

  const handleBackToLevels = () => {
    console.log('Navigating back to levels...');
    // In a real app, this would navigate to the modules page
    // navigate('/modules');
  };

  const handlePlayAgain = () => {
    console.log('Starting new game...');
    // In a real app, this would reset the game state
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    console.log('Popup closed');
    setShowPopup(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          FeedbackPopup with High Scores Example
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Enhanced Features
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Displays current score and time
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Shows top 3 highest scores from Supabase
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Includes timestamps for each high score
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Medal icons for visual ranking (🥇🥈🥉)
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Responsive design for mobile and desktop
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Loading states and error handling
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example Usage
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<FeedbackPopup
  open={showPopup}
  onClose={handleClosePopup}
  onBackToLevels={handleBackToLevels}
  onPlayAgain={handlePlayAgain}
  score={85}
  time="3:45"
  moduleId={1}
/>`}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Try It Out
          </h2>
          <p className="text-gray-600 mb-4">
            Click the button below to see the enhanced FeedbackPopup in action.
            The popup will show your current score and fetch your top 3 highest 
            scores from the database.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <strong>Current Score:</strong> {exampleScore} points
              </div>
              <div className="bg-green-50 p-3 rounded">
                <strong>Time:</strong> {exampleTime}
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <strong>Module:</strong> {exampleModuleId}
              </div>
            </div>
            
            <button
              onClick={() => setShowPopup(true)}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Show FeedbackPopup
            </button>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Note:</h3>
          <p className="text-yellow-700 text-sm">
            To see high scores, you need to be logged in and have completed 
            some Level 4 games. The high scores are fetched from your personal 
            game history in the database.
          </p>
        </div>
      </div>

      {/* The enhanced FeedbackPopup component */}
      <FeedbackPopup
        open={showPopup}
        onClose={handleClosePopup}
        onBackToLevels={handleBackToLevels}
        onPlayAgain={handlePlayAgain}
        score={exampleScore}
        time={exampleTime}
        moduleId={exampleModuleId}
      />
    </div>
  );
};

export default FeedbackPopupWithHighScoresExample;
