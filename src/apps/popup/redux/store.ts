import { configureStore } from "@reduxjs/toolkit";
import { alias, wrapStore } from "webext-redux";
import { rootReducer } from "./reducers";
import { inject, updateCache } from "../../../chrome/utils";
import { activateForTab, updateCacheAfterUpdate } from "./slice";

export type PopupState = ReturnType<typeof rootReducer>;

// This is executed by background script but for some reason needs to be defined here
export const middlewareAliases: { [key: string]: (action: any) => any } = {
  [activateForTab.type]: (action: ReturnType<typeof activateForTab>) => {
    inject(action.payload);
    return action;
  },
  [updateCacheAfterUpdate.type]: (
    action: ReturnType<typeof updateCacheAfterUpdate>
  ) => {
    const { state, reload } = action.payload;
    updateCache({ base: state }).then(() => {
      if (reload) {
        chrome.tabs.reload();
      }
    });
    return action;
  },
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: [alias(middlewareAliases)],
});

wrapStore(store);
