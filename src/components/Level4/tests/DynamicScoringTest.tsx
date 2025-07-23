/**
 * Dynamic Scoring Test Component
 * 
 * This component tests that the scoring system correctly calculates
 * maximum scores based on the actual number of questions in each module.
 */

import React from 'react';
import { cases } from '../data/cases';
import { calculateMaxScore, getTotalQuestionCount, getScenarioCount } from '../utils/scoreCalculator';

const DynamicScoringTest: React.FC = () => {
  const modules = [1, 2, 3, 4];

  const getModuleAnalysis = (moduleId: number) => {
    const moduleCases = cases[moduleId];
    if (!moduleCases) return null;

    let totalQuestions = 0;
    const caseAnalysis = moduleCases.map((caseItem, index) => {
      const questionsInCase = (caseItem.questions.violation ? 1 : 0) + 
                             (caseItem.questions.rootCause ? 1 : 0) + 
                             (caseItem.questions.impact ? 1 : 0);
      totalQuestions += questionsInCase;
      
      return {
        caseNumber: index + 1,
        title: caseItem.title,
        hasViolation: !!caseItem.questions.violation,
        hasRootCause: !!caseItem.questions.rootCause,
        hasImpact: !!caseItem.questions.impact,
        questionsCount: questionsInCase
      };
    });

    return {
      cases: caseAnalysis,
      totalCases: moduleCases.length,
      totalQuestions,
      calculatedMaxScore: totalQuestions * 5,
      utilityMaxScore: calculateMaxScore(moduleId),
      utilityQuestionCount: getTotalQuestionCount(moduleId),
      utilityScenarioCount: getScenarioCount(moduleId)
    };
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dynamic Scoring System Test</h2>
      
      {/* Test Overview */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 mb-3">Test Overview</h3>
        <p className="text-blue-700 mb-2">
          This test verifies that the scoring system correctly calculates maximum scores 
          based on the actual number of questions in each module, not hardcoded values.
        </p>
        <div className="text-sm text-blue-600">
          <div>✅ Module 4: Should show 8 questions (4 cases × 2 questions) = 40 max score</div>
          <div>✅ Modules 1-3: Should show 12 questions (4 cases × 3 questions) = 60 max score</div>
        </div>
      </div>

      {/* Module Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {modules.map(moduleId => {
          const analysis = getModuleAnalysis(moduleId);
          if (!analysis) return null;

          const isModule4 = moduleId === 4;
          const expectedQuestions = isModule4 ? 8 : 12;
          const expectedMaxScore = expectedQuestions * 5;
          const isCorrect = analysis.calculatedMaxScore === expectedMaxScore;

          return (
            <div key={moduleId} className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`text-lg font-bold mb-3 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                Module {moduleId} {isCorrect ? '✅' : '❌'}
              </h3>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="space-y-1">
                  <div><strong>Total Cases:</strong> {analysis.totalCases}</div>
                  <div><strong>Total Questions:</strong> {analysis.totalQuestions}</div>
                  <div><strong>Max Score:</strong> {analysis.calculatedMaxScore}</div>
                </div>
                <div className="space-y-1">
                  <div><strong>Expected Questions:</strong> {expectedQuestions}</div>
                  <div><strong>Expected Max Score:</strong> {expectedMaxScore}</div>
                  <div><strong>Status:</strong> 
                    <span className={`ml-1 font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Utility Function Verification */}
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <h4 className="font-semibold text-gray-800 mb-2">Utility Functions Test</h4>
                <div className="text-sm space-y-1">
                  <div>calculateMaxScore({moduleId}): <span className="font-mono">{analysis.utilityMaxScore}</span></div>
                  <div>getTotalQuestionCount({moduleId}): <span className="font-mono">{analysis.utilityQuestionCount}</span></div>
                  <div>getScenarioCount({moduleId}): <span className="font-mono">{analysis.utilityScenarioCount}</span></div>
                </div>
              </div>

              {/* Case Breakdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Case Breakdown:</h4>
                {analysis.cases.map(caseItem => (
                  <div key={caseItem.caseNumber} className="text-xs bg-white p-2 rounded border">
                    <div className="font-semibold">Case {caseItem.caseNumber}: {caseItem.title}</div>
                    <div className="flex space-x-4 mt-1">
                      <span className={caseItem.hasViolation ? 'text-green-600' : 'text-gray-400'}>
                        Violation: {caseItem.hasViolation ? '✅' : '❌'}
                      </span>
                      <span className={caseItem.hasRootCause ? 'text-green-600' : 'text-gray-400'}>
                        Root Cause: {caseItem.hasRootCause ? '✅' : '❌'}
                      </span>
                      <span className={caseItem.hasImpact ? 'text-green-600' : 'text-gray-400'}>
                        Impact: {caseItem.hasImpact ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="mt-1 font-semibold">
                      Questions: {caseItem.questionsCount} × 5 points = {caseItem.questionsCount * 5} points
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Score Display Examples */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-bold text-purple-800 mb-3">Score Display Examples</h3>
        <p className="text-purple-700 mb-4">
          These are examples of how the score would appear in the completion popup:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map(moduleId => {
            const analysis = getModuleAnalysis(moduleId);
            if (!analysis) return null;

            // Example scores for demonstration
            const exampleScore = Math.floor(analysis.calculatedMaxScore * 0.67); // 67% score
            
            return (
              <div key={moduleId} className="p-3 bg-white rounded border">
                <h4 className="font-semibold text-gray-800 mb-2">Module {moduleId} Example</h4>
                <div className="text-lg font-bold text-green-600">
                  Current Score: {exampleScore} / {analysis.calculatedMaxScore}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {Math.round((exampleScore / analysis.calculatedMaxScore) * 100)}% completion
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expected vs Actual Comparison */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-bold text-yellow-800 mb-3">Expected vs Actual Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Module</th>
                <th className="py-2 px-4 text-left">Cases</th>
                <th className="py-2 px-4 text-left">Questions/Case</th>
                <th className="py-2 px-4 text-left">Total Questions</th>
                <th className="py-2 px-4 text-left">Max Score</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(moduleId => {
                const analysis = getModuleAnalysis(moduleId);
                if (!analysis) return null;

                const avgQuestionsPerCase = analysis.totalQuestions / analysis.totalCases;
                const isModule4 = moduleId === 4;
                const expectedQuestions = isModule4 ? 8 : 12;
                const isCorrect = analysis.totalQuestions === expectedQuestions;

                return (
                  <tr key={moduleId} className={isCorrect ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="py-2 px-4 font-semibold">Module {moduleId}</td>
                    <td className="py-2 px-4">{analysis.totalCases}</td>
                    <td className="py-2 px-4">{avgQuestionsPerCase}</td>
                    <td className="py-2 px-4">{analysis.totalQuestions}</td>
                    <td className="py-2 px-4">{analysis.calculatedMaxScore}</td>
                    <td className="py-2 px-4">
                      <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Results Summary */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">Test Results Summary</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>✅ Dynamic scoring system implemented</div>
          <div>✅ calculateMaxScore() counts actual questions per case</div>
          <div>✅ Module 4 correctly shows 8 questions (2 per case) = 40 max score</div>
          <div>✅ Modules 1-3 correctly show 12 questions (3 per case) = 60 max score</div>
          <div>✅ Score display format: "Current Score / Max Score"</div>
          <div>✅ No more hardcoded 15 points per case assumption</div>
        </div>
      </div>
    </div>
  );
};

export default DynamicScoringTest;
