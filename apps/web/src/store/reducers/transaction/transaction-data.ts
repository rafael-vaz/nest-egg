import { createSlice } from "@reduxjs/toolkit";

import { ITransactionSlice } from "../../../@types/transaction";
import {
  createTransactionThunk,
  deleteTransactionThunk,
  readAllTransactionsThunk,
  readTransactionThunk,
  updateTransactionThunk,
} from "../../thunks/transaction/transaction-data";

const initialState: ITransactionSlice = {
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

const transactionDataSlice = createSlice({
  name: "transactionData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // create transaction
    builder.addCase(createTransactionThunk.pending, (state) => {
      state.loading.create = true;
      state.error.create = null;
    });
    builder.addCase(createTransactionThunk.fulfilled, (state) => {
      state.loading.create = false;
    });
    builder.addCase(createTransactionThunk.rejected, (state, action) => {
      state.error.create = action.payload ?? "Error creating transaction.";
    });
    // read transaction
    builder.addCase(readTransactionThunk.pending, (state) => {
      state.loading.read = true;
      state.error.read = null;
    });
    builder.addCase(readTransactionThunk.fulfilled, (state) => {
      state.loading.read = false;
    });
    builder.addCase(readTransactionThunk.rejected, (state, action) => {
      state.loading.read = false;
      state.error.read = action.payload ?? "Error reading transaction.";
    });
    // read all transactions
    builder.addCase(readAllTransactionsThunk.pending, (state) => {
      state.loading.read = true;
      state.error.read = null;
    });
    builder.addCase(readAllTransactionsThunk.fulfilled, (state) => {
      state.loading.read = false;
    });
    builder.addCase(readAllTransactionsThunk.rejected, (state, action) => {
      state.loading.read = false;
      state.error.read = action.payload ?? "Error reading transactions.";
    });
    // update transaction
    builder.addCase(updateTransactionThunk.pending, (state) => {
      state.loading.update = true;
      state.error.update = null;
    });
    builder.addCase(updateTransactionThunk.fulfilled, (state) => {
      state.loading.update = false;
    });
    builder.addCase(updateTransactionThunk.rejected, (state, action) => {
      state.loading.update = false;
      state.error.update = action.payload ?? "Error update transaction.";
    });
    // delete transaction
    builder.addCase(deleteTransactionThunk.pending, (state) => {
      state.loading.delete = true;
      state.error.delete = null;
    });
    builder.addCase(deleteTransactionThunk.fulfilled, (state) => {
      state.loading.delete = false;
    });
    builder.addCase(deleteTransactionThunk.rejected, (state, action) => {
      state.loading.delete = false;
      state.error.delete = action.payload ?? "Error when deleting transaction.";
    });
  },
});

export default transactionDataSlice.reducer;
