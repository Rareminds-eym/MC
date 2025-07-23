import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomePage from '../../components/Level2/HomePage';
import GameInterface from '../../components/Level2/GameInterface';
import { getGameModesByModule } from '../../components/Level2/data/gameModes';
import { GameMode } from '../../types/Level2/types';
import '../../components/Level2/index.css';

const Level2: React.FC = () => {
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const handleGameModeSelect = (modeId: string) => {
    const filteredGameModes = getGameModesByModule(parseInt(moduleId || '1'));
    const gameMode = filteredGameModes.find(mode => mode.id === modeId);
    if (gameMode) {
      setSelectedGameMode(gameMode);
    }
  };

  const handleBackToHome = () => {
    setSelectedGameMode(null);
  };

  const handleExitToModules = () => {
    navigate(`/modules/${moduleId}`);
  };

  const handleNextLevel = () => {
    // Instead of navigating to Level 3, go back to the game mode selection
    // This allows users to play other game modes within Level 2
    setSelectedGameMode(null);
  };

  if (selectedGameMode) {
    return (
      <GameInterface
        gameMode={selectedGameMode}
        moduleId={moduleId || '1'}
        onBack={handleBackToHome}
        onNextLevel={handleNextLevel}
      />
    );
  }

  return (
    <HomePage
      moduleId={moduleId}
      onGameModeSelect={handleGameModeSelect}
      onExit={handleExitToModules}
    />
  );
};

export default Level2;
