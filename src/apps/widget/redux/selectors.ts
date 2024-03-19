import { WidgetRootState } from "./store";

export const selectEvents = (state: WidgetRootState) => state.recording.events;
export const selectRecordingInProgress = (state: WidgetRootState) =>
  state.recording.recordingInProgress;
export const selectHasRefreshed = (state: WidgetRootState) =>
  state.recording.hasRefreshed;
export const selectIsAddingAssertion = (state: WidgetRootState) =>
  state.recording.isAddingAssertion;
export const selectDisplayEvents = (state: WidgetRootState) =>
  selectEvents(state).slice(-3);
