import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
