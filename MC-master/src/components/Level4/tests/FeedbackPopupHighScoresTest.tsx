/**
 * FeedbackPopup High Scores Test Component
 * 
 * This component tests the enhanced FeedbackPopup with high scores display
 * to ensure it properly fetches and displays the user's top 3 scores.
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FeedbackPopup } from '../Popup';
import { supabase } from '../../../lib/supabase';

const FeedbackPopupHighScoresTest: React.FC = () => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const createTestScores = async () => {
    if (!user) return;

    try {
      // Clear existing test data
      await supabase
        .from('level_4')
        .delete()
        .eq('user_id', user.id)
        .eq('module', 999); // Use module 999 for testing

      // Insert test scores
      const testScores = [
        { score: 45, time: 300, created_at: '2024-01-15T10:00:00Z' },
        { score: 60, time: 250, created_at: '2024-01-20T14:30:00Z' },
        { score: 30, time: 400, created_at: '2024-01-10T09:15:00Z' },
        { score: 55, time: 280, created_at: '2024-01-25T16:45:00Z' },
      ];

      for (const scoreData of testScores) {
        await supabase
          .from('level_4')
          .insert({
            user_id: user.id,
            module: 999,
            level: 4,
            score: scoreData.score,
            time: scoreData.time,
            cases: { test: true },
            is_completed: true,
            created_at: scoreData.created_at,
            updated_at: scoreData.created_at
          });
      }

      return true;
    } catch (error) {
      console.error('Error creating test scores:', error);
      return false;
    }
  };

  const runTest = async () => {
    if (!user) {
      alert('Please log in to run the test');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Create test data
      addResult('1. Creating Test Data', { status: 'testing...' });
      const created = await createTestScores();
      if (created) {
        addResult('1. Creating Test Data', { status: 'success', data: 'Test scores created successfully' });
      } else {
        addResult('1. Creating Test Data', { status: 'error', error: 'Failed to create test scores' });
        return;
      }

      // Test 2: Verify data exists
      addResult('2. Verifying Test Data', { status: 'testing...' });
      const { data: verifyData, error: verifyError } = await supabase
        .from('level_4')
        .select('score, time, created_at')
        .eq('user_id', user.id)
        .eq('module', 999)
        .eq('is_completed', true)
        .order('score', { ascending: false });

      if (verifyError) {
        addResult('2. Verifying Test Data', { status: 'error', error: verifyError.message });
        return;
      }

      addResult('2. Verifying Test Data', { 
        status: 'success', 
        data: `Found ${verifyData?.length || 0} test scores. Top 3: ${verifyData?.slice(0, 3).map(s => s.score).join(', ')}` 
      });

      // Test 3: Open popup to test display
      addResult('3. Opening FeedbackPopup', { status: 'success', data: 'Popup will open to display high scores' });
      setShowPopup(true);

    } catch (error) {
      addResult('Test Suite', { status: 'error', error: error instanceof Error ? error.message : 'Test suite failed' });
    } finally {
      setIsRunning(false);
    }
  };

  const cleanupTestData = async () => {
    if (!user) return;

    try {
      await supabase
        .from('level_4')
        .delete()
        .eq('user_id', user.id)
        .eq('module', 999);
      
      addResult('Cleanup', { status: 'success', data: 'Test data cleaned up' });
    } catch (error) {
      addResult('Cleanup', { status: 'error', error: error instanceof Error ? error.message : 'Cleanup failed' });
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
        <p className="text-yellow-700">Please log in to test the FeedbackPopup high scores functionality.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">FeedbackPopup High Scores Test</h2>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={runTest}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isRunning ? 'Running Test...' : 'Test High Scores Display'}
        </button>

        <button
          onClick={cleanupTestData}
          className="px-6 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Cleanup Test Data
        </button>

        <button
          onClick={() => setShowPopup(true)}
          className="px-6 py-3 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          Show Popup (Manual Test)
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
          Click "Test High Scores Display" to verify the FeedbackPopup high scores functionality.
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">Expected Test Results:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Test data created with 4 scores: 60, 55, 45, 30</li>
          <li>✅ FeedbackPopup displays top 3 scores: 60, 55, 45</li>
          <li>✅ Each score shows: rank, score, time, and date</li>
          <li>✅ Scores are ordered by highest first</li>
          <li>✅ Only completed games (is_completed=true) are shown</li>
        </ul>
      </div>

      {/* FeedbackPopup for testing */}
      <FeedbackPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onBackToLevels={() => console.log('Back to levels clicked')}
        onPlayAgain={() => console.log('Play again clicked')}
        score={75}
        time="4:30"
        moduleId={999} // Use test module
      />
    </div>
  );
};

export default FeedbackPopupHighScoresTest;
