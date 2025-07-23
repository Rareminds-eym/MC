import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AudioState } from '../types';

const initialState: AudioState = {
  isEnabled: true,
  volume: 0.7,
  isMuted: false,
  currentTrack: undefined,
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setAudioEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload;
    },
    
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload)); // Clamp between 0 and 1
    },
    
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    
    setCurrentTrack: (state, action: PayloadAction<string | undefined>) => {
      state.currentTrack = action.payload;
    },
    
    resetAudio: (state) => {
      state.isEnabled = true;
      state.volume = 0.7;
      state.isMuted = false;
      state.currentTrack = undefined;
    },
  },
});

export const {
  setAudioEnabled,
  setVolume,
  setMuted,
  toggleMute,
  setCurrentTrack,
  resetAudio,
} = audioSlice.actions;

export default audioSlice.reducer;
