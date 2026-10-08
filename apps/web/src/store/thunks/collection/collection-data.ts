import { createAsyncThunk } from "@reduxjs/toolkit";

import { ICollection } from "../../../@types/collection";
import createActivityService from "../../../services/activity/create-activity";
import createCollectionService from "../../../services/collection/create-collection";
import deleteCollectionService from "../../../services/collection/delete-collection";
import readAllCollectionsService from "../../../services/collection/read-all-collections";
import readCollectionService from "../../../services/collection/read-collection";
import updateCollectionService from "../../../services/collection/update-collection";
import updateGoalService from "../../../services/goal/update-goal";
import { buildChanges } from "../../../utils/activity/build-changes";
import { updateGoalLocal } from "../../reducers/user/user-finances";

const TRACKED_COLLECTION_KEYS: (keyof ICollection)[] = ["name"];

// create collection
export const createCollectionThunk = createAsyncThunk<
  void,
  { collection: ICollection; userId: string },
  { rejectValue: string }
>(
  "collectionData/createCollection",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      await createCollectionService(data.collection, data.userId);
      await createActivityService(
        {
          type: "collection.created",
          entity: {
            type: "collection",
            id: data.collection.id,
            name: data.collection.name,
          },
        },
        data.userId,
      );
      const promises =
        data.collection.goals?.map((goal) => {
          const updatedGoal = {
            id: goal.id,
            collection: { id: data.collection.id },
          };
          dispatch(updateGoalLocal(updatedGoal));
          return updateGoalService(updatedGoal, data.userId, false);
        }) ?? [];
      await Promise.all(promises);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error when trying to create collection.");
    }
  },
);

// read collection
export const readCollectionThunk = createAsyncThunk<
  ICollection | null,
  { collectionId: string; userId: string },
  { rejectValue: string }
>("collectionData/readCollection", async (data, { rejectWithValue }) => {
  try {
    const collection = await readCollectionService(
      data.collectionId,
      data.userId,
    );
    return collection;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read collection.");
  }
});

// read all collections
export const readAllCollectionsThunk = createAsyncThunk<
  ICollection[] | null,
  { userId: string },
  { rejectValue: string }
>("collectionData/readAllCollections", async (data, { rejectWithValue }) => {
  try {
    const collections = await readAllCollectionsService(data.userId);
    return collections;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read collections.");
  }
});

// update collection
export const updateCollectionThunk = createAsyncThunk<
  void,
  {
    userId: string;
    collection: Partial<ICollection> & { id: string };
    hasAlert?: boolean;
  },
  { rejectValue: string }
>(
  "collectionData/updateCollection",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const currentCollection = await readCollectionService(
        data.collection.id,
        data.userId,
      );
      const removedGoals = currentCollection!.goals?.filter(
        (oldGoal) =>
          !data.collection?.goals?.some((newGoal) => newGoal.id === oldGoal.id),
      );
      const addedGoals = data.collection?.goals?.filter(
        (newGoal) =>
          !currentCollection!.goals?.some(
            (oldGoal) => oldGoal.id === newGoal.id,
          ),
      );

      const removePromises =
        removedGoals?.map((goal) => {
          const updatedGoal = { id: goal.id, collection: null };
          dispatch(updateGoalLocal(updatedGoal));
          return updateGoalService(updatedGoal, data.userId, false);
        }) ?? [];

      const addPromises =
        addedGoals?.map((goal) => {
          const updatedGoal = {
            id: goal.id,
            collection: { id: currentCollection!.id },
          };
          dispatch(updateGoalLocal(updatedGoal));
          return updateGoalService(updatedGoal, data.userId, false);
        }) ?? [];

      await Promise.all(removePromises);
      await Promise.all(addPromises);

      await updateCollectionService(
        data.collection,
        data.userId,
        data.hasAlert ?? false,
      );

      const changes = buildChanges(
        currentCollection as unknown as Record<string, unknown>,
        data.collection as unknown as Record<string, unknown>,
        TRACKED_COLLECTION_KEYS,
      );

      if (changes) {
        await createActivityService(
          {
            type: "collection.updated",
            entity: {
              type: "collection",
              id: data.collection.id,
              name: data.collection.name ?? currentCollection!.name,
            },
            changes,
          },
          data.userId,
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error when trying to update collection.");
    }
  },
);

// delete collection
export const deleteCollectionThunk = createAsyncThunk<
  void,
  { collectionId: string; userId: string },
  { rejectValue: string }
>(
  "collectionData/deleteCollection",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const collection = await readCollectionService(
        data.collectionId,
        data.userId,
      );
      if (collection?.goals) {
        const promises =
          collection.goals.map((goal) => {
            const updatedGoal = { id: goal.id, collection: null };
            dispatch(updateGoalLocal(updatedGoal));
            return updateGoalService(updatedGoal, data.userId, false);
          }) ?? [];
        await Promise.all(promises);
      }
      await deleteCollectionService(data.collectionId, data.userId);

      await createActivityService(
        {
          type: "collection.deleted",
          entity: {
            type: "collection",
            id: data.collectionId,
            name: collection?.name ?? null,
          },
        },
        data.userId,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        rejectWithValue(error.message);
      }
      return rejectWithValue("Error unknown when trying to delete collection.");
    }
  },
);
