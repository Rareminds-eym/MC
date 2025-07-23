import React from 'react';

interface ProgressBarProps {
  progress: number;
  maxProgress?: number;
  color?: string;
  height?: number;
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  maxProgress = 100,
  color = '#60a5fa',
  height = 8,
  showPercentage = false,
  className = ''
}) => {
  const percentage = Math.min((progress / maxProgress) * 100, 100);

  return (
    <div className={className}>
      <div style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: `${height / 2}px`,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: `${height / 2}px`,
          transition: 'width 0.3s ease-in-out'
        }} />
      </div>
      {showPercentage && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          marginTop: '4px',
          color: '#9ca3af'
        }}>
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
