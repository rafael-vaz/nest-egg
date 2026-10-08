export type ActivityType =
  | "transaction.created"
  | "transaction.updated"
  | "transaction.deleted"
  | "goal.created"
  | "goal.updated"
  | "goal.deleted"
  | "collection.created"
  | "collection.updated"
  | "collection.deleted"
  | "wallet.updated"
  | "profile.updated"
  | "profile.photo_updated"
  | "profile.photo_removed";

export type ActivityEntityType =
  | "transaction"
  | "goal"
  | "collection"
  | "profile"
  | "wallet";

export interface IActivityEntity {
  type: ActivityEntityType;
  id: string | null;
  name: string | null;
}

export type ActivityChanges = Record<string, { from: unknown; to: unknown }>;

export interface IActivity {
  id: string;
  type: ActivityType;
  createdAt: string;
  entity: IActivityEntity;
  changes?: ActivityChanges;
}

export interface IActivitySlice {
  loading: boolean;
  error: string | null;
}
