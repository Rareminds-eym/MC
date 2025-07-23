import React, { useRef, useEffect } from 'react';
import { useDeviceLayout } from '../../hooks/useOrientation'; // Adjust the import path as needed

interface BingoCell {
  id: number;
  term: string;
  definition: string;
  selected: boolean;
}

interface BingoGridProps {
  cells: BingoCell[];
  completedLines: number[][];
  gameComplete: boolean;
  onCellClick: (id: number) => void;
  isInCompletedLine: (cellId: number) => boolean;
  disabled?: boolean; // <-- Add disabled prop
  tutorialStep?: number;
}

const BingoGrid: React.FC<BingoGridProps> = ({ 
  cells, 
  completedLines,
  gameComplete, 
  onCellClick, 
  isInCompletedLine,
  disabled = false, // <-- Default to false
  tutorialStep
}) => {
  const { isHorizontal, isMobile } = useDeviceLayout();
  const prevCompletedLinesRef = useRef<number>(0);

  useEffect(() => {
    if (completedLines && completedLines.length > prevCompletedLinesRef.current) {
      const bingoAudio = new Audio('/Bingo.mp3');
      bingoAudio.volume = 0.5;
      bingoAudio.play().catch(() => {});
    }
    prevCompletedLinesRef.current = completedLines ? completedLines.length : 0;
  }, [completedLines]);

  // Helper for cell button classes - now includes landscape-specific classes
  const getCellClasses = (cell: BingoCell) => {
    const inCompletedLine = isInCompletedLine(cell.id);

    let classes = [
      'flex',
      'items-center',
      'justify-center',
      'p-0',
      'font-semibold',
      'transition-all',
      'duration-200',
      'ease-[cubic-bezier(.4,2,.6,1)]',
      'border', // changed from border-[0.5px] to border for thinner border
      'border-black',
      'bg-white',
      'text-gray-800',
      'box-border',
      'text-small'
    ];

    // Only use horizontal mode for mobile devices in landscape
    if (isMobile && isHorizontal) {
      classes.push(
        'min-w-[40px]',
        'text-[0.8rem]', // increased from 0.5rem
        'aspect-[1.2/0.64]', 
      );
    } else {
      classes.push(
        'aspect-[2.4/1.8]',
        'min-w-[20px]',
        'text-small', 
        'text-[0.7rem]', // increased from 0.6rem
      );
    }

    // Selected state
    if (cell.selected) {
      if (inCompletedLine) {
        classes = classes.filter(c => !c.includes('bg-') && !c.includes('text-') && !c.includes('border-'));
        classes.push(
          'bg-gradient-to-br',
          'from-yellow-400',
          'to-yellow-500',
          'text-white',
          'border-2', // Decreased border thickness for completed lines
          'border-black',
          'shadow-[0_4px_16px_rgba(251,191,36,0.3)]',
        );
      } else {
        classes = classes.filter(c => !c.includes('bg-') && !c.includes('text-') && !c.includes('border-'));
        classes.push(
          'bg-white',
          'text-green-600',
          'border-3',
          'border-[#77B254]',
          'shadow-[0_4px_16px_rgba(16,185,129,0.2)]'
        );
      }
      // Always re-apply the correct text size class for selected cells
      if (isMobile && isHorizontal) {
        classes.push('text-[0.9rem]'); // increased from 0.65rem
      } else {
        classes.push('text-[1rem]'); // increased from 0.6rem
      }
    }

    if (cell.id === 24) {
      classes.push('border-3 border-[#77B254] shadow-[0_0_0_2px_#4ade80]');
    }

    if (gameComplete || cell.selected) {
      classes.push('cursor-not-allowed');
    } else {
      classes.push('cursor-pointer');
    }

    return classes.join(' ');
  };

  // Hover/touch effect classes
  const hoverClasses = (cell: BingoCell) => {
    if (cell.selected || gameComplete) return '';
    // Use both hover and active for seamless pop-out on touch devices
    return `
      hover:shadow-[0_8px_24px_0_rgba(37,99,235,0.25)]
      hover:text-blue-600
      hover:border-2
      hover:border-blue-600
      hover:-translate-y-1
      hover:scale-[1.05]
      active:shadow-[0_8px_24px_0_rgba(37,99,235,0.25)]
      active:text-blue-600
      active:border-2
      active:border-blue-600
      active:-translate-y-1
      active:scale-[1.05]
      transition-all duration-150
    `;
  };

  // Grid classes based on orientation
  const gridClasses = `bingo-grid-grid grid grid-cols-5 gap-px pixel-border-narrow bg-gray-900 shadow-[0_0_32px_8px_rgba(59,130,246,0.10),0_0_32px_16px_rgba(59,130,246,0.08)] ${
    isHorizontal ? 'gap-0.5' : ''
  }`;

  return (
    <div className={`pixel-border-narrow bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-2xl p-3 sm:p-1 transition-[box-shadow,transform] duration-300 ${
      isHorizontal ? 'p-1' : ''
    } ${tutorialStep === 3 ? 'tutorial-highlight' : ''}`}
      data-tutorial-highlight="bingogrid"
    >
      <div className={gridClasses}>
        {cells.map((cell) => (
          <button
            key={cell.id}
            className={`${getCellClasses(cell)} ${hoverClasses(cell)} pixel-border bg-gradient-to-br from-gray-200 to-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onClick={() => onCellClick(cell.id)}
            disabled={gameComplete || cell.selected || disabled}
            title={cell.definition}
            style={{ margin: 2 }}
          >
            <span className="text-center leading-tight w-full break-words font-black pixel-text">
              {cell.term}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BingoGrid;