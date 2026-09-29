import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IConfirmationModal, IModalEntity } from "../../../@types/modal";

const initialState: IConfirmationModal = {
  id: null,
  entity: null,
  isOpen: false,
  isLoading: false,
};

const confirmationModalSlice = createSlice({
  name: "confirmationModal",
  initialState: initialState,
  reducers: {
    openConfirmationModalState(
      state,
      action: PayloadAction<{ id: string; entity?: IModalEntity | null }>
    ) {
      state.isOpen = true;
      state.id = action.payload.id;
      state.entity = action.payload.entity ?? null;
    },
    closeConfirmationModalState(state) {
      state.isLoading = false;
      state.isOpen = false;
      state.entity = null;
      state.id = null;
    },
    setConfirmationModalLoadingState(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  openConfirmationModalState,
  closeConfirmationModalState,
  setConfirmationModalLoadingState,
} = confirmationModalSlice.actions;
export default confirmationModalSlice.reducer;
