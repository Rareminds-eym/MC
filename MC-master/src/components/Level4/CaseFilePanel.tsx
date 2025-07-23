import React from 'react';
import { FileText, AlertTriangle, Calendar, Clipboard, Beaker, Clock } from 'lucide-react';
import { Case } from '../types';

interface CaseFilePanelProps {
  case: Case;
}

export const CaseFilePanel: React.FC<CaseFilePanelProps> = ({ case: currentCase }) => {
  return (
    <div className="relative h-full w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Neon Animated SVG Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none ">
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
      <div className="relative z-10">
        {/* Header with animated alert */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 border-b-4 border-red-800 px-6 py-5">
          <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20l10-10v20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`}></div>
          
          <div className="relative flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                <AlertTriangle className="relative w-8 h-8 text-yellow-300 animate-bounce" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Clipboard className="w-5 h-5" />
                <span>DEVIATION REPORT</span>
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-900/50 text-red-100 border border-red-400">
                  🚨 PRIORITY: HIGH
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-900/50 text-amber-100 border border-amber-400">
                  📋 INVESTIGATION REQUIRED
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Case Header */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Case #{currentCase.id.toString().padStart(3, '0')}:
                </span>
                <span>{currentCase.title}</span>
              </h3>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Reported: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Status: Under Investigation</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                  <Beaker className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">QA Review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Description */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl p-6 border-l-4 border-blue-500 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Incident Description</h4>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-800 leading-relaxed font-medium">{currentCase.scenario}</p>
              </div>
            </div>
          </div>

          {/* Investigation Alert */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl transform -rotate-1"></div>
            <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-300 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-amber-900 mb-2 flex items-center space-x-2">
                    <span>🔍 Investigation Protocol Activated</span>
                  </h5>
                  <p className="text-amber-800 font-medium">
                    Please analyze this deviation systematically using the investigation panel. 
                    Follow the 3-step process to identify violations, determine root causes, and assess impacts.
                  </p>
                </div>
              </div>
            </div>
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

export default CaseFilePanel;