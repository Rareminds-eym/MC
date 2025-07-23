import React from 'react';
import CanvasParticles from './CanvasParticles';

interface AnimatedBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = "",
  children
}) => {
  

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Enhanced background gradient with more depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-950 z-0" />

      {/* Secondary gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-800/20 via-transparent to-indigo-900/30 z-0" />

      {/* Mountain silhouettes - back layer */}
      <div
        className="absolute inset-0 z-1 opacity-60"
        style={{
          backgroundImage: `url('/assets/backgrounds/mountain-silhouette.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Canvas-based particle effects */}
      <CanvasParticles particleCount={50} className="z-6" />

    
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
