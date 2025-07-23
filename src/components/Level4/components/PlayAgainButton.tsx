import React from 'react';
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface PlayAgainButtonProps {
  onClick: () => void;
  isMobileHorizontal?: boolean;
}

export const PlayAgainButton: React.FC<PlayAgainButtonProps> = ({
  onClick,
  isMobileHorizontal = false
}) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Button shadow/glow effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur-[6px] opacity-80 -z-10 scale-105${
          isMobileHorizontal ? " blur-[4px]" : ""
        }`} 
        style={{
          transform: "translateY(2px)",
          animation: "pulse-subtle 2.5s infinite ease-in-out",
        }}
      />
      
      {/* Main button */}
      <button
        className={`group relative bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 text-white font-bold rounded-lg 
          flex items-center gap-1 px-3 py-2 overflow-hidden transition-all duration-200 active:translate-y-[2px] 
          shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-4px_0_rgba(0,0,0,0.2),0_4px_0_rgba(100,50,0,0.5),0_0_12px_rgba(234,88,12,0.2)]
          active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.3),0_0px_0_rgba(100,50,0,0.5)] ${
          isMobileHorizontal ? " px-2 py-1.5 text-xs" : " text-sm"
        }`}
        onClick={onClick}
        aria-label="Play Again"
        type="button"
      >
        {/* Shimmering overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,white,transparent_70%)] group-hover:opacity-30"></div>
        
        {/* Button content */}
        <div className="relative flex items-center gap-1 z-10">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full bg-white/30 blur-[3px] scale-125 animate-pulse-slow opacity-0 group-hover:opacity-80`}></div>
            <Icon
              icon="mdi:refresh"
              className={`w-5 h-5 drop-shadow-glow${isMobileHorizontal ? " w-4 h-4" : ""}`}
            />
          </div>
          <span className="whitespace-nowrap">Play Again</span>
        </div>
        
        {/* Particle effects - only shown on hover */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-white opacity-0 group-hover:animate-particle-float"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: "100%",
                animationDelay: `${Math.random() * 1.5}s`
              }}
            ></div>
          ))}
        </div>
      </button>
    </motion.div>
  );
};
