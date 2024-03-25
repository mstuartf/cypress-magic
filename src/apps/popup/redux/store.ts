import { configureStore } from "@reduxjs/toolkit";
import { alias, wrapStore } from "webext-redux";
import { rootReducer } from "./reducers";
import { inject } from "../../../chrome/utils";
import { activateForTab, deactivateForTab } from "./slice";
import reload = chrome.tabs.reload;

export type RootState = ReturnType<typeof rootReducer>;

// This is executed by background script but for some reason needs to be defined here
export const middlewareAliases: { [key: string]: (action: any) => any } = {
  [activateForTab.type]: (action: ReturnType<typeof activateForTab>) => {
    inject(action.payload);
    return action;
  },
  [deactivateForTab.type]: (action: ReturnType<typeof deactivateForTab>) => {
    reload(action.payload);
    return action;
  },
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: [alias(middlewareAliases)],
});

wrapStore(store);
