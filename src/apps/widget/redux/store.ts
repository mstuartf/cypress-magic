import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import {
  assertionMiddleware,
  cacheMiddleware,
  filterClicksMiddleware,
  navMiddleware,
  throttlerMiddleware,
  urlMatcherMiddleware,
  widgetClickMiddleware,
} from "./middleware";

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    cacheMiddleware,
    assertionMiddleware,
    throttlerMiddleware,
    navMiddleware,
    widgetClickMiddleware,
    urlMatcherMiddleware,
    filterClicksMiddleware,
  ],
});
