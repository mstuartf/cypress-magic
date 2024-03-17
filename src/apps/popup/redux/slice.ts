import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  tabId?: number;
  hasBeenInjected: boolean;
  cacheLoaded: boolean;
}

const initialState: State = {
  tabId: undefined,
  hasBeenInjected: false,
  cacheLoaded: false,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    restoreCache: (state, action) => {
      state.cacheLoaded = true;
    },
    activateForTab: (state, action: PayloadAction<number>) => {
      state.tabId = action.payload;
      state.hasBeenInjected = false;
    },
    deactivateForTab: (state) => {
      state.tabId = undefined;
      state.hasBeenInjected = false;
    },
    setHasBeenInjected: (state) => {
      state.hasBeenInjected = true;
    },
  },
});

export const {
  restoreCache,
  activateForTab,
  deactivateForTab,
  setHasBeenInjected,
} = rootSlice.actions;
