import React from 'react';

interface GameInterfaceHUDProps {
  caseLabel: string;
  timer: string;
  score: number;
  show?: boolean;
}

const GameInterfaceHUD: React.FC<GameInterfaceHUDProps> = ({ caseLabel, timer, score, show = true }) => {
  if (!show) return null;
  return (
    <div className="absolute top-16 left-4 rounded-lg px-2 py-0.5 font-bold text-cyan-400 z-50 sm:top-16 sm:left-4 flex flex-col items-start bg-black/30 backdrop-blur-md border border-cyan-400/30 shadow-lg">
      <span className="text-cyan-300 font-bold text-[9px] sm:text-xs md:text-base mb-1">{caseLabel}</span>
      <span className="text-[9px] sm:text-xs md:text-base">Time : {timer}</span>
      <span className="text-green-400 font-bold mt-1 text-[9px] sm:text-xs md:text-base">Score : {score}</span>
    </div>
  );
};

export default GameInterfaceHUD;
