/**
 * Submit Button Test Component
 * 
 * This component tests the new Submit button implementation
 * to ensure data is properly saved to Supabase.
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import level4Service from '../services';
import type { GameState } from '../types';

const SubmitButtonTest: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const runSubmitTest = async () => {
    if (!user) {
      alert('Please log in to run the test');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Create a test game state
      const testGameState: GameState = {
        currentCase: 1, // Completed 2 cases (0 and 1)
        moduleNumber: 1,
        answers: {
          violation: 1,
          rootCause: 1,
          impact: 0
        },
        score: 85,
        totalQuestions: 6,
        showFeedback: false,
        gameComplete: true
      };

      const testTimer = 300; // 5 minutes

      addResult('Test Setup', { 
        status: 'success', 
        data: 'Test game state created',
        gameState: testGameState,
        timer: testTimer
      });

      // Test 1: Save game completion
      addResult('Save Game Completion', { status: 'testing...' });
      
      try {
        // Prepare cases data like the real game does
        const casesData = {
          currentCase: testGameState.currentCase,
          caseProgress: [
            {
              id: 1,
              answers: testGameState.answers,
              isCorrect: true,
              attempts: 1,
              timeSpent: testTimer
            },
            {
              id: 2,
              answers: testGameState.answers,
              isCorrect: true,
              attempts: 1,
              timeSpent: testTimer
            }
          ],
          scoredQuestions: {
            [testGameState.currentCase]: ["violation", "rootCause", "impact"]
          }
        };

        const recordId = await level4Service.upsertGameDataWithHistory(
          user.id,
          testGameState.moduleNumber,
          testGameState.score,
          true, // Game completed
          testTimer,
          casesData
        );

        addResult('Save Game Completion', { 
          status: 'success', 
          data: `Game saved with ID: ${recordId}`,
          recordId
        });

      } catch (error) {
        addResult('Save Game Completion', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 2: Verify data was saved
      addResult('Verify Saved Data', { status: 'testing...' });
      
      try {
        const savedData = await level4Service.getUserModuleData(user.id, testGameState.moduleNumber);
        
        if (savedData) {
          addResult('Verify Saved Data', { 
            status: 'success', 
            data: 'Data successfully retrieved from database',
            savedData: {
              id: savedData.id,
              score: savedData.score,
              time: savedData.time,
              is_completed: savedData.is_completed,
              module: savedData.module
            }
          });
        } else {
          addResult('Verify Saved Data', { 
            status: 'error', 
            error: 'No data found in database'
          });
        }

      } catch (error) {
        addResult('Verify Saved Data', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 3: Check score history
      addResult('Check Score History', { status: 'testing...' });
      
      try {
        const scoreHistory = await level4Service.getPastThreeScores(user.id, testGameState.moduleNumber);
        
        addResult('Check Score History', { 
          status: 'success', 
          data: 'Score history retrieved',
          scoreHistory
        });

      } catch (error) {
        addResult('Check Score History', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 4: Get user stats
      addResult('Get User Stats', { status: 'testing...' });
      
      try {
        const stats = await level4Service.getUserStats(user.id);
        
        addResult('Get User Stats', { 
          status: 'success', 
          data: 'User statistics retrieved',
          stats
        });

      } catch (error) {
        addResult('Get User Stats', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    } catch (error) {
      addResult('Test Suite', { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Test suite failed'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing...': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing...': return '⏳';
      default: return '⚪';
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Authentication Required</h2>
        <p className="text-yellow-700">Please log in to test the Submit button functionality.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Button Functionality Test</h2>
      
      <div className="mb-6">
        <button
          onClick={runSubmitTest}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? 'Running Test...' : 'Test Submit Button'}
        </button>
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{result.test}</h3>
              <span className={`font-bold ${getStatusColor(result.result.status)}`}>
                {getStatusIcon(result.result.status)} {result.result.status}
              </span>
            </div>
            
            {result.result.data && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-2">
                <strong>Result:</strong> {result.result.data}
              </div>
            )}
            
            {result.result.error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-2">
                <strong>Error:</strong> {result.result.error}
              </div>
            )}

            {(result.result.gameState || result.result.savedData || result.result.scoreHistory || result.result.stats) && (
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer font-medium">View Details</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify({
                    gameState: result.result.gameState,
                    savedData: result.result.savedData,
                    scoreHistory: result.result.scoreHistory,
                    stats: result.result.stats
                  }, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <div className="text-center text-gray-500 py-8">
          Click "Test Submit Button" to verify the functionality works correctly.
        </div>
      )}
    </div>
  );
};

export default SubmitButtonTest;
