import * as redux from "redux";
import { setRecordingInProgress } from "./slice";

export const cacheMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type == setRecordingInProgress.type) {
      localStorage.setItem("__seasmoke__", `${action.payload}`.toLowerCase());
    }
    next(action);
  };
