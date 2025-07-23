import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Scenario } from '../../data/level3Scenarios';
import { level3Scenarios } from '../../data/level3Scenarios';

export interface Level3State {
  scenarios: Scenario[];
}

const initialState: Level3State = {
  scenarios: level3Scenarios,
};

const level3Slice = createSlice({
  name: 'level3',
  initialState,
  reducers: {
    setScenarios: (state, action: PayloadAction<Scenario[]>) => {
      state.scenarios = action.payload;
    },
  },
});

export const { setScenarios } = level3Slice.actions;
export default level3Slice.reducer;
