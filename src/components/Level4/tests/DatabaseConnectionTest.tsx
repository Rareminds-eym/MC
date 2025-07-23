/**
 * Database Connection Test Component
 * 
 * This component tests all the database functionality to ensure
 * the Level 4 Supabase integration is working correctly.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import level4Service from '../services';
import { saveGameCompletion, loadGameProgress, getUserStats } from '../utils/gameDataSaver';

const DatabaseConnectionTest: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (testName: string, result: any) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: result
    }));
  };

  const runTests = async () => {
    if (!user) {
      alert('Please log in to run tests');
      return;
    }

    setIsRunning(true);
    setTestResults({});

    try {
      // Test 1: Basic connection
      addResult('1. Basic Connection', { status: 'testing...' });
      try {
        const userData = await level4Service.getUserGameData(user.id);
        addResult('1. Basic Connection', { 
          status: 'success', 
          data: `Found ${userData.length} existing records` 
        });
      } catch (error) {
        addResult('1. Basic Connection', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 2: Save test game data
      addResult('2. Save Game Data', { status: 'testing...' });
      try {
        const testGameState = {
          currentCase: 1,
          moduleNumber: 1,
          answers: { violation: 1, rootCause: 1, impact: 0 },
          score: 85,
          totalQuestions: 6,
          showFeedback: false,
          gameComplete: true
        };

        const testModuleCases = [
          { id: 1, title: 'Test Case 1' },
          { id: 2, title: 'Test Case 2' }
        ];

        const saveResult = await saveGameCompletion(
          user.id,
          testGameState,
          300, // 5 minutes
          testModuleCases
        );

        addResult('2. Save Game Data', { 
          status: saveResult.success ? 'success' : 'error',
          data: saveResult.success ? `Saved with ID: ${saveResult.recordId}` : saveResult.error
        });
      } catch (error) {
        addResult('2. Save Game Data', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 3: Load game progress
      addResult('3. Load Game Progress', { status: 'testing...' });
      try {
        const loadResult = await loadGameProgress(user.id, 1);
        addResult('3. Load Game Progress', { 
          status: loadResult.success ? 'success' : 'error',
          data: loadResult.success ? 
            (loadResult.gameData ? `Loaded data for module 1` : 'No data found') : 
            loadResult.error
        });
      } catch (error) {
        addResult('3. Load Game Progress', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 4: Get user statistics
      addResult('4. User Statistics', { status: 'testing...' });
      try {
        const statsResult = await getUserStats(user.id);
        addResult('4. User Statistics', { 
          status: statsResult.success ? 'success' : 'error',
          data: statsResult.success ? 
            `Games: ${statsResult.stats?.total_games}, Avg Score: ${statsResult.stats?.average_score}` : 
            statsResult.error
        });
      } catch (error) {
        addResult('4. User Statistics', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 5: Test database functions
      addResult('5. Database Functions', { status: 'testing...' });
      try {
        const pastScores = await level4Service.getPastThreeScores(user.id, 1);
        addResult('5. Database Functions', { 
          status: 'success',
          data: `Past scores: ${pastScores.current_score}, ${pastScores.previous_score}, ${pastScores.past_previous_score}`
        });
      } catch (error) {
        addResult('5. Database Functions', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

      // Test 6: Analytics
      addResult('6. Analytics', { status: 'testing...' });
      try {
        const analytics = await level4Service.getUserAnalytics(user.id);
        addResult('6. Analytics', { 
          status: 'success',
          data: `Modules: ${analytics.total_modules}, Completion Rate: ${analytics.completion_rate}%`
        });
      } catch (error) {
        addResult('6. Analytics', { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }

    } catch (error) {
      console.error('Test suite failed:', error);
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
        <p className="text-yellow-700">Please log in to test the database connection.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Level 4 Database Connection Test</h2>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRunning ? 'Running Tests...' : 'Run Database Tests'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(testResults).map(([testName, result]) => (
          <div key={testName} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{testName}</h3>
              <span className={`font-bold ${getStatusColor(result.status)}`}>
                {getStatusIcon(result.status)} {result.status}
              </span>
            </div>
            
            {result.data && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Result:</strong> {result.data}
              </div>
            )}
            
            {result.error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(testResults).length === 0 && !isRunning && (
        <div className="text-center text-gray-500 py-8">
          Click "Run Database Tests" to test your Level 4 database connection.
        </div>
      )}
    </div>
  );
};

export default DatabaseConnectionTest;
