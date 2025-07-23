import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { modules } from './modulesData';
import ModuleStone from './ModuleStone';
import ModuleDetailModal from './ModuleDetailModal';
import { Module } from './types/GameData';
import { useDeviceLayout } from '../../hooks/useOrientation';
import AnimatedBackground from './AnimatedBackground';


const Score: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isMobile } = useDeviceLayout();

  // Responsive map sizing
  const viewBoxWidth = 1200;
  const viewBoxHeight = 600;
  const scaledViewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

  // Responsive stroke widths
  const strokeWidths = {
    shadow: isMobile ? 65 : 55,
    outer: isMobile ? 58 : 49,
    main: isMobile ? 48 : 41,
    inner: isMobile ? 38 : 32,
    center: isMobile ? 28 : 24,
    dashed: isMobile ? 4 : 3.5
  };

  const handleModuleClick = (module: Module): void => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedModule(null);
  };

  const handleBackToHome = (): void => {
    navigate('/home');
  };

  // Enhanced module positions for better desktop spacing and game roadmap feel
  const modulePositions = [
    { x: 100, y: 480 },   // Module 1 - Start (bottom left)
    { x: 250, y: 430 },   // Module 2 - First ascending curve
    { x: 250, y: 300 },   // Module 3 - Continuing upward
    { x: 190, y: 190 },   // Module 4 - Sharp switchback left
    { x: 350, y: 100 },   // Module 5 - Peak of the mountain
    { x: 450, y: 220 },   // Module 6 - Descending right
    { x: 550, y: 300 },   // Module 7 - Mid-level curve
    { x: 650, y: 200 },   // Module 8 - Lower right section
    { x: 750, y: 290 },   // Module 9 - Dip down
    { x: 900, y: 400 },   // Module 10 - Rising back up
    { x: 980, y: 300 },   // Module 11 - Final ascent
    { x: 1080, y: 200 },  // Module 12 - End destination (top right)
  ];

  // Generate the exact winding path style from the reference image
  const generateContinuousPath = () => {
    let pathString = `M ${modulePositions[0].x} ${modulePositions[0].y}`;

    for (let i = 1; i < modulePositions.length; i++) {
      const current = modulePositions[i];
      const previous = modulePositions[i - 1];

      // Calculate smooth control points for natural S-curves
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Create pronounced curves like the reference - alternating S-pattern
      const curvature = distance * 0.4;
      const perpX = -dy / distance * curvature;
      const perpY = dx / distance * curvature;

      // Alternate curve direction for S-pattern
      const direction = i % 2 === 0 ? 1 : -1;

      const cp1x = previous.x + dx * 0.3 + perpX * direction;
      const cp1y = previous.y + dy * 0.6 + perpY * direction;
      const cp2x = current.x - dx * 0.9 + perpX * direction;
      const cp2y = current.y - dy * 0.9 + perpY * direction;

      pathString += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${current.x} ${current.y}`;
    }

    return pathString;
  };

  const pathData = generateContinuousPath();

  const getPathPositions = () => modulePositions;

  const calculatedPositions = getPathPositions();



  return (
    <AnimatedBackground className="h-screen overflow-hidden game-roadmap-container roadmap-entrance landscape:h-screen">
      {/* Enhanced atmospheric overlay with game-like depth */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(30, 27, 58, 0.2) 50%, rgba(15, 10, 30, 0.3) 100%)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)'
        }}
      />

      {/* Additional atmospheric effects */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {/* Subtle vignette effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.3) 100%)',
          }}
        />

        {/* Dynamic light rays */}
        <div
          className="absolute top-0 left-1/4 w-1 h-full opacity-10 bg-gradient-to-b from-yellow-200 via-transparent to-transparent transform rotate-12"
          style={{
            background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
            filter: 'blur(3px)',
          }}
        />
        <div
          className="absolute top-0 right-1/3 w-1 h-full opacity-8 bg-gradient-to-b from-purple-200 via-transparent to-transparent transform -rotate-6"
          style={{
            background: 'linear-gradient(180deg, rgba(167, 139, 250, 0.2) 0%, transparent 50%)',
            filter: 'blur(4px)',
          }}
        />
      </div>
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <svg
          width={isMobile ? "100%" : "105%"}
          height={isMobile ? "100%" : "105%"}
          viewBox={scaledViewBox}
          className="game-roadmap-svg"
          preserveAspectRatio="xMidYMid meet"
          style={{
            minHeight: isMobile ? '350px' : '900px',
            maxWidth: isMobile ? '100vw' : '100vw',
            maxHeight: isMobile ? '100vh' : '100vh'
          }}
        >
          {/* Enhanced game roadmap background with realistic textures */}
          <defs>
            {/* Realistic mountain stone path texture pattern */}
            <pattern id="stonePattern" patternUnits="userSpaceOnUse" width="45" height="45">
              <rect width="45" height="45" fill="#1E293B" opacity="0.15"/>
              <circle cx="10" cy="8" r="2.5" fill="#475569" opacity="0.2" />
              <circle cx="28" cy="18" r="1.8" fill="#64748B" opacity="0.18" />
              <circle cx="38" cy="28" r="2.2" fill="#334155" opacity="0.16" />
              <circle cx="18" cy="35" r="1.5" fill="#475569" opacity="0.14" />
              <circle cx="35" cy="8" r="1.2" fill="#64748B" opacity="0.12" />
              <ellipse cx="15" cy="22" rx="3" ry="1.5" fill="#1E293B" opacity="0.25" />
              <ellipse cx="32" cy="40" rx="2.5" ry="1.8" fill="#0F172A" opacity="0.2" />
            </pattern>

            {/* Enhanced mountain stone path shadow with multiple layers */}
            <filter id="pathShadow">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.7" />
              <feDropShadow dx="4" dy="8" stdDeviation="6" floodColor="#020617" floodOpacity="0.4" />
              <feDropShadow dx="6" dy="12" stdDeviation="9" floodColor="#000000" floodOpacity="0.2" />
            </filter>

            {/* Magical glow effect for the path */}
            <filter id="magicalGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Realistic stone path gradient - matching mountain environment */}
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="20%" stopColor="#475569" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="80%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Path border gradient - darker mountain stone */}
            <linearGradient id="pathBorderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="30%" stopColor="#0F172A" />
              <stop offset="70%" stopColor="#020617" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>

            {/* Single white energy gradient for center line */}
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
            </linearGradient>
          </defs>

         
          {/* Enhanced realistic game path with multiple layers */}
          {/* Path shadow (deepest layer) - darker mountain shadow */}
          <path
            d={pathData}
            fill="none"
            stroke="#020617"
            strokeWidth={strokeWidths.shadow}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            transform="translate(3, 6)"
            filter="url(#pathShadow)"
          />

          {/* Path outer border (dark stone) */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#pathBorderGradient)"
            strokeWidth={strokeWidths.outer}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="1"
          />

          {/* Path main body (stone texture) */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth={strokeWidths.main}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="1"
          />

          {/* Stone texture overlay */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#stonePattern)"
            strokeWidth={strokeWidths.inner}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />

          {/* Inner path highlight - subtle mountain stone highlight */}
          <path
            d={pathData}
            fill="none"
            stroke="#64748B"
            strokeWidth={strokeWidths.center}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />

          {/* Single animated energy line */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#energyGradient)"
            strokeWidth={strokeWidths.dashed}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="20,25"
            opacity="0.7" 
            filter="url(#magicalGlow)"
            className="path-energy-animation"
          />


          {/* Module stones */}
          {modules.map((module: Module) => (
            <ModuleStone
              key={module.id}
              module={module}
              position={calculatedPositions[module.id - 1]}
              onClick={() => handleModuleClick(module)}
            />
          ))}
        </svg>

        {/* Enhanced Game-Style Back Button */}
        <div className="absolute top-0 left-2 landscape:top-1 landscape:left-3 md:top-6 md:left-6 z-20">
          <button
            onClick={handleBackToHome}
            className="group relative bg-gradient-to-br from-slate-700/80 via-slate-600/70 to-slate-800/80 backdrop-blur-md hover:from-slate-600/90 hover:via-slate-500/80 hover:to-slate-700/90 text-white font-bold py-1 px-2 landscape:py-1.5 landscape:px-3 md:py-3 md:px-6 rounded landscape:rounded-lg md:rounded-xl shadow-lg md:shadow-xl transition-all duration-300 hover:scale-105 md:hover:scale-110 hover:shadow-xl md:hover:shadow-2xl flex items-center space-x-1 landscape:space-x-2 md:space-x-3 border border-slate-500/50 md:border-2 text-xs landscape:text-sm md:text-lg overflow-hidden"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Button content */}
            <div className="relative flex items-center space-x-1 landscape:space-x-2 md:space-x-3">
              <ArrowLeft className="w-3 h-3 md:w-5 md:h-5 drop-shadow-sm" />
              { !isMobile && <span className="hidden sm:inline drop-shadow-sm">Back to Home</span>}
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-yellow-400/60 rounded-tl" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-yellow-400/60 rounded-br" />
          </button>
        </div>


        {/* Enhanced Game-Style Progress Panel */}
        <div
          className="absolute top-1 right-2 landscape:top-2 landscape:right-4 md:top-8 md:right-8 z-10 rounded landscape:rounded-lg md:rounded-xl p-1.5 landscape:p-2 md:p-6 shadow-lg md:shadow-xl border border-slate-500/50 md:border-2 overflow-hidden"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)',
          }}
        >
          {/* Decorative header accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />

          <div className="text-xs landscape:text-sm md:text-lg font-bold text-white mb-1 landscape:mb-1.5 md:mb-3 flex items-center">
            <span className="drop-shadow-sm">Overall Progress</span>
            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {!isMobile &&
            <div className="flex space-x-0.5 landscape:space-x-1 md:space-x-2 mb-1 landscape:mb-1.5 md:mb-3">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`relative w-1.5 h-1.5 landscape:w-2.5 landscape:h-2.5 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    module.status === 'completed'
                      ? 'bg-emerald-500 shadow-sm md:shadow-lg shadow-emerald-200/50' :
                    module.status === 'unlocked'
                      ? 'bg-yellow-500 shadow-sm md:shadow-lg shadow-yellow-200/50 module-pulse-animation' :
                      'bg-slate-400 shadow-sm md:shadow-md'
                  }`}
                  title={`Module ${module.id} - ${module.status}`}
                >
                  {/* Inner glow for completed modules */}
                  {module.status === 'completed' && (
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          }

          <div className="text-xs landscape:text-xs md:text-sm text-white/90 font-medium drop-shadow-sm">
            {modules.filter(m => m.status === 'completed').length} / {modules.length} completed
          </div>

          {/* Enhanced progress bar */}
          <div className="w-full bg-slate-700/60 rounded-full h-0.5 landscape:h-1 md:h-2 mt-1 landscape:mt-1 md:mt-2 border border-slate-600/50 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 h-full rounded-full transition-all duration-500 relative"
              style={{
                width: `${(modules.filter(m => m.status === 'completed').length / modules.length) * 100}%`
              }}
            >
              {/* Progress bar shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-l border-t border-yellow-400/40" />
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-r border-b border-yellow-400/40" />
        </div>
      </div>

      {/* Modal */}
      <ModuleDetailModal
        isOpen={isModalOpen}
        module={selectedModule}
        onClose={closeModal}
      />
    </AnimatedBackground>
  );
};

export default Score;