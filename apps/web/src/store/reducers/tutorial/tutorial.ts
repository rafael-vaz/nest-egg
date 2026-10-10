import { createSlice } from "@reduxjs/toolkit";

interface ITutorialSlice {
  run: boolean;
}

const initialState: ITutorialSlice = {
  run: false,
};

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    startTutorial(state) {
      state.run = true;
    },
    stopTutorial(state) {
      state.run = false;
    },
  },
});

export const { startTutorial, stopTutorial } = tutorialSlice.actions;
export default tutorialSlice.reducer;
