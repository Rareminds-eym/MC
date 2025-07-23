import React from 'react';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  stars, 
  maxStars = 3, 
  size = 'md',
  showCount = false 
}) => {
  const sizeMap = {
    sm: '1rem',
    md: '1.2rem',
    lg: '1.5rem'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(maxStars)].map((_, i) => (
        <span 
          key={i} 
          style={{ 
            color: i < stars ? '#fbbf24' : '#6b7280', 
            fontSize: sizeMap[size]
          }}
        >
          ⭐
        </span>
      ))}
      {showCount && (
        <span style={{ 
          marginLeft: '8px', 
          fontSize: '0.9rem', 
          color: '#9ca3af' 
        }}>
          ({stars}/{maxStars})
        </span>
      )}
    </div>
  );
};

export default StarRating;
