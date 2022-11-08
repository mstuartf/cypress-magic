import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    login: {
      isLoading: false,
    },
    info: {
      email_address: null,
      client_id: null,
      token: null,
    },
    recording: {
      inProgress: false,
      sessionId: null,
    },
    cacheLoaded: false,
  },
  reducers: {
    loadCache: () => {
      console.log("loadCache");
    },
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
      state.info.email_address = action.payload.email_address;
      state.info.client_id = action.payload.client_id;
    },
    logout: (state) => {
      state.info = {
        email_address: null,
        client_id: null,
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
  loadCache,
} = userSlice.actions;
