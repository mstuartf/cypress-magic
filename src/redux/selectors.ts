import { RootState } from "./store";

export const selectToken = (state: RootState) => state.user.info.token;
export const selectSessionId = (state: RootState) =>
  state.user.recording.session_id;
export const selectTestName = (state: RootState) =>
  state.user.recording.test_name;
export const selectDownloadUrl = (state: RootState) =>
  state.user.recording.download_url;
export const selectCacheLoaded = (state: RootState) => state.user.cacheLoaded;
export const selectEmailAddress = (state: RootState) =>
  state.user.info.email_address;
export const selectRecordingInProgress = (state: RootState) =>
  state.user.recording.inProgress;
export const selectFixtures = (state: RootState) =>
  state.user.recording.fixtures;
export const selectResetPageState = (state: RootState) =>
  state.user.recording.resetPageState;
