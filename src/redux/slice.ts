import { createSlice } from "@reduxjs/toolkit";

export const rootSlice = createSlice({
  name: "root",
  initialState: {
    recording: {
      inProgress: false,
    },
    cacheLoaded: false,
  },
  reducers: {
    restoreCache: (state, action) => {
      if (action.payload) {
        state.recording = { ...action.payload.recording };
      }
      state.cacheLoaded = true;
    },
    startRecording: (state) => {
      state.recording.inProgress = true;
    },
    stopRecording: (state) => {
      state.recording.inProgress = false;
    },
  },
});

export const { restoreCache, stopRecording, startRecording } =
  rootSlice.actions;
