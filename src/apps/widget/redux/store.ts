import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import { cacheMiddleware } from "./middleware";

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: [cacheMiddleware],
});
