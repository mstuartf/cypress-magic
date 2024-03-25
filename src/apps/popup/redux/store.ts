import { configureStore } from "@reduxjs/toolkit";
import { alias, wrapStore } from "webext-redux";
import { rootReducer } from "./reducers";
import { inject } from "../../../chrome/utils";
import { activateForTab, deactivateForTab } from "./slice";
import reload = chrome.tabs.reload;

export type PopupState = ReturnType<typeof rootReducer>;

// This is executed by background script but for some reason needs to be defined here
export const middlewareAliases: { [key: string]: (action: any) => any } = {
  [activateForTab.type]: (action: ReturnType<typeof activateForTab>) => {
    inject(action.payload);
    return action;
  },
  [deactivateForTab.type]: (action: ReturnType<typeof deactivateForTab>) => {
    setTimeout(() => {
      // reload the page in a timeout so it comes after state is updated
      reload(action.payload);
    }, 100);
    return action;
  },
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: [alias(middlewareAliases)],
});

wrapStore(store);
