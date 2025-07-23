import React, { useState, useEffect, useCallback } from 'react';
import { Case } from '../types';

interface Position {
  x: number;
  y: number;
}

interface GameMapProps {
  cases: Case[];
  onCaseStart: (caseIndex: number) => void;
  currentCase: number;
  score: number;
}

// Game world dimensions
const CELL_SIZE = 60;
const MAP_WIDTH = 12;
const MAP_HEIGHT = 8;

// Character and object sprites
const PLAYER_SPRITE = '🧑‍🔬'; // Scientist character
const CASE_FILE_SPRITE = '📋'; // Case file
const COMPLETED_CASE_SPRITE = '✅'; // Completed case
const WALL_SPRITE = '🧱'; // Wall obstacle
const FLOOR_SPRITE = '⬜'; // Floor tile

const GameMap: React.FC<GameMapProps> = ({ cases, onCaseStart, currentCase, score }) => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [casePositions] = useState<Position[]>([
    { x: 3, y: 2 },
    { x: 8, y: 3 },
    { x: 5, y: 6 },
    { x: 10, y: 1 },
    { x: 2, y: 7 }
  ]);

  // Define walls/obstacles
  const walls = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
    { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
    { x: 10, y: 0 }, { x: 11, y: 0 },
    { x: 0, y: 1 }, { x: 11, y: 1 },
    { x: 0, y: 2 }, { x: 11, y: 2 },
    { x: 0, y: 3 }, { x: 11, y: 3 },
    { x: 0, y: 4 }, { x: 11, y: 4 },
    { x: 0, y: 5 }, { x: 11, y: 5 },
    { x: 0, y: 6 }, { x: 11, y: 6 },
    { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 },
    { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 },
    { x: 10, y: 7 }, { x: 11, y: 7 }
  ];

  const isWall = (x: number, y: number) => {
    return walls.some(wall => wall.x === x && wall.y === y);
  };

  const isCaseFile = (x: number, y: number) => {
    return casePositions.findIndex(pos => pos.x === x && pos.y === y);
  };

  const handleMovement = useCallback((e: KeyboardEvent) => {
    const { key } = e;
    setPlayerPos(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = Math.max(0, prev.y - 1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = Math.min(MAP_HEIGHT - 1, prev.y + 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = Math.max(0, prev.x - 1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = Math.min(MAP_WIDTH - 1, prev.x + 1);
          break;
        case ' ':
        case 'Enter':
          // Interact with case file
          const caseIndex = isCaseFile(prev.x, prev.y);
          if (caseIndex >= 0 && caseIndex < cases.length) {
            onCaseStart(caseIndex);
          }
          return prev;
        default:
          return prev;
      }

      // Check collision with walls
      if (isWall(newX, newY)) {
        return prev;
      }

      return { x: newX, y: newY };
    });
  }, [cases.length, onCaseStart]);

  useEffect(() => {
    window.addEventListener('keydown', handleMovement);
    return () => window.removeEventListener('keydown', handleMovement);
  }, [handleMovement]);

  // Check if player is on a case file
  useEffect(() => {
    const caseIndex = isCaseFile(playerPos.x, playerPos.y);
    if (caseIndex >= 0 && caseIndex < cases.length) {
      // Auto-start case when player walks on it
      setTimeout(() => onCaseStart(caseIndex), 200);
    }
  }, [playerPos, cases.length, onCaseStart]);

  const getCellContent = (x: number, y: number) => {
    // Player position
    if (playerPos.x === x && playerPos.y === y) {
      return PLAYER_SPRITE;
    }

    // Case files
    const caseIndex = isCaseFile(x, y);
    if (caseIndex >= 0 && caseIndex < cases.length) {
      return caseIndex < currentCase ? COMPLETED_CASE_SPRITE : CASE_FILE_SPRITE;
    }

    // Walls
    if (isWall(x, y)) {
      return WALL_SPRITE;
    }

    // Floor
    return FLOOR_SPRITE;
  };

  const getCellStyle = (x: number, y: number) => {
    const isPlayerHere = playerPos.x === x && playerPos.y === y;
    const caseIndex = isCaseFile(x, y);
    const isCase = caseIndex >= 0 && caseIndex < cases.length;
    const isCompleted = isCase && caseIndex < currentCase;
    
    let backgroundColor = '#f0f9ff'; // Light blue floor
    
    if (isWall(x, y)) {
      backgroundColor = '#374151'; // Dark gray walls
    } else if (isPlayerHere) {
      backgroundColor = '#3b82f6'; // Blue for player
    } else if (isCompleted) {
      backgroundColor = '#22c55e'; // Green for completed cases
    } else if (isCase) {
      backgroundColor = '#f59e0b'; // Orange for available cases
    }

    return {
      width: CELL_SIZE,
      height: CELL_SIZE,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      backgroundColor,
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s ease',
      boxShadow: isPlayerHere ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
    };
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Laboratory Investigation Floor</h2>
        <p className="text-gray-600 mb-2">Use arrow keys or WASD to move • Walk into case files to investigate</p>
        <div className="flex space-x-4 text-sm">
          <span>🧑‍🔬 You</span>
          <span>📋 Case Files</span>
          <span>✅ Completed</span>
          <span>🧱 Walls</span>
        </div>
      </div>
      
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAP_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${MAP_HEIGHT}, ${CELL_SIZE}px)`,
          gap: 1,
          border: '3px solid #374151',
          borderRadius: '12px',
          padding: '8px',
          backgroundColor: '#1f2937'
        }}
      >
        {Array.from({ length: MAP_HEIGHT }, (_, y) =>
          Array.from({ length: MAP_WIDTH }, (_, x) => (
            <div
              key={`${x}-${y}`}
              style={getCellStyle(x, y)}
            >
              {getCellContent(x, y)}
            </div>
          ))
        )}
      </div>

      <div className="text-center bg-white p-4 rounded-lg shadow-md">
        <p className="font-semibold">Score: {score} | Cases Completed: {currentCase}/{cases.length}</p>
      </div>
    </div>
  );
};

export default GameMap;
