import { createSlice } from "@reduxjs/toolkit";

import { IUserFileSlice } from "../../../@types/user/index";
import {
  deletePhotoThunk,
  updatePhotoThunk,
} from "../../thunks/user/user-file.ts";

const initialState: IUserFileSlice = {
  loading: {
    photo: {
      update: false,
      delete: false,
    },
  },
  error: {
    photo: {
      update: null,
      delete: null,
    },
  },
};

const userFileSlice = createSlice({
  name: "userFile",
  initialState,
  reducers: {
    resetUserFileState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // update photo
      .addCase(updatePhotoThunk.pending, (state) => {
        state.loading.photo.update = true;
        state.error.photo.update = null;
      })
      .addCase(updatePhotoThunk.fulfilled, (state) => {
        state.loading.photo.update = false;
        state.error.photo.update = null;
      })
      .addCase(updatePhotoThunk.rejected, (state, action) => {
        state.loading.photo.update = false;
        state.error.photo.update =
          action.error.message ?? "Erro ao atualizar foto do usuário.";
      })

      // delete photo
      .addCase(deletePhotoThunk.pending, (state) => {
        state.loading.photo.delete = true;
        state.error.photo.delete = null;
      })
      .addCase(deletePhotoThunk.fulfilled, (state) => {
        state.loading.photo.delete = false;
        state.error.photo.delete = null;
      })
      .addCase(deletePhotoThunk.rejected, (state, action) => {
        state.loading.photo.delete = false;
        state.error.photo.delete =
          action.error.message ?? "Erro ao atualizar foto do usuário.";
      });
  },
});

export const { resetUserFileState } = userFileSlice.actions;
export default userFileSlice.reducer;
