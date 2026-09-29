import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IAuthSlice } from "../../../@types/auth";
import { IUser } from "../../../@types/user";
import {
  createUserAccountThunk,
  loginUserThunk,
  logoutUserThunk,
} from "../../thunks/user/user-auth";

const initialState: IAuthSlice = {
  auth: undefined,
  authUser: null,
  loading: {
    login: false,
    logout: false,
    clear: false,
    createAccount: false,
    sendEmailVerification: false,
  },
  error: {
    login: null,
    logout: null,
    clear: null,
    createAccount: null,
    sendEmailVerification: null,
  },
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    updateAuthUser(state, action: PayloadAction<Partial<IUser>>) {
      state.auth = true;
      state.authUser = { ...state.authUser!, ...action.payload };
    },
    clearAuthUser(state) {
      state.auth = false;
      state.authUser = null;
      state.loading.clear = false;
      state.error.clear = null;
    },
  },
  extraReducers(builder) {
    // login user
    builder.addCase(loginUserThunk.pending, (state) => {
      state.loading.login = true;
      state.error.login = null;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.loading.login = false;
      state.authUser = action.payload;
      state.auth = action.payload ? true : false;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.loading.login = false;
      state.auth = false;
      state.authUser = null;
      state.error.login = action.payload ?? "Error when performing login.";
    });
    // logout user
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.loading.logout = true;
      state.error.logout = null;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.loading.logout = false;
      state.auth = false;
      state.authUser = null;
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.loading.logout = false;
      state.error.logout = action.payload ?? "Error when performing log.";
    });
    // create user account
    builder.addCase(createUserAccountThunk.pending, (state) => {
      state.loading.createAccount = true;
      state.error.createAccount = null;
    });
    builder.addCase(createUserAccountThunk.fulfilled, (state) => {
      state.loading.createAccount = false;
    });
    builder.addCase(createUserAccountThunk.rejected, (state, action) => {
      state.loading.createAccount = false;
      state.error.createAccount =
        action.payload ?? "Error when creating the user account.";
    });
  },
});

export const { clearAuthUser, updateAuthUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;
