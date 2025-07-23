/**
 * Score History Test Component
 * 
 * This component tests the score history functionality to ensure
 * scores are properly saved and managed in the database.
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import level4Service from '../services';

const ScoreHistoryTest: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const clearTestData = async () => {
    if (!user) return;
    
    try {
      await level4Service.deleteModuleData(user.id, 1);
      addResult('Clear Test Data', { status: 'success', data: 'Test data cleared' });
    } catch (error) {
      addResult('Clear Test Data', { status: 'error', error: 'Failed to clear test data' });
    }
  };

  const runScoreHistoryTest = async () => {
    if (!user) {
      alert('Please log in to run the test');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Clear existing data
      addResult('1. Clear Existing Data', { status: 'testing...' });
      await clearTestData();

      // Test 2: Save first score (15 points)
      addResult('2. Save First Score (15)', { status: 'testing...' });
      try {
        const casesData1 = {
          currentCase: 0,
          caseProgress: [{ id: 1, answers: { violation: 1, rootCause: 1, impact: 0 }, isCorrect: true, attempts: 1, timeSpent: 180 }],
          scoredQuestions: { "0": ["violation", "rootCause", "impact"] }
        };

        const recordId1 = await level4Service.upsertGameDataWithHistory(
          user.id,
          1, // module 1
          15, // score
          false, // not completed
          180, // time
          casesData1
        );

        addResult('2. Save First Score (15)', { 
          status: 'success', 
          data: `First score saved: ${recordId1}` 
        });

        // Check what was saved
        const data1 = await level4Service.getUserModuleData(user.id, 1);
        addResult('2a. Verify First Score', { 
          status: 'info', 
          data: `Score: ${data1?.score}, History: [${data1?.score_history?.join(', ')}]` 
        });

      } catch (error) {
        addResult('2. Save First Score (15)', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 3: Save second score (30 points) - should be higher
      addResult('3. Save Second Score (30)', { status: 'testing...' });
      try {
        const casesData2 = {
          currentCase: 1,
          caseProgress: [
            { id: 1, answers: { violation: 1, rootCause: 1, impact: 0 }, isCorrect: true, attempts: 1, timeSpent: 180 },
            { id: 2, answers: { violation: 1, rootCause: 1, impact: 0 }, isCorrect: true, attempts: 1, timeSpent: 200 }
          ],
          scoredQuestions: { "0": ["violation", "rootCause", "impact"], "1": ["violation", "rootCause", "impact"] }
        };

        const recordId2 = await level4Service.upsertGameDataWithHistory(
          user.id,
          1, // module 1
          30, // score
          true, // completed
          380, // time
          casesData2
        );

        addResult('3. Save Second Score (30)', { 
          status: 'success', 
          data: `Second score saved: ${recordId2}` 
        });

        // Check what was saved
        const data2 = await level4Service.getUserModuleData(user.id, 1);
        addResult('3a. Verify Second Score', { 
          status: 'info', 
          data: `Score: ${data2?.score}, History: [${data2?.score_history?.join(', ')}]` 
        });

      } catch (error) {
        addResult('3. Save Second Score (30)', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 4: Test Submit button approach (using simple upsert)
      addResult('4. Test Submit Button Approach', { status: 'testing...' });
      try {
        const casesDataFinal = {
          currentCase: 1,
          caseProgress: [
            { id: 1, answers: { violation: 1, rootCause: 1, impact: 0 }, isCorrect: true, attempts: 1, timeSpent: 180 },
            { id: 2, answers: { violation: 1, rootCause: 1, impact: 0 }, isCorrect: true, attempts: 1, timeSpent: 200 }
          ],
          scoredQuestions: { "0": ["violation", "rootCause", "impact"], "1": ["violation", "rootCause", "impact"] }
        };

        // This simulates what the Submit button does
        const recordId3 = await level4Service.upsertGameData(
          user.id,
          1, // module 1
          30, // score (same as before)
          true, // completed
          380, // time
          casesDataFinal
        );

        addResult('4. Test Submit Button Approach', { 
          status: 'success', 
          data: `Submit button save: ${recordId3}` 
        });

        // Check final state
        const dataFinal = await level4Service.getUserModuleData(user.id, 1);
        addResult('4a. Final Verification', { 
          status: 'success', 
          data: `Final - Score: ${dataFinal?.score}, History: [${dataFinal?.score_history?.join(', ')}]` 
        });

      } catch (error) {
        addResult('4. Test Submit Button Approach', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 5: Get score history using the dedicated function
      addResult('5. Get Score History', { status: 'testing...' });
      try {
        const scoreHistory = await level4Service.getPastThreeScores(user.id, 1);
        addResult('5. Get Score History', { 
          status: 'success', 
          data: `Current: ${scoreHistory.current_score}, Previous: ${scoreHistory.previous_score}, Past: ${scoreHistory.past_previous_score}` 
        });
      } catch (error) {
        addResult('5. Get Score History', { 
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
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing...': return '⏳';
      case 'info': return 'ℹ️';
      default: return '⚪';
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Authentication Required</h2>
        <p className="text-yellow-700">Please log in to test the score history functionality.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Score History Test</h2>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={runScoreHistoryTest}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRunning ? 'Running Test...' : 'Test Score History'}
        </button>
        
        <button
          onClick={clearTestData}
          disabled={isRunning}
          className="px-6 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Clear Test Data
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
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
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
          Click "Test Score History" to verify the score history functionality works correctly.
        </div>
      )}
    </div>
  );
};

export default ScoreHistoryTest;
