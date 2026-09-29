import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IModal, ModalId } from "../../../@types/modal";

const initialState: IModal = {
  id: null,
  entity: null,
  isOpen: false,
  isLoading: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    openModalState(
      state,
      action: PayloadAction<{ id: ModalId; entity?: string | null }>
    ) {
      state.isOpen = true;
      state.id = action.payload.id;
      state.entity = action.payload.entity ?? null;
    },
    closeModalState(state) {
      state.isLoading = false;
      state.isOpen = false;
      state.entity = null;
      state.id = null;
    },
    setModalLoadingState(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { openModalState, closeModalState, setModalLoadingState } =
  modalSlice.actions;
export default modalSlice.reducer;
