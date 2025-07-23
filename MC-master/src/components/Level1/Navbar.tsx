import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, HelpCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDeviceLayout } from '../../hooks/useOrientation';

interface NavbarProps {
  score: number;
  rowsSolved: number;
  onBackClick: () => void;
  onHomeClick: () => void;
  onResetTutorial: () => void;
  timer: number;
  onPlayAgain?: () => void;
  tutorialStep?: number;
}

const Navbar: React.FC<NavbarProps> = ({ score, rowsSolved, onBackClick, onHomeClick, onResetTutorial, timer, onPlayAgain, tutorialStep }) => {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const { user } = useAuth();
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileLandscape = isMobile && isHorizontal;
  const avatar = localStorage.getItem("selectedAvatar") || "/characters/Intern1.png";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTutorialClick = () => {
    onResetTutorial();
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email ||
    "Player";

  useEffect(() => {
    if (tutorialStep === 4) setHoveredBtn('tutorial');
    if (tutorialStep === 5) setHoveredBtn(null);
  }, [tutorialStep]);

  // Pixel/Panel UI
  return (
    <nav className={`relative z-50 w-full ${isMobile ? 'px-4' : 'px-2 py-2'} bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 pixel-border-thick shadow-lg`}
      style={{ minHeight: isMobileLandscape ? 38 : isMobile ? 44 : 56 }}
    >
      <div className={`flex items-center justify-between w-full max-w-7xl mx-auto ${isMobileLandscape ? 'gap-1' : 'gap-8'}`}>
        {/* Left: Back, Home, Restart, Tutorial */}
        <div className={`flex items-center ${isMobileLandscape ? 'gap-3' : 'gap-4'}`}>
          <button
            data-tutorial="navbar-exit"
            onClick={() => {
              if (onBackClick) onBackClick();
              window.history.back();
            }}
            className="pixel-border bg-red-700 hover:bg-red-600 text-white px-2 py-1 flex items-center gap-1 font-bold pixel-text transition-all duration-200 text-xs sm:text-sm"
            onMouseOver={() => setHoveredBtn('back')}
            onMouseOut={() => setHoveredBtn(null)}
            style={{
              background: hoveredBtn === 'back' ? '#ef4444' : undefined,
              color: hoveredBtn === 'back' ? '#fff' : undefined,
              transform: hoveredBtn === 'back' ? 'scale(1.08)' : undefined
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            {!isMobileLandscape && <span className="hidden sm:inline">EXIT</span>}
          </button>
          <button
            data-tutorial="navbar-home"
            onClick={() => {
              if (onHomeClick) onHomeClick();
              window.location.href = '/';
            }}
            className="pixel-border bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 flex items-center gap-1 font-bold pixel-text transition-all duration-200 text-xs sm:text-sm"
            onMouseOver={() => setHoveredBtn('home')}
            onMouseOut={() => setHoveredBtn(null)}
            style={{
              background: hoveredBtn === 'home' ? '#2563eb' : undefined,
              color: hoveredBtn === 'home' ? '#fff' : undefined,
              transform: hoveredBtn === 'home' ? 'scale(1.08)' : undefined
            }}
          >
            <Home className="w-4 h-4" />
            {!isMobileLandscape && <span className="hidden sm:inline">HOME</span>}
          </button>
          <button
            data-tutorial="navbar-tutorial"
            onClick={handleTutorialClick}
            className="pixel-border bg-green-700 hover:bg-green-600 text-white px-2 py-1 flex items-center gap-1 font-bold pixel-text transition-all duration-200 text-xs sm:text-sm"
            onMouseOver={() => setHoveredBtn('tutorial')}
            onMouseOut={() => setHoveredBtn(null)}
            style={{
              background: hoveredBtn === 'tutorial' ? '#22c55e' : undefined,
              color: hoveredBtn === 'tutorial' ? '#fff' : undefined,
              transform: hoveredBtn === 'tutorial' ? 'scale(1.08)' : undefined
            }}
          >
            <HelpCircle className="w-4 h-4" />
            {!isMobileLandscape && <span className="hidden sm:inline">TUTORIAL</span>}
          </button>
        </div>

        {/* Center: Title (gmp bINGO) */}
        <div className="flex-1 flex justify-center">
          <div className={`pixel-border bg-gradient-to-r from-blue-400 to-blue-700 ${isMobileLandscape ? 'ml-28 px-3 py-0.5 text-xs' : 'px-4 py-1 text-xs sm:text-base'} rounded text-white font-black shadow-md pixel-text uppercase tracking-widest`}>
            gmp bINGO
          </div>
        </div>

        {/* Center: Stats (landscape: right-aligned, else centered) */}
        <div className={`flex-1 flex flex-col items-center justify-center ${isMobileLandscape ? 'hidden' : ''}`}> {/* Hide stats in mobile landscape */}
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex-1 flex justify-end">
              <div className={`flex items-center gap-4${tutorialStep === 4 ? ' tutorial-highlight-navbar-stats' : ''}`}> {/* Highlight for tutorial step 4 */}
                <div className="pixel-border bg-blue-900 px-2 py-1 flex flex-col items-center text-xs sm:text-sm">
                  <span className="text-blue-300 font-bold pixel-text">TIME</span>
                  <span className="text-white font-black pixel-text">{formatTime(timer)}</span>
                </div>
                <div className="pixel-border bg-green-900 px-2 py-1 flex flex-col items-center text-xs sm:text-sm">
                  <span className="text-green-300 font-bold pixel-text">ROWS</span>
                  <span className="text-green-400 font-black pixel-text">{rowsSolved}</span>
                </div>
                <div className="pixel-border bg-yellow-700 px-2 py-1 flex flex-col items-center text-xs sm:text-sm">
                  <span className="text-yellow-200 font-bold pixel-text">SCORE</span>
                  <span className="text-yellow-400 font-black pixel-text">{score}</span>
                </div>
              </div>
            </div>
            <div className="flex-1" />
          </div>
        </div>
        {/* Stats for mobile landscape: show compact row of icons+values */}
        {isMobileLandscape && (
          <div className={`flex flex-1 items-center justify-end gap-2${tutorialStep === 4 ? ' tutorial-highlight-navbar-stats' : ''}`}> {/* Highlight for tutorial step 4 on mobile */}
            <div className="pixel-border bg-blue-900 px-1 py-0.5 flex items-center text-[10px] font-bold pixel-text">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-300 mr-1"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {formatTime(timer)}
            </div>
            <div className="pixel-border bg-green-900 px-1 py-0.5 flex items-center text-[10px] font-bold pixel-text">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-300 mr-1"><rect x="4" y="10" width="16" height="4" rx="1" strokeWidth="2"/><rect x="4" y="4" width="16" height="4" rx="1" strokeWidth="2"/><rect x="4" y="16" width="16" height="4" rx="1" strokeWidth="2"/></svg>
              {rowsSolved}
            </div>
            <div className="pixel-border bg-yellow-700 px-1 py-0.5 flex items-center text-[10px] font-bold pixel-text">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-200 mr-1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" strokeWidth="2"/></svg>
              {score}
            </div>
          </div>
        )}

        {/* Right: Avatar & Name */}
        <div className={`flex items-center ${isMobileLandscape ? 'gap-3' : 'gap-4'}`}>
          <img
            src={avatar}
            alt="Player Avatar"
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-green-400 shadow-lg object-cover pixel-border`}
          />
          <span className={`text-white font-bold pixel-text ${isMobileLandscape ? 'text-xs' : 'text-xs sm:text-base'} hidden sm:inline`}>{displayName}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;