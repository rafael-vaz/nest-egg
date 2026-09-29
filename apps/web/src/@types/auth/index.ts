import { IUser } from "../user";

type AuthOperation =
  | "login"
  | "logout"
  | "clear"
  | "createAccount"
  | "sendEmailVerification";

export interface IAuthSlice {
  auth: boolean | undefined;
  authUser: IUser | null;
  loading: Record<AuthOperation, boolean>;
  error: Record<AuthOperation, string | null>;
}
