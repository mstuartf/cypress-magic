import { configureStore } from "@reduxjs/toolkit";
import { wrapStore } from "webext-redux";
import { rootReducer } from "./reducers";

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

wrapStore(store);
