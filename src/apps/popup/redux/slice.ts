import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BaseState {
  activeTabId?: number;
  injectOnTabs: number[];
  cacheLoaded: boolean;
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
    activateForTab: (state, { payload: tabId }: PayloadAction<number>) => {
      state.injectOnTabs = [...state.injectOnTabs, tabId];
    },
    deactivateForTab: (state, { payload: tabId }: PayloadAction<number>) => {
      state.injectOnTabs = [...state.injectOnTabs].filter((id) => id !== tabId);
    },
    setActiveTabId: (state, { payload: tabId }: PayloadAction<number>) => {
      state.activeTabId = tabId;
    },
  },
});

export const {
  restoreBaseCache,
  activateForTab,
  deactivateForTab,
  setActiveTabId,
} = baseSlice.actions;
