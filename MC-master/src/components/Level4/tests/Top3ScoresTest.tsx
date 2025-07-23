/**
 * Top 3 Scores Test Component
 * 
 * This component tests the top 3 scores functionality to ensure
 * score history properly maintains the highest 3 unique scores.
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { saveFinalScoreClean, verifyFinalScore } from '../utils/finalScoreSaver';
import level4Service from '../services';

const Top3ScoresTest: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const createTestGameState = (score: number) => ({
    currentCase: 1,
    moduleNumber: 1,
    answers: { violation: 1, rootCause: 1, impact: 0 },
    score,
    totalQuestions: 6,
    showFeedback: false,
    gameComplete: true
  });

  const testModuleCases = [
    { id: 1, title: 'Case 1' },
    { id: 2, title: 'Case 2' }
  ];

  const runTop3ScoresTest = async () => {
    if (!user) {
      alert('Please log in to run the test');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Clear existing data
      addResult('1. Clear Existing Data', { status: 'testing...' });
      try {
        await level4Service.deleteModuleData(user.id, 1);
        addResult('1. Clear Existing Data', { status: 'success', data: 'Existing data cleared' });
      } catch (error) {
        addResult('1. Clear Existing Data', { status: 'info', data: 'No existing data to clear' });
      }

      // Test 2: Save first score (30)
      addResult('2. Save First Score (30)', { status: 'testing...' });
      try {
        const result1 = await saveFinalScoreClean(user.id, createTestGameState(30), 300, testModuleCases);
        if (result1.success) {
          const verification1 = await verifyFinalScore(user.id, 1);
          addResult('2. Save First Score (30)', { 
            status: 'success', 
            data: `Score: ${verification1.data?.score}, History: [${verification1.data?.scoreHistory?.join(', ')}]` 
          });
        } else {
          addResult('2. Save First Score (30)', { status: 'error', error: result1.error });
        }
      } catch (error) {
        addResult('2. Save First Score (30)', { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }

      // Test 3: Save second score (45) - should be new highest
      addResult('3. Save Second Score (45)', { status: 'testing...' });
      try {
        const result2 = await saveFinalScoreClean(user.id, createTestGameState(45), 350, testModuleCases);
        if (result2.success) {
          const verification2 = await verifyFinalScore(user.id, 1);
          addResult('3. Save Second Score (45)', { 
            status: 'success', 
            data: `Score: ${verification2.data?.score}, History: [${verification2.data?.scoreHistory?.join(', ')}]`,
            isNewHighScore: result2.isNewHighScore
          });
        } else {
          addResult('3. Save Second Score (45)', { status: 'error', error: result2.error });
        }
      } catch (error) {
        addResult('3. Save Second Score (45)', { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }

      // Test 4: Save third score (25) - should be added but not highest
      addResult('4. Save Third Score (25)', { status: 'testing...' });
      try {
        const result3 = await saveFinalScoreClean(user.id, createTestGameState(25), 280, testModuleCases);
        if (result3.success) {
          const verification3 = await verifyFinalScore(user.id, 1);
          addResult('4. Save Third Score (25)', { 
            status: 'success', 
            data: `Score: ${verification3.data?.score}, History: [${verification3.data?.scoreHistory?.join(', ')}]`,
            isNewHighScore: result3.isNewHighScore
          });
        } else {
          addResult('4. Save Third Score (25)', { status: 'error', error: result3.error });
        }
      } catch (error) {
        addResult('4. Save Third Score (25)', { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }

      // Test 5: Save fourth score (50) - should be new highest, history should have top 3
      addResult('5. Save Fourth Score (50)', { status: 'testing...' });
      try {
        const result4 = await saveFinalScoreClean(user.id, createTestGameState(50), 400, testModuleCases);
        if (result4.success) {
          const verification4 = await verifyFinalScore(user.id, 1);
          addResult('5. Save Fourth Score (50)', { 
            status: 'success', 
            data: `Score: ${verification4.data?.score}, History: [${verification4.data?.scoreHistory?.join(', ')}]`,
            isNewHighScore: result4.isNewHighScore
          });
        } else {
          addResult('5. Save Fourth Score (50)', { status: 'error', error: result4.error });
        }
      } catch (error) {
        addResult('5. Save Fourth Score (50)', { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }

      // Test 6: Save duplicate score (45) - should not create duplicate in history
      addResult('6. Save Duplicate Score (45)', { status: 'testing...' });
      try {
        const result5 = await saveFinalScoreClean(user.id, createTestGameState(45), 360, testModuleCases);
        if (result5.success) {
          const verification5 = await verifyFinalScore(user.id, 1);
          addResult('6. Save Duplicate Score (45)', { 
            status: 'success', 
            data: `Score: ${verification5.data?.score}, History: [${verification5.data?.scoreHistory?.join(', ')}]`,
            isNewHighScore: result5.isNewHighScore
          });
        } else {
          addResult('6. Save Duplicate Score (45)', { status: 'error', error: result5.error });
        }
      } catch (error) {
        addResult('6. Save Duplicate Score (45)', { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }

      // Test 7: Final verification
      addResult('7. Final Verification', { status: 'testing...' });
      try {
        const finalVerification = await verifyFinalScore(user.id, 1, 50);
        if (finalVerification.success) {
          addResult('7. Final Verification', { 
            status: 'success', 
            data: `Final state verified - Score: ${finalVerification.data?.score}, History: [${finalVerification.data?.scoreHistory?.join(', ')}]`,
            analysis: finalVerification.data?.analysis
          });
        } else {
          addResult('7. Final Verification', { 
            status: 'warning', 
            error: finalVerification.error,
            data: finalVerification.data ? `Score: ${finalVerification.data.score}, History: [${finalVerification.data.scoreHistory?.join(', ')}]` : 'No data'
          });
        }
      } catch (error) {
        addResult('7. Final Verification', { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }

    } catch (error) {
      addResult('Test Suite', { status: 'error', error: error instanceof Error ? error.message : 'Test suite failed' });
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
        <p className="text-yellow-700">Please log in to test the top 3 scores functionality.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Top 3 Scores Test</h2>
      
      <div className="mb-6">
        <button
          onClick={runTop3ScoresTest}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isRunning ? 'Running Test...' : 'Test Top 3 Scores'}
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

            {result.result.isNewHighScore !== undefined && (
              <div className={`text-sm p-2 rounded mb-2 ${result.result.isNewHighScore ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                <strong>{result.result.isNewHighScore ? '🏆 New High Score!' : 'ℹ️ Not a new high score'}</strong>
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
          Click "Test Top 3 Scores" to verify the top 3 scores functionality.
        </div>
      )}

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-bold text-green-800 mb-2">Expected Test Results:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>✅ After score 30: Score=30, History=[30]</li>
          <li>✅ After score 45: Score=45, History=[45, 30]</li>
          <li>✅ After score 25: Score=45, History=[45, 30, 25]</li>
          <li>✅ After score 50: Score=50, History=[50, 45, 30] (25 dropped)</li>
          <li>✅ After duplicate 45: Score=50, History=[50, 45, 30] (no duplicate)</li>
          <li>✅ Main score always equals highest in history</li>
        </ul>
      </div>
    </div>
  );
};

export default Top3ScoresTest;
