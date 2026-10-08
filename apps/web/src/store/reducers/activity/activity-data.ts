import { createSlice } from "@reduxjs/toolkit";

import { IActivitySlice } from "../../../@types/activity";
import { readAllActivitiesThunk } from "../../thunks/activity/activity-data";

const initialState: IActivitySlice = {
  loading: false,
  error: null,
};

const activityDataSlice = createSlice({
  name: "activityData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // read all activities
    builder.addCase(readAllActivitiesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(readAllActivitiesThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(readAllActivitiesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error reading activities.";
    });
  },
});

export default activityDataSlice.reducer;
