import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BaseState {
  activeTabId?: number;
  injectOnTabs: number[];
  cacheLoaded: boolean;
  userInfo?: chrome.identity.UserInfo;
}

export const initialBaseState: BaseState = {
  activeTabId: undefined,
  injectOnTabs: [],
  cacheLoaded: false,
};

export const baseSlice = createSlice({
  name: "base",
  initialState: initialBaseState,
  reducers: {
    restoreBaseCache: (
      state,
      { payload: { injectOnTabs } }: PayloadAction<BaseState>
    ) => {
      state.cacheLoaded = true;
      state.injectOnTabs = [...injectOnTabs];
    },
    saveUserInfo: (
      state,
      { payload }: PayloadAction<BaseState["userInfo"]>
    ) => {
      state.userInfo = payload;
    },
    refreshUserInfo: (state) => {
      state.userInfo = undefined;
    },
    activateForTab: (state, { payload: tabId }: PayloadAction<number>) => {
      state.injectOnTabs = [...state.injectOnTabs, tabId];
    },
    deactivateForTab: (state, { payload: tabId }: PayloadAction<number>) => {
      state.injectOnTabs = [...state.injectOnTabs].filter((id) => id !== tabId);
    },
    setActiveTabId: (state, { payload: tabId }: PayloadAction<number>) => {
      state.activeTabId = tabId;
    },
    removeClosedTabId: (state, { payload: tabId }: PayloadAction<number>) => {
      state.injectOnTabs = [...state.injectOnTabs].filter((id) => id !== tabId);
    },
  },
});

export const {
  restoreBaseCache,
  activateForTab,
  deactivateForTab,
  setActiveTabId,
  removeClosedTabId,
  saveUserInfo,
  refreshUserInfo,
} = baseSlice.actions;
