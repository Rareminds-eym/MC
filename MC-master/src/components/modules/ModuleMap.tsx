import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Module } from "../../types/module";
import ModuleNode from "./ModuleNode";
import CharacterSprite from "./CharacterSprite";
import { useDeviceLayout } from '../../hooks/useOrientation';
import { useNavigate } from 'react-router-dom';

interface ModuleMapProps {
  modules: Module[];
  currentModuleId: number;
  onModuleSelect: (id: number) => void;
}

const ModuleMap: React.FC<ModuleMapProps> = ({
  modules,
  currentModuleId,
  onModuleSelect,
}) => {
  const { isMobile, isHorizontal } = useDeviceLayout();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  // Responsive platform size
  const [PLATFORM_WIDTH, setPlatformWidth] = useState(180);
  const [PLATFORM_SPACING, setPlatformSpacing] = useState(120);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setPlatformWidth(50);
        setPlatformSpacing(15);
      } else {
        setPlatformWidth(180);
        setPlatformSpacing(120);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get container height for SVG and module alignment
  const [containerHeight, setContainerHeight] = useState(400);
  const moduleMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (moduleMapRef.current) {
        setContainerHeight(moduleMapRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = PLATFORM_WIDTH + PLATFORM_SPACING;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll to current module
  useEffect(() => {
    if (scrollContainerRef.current) {
      const targetX =
        (currentModuleId - 1) * (PLATFORM_WIDTH + PLATFORM_SPACING);
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollTo = Math.max(
        0,
        targetX - containerWidth / 2 + PLATFORM_WIDTH / 2
      );

      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  }, [currentModuleId]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setDragStart({
      x: e.pageX - scrollContainerRef.current.offsetLeft,
      scrollLeft: scrollContainerRef.current.scrollLeft,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - dragStart.x) * 2;
    scrollContainerRef.current.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;

    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.pageX - scrollContainerRef.current.offsetLeft,
      scrollLeft: scrollContainerRef.current.scrollLeft,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const touch = e.touches[0];
    const x = touch.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - dragStart.x) * 1.5;
    scrollContainerRef.current.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const totalWidth =
    modules.length * (PLATFORM_WIDTH + PLATFORM_SPACING) + PLATFORM_SPACING;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Gamified Back Button */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 z-40 bg-[#5f00b6] text-white font-bold text-[1.1rem] tracking-wide rounded-full shadow-lg px-4 py-2 flex items-center justify-center outline-none transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{
          boxShadow: "0 0 12px 2px #a78bfa, 0 1px 4px rgba(95,0,182,0.10)",
          textShadow: "0 2px 8px #a78bfa, 0 2px 8px #0004",
          animation: "glow 2s infinite alternate",
          fontFamily: "inherit"
        }}
        onMouseDown={e => (e.currentTarget.style.transform = "scale(0.96)")}
        onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        onMouseOver={e => {
          e.currentTarget.style.background = "#7c3aed";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = "#5f00b6";
          e.currentTarget.style.color = "#fff";
        }}
        aria-label="Back to Home"
      >
        {/* Gamified back pixel arrow icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="block">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="#a78bfa" opacity="0.18" />
          <path d="M14 7l-5 5 5 5" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="7" y="11" width="7" height="2" rx="1" fill="#fff" opacity="0.7" />
        </svg>
        Back
      </button>
      {/* Space background with large planet */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800"
      >
        {/* Large planet in background */}
        <div
          className="absolute rounded-full opacity-30 blur-md bg-gradient-to-br from-cyan-400 to-blue-600"
          style={{
            width: "24rem",
            height: "24rem",
            right: "10%",
            top: "20%",
            transform: "translate(50%, -50%)",
          }}
        />
        {/* Smaller celestial bodies */}
        <div
          className="absolute rounded-full opacity-40 bg-gradient-to-br from-purple-400 to-pink-500"
          style={{
            width: "8rem",
            height: "8rem",
            left: "15%",
            top: "15%",
          }}
        />
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: 1,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>
        {/* Floating space particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-300 rounded-full opacity-60"
              style={{
                width: "4px",
                height: "4px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 15 + 15}s infinite linear`,
                animationDelay: `${Math.random() * 15}s`,
              }}
            />
          ))}
        </div>
      </div>
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div
        className="mt-5"
        style={{
          textAlign: 'center',
          width: '100%',
          marginBottom: '30px',
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 2px 8px #0008',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}>
            GMP Training Modules
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#67e8f9',
            textShadow: '0 1px 4px #0006',
            textAlign: 'center',
          }}>
            Navigate through the cosmic training journey
          </p>
        </div>
        {/* Module map container */}
        <div className="flex-1 relative flex items-center">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 border border-white/30 rounded-full p-3 backdrop-blur-sm transition-colors duration-200 cursor-pointer hover:bg-white/30"
            >
              <ChevronLeft size={24} color="#fff" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 border border-white/30 rounded-full p-3 backdrop-blur-sm transition-colors duration-200 cursor-pointer hover:bg-white/30"
            >
              <ChevronRight size={24} color="#fff" />
            </button>
          )}
          {/* Scrollable modules container */}
          <div
            ref={scrollContainerRef}
            className={`w-full h-full overflow-x-auto overflow-y-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} touch-pan-x scrollbar-hide`}
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={moduleMapRef}
              className="relative h-full flex items-center"
              style={{
                width: `${totalWidth}px`,
                minWidth: "100%",
                paddingLeft: `${PLATFORM_SPACING}px`,
                paddingRight: `${PLATFORM_SPACING}px`,
              }}
            >
              {/* Character sprite: only one, always above the first available module */}
              {(() => {
                // Find the last available module
                const reversedIndex = [...modules].reverse().findIndex(
                  (m) => m.status === "available"
                );
                const lastAvailableIndex = reversedIndex === -1 ? -1 : modules.length - 1 - reversedIndex;
                if (lastAvailableIndex === -1) return null;
                // Hide sprite in mobile horizontal
                if (isMobile && isHorizontal) return null;
                // Placement logic
                let zigzagOffset = lastAvailableIndex % 2 === 0 ? -60 : 60;
                let spriteTop, spriteLeft, spriteScale;
                spriteTop = `calc(50% + ${zigzagOffset - 10}px)`;
                spriteLeft = `${120}px`;
                spriteScale = 1;
                return (
                  <div
                    style={{
                      position: "absolute",
                      left: spriteLeft,
                      top: spriteTop,
                      transform: `translateX(-50%) scale(${spriteScale})`,
                      transformOrigin: 'top left',
                      zIndex: 20,
                      pointerEvents: "none",
                    }}
                  >
                    <CharacterSprite
                      key={modules[lastAvailableIndex].id}
                      moduleId={modules[lastAvailableIndex].id}
                      platformWidth={PLATFORM_WIDTH}
                      platformSpacing={PLATFORM_SPACING}
                    />
                  </div>
                );
              })()}
              {/* Module nodes */}
              {modules.map((module, index) => {
                // Use isMobile and isHorizontal from useDeviceLayout
                const mobileYOffset = isMobile && isHorizontal ? 0 : 20;
                const nodeTop = isMobile
                  ? `calc(50% + ${mobileYOffset}px)`
                  : `calc(50% + ${index % 2 === 0 ? "-60" : "60"}px)`;
                const nodeWidth = isMobile ? '40px' : `${PLATFORM_WIDTH}px`;
                const nodeHeight = isMobile ? 40 : undefined;
                return (
                  <div
                    key={module.id}
                    className="absolute flex items-center justify-center z-20"
                    style={{
                      transform: "translateY(-50%)",
                      left: `${PLATFORM_SPACING + index * (PLATFORM_WIDTH + PLATFORM_SPACING)}px`,
                      top: nodeTop,
                      width: nodeWidth,
                      height: nodeHeight,
                      minWidth: nodeWidth,
                      minHeight: nodeHeight,
                      maxWidth: nodeWidth,
                      maxHeight: nodeHeight,
                      pointerEvents: 'auto',
                    }}
                  >
                    <ModuleNode
                      module={module}
                      onSelect={(id) => navigate(`/modules/${id}`)}
                      isCurrentModule={module.id === currentModuleId}
                    />
                  </div>
                );
              })}
              {/* Dotted curvy lines between modules (single SVG for all lines) */}
              <svg
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "none",
                  width: "100%",
                  height: containerHeight,
                  zIndex: 0,
                }}
                width={totalWidth}
                height={containerHeight}
              >
                {modules.map((_, index) => {
                  if (index === modules.length - 1) return null;
                  // Center of each node
                  let x1 =
                    PLATFORM_SPACING +
                    index * (PLATFORM_WIDTH + PLATFORM_SPACING) +
                    PLATFORM_WIDTH / 2;
                  let x2 =
                    PLATFORM_SPACING +
                    (index + 1) * (PLATFORM_WIDTH + PLATFORM_SPACING) +
                    PLATFORM_WIDTH / 2;
                  // Move lines left in mobile horizontal
                  if (isMobile && isHorizontal) {
                    x1 -= 50;
                    x2 -= 50;
                  }
                  // Both nodes are vertically centered at containerHeight / 2
                  const y1 = containerHeight / 2;
                  const y2 = containerHeight / 2;
                  // For desktop, add zigzag to y1/y2
                  let y1Final = y1, y2Final = y2;
                  if (!isMobile) {
                    const yOffset1 = index % 2 === 0 ? -60 : 60;
                    const yOffset2 = (index + 1) % 2 === 0 ? -60 : 60;
                    y1Final = y1 + yOffset1;
                    y2Final = y2 + yOffset2;
                  }
                  // Control point
                  const cx = x1 + (x2 - x1) / 2;
                  const cy = isMobile
                    ? y1 // straight line for mobile
                    : (y1Final + y2Final) / 2 + ((y1Final < y2Final) ? 40 : -40);
                  return (
                    <path
                      key={`curve-${index}`}
                      d={`M ${x1},${y1Final} C ${cx},${cy} ${cx},${cy} ${x2},${y2Final}`}
                      fill="none"
                      stroke="#fff"
                      strokeDasharray="8,8"
                      strokeWidth={3}
                      opacity={0.5}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float {
          from {
            transform: translateY(100vh) rotate(0deg);
          }
          to {
            transform: translateY(-100px) rotate(360deg);
          }
        }
        @keyframes glow {
          from {
            box-shadow: 0 0 8px #a78bfa, 0 0 4px #7c3aed, 0 1px 4px rgba(95,0,182,0.10);
          }
          to {
            box-shadow: 0 0 16px #7c3aed, 0 0 12px #a78bfa, 0 1px 4px rgba(95,0,182,0.10);
          }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ModuleMap;
