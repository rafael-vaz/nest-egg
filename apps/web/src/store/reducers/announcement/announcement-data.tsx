import { createSlice } from "@reduxjs/toolkit";

import { IAnnouncementSlice } from "../../../@types/announcement";

const initialState: IAnnouncementSlice = {
  content: "",
};

const announcementDataSlice = createSlice({
  name: "announcementData",
  initialState,
  reducers: {
    setAnnouncementContent(state, action) {
      state.content = action.payload;
    },
    clearAnnouncementContent(state) {
      state.content = "";
    },
    clearAndSetAnnouncementContent(state, action) {
      state.content = "";
      state.content = action.payload;
    },
  },
});

export const {
  setAnnouncementContent,
  clearAnnouncementContent,
  clearAndSetAnnouncementContent,
} = announcementDataSlice.actions;
export default announcementDataSlice.reducer;
