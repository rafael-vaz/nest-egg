import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ICollection } from "../../../@types/collection";
import { IGoal } from "../../../@types/goal";
import { ITransaction } from "../../../@types/transaction";
import { IUserFinancesSlice } from "../../../@types/user";
import sortByKey from "../../../utils/sort-by-key";
import {
  createCollectionThunk,
  deleteCollectionThunk,
  readAllCollectionsThunk,
  updateCollectionThunk,
} from "../../thunks/collection/collection-data";
import {
  createGoalThunk,
  deleteGoalThunk,
  readAllGoalsThunk,
  updateGoalThunk,
} from "../../thunks/goal/goal-data";
import { readAllTransactionsThunk } from "../../thunks/transaction/transaction-data";

const initialState: IUserFinancesSlice = {
  collections: [],
  goals: [],
  transactions: [],
  loading: true,
};

function sortFinances(state: IUserFinancesSlice) {
  state.collections = sortByKey(state.collections, "name");
  state.goals = sortByKey(state.goals, "name");
  state.transactions = sortByKey(state.transactions, "date", true);
}

const userFinancesSlice = createSlice({
  name: "userFinances",
  initialState,
  reducers: {
    setCollections(state, action: PayloadAction<ICollection[]>) {
      state.collections = sortByKey(action.payload, "name");
    },
    setGoals(state, action: PayloadAction<IGoal[]>) {
      state.goals = sortByKey(action.payload, "name");
    },
    setTransactions(state, action: PayloadAction<ITransaction[]>) {
      state.transactions = sortByKey(action.payload, "date", true);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateGoalLocal(
      state,
      action: PayloadAction<Partial<IGoal> & { id: string }>,
    ) {
      const index = state.goals.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = {
          ...state.goals[index],
          ...action.payload,
        };
      }
    },
    updateCollectionLocal(
      state,
      action: PayloadAction<Partial<ICollection> & { id: string }>,
    ) {
      const index = state.collections.findIndex(
        (c) => c.id === action.payload.id,
      );
      if (index !== -1) {
        state.collections[index] = {
          ...state.collections[index],
          ...action.payload,
        };
      }
    },
    updateTransactionLocal(
      state,
      action: PayloadAction<Partial<ITransaction> & { id: string }>,
    ) {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id,
      );
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    //? ---------- collections ----------
    builder
      .addCase(readAllCollectionsThunk.fulfilled, (state, action) => {
        state.collections = action.payload ?? [];
        sortFinances(state);
      })
      .addCase(createCollectionThunk.fulfilled, (state, action) => {
        state.collections.push(action.meta.arg.collection);
        sortFinances(state);
      })
      .addCase(updateCollectionThunk.fulfilled, (state, action) => {
        const { collection } = action.meta.arg;
        const index = state.collections.findIndex(
          (c) => c.id === collection.id,
        );
        if (index !== -1)
          state.collections[index] = {
            ...state.collections[index],
            ...collection,
          };
        sortFinances(state);
      })
      .addCase(deleteCollectionThunk.fulfilled, (state, action) => {
        const id = action.meta.arg.collectionId;
        state.collections = state.collections.filter((c) => c.id !== id);
        sortFinances(state);
      });

    //? ---------- goals ----------
    builder
      .addCase(readAllGoalsThunk.fulfilled, (state, action) => {
        state.goals = action.payload ?? [];
        sortFinances(state);
      })
      .addCase(createGoalThunk.fulfilled, (state, action) => {
        state.goals.push(action.meta.arg.goal);
        sortFinances(state);
      })
      .addCase(updateGoalThunk.fulfilled, (state, action) => {
        const { goal } = action.meta.arg;
        const index = state.goals.findIndex((g) => g.id === goal.id);
        if (index !== -1)
          state.goals[index] = { ...state.goals[index], ...goal };
        sortFinances(state);
      })
      .addCase(deleteGoalThunk.fulfilled, (state, action) => {
        const id = action.meta.arg.goalId;
        state.goals = state.goals.filter((g) => g.id !== id);
        sortFinances(state);
      });

    //? ---------- transactions ----------
    builder.addCase(readAllTransactionsThunk.fulfilled, (state, action) => {
      state.transactions = action.payload ?? [];
      sortFinances(state);
    });
  },
});

export const {
  setCollections,
  setGoals,
  setTransactions,
  updateGoalLocal,
  updateCollectionLocal,
  updateTransactionLocal,
  setLoading,
} = userFinancesSlice.actions;
export default userFinancesSlice.reducer;
