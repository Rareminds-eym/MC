import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, User, DraggableItem, DropZone } from '../types/game';
import { gameData } from '../data/gameData';

const initialState: GameState = {
  currentScreen: 'login',
  user: null,
  modules: gameData.modules,
  currentModule: null,
  currentLevel: null,
  gameData: {
    draggableItems: [],
    dropZones: [],
    isCompleted: false,
    score: 0,
  },
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setCurrentScreen: (state, action: PayloadAction<string>) => {
      state.currentScreen = action.payload;
    },
    setCurrentModule: (state, action: PayloadAction<number>) => {
      state.currentModule = action.payload;
    },
    setCurrentLevel: (state, action: PayloadAction<string>) => {
      state.currentLevel = action.payload;
    },
    initializeLevel: (state, action: PayloadAction<{ moduleId: number; levelId: string }>) => {
      const { moduleId, levelId } = action.payload;
      const levelData = gameData.levels[levelId];
      if (levelData) {
        state.gameData = {
          draggableItems: levelData.items,
          dropZones: levelData.dropZones,
          isCompleted: false,
          score: 0,
        };
      }
    },
    dropItem: (state, action: PayloadAction<{ itemId: string; zoneId: string }>) => {
      const { itemId, zoneId } = action.payload;
      const item = state.gameData.draggableItems.find(i => i.id === itemId);
      const zone = state.gameData.dropZones.find(z => z.id === zoneId);
      
      if (item && zone) {
        // Remove item from previous zone if it exists
        state.gameData.dropZones.forEach(z => {
          if (z.droppedItem?.id === itemId) {
            z.droppedItem = undefined;
          }
        });
        
        // Add item to new zone
        zone.droppedItem = item;
        
        // Check if level is completed
        const allZonesFilled = state.gameData.dropZones.every(z => z.droppedItem);
        if (allZonesFilled) {
          const correctPlacements = state.gameData.dropZones.filter(z => 
            z.droppedItem && z.acceptedItems.includes(z.droppedItem.id)
          ).length;
          
          state.gameData.score = correctPlacements * 20;
          state.gameData.isCompleted = correctPlacements === state.gameData.dropZones.length;
        }
      }
    },
    removeItemFromZone: (state, action: PayloadAction<string>) => {
      const zoneId = action.payload;
      const zone = state.gameData.dropZones.find(z => z.id === zoneId);
      if (zone) {
        zone.droppedItem = undefined;
        state.gameData.isCompleted = false;
        state.gameData.score = 0;
      }
    },
    completeLevel: (state) => {
      if (state.user && state.currentLevel) {
        if (!state.user.completedLevels.includes(state.currentLevel)) {
          state.user.completedLevels.push(state.currentLevel);
        }
        state.user.totalScore += state.gameData.score;
        
        // Unlock next module if needed
        const completedInModule = state.user.completedLevels.filter(levelId => 
          levelId.startsWith(`module${state.currentModule}`)
        ).length;
        
        if (completedInModule >= 2 && state.currentModule && state.currentModule < 12) {
          const nextModule = state.modules.find(m => m.id === state.currentModule + 1);
          if (nextModule) {
            nextModule.isLocked = false;
          }
        }
      }
    },
  },
});

export const {
  setUser,
  setCurrentScreen,
  setCurrentModule,
  setCurrentLevel,
  initializeLevel,
  dropItem,
  removeItemFromZone,
  completeLevel,
} = gameSlice.actions;

export default gameSlice.reducer;