/**
 * Final Score Test Component
 * 
 * This component tests the new final score saving functionality
 * to ensure score history is clean and correct.
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { saveFinalScoreClean, verifyFinalScore, cleanupScoreHistory } from '../utils/finalScoreSaver';
import level4Service from '../services';

const FinalScoreTest: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const runFinalScoreTest = async () => {
    if (!user) {
      alert('Please log in to run the test');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Clear any existing data
      addResult('1. Clear Existing Data', { status: 'testing...' });
      try {
        await level4Service.deleteModuleData(user.id, 1);
        addResult('1. Clear Existing Data', { status: 'success', data: 'Existing data cleared' });
      } catch (error) {
        addResult('1. Clear Existing Data', { status: 'info', data: 'No existing data to clear' });
      }

      // Test 2: Simulate a game with score 30
      addResult('2. Save Final Score (30)', { status: 'testing...' });
      try {
        const testGameState = {
          currentCase: 1,
          moduleNumber: 1,
          answers: { violation: 1, rootCause: 1, impact: 0 },
          score: 30,
          totalQuestions: 6,
          showFeedback: false,
          gameComplete: true
        };

        const testModuleCases = [
          { id: 1, title: 'Case 1' },
          { id: 2, title: 'Case 2' }
        ];

        const result = await saveFinalScoreClean(
          user.id,
          testGameState,
          300, // 5 minutes
          testModuleCases
        );

        if (result.success) {
          addResult('2. Save Final Score (30)', { 
            status: 'success', 
            data: `Final score saved: ${result.recordId}` 
          });
        } else {
          addResult('2. Save Final Score (30)', { 
            status: 'error', 
            error: result.error 
          });
        }

      } catch (error) {
        addResult('2. Save Final Score (30)', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 3: Verify the saved data
      addResult('3. Verify Saved Data', { status: 'testing...' });
      try {
        const verification = await verifyFinalScore(user.id, 1, 30);
        
        if (verification.success) {
          addResult('3. Verify Saved Data', { 
            status: 'success', 
            data: `Score: ${verification.data?.score}, History: [${verification.data?.scoreHistory?.join(', ')}]` 
          });
        } else {
          addResult('3. Verify Saved Data', { 
            status: 'error', 
            error: verification.error,
            data: verification.data ? `Score: ${verification.data.score}, History: [${verification.data.scoreHistory?.join(', ')}]` : 'No data'
          });
        }

      } catch (error) {
        addResult('3. Verify Saved Data', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 4: Check raw database data
      addResult('4. Check Raw Database Data', { status: 'testing...' });
      try {
        const rawData = await level4Service.getUserModuleData(user.id, 1);
        
        if (rawData) {
          const isCorrect = (
            rawData.score === 30 &&
            Array.isArray(rawData.score_history) &&
            rawData.score_history.length === 1 &&
            rawData.score_history[0] === 30
          );

          addResult('4. Check Raw Database Data', { 
            status: isCorrect ? 'success' : 'warning', 
            data: `Raw data - Score: ${rawData.score}, History: [${rawData.score_history?.join(', ')}], Completed: ${rawData.is_completed}`,
            isCorrect
          });
        } else {
          addResult('4. Check Raw Database Data', { 
            status: 'error', 
            error: 'No data found in database' 
          });
        }

      } catch (error) {
        addResult('4. Check Raw Database Data', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 5: Test multiple saves (should not create duplicates)
      addResult('5. Test Multiple Saves', { status: 'testing...' });
      try {
        const testGameState2 = {
          currentCase: 1,
          moduleNumber: 1,
          answers: { violation: 1, rootCause: 1, impact: 0 },
          score: 30, // Same score
          totalQuestions: 6,
          showFeedback: false,
          gameComplete: true
        };

        const testModuleCases2 = [
          { id: 1, title: 'Case 1' },
          { id: 2, title: 'Case 2' }
        ];

        // Save the same score again
        const result2 = await saveFinalScoreClean(
          user.id,
          testGameState2,
          350, // Different time
          testModuleCases2
        );

        if (result2.success) {
          // Check if history is still clean
          const finalData = await level4Service.getUserModuleData(user.id, 1);
          const isClean = (
            finalData &&
            finalData.score === 30 &&
            Array.isArray(finalData.score_history) &&
            finalData.score_history.length === 1 &&
            finalData.score_history[0] === 30
          );

          addResult('5. Test Multiple Saves', { 
            status: isClean ? 'success' : 'warning', 
            data: `After multiple saves - Score: ${finalData?.score}, History: [${finalData?.score_history?.join(', ')}]`,
            isClean
          });
        } else {
          addResult('5. Test Multiple Saves', { 
            status: 'error', 
            error: result2.error 
          });
        }

      } catch (error) {
        addResult('5. Test Multiple Saves', { 
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
      case 'warning': return 'text-orange-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing...': return '⏳';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '⚪';
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Authentication Required</h2>
        <p className="text-yellow-700">Please log in to test the final score functionality.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Final Score Clean Save Test</h2>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={runFinalScoreTest}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
            isRunning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isRunning ? 'Running Test...' : 'Test Final Score Save'}
        </button>

        <button
          onClick={async () => {
            if (!user) return;
            try {
              const result = await cleanupScoreHistory(user.id, 1);
              if (result.success) {
                addResult('Cleanup Score History', { status: 'success', data: 'Score history cleaned successfully' });
              } else {
                addResult('Cleanup Score History', { status: 'error', error: result.error });
              }
            } catch (error) {
              addResult('Cleanup Score History', { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
            }
          }}
          disabled={isRunning}
          className="px-6 py-3 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors"
        >
          Clean Score History
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
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                <strong>Error:</strong> {result.result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <div className="text-center text-gray-500 py-8">
          Click "Test Final Score Save" to verify the clean score history functionality.
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">Expected Results:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Score should be 30</li>
          <li>✅ Score history should be [30] (not [15, 15, 15])</li>
          <li>✅ Game should be marked as completed</li>
          <li>✅ Multiple saves should not create duplicates</li>
        </ul>
      </div>
    </div>
  );
};

export default FinalScoreTest;
