export interface Level {
  id: number;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  stars: number;
  taxonomy: 'Recall' | 'Classify' | 'Apply' | 'Analyze';
  time: number;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  position: { x: number; y: number };
  completed: boolean;
  unlocked: boolean;
  levels: Level[];
}

export interface GameState {
  currentModule?: Module;
  currentLevel?: Level;
  progress: {
    completedLevels: number[];
    scores: Record<number, number>;
    stars: Record<number, number>;
  };
}

export interface UserScore {
  moduleId: number;
  levelId: number;
  score: number;
  stars: number;
  completedAt: string;
}

export interface NavigationState {
  fromRoadmap?: boolean;
  fromModule?: boolean;
}
