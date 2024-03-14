import * as redux from "redux";
import { setBaseUrl, setRecordingInProgress } from "./slice";
import { setCache } from "../cache";

export const cacheMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type == setRecordingInProgress.type) {
      setCache("recordingInProgress", action.payload);
    }
    if (action.type == setBaseUrl.type) {
      setCache("baseUrl", action.payload);
    }
    next(action);
  };
