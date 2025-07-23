import React, { useState, useEffect } from 'react';
import { X, Trophy, Target } from 'lucide-react';
import { ModuleDetailModalProps, Level } from './types/GameData';
import { useDeviceLayout } from '../../hooks/useOrientation';
import { useAuth } from '../../contexts/AuthContext';
import { Level2GameService } from '../Level2/services/level2GameService';
import { Level2GameData } from '../../types/Level2/types';
import { level4Service } from '../Level4/services/level4services';
import { Level4GameData } from '../Level4/services/level4services';

const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({ isOpen, module, onClose }) => {
  const { isMobile, isHorizontal } = useDeviceLayout();
  const { user } = useAuth();
  const isMobileLandscape = isMobile && isHorizontal;

  // State for level2_game_data
  const [level2Data, setLevel2Data] = useState<Level2GameData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // State for level4_game_data
  const [level4Data, setLevel4Data] = useState<Level4GameData | null>(null);
  const [isLoadingLevel4Data, setIsLoadingLevel4Data] = useState(false);
  const [level4DataError, setLevel4DataError] = useState<string | null>(null);

  // Fetch level2_game_data when modal opens for Module 1
  useEffect(() => {
    const fetchLevel2Data = async () => {
      if (!isOpen || !module || module.id !== 1 || !user) return;

      setIsLoadingData(true);
      setDataError(null);

      try {
        // Fetch all game modes for Module 1
        const { data, error } = await Level2GameService.getUserGameData('1', 'gmp-vs-non-gmp');
        if (error) {
          setDataError(error.message);
        } else { 
          setLevel2Data(data || []);
        }
      } catch (err) {
        setDataError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchLevel2Data();
  }, [isOpen, module, user]);

  // Fetch level4_game_data when modal opens for modules that support Level 4
  useEffect(() => {
    const fetchLevel4Data = async () => {
      if (!isOpen || !module || !user) return;

      // Level 4 is available for modules 1, 2, 3, 4 based on the cases data
      const level4Modules = [1, 2, 3, 4];
      if (!level4Modules.includes(module.id)) return;

      setIsLoadingLevel4Data(true);
      setLevel4DataError(null);

      try {
        const data = await level4Service.getUserModuleData(user.id, module.id);
        setLevel4Data(data);
      } catch (err) {
        setLevel4DataError(err instanceof Error ? err.message : 'Failed to load Level 4 data');
      } finally {
        setIsLoadingLevel4Data(false);
      }
    };

    fetchLevel4Data();
  }, [isOpen, module, user]);

  if (!isOpen || !module) return null;

  const getScoreIcon = (score: number): JSX.Element => {
    if (score >= 90) return <Trophy size={16} className="text-green-600" />;
    if (score >= 70) return <Target size={16} className="text-yellow-600" />;
    if (score > 0) return <Target size={16} className="text-orange-600" />;
    return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      isMobileLandscape ? 'p-1' : isMobile ? 'p-2' : 'p-4'
    }`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-2xl w-full transform transition-all duration-300 scale-100 ${
        isMobileLandscape ? 'max-w-sm mx-1 max-h-[85vh] overflow-hidden flex flex-col' :
        isMobile ? 'max-w-xs mx-2' : 'max-w-md'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-red-200 ${
          isMobileLandscape ? 'p-2' : isMobile ? 'p-3' : 'p-6'
        }`}>
          <div className={`flex items-center ${
            isMobileLandscape ? 'space-x-1.5' : isMobile ? 'space-x-2' : 'space-x-3'
          }`}>
            <div className={`bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
              isMobileLandscape ? 'w-6 h-6 text-xs' : isMobile ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg'
            }`}>
              {module.id}
            </div>
            <div>
              <h2 className={`font-bold text-gray-800 ${
                isMobileLandscape ? 'text-sm' : isMobile ? 'text-lg' : 'text-xl'
              }`}>
                Module {module.id}
              </h2>

            </div>
          </div>
          <button
            onClick={onClose}
            className={`hover:bg-orange-200 rounded-full transition-colors duration-200 ${
              isMobileLandscape ? 'p-0.5' : isMobile ? 'p-1' : 'p-2'
            }`}
          >
            <X size={isMobileLandscape ? 14 : isMobile ? 16 : 20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className={`${
          isMobileLandscape ? 'p-2 overflow-y-auto flex-1' : isMobile ? 'p-3' : 'p-6'
        }`}>
          <h3 className={`font-semibold text-gray-800 flex items-center ${
            isMobileLandscape ? 'text-xs mb-2' : isMobile ? 'text-xs mb-3' : 'text-lg mb-4'
          }`}>
            <Target size={isMobileLandscape ? 14 : isMobile ? 16 : 20} className="mr-2 text-orange-500" />
            Level Progress
          </h3>

          <div className={isMobileLandscape ? 'space-y-1.5' : isMobile ? 'space-y-2' : 'space-y-3'}>
            {module.levels?.map((level: Level) => (
              <div
                key={level.id}
                className={`flex items-center justify-between bg-white rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow duration-200 ${
                  isMobileLandscape ? 'p-1.5' : isMobile ? 'p-2' : 'p-4'
                }`}
              >
                <div className={`flex items-center ${
                  isMobileLandscape ? 'space-x-1.5' : isMobile ? 'space-x-2' : 'space-x-3'
                }`}>
                  {getScoreIcon(level.score)}
                  <div>
                    <h4 className={`font-medium text-gray-800 ${
                      isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-base'
                    }`}>
                      {level.name}
                    </h4>
                    <p className={`text-gray-500 ${
                      isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      Level {level.id}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-bold text-gray-600 ${
                    isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-lg'
                  }`}>
                    {level.score > 0 ? 'Completed' : 'Not started'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Level 2 Game Data Section - Only show for Module 1 */}
          {module.id === 1 && (
            <>
              <div className={`mt-4 ${isMobileLandscape ? 'mt-3' : isMobile ? 'mt-4' : 'mt-6'}`}>
                {isLoadingData ? (
                  <div className={`flex items-center justify-center bg-white rounded-lg shadow-sm border border-blue-100 ${
                    isMobileLandscape ? 'p-2' : isMobile ? 'p-3' : 'p-4'
                  }`}>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className={`ml-2 text-gray-600 ${
                      isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      Loading game data...
                    </span>
                  </div>
                ) : dataError ? (
                  <div className={`bg-red-50 rounded-lg shadow-sm border border-red-200 ${
                    isMobileLandscape ? 'p-2' : isMobile ? 'p-3' : 'p-4'
                  }`}>
                    <p className={`text-red-600 ${
                      isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      Error: {dataError}
                    </p>
                  </div>
                ) : level2Data.length === 0 ? (
                  <div className={`bg-gray-50 rounded-lg shadow-sm border border-gray-200 ${
                    isMobileLandscape ? 'p-2' : isMobile ? 'p-3' : 'p-4'
                  }`}>
                    <p className={`text-gray-600 ${
                      isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      No Level 2 game data found for Module 1
                    </p>
                  </div>
                ) : (
                  <div className={isMobileLandscape ? 'space-y-1.5' : isMobile ? 'space-y-2' : 'space-y-3'}>
                    {level2Data.map((gameData, index) => (
                      <div
                        key={gameData.id || index}
                        className={`bg-white rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-200 ${
                          isMobileLandscape ? 'p-1.5' : isMobile ? 'p-2' : 'p-4'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center ${
                            isMobileLandscape ? 'space-x-1.5' : isMobile ? 'space-x-2' : 'space-x-3'
                          }`}>
                            <div>
                              <h4 className={`font-medium text-gray-800 ${
                                isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-base'
                              }`}>
                                Level {gameData.level_number} 
                              </h4>
                              <p className={`text-gray-500 ${
                                isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                              }`}>
                                {gameData.game_mode_id}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${gameData.is_completed ? 'text-green-600' : 'text-gray-600'} ${
                              isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-lg'
                            }`}>
                              {gameData.is_completed ? 'Completed' : 'Uncompleted'}
                            </div>
                            <div className={`text-gray-500 ${
                              isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                            }`}>
                              Score: {gameData.score}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Level 4 Game Data Section - Show for modules that support Level 4 */}
          {[1, 2, 3, 4].includes(module.id) && (
            <>
              <div className={`mt-4 ${isMobileLandscape ? 'mt-3' : isMobile ? 'mt-4' : 'mt-6'}`}>
                {/* <h3 className={`font-semibold text-gray-800 flex items-center mb-3 ${
                  isMobileLandscape ? 'text-xs mb-2' : isMobile ? 'text-xs mb-3' : 'text-lg mb-4'
                }`}>
                  <Target size={isMobileLandscape ? 14 : isMobile ? 16 : 20} className="mr-2 text-purple-500" />
                  Level 4 Progress
                </h3> */}

                {isLoadingLevel4Data ? (
                  <div className={`flex items-center justify-center bg-white rounded-lg shadow-sm border border-purple-100 ${
                    isMobileLandscape ? 'p-2' : isMobile ? 'p-3' : 'p-4'
                  }`}>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    <span className={`ml-2 text-gray-600 ${
                      isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      Loading Level 4 data...
                    </span>
                  </div>
                ) : level4DataError ? (
                  <div className={`bg-red-50 rounded-lg shadow-sm border border-red-200 ${
                    isMobileLandscape ? 'p-2' : isMobile ? 'p-3' : 'p-4'
                  }`}>
                    <p className={`text-red-600 ${
                      isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      Error: {level4DataError}
                    </p>
                  </div>
                ) : !level4Data ? (
                  <div className={`bg-gray-50 rounded-lg shadow-sm border border-gray-200 ${
                    isMobileLandscape ? 'p-2' : isMobile ? 'p-3' : 'p-4'
                  }`}>
                    <p className={`text-gray-600 ${
                      isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      No Level 4 data found for Module {module.id}
                    </p>
                  </div>
                ) : (
                  <div className={`bg-white rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow duration-200 ${
                    isMobileLandscape ? 'p-1.5' : isMobile ? 'p-2' : 'p-4'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center ${
                        isMobileLandscape ? 'space-x-1.5' : isMobile ? 'space-x-2' : 'space-x-3'
                      }`}>
                        {/* {getScoreIcon(level4Data.score)} */}
                        <div>
                          <h4 className={`font-medium text-gray-800 ${
                            isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-base'
                          }`}>
                            {/* Module {level4Data.module} - Level {level4Data.level} */}
                            Level {level4Data.level}
                          </h4>
                          <p className={`text-gray-500 ${
                            isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                          }`}>
                            {/* Case-based Learning */}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${level4Data.is_completed ? 'text-green-600' : 'text-gray-600'} ${
                          isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-lg'
                        }`}>
                          {level4Data.is_completed ? 'Completed' : 'In Progress'}
                        </div>
                        <div className={`text-gray-500 ${
                          isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                        }`}>
                          Score: {level4Data.score}
                        </div>
                        {/* {level4Data.time > 0 && (
                          <div className={`text-gray-500 ${
                            isMobileLandscape ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'
                          }`}>
                            Time: {Math.floor(level4Data.time / 60)}:{(level4Data.time % 60).toString().padStart(2, '0')}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
       {
        !isMobileLandscape && !isMobile &&
        <div className={`bg-gradient-to-r from-orange-100 to-amber-100 rounded-b-2xl border-t border-orange-200 ${
          isMobile ? 'px-3 py-3' : 'px-6 py-4'
        }`}>
          <div className="flex justify-between items-center">
            <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Status: <span className="font-medium capitalize text-gray-800">{module.status}</span>
            </div>
            <button
              onClick={onClose}
              className={`bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md ${
                isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
              }`}
            >
              Close
            </button>
          </div>
        </div>
        }
      </div>
    </div>
  );
};

export default ModuleDetailModal;