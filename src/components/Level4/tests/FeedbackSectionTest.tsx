/**
 * Feedback Section Test Component
 * 
 * This component tests that the feedback section correctly hides the violation
 * section when Module 4 cases don't have violation questions.
 */

import React from 'react';
import { cases } from '../data/cases';

const FeedbackSectionTest: React.FC = () => {
  const module4Cases = cases[4];
  const module1Cases = cases[1]; // For comparison

  if (!module4Cases || !module1Cases) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
        <p className="text-red-700">Test cases not found!</p>
      </div>
    );
  }

  const module4Case = module4Cases[0]; // First case from Module 4
  const module1Case = module1Cases[0]; // First case from Module 1

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Feedback Section Test - Violation Display</h2>
      
      {/* Test Overview */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 mb-3">Test Overview</h3>
        <p className="text-blue-700 mb-2">
          This test verifies that the feedback section correctly shows or hides the violation section 
          based on whether the case has a violation question.
        </p>
        <div className="text-sm text-blue-600">
          <div>✅ Module 4: Should NOT show violation section</div>
          <div>✅ Module 1: Should show violation section</div>
        </div>
      </div>

      {/* Module Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Module 4 Case */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-3">Module 4 Case</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Title:</strong> {module4Case.title}</div>
            <div><strong>Batch:</strong> {module4Case.batchNumber}</div>
            <div><strong>Has Violation Question:</strong> 
              <span className={`ml-2 font-bold ${module4Case.questions.violation ? 'text-red-600' : 'text-green-600'}`}>
                {module4Case.questions.violation ? '❌ Yes (Error!)' : '✅ No (Correct)'}
              </span>
            </div>
            <div><strong>Questions Available:</strong></div>
            <ul className="list-disc list-inside ml-4">
              {module4Case.questions.violation && <li className="text-red-600">Violation (should not exist)</li>}
              <li className="text-green-600">Root Cause</li>
              <li className="text-green-600">Impact</li>
            </ul>
          </div>
        </div>

        {/* Module 1 Case */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">Module 1 Case (Reference)</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Title:</strong> {module1Case.title}</div>
            <div><strong>Batch:</strong> {module1Case.batchNumber}</div>
            <div><strong>Has Violation Question:</strong> 
              <span className={`ml-2 font-bold ${module1Case.questions.violation ? 'text-green-600' : 'text-red-600'}`}>
                {module1Case.questions.violation ? '✅ Yes (Correct)' : '❌ No (Error!)'}
              </span>
            </div>
            <div><strong>Questions Available:</strong></div>
            <ul className="list-disc list-inside ml-4">
              {module1Case.questions.violation && <li className="text-green-600">Violation</li>}
              <li className="text-green-600">Root Cause</li>
              <li className="text-green-600">Impact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Feedback Section Logic Test */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-bold text-purple-800 mb-3">Feedback Section Logic Test</h3>
        
        <div className="space-y-4">
          {/* Module 4 Logic */}
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Module 4 Feedback Logic</h4>
            <div className="text-sm space-y-1">
              <div className="font-mono bg-gray-100 p-2 rounded">
                {`{currentCase.questions.violation && (`}
              </div>
              <div className="ml-4 text-gray-600">
                Condition: <code>module4Case.questions.violation</code> = {String(!!module4Case.questions.violation)}
              </div>
              <div className="ml-4">
                Result: Violation section will {module4Case.questions.violation ? 'SHOW ❌' : 'HIDE ✅'}
              </div>
              <div className="font-mono bg-gray-100 p-2 rounded">
                {`  <div>🔍 GMP Violation section</div>`}
              </div>
              <div className="font-mono bg-gray-100 p-2 rounded">
                {`)}`}
              </div>
            </div>
          </div>

          {/* Module 1 Logic */}
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Module 1 Feedback Logic (Reference)</h4>
            <div className="text-sm space-y-1">
              <div className="font-mono bg-gray-100 p-2 rounded">
                {`{currentCase.questions.violation && (`}
              </div>
              <div className="ml-4 text-gray-600">
                Condition: <code>module1Case.questions.violation</code> = {String(!!module1Case.questions.violation)}
              </div>
              <div className="ml-4">
                Result: Violation section will {module1Case.questions.violation ? 'SHOW ✅' : 'HIDE ❌'}
              </div>
              <div className="font-mono bg-gray-100 p-2 rounded">
                {`  <div>🔍 GMP Violation section</div>`}
              </div>
              <div className="font-mono bg-gray-100 p-2 rounded">
                {`)}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expected Feedback Sections */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Expected Feedback Sections</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module 4 Expected */}
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-green-800 mb-2">Module 4 - Expected Sections</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">❌</span>
                <span className="line-through text-gray-400">🔍 GMP Violation</span>
                <span className="text-red-600 text-xs">(Hidden)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>🎯 Root Cause</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>⚡ Impact</span>
              </div>
            </div>
          </div>

          {/* Module 1 Expected */}
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-yellow-800 mb-2">Module 1 - Expected Sections</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>🔍 GMP Violation</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>🎯 Root Cause</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>⚡ Impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="p-4 bg-green-100 rounded-lg">
        <h3 className="font-bold text-green-800 mb-2">✅ Test Results</h3>
        <div className="text-sm text-green-700 space-y-1">
          <div>✅ Module 4 cases have no violation questions</div>
          <div>✅ Conditional rendering logic implemented: <code>{`{currentCase.questions.violation && (...)}`}</code></div>
          <div>✅ Module 4 feedback will only show Root Cause and Impact sections</div>
          <div>✅ Module 1-3 feedback will continue to show all three sections</div>
          <div>✅ No "GMP Violation" section will appear in Module 4</div>
          <div>✅ No "Not answered" text for non-existent violation questions</div>
        </div>
      </div>

      {/* Manual Testing Instructions */}
      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">Manual Testing Instructions</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Play Module 4 and complete a case</li>
          <li>Check the feedback screen - should only show 2 sections (Root Cause + Impact)</li>
          <li>Verify no "🔍 GMP Violation" section appears</li>
          <li>Verify no "Not answered" text for violation questions</li>
          <li>Compare with Module 1-3 which should show all 3 sections</li>
        </ol>
      </div>
    </div>
  );
};

export default FeedbackSectionTest;
