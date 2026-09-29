import { createAsyncThunk } from "@reduxjs/toolkit";

import { ITransaction } from "../../../@types/transaction";
import createTransactionService from "../../../services/transaction/create-transaction";
import deleteTransactionService from "../../../services/transaction/delete-transaction";
import readAllTransactionsService from "../../../services/transaction/read-all-transactions";
import readTransactionService from "../../../services/transaction/read-transaction";
import updateTransactionService from "../../../services/transaction/update-transaction";

// create transaction
export const createTransactionThunk = createAsyncThunk<
  void,
  { transaction: ITransaction; userId: string },
  { rejectValue: string }
>("transactionData/createTransaction", async (data, { rejectWithValue }) => {
  try {
    await createTransactionService(data.transaction, data.userId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to create transaction.");
  }
});

// read transaction
export const readTransactionThunk = createAsyncThunk<
  ITransaction | null,
  { transactionId: string; userId: string },
  { rejectValue: string }
>("transactionData/readTransaction", async (data, { rejectWithValue }) => {
  try {
    const transaction = await readTransactionService(
      data.transactionId,
      data.userId,
    );
    return transaction;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read transaction.");
  }
});

// read all transactions
export const readAllTransactionsThunk = createAsyncThunk<
  ITransaction[] | null,
  { userId: string },
  { rejectValue: string }
>("transactionData/readAllTransactions", async (data, { rejectWithValue }) => {
  try {
    const transactions = await readAllTransactionsService(data.userId);
    return transactions;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read transactions.");
  }
});

// update transaction
export const updateTransactionThunk = createAsyncThunk<
  void,
  {
    userId: string;
    transaction: Partial<ITransaction> & { id: string };
    hasAlert?: boolean;
  },
  { rejectValue: string }
>("transactionData/updateTransaction", async (data, { rejectWithValue }) => {
  try {
    await updateTransactionService(
      data.transaction,
      data.userId,
      data.hasAlert ?? false,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to update transaction.");
  }
});

// delete transaction
export const deleteTransactionThunk = createAsyncThunk<
  void,
  { transactionId: string; userId: string },
  { rejectValue: string }
>("transactionData/deleteTransaction", async (data, { rejectWithValue }) => {
  try {
    await deleteTransactionService(data.transactionId, data.userId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      rejectWithValue(error.message);
    }
    return rejectWithValue("Error unknown when trying to delete transaction.");
  }
});
