export type DemoGoalStatus =
  | "active"
  | "waiting"
  | "completed"
  | "confirm"
  | "unintended";

export type DemoTransactionType = "credit" | "debt";

export interface DemoCollection {
  id: string;
  name: string;
  goals: { id: string }[] | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DemoGoal {
  id: string;
  name: string;
  value: number;
  status: DemoGoalStatus;
  collection: { id: string } | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DemoOccurrenceLogEntry {
  id: string;
  date: string;
  value: number;
  type: DemoTransactionType;
}

export interface DemoRecurrence {
  startDate: string;
  endDate: string | null;
  frequency: {
    rate: number;
    category: "month";
    weekDays: null;
    order: null;
  };
}

export interface DemoTransaction {
  id: string;
  name: string;
  value: number;
  type: DemoTransactionType;
  date: string;
  category: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  recurrence: DemoRecurrence | null;
  occurrenceLog: DemoOccurrenceLogEntry[] | null;
  hasRecurrence: boolean;
}

export interface DemoDataset {
  walletBaselineCentavos: number;
  collections: DemoCollection[];
  goals: DemoGoal[];
  transactions: DemoTransaction[];
}
