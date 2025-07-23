import React, { useState } from 'react';
import LevelProgressDebug from '../components/Debug/LevelProgressDebug';

const DebugPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">Level Progress Debug Tool</h1>
          <p className="text-center text-gray-600 mb-4">
            Use this tool to debug and fix level progression issues
          </p>
          
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(moduleId => (
                <button
                  key={moduleId}
                  onClick={() => setSelectedModule(moduleId)}
                  className={`px-4 py-2 rounded ${
                    selectedModule === moduleId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Module {moduleId}
                </button>
              ))}
            </div>
          </div>
        </div>

        <LevelProgressDebug moduleId={selectedModule} />

        <div className="mt-8 p-6 bg-white border rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <strong>Check Current State:</strong> Click "Refresh Data" to see the current progress data
            </li>
            <li>
              <strong>Test Level Unlocking:</strong> Use the "Test Level X" buttons to check if levels are properly locked/unlocked
            </li>
            <li>
              <strong>Reset if Needed:</strong> If levels are incorrectly unlocked, click "Reset All Progress" to clear all data
            </li>
            <li>
              <strong>Initialize Properly:</strong> Click "Initialize Module X" to set up the module with only level 1 unlocked
            </li>
            <li>
              <strong>Test Progression:</strong> Complete level 1 in the game, then check if only level 2 becomes unlocked
            </li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Important Notes</h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            <li>This debug tool should only be used in development/testing</li>
            <li>Resetting progress will delete ALL user progress data</li>
            <li>Make sure to test the progression after making changes</li>
            <li>Check the browser console for detailed debug logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
