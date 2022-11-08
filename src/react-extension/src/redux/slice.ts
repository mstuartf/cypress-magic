import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    login: {
      isLoading: false,
    },
    info: {
      email_address: null,
      token: null,
    },
    recording: {
      inProgress: false,
      sessionId: null,
    },
    cacheLoaded: false,
  },
  reducers: {
    restoreCache: (state, action) => {
      console.log("restoreCache", action.payload);
      if (action.payload) {
        state.login = { ...action.payload.login };
        state.info = { ...action.payload.info };
        state.recording = { ...action.payload.recording };
      }
      state.cacheLoaded = true;
    },
    loginPending: (state) => {
      state.login.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.login.isLoading = false;
      state.info.token = action.payload.token;
    },
    logout: (state) => {
      state.info = {
        email_address: null,
        token: null,
      };
    },
    startRecording: (state) => {
      state.recording.inProgress = true;
    },
    stopRecording: (state) => {
      state.recording.inProgress = false;
    },
  },
});

export const {
  loginPending,
  loginSuccess,
  restoreCache,
  logout,
  startRecording,
  stopRecording,
} = userSlice.actions;
