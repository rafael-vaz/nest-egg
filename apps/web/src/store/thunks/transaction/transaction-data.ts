import { createAsyncThunk } from "@reduxjs/toolkit";

import { ITransaction } from "../../../@types/transaction";
import createActivityService from "../../../services/activity/create-activity";
import createTransactionService from "../../../services/transaction/create-transaction";
import deleteTransactionService from "../../../services/transaction/delete-transaction";
import readAllTransactionsService from "../../../services/transaction/read-all-transactions";
import readTransactionService from "../../../services/transaction/read-transaction";
import updateTransactionService from "../../../services/transaction/update-transaction";
import { buildChanges } from "../../../utils/activity/build-changes";

const TRACKED_TRANSACTION_KEYS: (keyof ITransaction)[] = [
  "value",
  "category",
  "description",
  "recurrence",
];

// create transaction
export const createTransactionThunk = createAsyncThunk<
  void,
  { transaction: ITransaction; userId: string },
  { rejectValue: string }
>("transactionData/createTransaction", async (data, { rejectWithValue }) => {
  try {
    await createTransactionService(data.transaction, data.userId);
    await createActivityService(
      {
        type: "transaction.created",
        entity: {
          type: "transaction",
          id: data.transaction.id,
          name: data.transaction.name,
        },
      },
      data.userId,
    );
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
    // Leitura só serve para o registro de atividade — se ela falhar, a
    // atualização real precisa continuar mesmo assim, só sem log.
    let before: ITransaction | null = null;
    try {
      before = await readTransactionService(data.transaction.id, data.userId);
    } catch {
      before = null;
    }

    await updateTransactionService(
      data.transaction,
      data.userId,
      data.hasAlert ?? false,
    );

    if (before) {
      const changes = buildChanges(
        before as unknown as Record<string, unknown>,
        data.transaction as unknown as Record<string, unknown>,
        TRACKED_TRANSACTION_KEYS,
      );

      if (changes) {
        await createActivityService(
          {
            type: "transaction.updated",
            entity: {
              type: "transaction",
              id: data.transaction.id,
              name: data.transaction.name ?? before.name,
            },
            changes,
          },
          data.userId,
        );
      }
    }
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
    // Leitura só serve para capturar o nome no registro de atividade — se
    // ela falhar, a exclusão real precisa continuar mesmo assim.
    let transactionName: string | null = null;
    try {
      const transaction = await readTransactionService(
        data.transactionId,
        data.userId,
      );
      transactionName = transaction?.name ?? null;
    } catch {
      transactionName = null;
    }

    await deleteTransactionService(data.transactionId, data.userId);

    await createActivityService(
      {
        type: "transaction.deleted",
        entity: {
          type: "transaction",
          id: data.transactionId,
          name: transactionName,
        },
      },
      data.userId,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      rejectWithValue(error.message);
    }
    return rejectWithValue("Error unknown when trying to delete transaction.");
  }
});
