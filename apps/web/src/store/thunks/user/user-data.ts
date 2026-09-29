import { createAsyncThunk } from "@reduxjs/toolkit";

import { IUser } from "../../../@types/user";
import createUserService from "../../../services/user/create-user";
import deleteUserService from "../../../services/user/delete-user";
import readUserService from "../../../services/user/read-user";
import updateUserService from "../../../services/user/update-user";
import { updateAuthUser } from "../../reducers/user/user-auth";

// create user
export const createUserThunk = createAsyncThunk<
  void,
  IUser,
  { rejectValue: string }
>("userData/createUser", async (user, { dispatch, rejectWithValue }) => {
  try {
    await createUserService(user);
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      coverURL: user.coverURL,
      dateOfBirth: user.dateOfBirth,
      wallet: user.wallet,
    };
    dispatch(updateAuthUser(userData));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to create a user.");
  }
});

// read user
export const readUserThunk = createAsyncThunk<
  IUser | null,
  string,
  { rejectValue: string }
>("userData/readUser", async (id, { rejectWithValue }) => {
  try {
    const user = await readUserService(id);
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(
      "Unknown error when trying to perform user reading.",
    );
  }
});

// update user
export const updateUserThunk = createAsyncThunk<
  void,
  Partial<IUser> & { uid: string; hasAlert?: boolean },
  { rejectValue: string }
>("userData/updateUser", async (user, { rejectWithValue }) => {
  try {
    await updateUserService(user, user.hasAlert);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to perform user update.");
  }
});

// delete user
export const deleteUserThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("userData/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await deleteUserService(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to delete user.");
  }
});
