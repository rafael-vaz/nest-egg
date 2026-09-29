import { createSlice } from "@reduxjs/toolkit";

import { IUserSlice } from "../../../@types/user";
import {
  createUserThunk,
  deleteUserThunk,
  readUserThunk,
  updateUserThunk,
} from "../../thunks/user/user-data";

const initialState: IUserSlice = {
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

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // create user
    builder.addCase(createUserThunk.pending, (state) => {
      state.loading.create = true;
      state.error.create = null;
    });
    builder.addCase(createUserThunk.fulfilled, (state) => {
      state.loading.create = false;
    });
    builder.addCase(createUserThunk.rejected, (state, action) => {
      state.error.create = action.payload ?? "Error creating user.";
    });
    // read user
    builder.addCase(readUserThunk.pending, (state) => {
      state.loading.read = true;
      state.error.read = null;
    });
    builder.addCase(readUserThunk.fulfilled, (state) => {
      state.loading.read = false;
    });
    builder.addCase(readUserThunk.rejected, (state, action) => {
      state.loading.read = false;
      state.error.read = action.payload ?? "Error reading user.";
    });
    // update user
    builder.addCase(updateUserThunk.pending, (state) => {
      state.loading.update = true;
      state.error.update = null;
    });
    builder.addCase(updateUserThunk.fulfilled, (state) => {
      state.loading.update = false;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.loading.update = false;
      state.error.update = action.payload ?? "Error update user.";
    });
    // delete user
    builder.addCase(deleteUserThunk.pending, (state) => {
      state.loading.delete = true;
      state.error.delete = null;
    });
    builder.addCase(deleteUserThunk.fulfilled, (state) => {
      state.loading.delete = false;
    });
    builder.addCase(deleteUserThunk.rejected, (state, action) => {
      state.loading.delete = false;
      state.error.delete = action.payload ?? "Error when deleting user.";
    });
  },
});

export default userDataSlice.reducer;
