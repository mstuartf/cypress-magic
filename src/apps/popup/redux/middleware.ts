import * as redux from "redux";
import { deactivateForTab, updateCacheAfterUpdate } from "./slice";

export const deactivateMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    next(action);
    // If condition avoids infinite loop
    if (!updateCacheAfterUpdate.match(action)) {
      // Tell the background script to update the cache
      store.dispatch(
        updateCacheAfterUpdate({
          state: store.getState().base,
          reload: deactivateForTab.match(action),
        })
      );
    }
  };
