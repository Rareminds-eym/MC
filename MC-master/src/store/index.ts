import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import audioReducer from './slices/audioSlice';
import uiReducer from './slices/uiSlice';
import progressReducer from './slices/progressSlice';
import bingoReducer from './slices/bingoSlice';
// redux-persist imports
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

const bingoPersistConfig = {
  key: 'bingo',
  storage,
};

const persistedBingoReducer = persistReducer(bingoPersistConfig, bingoReducer);
import level3Reducer from './slices/level3Slice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    audio: audioReducer,
    ui: uiReducer,
    progress: progressReducer,
    bingo: persistedBingoReducer, // use persisted reducer
    level3: level3Reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Set serialization
        ignoredActions: ['game/completeLevel', 'game/loadProgress', 'persist/PERSIST'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.completedLevels'],
        // Ignore these paths in the state
        ignoredPaths: ['game.completedLevels'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;