import type {
  FrequencyCategory,
  FrequencyOrder,
  TransactionType,
} from "@nest-egg/shared-types";

export type {FrequencyCategory, FrequencyOrder, TransactionType};

export interface IFrequency {
  rate: number;
  category: FrequencyCategory;
  weekDays: number[] | null;
  order: FrequencyOrder;
}

export interface IRecurrenceDate {
  startDate: string;
  endDate: string | null;
  frequency: IFrequency | null;
}

export interface ITransactionOccurrenceLog {
  id: string;
  date: string;
  value: number;
  type: TransactionType;
}

export interface ITransaction {
  id: string;
  date: string | null;
  value: number;
  type: TransactionType;
  recurrence: IRecurrenceDate | null;
  occurrenceLog: ITransactionOccurrenceLog[] | null;
}
