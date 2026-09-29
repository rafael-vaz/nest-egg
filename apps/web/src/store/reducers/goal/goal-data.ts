import { createSlice } from "@reduxjs/toolkit";

import { IGoalSlice } from "../../../@types/goal";
import {
  createGoalThunk,
  deleteGoalThunk,
  readAllGoalsThunk,
  readGoalThunk,
  updateGoalThunk,
} from "../../thunks/goal/goal-data";

const initialState: IGoalSlice = {
  loading: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  error: {
    create: null,
    read: null,
    update: null,
    delete: null,
  },
};

const goalDataSlice = createSlice({
  name: "goalData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // create goal
    builder.addCase(createGoalThunk.pending, (state) => {
      state.loading.create = true;
      state.error.create = null;
    });
    builder.addCase(createGoalThunk.fulfilled, (state) => {
      state.loading.create = false;
    });
    builder.addCase(createGoalThunk.rejected, (state, action) => {
      state.error.create = action.payload ?? "Error creating goal.";
    });
    // read goal
    builder.addCase(readGoalThunk.pending, (state) => {
      state.loading.read = true;
      state.error.read = null;
    });
    builder.addCase(readGoalThunk.fulfilled, (state) => {
      state.loading.read = false;
    });
    builder.addCase(readGoalThunk.rejected, (state, action) => {
      state.loading.read = false;
      state.error.read = action.payload ?? "Error reading goal.";
    });
    // read all goals
    builder.addCase(readAllGoalsThunk.pending, (state) => {
      state.loading.read = true;
      state.error.read = null;
    });
    builder.addCase(readAllGoalsThunk.fulfilled, (state) => {
      state.loading.read = false;
    });
    builder.addCase(readAllGoalsThunk.rejected, (state, action) => {
      state.loading.read = false;
      state.error.read = action.payload ?? "Error reading goals.";
    });
    // update goal
    builder.addCase(updateGoalThunk.pending, (state) => {
      state.loading.update = true;
      state.error.update = null;
    });
    builder.addCase(updateGoalThunk.fulfilled, (state) => {
      state.loading.update = false;
    });
    builder.addCase(updateGoalThunk.rejected, (state, action) => {
      state.loading.update = false;
      state.error.update = action.payload ?? "Error update goal.";
    });
    // delete goal
    builder.addCase(deleteGoalThunk.pending, (state) => {
      state.loading.delete = true;
      state.error.delete = null;
    });
    builder.addCase(deleteGoalThunk.fulfilled, (state) => {
      state.loading.delete = false;
    });
    builder.addCase(deleteGoalThunk.rejected, (state, action) => {
      state.loading.delete = false;
      state.error.delete = action.payload ?? "Error when deleting goal.";
    });
  },
});

export default goalDataSlice.reducer;
