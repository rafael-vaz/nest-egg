import { ICollectionId } from "../collection";

export type GoalStatus =
  | "active"
  | "waiting"
  | "completed"
  | "confirm"
  | "unintended";

export type IGoalId = { id: string };

export interface IGoal {
  id: string;
  name: string;
  value: number;
  status: GoalStatus;
  collection: ICollectionId | null;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

type GoalOperation = "create" | "read" | "update" | "delete";

export interface IGoalSlice {
  loading: Record<GoalOperation, boolean>;
  error: Record<GoalOperation, string | null>;
}
