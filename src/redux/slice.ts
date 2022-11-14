import { createSlice } from "@reduxjs/toolkit";
import { ParsedEvent } from "../plugin/types";

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
    download_url: null,
    test_name: null,
    resetPageState: false,
    fixtures: {} as { [path: string]: any },
    events: [] as ParsedEvent[],
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
        download_url: null,
        test_name: null,
        resetPageState: false,
        fixtures: {},
        events: [],
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
        download_url: null,
        test_name: null,
        resetPageState: false,
        fixtures: {},
        events: [],
      };
    },
    startRecording: (state) => {
      state.recording = {
        inProgress: true,
        session_id: null,
        session_url: null,
        download_url: null,
        test_name: null,
        resetPageState: true,
        fixtures: {},
        events: [],
      };
    },
    resetPageState: (state) => {
      state.recording.resetPageState = false;
    },
    saveEvent: (state, action) => {
      state.recording.events.push(action.payload);
    },
    saveFixture: (state, action) => {
      state.recording.fixtures[action.payload.name] = action.payload.value;
    },
    saveSessionId: (state, action) => {
      state.recording.session_id = action.payload;
    },
    stopRecording: (state) => {
      state.recording.inProgress = false;
    },
    setDownloadUrl: (state, action) => {
      state.recording.download_url = action.payload;
    },
    setTestName: (state, action) => {
      state.recording.test_name = action.payload;
    },
  },
});

export const {
  loginPending,
  loginSuccess,
  restoreCache,
  logout,
  stopRecording,
  startRecording,
  getUserPending,
  getUserSuccess,
  getUserFailure,
  saveFixture,
  setDownloadUrl,
  setTestName,
  resetPageState,
  saveEvent,
  saveSessionId,
} = userSlice.actions;
