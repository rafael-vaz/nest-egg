import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import middlewares from "./root-middleware";
import reducer from "./root-reducer";

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
