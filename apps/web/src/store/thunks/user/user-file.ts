import { createAsyncThunk } from "@reduxjs/toolkit";

import createActivityService from "../../../services/activity/create-activity";
import removeFileService from "../../../services/file/remove-file";
import uploadFileService from "../../../services/file/upload-file";
import updateUserService from "../../../services/user/update-user";
import getFirebaseFileInfoFromURL from "../../../utils/file/get-firebase-file-info-from-url";
import { RootState } from "../../configure-store";
import { updateAuthUser } from "../../reducers/user/user-auth";

// delete photo
export const deletePhotoThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>(
  "userFile/deletePhoto",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { authUser } = getState().userAuth;
      if (authUser?.uid && authUser.photoURL) {
        const fileInfo = getFirebaseFileInfoFromURL(authUser.photoURL);
        if (fileInfo?.fileName) {
          await removeFileService(
            `users/${authUser.uid}/photo`,
            fileInfo.fileName
          );
        }
        await updateUserService({ uid: authUser.uid, photoURL: null }, false);
        dispatch(updateAuthUser({ ...authUser, photoURL: null }));
        await createActivityService(
          {
            type: "profile.photo_removed",
            entity: { type: "profile", id: null, name: null },
          },
          authUser.uid,
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error when deleting user photo.");
    }
  }
);

// update photo
export const updatePhotoThunk = createAsyncThunk<
  void,
  File,
  { state: RootState; rejectValue: string }
>(
  "userFile/updatePhoto",
  async (file, { getState, dispatch, rejectWithValue }) => {
    try {
      const { authUser } = getState().userAuth;
      if (authUser?.uid) {
        const url = await uploadFileService(
          file,
          `users/${authUser.uid}/photo`,
          file.name
        );
        await updateUserService({ uid: authUser.uid, photoURL: url }, false);
        dispatch(updateAuthUser({ ...authUser, photoURL: url }));
        await createActivityService(
          {
            type: "profile.photo_updated",
            entity: { type: "profile", id: null, name: null },
          },
          authUser.uid,
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error when update user photo.");
    }
  }
);
