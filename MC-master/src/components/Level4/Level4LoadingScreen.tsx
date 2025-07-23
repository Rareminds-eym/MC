import React, { useEffect, useState } from "react";
import { useDeviceLayout } from "../../hooks/useOrientation";
import Animation_manufacture from './animated_manufacture';

interface Level4LoadingScreenProps {
  onComplete?: () => void;
}

const Level4LoadingScreen: React.FC<Level4LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const { isMobile, isHorizontal } = useDeviceLayout();
  
  // GMP tips to display during loading
  const gmpTips = [
    "GMP ensures products are consistently produced according to quality standards",
    "Document everything: If it's not written down, it didn't happen",
    "Risk assessment is a critical part of GMP compliance",
    "Cross-contamination prevention is essential in manufacturing facilities",
    "Proper personnel training is fundamental to GMP compliance",
    "Quality cannot be tested into a product, it must be built in",
    "Always follow established SOPs to maintain consistency",
    "Equipment validation ensures reliable manufacturing processes",
    "Change control procedures protect product quality",
    "Root cause analysis helps prevent recurrence of deviations"
  ];
  
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      // Progress loading effect
      const timer = setTimeout(() => setProgress(progress + 2 + Math.random() * 3), 320);
      return () => clearTimeout(timer);
    } else {
      // Complete loading
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  // Cycle through GMP tips every 3 seconds
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % gmpTips.length);
    }, 3000);
    
    return () => clearInterval(tipTimer);
  }, []);

  // Prevent scrolling when loading screen is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className={
      `fixed inset-0 w-full h-full min-h-screen min-w-full flex items-center justify-center pixel-perfect bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 overflow-hidden`
    } style={{ position: 'relative' }}>
      {/* Animated manufacturing background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        <Animation_manufacture />
      </div>
      {/* Cosmic overlay for extra depth, matching Level2 cosmic theme */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-transparent opacity-50 pixel-glow" />
      {/* Main loading container */}
      <div
        className={`z-20 pixel-border-thick bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 shadow-xl flex flex-col justify-center items-center border-2 border-cyan-400/40 mb-[16px] backdrop-blur-md ${isMobile ? 'p-2' : 'p-8'} ${isMobile ? 'w-[440px] max-w-[440px] min-w-[220px]' : 'w-[440px] max-w-[440px] min-w-[320px]'} rounded-2xl pixel-perfect`}
        style={{
          backgroundColor: 'rgba(22, 79, 95, 0.72)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.4)',
          borderRadius: '1.5rem',
          height: isMobile ? 'auto' : '320px',
          maxHeight: isMobile ? '90vh' : 'none',
          overflowY: isMobile ? 'auto' : 'visible',
          position: 'relative',
        }}
      >
        <style>
          {`
          .gmp-loader {
            width: 36px;
            height: 36px;
            border: 4px solid #FFF;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: gmp-rotation 1s linear infinite;
          }
          @media (min-width: 640px) {
            .gmp-loader {
              width: 48px;
              height: 48px;
              border-width: 5px;
            }
          }
          @keyframes gmp-rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          .tip-text {
            animation: fadeInOut 3s ease-in-out infinite;
          }
          .pixel-perfect {
            font-family: 'Press Start 2P', 'VT323', 'Fira Mono', 'monospace', 'sans-serif';
            letter-spacing: 0.01em;
          }
          `}
        </style>
        {/* GMP loading header */}
        <div className="text-center mb-2 w-full">
          <h2 className="text-white font-bold mb-1 w-full text-center " style={{fontSize: isMobile ? '1.15rem' : '1.6rem', letterSpacing: '0.01em'}}>
            GMP Inspector Simulator
          </h2>
          <h3 className="text-blue-200 w-full text-center " style={{fontSize: isMobile ? '1.05rem' : '1.18rem'}}>
            Level 4: Risk Assessment
          </h3>
        </div>
        {/* Loading animation */}
        <div className="flex flex-col items-center justify-center mb-4">
          <span className="gmp-loader mb-2" />
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200/20 rounded-full h-2 mb-3">
          <div
            className="bg-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, height: '100%' }}
          />
        </div>
        {/* Loading status */}
        <div className="text-white mb-2 w-full text-center pixel-perfect" style={{fontSize: isMobile ? '0.9rem' : '1.05rem'}}>
          Loading GMP scenarios... {Math.min(Math.floor(progress), 100)}%
        </div>
        {/* GMP tips */}
        <div className="mt-1 text-center px-1 w-full">
          <p className="text-blue-100 italic tip-text w-full text-center pixel-perfect" style={{fontSize: isMobile ? '0.85rem' : '1.05rem'}}>
            Tip: {gmpTips[currentTip]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Level4LoadingScreen;
