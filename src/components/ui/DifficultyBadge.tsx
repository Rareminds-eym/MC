import React from 'react';
import { getDifficultyColor } from '../../utils/gameHelpers';

interface DifficultyBadgeProps {
  difficulty: string;
  size?: 'sm' | 'md' | 'lg';
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '0.7rem' },
    md: { padding: '4px 12px', fontSize: '0.8rem' },
    lg: { padding: '6px 16px', fontSize: '0.9rem' }
  };

  return (
    <span style={{
      backgroundColor: getDifficultyColor(difficulty),
      color: 'white',
      borderRadius: '12px',
      fontWeight: 'bold',
      ...sizeStyles[size]
    }}>
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
