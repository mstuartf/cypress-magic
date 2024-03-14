import { createSlice } from "@reduxjs/toolkit";

interface State {
  isActive: boolean;
  cacheLoaded: boolean;
}

const initialState: State = {
  isActive: false,
  cacheLoaded: false,
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
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
