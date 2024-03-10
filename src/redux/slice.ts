import { createSlice } from "@reduxjs/toolkit";

export const rootSlice = createSlice({
  name: "root",
  initialState: {
    isActive: false,
    cacheLoaded: false,
  },
  reducers: {
    restoreCache: (state, action) => {
      if (action.payload) {
        state.isActive = { ...action.payload.isActive };
      }
      state.cacheLoaded = true;
    },
    startRecording: (state) => {
      state.isActive = true;
    },
    stopRecording: (state) => {
      state.isActive = false;
    },
  },
});

export const { restoreCache, stopRecording, startRecording } =
  rootSlice.actions;
