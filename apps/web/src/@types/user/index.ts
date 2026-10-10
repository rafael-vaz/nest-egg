import { ICollection } from "../collection";
import { IGoal } from "../goal";
import { ITransaction } from "../transaction";

export interface IUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  coverURL: string;
  emailVerified: boolean;
  dateOfBirth: Date | string;
  wallet: number;
  walletUpdatedAt?: string;
  hasSeenTutorial?: boolean;
}

export interface IUserFinancesSlice {
  goals: IGoal[];
  collections: ICollection[];
  transactions: ITransaction[];
  loading: boolean;
}

type UserOperation = "create" | "read" | "update" | "delete";

export interface IUserSlice {
  loading: Record<UserOperation, boolean>;
  error: Record<UserOperation, string | null>;
}

export type UserFileOperation = "update" | "delete";
export type UserFileCategory = "photo";

type OperationStatus<T> = Record<UserFileOperation, T>;

export interface IUserFileSlice {
  loading: Record<UserFileCategory, OperationStatus<boolean>>;
  error: Record<UserFileCategory, OperationStatus<string | null>>;
}
