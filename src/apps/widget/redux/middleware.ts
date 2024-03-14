import * as redux from "redux";
import { setRecordingInProgress } from "./slice";
import { setCache } from "../cache";

export const cacheMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type == setRecordingInProgress.type) {
      setCache("recordingInProgress", action.payload);
    }
    next(action);
  };
