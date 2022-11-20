import { createSlice } from "@reduxjs/toolkit";
import { ParsedEvent } from "../plugin/types";

const initialInfoState = () => ({
  email_address: null,
  client_id: null,
  token: null,
});

const initialRecordingState = () => ({
  inProgress: false,
  session_id: null,
  session_url: null,
  isGenerating: false,
  download_url: null,
  test_name: null,
  resetPageState: false,
  fixtures: {} as { [path: string]: any },
  events: [] as ParsedEvent[],
  aliases: {},
});

export const getInitialUserState = () => ({
  login: {
    isLoading: false,
  },
  getUser: {
    isLoading: false,
  },
  info: initialInfoState(),
  recording: initialRecordingState(),
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
      state.info = initialInfoState();
      state.recording = initialRecordingState();
    },
    logout: (state) => {
      state.info = initialInfoState();
      state.recording = initialRecordingState();
    },
    startRecording: (state) => {
      state.recording = initialRecordingState();
      state.recording.inProgress = true;
    },
    cancelRecording: (state) => {
      state.recording = initialRecordingState();
    },
    resetPageState: (state) => {
      state.recording.resetPageState = false;
    },
    saveEvent: (state, action) => {
      state.recording.events.push(action.payload);
    },
    updateAliases: (state, action) => {
      state.recording.aliases = action.payload.aliases;
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
    setDownloadUrlPending: (state) => {
      state.recording.isGenerating = true;
    },
    setDownloadUrl: (state, action) => {
      state.recording.download_url = action.payload;
      state.recording.isGenerating = false;
    },
    setDownloadUrlFailure: (state) => {
      state.recording.isGenerating = false;
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
  setDownloadUrlPending,
  setDownloadUrlFailure,
  setTestName,
  resetPageState,
  saveEvent,
  saveSessionId,
  cancelRecording,
  updateAliases,
} = userSlice.actions;
