import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Sparkles, Zap, Target } from 'lucide-react';
import { useDeviceLayout } from '../../hooks/useOrientation';

interface PuzzlePiece {
  id: string;
  text: string;
  category: 'violation' | 'action';
  isCorrect: boolean;
}

interface DraggablePieceProps {
  piece: PuzzlePiece;
}

export const DraggablePiece: React.FC<DraggablePieceProps> = ({ piece }) => {

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: piece.id,
    data: piece,
  });
  const { isMobile: mobile } = useDeviceLayout();

  // Styles from JigsawContainer for visual consistency
  const borderColor = 'border-pink-400';
  const bgGradient = 'from-fuchsia-900/90 via-indigo-900/80 to-blue-800/80';
  const glassBg = 'bg-white/20 backdrop-blur-lg';
  const iconBg = 'bg-gradient-to-br from-pink-500/80 to-fuchsia-400/80 shadow-lg';
  let icon;
  if (piece.category === 'violation') {
    icon = <Zap className="w-4 h-4 text-pink-100 drop-shadow-glow animate-pulse" />;
  } else if (piece.category === 'action') {
    icon = <Target className="w-4 h-4 text-cyan-100 drop-shadow-glow animate-pulse" />;
  } else {
    icon = <Sparkles className="w-4 h-4 text-pink-100 drop-shadow-glow animate-pulse" />;
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group relative select-none flex flex-col items-center justify-center
        bg-gradient-to-br ${bgGradient} text-white p-4 font-extrabold text-center pixel-text tracking-wider
        shadow-[0_0_24px_4px_#f0f,0_2px_12px_0_#0008]
        border-4 ${borderColor} pixel-border-thick overflow-hidden
        ${glassBg}
        transition-all duration-300 ease-out hover:translate-y-[-2px] hover:scale-[1.02] ${isDragging ? "animate-drop-in" : ""}
        ${isDragging ? 'opacity-80 saturate-150 z-50' : ''}
        ${mobile ? 'arsenal-piece-mobile-horizontal' : ''}
      `}
      style={{
        minHeight: '58px',
        maxWidth: '260px',
        width: '100%',
        filter: isDragging ? 'brightness(1.1) grayscale(0.05)' : 'brightness(1.05)',
        clipPath: 'polygon(0% 15%, 8% 15%, 12% 0%, 20% 0%, 25% 15%, 75% 15%, 80% 0%, 88% 0%, 92% 15%, 100% 15%, 100% 85%, 92% 85%, 88% 100%, 80% 100%, 75% 85%, 25% 85%, 20% 100%, 12% 100%, 8% 85%, 0% 85%)',
        borderRadius: '12px',
        touchAction: 'none',
        boxShadow: isDragging
          ? '0 0 0 4px #fff, 0 0 32px 8px #0f0, 0 0 12px 2px #fff, 0 0 0 2px #0f08'
          : '0 2px 12px 0 #0008, 0 0 0 2px #fff4',
      }}
    >
      {/* Neon Scanline/Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 via-fuchsia-400/5 to-blue-400/5 pointer-events-none z-10 mix-blend-lighten" />
      <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none z-20" />
      <div className="absolute -inset-1 bg-pink-400/10 blur-2xl pointer-events-none z-0" />

      {/* Category Icon */}
      <div className="absolute top-2 left-2 opacity-90 z-30 drop-shadow-glow">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg} border-2 border-pink-200/40 shadow-lg`}>
          {icon}
        </div>
      </div>

      {/* Cyberpunk Sparkle/Retro Effect */}
      <div className="absolute top-2 right-2 z-30 flex gap-1 items-center">
        <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse group-hover:animate-spin drop-shadow-glow" />
        <Zap className="w-4 h-4 text-pink-300 animate-pulse group-hover:animate-spin drop-shadow-glow" />
      </div>

      {/* Main Content */}
      <div className="relative z-40 pointer-events-none h-full my-auto flex items-center justify-center text-center w-full">
        <div className="w-full text-base leading-tight drop-shadow-glow flex items-center justify-center text-center px-1" style={{textShadow:'0 2px 8px #f0f8, 0 1px 0 #fff8'}}>
          {piece.text}
        </div>
      </div>

      {/* Pixel Connectors (Visual Enhancement) */}
      <div className="absolute top-0 left-1/4 w-2 h-1 bg-pink-200/40 rounded-b-full shadow-pink-400/30" />
      <div className="absolute top-0 right-1/4 w-2 h-1 bg-pink-200/40 rounded-b-full shadow-pink-400/30" />
      <div className="absolute bottom-0 left-1/4 w-2 h-1 bg-pink-200/40 rounded-t-full shadow-pink-400/30" />
      <div className="absolute bottom-0 right-1/4 w-2 h-1 bg-pink-200/40 rounded-t-full shadow-pink-400/30" />
    </div>
  );
};

/* Arsenal Mobile Horizontal Styles */
// Add this class to your global CSS or tailwind config if not present:
// .arsenal-piece-mobile-horizontal { min-height: 38px !important; height: 38px !important; padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; font-size: 0.95rem !important; }