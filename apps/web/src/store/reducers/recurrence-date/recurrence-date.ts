import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  IRecurrenceDate,
  IRecurrenceDateSlice,
} from "../../../@types/recurrence-date";

const initialState: IRecurrenceDateSlice = {
  recurrence: {
    startDate: new Date().toISOString(),
    endDate: null,
    frequency: null,
  },
};

const recurrenceDateSlice = createSlice({
  name: "recurrenceDate",
  initialState: initialState,
  reducers: {
    setRecurrence(state, action: PayloadAction<IRecurrenceDate>) {
      state.recurrence = action.payload;
    },
    updateRecurrence(state, action: PayloadAction<Partial<IRecurrenceDate>>) {
      state.recurrence = {
        ...state.recurrence,
        ...action.payload,
      } as IRecurrenceDate;
    },
    clearRecurrence(state) {
      state.recurrence = initialState.recurrence;
    },
  },
});

export const { setRecurrence, updateRecurrence, clearRecurrence } =
  recurrenceDateSlice.actions;
export default recurrenceDateSlice.reducer;
