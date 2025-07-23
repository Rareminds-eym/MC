import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameModesByModule, getGameModesGroupedByType } from './data/gameModes';
import { useDeviceLayout } from '../../hooks/useOrientation';
import { useLevel2GameStats } from './hooks/useLevel2GameStats';
import { useCompletedGameModes } from './hooks/useCompletedGameModes';
import { RotateDeviceOverlay } from '../RotateDeviceOverlay';
import { Play, Crown,Gamepad, Gamepad2, ArrowLeft, Database, HardDrive, Target, CheckCircle } from 'lucide-react';
import './index.css';

interface HomePageProps {
  moduleId?: string;
  onGameModeSelect?: (modeId: string) => void;
  onExit?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ moduleId = '1', onExit }) => {
  const navigate = useNavigate();
  const { isMobile } = useDeviceLayout();

  // Get filtered game modes based on current module
  const filteredGameModes = getGameModesByModule(parseInt(moduleId));

  // Group games by type to show summary
  const gamesByType = getGameModesGroupedByType(parseInt(moduleId));
  const gameTypes = Object.keys(gamesByType).map(type => ({
    type: parseInt(type),
    title: gamesByType[parseInt(type)][0]?.title.replace(/🧩|📂|📋|🔍|🧼/g, '').trim() || `Type ${type}`,
    gameModes: gamesByType[parseInt(type)] // Include game modes for completion checking
  }));

  // Use the first available game mode for stats, or fallback to default
  const defaultGameModeId = filteredGameModes.length > 0 ? filteredGameModes[0].id : 'gmp-vs-non-gmp';
  const { stats: gameStats, loading: statsLoading, error: statsError } = useLevel2GameStats(moduleId, defaultGameModeId);

  // Get completed game modes for visual indicators
  const { isGameModeCompleted } = useCompletedGameModes({ moduleId });

  // Show overlay if on mobile and not in landscape mode (landscape only)
  if (isMobile && window.innerHeight > window.innerWidth) {
    return <RotateDeviceOverlay />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 bg-[url('/Level2/level3bg.webp')] bg-cover bg-center bg-no-repeat relative overflow-hidden pixel-perfect ${
      isMobile ? 'p-0' : 'p-6'
    }`}>
      {/* Gamified Overlay - Fixed z-index and pointer events */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-transparent opacity-80 pixel-glow pointer-events-none"
      ></div>

      {/* Animated Grid Background - Fixed pointer events */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="grid-pattern"></div>
      </div>

      {/* Floating Pixel Particles - Fixed z-index and pointer events */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(isMobile ? 8 : 15)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${isMobile ? 'w-1 h-1' : 'w-2 h-2'} bg-cyan-400 pixel-particle animate-float pointer-events-none`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className={`relative z-20 ${
        isMobile
          ? 'max-w-4xl mx-auto h-screen flex flex-col px-4' // Mobile landscape layout
          : 'max-w-6xl mx-auto'
      }`}>
        {/* Mobile Layout - Landscape Only */}
        {isMobile ? (
          <div className="h-full flex flex-col py-2">
            {/* Top Bar for Mobile */}
            <div className="flex items-center justify-between w-full px-0 py-1">
              {/* EXIT Button - Left Side */}
              <button
                onClick={() => onExit ? onExit() : navigate(`/modules/${moduleId}`)}
                className="bg-red-500 hover:bg-red-600 text-red-100 px-2 py-2 pixel-border flex items-center space-x-1 font-bold shadow-lg transition-all duration-200 text-xs z-10 hover:shadow-xl border-2"
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>EXIT</span>
              </button>

              {/* GMP QUEST - Center */}
              <div className="flex-1 flex justify-center">
                <div className="pixel-border-thick bg-gradient-to-r from-purple-500 to-indigo-600 p-2 relative">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-300 pixel-border border-[2px] flex items-center justify-center">
                      <Crown className="w-4 h-4 text-purple-800" />
                    </div>
                    <div className="text-center">
                      <h1 className="text-sm font-black text-purple-100 pixel-text tracking-wider">
                        GMP QUEST
                      </h1>
                      <div className="text-purple-200 text-xs font-bold tracking-widest">
                        CLASSIFICATION ADVENTURE
                      </div>
                    </div>
                    <div className="w-6 h-6 border-[2px] bg-indigo-300 pixel-border flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4 text-indigo-800" />
                    </div>
                  </div>
                </div>
              </div>

              {/* LVL and SCORE - Right Side */}
              <div className="flex space-x-2">
                <div className="pixel-border border-[2px] bg-green-500/70 px-2 py-1">
                  <div className="text-green-200 text-xs font-bold">LVL</div>
                  <div className="text-green-100 text-xs font-black">02</div>
                </div>
                <div className="pixel-border border-[2px] bg-blue-500 px-2 py-1 relative group">
                  <div className="text-blue-200 text-xs font-bold flex items-center">
                    SCORE
                    {statsError ? (
                      <HardDrive className="w-2 h-2 ml-1 text-yellow-300" />
                    ) : (
                      <Database className="w-2 h-2 ml-1 text-green-300" />
                    )}
                  </div>
                  <div className="text-blue-100 text-xs font-black">
                    {statsLoading ? '----' : gameStats.highScore.toString().padStart(4, '0')}
                  </div>
                  {/* Tooltip */}
                  {statsError && (
                    <div className="absolute bottom-full right-0 mb-1 bg-gray-800 text-white text-xs px-2 py-1 pixel-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Using local data
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area - Game Types Summary */}
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full max-w-3xl">
                {/* Game Types Summary Card */}
                <div className="group relative transform transition-all duration-300">
                  <div className="pixel-border-thick bg-gray-800 p-3 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-0"></div>
                    <div className="absolute top-0 rotate-90 -right-0 w-8 h-8 bg-cyan-500 opacity-30 pixel-corner"></div>

                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-600 pixel-border flex items-center border-[2px] justify-center">
                        <Gamepad2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-teal-300 pixel-text tracking-wide">
                          GAME TYPES AVAILABLE
                        </h3>
                        <p className="text-white text-xs">
                          {gameTypes.length} different types of sorting challenges
                        </p>
                      </div>
                    </div>

                    {/* Game Types List */}
                    <div className="grid grid-cols-2 gap-2">
                      {gameTypes.map((gameType) => {
                        // Check if any game mode in this type is completed
                        const isTypeCompleted = gameType.gameModes.some(gameMode => isGameModeCompleted(gameMode.id));

                        return (
                          <div
                            key={gameType.type}
                            className={`flex items-center justify-start p-2 pixel-border border-[2px] ${
                              isTypeCompleted ? 'bg-green-300' : 'bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {isTypeCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-800" />
                              ) : (
                                <Gamepad className="w-4 h-4 text-emerald-300" />
                              )}
                              <div className={`font-bold text-[10px] ${
                                isTypeCompleted ? 'text-green-800' : 'text-white'
                              }`}>
                                {gameType.title}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Navigation Button - Fixed z-index and pointer events */}
                    <button
                      onClick={() => navigate(`/modules/${moduleId}/games`)}
                      className="w-full mt-4 pixel-border-thick bg-gradient-to-r from-emerald-500 to-teal-600  p-2 hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 cursor-pointer relative z-30 pointer-events-auto"
                    >
                      <div className="flex items-center justify-center text-emerald-100 font-black text-sm pixel-text">
                        <Play className="w-4 h-4 mr-2" />
                        Play Game
                      </div>
                    </button>

                    {/* Scan Lines Effect */}
                    <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none z-10"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Desktop Layout - Updated */
          <>
            {/* EXIT Button - Desktop */}
            <div className="absolute top-6 left-6 z-20 ">
              <button
                onClick={() => onExit ? onExit() : navigate(`/modules/${moduleId}`)}
                className="pixel-border  bg-red-700 hover:bg-red-600 text-red-300 hover:text-white py-2 px-4 font-bold pixel-text transition-all duration-200 "
              >
                <div className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">EXIT</span>
                </div>
              </button>
            </div>

            {/* Retro Game Header */}
            <div className="text-center mb-12 pt-8">
              {/* Game Logo with Pixel Border */}
              <div className="inline-block relative mb-6">
                <div className="pixel-border-thick bg-gradient-to-r from-yellow-400 to-orange-500 p-4 relative">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-yellow-300 pixel-border flex items-center justify-center">
                      <Crown className="w-8 h-8 text-yellow-800" />
                    </div>
                    <div className="text-left">
                      <h1 className="text-4xl font-black text-white pixel-text tracking-wider">
                        GMP QUEST
                      </h1>
                      <div className="text-yellow-200 text-sm font-bold tracking-widest">
                        CLASSIFICATION ADVENTURE
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-orange-300 pixel-border flex items-center justify-center">
                      <Gamepad2 className="w-8 h-8 text-orange-800" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Stats HUD - Updated with stored scores */}
              <div className="flex justify-center space-x-4 ">
                <div className="pixel-border bg-green-600 px-4 py-2">
                  <div className="text-green-100 text-xs font-bold">LEVEL</div>
                  <div className="text-white text-lg font-black">02</div>
                </div>
                <div className="pixel-border bg-blue-600 px-4 py-2 relative group">
                  <div className="text-blue-100 text-xs font-bold flex items-center justify-center">
                    SCORE
                    {statsError ? (
                      <HardDrive className="w-3 h-3 ml-1 text-yellow-300" />
                    ) : (
                      <Database className="w-3 h-3 ml-1 text-green-300" />
                    )}
                  </div>
                  <div className="text-white text-lg font-black">
                    {statsLoading ? '----' : gameStats.highScore.toString().padStart(4, '0')}
                  </div>
                  {/* Enhanced Tooltip for Desktop */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-3 py-2 pixel-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {statsError ? (
                      <>
                        <div className="text-yellow-300 font-bold">📱 Local Data</div>
                        <div>Stored on this device</div>
                      </>
                    ) : (
                      <>
                        <div className="text-green-300 font-bold">☁️ Online Data</div>
                        <div>Synced across devices</div>
                        {'averageScore' in gameStats && (
                          <div className="mt-1 pt-1 border-t border-gray-600">
                            <div>Games: {gameStats.totalGamesPlayed}</div>
                            <div>Average: {gameStats.averageScore}</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Game Types Summary - Desktop */}
            <div className="flex justify-center ">
              <div className="max-w-2xl w-full">
                {/* Game Types Summary Card */}
                <div className="group relative transform transition-all duration-300 ">
                  <div className="pixel-border-thick bg-gray-800   p-8 relative overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-0"></div>
                    <div className="absolute top-0 -right-1 rotate-90 w-20 h-20 bg-cyan-500/20 pixel-corner"></div>

                    {/* Header */}
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="w-15 h-15 bg-gradient-to-br from-cyan-400/50 to-blue-600/50 pixel-border flex items-center justify-center p-1">
                        <Gamepad2 className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-cyan-300 pixel-text tracking-wide mb-1">
                          GAME TYPES AVAILABLE
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {gameTypes.length} different types of sorting challenges
                        </p>
                      </div>
                    </div>

                    {/* Game Types Grid */}
                    <div className="grid grid-cols-1 gap-4 mb-6 ">
                      {gameTypes.map((gameType) => {
                        // Check if any game mode in this type is completed
                        const isTypeCompleted = gameType.gameModes.some(gameMode => isGameModeCompleted(gameMode.id));

                        return (
                          <div
                            key={gameType.type}
                            className="flex items-center justify-between p-2 pixel-border hover:opacity-90 transition-colors  bg-gray-700 hover:bg-gray-600"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 pixel-border flex items-center justify-center ${
                                isTypeCompleted ? 'bg-green-600' : 'bg-blue-600'
                              }`}>
                                {isTypeCompleted ? (
                                  <CheckCircle className="w-6 h-6 text-white" />
                                ) : (
                                  <Target className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-white">
                                  {gameType.title}
                                </div>
                                {isTypeCompleted && (
                                  <div className="text-green-400 font-extrabold text-xs ">
                                    ✓ Completed
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Navigation Button - Fixed z-index and pointer events */}
                    <button
                      onClick={() => navigate(`/modules/${moduleId}/games`)}
                      className="w-full pixel-border-thick bg-gradient-to-r from-purple-500 to-pink-600 p-4 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 group-hover:scale-105 relative z-30 pointer-events-auto "
                    >
                      <div className="flex items-center justify-center text-white font-black text-xl pixel-text">
                        <Play className="w-6 h-6 mr-3" />
                       Play Game
                      </div>
                    </button>

                    {/* Scan Lines Effect */}
                    <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none z-10"></div>
                  </div>

                  {/* Glow Effect on Hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pixel-glow"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;