export interface User {
  username: string;
  currentModule: number;
  completedLevels: string[];
  totalScore: number;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  isLocked: boolean;
  progress: number;
  levels: Level[];
}

export interface Level {
  id: string;
  title: string;
  description: string;
  scenario: string;
  isCompleted: boolean;
  score: number;
  maxScore: number;
}

export interface DraggableItem {
  id: string;
  text: string;
  category: 'violation' | 'correction';
  isCorrect: boolean;
}

export interface DropZone {
  id: string;
  title: string;
  category: 'violation' | 'correction';
  acceptedItems: string[];
  droppedItem?: DraggableItem;
}

export interface GameState {
  currentScreen: string;
  user: User | null;
  modules: Module[];
  currentModule: number | null;
  currentLevel: string | null;
  gameData: {
    draggableItems: DraggableItem[];
    dropZones: DropZone[];
    isCompleted: boolean;
    score: number;
  };
}