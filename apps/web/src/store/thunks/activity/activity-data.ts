import { createAsyncThunk } from "@reduxjs/toolkit";

import { IActivity } from "../../../@types/activity";
import readAllActivitiesService from "../../../services/activity/read-all-activities";

// read all activities
export const readAllActivitiesThunk = createAsyncThunk<
  IActivity[] | null,
  { userId: string },
  { rejectValue: string }
>("activityData/readAllActivities", async (data, { rejectWithValue }) => {
  try {
    const activities = await readAllActivitiesService(data.userId);
    return activities;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read activities.");
  }
});
