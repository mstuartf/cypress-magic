import { RootState } from "./store";

export const selectIsLoggedIn = (state: RootState) => !!state.user.info.token;
export const selectSessionId = (state: RootState) =>
  state.user.recording.session_id;
export const selectSessionUrl = (state: RootState) =>
  state.user.recording.session_url;
export const selectCacheLoaded = (state: RootState) => state.user.cacheLoaded;
export const selectEmailAddress = (state: RootState) =>
  state.user.info.email_address;
export const selectRecordingInProgress = (state: RootState) =>
  state.user.recording.inProgress;
