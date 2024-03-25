import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  activeTabId?: number;
  injectOnTabs: number[];
  cacheLoaded: boolean;
}

export const initialState: State = {
  activeTabId: undefined,
  injectOnTabs: [],
  cacheLoaded: false,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    restoreCache: (
      state,
      { payload: { injectOnTabs, activeTabId } }: PayloadAction<State>
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
  restoreCache,
  activateForTab,
  deactivateForTab,
  setActiveTabId,
} = rootSlice.actions;
