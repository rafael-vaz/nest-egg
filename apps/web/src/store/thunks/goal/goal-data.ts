import { createAsyncThunk } from "@reduxjs/toolkit";

import { IGoal } from "../../../@types/goal";
import readCollectionService from "../../../services/collection/read-collection";
import updateCollectionService from "../../../services/collection/update-collection";
import createGoalService from "../../../services/goal/create-goal";
import deleteGoalService from "../../../services/goal/delete-goal";
import readAllGoalsService from "../../../services/goal/read-all-goals";
import readGoalService from "../../../services/goal/read-goal";
import updateGoalService from "../../../services/goal/update-goal";
import { RootState } from "../../configure-store";
import {
  updateCollectionLocal,
  updateGoalLocal,
} from "../../reducers/user/user-finances";

// create goal
export const createGoalThunk = createAsyncThunk<
  void,
  { goal: IGoal; userId: string },
  { rejectValue: string }
>("goalData/createGoal", async (data, { dispatch, rejectWithValue }) => {
  try {
    await createGoalService(data.goal, data.userId);
    if (data.goal.collection) {
      const collection = await readCollectionService(
        data.goal.collection.id,
        data.userId,
      );
      if (collection) {
        if (!collection.goals) collection.goals = [];
        collection.goals.push({ id: data.goal.id });
        const updatedCollection = {
          id: collection.id,
          goals: collection.goals,
        };
        dispatch(updateCollectionLocal(updatedCollection));
        await updateCollectionService(updatedCollection, data.userId);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to create goal.");
  }
});

// read goal
export const readGoalThunk = createAsyncThunk<
  IGoal | null,
  { goalId: string; userId: string },
  { rejectValue: string }
>("goalData/readGoal", async (data, { rejectWithValue }) => {
  try {
    const goal = await readGoalService(data.goalId, data.userId);
    return goal;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read goal.");
  }
});

// read all goals
export const readAllGoalsThunk = createAsyncThunk<
  IGoal[] | null,
  { userId: string },
  { rejectValue: string }
>("goalData/readAllGoals", async (data, { rejectWithValue }) => {
  try {
    const goals = await readAllGoalsService(data.userId);
    return goals;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read goals.");
  }
});

// update goal
export const updateGoalThunk = createAsyncThunk<
  void,
  { userId: string; goal: Partial<IGoal> & { id: string }; hasAlert?: boolean },
  { rejectValue: string }
>(
  "goalData/updateGoal",
  async (data, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { goals } = state.userFinances;
      const activeGoal = goals?.find((goal) => goal.status === "active");
      const currentGoal = await readGoalService(data.goal.id, data.userId);
      const oldCollectionId = currentGoal?.collection?.id;
      const newCollectionId = data.goal.collection?.id;

      if (activeGoal && data.goal.status === "active") {
        const status = "waiting";
        await updateGoalService({ ...activeGoal, status }, data.userId, false);
        dispatch(updateGoalLocal({ id: activeGoal.id, status }));
      }

      await updateGoalService(data.goal, data.userId, data.hasAlert ?? false);

      if (
        oldCollectionId &&
        newCollectionId &&
        oldCollectionId !== newCollectionId
      ) {
        const newCollection = await readCollectionService(
          newCollectionId,
          data.userId,
        );
        const oldCollection = await readCollectionService(
          oldCollectionId,
          data.userId,
        );

        const oldCollectionGoals =
          oldCollection?.goals && oldCollection.goals.length > 1
            ? oldCollection.goals.filter((goal) => goal.id !== data.goal.id)
            : null;
        const newCollectionGoals =
          newCollection?.goals && newCollection.goals.length > 0
            ? [...newCollection.goals, { id: data.goal.id }]
            : [{ id: data.goal.id }];

        const updatedOldCollection = {
          id: oldCollectionId,
          goals: oldCollectionGoals,
        };
        const updatedNewCollection = {
          id: newCollectionId,
          goals: newCollectionGoals,
        };

        dispatch(updateCollectionLocal(updatedOldCollection));
        dispatch(updateCollectionLocal(updatedNewCollection));
        await updateCollectionService(updatedOldCollection, data.userId, false);
        await updateCollectionService(updatedNewCollection, data.userId, false);
      } else if (!oldCollectionId && newCollectionId) {
        const newCollection = await readCollectionService(
          newCollectionId,
          data.userId,
        );
        const newCollectionGoals =
          newCollection?.goals && newCollection.goals.length > 0
            ? [...newCollection.goals, { id: data.goal.id }]
            : [{ id: data.goal.id }];

        const updatedNewCollection = {
          id: newCollectionId,
          goals: newCollectionGoals,
        };

        dispatch(updateCollectionLocal(updatedNewCollection));
        await updateCollectionService(updatedNewCollection, data.userId);
      } else if (oldCollectionId && !newCollectionId) {
        const oldCollection = await readCollectionService(
          oldCollectionId,
          data.userId,
        );
        const oldCollectionGoals =
          oldCollection?.goals && oldCollection.goals.length > 1
            ? oldCollection?.goals?.filter((goal) => goal.id !== data.goal.id)
            : null;

        const updatedOldCollection = {
          id: oldCollectionId,
          goals: oldCollectionGoals,
        };
        dispatch(updateCollectionLocal(updatedOldCollection));
        await updateCollectionService(updatedOldCollection, data.userId, false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error when trying to update goal.");
    }
  },
);

// delete goal
export const deleteGoalThunk = createAsyncThunk<
  void,
  { goalId: string; userId: string },
  { rejectValue: string }
>("goalData/deleteGoal", async (data, { dispatch, rejectWithValue }) => {
  try {
    const goal = await readGoalService(data.goalId, data.userId);
    if (goal?.collection) {
      const collection = await readCollectionService(
        goal.collection.id,
        data.userId,
      );
      if (collection) {
        const newGoals = collection?.goals?.filter(
          (goal) => goal.id !== data.goalId,
        );
        const updatedCollection = {
          id: collection.id,
          goals: newGoals?.length ? newGoals : null,
        };
        dispatch(updateCollectionLocal(updatedCollection));
        await updateCollectionService(updatedCollection, data.userId, false);
      }
    }
    await deleteGoalService(data.goalId, data.userId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      rejectWithValue(error.message);
    }
    return rejectWithValue("Error unknown when trying to delete goal.");
  }
});
