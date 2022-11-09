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
      session_id: null,
      session_url: null,
    },
    cacheLoaded: false,
  },
  reducers: {
    loadCache: () => {},
    restoreCache: (state, action) => {
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
      state.recording = {
        inProgress: false,
        session_id: null,
        session_url: null,
      };
    },
    startRecording: (state) => {
      state.recording.inProgress = true;
      state.recording.session_id = null;
    },
    stopRecording: (state) => {
      state.recording.inProgress = false;
    },
    saveSession: (state, action) => {
      state.recording.session_id = action.payload.session_id;
    },
    getSessionUrl: (state, action) => {
      state.recording.session_url = action.payload.session_url;
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
  saveSession,
  getSessionUrl,
} = userSlice.actions;
