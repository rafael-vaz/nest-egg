import { createSlice } from "@reduxjs/toolkit";

import { ICollectionSlice } from "../../../@types/collection";
import {
  createCollectionThunk,
  deleteCollectionThunk,
  readAllCollectionsThunk,
  readCollectionThunk,
  updateCollectionThunk,
} from "../../thunks/collection/collection-data";

const initialState: ICollectionSlice = {
  loading: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  error: {
    create: null,
    read: null,
    update: null,
    delete: null,
  },
};

const collectionDataSlice = createSlice({
  name: "collectionData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // create collection
    builder.addCase(createCollectionThunk.pending, (state) => {
      state.loading.create = true;
      state.error.create = null;
    });
    builder.addCase(createCollectionThunk.fulfilled, (state) => {
      state.loading.create = false;
    });
    builder.addCase(createCollectionThunk.rejected, (state, action) => {
      state.error.create = action.payload ?? "Error creating collection.";
    });
    // read collection
    builder.addCase(readCollectionThunk.pending, (state) => {
      state.loading.read = true;
      state.error.read = null;
    });
    builder.addCase(readCollectionThunk.fulfilled, (state) => {
      state.loading.read = false;
    });
    builder.addCase(readCollectionThunk.rejected, (state, action) => {
      state.loading.read = false;
      state.error.read = action.payload ?? "Error reading collection.";
    });
    // read all collections
    builder.addCase(readAllCollectionsThunk.pending, (state) => {
      state.loading.read = true;
      state.error.read = null;
    });
    builder.addCase(readAllCollectionsThunk.fulfilled, (state) => {
      state.loading.read = false;
    });
    builder.addCase(readAllCollectionsThunk.rejected, (state, action) => {
      state.loading.read = false;
      state.error.read = action.payload ?? "Error reading collections.";
    });
    // update collection
    builder.addCase(updateCollectionThunk.pending, (state) => {
      state.loading.update = true;
      state.error.update = null;
    });
    builder.addCase(updateCollectionThunk.fulfilled, (state) => {
      state.loading.update = false;
    });
    builder.addCase(updateCollectionThunk.rejected, (state, action) => {
      state.loading.update = false;
      state.error.update = action.payload ?? "Error update collection.";
    });
    // delete collection
    builder.addCase(deleteCollectionThunk.pending, (state) => {
      state.loading.delete = true;
      state.error.delete = null;
    });
    builder.addCase(deleteCollectionThunk.fulfilled, (state) => {
      state.loading.delete = false;
    });
    builder.addCase(deleteCollectionThunk.rejected, (state, action) => {
      state.loading.delete = false;
      state.error.delete = action.payload ?? "Error when deleting collection.";
    });
  },
});

export default collectionDataSlice.reducer;
