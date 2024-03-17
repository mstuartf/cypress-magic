import { RootState } from "./store";

export const selectCacheLoaded = (state: RootState) => state.root.cacheLoaded;
export const selectTabId = (state: RootState) => state.root.tabId;
