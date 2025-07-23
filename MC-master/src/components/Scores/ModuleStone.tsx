import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { ModuleStoneProps } from './types/GameData';
import { useDeviceLayout } from '../../hooks/useOrientation';
import { getModuleScore } from './modulesData';

const ModuleStone: React.FC<ModuleStoneProps> = ({ module, position, onClick }) => {
  const { id, status } = module;
  const { x, y } = position;
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile } = useDeviceLayout();

  // Calculate module score
  const moduleScore = getModuleScore(module);

  // Responsive sizing for desktop/laptop, keep original size for mobile
  const sizeMultiplier = isMobile ? 1.1 : 0.8;

  // Responsive dimensions
  const mainRadius = 36 * sizeMultiplier;
  const innerRadius = 30 * sizeMultiplier;
  const depthRadius = 24 * sizeMultiplier;
  const shadowRx = 38 * sizeMultiplier;
  const shadowRy = 12 * sizeMultiplier;
  const shadowCx = 3 * sizeMultiplier;
  const shadowCy = 42 * sizeMultiplier;

  const getModuleColor = (): string => {
    switch (status) {
      case 'completed':
        return '#10B981'; // Emerald Green
      case 'unlocked':
        return '#F59E0B'; // Amber Gold
      case 'locked':
      default:
        return '#6B7280'; // Cool Gray
    }
  };

  const getSecondaryColor = (): string => {
    switch (status) {
      case 'completed':
        return '#059669'; // Darker emerald
      case 'unlocked':
        return '#D97706'; // Darker amber
      case 'locked':
      default:
        return '#4B5563'; // Darker gray
    }
  };

  const isClickable: boolean = status !== 'locked';
  const hoverScale = isHovered && isClickable ? 1.02 : 1;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${hoverScale})`}
      className={`transition-all duration-300 ${
        isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformOrigin: 'center' }}
    >
      {/* Enhanced shadow with depth */}
      <ellipse
        cx={shadowCx}
        cy={shadowCy}
        rx={shadowRx}
        ry={shadowRy}
        fill={isHovered && isClickable ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)"}
        className="transition-all duration-300"
      />

      {/* Game-style gradients and effects */}
      <defs>
        <radialGradient id={`gradient-${id}`} cx="30%" cy="25%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="30%" stopColor={getModuleColor()} stopOpacity="1" />
          <stop offset="100%" stopColor={getSecondaryColor()} stopOpacity="0.8" />
        </radialGradient>

        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main circle with enhanced styling */}
      <circle
        r={mainRadius}
        fill={`url(#gradient-${id})`}
        stroke={isHovered && isClickable ? "#1F2937" : "#374151"}
        strokeWidth={isHovered && isClickable ? (5 * sizeMultiplier) : (4 * sizeMultiplier)}
        className="drop-shadow-xl transition-all duration-300"
        filter={status === 'unlocked' ? `url(#glow-${id})` : undefined}
      />

      {/* Enhanced inner highlight */}
      <circle
        r={innerRadius}
        fill="none"
        stroke={isHovered && isClickable ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)"}
        strokeWidth={3 * sizeMultiplier}
        className="transition-all duration-300"
      />

      {/* Inner depth ring */}
      <circle
        r={depthRadius}
        fill="none"
        stroke={isHovered && isClickable ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)"}
        strokeWidth={1 * sizeMultiplier}
        className="transition-all duration-300"
      />
      
      {/* Enhanced content based on type and status */}
      {status === 'locked' ? (
        <g>
          <Lock
            size={24 * sizeMultiplier}
            color="white"
            style={{
              transform: `translate(-${12 * sizeMultiplier}px, -${12 * sizeMultiplier}px)`
            }}
            className="drop-shadow-md"
          />
          {/* Lock glow effect */}
          <circle
            r={40 * sizeMultiplier}
            fill="none"
            stroke="rgba(107, 114, 128, 0.3)"
            strokeWidth={2 * sizeMultiplier}
            strokeDasharray={`${5 * sizeMultiplier},${5 * sizeMultiplier}`}
            className="animate-pulse"
          />
        </g>
      ) : (
        <text
          textAnchor="middle"
          dy={7 * sizeMultiplier}
          fontSize={22 * sizeMultiplier}
          fontWeight="bold"
          fill="white"
          className="select-none drop-shadow-lg"
          style={{ textShadow: `${2 * sizeMultiplier}px ${2 * sizeMultiplier}px ${4 * sizeMultiplier}px rgba(0,0,0,0.5)` }}
        >
          {id}
        </text>
      )}

      {/* Score display for completed modules */}
      {status === 'completed' && moduleScore > 0 && (
        <g transform={`translate(0, ${-45 * sizeMultiplier})`}>
          <rect
            x={-20 * sizeMultiplier}
            y={-8 * sizeMultiplier}
            width={40 * sizeMultiplier}
            height={16 * sizeMultiplier}
            rx={8 * sizeMultiplier}
            fill="rgba(0, 0, 0, 0.7)"
            stroke="#FCD34D"
            strokeWidth={1 * sizeMultiplier}
          />
          <text
            textAnchor="middle"
            dy={4 * sizeMultiplier}
            fontSize={10 * sizeMultiplier}
            fontWeight="bold"
            fill="#FCD34D"
            style={{ textShadow: `${1 * sizeMultiplier}px ${1 * sizeMultiplier}px ${2 * sizeMultiplier}px rgba(0,0,0,0.8)` }}
          >
            {moduleScore}
          </text>
        </g>
      )}

      {/* Enhanced pulse animation for unlocked module */}
      {status === 'unlocked' && (
        <>
          <circle
            r={42 * sizeMultiplier}
            fill="none"
            stroke={getModuleColor()}
            strokeWidth={3 * sizeMultiplier}
            opacity="0.7"
            className="animate-pulse"
          />
          <circle
            r={48 * sizeMultiplier}
            fill="none"
            stroke={getModuleColor()}
            strokeWidth={2 * sizeMultiplier}
            opacity="0.4"
            className="animate-ping"
          />
        </>
      )}

      {/* Enhanced hover glow effect */}
      {isHovered && isClickable && (
        <>
          <circle
            r={44 * sizeMultiplier}
            fill="none"
            stroke={getModuleColor()}
            strokeWidth={3 * sizeMultiplier}
            opacity="0.6"
            className="transition-all duration-300"
          />
          <circle
            r={50 * sizeMultiplier}
            fill="none"
            stroke={getModuleColor()}
            strokeWidth={1 * sizeMultiplier}
            opacity="0.3"
            className="transition-all duration-300"
          />
        </>
      )}
    </g>
  );
};

export default ModuleStone;