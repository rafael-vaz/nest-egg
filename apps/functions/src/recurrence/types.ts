// Defined locally, not imported from @nest-egg/shared-types: Cloud
// Functions' deploy environment runs `npm install` with no npm-workspace
// context, so it cannot resolve a workspace-internal package under any
// dependency type (confirmed by two failed production deploys) — see
// docs/decisions/0003-shared-types-scope.md.
export type FrequencyCategory = "day" | "week" | "month" | "year";
export type FrequencyOrder = "day-number" | "week-order" | null;
export type TransactionType = "credit" | "debt";

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
