/**
 * Format score percentage with color coding
 */
export const formatScoreWithColor = (score: number): { score: string; color: string } => {
  return {
    score: `${score}%`,
    color: score >= 90 ? '#10b981' : score >= 80 ? '#f59e0b' : '#ef4444'
  };
};

/**
 * Get difficulty badge color
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return '#10b981';
    case 'intermediate':
      return '#f59e0b';
    case 'advanced':
      return '#ef4444';
    case 'expert':
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};

/**
 * Calculate star rating based on score
 */
export const calculateStars = (score: number): number => {
  if (score >= 90) return 3;
  if (score >= 80) return 2;
  if (score >= 70) return 1;
  return 0;
};

/**
 * Format time duration
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Generate unique level identifier
 */
export const generateLevelId = (moduleId: number, levelId: number): string => {
  return `${moduleId}-${levelId}`;
};

/**
 * Parse level identifier
 */
export const parseLevelId = (levelId: string): { moduleId: number; levelId: number } => {
  const [moduleId, levelIdPart] = levelId.split('-').map(Number);
  return { moduleId, levelId: levelIdPart };
};

/**
 * Get taxonomy level information
 */
export const getTaxonomyInfo = (taxonomy: string) => {
  const taxonomyMap = {
    'Recall': { 
      level: 1, 
      description: 'Remember and retrieve information',
      color: '#10b981'
    },
    'Classify': { 
      level: 2, 
      description: 'Understand and categorize concepts',
      color: '#f59e0b'
    },
    'Apply': { 
      level: 3, 
      description: 'Use knowledge in practical situations',
      color: '#ef4444'
    },
    'Analyze': { 
      level: 4, 
      description: 'Examine and break down complex information',
      color: '#8b5cf6'
    }
  };
  
  return taxonomyMap[taxonomy as keyof typeof taxonomyMap] || {
    level: 0,
    description: 'Unknown taxonomy level',
    color: '#6b7280'
  };
};
