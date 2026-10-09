export const modalIds = [
  "calculator",
  "profile",
  "create",
  "search",
  "new-goal",
  "update-goal",
  "new-collection",
  "update-collection",
  "new-transaction",
  "update-transaction",
  "activities",
] as const;

export const confirmationModalId = [
  "confirm-remove-user-account",
  "set-recurrence-date",
];

export type ModalId = (typeof modalIds)[number] | null;

export type ConfirmationModalId = (typeof confirmationModalId)[number] | null;

export type ModalCategory = "default" | "confirmation";

export type ModalWidth = "x-small" | "small" | "medium" | "large";

export interface IModalEntity {
  id: string;
  name: string;
}

export interface IModal {
  id: ModalId;
  entity: string | null;
  isOpen: boolean;
  isLoading: boolean;
}

export type IConfirmationModal = Omit<IModal, "id" | "entity"> & {
  id: ConfirmationModalId;
  entity: IModalEntity | null;
};
