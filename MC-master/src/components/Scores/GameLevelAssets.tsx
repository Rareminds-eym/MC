import React from 'react';

// Modern 2D Game Level Display Assets
export const GameLevelAssets: React.FC = () => {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Gradient Definitions */}
        <linearGradient id="levelCompleteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <linearGradient id="levelActiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="levelLockedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="50%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>

        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="50%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>

        <radialGradient id="glowEffect" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
        </radialGradient>

        {/* Shadow Filters */}
        <filter id="levelShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25"/>
        </filter>

        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="2"/>
          <feGaussianBlur stdDeviation="3" result="offset-blur"/>
          <feFlood floodColor="#000000" floodOpacity="0.3"/>
          <feComposite in2="offset-blur" operator="in"/>
        </filter>

        <filter id="pathShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#92400E" floodOpacity="0.3"/>
        </filter>

        {/* Patterns */}
        <pattern id="sandPattern" patternUnits="userSpaceOnUse" width="40" height="40">
          <circle cx="5" cy="5" r="1" fill="#F59E0B" opacity="0.1" />
          <circle cx="15" cy="15" r="0.8" fill="#EA580C" opacity="0.1" />
          <circle cx="25" cy="8" r="1.2" fill="#F97316" opacity="0.1" />
          <circle cx="35" cy="25" r="0.9" fill="#FB923C" opacity="0.1" />
        </pattern>

        <pattern id="stoneTexture" patternUnits="userSpaceOnUse" width="20" height="20">
          <circle cx="3" cy="3" r="0.5" fill="#000000" opacity="0.1" />
          <circle cx="12" cy="8" r="0.3" fill="#000000" opacity="0.08" />
          <circle cx="17" cy="15" r="0.4" fill="#000000" opacity="0.09" />
          <circle cx="8" cy="16" r="0.2" fill="#000000" opacity="0.07" />
        </pattern>
      </defs>
    </svg>
  );
};

// Level Node Component
interface LevelNodeProps {
  x: number;
  y: number;
  level: number;
  status: 'locked' | 'unlocked' | 'completed';
  onClick?: () => void;
  size?: number;
}

export const LevelNode: React.FC<LevelNodeProps> = ({ 
  x, 
  y, 
  level, 
  status, 
  onClick, 
  size = 50 
}) => {
  const getGradient = () => {
    switch (status) {
      case 'completed': return 'url(#levelCompleteGradient)';
      case 'unlocked': return 'url(#levelActiveGradient)';
      default: return 'url(#levelLockedGradient)';
    }
  };

  const getStrokeColor = () => {
    switch (status) {
      case 'completed': return '#065F46';
      case 'unlocked': return '#92400E';
      default: return '#374151';
    }
  };

  return (
    <g 
      transform={`translate(${x - size/2}, ${y - size/2})`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className="level-node"
    >
      {/* Glow effect for active/completed levels */}
      {status !== 'locked' && (
        <circle
          cx={size/2}
          cy={size/2}
          r={size * 0.8}
          fill="url(#glowEffect)"
          opacity="0.6"
        />
      )}
      
      {/* Main level circle */}
      <circle
        cx={size/2}
        cy={size/2}
        r={size * 0.4}
        fill={getGradient()}
        stroke={getStrokeColor()}
        strokeWidth="3"
        filter="url(#levelShadow)"
      />
      
      {/* Inner highlight */}
      <circle
        cx={size/2}
        cy={size/2}
        r={size * 0.3}
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="2"
      />
      
      {/* Level number or lock icon */}
      {status === 'locked' ? (
        <g transform={`translate(${size/2 - 8}, ${size/2 - 8})`}>
          {/* Lock icon */}
          <rect x="4" y="8" width="8" height="6" rx="1" fill="white" opacity="0.8" />
          <path d="M6 8V6a2 2 0 0 1 4 0v2" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
        </g>
      ) : (
        <text
          x={size/2}
          y={size/2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={size * 0.3}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {level}
        </text>
      )}
      
      {/* Completion checkmark */}
      {status === 'completed' && (
        <g transform={`translate(${size * 0.7}, ${size * 0.2})`}>
          <circle cx="0" cy="0" r="8" fill="#10B981" stroke="white" strokeWidth="2" />
          <path d="M-3 0 L-1 2 L3 -2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};

// Path Connector Component
interface PathConnectorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isActive?: boolean;
}

export const PathConnector: React.FC<PathConnectorProps> = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  isActive = false 
}) => {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Create a curved path
  const pathData = `M ${startX} ${startY} Q ${midX} ${midY - 30} ${endX} ${endY}`;
  
  return (
    <g>
      {/* Path shadow */}
      <path
        d={pathData}
        fill="none"
        stroke="#92400E"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.3"
        transform="translate(2, 4)"
      />
      
      {/* Main path */}
      <path
        d={pathData}
        fill="none"
        stroke={isActive ? "url(#pathGradient)" : "#D1D5DB"}
        strokeWidth="8"
        strokeLinecap="round"
        opacity={isActive ? "0.8" : "0.5"}
      />
      
      {/* Path highlight */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity={isActive ? "0.6" : "0.3"}
      />
    </g>
  );
};

// Background Elements
export const GameBackground: React.FC = () => {
  return (
    <g>
      {/* Background with sand pattern */}
      <rect width="100%" height="100%" fill="url(#sandPattern)" />
      
      {/* Decorative dunes */}
      <ellipse cx="200" cy="550" rx="150" ry="30" fill="#F59E0B" opacity="0.2" />
      <ellipse cx="600" cy="580" rx="200" ry="40" fill="#EA580C" opacity="0.15" />
      <ellipse cx="1000" cy="560" rx="180" ry="35" fill="#F97316" opacity="0.18" />
    </g>
  );
};

export default GameLevelAssets;
