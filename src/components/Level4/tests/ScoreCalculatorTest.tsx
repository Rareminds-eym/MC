/**
 * Score Calculator Test Component
 * 
 * This component tests the dynamic scoring system to ensure
 * maximum scores are calculated correctly based on module scenarios.
 */

import React, { useState } from 'react';
import { calculateMaxScore, getScenarioCount, calculateStars, calculatePercentage } from '../utils/scoreCalculator';

const ScoreCalculatorTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const runScoreCalculatorTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Module 1 (2 scenarios)
      addResult('1. Module 1 Score Calculation', { status: 'testing...' });
      const module1Scenarios = getScenarioCount(1);
      const module1MaxScore = calculateMaxScore(1);
      const expectedModule1Score = module1Scenarios * 15; // 3 questions × 5 points = 15 per scenario
      
      if (module1MaxScore === expectedModule1Score) {
        addResult('1. Module 1 Score Calculation', { 
          status: 'success', 
          data: `Module 1: ${module1Scenarios} scenarios, max score: ${module1MaxScore}` 
        });
      } else {
        addResult('1. Module 1 Score Calculation', { 
          status: 'error', 
          data: `Expected ${expectedModule1Score}, got ${module1MaxScore}` 
        });
      }

      // Test 2: Module 4 (4 scenarios)
      addResult('2. Module 4 Score Calculation', { status: 'testing...' });
      const module4Scenarios = getScenarioCount(4);
      const module4MaxScore = calculateMaxScore(4);
      const expectedModule4Score = module4Scenarios * 15;
      
      if (module4MaxScore === expectedModule4Score) {
        addResult('2. Module 4 Score Calculation', { 
          status: 'success', 
          data: `Module 4: ${module4Scenarios} scenarios, max score: ${module4MaxScore}` 
        });
      } else {
        addResult('2. Module 4 Score Calculation', { 
          status: 'error', 
          data: `Expected ${expectedModule4Score}, got ${module4MaxScore}` 
        });
      }

      // Test 3: Star calculation for Module 1
      addResult('3. Star Calculation Module 1', { status: 'testing...' });
      const perfectScoreModule1 = calculateMaxScore(1);
      const starsModule1Perfect = calculateStars(perfectScoreModule1, 1);
      const starsModule1Half = calculateStars(Math.floor(perfectScoreModule1 / 2), 1);
      
      addResult('3. Star Calculation Module 1', { 
        status: 'success', 
        data: `Perfect score (${perfectScoreModule1}): ${starsModule1Perfect} stars, Half score (${Math.floor(perfectScoreModule1 / 2)}): ${starsModule1Half} stars` 
      });

      // Test 4: Star calculation for Module 4
      addResult('4. Star Calculation Module 4', { status: 'testing...' });
      const perfectScoreModule4 = calculateMaxScore(4);
      const starsModule4Perfect = calculateStars(perfectScoreModule4, 4);
      const starsModule4Half = calculateStars(Math.floor(perfectScoreModule4 / 2), 4);
      
      addResult('4. Star Calculation Module 4', { 
        status: 'success', 
        data: `Perfect score (${perfectScoreModule4}): ${starsModule4Perfect} stars, Half score (${Math.floor(perfectScoreModule4 / 2)}): ${starsModule4Half} stars` 
      });

      // Test 5: Percentage calculation
      addResult('5. Percentage Calculation', { status: 'testing...' });
      const percentageModule1Perfect = calculatePercentage(perfectScoreModule1, 1);
      const percentageModule4Perfect = calculatePercentage(perfectScoreModule4, 4);
      const percentageModule1Half = calculatePercentage(Math.floor(perfectScoreModule1 / 2), 1);
      
      addResult('5. Percentage Calculation', { 
        status: 'success', 
        data: `Module 1 perfect: ${percentageModule1Perfect}%, Module 4 perfect: ${percentageModule4Perfect}%, Module 1 half: ${percentageModule1Half}%` 
      });

      // Test 6: Non-existent module (fallback test)
      addResult('6. Fallback Test', { status: 'testing...' });
      const fallbackMaxScore = calculateMaxScore(999); // Non-existent module
      const fallbackScenarios = getScenarioCount(999);
      
      if (fallbackMaxScore === 30 && fallbackScenarios === 2) {
        addResult('6. Fallback Test', { 
          status: 'success', 
          data: `Non-existent module correctly falls back to 2 scenarios, 30 max score` 
        });
      } else {
        addResult('6. Fallback Test', { 
          status: 'error', 
          data: `Expected fallback to 30 max score and 2 scenarios, got ${fallbackMaxScore} and ${fallbackScenarios}` 
        });
      }

      // Test 7: Comparison between modules
      addResult('7. Module Comparison', { status: 'testing...' });
      const comparison = {
        module1: { scenarios: module1Scenarios, maxScore: module1MaxScore },
        module4: { scenarios: module4Scenarios, maxScore: module4MaxScore },
        ratio: module4MaxScore / module1MaxScore
      };
      
      addResult('7. Module Comparison', { 
        status: 'success', 
        data: `Module 4 has ${comparison.ratio}x the max score of Module 1 (${comparison.module4.maxScore} vs ${comparison.module1.maxScore})` 
      });

    } catch (error) {
      addResult('Error', { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Score Calculator Test</h2>
      <p className="mb-4 text-gray-600">
        This test verifies that the dynamic scoring system correctly calculates maximum scores 
        based on the number of scenarios in each module.
      </p>
      
      <button
        onClick={runScoreCalculatorTests}
        disabled={isRunning}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isRunning ? 'Running Tests...' : 'Run Score Calculator Tests'}
      </button>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className="border rounded p-4">
            <h3 className="font-semibold">{result.test}</h3>
            <div className={`mt-2 p-2 rounded ${
              result.result.status === 'success' ? 'bg-green-100 text-green-800' :
              result.result.status === 'error' ? 'bg-red-100 text-red-800' :
              result.result.status === 'testing...' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <strong>Status:</strong> {result.result.status}
              {result.result.data && (
                <div><strong>Data:</strong> {result.result.data}</div>
              )}
              {result.result.error && (
                <div><strong>Error:</strong> {result.result.error}</div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(result.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreCalculatorTest;
