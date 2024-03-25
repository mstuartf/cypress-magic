import { configureStore } from "@reduxjs/toolkit";
import { alias, wrapStore } from "webext-redux";
import { rootReducer } from "./reducers";
import { inject } from "../../../chrome/utils";
import { activateForTab } from "./slice";

export type RootState = ReturnType<typeof rootReducer>;

export const middlewareAliases: { [key: string]: (action: any) => any } = {
  "root/activateForTab": (action: ReturnType<typeof activateForTab>) => {
    inject(action.payload);
    return action;
  },
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: [alias(middlewareAliases)],
});

wrapStore(store);
