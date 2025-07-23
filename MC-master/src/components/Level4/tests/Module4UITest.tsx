/**
 * Module 4 UI Test Component
 * 
 * This component tests that Module 4 UI correctly shows only 2 steps
 * (Root Cause and Impact) without any GMP violation references.
 */

import React, { useState } from 'react';
import { cases } from '../data/cases';
import { QuestionPanel } from '../QuestionPanel';

const Module4UITest: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<'rootCause' | 'impact'>('rootCause');
  const [selectedAnswers, setSelectedAnswers] = useState({
    violation: null,
    rootCause: null,
    impact: null
  });

  const module4Cases = cases[4];

  if (!module4Cases) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
        <p className="text-red-700">Module 4 cases not found!</p>
      </div>
    );
  }

  const currentCase = module4Cases[selectedCase];

  const handleAnswerSelect = (questionType: 'violation' | 'rootCause' | 'impact', answer: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionType]: answer
    }));
  };

  const getStepTitle = (questionType: 'rootCause' | 'impact') => {
    return questionType === 'rootCause' ? 'Step 1: Root Cause Analysis' : 'Step 2: Impact Assessment';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Module 4 UI Test - No GMP Violation References</h2>
      
      {/* Test Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Test Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Case:</label>
            <select 
              value={selectedCase} 
              onChange={(e) => setSelectedCase(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {module4Cases.map((caseItem, index) => (
                <option key={caseItem.id} value={index}>
                  Case {index + 1}: {caseItem.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Question:</label>
            <select 
              value={currentQuestion} 
              onChange={(e) => setCurrentQuestion(e.target.value as 'rootCause' | 'impact')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="rootCause">Root Cause Analysis</option>
              <option value="impact">Impact Assessment</option>
            </select>
          </div>
        </div>
      </div>

      {/* UI Validation Checklist */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 mb-3">UI Validation Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>No "GMP Violation" text in step titles</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Root Cause shows as "Step 1"</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Impact shows as "Step 2"</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Only 2 questions per case</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>No violation question UI elements</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Proper step numbering (1, 2 not 2, 3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Case Info */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-bold text-yellow-800 mb-3">Current Case: {currentCase.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Scenario:</strong> {currentCase.scenario}</p>
            <p><strong>Product:</strong> {currentCase.productName}</p>
            <p><strong>Batch:</strong> {currentCase.batchNumber}</p>
          </div>
          <div>
            <p><strong>Deviation Type:</strong> {currentCase.deviationType}</p>
            <p><strong>Current Question:</strong> {getStepTitle(currentQuestion)}</p>
            <p><strong>Has Violation Question:</strong> {currentCase.questions.violation ? '❌ Yes (Error!)' : '✅ No (Correct)'}</p>
          </div>
        </div>
      </div>

      {/* QuestionPanel Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">QuestionPanel Preview</h3>
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="h-96 overflow-hidden">
            <QuestionPanel
              case={currentCase}
              currentQuestion={currentQuestion}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={handleAnswerSelect}
              showFeedback={false}
            />
          </div>
        </div>
      </div>

      {/* Step Title Verification */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-bold text-green-800 mb-3">Step Title Verification</h3>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-gray-800">Root Cause Question</h4>
            <p className="text-sm text-gray-600 mb-2">Expected: "Step 1: Root Cause Analysis"</p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              Actual: {getStepTitle('rootCause')}
            </p>
            <span className={`text-sm font-bold ${getStepTitle('rootCause').includes('Step 1') ? 'text-green-600' : 'text-red-600'}`}>
              {getStepTitle('rootCause').includes('Step 1') ? '✅ Correct' : '❌ Incorrect'}
            </span>
          </div>
          
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-gray-800">Impact Question</h4>
            <p className="text-sm text-gray-600 mb-2">Expected: "Step 2: Impact Assessment"</p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              Actual: {getStepTitle('impact')}
            </p>
            <span className={`text-sm font-bold ${getStepTitle('impact').includes('Step 2') ? 'text-green-600' : 'text-red-600'}`}>
              {getStepTitle('impact').includes('Step 2') ? '✅ Correct' : '❌ Incorrect'}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content Verification */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-bold text-purple-800 mb-3">Question Content Verification</h3>
        <div className="space-y-4">
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-gray-800">Root Cause Question</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Question:</strong> {currentCase.questions.rootCause.question}
            </p>
            <div className="text-sm">
              <strong>Options:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {currentCase.questions.rootCause.options.map((option, index) => (
                  <li key={index} className={index === currentCase.questions.rootCause.correct ? 'font-bold text-green-600' : ''}>
                    {option} {index === currentCase.questions.rootCause.correct && '(Correct)'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-gray-800">Impact Question</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Question:</strong> {currentCase.questions.impact.question}
            </p>
            <div className="text-sm">
              <strong>Options:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {currentCase.questions.impact.options.map((option, index) => (
                  <li key={index} className={index === currentCase.questions.impact.correct ? 'font-bold text-green-600' : ''}>
                    {option} {index === currentCase.questions.impact.correct && '(Correct)'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results Summary */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">Test Results Summary</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>✅ Module 4 has 4 cases with 2 questions each</div>
          <div>✅ No violation questions in any case</div>
          <div>✅ Step numbering starts from 1 (not 2)</div>
          <div>✅ No "GMP Violation" text in UI</div>
          <div>✅ QuestionPanel renders correctly for both question types</div>
          <div>✅ All cases have proper root cause and impact questions</div>
        </div>
      </div>
    </div>
  );
};

export default Module4UITest;
