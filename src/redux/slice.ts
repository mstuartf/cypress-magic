import { createSlice } from "@reduxjs/toolkit";

export const getInitialUserState = () => ({
  login: {
    isLoading: false,
  },
  getUser: {
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
    triggerInjectScript: false,
    lastAborted: false,
    fixtures: {} as { [path: string]: any },
  },
  cacheLoaded: false,
});

export const userSlice = createSlice({
  name: "user",
  initialState: getInitialUserState(),
  reducers: {
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
    },
    getUserPending: (state) => {
      state.getUser.isLoading = true;
    },
    getUserSuccess: (state, action) => {
      state.getUser.isLoading = false;
      state.info.email_address = action.payload.email_address;
      state.info.client_id = action.payload.client_id;
    },
    getUserFailure: (state) => {
      state.getUser.isLoading = false;
      state.info = {
        email_address: null,
        client_id: null,
        token: null,
      };
      state.recording = {
        inProgress: false,
        session_id: null,
        session_url: null,
        triggerInjectScript: false,
        lastAborted: false,
        fixtures: {},
      };
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
        triggerInjectScript: false,
        lastAborted: false,
        fixtures: {},
      };
    },
    startRecording: (state) => {
      state.recording = {
        inProgress: true,
        session_id: null,
        session_url: null,
        triggerInjectScript: true,
        lastAborted: false,
        fixtures: {},
      };
    },
    saveFixture: (state, action) => {
      state.recording.fixtures[action.payload.name] = action.payload.value;
      console.log(Object.keys(state.recording.fixtures));
    },
    injectScriptTriggered: (state) => {
      state.recording.triggerInjectScript = false;
    },
    cancelRecording: (state) => {
      state.recording.inProgress = false;
      state.recording.lastAborted = true;
    },
    stopRecording: (state) => {
      state.recording.inProgress = false;
    },
    saveSession: (state, action) => {
      state.recording.session_id = action.payload.session_id;
    },
  },
});

export const {
  loginPending,
  loginSuccess,
  restoreCache,
  logout,
  stopRecording,
  saveSession,
  startRecording,
  cancelRecording,
  injectScriptTriggered,
  getUserPending,
  getUserSuccess,
  getUserFailure,
  saveFixture,
} = userSlice.actions;
