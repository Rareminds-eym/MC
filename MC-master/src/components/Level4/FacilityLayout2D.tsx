import React from 'react';
import { Factory, Users, FlaskConical, Settings, AlertTriangle, CheckCircle, Microscope, Shield, Thermometer } from 'lucide-react';

interface FacilityLayout2DProps {
  currentPhase: string;
  deviationArea?: 'production' | 'quality' | 'warehouse' | 'lab';
}

export const FacilityLayout2D: React.FC<FacilityLayout2DProps> = ({ 
  currentPhase, 
  deviationArea = 'production' 
}) => {
  const getAreaStatus = (area: string) => {
    if (area === deviationArea) return 'deviation';
    if (currentPhase === 'feedback') return 'resolved';
    return 'normal';
  };

  const getAreaColor = (status: string) => {
    switch (status) {
      case 'deviation': return 'border-red-500 bg-red-50 animate-pulse';
      case 'resolved': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="relative h-full w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Neon Animated SVG Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Floating Triangles, Circles, Squares, Lines, Dots (same as GameBoard2D) */}
          <polygon points="100,50 150,150 50,150" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" className="floating-shape animate-pulse" style={{ transformOrigin: '100px 116px', animation: 'float 8s ease-in-out infinite, rotate 20s linear infinite' }} />
          <polygon points="1700,200 1750,100 1800,200" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '1750px 150px', animation: 'float 6s ease-in-out infinite reverse, rotate 15s linear infinite reverse' }} />
          <polygon points="300,800 250,700 350,700" fill="none" stroke="#00d4ff" strokeWidth="3" filter="url(#strongGlow)" className="floating-shape" style={{ transformOrigin: '300px 750px', animation: 'float 10s ease-in-out infinite, rotate 25s linear infinite' }} />
          <circle cx="800" cy="150" r="40" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ animation: 'float 7s ease-in-out infinite, pulse 3s ease-in-out infinite' }} />
          <circle cx="1500" cy="600" r="25" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ animation: 'float 9s ease-in-out infinite reverse, pulse 4s ease-in-out infinite' }} />
          <circle cx="200" cy="400" r="60" fill="none" stroke="#00d4ff" strokeWidth="3" filter="url(#strongGlow)" className="floating-shape" style={{ animation: 'float 5s ease-in-out infinite, pulse 2s ease-in-out infinite' }} />
          <rect x="1200" y="300" width="80" height="80" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '1240px 340px', animation: 'float 8s ease-in-out infinite, rotate 18s linear infinite' }} />
          <rect x="600" y="700" width="50" height="50" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '625px 725px', animation: 'float 6s ease-in-out infinite reverse, rotate 22s linear infinite reverse' }} />
          <line x1="900" y1="500" x2="1100" y2="600" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '1000px 550px', animation: 'float 7s ease-in-out infinite, rotate 30s linear infinite' }} />
          <line x1="400" y1="200" x2="500" y2="150" stroke="#3b82f6" strokeWidth="3" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '450px 175px', animation: 'float 9s ease-in-out infinite reverse, rotate 25s linear infinite' }} />
          <line x1="1400" y1="800" x2="1600" y2="750" stroke="#00d4ff" strokeWidth="2" filter="url(#strongGlow)" className="floating-shape" style={{ transformOrigin: '1500px 775px', animation: 'float 5s ease-in-out infinite, rotate 35s linear infinite reverse' }} />
          <polygon points="1000,900 1050,950 1000,1000 950,950" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" className="floating-shape" style={{ transformOrigin: '1000px 950px', animation: 'float 8s ease-in-out infinite, rotate 20s linear infinite' }} />
          <circle cx="50" cy="50" r="2" fill="#00d4ff" opacity="0.3" className="animate-pulse"/>
          <circle cx="150" cy="50" r="2" fill="#3b82f6" opacity="0.3" className="animate-pulse" style={{ animationDelay: '1s' }}/>
          <circle cx="250" cy="50" r="2" fill="#00d4ff" opacity="0.3" className="animate-pulse" style={{ animationDelay: '2s' }}/>
          <circle cx="1820" cy="50" r="2" fill="#3b82f6" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.5s' }}/>
          <circle cx="1820" cy="150" r="2" fill="#00d4ff" opacity="0.3" className="animate-pulse" style={{ animationDelay: '1.5s' }}/>
          <circle cx="50" cy="1000" r="2" fill="#3b82f6" opacity="0.3" className="animate-pulse" style={{ animationDelay: '2.5s' }}/>
          <circle cx="150" cy="1000" r="2" fill="#00d4ff" opacity="0.3" className="animate-pulse" style={{ animationDelay: '3s' }}/>
        </svg>
      </div>
      {/* Main content overlay */}
      <div className="bg-white rounded-xl p-6 shadow-lg relative z-10">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Manufacturing Facility Layout</h3>
        
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* Production Area */}
          <div className={`absolute top-4 left-4 w-20 h-16 border-2 rounded-lg flex flex-col items-center justify-center ${getAreaColor(getAreaStatus('production'))}`}>
            <Factory className="w-6 h-6 text-gray-700 mb-1" />
            <span className="text-xs font-semibold">Production</span>
            {deviationArea === 'production' && (
              <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
            )}
          </div>

          {/* Quality Control Lab */}
          <div className={`absolute top-4 right-4 w-20 h-16 border-2 rounded-lg flex flex-col items-center justify-center ${getAreaColor(getAreaStatus('quality'))}`}>
            <FlaskConical className="w-6 h-6 text-gray-700 mb-1" />
            <span className="text-xs font-semibold">QC Lab</span>
            {deviationArea === 'quality' && (
              <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
            )}
          </div>

          {/* Warehouse */}
          <div className={`absolute bottom-4 left-4 w-20 h-16 border-2 rounded-lg flex flex-col items-center justify-center ${getAreaColor(getAreaStatus('warehouse'))}`}>
            <Shield className="w-6 h-6 text-gray-700 mb-1" />
            <span className="text-xs font-semibold">Warehouse</span>
            {deviationArea === 'warehouse' && (
              <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
            )}
          </div>

          {/* Cleanroom/Environmental */}
          <div className={`absolute bottom-4 right-4 w-20 h-16 border-2 rounded-lg flex flex-col items-center justify-center ${getAreaColor(getAreaStatus('lab'))}`}>
            <Thermometer className="w-6 h-6 text-gray-700 mb-1" />
            <span className="text-xs font-semibold">Cleanroom</span>
            {deviationArea === 'lab' && (
              <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
            )}
          </div>

          {/* Central Quality Office */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-blue-500 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
            <Microscope className="w-6 h-6 text-blue-700 mb-1" />
            <span className="text-xs font-semibold text-blue-700">QA</span>
            {currentPhase === 'investigation' && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Personnel */}
          <div className="absolute top-12 left-28 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
            <Users className="w-3 h-3 text-white" />
          </div>
          <div className="absolute bottom-12 right-28 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
            <Users className="w-3 h-3 text-white" />
          </div>

          {/* Equipment */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            <Settings className="w-4 h-4 text-gray-500 animate-spin" />
          </div>

          {/* Flow arrows */}
          <div className="absolute top-12 left-16 w-8 h-0.5 bg-gray-400"></div>
          <div className="absolute top-12 left-23 w-0 h-0 border-l-2 border-l-gray-400 border-t-1 border-t-transparent border-b-1 border-b-transparent"></div>
          
          {/* Status indicator */}
          <div className="absolute top-2 left-2">
            {currentPhase === 'feedback' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : deviationArea ? (
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            ) : (
              <CheckCircle className="w-5 h-5 text-blue-500" />
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-50 border border-red-500 rounded"></div>
            <span>Deviation Area</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></div>
            <span>Investigation Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-50 border border-green-500 rounded"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>
      {/* Custom CSS for floating shapes and neon theme */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .triangle-shape {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        .square-shape {
          border-radius: 2px;
        }
        .floating-shape {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default FacilityLayout2D;
