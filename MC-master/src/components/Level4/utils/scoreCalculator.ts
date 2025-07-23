/**
 * Utility functions for calculating Level 4 scores dynamically
 */

import { casesByModule } from '../data/cases';

/**
 * Calculate the maximum possible score for a given module
 * @param moduleId - The module number
 * @returns Maximum score for the module (dynamically calculated based on actual questions)
 */
export const calculateMaxScore = (moduleId: number): number => {
  console.log('📊 calculateMaxScore called with moduleId:', moduleId);

  try {
    console.log('📊 casesByModule loaded:', {
      available: !!casesByModule,
      keys: casesByModule ? Object.keys(casesByModule) : 'none',
      moduleExists: casesByModule && casesByModule[moduleId] ? 'yes' : 'no',
      moduleData: casesByModule && casesByModule[moduleId] ? casesByModule[moduleId].length + ' scenarios' : 'not found'
    });

    if (casesByModule && casesByModule[moduleId]) {
      const cases = casesByModule[moduleId];
      let totalQuestions = 0;

      // Count actual questions in each case
      cases.forEach((caseItem: any, index: number) => {
        const questionsInCase = (caseItem.questions.violation ? 1 : 0) +
                               (caseItem.questions.rootCause ? 1 : 0) +
                               (caseItem.questions.impact ? 1 : 0);
        totalQuestions += questionsInCase;
        console.log(`📊 Case ${index + 1}: ${questionsInCase} questions`);
      });

      // Each question is worth 5 points
      const maxScore = totalQuestions * 5;
      console.log(`📊 Module ${moduleId}: ${cases.length} scenarios, ${totalQuestions} total questions = ${maxScore} max score`);
      return maxScore;
    }
  } catch (error) {
    console.warn(`Failed to calculate max score for module ${moduleId}:`, error);
  }

  // Fallback to default (2 scenarios × 15 points = 30)
  console.log(`📊 Using fallback max score of 30 for module ${moduleId}`);
  return 30;
};

/**
 * Calculate the number of scenarios in a module
 * @param moduleId - The module number
 * @returns Number of scenarios in the module
 */
export const getScenarioCount = (moduleId: number): number => {
  try {
    if (casesByModule && casesByModule[moduleId]) {
      return casesByModule[moduleId].length;
    }
  } catch (error) {
    console.warn(`Failed to get scenario count for module ${moduleId}:`, error);
  }

  // Fallback to default
  return 2;
};

/**
 * Calculate the total number of questions in a module
 * @param moduleId - The module number
 * @returns Total number of questions across all scenarios in the module
 */
export const getTotalQuestionCount = (moduleId: number): number => {
  try {
    if (casesByModule && casesByModule[moduleId]) {
      const cases = casesByModule[moduleId];
      let totalQuestions = 0;

      cases.forEach((caseItem: any) => {
        const questionsInCase = (caseItem.questions.violation ? 1 : 0) +
                               (caseItem.questions.rootCause ? 1 : 0) +
                               (caseItem.questions.impact ? 1 : 0);
        totalQuestions += questionsInCase;
      });

      return totalQuestions;
    }
  } catch (error) {
    console.warn(`Failed to get total question count for module ${moduleId}:`, error);
  }

  // Fallback to default (2 scenarios × 3 questions = 6)
  return 6;
};

/**
 * Calculate star rating based on score and module
 * @param score - The achieved score
 * @param moduleId - The module number
 * @returns Number of stars (0-5)
 */
export const calculateStars = (score: number, moduleId: number): number => {
  const maxScore = calculateMaxScore(moduleId);
  return Math.round((score / maxScore) * 5);
};

/**
 * Calculate percentage score
 * @param score - The achieved score
 * @param moduleId - The module number
 * @returns Percentage score (0-100)
 */
export const calculatePercentage = (score: number, moduleId: number): number => {
  const maxScore = calculateMaxScore(moduleId);
  return Math.round((score / maxScore) * 100);
};
