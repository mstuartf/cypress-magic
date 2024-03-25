import { RootState } from "./store";

export const selectCacheLoaded = (state: RootState) => state.root.cacheLoaded;
export const selectActiveTabId = (state: RootState) => state.root.activeTabId;
export const selectInjectForTab = (tabId: number) => (state: RootState) =>
  state.root.injectOnTabs.includes(tabId);
