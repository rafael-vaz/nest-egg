import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { IUser } from "../../../@types/user";
import loginService from "../../../services/auth/login";
import logoutService from "../../../services/auth/logout";
import reauthenticateUserService from "../../../services/auth/reauthenticate";
import createUserAccountService from "../../../services/user/create-user-account";
import deleteUserService from "../../../services/user/delete-user";
import deleteUserAccountService from "../../../services/user/delete-user-account";
import deleteUserFilesService from "../../../services/user/delete-user-files";
import sendEmailVerificationService from "../../../services/user/send-email-verification";
import { closeConfirmationModalState } from "../../reducers/modal/confirmation-modal";
import { closeModalState } from "../../reducers/modal/modal";

interface ILoginData {
  email: string;
  password: string;
}

// login user
export const loginUserThunk = createAsyncThunk<
  IUser | null,
  ILoginData,
  { rejectValue: string }
>("userAuth/loginUser", async (loginData, { rejectWithValue }) => {
  try {
    const authenticatedUser = await loginService(
      loginData.email,
      loginData.password,
    );
    return authenticatedUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error in logging in.");
  }
});

// logout user
export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("userAuth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await logoutService();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when doing logout.");
  }
});

// create user account
export const createUserAccountThunk = createAsyncThunk<
  string,
  { email: string; password: string },
  { rejectValue: string }
>(
  "userAuth/createUserAccount",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const user = await createUserAccountService(
        userCredentials.email,
        userCredentials.password,
      );
      await sendEmailVerificationService(user);

      return user.uid;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("E-mail de usuário já cadastrado!");
        return rejectWithValue("This email is already registered.");
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error when creating user account.");
    }
  },
);

// delete user account
export const deleteUserAccountThunk = createAsyncThunk<
  void,
  { uid: string; email: string; password: string },
  { rejectValue: string }
>("userAuth/deleteUserAccount", async (user, { dispatch, rejectWithValue }) => {
  try {
    await reauthenticateUserService(user.email, user.password);
    dispatch(closeModalState());
    await deleteUserFilesService(user.uid);
    await deleteUserService(user.uid);
    await deleteUserAccountService();
    dispatch(closeConfirmationModalState());
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when deleting user account.");
  }
});
