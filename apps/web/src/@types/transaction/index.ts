import type { TransactionType } from "@nest-egg/shared-types";

import { IRecurrenceDate } from "../recurrence-date";

export type TransactionCategoryStatus =
  | "food"
  | "housing"
  | "transport"
  | "health"
  | "education"
  | "leisure"
  | "shopping"
  | "services"
  | "subscriptions"
  | "travel"
  | "debts"
  | "investment"
  | "income"
  | "gifts"
  | "taxes"
  | "pets"
  | "personalCare"
  | "technology"
  | "savings"
  | "other";

export type { TransactionType };

export interface ITransactionOccurrenceLog {
  id: string;
  date: Date | string;
  value: number;
  type: TransactionType;
}

export interface ITransaction {
  id: string;
  name: string;
  value: number;
  type: TransactionType;
  date: Date | string | null;
  category: TransactionCategoryStatus;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  recurrence: IRecurrenceDate | null;
  occurrenceLog: ITransactionOccurrenceLog[] | null;
  hasRecurrence: boolean;
}

type TransactionOperation = "create" | "read" | "update" | "delete";

export interface ITransactionSlice {
  loading: Record<TransactionOperation, boolean>;
  error: Record<TransactionOperation, string | null>;
}
