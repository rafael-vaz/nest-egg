import { IGoalId } from "../goal";

export type ICollectionId = { id: string };

export interface ICollection {
  id: string;
  name: string;
  goals: IGoalId[] | null;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

type CollectionOperation = "create" | "read" | "update" | "delete";

export interface ICollectionSlice {
  loading: Record<CollectionOperation, boolean>;
  error: Record<CollectionOperation, string | null>;
}
