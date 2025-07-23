export interface Level {
  id: number;
  name: string;
  score: number;
}

export interface ModuleLevel extends Level {
  stars?: number;
  completed?: boolean;
  timeSpent?: string;
}

export interface Module {
  id: number;
  status: 'completed' | 'unlocked' | 'locked';
  levels?: ModuleLevel[];
}

export interface ModulePosition {
  x: number;
  y: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  totalScore: number;
  rank: string;
  level: number;
  completedModules: number;
  totalModules: number;
}

// Props interfaces for components
export interface ModuleDetailModalProps {
  isOpen: boolean;
  module: Module | null;
  onClose: () => void;
}

export interface ModuleStoneProps {
  module: Module;
  position: ModulePosition;
  onClick: () => void;
}