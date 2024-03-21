import { configureStore } from "@reduxjs/toolkit";
import { widgetRootReducer } from "./reducers";
import {
  assertionMiddleware,
  cacheMiddleware,
  filterClicksMiddleware,
  navMiddleware,
  recordingInProgressMiddleware,
  testIsRunningMiddleware,
  throttlerMiddleware,
  urlMatcherMiddleware,
  widgetClickMiddleware,
} from "./middleware";
import * as redux from "redux";

export type WidgetRootState = ReturnType<typeof widgetRootReducer>;

export const store = configureStore({
  reducer: widgetRootReducer,
  middleware: [
    recordingInProgressMiddleware,
    cacheMiddleware,
    assertionMiddleware,
    throttlerMiddleware,
    navMiddleware,
    widgetClickMiddleware,
    urlMatcherMiddleware,
    filterClicksMiddleware,
    testIsRunningMiddleware,
  ],
});

export type WidgetMiddleware = redux.Middleware<{}, WidgetRootState>;
