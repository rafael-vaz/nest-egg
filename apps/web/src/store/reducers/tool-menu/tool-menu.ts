import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "toolMenu",
  initialState: initialState,
  reducers: {
    openToolMenuState(state) {
      state.isOpen = true;
    },
    closeToolMenuState(state) {
      state.isOpen = false;
    },
  },
});

export const { openToolMenuState, closeToolMenuState } = modalSlice.actions;
export default modalSlice.reducer;
