import { PopupState } from "./store";

export const selectCacheLoaded = (state: PopupState) => state.base.cacheLoaded;
export const selectActiveTabId = (state: PopupState) => state.base.activeTabId;
export const selectInjectForTab = (tabId: number) => (state: PopupState) =>
  state.base.injectOnTabs.includes(tabId);
