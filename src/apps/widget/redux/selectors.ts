import { RootState } from "./store";

export const selectEvents = (state: RootState) => state.root.events;
export const selectRecordingInProgress = (state: RootState) =>
  state.root.recordingInProgress;
export const selectHasRefreshed = (state: RootState) => state.root.hasRefreshed;
export const selectBaseUrl = (state: RootState) => state.root.baseUrl;
export const selectDisplayEvents = (state: RootState) =>
  selectEvents(state).slice(-3);
