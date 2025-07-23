export interface Case {
  id: number;
  title: string;
  scenario: string;
  productName: string; // Name of the product for this case
  batchNumber: string; // Batch number for this case
  imageSrc: string; // Image source for the product
  deviationType: string; // Type of deviation for this case
  questions: {
    violation?: {
      question: string;
      options: string[];
      correct: number;
    };
    rootCause: {
      question: string;
      options: string[];
      correct: number;
    };
    impact: {
      question: string;
      options: string[];
      correct: number;
    };
  };
}

export interface GameState {
  currentCase: number;
  moduleNumber: number; // Added for dynamic module support
  answers: {
    violation: number | null;
    rootCause: number | null;
    impact: number | null;
  };
  score: number;
  totalQuestions: number;
  showFeedback: boolean;
  gameComplete: boolean;
}

export interface DragItem {
  id: number;
  text: string;
  isCorrect: boolean;
}