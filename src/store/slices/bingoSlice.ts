// src/store/slices/bingoSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BingoState {
  timer: number;               // seconds elapsed
  score: number;
  completedLines: number;
  boardState: number[][];      // or whatever structure represents the board
  selectedCells: number[];     // array of selected cell indices
  selectedDefinition: string;  // current definition
  completedLinesState: number[][]; // array of completed line patterns
  rowsSolved: number;
  is_completed: boolean; // number of rows solved
}

const initialState: BingoState = {
  timer: 0,
  score: 0,
  completedLines: 0,
  boardState: [],
  selectedCells: [],
  selectedDefinition: '',
  completedLinesState: [],
  rowsSolved: 0,
  is_completed: false,
};

const bingoSlice = createSlice({
  name: 'bingo',
  initialState,
  reducers: {
    setTimer: (state, action: PayloadAction<number>) => {
      state.timer = action.payload;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setCompletedLines: (state, action: PayloadAction<number>) => {
      state.completedLines = action.payload;
    },
    setBoardState: (state, action: PayloadAction<number[][]>) => {
      state.boardState = action.payload;
    },
    setSelectedCells: (state, action: PayloadAction<number[]>) => {
      state.selectedCells = action.payload;
    },
    setSelectedDefinition: (state, action: PayloadAction<string>) => {
      state.selectedDefinition = action.payload;
    },
    resetBingoState: (state) => {
      state.timer = 0;
      state.score = 0;
      state.completedLines = 0;
      state.boardState = [];
      state.selectedCells = [];
      state.selectedDefinition = '';
      state.completedLinesState = [];
      state.rowsSolved = 0;
      state.is_completed = false;
    },
    saveState: (state, action: PayloadAction<Partial<BingoState>>) => {
      Object.assign(state, action.payload);
    },
    restoreState: (_state, action: PayloadAction<BingoState>) => {
      return { ...action.payload };
    },
    // Add more actions as needed
  },
});

export const {
  setTimer,
  setScore,
  setCompletedLines,
  setBoardState,
  setSelectedCells,
  setSelectedDefinition,
  resetBingoState,
  saveState,
  restoreState,
} = bingoSlice.actions;

export default bingoSlice.reducer;
